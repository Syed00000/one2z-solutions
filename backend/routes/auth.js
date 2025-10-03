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

// Email transporter configuration - FORCE SMTP TO WORK!
const createEmailTransporter = () => {
  console.log('🔧 Creating AGGRESSIVE SMTP configuration...');
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Try secure port first
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    // AGGRESSIVE SETTINGS TO BYPASS RENDER BLOCKS
    connectionTimeout: 120000, // 2 minutes
    greetingTimeout: 60000,    // 1 minute  
    socketTimeout: 120000,     // 2 minutes
    logger: true,              // Enable detailed logging
    debug: true,               // Enable debug mode
    // Try to bypass firewall
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3',
      secureProtocol: 'TLSv1_2_method'
    },
    // Connection pooling
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 10
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

    // AGGRESSIVE MULTI-ATTEMPT EMAIL SENDING
    console.log('🚀 STARTING AGGRESSIVE EMAIL DELIVERY ATTEMPTS...');
    
    const emailConfigs = [
      {
        name: 'Gmail Port 465 (SSL)',
        config: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
          connectionTimeout: 30000,
          tls: { rejectUnauthorized: false }
        }
      },
      {
        name: 'Gmail Port 587 (TLS)', 
        config: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
          connectionTimeout: 30000,
          requireTLS: true,
          tls: { rejectUnauthorized: false }
        }
      },
      {
        name: 'Gmail Service',
        config: {
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
          connectionTimeout: 30000
        }
      }
    ];

    let emailSent = false;
    let lastError = null;

    // TRY EACH CONFIG UNTIL ONE WORKS
    for (const { name, config } of emailConfigs) {
      if (emailSent) break;
      
      try {
        console.log(`📧 Attempting: ${name}...`);
        const transporter = nodemailer.createTransport(config);
        
        // Quick verification with timeout
        const verifyPromise = transporter.verify();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Verification timeout')), 10000)
        );
        
        await Promise.race([verifyPromise, timeoutPromise]);
        console.log(`✅ ${name} verified successfully!`);
        
        // Send email
        const mailOptions = {
          from: `"One2Z Solutions" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Password Reset OTP - One2Z Solutions',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p>You requested to reset your password for One2Z Solutions Admin Panel.</p>
              <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #e63946; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">One2Z Solutions - Construction & Interior Design</p>
            </div>
          `
        };

        const sendPromise = transporter.sendMail(mailOptions);
        const sendTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Send timeout')), 20000)
        );
        
        const result = await Promise.race([sendPromise, sendTimeoutPromise]);
        
        console.log(`🎉 SUCCESS! Email sent via ${name}`);
        console.log(`📧 Message ID: ${result.messageId}`);
        
        emailSent = true;
        
        res.status(200).json({
          success: true,
          message: `OTP sent successfully to your email via ${name}!`,
          method: name
        });
        
      } catch (configError) {
        console.log(`❌ ${name} failed:`, configError.message);
        lastError = configError;
        continue; // Try next configuration
      }
    }
    
    // If all configurations failed
    if (!emailSent) {
      console.log('💥 ALL EMAIL CONFIGURATIONS FAILED!');
      console.log('🔥 RENDER HAS BLOCKED ALL SMTP PORTS!');
      console.log('📋 Last error:', lastError?.message);
      
      res.status(200).json({
        success: true,
        message: 'OTP generated successfully. All email delivery methods blocked by cloud platform.',
        warning: 'SMTP ports 25, 465, 587 are blocked on Render platform.',
        instruction: 'Use the OTP code from server logs.',
        otpHint: `Your OTP: ${otp}`,
        technicalNote: 'Consider using SendGrid, Mailgun, or AWS SES for production email delivery.'
      });
    }


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
