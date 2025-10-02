# Deployment Guide - One2Z Solutions

## 📋 Pre-Deployment Checklist

### ✅ Repository Setup
- [ ] Update all package.json files with correct names
- [ ] Ensure .gitignore is properly configured
- [ ] All sensitive data is in .env files (not committed)
- [ ] README.md is updated with correct information

### ✅ Environment Variables
- [ ] Backend .env configured with production values
- [ ] Frontend .env configured with production API URL
- [ ] Gmail App Password generated for email functionality
- [ ] Cloudinary credentials configured

## 🚀 Git Repository Setup

### 1. Initialize Git Repository
```bash
# In the root directory (Technologiya/)
git init
git add .
git commit -m "Initial commit: One2Z Solutions full-stack application"
```

### 2. Create GitHub Repository
1. Go to GitHub.com
2. Create new repository: `one2z-solutions`
3. Don't initialize with README (we already have one)

### 3. Connect Local to Remote
```bash
git remote add origin https://github.com/yourusername/one2z-solutions.git
git branch -M main
git push -u origin main
```

## 🌐 Deployment Options

### Option 1: Monorepo Deployment (Recommended)

#### Backend: Railway/Render
1. **Connect GitHub repo**
2. **Root Directory**: `/backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Copy from backend/.env

#### Frontend: Vercel/Netlify
1. **Connect GitHub repo**
2. **Root Directory**: `/frontend`
3. **Build Command**: `npm install && npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**: 
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Option 2: Separate Repositories

#### Split the Repository
```bash
# Create backend-only repo
git subtree push --prefix=backend origin backend-only

# Create frontend-only repo  
git subtree push --prefix=frontend origin frontend-only
```

## 🔧 Production Configuration

### Backend Production Settings
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production
JWT_SECRET=super-secure-production-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend Production Settings
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=One2Z Solutions
VITE_APP_VERSION=1.0.0
```

## 📊 Deployment Platforms

### Backend Hosting Options
| Platform | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| Railway | ✅ | Easy setup, GitHub integration | Limited free hours |
| Render | ✅ | Auto-deploy, good performance | Cold starts |
| Heroku | ❌ | Mature platform | No free tier |
| DigitalOcean | ❌ | Full control | Requires setup |

### Frontend Hosting Options
| Platform | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| Vercel | ✅ | Excellent for React, fast CDN | Build limits |
| Netlify | ✅ | Easy setup, form handling | Build minutes limit |
| GitHub Pages | ✅ | Free, simple | Static only |
| Cloudflare Pages | ✅ | Fast CDN, unlimited builds | Learning curve |

## 🔐 Security Checklist

### Production Security
- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS for production domains
- [ ] Set secure cookie settings
- [ ] Enable rate limiting
- [ ] Use environment variables for all secrets

### Database Security
- [ ] MongoDB Atlas with IP whitelist
- [ ] Strong database password
- [ ] Regular backups enabled
- [ ] Connection string secured

## 📈 Post-Deployment

### Testing Checklist
- [ ] Admin login works
- [ ] Contact form submissions
- [ ] Meeting booking functionality
- [ ] Review submission and approval
- [ ] Project CRUD operations
- [ ] Image uploads to Cloudinary
- [ ] Email OTP functionality
- [ ] Password reset flow

### Monitoring
- [ ] Set up error logging
- [ ] Monitor API response times
- [ ] Track user interactions
- [ ] Set up uptime monitoring

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Update backend CORS settings with frontend URL
2. **API Not Found**: Check VITE_API_URL in frontend
3. **Database Connection**: Verify MongoDB URI and IP whitelist
4. **Email Not Sending**: Check Gmail App Password and 2FA
5. **Images Not Uploading**: Verify Cloudinary credentials

### Debug Commands
```bash
# Check environment variables
echo $VITE_API_URL

# Test API connection
curl https://your-backend-url.com/api/health

# Check build output
npm run build
```

---

**🎯 Ready to deploy? Follow this guide step by step for a successful deployment!**
