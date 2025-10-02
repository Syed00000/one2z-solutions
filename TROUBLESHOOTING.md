# 🔧 Troubleshooting Guide

## 🚨 Current Error: Backend Connection Refused

### Error Message:
```
:5000/api/auth/login:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

### ✅ Solution:

**Backend server is not running!** You need to start it manually.

## 🚀 How to Fix:

### Step 1: Open New Terminal/Command Prompt
```bash
cd C:\Users\Syed Imran Hassan\Desktop\Technologiya\backend
```

### Step 2: Start Backend Server
```bash
npm run dev
```

### Step 3: You Should See:
```
Server running on port 5000
✅ Connected to MongoDB
```

### Step 4: Keep This Terminal Open
Don't close this terminal - backend server needs to keep running.

### Step 5: Test Login
- Go to: http://localhost:5173/admin/login
- Email: syedimranh59@gmail.com  
- Password: admin@123

## 🔄 Alternative: Start Both Servers Together

### Option 1: Use Batch File
Double-click: `start.bat`

### Option 2: Use NPM Script
```bash
cd frontend
npm run dev:full
```

## 🐛 Common Issues & Solutions:

### 1. **Port 5000 Already in Use**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use different port in backend/.env
PORT=5001
```

### 2. **MongoDB Connection Failed**
- Check internet connection
- Verify MongoDB URI in `backend/.env`
- Make sure MongoDB Atlas cluster is running

### 3. **Cloudinary Upload Fails**
- Check Cloudinary credentials in `backend/.env`
- Verify API keys are correct

### 4. **Frontend Build Errors**
```bash
cd frontend
npm install
npm run dev
```

### 5. **CORS Errors**
- Make sure backend server is running on port 5000
- Check CORS settings in `backend/server.js`

### 6. **Authentication Issues**
```bash
# Re-initialize admin user
cd backend
npm run init-admin
```

## 📋 Startup Checklist:

✅ **Backend Dependencies**: `cd backend && npm install`  
✅ **Frontend Dependencies**: `cd frontend && npm install`  
✅ **Admin User Created**: `npm run init-admin` (Done ✅)  
✅ **Environment Files**: Check `.env` files exist  
✅ **MongoDB Connection**: Verify connection string  
✅ **Cloudinary Setup**: Check API credentials  

## 🎯 Quick Test Commands:

### Test Backend API:
```bash
curl http://localhost:5000/api/auth/me
```

### Test Frontend:
Open: http://localhost:5173

### Test Database Connection:
Check backend terminal for: "✅ Connected to MongoDB"

## 📞 If Still Having Issues:

1. **Restart Everything**:
   - Close all terminals
   - Run `start.bat` or manual startup

2. **Check Logs**:
   - Backend terminal for error messages
   - Browser console for frontend errors

3. **Verify Ports**:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

**Most common issue: Backend server not running! Start it first. 🚀**
