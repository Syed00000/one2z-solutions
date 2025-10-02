# One2Z Solutions - Interior Design & Construction Company

A full-stack web application for One2Z Solutions with admin panel, project management, contact forms, meeting scheduling, customer reviews, and OTP-based password reset.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Project Showcase**: Dynamic project gallery with categories
- **Contact System**: Contact forms with real-time validation
- **Meeting Booking**: Interactive meeting scheduler
- **Customer Reviews**: Review system with ratings
- **Admin Panel**: Complete admin dashboard for content management

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete REST API with proper error handling
- **Authentication**: JWT-based auth with bcrypt password hashing
- **File Upload**: Cloudinary integration for image management
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Admin Management**: Full CRUD operations for all entities

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui component library
- React Router for navigation
- React Hook Form with Zod validation
- Tanstack Query for data fetching

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Express Validator for input validation
- Helmet for security headers
- CORS for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account for image uploads

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/one2z-solutions.git
cd one2z-solutions
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, frontend, and backend)
npm run install-all

# Or install separately
npm install              # Root dependencies
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
Create `backend/.env` file:
```env
# Database
MONGODB_URI=mongodb+srv://syedimranh59_db_user:Syed%401234@cluster0.qxlxp7t.mongodb.net/technologiya

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dgjpbkvyw
CLOUDINARY_API_KEY=181283248281397
CLOUDINARY_API_SECRET=l6pLvv02eKaZiwT--YD-AC2f5bw

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Default Credentials
ADMIN_EMAIL=syedimranh59@gmail.com
ADMIN_PASSWORD=admin@123

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=syedimranh59@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

#### Frontend Environment (.env)
Create `frontend/.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Technologiya
VITE_APP_VERSION=1.0.0
```

### 4. Initialize Admin User
```bash
# Initialize the admin user in database
cd backend
npm run init-admin
```

### 5. Start Development Servers
```bash
# Start both frontend and backend concurrently (from root)
npm run dev

# Or use the batch file (Windows)
start.bat
```

Or start them separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:8080/admin/login

### Default Admin Credentials
- **Email**: syedimranh59@gmail.com
- **Password**: admin@123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Send OTP to email
- `POST /api/auth/verify-otp-reset` - Verify OTP and reset password
- `PUT /api/auth/update-password` - Update password (authenticated)

### Projects Endpoints
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Messages Endpoints
- `POST /api/messages` - Submit contact form (public)
- `GET /api/messages` - Get all messages (admin)
- `GET /api/messages/:id` - Get single message (admin)
- `PATCH /api/messages/:id/status` - Update message status (admin)

### Meetings Endpoints
- `POST /api/meetings` - Book meeting (public)
- `GET /api/meetings` - Get all meetings (admin)
- `GET /api/meetings/:id` - Get single meeting (admin)
- `PATCH /api/meetings/:id/status` - Update meeting status (admin)

### Reviews Endpoints
- `POST /api/reviews` - Submit review (public)
- `GET /api/reviews` - Get approved reviews (public)
- `GET /api/reviews/featured/list` - Get featured reviews (public)
- `PATCH /api/reviews/:id/status` - Update review status (admin)

### Upload Endpoints
- `POST /api/upload/image` - Upload single image (admin)
- `POST /api/upload/images` - Upload multiple images (admin)
- `DELETE /api/upload/image` - Delete image (admin)

## 🔐 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- File upload restrictions (images only, 10MB max)

## 📱 Admin Panel Features

### Dashboard
- Overview statistics
- Recent activities
- Quick actions

### Projects Management
- Create, edit, delete projects
- Image gallery management
- Project categorization
- Featured projects

### Messages Management
- View contact form submissions
- Mark as read/replied
- Priority management
- Notes system

### Meetings Management
- View meeting requests
- Confirm/cancel meetings
- Schedule management
- Meeting notes

### Reviews Management
- Approve/reject reviews
- Featured reviews
- Rating analytics
- Review moderation

## 🚀 Deployment

### Monorepo Structure
This project uses a monorepo structure with both frontend and backend in the same repository:
```
one2z-solutions/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── package.json       # Root package.json
├── start.bat         # Windows startup script
└── README.md
```

### Backend Deployment (Node.js)
**Recommended: Railway, Render, or Heroku**

1. **Environment Variables**:
   ```env
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   EMAIL_USER=your-gmail-address
   EMAIL_PASSWORD=your-gmail-app-password
   NODE_ENV=production
   PORT=5000
   ```

2. **Deploy Commands**:
   ```bash
   # Build command (if needed)
   cd backend && npm install
   
   # Start command
   cd backend && npm start
   ```

### Frontend Deployment (React)
**Recommended: Vercel, Netlify, or GitHub Pages**

1. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   VITE_APP_NAME=One2Z Solutions
   ```

2. **Build Commands**:
   ```bash
   # Build command
   cd frontend && npm install && npm run build
   
   # Output directory
   frontend/dist
   ```

### Separate Deployment Strategy
For separate deployments, you can split the repo:

1. **Backend Only**: Deploy `/backend` folder to Node.js hosting
2. **Frontend Only**: Deploy `/frontend` folder to static hosting
3. **Update CORS**: Add frontend URL to backend CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email: one2zsolution2410@gmail.com

---

**Built with ❤️ by One2Z Solutions**
