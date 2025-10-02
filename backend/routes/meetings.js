import express from 'express';
import Meeting from '../models/Meeting.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateMeeting } from '../middleware/validation.js';

const router = express.Router();

// @desc    Create new meeting (Meeting booking)
// @route   POST /api/meetings
// @access  Public
router.post('/', validateMeeting, async (req, res) => {
  try {
    // Convert date string to Date object
    const meetingData = {
      ...req.body,
      date: new Date(req.body.date)
    };

    const meeting = await Meeting.create(meetingData);

    res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully',
      data: meeting
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling meeting'
    });
  }
});

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      date,
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

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const meetings = await Meeting.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Meeting.countDocuments(query);

    res.status(200).json({
      success: true,
      count: meetings.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: meetings
    });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meetings'
    });
  }
});

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meeting'
    });
  }
});

// @desc    Update meeting status
// @route   PATCH /api/meetings/:id/status
// @access  Private (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    meeting.status = status;

    if (status === 'confirmed' && !meeting.confirmedAt) {
      meeting.confirmedAt = new Date();
    }

    if (status === 'completed') {
      meeting.completedAt = new Date();
    }

    await meeting.save();

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Update meeting status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meeting status'
    });
  }
});

// @desc    Update meeting priority
// @route   PATCH /api/meetings/:id/priority
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

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Update meeting priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meeting priority'
    });
  }
});

// @desc    Add notes to meeting
// @route   PATCH /api/meetings/:id/notes
// @access  Private (Admin only)
router.patch('/:id/notes', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { notes } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { notes: notes ? notes.trim() : '' },
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Update meeting notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meeting notes'
    });
  }
});

// @desc    Update meeting details
// @route   PUT /api/meetings/:id
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const allowedFields = ['date', 'time', 'location', 'meetingLink', 'notes'];
    const updateData = {};

    // Only allow specific fields to be updated
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meeting'
    });
  }
});

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting meeting'
    });
  }
});

// @desc    Get meeting statistics
// @route   GET /api/meetings/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalMeetings = await Meeting.countDocuments();
    const pendingMeetings = await Meeting.countDocuments({ status: 'pending' });
    const confirmedMeetings = await Meeting.countDocuments({ status: 'confirmed' });
    const completedMeetings = await Meeting.countDocuments({ status: 'completed' });
    const cancelledMeetings = await Meeting.countDocuments({ status: 'cancelled' });

    // Upcoming meetings (today and future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingMeetings = await Meeting.countDocuments({
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Meetings by status
    const statusStats = await Meeting.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Meetings by priority
    const priorityStats = await Meeting.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Meetings by day for the next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingByDay = await Meeting.aggregate([
      {
        $match: {
          date: { $gte: today, $lte: sevenDaysFromNow },
          status: { $in: ['pending', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMeetings,
        pendingMeetings,
        confirmedMeetings,
        completedMeetings,
        cancelledMeetings,
        upcomingMeetings,
        statusStats,
        priorityStats,
        upcomingByDay
      }
    });
  } catch (error) {
    console.error('Get meeting stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router;
