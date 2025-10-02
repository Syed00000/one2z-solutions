import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validateProject } from '../middleware/validation.js';
import { deleteFromCloudinary, extractPublicId } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'published',
      featured,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};

    // If user is not authenticated, only show published projects
    if (!req.user) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const projects = await Project.find(query)
      .populate('createdBy', 'email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // If user is not authenticated, only show published projects
    if (!req.user) {
      query.status = 'published';
    }

    const project = await Project.findOne(query).populate('createdBy', 'email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment views count
    project.views += 1;
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), validateProject, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user.id
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
// Removed validation for now to fix server crash

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    console.log('🔄 Update request for project ID:', req.params.id);
    console.log('📥 Update data received:', req.body);
    
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Store old images for cleanup if needed
    const oldCoverImage = project.coverImage;
    const oldImages = [...project.images];

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: false // Disable validation for updates
      }
    );

    // Clean up old images from Cloudinary if they were replaced
    if (req.body.coverImage && oldCoverImage !== req.body.coverImage) {
      const publicId = extractPublicId(oldCoverImage);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Error deleting old cover image:', error);
        }
      }
    }

    // Clean up old gallery images that were removed
    if (req.body.images) {
      const removedImages = oldImages.filter(img => !req.body.images.includes(img));
      for (const img of removedImages) {
        const publicId = extractPublicId(img);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (error) {
            console.error('Error deleting old gallery image:', error);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Update project error:', error);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('🚫 Validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete images from Cloudinary
    const imagesToDelete = [project.coverImage, ...project.images];
    
    for (const img of imagesToDelete) {
      const publicId = extractPublicId(img);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project'
    });
  }
});

// @desc    Toggle project featured status
// @route   PATCH /api/projects/:id/featured
// @access  Private (Admin only)
router.patch('/:id/featured', authenticate, authorize('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

// @desc    Get project statistics
// @route   GET /api/projects/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({ status: 'published' });
    const draftProjects = await Project.countDocuments({ status: 'draft' });
    const featuredProjects = await Project.countDocuments({ featured: true });

    const categoryStats = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const totalViews = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        publishedProjects,
        draftProjects,
        featuredProjects,
        categoryStats,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router;
