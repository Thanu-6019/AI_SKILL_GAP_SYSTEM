# 🎯 AI Skill Gap Analysis System - Complete Documentation

<div align="center">

![AI Skill Gap](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-orange)

**An intelligent career development platform that analyzes your resume, identifies skill gaps, and provides personalized learning recommendations using AI.**

</div>

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [Application Flow](#application-flow)
6. [Project Structure](#project-structure)
7. [API Reference](#api-reference)
8. [User Journeys](#user-journeys)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)

---

## 📋 Overview

The AI Skill Gap Analysis System is a full-stack web application that helps professionals:
- 📄 Upload and analyze their resumes
- 🤖 Automatically extract skills using AI (OpenAI GPT)
- 🎯 Match profiles with suitable job roles
- 📊 Identify skill gaps for target positions
- 📚 Get personalized course recommendations
- 🗺️ Create customized career roadmaps with phase-based learning
- 📈 Track progress through certificate uploads

---

## ✨ Features

### 🎨 Frontend Features
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and dark theme
- **Landing Page**: Clean entry point with Login/Sign Up options
- **Authentication**: Secure JWT-based authentication
- **Resume Upload**: Drag-and-drop PDF upload with validation
- **AI Processing Visualization**: Real-time processing status with animations
- **Role Matching**: Interactive role selection with match scores
- **Gap Analysis Dashboard**: Comprehensive visualization of skill gaps
- **Phase-Based Roadmap**: Structured learning path with unlockable phases
- **Certificate Upload**: Track progress by uploading course certificates
- **Skill Radar Chart**: Visual representation of current skills
- **Course Recommendations**: Personalized learning resources

### ⚙️ Backend Features
- **User Management**: Registration, login, profile management
- **PDF Parsing**: Extract text from PDF resumes
- **AI Skill Extraction**: OpenAI-powered skill identification and analysis
- **Intelligent Role Matching**: Match skills with job market requirements
- **Gap Analysis**: Calculate skill gaps and proficiency levels
- **Roadmap Generation**: Create personalized phase-based learning paths
- **Progress Tracking**: Store certificate uploads and phase completions
- **RESTful API**: Well-structured API endpoints
- **MongoDB Integration**: Persistent data storage with user-scoped data
- **Security**: Rate limiting, CORS, Helmet protection, JWT authentication

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 with Vite
- **React Router** v7 for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Heroicons** for iconography
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **OpenAI API** (GPT-3.5/4) for AI features
- **JWT** (jsonwebtoken) for authentication
- **pdf-parse** for PDF processing
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **express-rate-limit** for API rate limiting
- **helmet** for security headers
- **morgan** for logging

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)
- **npm** or **yarn** package manager

### Step 1: Install Dependencies

#### Frontend
```bash
# From project root
npm install
```

#### Backend
```bash
# Navigate to backend folder
cd backend
npm install
```

### Step 2: Environment Configuration

#### Backend Configuration
Create `backend/.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ai-skill-gap
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

#### Frontend Configuration
Create `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Step 3: Start MongoDB

#### Option A: Local MongoDB
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in backend/.env

### Step 4: Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm start
```
Backend will run at: `http://localhost:5001`

#### Start Frontend (Terminal 2)
```bash
# From project root
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## 🔄 Application Flow

### 1. **Landing Page**
When the website loads, users see a landing page with ONLY two buttons:
- **Login** - For existing users
- **Sign Up** - For new users

No other content loads before authentication.

### 2. **Existing User Flow (Login)**

```
Landing Page → Login
                ↓
        Check if user has analysis
                ↓
    ┌───────────┴───────────┐
    │                       │
Has Analysis          No Analysis
    ↓                       ↓
Dashboard              Resume Upload
(with saved data)
```

**What happens:**
- User enters email and password
- System validates credentials
- Checks backend for existing `jobTitle` and `roadmap`
- **If analysis exists**: Redirects to Dashboard with all saved data:
  - Selected job role
  - Generated roadmap
  - Completed phases
  - Uploaded certificates
  - Course progress
- **If no analysis**: Redirects to Resume Upload to start fresh

**Important:** Dashboard does NOT regenerate analysis for existing users. It fetches stored data from the database.

### 3. **New User Flow (Sign Up)**

```
Landing Page → Sign Up
                ↓
        Resume Upload
                ↓
        AI Processing
                ↓
        Role Selection
                ↓
      Skill Gap Analysis
                ↓
    Roadmap Generation
                ↓
          Dashboard
        (Phase 1 starts)
```

**Step-by-step:**

**Step 1: Sign Up**
- User creates account with name, email, password
- System creates user in database
- Redirects to Resume Upload

**Step 2: Resume Upload**
- User uploads PDF resume
- File is validated (PDF only)
- Proceeds to AI Processing

**Step 3: AI Processing**
- System extracts text from PDF
- OpenAI analyzes resume and extracts skills
- Matches skills against job role database
- Calculates match scores
- Automatically redirects to Role Selection

**Step 4: Role Selection**
- Displays matched job roles with scores
- Shows salary ranges and required skills
- User selects target role
- System calculates detailed skill gap

**Step 5: Analysis Result**
- Shows overall gap score
- Displays current skills vs required skills
- Lists missing skills with priorities
- Shows recommended courses
- User proceeds to Dashboard

**Step 6: Dashboard**
- Displays phase-based learning roadmap
- Shows Phase 1 (unlocked)
- Lists skills to learn in Phase 1
- Shows recommended courses
- Provides certificate upload option

### 4. **Dashboard Behavior**

The Dashboard is the main hub for learning progress:

**Phase System:**
- **Phase 1**: Unlocked by default (Foundations)
- **Phase 2-N**: Locked until previous phase is completed

**How to Complete a Phase:**
1. Review skills required for the phase
2. Take recommended courses
3. Upload certificate for each skill
4. Once ALL skills in a phase are approved → Phase is completed
5. Next phase automatically unlocks

**Features:**
- Visual progress tracking (% complete)
- Skill radar chart
- Course recommendations with direct links
- Certificate upload (URL or file)
- Phase locking/unlocking mechanism
- Recommended skills per phase

---

## 📁 Project Structure

```
AI_SKILL_GAP_SYSTEM/
│
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── config.js            # Environment variables
│   │
│   ├── models/
│   │   ├── User.model.js        # User schema with roadmap
│   │   ├── JobRole.model.js     # Job roles database
│   │   └── SkillGapAnalysis.model.js
│   │
│   ├── controllers/
│   │   ├── user.controller.js   # Auth & user management
│   │   ├── resume.controller.js # Resume analysis
│   │   ├── role.controller.js   # Role matching
│   │   └── skill.controller.js  # Skill operations
│   │
│   ├── routes/
│   │   ├── user.routes.js       # /api/users/*
│   │   ├── resume.routes.js     # /api/resume/*
│   │   ├── role.routes.js       # /api/roles/*
│   │   └── skill.routes.js      # /api/skills/*
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── upload.js            # Multer file upload
│   │   └── errorHandler.js      # Global error handling
│   │
│   ├── services/
│   │   ├── ai.service.js        # OpenAI integration
│   │   └── pdf.service.js       # PDF parsing
│   │
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server entry
│   └── package.json
│
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Landing page (Login/Sign Up)
│   │   ├── auth/
│   │   │   └── Login.jsx        # Login/Signup form
│   │   ├── ResumeUpload.jsx     # Resume upload page
│   │   ├── AIProcessing.jsx     # Processing animation
│   │   ├── RoleSelection.jsx    # Job role selection
│   │   ├── AnalysisResult.jsx   # Skill gap analysis
│   │   └── Dashboard.jsx        # Main dashboard
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx    # Auth components
│   │   ├── layout/
│   │   │   └── DashboardLayout.jsx # Dashboard layout
│   │   ├── common/
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   └── ui/                  # Reusable UI components
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── SkillGapContext.jsx  # Application state
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx        # Route configuration
│   │
│   ├── services/
│   │   └── api.js               # API service layer
│   │
│   ├── utils/
│   │   └── userStorage.js       # LocalStorage helpers
│   │
│   └── App.jsx                  # Root component
│
├── .env                          # Frontend env variables
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── package.json
└── PROJECT_DOCUMENTATION.md     # This file
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "name": "John Doe",
    "email": "john@example.com",
    "id": "user_id"
  }
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "name": "John Doe",
    "email": "john@example.com",
    "jobTitle": "Software Engineer",
    "roadmap": { ... }
  }
}
```

#### Get Current User
```http
GET /users/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "jobTitle": "Software Engineer",
    "department": "Technology",
    "roadmap": {
      "phases": [...]
    },
    "lastLogin": "2026-03-05T10:30:00Z"
  }
}
```

### Resume Analysis Endpoints

#### Upload & Analyze Resume
```http
POST /resume/analyze
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- resume: (PDF file)

