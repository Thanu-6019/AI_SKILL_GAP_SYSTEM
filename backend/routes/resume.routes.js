import express from 'express';
import {
  uploadResume,
  getResume,
  getAllResumes,
  deleteResume,
} from '../controllers/resume.controller.js';
import upload from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to upload endpoint
router.post('/upload', uploadLimiter, upload.single('resume'), uploadResume);
router.get('/', getAllResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

export default router;
