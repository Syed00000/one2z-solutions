import express from 'express';
import Review from '../models/Review.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validateReview } from '../middleware/validation.js';

const router = express.Router();

// @desc    Create new review
// @route   POST /api/reviews
// @access  Public
router.post('/', validateReview, async (req, res) => {
  try {
    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting review'
    });
  }
});

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public (only approved reviews for non-admin users)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      rating,
      featured,
      projectId,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};

    // If user is not authenticated or not admin, only show approved reviews
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'approved';
    } else if (status) {
      query.status = status;
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (projectId) {
      query.projectId = projectId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { review: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const reviews = await Review.find(query)
      .populate('projectId', 'title')
      .populate('approvedBy', 'email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public (only approved reviews for non-admin users)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // If user is not authenticated or not admin, only show approved reviews
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'approved';
    }

    const review = await Review.findOne(query)
      .populate('projectId', 'title')
      .populate('approvedBy', 'email');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching review'
    });
  }
});

// @desc    Update review status
// @route   PATCH /api/reviews/:id/status
// @access  Private (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'disabled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;

    if (status === 'approved') {
      review.approvedAt = new Date();
      review.approvedBy = req.user.id;
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review status'
    });
  }
});

// @desc    Toggle review featured status
// @route   PATCH /api/reviews/:id/featured
// @access  Private (Admin only)
router.patch('/:id/featured', authenticate, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only approved reviews can be featured
    if (review.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved reviews can be featured'
      });
    }

    review.featured = !review.featured;
    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), validateReview, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});

// @desc    Get featured reviews
// @route   GET /api/reviews/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Get all approved reviews (not just featured ones)
    const reviews = await Review.find({
      status: 'approved'
    })
      .populate('projectId', 'title')
      .sort('-rating -createdAt')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get featured reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured reviews'
    });
  }
});

// @desc    Get review statistics
// @route   GET /api/reviews/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    const approvedReviews = await Review.countDocuments({ status: 'approved' });
    const rejectedReviews = await Review.countDocuments({ status: 'rejected' });
    const disabledReviews = await Review.countDocuments({ status: 'disabled' });
    const featuredReviews = await Review.countDocuments({ featured: true });

    // Average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingResult[0]?.avgRating || 0;

    // Rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    // Status distribution
    const statusStats = await Review.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Reviews by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyReviews = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        disabledReviews,
        featuredReviews,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingStats,
        statusStats,
        monthlyReviews
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router;