Response:
{
  "success": true,
  "data": {
    "extractedText": "...",
    "skills": [
      {
        "name": "JavaScript",
        "proficiency": 85,
        "category": "Programming"
      }
    ]
  }
}
```

#### Match Job Roles
```http
POST /roles/match
Authorization: Bearer {token}
Content-Type: application/json

{
  "skills": ["JavaScript", "React", "Node.js"]
}

Response:
{
  "success": true,
  "data": {
    "matches": [
      {
        "title": "Full Stack Developer",
        "matchScore": 87,
        "salaryRange": "$80K - $120K",
        "requiredSkills": [...],
        "demandLevel": "High"
      }
    ]
  }
}
```

#### Calculate Skill Gap
```http
POST /skills/gap
Authorization: Bearer {token}
Content-Type: application/json

{
  "roleId": "role_id",
  "currentSkills": [...]
}

Response:
{
  "success": true,
  "data": {
    "overallScore": 75,
    "missingSkills": [...],
    "recommendedCourses": [...],
    "roadmap": {
      "phases": [...]
    }
  }
}
```

#### Upload Certificate
```http
POST /users/me/certificate
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- certificate: (file)
- phaseIndex: 0
- skillIndex: 0
- platform: "Udemy"

Response:
{
  "success": true,
  "data": {
    "certificateUrl": "/uploads/certificates/file.pdf"
  }
}
```

---

## 👥 User Journeys

### Journey 1: New User - Career Switch

**Scenario:** Sarah is a marketing professional wanting to switch to web development.

1. **Landing Page**: Clicks "Sign Up"
2. **Sign Up**: Creates account
3. **Resume Upload**: Uploads her marketing resume
4. **AI Processing**: System extracts skills (PowerPoint, Excel, Campaign Management)
5. **Role Selection**: 
   - Sees low match (35%) for Senior Developer roles
   - Explores "Career Switch" roles
   - Selects "Junior Frontend Developer" (52% match)
6. **Analysis Result**: 
   - Shows she has transferable skills (Problem Solving, Communication)
   - Missing: HTML, CSS, JavaScript, React
   - Recommends beginner courses
7. **Dashboard**: 
   - Phase 1: HTML/CSS Fundamentals (unlocked)
   - Phase 2: JavaScript Basics (locked)
   - Phase 3: React & Modern Frontend (locked)
8. **Learning**: 
   - Takes HTML course, uploads certificate
   - Takes CSS course, uploads certificate
   - Takes JavaScript course, uploads certificate
   - Phase 1 completes → Phase 2 unlocks

### Journey 2: Existing User - Continuing Progress

**Scenario:** Mike logged in 2 weeks ago, completed Phase 1, returns to continue.

1. **Landing Page**: Clicks "Login"
2. **Login**: Enters credentials
3. **Auto-redirect to Dashboard**: 
   - System checks: Has jobTitle ✓, Has roadmap ✓
   - Immediately loads dashboard
4. **Dashboard Shows**:
   - Job Role: "Full Stack Developer"
   - Phase 1: ✓ Completed (3/3 skills approved)
   - Phase 2: 🔓 Unlocked (1/4 skills completed)
   - Phase 3: 🔒 Locked
5. **Continue Learning**:
   - Picks up where he left off in Phase 2
   - No need to re-upload resume or re-analyze

---

## 🔧 Development Guide

### Running in Development Mode

#### Backend Development
```bash
cd backend

# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

#### Frontend Development
```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing the API

Use the included PowerShell test script:
```powershell
# Test backend connection
.\test-api-connection.ps1
```

### Database Seeding

To populate the database with sample job roles:
```bash
cd backend
node seed.js
```

This creates sample roles like:
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Scientist
- UI/UX Designer
- etc.

### Key Configuration Files

#### vite.config.js
```javascript
export default {
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
}
```

#### backend/config/database.js
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

---

## 🐛 Troubleshooting

### Issue: Backend Won't Start

**Problem:** `Error: Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

### Issue: MongoDB Connection Failed

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl status mongod
   ```
2. Verify `MONGODB_URI` in `backend/.env`
3. For MongoDB Atlas, check network access whitelist

### Issue: OpenAI API Errors

**Problem:** `Error: OpenAI API key not found`

**Solution:**
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Restart backend server

### Issue: Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5001`

**Solution:**
```powershell
# Windows - Find and kill process
$process = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($process) { taskkill /PID $process /F }
```

### Issue: Dashboard Shows No Data

**Problem:** Existing user sees empty dashboard

**Solution:**
1. Check browser console for API errors
2. Verify `/api/users/me` returns data
3. Check if user has `jobTitle` and `roadmap` in database:
   ```javascript
   // MongoDB shell
   db.users.findOne({email: "user@example.com"})
   ```
