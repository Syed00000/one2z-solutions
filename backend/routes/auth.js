import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { randomBytes, createHash } from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateLogin, validatePasswordReset } from '../middleware/validation.js';

const router = express.Router();
// Temporary OTP storage (in production, use Redis or database)
const otpStore = new Map();

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service instead of manual SMTP config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    // Additional options for better cloud compatibility
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000      // 60 seconds
  });
};

// Generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Set token cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);
    console.log('🔗 MongoDB connection state:', mongoose.connection.readyState);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ User found:', user.email);

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Password verified for:', email);

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account deactivated:', email);
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Login successful for:', email);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', validatePasswordReset, async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 Forgot password request for:', email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();
    
    // Store OTP with expiry (10 minutes)
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });

    console.log(`🔑 Generated OTP for ${email}: ${otp}`);

    // For development: Always show OTP in console
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🔑 YOUR OTP CODE: ${otp}`);
    console.log(`📧 Email: ${email}`);
    console.log(`⏰ Valid for: 10 minutes`);
    console.log(`${'='.repeat(50)}\n`);

    // SMTP is blocked on Render - Skip email sending for now
    console.log('⚠️ SMTP connections are blocked on this cloud platform');
    console.log('📧 Email would be sent to:', email);
    console.log('💡 Using console OTP delivery method');
    
    // Return success with console OTP
    res.status(200).json({
      success: true,
      message: 'OTP generated successfully. Check server logs for your OTP code.',
      warning: 'Email delivery is temporarily unavailable due to cloud platform restrictions.',
      instructions: 'Use the OTP code displayed in the server console logs.',
      otpInfo: {
        email: email,
        validFor: '10 minutes',
        note: 'Check Render logs for OTP code'
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
router.put('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Get hashed token
    const resetPasswordToken = createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @desc    Verify OTP and Reset Password
// @route   POST /api/auth/verify-otp-reset
// @access  Public
router.post('/verify-otp-reset', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log('🔑 Verifying OTP for:', email);

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if OTP exists
    const storedOtpData = otpStore.get(email);
    
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Check if OTP expired
    if (Date.now() > storedOtpData.expires) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts += 1;
      otpStore.set(email, storedOtpData);
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedOtpData.attempts} attempts remaining.`
      });
    }

    console.log('✅ OTP verified successfully');

    // Find user and update password
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear OTP from store
    otpStore.delete(email);

    console.log('✅ Password reset successfully for:', email);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
router.put('/update-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    console.log('🔑 User found:', user.email);
    console.log('🔑 Checking current password...');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    console.log('🔑 Password match:', isMatch);
    
    if (!isMatch) {
      console.error('❌ Current password is incorrect');
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    console.log('✅ Current password verified, updating to new password...');

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
});

export default router;
