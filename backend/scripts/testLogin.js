import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    
    console.log(`🧪 Testing login with:`);
    console.log(`📧 Email: "${email}"`);
    console.log(`🔑 Password: "${password}"`);
    
    // Simulate the exact same logic as in auth route
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      
      // Check if there's a similar email
      const allUsers = await User.find({});
      console.log('\n📋 All users in database:');
      allUsers.forEach(u => {
        console.log(`  - "${u.email}" (${u.role})`);
      });
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    // Check password
    const isMatch = await user.comparePassword(password);
    console.log(`🔐 Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    if (isMatch) {
      console.log('🎉 Login should work!');
    } else {
      console.log('❌ Login will fail - password mismatch');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing login:', error);
    process.exit(1);
  }
};

testLogin();
