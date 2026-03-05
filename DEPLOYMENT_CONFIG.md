# 🚀 Deployment Configuration Guide

## ✅ **Configuration Complete!**

Your application is now configured for deployment with the following settings:

### 📁 **Frontend Configuration**

**Development** ([.env](.env)):
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

**Production** ([.env.production](.env.production)):
```env
VITE_API_BASE_URL=https://ai-skill-gap-system-2.onrender.com/api
```

### 📁 **Backend Configuration**

**Development** ([backend/.env](backend/.env)):
- MongoDB: Local (`mongodb://localhost:27017/ai_skill_gap`)
- CORS: `http://localhost:5173`

**Production** ([backend/.env.production](backend/.env.production)):
- MongoDB: Atlas Cloud (`mongodb+srv://...`)
- CORS: `https://ai-skill-gap-system.onrender.com`

---

## 🌐 **Your Deployed URLs**

- **Frontend**: https://ai-skill-gap-system.onrender.com
- **Backend API**: https://ai-skill-gap-system-2.onrender.com/api

---

## 🔧 **Render Deployment Settings**

### **Backend (Node.js)**

**Environment Variables** (Set in Render Dashboard):
```bash
NODE_ENV=production
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://ai-skill-gap-system.onrender.com
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

**Build Command**: `npm install`  
**Start Command**: `node server.js`  
**Root Directory**: `backend`

### **Frontend (Static Site)**

**Environment Variables** (Set in Render Dashboard):
```bash
VITE_API_BASE_URL=https://ai-skill-gap-system-2.onrender.com/api
```

**Build Command**: `npm install && npm run build`  
**Publish Directory**: `dist`  
**Root Directory**: `.` (root)

---

## 🔄 **How It Works**

### **Automatic Environment Switching**

The application automatically uses the correct settings:

**Development** (Local):
```bash
npm run dev          # Frontend uses http://localhost:5001/api
cd backend && npm start    # Backend uses local MongoDB
```

**Production** (Render):
- Frontend automatically uses `.env.production`
- Backend uses environment variables from Render dashboard
- MongoDB Atlas is used for the database
- CORS allows your deployed frontend domain

---

## ✅ **Verification Checklist**

### **Backend Deployment**
- [ ] MongoDB Atlas cluster is running
- [ ] IP address `0.0.0.0/0` is whitelisted in MongoDB Network Access
- [ ] All environment variables are set in Render dashboard
- [ ] `NODE_ENV=production` is set
- [ ] Backend responds at: `https://ai-skill-gap-system-2.onrender.com/api`

### **Frontend Deployment**
- [ ] `VITE_API_BASE_URL` is set in Render dashboard
- [ ] Build completes successfully
- [ ] Frontend loads at: `https://ai-skill-gap-system.onrender.com`
- [ ] API calls reach the backend (check browser developer tools)

### **CORS Configuration**
- [ ] Backend `FRONTEND_URL` matches your frontend URL exactly
- [ ] No CORS errors in browser console
- [ ] Login/Register works from deployed frontend

---

## 🐛 **Common Issues & Solutions**

### **Issue: Frontend can't connect to backend**

**Check:**
1. Verify `VITE_API_BASE_URL` is set correctly in Render
2. Check browser console for CORS errors
3. Ensure backend `FRONTEND_URL` matches your frontend domain exactly

**Solution:**
```bash
# In Render Backend Environment Variables
FRONTEND_URL=https://ai-skill-gap-system.onrender.com
```

### **Issue: MongoDB connection fails in production**

**Check:**
1. MongoDB Atlas cluster is running (not paused)
2. Network Access has `0.0.0.0/0` whitelisted
3. `MONGO_URI` is correctly set in Render environment variables

**Solution:**
```bash
# Verify in Render Backend Environment Variables
MONGO_URI=mongodb+srv://skillgap_admin:Skillgap123@cluster0.jx01b6f.mongodb.net/ai_skill_gap?retryWrites=true&w=majority&appName=Cluster0
```

### **Issue: "JWT_SECRET not set" error**

**Solution:**
```bash
# Add to Render Backend Environment Variables
JWT_SECRET=skillbridge_ai_secret_key_for_production_change_this_in_production
```

### **Issue: Frontend shows old API URL**

**Cause:** Build cache

**Solution:**
1. Go to Render dashboard
2. Click "Clear Build Cache & Deploy"
3. Or update `VITE_API_BASE_URL` environment variable

---

## 📝 **Updating After Deployment**

### **Update Backend Code**
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render will auto-deploy.

### **Update Frontend Code**
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Render will rebuild and deploy.

### **Update Environment Variables**
1. Go to Render dashboard
2. Navigate to your service
3. Click "Environment"
4. Update variables
5. Save (auto-deploys)

---

## 🔒 **Security Best Practices**

### **Before Going Live:**

1. **Change JWT_SECRET** to a strong random value:
   ```bash
   # Generate a secure secret (run in terminal)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update MongoDB credentials** with a stronger password

3. **Restrict MongoDB Network Access**:
   - Remove `0.0.0.0/0`
   - Add only Render's IP addresses

4. **Enable MongoDB Atlas Monitoring**:
   - Set up alerts for unusual activity
   - Monitor connection patterns

5. **Never commit** `.env` files to Git:
   ```bash
   # Verify .gitignore includes
   .env
   .env.local
   backend/.env
   ```

---

## 📊 **Testing Your Deployment**

### **Test Backend API**
```bash
# Test health endpoint
curl https://ai-skill-gap-system-2.onrender.com/api

# Test registration
curl -X POST https://ai-skill-gap-system-2.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}'
```

### **Test Frontend**
1. Open: https://ai-skill-gap-system.onrender.com
2. Open browser developer tools (F12)
3. Check Network tab for API calls
4. Verify they go to `ai-skill-gap-system-2.onrender.com`
5. Test login/register functionality

---

## 🎉 **Your Application is Live!**

- Frontend: https://ai-skill-gap-system.onrender.com
- Backend: https://ai-skill-gap-system-2.onrender.com
- MongoDB: Cloud (Atlas)

All configurations are set up for both **local development** and **production deployment**! 🚀
