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
    let matchedRoles;
    try {
      matchedRoles = await aiService.matchRolesForSkills(resume.extractedSkills, topN);
    } catch (aiError) {
      console.error('AI role matching error:', aiError);
      
      // Return specific status code for rate limiting
      const errorMsg = aiError.message || '';
      if (errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('too many requests')) {
        return res.status(429).json({
          success: false,
          error: 'AI service rate limit reached. Please wait 60 seconds before trying again.',
          retryAfter: 60,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: aiError.message || 'Failed to match roles. Please try again later.',
      });
    }

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
    console.log('📝 User skills:', resume.extractedSkills?.length, 'skills');
    console.log('🎯 Target role:', targetRole.title);
    console.log('✅ Required skills:', targetRole.requiredSkills);
    
    // Use AI to analyze skill gap
    let gapAnalysis;
    try {
      gapAnalysis = await aiService.analyzeSkillGap(
        resume.extractedSkills,
        targetRole
      );
    } catch (aiError) {
      console.error('AI gap analysis error:', aiError);
      
      // Return specific status code for rate limiting
      const errorMsg = aiError.message || '';
      if (errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('too many requests')) {
        return res.status(429).json({
          success: false,
          error: 'AI service rate limit reached. Please wait 60 seconds before trying again.',
          retryAfter: 60,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: aiError.message || 'Failed to analyze skill gap. Please try again later.',
      });
    }

    console.log('✅ Gap analysis result:', {
      overallScore: gapAnalysis.overallScore,
      missingSkills: gapAnalysis.missingSkills?.length,
      weakSkills: gapAnalysis.weakSkills?.length,
      strongSkills: gapAnalysis.strongSkills?.length,
    });

    // Generate career advice
    let advice;
    try {
      advice = await aiService.generateCareerAdvice({
        overallScore: gapAnalysis.overallScore,
        missingSkills: gapAnalysis.missingSkills,
        targetRole: targetRole,
      });
    } catch (adviceError) {
      console.error('AI career advice error:', adviceError);
      // Use fallback advice if AI fails
      advice = {
        summary: 'Career advice generation is temporarily unavailable.',
        strengths: [],
        weaknesses: [],
        nextSteps: ['Review the skill gap analysis', 'Focus on missing skills'],
        careerTips: ['Take online courses', 'Build practical projects'],
        estimatedTimeToReady: 'Variable',
      };
    }

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
