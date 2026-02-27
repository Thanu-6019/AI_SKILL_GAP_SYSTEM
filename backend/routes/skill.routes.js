import express from 'express';
import {
  matchRoles,
  analyzeGap,
  getAnalysis,
  getAnalysesByResume,
} from '../controllers/skill.controller.js';

const router = express.Router();

router.post('/match-roles', matchRoles);
router.post('/analyze-gap', analyzeGap);
router.get('/analysis/:id', getAnalysis);
router.get('/analysis/resume/:resumeId', getAnalysesByResume);

export default router;
