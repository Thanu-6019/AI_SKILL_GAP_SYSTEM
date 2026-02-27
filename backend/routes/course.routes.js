import express from 'express';
import {
  getCourseRecommendations,
  getCourseById,
  searchCourses,
} from '../controllers/course.controller.js';

const router = express.Router();

router.get('/recommendations', getCourseRecommendations);
router.get('/search', searchCourses);
router.get('/:id', getCourseById);

export default router;
