# AI Skill Gap Analysis System - Complete Setup Guide

## 🎯 Project Overview
A full-stack AI-powered career development platform that analyzes resumes, identifies skill gaps, and provides personalized learning recommendations using OpenAI GPT.

## 📋 Features
- **Resume Upload & Parsing**: Extract text from PDF resumes
- **AI Skill Extraction**: Automatically identify skills and proficiency levels
- **Role Matching**: Match candidate skills with job market requirements
- **Gap Analysis**: Comprehensive skill gap identification
- **Course Recommendations**: Personalized learning path suggestions
- **Career Roadmap**: Step-by-step career development plan
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** & **Heroicons** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **OpenAI API** (GPT-3.5/4) for AI features
- **JWT** authentication
- **pdf-parse** for PDF processing
- **Multer** for file uploads

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)
- **npm** or **yarn** package manager

## 🚀 Installation Guide

### Step 1: Clone or Download the Project
```bash
cd AI_SKILL_GAP_SYSTEM
```

### Step 2: Install Frontend Dependencies
```bash
# Install frontend packages
npm install
```

### Step 3: Install Backend Dependencies
```bash
# Navigate to backend folder
cd backend

# Install backend packages
npm install

# Go back to root
cd ..
```

### Step 4: Configure Backend Environment

1. Navigate to the backend folder
2. Copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```

3. Edit `backend/.env` and add your credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Choose ONE:
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/skill-gap-db

# Option 2: MongoDB Atlas (Cloud - Recommended)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skill-gap-db

# OpenAI API (REQUIRED)
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# JWT Secret (Change to a random secure string)
JWT_SECRET=change-this-to-a-secure-random-string-for-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Step 5: Configure Frontend Environment

1. In the root folder, create a `.env` file:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Set Up MongoDB

#### Option A: Local MongoDB
1. Start MongoDB service:
   - **Windows**: Open MongoDB Compass or run `mongod` in terminal
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud - Recommended for easy setup)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace in `backend/.env`: `MONGODB_URI=your-connection-string`

### Step 7: Seed Database (Optional but Recommended)
```bash
cd backend
npm run seed
```
This will populate your database with sample job roles.

## 🎮 Running the Application

### Option 1: Run Both Servers Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
# In root directory
npm run dev
```
Frontend will start on `http://localhost:5173`

### Option 2: Run Backend Only
```bash
cd backend
npm start
```

## 🧪 Testing the Application

### 1. Access the Application
Open your browser and navigate to: `http://localhost:5173`

### 2. Test the Resume Upload Flow
1. Click "Get Started - Upload Resume"
2. Upload a PDF resume
3. Wait for AI processing
4. View matched roles
5. Select a target role
6. View skill gap analysis and recommendations

### 3. Check Backend API
Test backend health: `http://localhost:5000/api/health`

## 📁 Project Structure

```
AI_SKILL_GAP_SYSTEM/
├── backend/
│   ├── config/              # Configuration files
│   ├── controllers/         # API controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── services/            # Business logic (AI, PDF)
│   ├── uploads/             # Uploaded files (auto-created)
│   ├── .env                 # Environment variables
│   ├── package.json
│   ├── seed.js              # Database seeder
│   └── server.js            # Entry point
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── context/             # React context
│   ├── services/            # API services
│   ├── constants/           # Constants
│   └── App.jsx
├── public/
├── .env                     # Frontend environment
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 Important Notes

### OpenAI API Key
- **Required** for AI features to work
- Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Free tier available with rate limits
- Estimated cost: ~$0.002 per resume analysis

### MongoDB Setup
- Local MongoDB is free and unlimited
- MongoDB Atlas free tier: 512MB storage
- Connection string format: `mongodb://localhost:27017/database-name`

### File Upload
- Only PDF files are accepted
- Maximum file size: 5MB
- Files are stored in `backend/uploads/`

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Try reinstalling dependencies
rm -rf node_modules package-lock.json
npm install
```

### Backend connection errors
- Check if MongoDB is running: `mongosh` or use MongoDB Compass
- Verify `MONGODB_URI` in `.env`
- Ensure port 5000 is not in use

### OpenAI errors
- Verify API key in `backend/.env`
- Check API key has available credits
- Ensure no extra spaces in the API key

### Upload failures
- Check `backend/uploads/` folder exists and has write permissions
- Verify PDF file is valid and not corrupted
- Check file size is under 5MB

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default should be `http://localhost:5173`

## 📊 API Endpoints

### Resume
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/:id` - Get resume
- `GET /api/resume` - Get all resumes
- `DELETE /api/resume/:id` - Delete resume

### Skills
- `POST /api/skills/match-roles` - Match roles
- `POST /api/skills/analyze-gap` - Analyze gap
- `GET /api/skills/analysis/:id` - Get analysis

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/search?q=keyword` - Search roles

### Courses
- `GET /api/courses/recommendations` - Get recommendations
- `GET /api/courses/search?q=keyword` - Search courses

## 🔒 Security Features
- Helmet for security headers
- CORS protection
- Rate limiting on uploads and authentication
- JWT token authentication
- File type validation
- File size limits

## 📝 Environment Variables Summary

### Backend (.env in backend folder)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

### Frontend (.env in root folder)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (default: http://localhost:5000/api) |

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Deploy `dist` folder
3. Set environment variable: `VITE_API_URL=your-backend-url`

### Backend Deployment (Heroku/Railway/Render)
1. Set all environment variables
2. Deploy backend folder
3. Use MongoDB Atlas for database

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## 📄 License
MIT License - See LICENSE file for details

---

**Happy Coding! 🎉**

Start with: `npm run dev` (frontend) and `cd backend && npm run dev` (backend)
