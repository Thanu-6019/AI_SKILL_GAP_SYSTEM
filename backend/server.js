// ======================
// LOAD ENV FIRST (VERY IMPORTANT)
// ======================
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES Modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force load .env from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

// ======================
// VALIDATE REQUIRED ENVIRONMENT VARIABLES
// ======================
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  WARNING: Missing environment variables:');
  missingEnvVars.forEach(varName => {
    console.warn(`   - ${varName}`);
  });
  console.warn('\nAI features will not work until these are set in backend/.env');
  // Do NOT exit — server still starts, but AI calls will throw helpful errors
}

console.log('✅ All required environment variables are set');
console.log('   - MongoDB URI:', process.env.MONGO_URI ? 'Configured' : 'Missing');
console.log('   - JWT Secret:', process.env.JWT_SECRET ? 'Configured' : 'Missing');
console.log('   - Groq API Key:', process.env.GROQ_API_KEY ? 'Configured ✅' : 'Missing ⚠️  (AI features disabled)');

// ======================
// IMPORTS
// ======================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

import resumeRoutes from './routes/resume.routes.js';
import skillRoutes from './routes/skill.routes.js';
import roleRoutes from './routes/role.routes.js';
import courseRoutes from './routes/course.routes.js';
import userRoutes from './routes/user.routes.js';

// ======================
// INITIALIZE APP
// ======================
const app = express();
const PORT = process.env.PORT || 5001;

// ======================
// CONNECT DATABASE
// ======================
connectDB();

// ======================
// MIDDLEWARE
// ======================
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// CORS Configuration - Allow frontend from various sources
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allowed origins list
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://aiskillgapsystem.vercel.app',        // Vercel deployment
      'https://ai-skill-gap-system.onrender.com',   // Render frontend (if used)
      process.env.FRONTEND_URL                       // Environment variable override
    ].filter(Boolean); // Remove undefined values

    // Allow all localhost/127.0.0.1 ports for development
    if (origin && origin.match(/^http:\/\/(localhost|127\.0\.0\.1):\d+$/)) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Log rejected origins in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
    }

    // Reject others
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// ROUTES
// ======================
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Skill Gap API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Skill Gap Analysis API',
    version: '1.0.0'
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use(errorHandler);

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Handle unhandled promise rejections - log but don't exit
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection:', err);
  console.error('Promise:', promise);
  // Don't exit - keep server running
  // Log the error and continue serving requests
});

// Handle uncaught exceptions - log but don't exit
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Don't exit - keep server running
  // Log the error and continue serving requests
});