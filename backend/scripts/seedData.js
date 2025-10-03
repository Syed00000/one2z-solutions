import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 URI exists:', !!process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await Project.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user (password will be hashed by User model pre-save hook)
    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || 'syedimranh59@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'admin@123',
      role: 'admin',
      isVerified: true
    });
    console.log('👤 Created admin user');

    // Create sample projects
    const projects = [
      {
        title: 'Modern Villa Interior Design',
        description: 'Complete interior design and renovation of a luxury 4-bedroom villa. Features contemporary design elements, premium materials, and smart home integration.',
        category: 'Interior',
        status: 'published',
        featured: true,
        location: 'DHA Phase 5, Karachi',
        area: '3500 sq ft',
        budget: 'PKR 25,00,000',
        completion: '6 months',
        clientName: 'Ahmed Khan',
        clientCompany: 'Khan Enterprises',
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
        ],
        views: 245,
        createdBy: adminUser._id
      },
      {
        title: 'Commercial Office Complex',
        description: 'Construction of a modern 10-story commercial office complex with state-of-the-art facilities, parking, and green building features.',
        category: 'Construction',
        status: 'published',
        featured: true,
        location: 'Gulshan-e-Iqbal, Karachi',
        area: '50,000 sq ft',
        budget: 'PKR 5,00,00,000',
        completion: '18 months',
        clientName: 'Fatima Ali',
        clientCompany: 'Business Hub Ltd',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
        ],
        views: 189,
        createdBy: adminUser._id
      },
      {
        title: 'Luxury Apartment Interior',
        description: 'High-end interior design for a 3-bedroom luxury apartment featuring Italian marble, custom furniture, and premium lighting solutions.',
        category: 'Interior',
        status: 'published',
        featured: false,
        location: 'Clifton, Karachi',
        area: '2200 sq ft',
        budget: 'PKR 18,00,000',
        completion: '4 months',
        clientName: 'Sarah Ahmed',
        clientCompany: 'Private Client',
        coverImage: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&h=400&fit=crop',
        images: [],
        views: 156,
        createdBy: adminUser._id
      },
      {
        title: 'Residential Housing Project',
        description: 'Development of a gated community with 50 modern houses, community center, parks, and all essential amenities.',
        category: 'Construction',
        status: 'published',
        featured: true,
        location: 'Bahria Town, Karachi',
        area: '25 acres',
        budget: 'PKR 15,00,00,000',
        completion: '24 months',
        clientName: 'Mohammad Hassan',
        clientCompany: 'Hassan Developers',
        coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
        ],
        views: 298,
        createdBy: adminUser._id
      },
      {
        title: 'Restaurant Interior Design',
        description: 'Complete interior design and fit-out of a fine dining restaurant with contemporary aesthetics and efficient kitchen layout.',
        category: 'Interior',
        status: 'published',
        featured: false,
        location: 'Zamzama, Karachi',
        area: '4000 sq ft',
        budget: 'PKR 35,00,000',
        completion: '3 months',
        clientName: 'Ali Raza',
        clientCompany: 'Raza Hospitality',
        coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
        images: [],
        views: 134,
        createdBy: adminUser._id
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log(`📁 Created ${createdProjects.length} projects`);

    // Create sample reviews
    const reviews = [
      {
        name: 'Ahmed Khan',
        email: 'ahmed@khanenterprises.com',
        company: 'Khan Enterprises',
        rating: 5,
        review: 'Exceptional interior design work! One2Z Solutions transformed our villa into a modern masterpiece. The attention to detail and quality of work exceeded our expectations. Highly recommended!',
        status: 'approved',
        featured: true,
        projectId: createdProjects[0]._id,
        approvedBy: adminUser._id,
        approvedAt: new Date()
      },
      {
        name: 'Fatima Ali',
        email: 'fatima@businesshub.com',
        company: 'Business Hub Ltd',
        rating: 5,
        review: 'Outstanding construction project management! The office complex was completed on time and within budget. Professional team with excellent communication throughout the project.',
        status: 'approved',
        featured: true,
        projectId: createdProjects[1]._id,
        approvedBy: adminUser._id,
        approvedAt: new Date()
      },
      {
        name: 'Sarah Ahmed',
        email: 'sarah.ahmed@gmail.com',
        company: 'Private Client',
        rating: 4,
        review: 'Beautiful interior design for our apartment. The team understood our vision perfectly and delivered exactly what we wanted. Great experience working with One2Z Solutions.',
        status: 'approved',
        featured: false,
        projectId: createdProjects[2]._id,
        approvedBy: adminUser._id,
        approvedAt: new Date()
      },
      {
        name: 'Mohammad Hassan',
        email: 'hassan@hassandevelopers.com',
        company: 'Hassan Developers',
        rating: 5,
        review: 'Impressive construction quality and project management. The residential housing project was executed flawlessly with attention to every detail. Excellent work by the One2Z team!',
        status: 'approved',
        featured: true,
        projectId: createdProjects[3]._id,
        approvedBy: adminUser._id,
        approvedAt: new Date()
      },
      {
        name: 'Ali Raza',
        email: 'ali@razahospitality.com',
        company: 'Raza Hospitality',
        rating: 4,
        review: 'Professional interior design services for our restaurant. The team created a perfect ambiance that our customers love. Timely delivery and great customer service.',
        status: 'approved',
        featured: false,
        projectId: createdProjects[4]._id,
        approvedBy: adminUser._id,
        approvedAt: new Date()
      }
    ];

    const createdReviews = await Review.insertMany(reviews);
    console.log(`⭐ Created ${createdReviews.length} reviews`);

    console.log('✅ Data seeding completed successfully!');
    console.log(`👤 Admin user: ${adminUser.email}`);
    console.log(`📁 Projects: ${createdProjects.length}`);
    console.log(`⭐ Reviews: ${createdReviews.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeding
connectDB().then(() => {
  seedData();
});
