import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updateRoadmap,
  addNotification,
  getNotifications,
  markNotificationRead,
  uploadCertificate,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { certificateUpload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/me/roadmap', protect, updateRoadmap);
router.post('/me/notifications', protect, addNotification);
router.get('/me/notifications', protect, getNotifications);
router.put('/me/notifications/:notificationId/read', protect, markNotificationRead);
router.post('/me/certificate', protect, certificateUpload.single('certificate'), uploadCertificate);

export default router;