4. If no data, user needs to re-run analysis flow

### Issue: Certificate Upload Fails

**Problem:** `Failed to upload certificate`

**Solution:**
1. Check `backend/uploads/certificates/` folder exists
2. Verify file size < 5MB
3. Check backend logs for specific error
4. Ensure JWT token is valid

---

## 🔐 Security Considerations

### Authentication
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration
- Protected routes require valid token

### API Security
- Rate limiting (100 requests per 15 minutes)
- CORS configured for frontend origin
- Helmet.js for security headers
- Input validation and sanitization

### File Upload Security
- Only PDF files accepted for resumes
- Only image/PDF for certificates
- File size limits (5MB for resumes, 5MB for certificates)
- Files stored outside public directory

---

## 📊 Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  jobTitle: String,
  department: String,
  resumeText: String,
  extractedSkills: [String],
  roadmap: {
    phases: [{
      title: String,
      duration: String,
      locked: Boolean,
      completed: Boolean,
      skills: [{
        name: String,
        completed: Boolean,
        approved: Boolean,
        certificateUrl: String,
        platform: String
      }],
      resources: [{
        courseName: String,
        platform: String,
        link: String
      }]
    }]
  },
  lastLogin: Date,
  createdAt: Date
}
```

### Job Role Schema
```javascript
{
  title: String,
  category: String,
  requiredSkills: [String],
  salaryRange: String,
  description: String,
  demandLevel: String,
  companies: Number
}
```

---

## 🚀 Deployment

### Environment Variables for Production

#### Backend
```env
PORT=5001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production
JWT_SECRET=strong_secret_key_min_32_chars
OPENAI_API_KEY=sk-...
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Build for Production

```bash
# Frontend
npm run build
# Output: dist/ folder

# Backend
# No build needed, deploy as-is with dependencies
```

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, DigitalOcean, AWS EC2, or Railway
- **Database**: MongoDB Atlas (free tier available)

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For questions or issues:
- Check this documentation first
- Review the [Troubleshooting](#troubleshooting) section
- Check application logs (browser console + backend terminal)
- Verify all environment variables are set correctly

---

## 🎉 Acknowledgments

- OpenAI for GPT API
- MongoDB for database
- React team for amazing framework
- Tailwind CSS for beautiful styling
- Heroicons for iconography

---

**Last Updated:** March 5, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
