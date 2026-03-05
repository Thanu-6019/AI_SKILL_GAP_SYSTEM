# 🎯 AI Skill Gap Analysis System

<div align="center">

![AI Skill Gap](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-orange)

**An intelligent career development platform that analyzes your resume, identifies skill gaps, and provides personalized learning recommendations using AI.**

📖 **[Complete Documentation →](PROJECT_DOCUMENTATION.md)** • 🚀 [Quick Start](#-quick-start) • 🛠️ [Setup](#-installation)

</div>

---

## 📋 Overview

The AI Skill Gap Analysis System is a full-stack web application that helps professionals:
- 📄 Upload and analyze their resumes
- 🤖 Automatically extract skills using AI (OpenAI GPT)
- 🎯 Match profiles with suitable job roles
- 📊 Identify skill gaps for target positions
- 📚 Get personalized course recommendations
- 🗺️ Create customized career roadmaps

## ✨ Features

### 🎨 Frontend Features
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Resume Upload**: Drag-and-drop PDF upload with validation
- **AI Processing Visualization**: Real-time processing status with animations
- **Role Matching**: Interactive role selection with match scores
- **Gap Analysis Dashboard**: Comprehensive visualization of skill gaps
- **Course Recommendations**: Personalized learning path suggestions
- **Career Roadmap**: Step-by-step career development plan

### ⚙️ Backend Features
- **PDF Parsing**: Extract text from PDF resumes
- **AI Skill Extraction**: OpenAI-powered skill identification
- **Intelligent Role Matching**: Match skills with job market requirements
- **Gap Analysis**: Calculate skill gaps and proficiency levels
- **RESTful API**: Well-structured API endpoints
- **MongoDB Integration**: Persistent data storage
- **Authentication**: JWT-based user authentication
- **Security**: Rate limiting, CORS, Helmet protection

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Heroicons** & **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **OpenAI API** - AI-powered analysis
- **JWT** - Authentication
- **pdf-parse** - PDF processing
- **Multer** - File uploads

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Configure environment variables:**
```bash
# Backend: Create backend/.env
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY and MONGODB_URI

# Frontend: Create .env in root
cd ..
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. **Seed database (optional):**
```bash
cd backend
npm run seed
```

5. **Start the application:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:5173
```

---

## 📚 Complete Documentation

For detailed information including:
- Full installation guide
- Application flow diagrams
- User journeys
- API reference
- Troubleshooting guide
- Deployment instructions

**👉 See [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)**

---

## 📁 Project Structure

```
AI_SKILL_GAP_SYSTEM/
├── backend/                 # Backend API
│   ├── config/             # Configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.js           # Entry point
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── context/           # State management
│   ├── services/          # API services
│   └── App.jsx
└── public/                # Static assets
```

## 🔑 Environment Variables

### Backend (backend/.env)
```env
MONGODB_URI=mongodb://localhost:27017/skill-gap-db
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload resume |
| POST | `/api/skills/match-roles` | Match roles |
| POST | `/api/skills/analyze-gap` | Analyze skill gap |
| GET | `/api/roles` | Get all job roles |
| GET | `/api/courses/recommendations` | Get courses |
| GET | `/api/health` | Health check |

[View complete API documentation](backend/README.md)

## 🎮 Usage

1. **Upload Resume**: Navigate to the app and upload your PDF resume
2. **AI Processing**: Wait for AI to extract and analyze your skills
3. **Select Role**: Choose from AI-recommended job roles
4. **View Analysis**: See your skill gap analysis and match score
5. **Get Recommendations**: Review personalized course recommendations and career roadmap

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure MongoDB is running
- Check `OPENAI_API_KEY` in `.env`
- Verify port 5000 is available

**Frontend connection errors:**
- Confirm backend is running on port 5000
- Check `VITE_API_URL` in `.env`

**Upload failures:**
- Verify PDF file is valid
- Check file size (max 5MB)
- Ensure `backend/uploads/` folder exists

**For comprehensive troubleshooting, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md#troubleshooting)**

## 🔒 Security

- JWT authentication
- Rate limiting on API endpoints
- File type and size validation
- CORS protection
- Helmet security headers

## 📝 License

MIT License - See [LICENSE](LICENSE) file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

<div align="center">

**Built with ❤️ using React, Node.js, MongoDB, and OpenAI**

[⬆ Back to Top](#-ai-skill-gap-analysis-system)

</div>

