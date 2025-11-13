# Vercel Deployment Guide - ShopEase

## 📋 Overview

Deploy your ShopEase e-commerce platform to Vercel with MongoDB Atlas.

**Repository**: https://github.com/n2023ik/ecoomerce  
**Database**: MongoDB Atlas (ShopEase cluster)  
**Platform**: Vercel Serverless Functions

---

## 🚀 Deployment Steps

### Step 1: Prepare Your GitHub Repository

Ensure these files are committed:
```
✅ package.json - with build scripts
✅ vercel.json - Vercel configuration
✅ .env.example - Environment template (safe to commit)
✅ .gitignore - protects .env files
✅ app.js - Express server
✅ client/package.json - React build config
✅ routes/* - API endpoints
✅ models/* - Database models
```

**Files NOT to commit:**
```
❌ .env - development secrets
❌ .env.production - production secrets
❌ node_modules/ - dependencies
❌ client/dist/ - build output
```

### Step 2: Connect to Vercel

1. Go to **https://vercel.com**
2. Click **"Add New..." → "Project"**
3. Select **"Import Git Repository"**
4. Search for: `n2023ik/ecoomerce`
5. Click **Import**

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables:

**Add Variable 1: MONGO_URI**
```
Key: MONGO_URI
Value: mongodb+srv://pandeynikhil429_db_user:41dbgUO7SwLPOtRW@shopease.szfui48.mongodb.net/?appName=shopease
Environment: Production, Preview, Development
```

**Add Variable 2: JWT_SECRET**
```
Key: JWT_SECRET
Value: your-strong-jwt-secret-key-here
Environment: Production, Preview, Development
```

**Add Variable 3: NODE_ENV**
```
Key: NODE_ENV
Value: production
Environment: Production
```

**Add Variable 4: FRONTEND_URL**
```
Key: FRONTEND_URL
Value: https://yourdomain.vercel.app
Environment: Production
```

**Add Variable 5: CORS_ORIGINS**
```
Key: CORS_ORIGINS
Value: https://yourdomain.vercel.app,https://www.yourdomain.vercel.app
Environment: Production
```

### Step 4: Configure Build & Output Settings

In Vercel Project Settings → Build & Output Settings:

**Build Command:**
```bash
cd client && npm run build
```

**Output Directory:**
```bash
client/dist
```

**Install Command:**
```bash
npm install
```

