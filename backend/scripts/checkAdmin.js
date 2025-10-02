import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Role: ${adminUser.role}`);
      console.log(`📅 Created: ${adminUser.createdAt}`);
      console.log(`🔐 Password Hash: ${adminUser.password ? 'Present' : 'Missing'}`);
      
      // Test password comparison
      const testPassword = process.env.ADMIN_PASSWORD;
      const isMatch = await adminUser.comparePassword(testPassword);
      console.log(`🧪 Password Test (${testPassword}): ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
      
    } else {
      console.log('❌ Admin user not found');
      console.log(`🔍 Looking for email: ${process.env.ADMIN_EMAIL}`);
      
      // List all users
      const allUsers = await User.find({});
      console.log(`📊 Total users in database: ${allUsers.length}`);
      allUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
    process.exit(1);
  }
};

checkAdmin();
