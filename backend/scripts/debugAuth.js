import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const debugAuth = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test data
    const testEmail = 'syedimranh59@gmail.com';
    const testPassword = 'admin@123';
    
    console.log('\n🧪 Testing Authentication Flow:');
    console.log(`📧 Email: "${testEmail}"`);
    console.log(`🔑 Password: "${testPassword}"`);
    
    // Step 1: Find user
    console.log('\n📍 Step 1: Finding user...');
    const user = await User.findOne({ email: testEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found');
    console.log(`   - ID: ${user._id}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Active: ${user.isActive}`);
    console.log(`   - Password Hash: ${user.password.substring(0, 20)}...`);
    
    // Step 2: Test password
    console.log('\n📍 Step 2: Testing password...');
    const isMatch = await user.comparePassword(testPassword);
    console.log(`🔐 Password Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    // Step 3: Test different variations
    console.log('\n📍 Step 3: Testing variations...');
    const variations = [
      'admin@123',
      'Admin@123',
      'ADMIN@123',
      'admin@123 ',
      ' admin@123'
    ];
    
    for (const variation of variations) {
      const match = await user.comparePassword(variation);
      console.log(`   "${variation}" -> ${match ? '✅' : '❌'}`);
    }
    
    // Step 4: Check if user is active
    console.log('\n📍 Step 4: Checking user status...');
    if (!user.isActive) {
      console.log('❌ User is not active');
    } else {
      console.log('✅ User is active');
    }
    
    console.log('\n🎯 Summary:');
    console.log(`   User exists: ${user ? '✅' : '❌'}`);
    console.log(`   Password matches: ${isMatch ? '✅' : '❌'}`);
    console.log(`   User active: ${user.isActive ? '✅' : '❌'}`);
    console.log(`   Should login: ${user && isMatch && user.isActive ? '✅ YES' : '❌ NO'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

debugAuth();
