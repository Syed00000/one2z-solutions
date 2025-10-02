# 🚀 Quick Start Guide - Technologiya

## ✅ Admin User Created Successfully!
- **Email**: syedimranh59@gmail.com
- **Password**: admin@123

## 🔧 Start the Application

### Method 1: Using Batch Files (Recommended)
```bash
# Double-click these files:
setup.bat    # (Already done - dependencies installed)
start.bat    # Start both frontend and backend
```

### Method 2: Manual Start

#### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend Server:
```bash
cd frontend  
npm run dev
```

### Method 3: Concurrent Start (Single Terminal):
```bash
cd frontend
npm run dev:full
```

## 🌐 Access Points

Once both servers are running:

- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login  
- **Backend API**: http://localhost:5000/api

## 🔐 Admin Login

1. Go to: http://localhost:5173/admin/login
2. **Email**: syedimranh59@gmail.com
3. **Password**: admin@123

## 🧪 Test the Application

### Test Contact Form:
1. Go to http://localhost:5173/contact
2. Fill and submit the form
3. Check admin panel → Messages section

### Test Meeting Booking:
1. Go to http://localhost:5173/book-meeting
2. Schedule a meeting
3. Check admin panel → Meetings section

### Test Reviews:
1. Go to http://localhost:5173 (scroll down)
2. Click "Share Your Experience"
3. Submit a review
4. Login to admin panel → Reviews section → Approve it

### Test Project Management:
1. Login to admin panel
2. Go to Projects section
3. Create/Edit projects with images

## 🛠️ Troubleshooting

### If Backend Connection Fails:
1. Make sure MongoDB is accessible
2. Check `.env` file in backend folder
3. Restart backend server: `cd backend && npm run dev`

### If Frontend Issues:
1. Clear browser cache
2. Restart frontend: `cd frontend && npm run dev`

### If Both Servers Don't Start:
1. Run: `cd frontend && npm run install:all`
2. Then: `npm run dev:full`

## 📊 What's Working:

✅ **Database**: MongoDB Atlas connected  
✅ **File Upload**: Cloudinary integration  
✅ **Authentication**: JWT tokens working  
✅ **Contact Forms**: Save to database  
✅ **Meeting Booking**: Full scheduling system  
✅ **Reviews**: Submit and admin approval  
✅ **Admin Panel**: Complete management interface  
✅ **Image Upload**: Cloudinary storage  
✅ **Security**: Rate limiting, validation, CORS  

## 🎯 Next Steps:

1. **Start the servers** using any method above
2. **Test all features** using the test guide
3. **Add your content** through admin panel
4. **Upload project images** via admin interface
5. **Manage customer inquiries** through admin dashboard

**Your construction company website is ready to use! 🏗️✨**
