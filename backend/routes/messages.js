import express from 'express';
import Message from '../models/Message.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateMessage } from '../middleware/validation.js';

const router = express.Router();

// @desc    Create new message (Contact form submission)
// @route   POST /api/messages
// @access  Public
router.post('/', validateMessage, async (req, res) => {
  try {
    console.log('📧 Creating message with data:', req.body);
    
    // Clean the data - remove undefined fields
    const messageData = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      ...(req.body.phone && { phone: req.body.phone })
    };
    
    console.log('📧 Cleaned message data:', messageData);
    const message = await Message.create(messageData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const messages = await Message.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
});

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if it's unread
    if (message.status === 'unread') {
      message.status = 'read';
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message'
    });
  }
});

// @desc    Update message status
// @route   PATCH /api/messages/:id/status
// @access  Private (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = status;

    if (status === 'read' && !message.readAt) {
      message.readAt = new Date();
    }

    if (status === 'replied') {
      message.repliedAt = new Date();
    }

    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message status'
    });
  }
});

// @desc    Update message priority
// @route   PATCH /api/messages/:id/priority
// @access  Private (Admin only)
router.patch('/:id/priority', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value'
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Update message priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message priority'
    });
  }
});

// @desc    Add notes to message
// @route   PATCH /api/messages/:id/notes
// @access  Private (Admin only)
router.patch('/:id/notes', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notes cannot be empty'
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { notes: notes.trim() },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Update message notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message notes'
    });
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message'
    });
  }
});

// @desc    Get message statistics
// @route   GET /api/messages/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const readMessages = await Message.countDocuments({ status: 'read' });
    const repliedMessages = await Message.countDocuments({ status: 'replied' });
    const archivedMessages = await Message.countDocuments({ status: 'archived' });

    const priorityStats = await Message.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Messages by day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMessages = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        unreadMessages,
        readMessages,
        repliedMessages,
        archivedMessages,
        priorityStats,
        recentMessages
      }
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router;
