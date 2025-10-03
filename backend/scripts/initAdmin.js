import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Set production defaults if not set
if (process.env.NODE_ENV === 'production') {
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/one2z-solutions';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-here-32-chars-long-for-security';
  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'syedimranh59@gmail.com';
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
}

const initAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
    console.log(`👤 Role: ${adminUser.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

initAdmin();
