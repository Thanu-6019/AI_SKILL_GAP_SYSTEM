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

// Debug check (remove later if you want)
console.log("GEMINI API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");

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
const PORT = process.env.PORT || 5000;

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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});