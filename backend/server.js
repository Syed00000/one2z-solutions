import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import messageRoutes from './routes/messages.js';
import meetingRoutes from './routes/meetings.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/upload.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration - Specific origins with credentials
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'https://one2zsolutions.vercel.app', 'https://one2z-solutions.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'content-type', 'x-requested-with'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
}));

// Manual CORS headers - Dynamic origin
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000', 'https://one2zsolutions.vercel.app', 'https://one2z-solutions.onrender.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, content-type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  try {
    let projectCount = 0;
    let reviewCount = 0;
    let userCount = 0;
    let adminUser = null;
    
    if (mongoose.connection.readyState === 1) {
      const Project = (await import('./models/Project.js')).default;
      const Review = (await import('./models/Review.js')).default;
      const User = (await import('./models/User.js')).default;
      
      projectCount = await Project.countDocuments();
      reviewCount = await Review.countDocuments();
      userCount = await User.countDocuments();
      adminUser = await User.findOne({ role: 'admin' }).select('email role isActive');
    }
    
    res.json({
      environment: process.env.NODE_ENV,
      mongoState: mongoose.connection.readyState,
      mongoStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      databaseName: mongoose.connection.name,
      projectCount,
      reviewCount,
      userCount,
      adminUser: adminUser ? { 
        email: adminUser.email, 
        role: adminUser.role, 
        isActive: adminUser.isActive 
      } : null,
      hasRequiredEnvVars: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        JWT_SECRET: !!process.env.JWT_SECRET,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD
      },
      emailConfig: {
        emailUser: process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_PASSWORD,
        emailPasswordLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0,
        isPlaceholder: process.env.EMAIL_PASSWORD === 'your-gmail-app-password'
      }
    });
  } catch (error) {
    res.json({
      environment: process.env.NODE_ENV,
      mongoState: mongoose.connection.readyState,
      mongoStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      error: error.message,
      hasRequiredEnvVars: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        JWT_SECRET: !!process.env.JWT_SECRET,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD
      }
    });
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📍 Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('❌ Full error:', error);
    console.error('❌ MongoDB URI format check:', process.env.MONGODB_URI ? 'URI exists' : 'URI missing');
  });

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1,
    mongoState: mongoose.connection.readyState,
    mongoStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not set'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
});

export default app;
