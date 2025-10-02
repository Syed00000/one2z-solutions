# Vercel Deployment Guide - One2Z Solutions

## 🚀 Backend Deployment (Node.js API)

### Step 1: Deploy Backend to Vercel

1. **Create Vercel Account**: https://vercel.com
2. **Import Backend Project**:
   - Connect GitHub repository
   - Select `backend/` folder as root directory
   - Framework: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Environment Variables** (Add in Vercel Dashboard):
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/one2z-solutions
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

4. **Deploy**: Click Deploy button

### Step 2: Get Backend URL

After deployment, you'll get a URL like:
`https://your-backend-name.vercel.app`

## 🌐 Frontend Configuration

### Step 1: Update Frontend Environment

Create `.env` file in `frontend/` folder:
```env
VITE_API_URL=https://your-backend-name.vercel.app/api
VITE_APP_NAME=One2Z Solutions
```

### Step 2: Deploy Frontend (Already Done)

Your frontend is already deployed at:
**https://one2zsolutions.vercel.app/**

## 🔗 Connect Frontend to Backend

### Update Frontend .env:
```env
# Replace with your actual backend URL
VITE_API_URL=https://one2z-backend-xyz.vercel.app/api
```

### Redeploy Frontend:
1. Update `.env` file
2. Push to GitHub
3. Vercel will auto-deploy

## ✅ Verification Steps

1. **Backend Health Check**: 
   - Visit: `https://your-backend-url.vercel.app/api/health`
   - Should return: `{"status": "OK", "message": "Server is running"}`

2. **Frontend Connection**:
   - Visit: https://one2zsolutions.vercel.app
   - Try admin login
   - Check browser console for API calls

3. **CORS Working**:
   - No CORS errors in browser console
   - API calls successful from frontend

## 🛠️ Files Created for Deployment

### Backend:
- ✅ `backend/vercel.json` - Vercel configuration
- ✅ `backend/package.json` - Updated with build scripts
- ✅ `backend/server.js` - CORS updated for production

### Frontend:
- ✅ `frontend/.env.example` - Environment template
- ✅ Frontend already deployed at: https://one2zsolutions.vercel.app

## 🔧 Environment Variables Needed

### Backend (Vercel Dashboard):
```
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
EMAIL_USER=your-gmail
EMAIL_PASSWORD=your-gmail-app-password
```

### Frontend (.env file):
```
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=One2Z Solutions
```

---

**🎯 Ready for deployment! Backend is Vercel-ready, just deploy and connect!**
