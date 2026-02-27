# 🚀 Quick Start Commands

## Development Mode (Recommended)

### Start Backend Server
```powershell
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Start Frontend Server (in new terminal)
```powershell
npm run dev
```
Frontend runs on: http://localhost:5173

---

## First Time Setup Checklist

### 1. Install Dependencies
```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

**Backend (.env in backend folder):**
```env
MONGODB_URI=mongodb://localhost:27017/skill-gap-db
OPENAI_API_KEY=sk-your-actual-key-here
JWT_SECRET=change-this-to-random-string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env in root folder):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB
**Option A: Local MongoDB**
- Open MongoDB Compass, or
- Run `mongod` in terminal

**Option B: MongoDB Atlas**
- Use cloud connection string in `MONGODB_URI`

### 4. Seed Database (Optional)
```powershell
cd backend
npm run seed
```

### 5. Start Servers
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
npm run dev
```

---

## Common Commands

### Backend Commands (run from `backend/` folder)
```powershell
npm run dev      # Start in development mode (auto-reload)
npm start        # Start in production mode
npm run seed     # Seed database with sample data
```

### Frontend Commands (run from root folder)
```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Testing the Application

### 1. Check Backend Health
Open in browser: http://localhost:5000/api/health

Expected response:
```json
{
  "success": true,
  "message": "AI Skill Gap API is running",
  "timestamp": "..."
}
```

### 2. Test Full Flow
1. Go to http://localhost:5173
2. Click "Get Started - Upload Resume"
3. Upload a PDF resume
4. Wait for AI processing (30-60 seconds)
5. View matched roles
6. Select a target role
7. View skill gap analysis

---

## Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

**Cost:** ~$0.002 per resume analysis (very affordable)

---

## MongoDB Setup Options

### Option 1: Local MongoDB (Free, Unlimited)
1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Use in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/skill-gap-db
   ```

### Option 2: MongoDB Atlas (Cloud, Free Tier)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Use in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-gap-db
   ```

---

## Troubleshooting

### Backend won't start
```powershell
# Check if MongoDB is running
mongosh

# Check if port 5000 is available
netstat -ano | findstr :5000

# Reinstall dependencies
cd backend
rm -r node_modules
rm package-lock.json
npm install
```

### Frontend won't start
```powershell
# Reinstall node_modules
rm -r node_modules
rm package-lock.json
npm install
```

### OpenAI errors
- Verify `OPENAI_API_KEY` in `backend/.env`
- Check API key has credits: https://platform.openai.com/usage
- Ensure no extra spaces in the key

### Upload not working
- Check `backend/uploads/` folder exists
- Verify PDF file is valid
- Ensure file size < 5MB

---

## Project URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |
| API Docs | http://localhost:5000 |

---

## Need Help?

📖 **Detailed Setup**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
📝 **API Documentation**: See [backend/README.md](backend/README.md)
🐛 **Issues**: Check troubleshooting sections in guides

---

**Quick Summary:**
1. Install: `npm install` (root) and `cd backend && npm install`
2. Configure: Create `.env` files with OpenAI key and MongoDB URI
3. Start MongoDB
4. Run: `cd backend && npm run dev` + `npm run dev` (in separate terminals)
5. Open: http://localhost:5173

**You're all set! 🎉**