**Framework Preset:**
Select: **"Other"** (since it's a monorepo)

### Step 5: Deploy

Click **"Deploy"** button

Vercel will:
1. ✅ Install dependencies
2. ✅ Build frontend (client/)
3. ✅ Prepare backend (app.js)
4. ✅ Set environment variables
5. ✅ Deploy to production

---

## ✅ Verification Checklist

After deployment:

### Test API Endpoints
```bash
# Replace with your Vercel domain
DOMAIN=https://yourdomain.vercel.app

# Test API connectivity
curl $DOMAIN/api/products

# Test auth endpoint
curl -X POST $DOMAIN/api/auth/register

# Test admin endpoint
curl $DOMAIN/api/dashboard
```

### Test Frontend
```
1. Open https://yourdomain.vercel.app in browser
2. Should load ShopEase homepage
3. Check DevTools → Network tab
4. Verify API calls to /api/* endpoints
5. Test login/register functionality
```

### Check Logs
In Vercel Dashboard:
- **Deployments** → Select latest → View logs
- Look for errors or warnings
- Verify MongoDB connection succeeded

### Monitor Performance
In Vercel Dashboard:
- **Analytics** → View traffic, performance metrics
- Check API response times
- Monitor error rates

---

## 📊 Expected Behavior

### Successful Deployment
```
✅ Frontend loads at https://yourdomain.vercel.app
✅ API endpoints respond at /api/*
✅ MongoDB connection successful
✅ Authentication working
✅ Products loading from database
✅ No CORS errors
✅ No 502/503 errors
```

### Common Issues & Solutions

**Issue: "Cannot find module"**
```
Solution: Run npm install locally, commit package-lock.json
```

**Issue: "MONGO_URI is undefined"**
```
Solution: Verify environment variable is set in Vercel settings
         Name must be exactly: MONGO_URI
```

**Issue: "CORS error"**
```
Solution: Update CORS_ORIGINS in .env to include Vercel domain
         Format: https://yourdomain.vercel.app
```

**Issue: "502 Bad Gateway"**
```
Solution: Check logs for errors
         May be database timeout, increase timeout value
         Verify MongoDB connection string
```

**Issue: "Build failed"**
```
Solution: Check Vercel build logs for errors
         Run: npm run build locally to test
         Verify all dependencies in package.json
```

---

## 🔄 Redeployment

When you push changes to GitHub:

```bash
# 1. Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# 2. Vercel automatically redeploys
# 3. View deployment status in Vercel Dashboard
```

**Manual redeploy:**
1. Vercel Dashboard → Select project
2. Click **"Redeploy"** button
3. Or click **"New Deployment"**

---

## 🔐 Environment Variables Reference

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| MONGO_URI | MongoDB connection string | ✅ Yes | From MongoDB Atlas |
| JWT_SECRET | Strong random string | ✅ Yes | Generate with openssl |
| NODE_ENV | production | ✅ Yes | Must be production |
| FRONTEND_URL | https://yourdomain.vercel.app | ✅ Yes | Your Vercel domain |
| CORS_ORIGINS | https://yourdomain.vercel.app | ✅ Yes | Comma-separated list |
| COOKIE_SECURE | true | No | HTTPS only (production) |
| DEBUG | false | No | Disable debug logging |

---

## 📝 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "cd client && npm run build",
  "public": "client/dist",
  "env": ["MONGO_URI", "JWT_SECRET", "NODE_ENV", "FRONTEND_URL"],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### .env.production
```
MONGO_URI=mongodb+srv://pandeynikhil429_db_user:41dbgUO7SwLPOtRW@shopease.szfui48.mongodb.net/?appName=shopease
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
FRONTEND_URL=https://yourdomain.vercel.app
CORS_ORIGINS=https://yourdomain.vercel.app
```

---

## 🎯 Next Steps

### After Successful Deployment

1. **Configure Domain**
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain (optional)
   - Update DNS settings

2. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor API performance

3. **Configure CI/CD**
   - Vercel auto-deploys on push
   - Configure branch preview deployments
   - Set up deployment aliases

4. **Security**
   - Rotate JWT_SECRET periodically
   - Monitor MongoDB access
   - Enable 2FA on GitHub and Vercel
   - Review CORS settings

5. **Performance Optimization**
   - Enable Vercel caching
   - Configure CDN
   - Optimize images
   - Monitor Core Web Vitals

---

## 📞 Troubleshooting

### How to View Logs
1. Vercel Dashboard → Deployments
2. Click on latest deployment
3. View Logs section

### How to Rollback
1. Vercel Dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"

### How to Monitor Errors
1. Vercel Dashboard → Analytics
2. Check error rates
3. Review specific errors

### Database Troubleshooting
```bash
# Test MongoDB connection
mongo "mongodb+srv://pandeynikhil429_db_user:41dbgUO7SwLPOtRW@shopease.szfui48.mongodb.net/?appName=shopease"

# Check MongoDB Atlas logs
# 1. Go to MongoDB Atlas
# 2. Project → Activity
# 3. Review connection logs
```

---

## 🎉 Success!

Your ShopEase platform is now deployed on Vercel!

**Access your application:**
```
Frontend: https://yourdomain.vercel.app
API: https://yourdomain.vercel.app/api/*
```

**Share with team:**
```
1. Vercel Dashboard → Settings → General
2. Copy deployment URL
3. Share with team members
```

---

## 📚 Additional Resources

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Express.js: https://expressjs.com/
- React: https://react.dev/

---

**Deployment Date**: November 13, 2025  
**Status**: ✅ Production Ready  
**Version**: 2.0 (Performance Edition)
