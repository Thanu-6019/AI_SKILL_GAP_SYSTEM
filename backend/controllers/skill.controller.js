import Resume from '../models/Resume.model.js';
import SkillGapAnalysis from '../models/SkillGapAnalysis.model.js';
import { aiService } from '../services/index.js';

// @desc    Match roles for extracted skills
// @route   POST /api/skills/match-roles
// @access  Public
export const matchRoles = async (req, res, next) => {
  try {
    const { resumeId, topN = 5 } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        error: 'Resume ID is required',
      });
    }

    // Get resume with extracted skills
    const resume = await Resume.findById(resumeId);

    if (!resume || !resume.extractedSkills || resume.extractedSkills.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or no skills extracted',
      });
    }

    console.log('🎯 Matching roles for skills...');
    
    // Use AI to match roles
    const matchedRoles = await aiService.matchRolesForSkills(resume.extractedSkills, topN);

    res.status(200).json({
      success: true,
      data: {
        roles: matchedRoles.roles,
        resumeSkills: resume.extractedSkills,
      },
    });
  } catch (error) {
    console.error('Role matching error:', error);
    next(error);
  }
};

// @desc    Analyze skill gap for target role
// @route   POST /api/skills/analyze-gap
// @access  Public
export const analyzeGap = async (req, res, next) => {
  try {
    const { resumeId, targetRole } = req.body;

    if (!resumeId || !targetRole) {
      return res.status(400).json({
        success: false,
        error: 'Resume ID and target role are required',
      });
    }

    // Get resume with extracted skills
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    console.log('📊 Analyzing skill gap...');
    
    // Use AI to analyze skill gap
    const gapAnalysis = await aiService.analyzeSkillGap(
      resume.extractedSkills,
      targetRole
    );

    // Generate career advice
    const advice = await aiService.generateCareerAdvice({
      overallScore: gapAnalysis.overallScore,
      missingSkills: gapAnalysis.missingSkills,
      targetRole: targetRole,
    });

    // Save analysis to database
    const analysis = await SkillGapAnalysis.create({
      resume: resumeId,
      targetRole: {
        title: targetRole.title,
        category: targetRole.category || 'Technology',
        requiredSkills: targetRole.requiredSkills || [],
      },
      overallScore: gapAnalysis.overallScore,
      missingSkills: gapAnalysis.missingSkills,
      weakSkills: gapAnalysis.weakSkills,
      strongSkills: gapAnalysis.strongSkills,
      recommendedCourses: gapAnalysis.recommendedCourses,
      careerRoadmap: gapAnalysis.careerRoadmap,
      aiConfidence: gapAnalysis.confidence || 85,
      analysis: advice,
    });

    console.log('✅ Skill gap analysis completed');

    res.status(200).json({
      success: true,
      data: {
        analysisId: analysis._id,
        overallScore: analysis.overallScore,
        missingSkills: analysis.missingSkills,
        weakSkills: analysis.weakSkills,
        strongSkills: analysis.strongSkills,
        recommendedCourses: analysis.recommendedCourses,
        careerRoadmap: analysis.careerRoadmap,
        aiConfidence: analysis.aiConfidence,
        analysis: analysis.analysis,
      },
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    next(error);
  }
};

// @desc    Get skill gap analysis by ID
// @route   GET /api/skills/analysis/:id
// @access  Public
export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await SkillGapAnalysis.findById(req.params.id)
      .populate('resume', 'fileName extractedSkills');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all analyses for a resume
// @route   GET /api/skills/analysis/resume/:resumeId
// @access  Public
export const getAnalysesByResume = async (req, res, next) => {
  try {
    const analyses = await SkillGapAnalysis.find({ resume: req.params.resumeId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};
