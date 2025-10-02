import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/Message.js';

dotenv.config();

const createTestMessage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test message
    const testMessage = await Message.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+91 9876543210',
      message: 'This is a test message from the contact form. Please check if this appears in the admin panel.',
      status: 'unread',
      priority: 'medium'
    });

    console.log('✅ Test message created:', testMessage);
    console.log(`📧 Message ID: ${testMessage._id}`);

    // Check total messages
    const totalMessages = await Message.countDocuments();
    console.log(`📊 Total messages in database: ${totalMessages}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createTestMessage();
