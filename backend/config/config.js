import process from 'node:process';

export default {
  // Google Gemini AI Configuration
  gemini: {
    apiKey: 'AIzaSyB18zhhaNk2oBdqd4x8aEZJzV6Hd00nVus',
    model: 'gemini-1.5-flash',
    maxTokens: 2000,
    temperature: 0.7,
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    allowedMimeTypes: ['application/pdf'],
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '7d',
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  
  // Skill Analysis Thresholds
  skillAnalysis: {
    highMatchThreshold: 80,
    mediumMatchThreshold: 60,
    highPriorityGap: 20,
    mediumPriorityGap: 10,
  },
};
