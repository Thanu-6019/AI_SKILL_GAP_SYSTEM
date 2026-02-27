# AI Skill Gap System - Backend API

## Overview
Backend API for the AI-powered skill gap analysis system. This API handles resume processing, skill extraction, role matching, and personalized career recommendations using OpenAI.

## Features
- 📄 Resume upload and PDF parsing
- 🤖 AI-powered skill extraction using OpenAI GPT
- 🎯 Intelligent role matching
- 📊 Comprehensive skill gap analysis
- 📚 Personalized course recommendations
- 🗺️ Career roadmap generation
- 👤 User authentication and profiles
- 🔒 Rate limiting and security features

## Tech Stack
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI GPT-3.5/4
- **File Processing**: pdf-parse for PDF extraction
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API Key

### Setup Steps

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables in .env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skill-gap-db
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Resume Management
- `POST /api/resume/upload` - Upload and process resume
- `GET /api/resume/:id` - Get resume by ID
- `GET /api/resume` - Get all resumes
- `DELETE /api/resume/:id` - Delete resume

### Skill Analysis
- `POST /api/skills/match-roles` - Match roles for extracted skills
- `POST /api/skills/analyze-gap` - Analyze skill gap for target role
- `GET /api/skills/analysis/:id` - Get analysis by ID
- `GET /api/skills/analysis/resume/:resumeId` - Get all analyses for a resume

### Job Roles
- `GET /api/roles` - Get all job roles
- `GET /api/roles/:id` - Get role by ID
- `GET /api/roles/search?q=keyword` - Search roles

### Courses
- `GET /api/courses/recommendations?skills=skill1,skill2` - Get course recommendations
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/search?q=keyword` - Search courses

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)
- `PUT /api/users/me` - Update user profile (protected)

### Health Check
- `GET /api/health` - API health status

## Example Usage

### 1. Upload Resume
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@path/to/resume.pdf"
```

Response:
```json
{
  "success": true,
  "data": {
    "resumeId": "648a1b2c3d4e5f6g7h8i9j0k",
    "fileName": "resume.pdf",
    "extractedSkills": [
      {
        "name": "React",
        "level": 75,
        "category": "Frontend",
        "yearsOfExperience": 2
      }
    ],
    "aiConfidence": 92
  }
}
```

### 2. Match Roles
```bash
curl -X POST http://localhost:5000/api/skills/match-roles \
  -H "Content-Type: application/json" \
  -d '{"resumeId": "648a1b2c3d4e5f6g7h8i9j0k", "topN": 5}'
```

### 3. Analyze Skill Gap
```bash
curl -X POST http://localhost:5000/api/skills/analyze-gap \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "648a1b2c3d4e5f6g7h8i9j0k",
    "targetRole": {
      "title": "Full Stack Developer",
      "requiredSkills": ["React", "Node.js", "MongoDB", "AWS"]
    }
  }'
```

## Project Structure
```
backend/
├── config/
│   ├── config.js          # Application configuration
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── course.controller.js
│   ├── resume.controller.js
│   ├── role.controller.js
│   ├── skill.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Error handling
│   ├── rateLimiter.js     # Rate limiting
│   └── upload.js          # File upload
├── models/
│   ├── JobRole.model.js
│   ├── Resume.model.js
│   ├── SkillGapAnalysis.model.js
│   └── User.model.js
├── routes/
│   ├── course.routes.js
│   ├── resume.routes.js
│   ├── role.routes.js
│   ├── skill.routes.js
│   └── user.routes.js
├── services/
│   ├── ai.service.js      # OpenAI integration
│   └── pdf.service.js     # PDF processing
├── uploads/               # Uploaded files (auto-created)
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js             # Entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/skill-gap-db |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload size in bytes | 5242880 (5MB) |

## Security Features
- Helmet for security headers
- CORS configuration
- Rate limiting on sensitive endpoints
- File upload size limits
- PDF validation
- JWT authentication
- Input validation

## Error Handling
All errors return a consistent format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Rate Limits
- General API: 100 requests per 15 minutes
- Resume Upload: 10 requests per hour
- Authentication: 5 requests per 15 minutes

## Notes
- Requires OpenAI API key for AI features
- MongoDB must be running
- Uploaded files are stored in `./uploads` directory
- PDF files only (5MB max)

## Support
For issues or questions, please open an issue in the repository.
