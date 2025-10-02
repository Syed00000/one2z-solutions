import express from 'express';
import { upload, uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../config/cloudinary.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private (Admin only)
router.post('/image', authenticate, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image'
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        size: req.file.size,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading image'
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private (Admin only)
router.post('/images', authenticate, authorize('admin'), upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        resource_type: 'image'
      }).then(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        size: file.size,
        width: result.width,
        height: result.height
      }))
    );

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images'
    });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image
// @access  Private (Admin only)
router.delete('/image', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { url, publicId } = req.body;

    if (!url && !publicId) {
      return res.status(400).json({
        success: false,
        message: 'Image URL or public ID is required'
      });
    }

    let imagePublicId = publicId;
    
    // Extract public ID from URL if not provided
    if (!imagePublicId && url) {
      imagePublicId = extractPublicId(url);
    }

    if (!imagePublicId) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract public ID from URL'
      });
    }

    const result = await deleteFromCloudinary(imagePublicId);

    if (result.result === 'ok' || result.result === 'not found') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image',
        data: result
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
});

// @desc    Get upload statistics
// @route   GET /api/upload/stats
// @access  Private (Admin only)
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This is a basic implementation
    // In a real application, you might want to store upload metadata in the database
    res.status(200).json({
      success: true,
      message: 'Upload statistics',
      data: {
        totalUploads: 0,
        totalSize: 0,
        message: 'Upload statistics tracking not implemented yet'
      }
    });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upload statistics'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 10MB.'
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum 10 files allowed.'
    });
  }

  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed.'
    });
  }

  next(error);
});

export default router;
