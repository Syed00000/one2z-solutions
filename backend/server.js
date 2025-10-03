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

// Set production defaults if not set
if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/one2z-solutions';
  process.env.JWT_SECRET = 'your-super-secure-jwt-secret-key-here-32-chars-long-for-security';
  process.env.ADMIN_EMAIL = 'syedimranh59@gmail.com';
  process.env.ADMIN_PASSWORD = 'admin@123';
}

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

// EMERGENCY CORS FIX - Allow everything temporarily
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Simple CORS package as backup
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    mongoState: mongoose.connection.readyState,
    mongoStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    hasRequiredEnvVars: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD
    }
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
