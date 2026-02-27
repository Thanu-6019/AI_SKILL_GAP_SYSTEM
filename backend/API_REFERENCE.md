# 🎯 Backend API - Quick Reference

## Base URL
```
http://localhost:5000/api
```

---

## 📄 Resume Endpoints

### Upload Resume
```http
POST /api/resume/upload
Content-Type: multipart/form-data

Body (form-data):
- resume: [PDF file]

Response (201):
{
  "success": true,
  "data": {
    "resumeId": "648a1b2c...",
    "fileName": "resume.pdf",
    "extractedSkills": [
      {
        "name": "React",
        "level": 75,
        "category": "Frontend",
        "yearsOfExperience": 2
      }
    ],
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "aiConfidence": 92
  }
}
```

### Get Resume
```http
GET /api/resume/:id
```

### Get All Resumes
```http
GET /api/resume
```

### Delete Resume
```http
DELETE /api/resume/:id
```

---

## 🎯 Skills Analysis Endpoints

### Match Roles
```http
POST /api/skills/match-roles
Content-Type: application/json

Body:
{
  "resumeId": "648a1b2c...",
  "topN": 5
}

Response (200):
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role-1",
        "title": "Frontend Developer",
        "matchScore": 82,
        "salaryRange": "$70K - $100K",
        "requiredSkills": ["React", "JavaScript", "CSS"],
        "demandLevel": "High",
        "companies": 150
      }
    ],
    "resumeSkills": [...]
  }
}
```

### Analyze Skill Gap
```http
POST /api/skills/analyze-gap
Content-Type: application/json

Body:
{
  "resumeId": "648a1b2c...",
  "targetRole": {
    "title": "Full Stack Developer",
    "requiredSkills": ["React", "Node.js", "MongoDB", "AWS"]
  }
}

Response (200):
{
  "success": true,
  "data": {
    "analysisId": "...",
    "overallScore": 75,
    "missingSkills": [
      {
        "name": "AWS",
        "priority": "High",
        "requiredLevel": 80,
        "demand": 90
      }
    ],
    "weakSkills": [...],
    "strongSkills": [...],
    "recommendedCourses": [...],
    "careerRoadmap": [...],
    "aiConfidence": 88
  }
}
```

### Get Analysis
```http
GET /api/skills/analysis/:id
```

### Get Analyses by Resume
```http
GET /api/skills/analysis/resume/:resumeId
```

---

## 💼 Job Roles Endpoints

### Get All Roles
```http
GET /api/roles

Response (200):
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": "...",
      "title": "Frontend Developer",
      "category": "Web Development",
      "requiredSkills": [...],
      "salaryRange": { "min": 70000, "max": 110000 },
      "demandLevel": "Very High"
    }
  ]
}
```

### Get Role by ID
```http
GET /api/roles/:id
```

### Search Roles
```http
GET /api/roles/search?q=developer
```

---

## 📚 Courses Endpoints

### Get Course Recommendations
```http
GET /api/courses/recommendations?skills=React,Node.js&level=intermediate

Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "course-1",
      "title": "Complete Web Development Bootcamp",
      "provider": "Udemy",
      "rating": 4.8,
      "students": 125000,
      "price": "$49.99",
      "duration": "40 hours",
      "level": "Beginner",
      "skills": ["HTML", "CSS", "JavaScript", "React"]
    }
  ]
}
```

### Get Course by ID
```http
GET /api/courses/:id
```

### Search Courses
```http
GET /api/courses/search?q=javascript
```

---

## 👤 User Endpoints

### Register
```http
POST /api/users/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJ..."
  }
}
```

### Login
```http
POST /api/users/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User (Protected)
```http
GET /api/users/me
Authorization: Bearer <token>
```

### Update Profile (Protected)
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "targetRole": "Full Stack Developer",
  "currentSkills": [...]
}
```

---

## 🏥 Health Check

```http
GET /api/health

Response (200):
{
  "success": true,
  "message": "AI Skill Gap API is running",
  "timestamp": "2024-02-27T10:30:00.000Z"
}
```

---

## 🔒 Authentication

For protected endpoints, include JWT token in header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

---

## 🔢 Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| General API | 100 requests per 15 minutes |
| Resume Upload | 10 requests per hour |
| Authentication | 5 requests per 15 minutes |

---

## 📝 Example: Complete Resume Analysis Flow

```javascript
// 1. Upload Resume
const formData = new FormData();
formData.append('resume', pdfFile);

const uploadResponse = await fetch('http://localhost:5000/api/resume/upload', {
  method: 'POST',
  body: formData
});
const { data: { resumeId } } = await uploadResponse.json();

// 2. Match Roles
const rolesResponse = await fetch('http://localhost:5000/api/skills/match-roles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeId, topN: 5 })
});
const { data: { roles } } = await rolesResponse.json();

// 3. Analyze Skill Gap
const analysisResponse = await fetch('http://localhost:5000/api/skills/analyze-gap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resumeId,
    targetRole: roles[0]
  })
});
const { data: analysis } = await analysisResponse.json();
```

---

## 🧪 Testing with cURL

### Upload Resume
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@path/to/resume.pdf"
```

### Match Roles
```bash
curl -X POST http://localhost:5000/api/skills/match-roles \
  -H "Content-Type: application/json" \
  -d '{"resumeId":"648a1b2c...","topN":5}'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

**For detailed setup and configuration, see [SETUP_GUIDE.md](../SETUP_GUIDE.md)**
