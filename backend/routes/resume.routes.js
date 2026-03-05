import express from 'express';
import {
  uploadResume,
  getResume,
  getAllResumes,
  deleteResume,
} from '../controllers/resume.controller.js';
import upload from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting and authentication to upload endpoint
router.post('/upload', protect, uploadLimiter, upload.single('resume'), uploadResume);
router.get('/', protect, getAllResumes);
router.get('/:id', protect, getResume);
router.delete('/:id', protect, deleteResume);

export default router;
