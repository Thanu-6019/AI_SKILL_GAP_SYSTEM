import Resume from '../models/Resume.model.js';
import { pdfService, aiService } from '../services/index.js';
import fs from 'fs/promises';

// @desc    Upload and process resume
// @route   POST /api/resume/upload
// @access  Public (can add auth later)
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
      });
    }

    console.log('📄 Processing resume:', req.file.filename);

    // Extract text from PDF
    const pdfData = await pdfService.extractTextFromPDF(req.file.path);
    
    if (!pdfData.text || pdfData.text.trim().length < 100) {
      // Clean up the file
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Resume appears to be empty or contains insufficient text',
      });
    }

    console.log('✅ PDF text extracted successfully');

    // Use AI to extract skills and personal info
    console.log('🤖 Extracting skills using AI...');
    const aiAnalysis = await aiService.extractSkillsFromText(pdfData.text);

    // Create resume record
    const resume = await Resume.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      extractedText: pdfData.text,
      extractedSkills: aiAnalysis.skills || [],
      personalInfo: aiAnalysis.personalInfo || {},
      processed: true,
      processedAt: new Date(),
      aiConfidence: aiAnalysis.confidence || 85,
    });

    console.log('✅ Resume saved to database');

    res.status(201).json({
      success: true,
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        extractedSkills: resume.extractedSkills,
        personalInfo: resume.personalInfo,
        aiConfidence: resume.aiConfidence,
      },
      message: 'Resume uploaded and processed successfully',
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    
    // Clean up file if it was uploaded
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    next(error);
  }
};

// @desc    Get resume by ID
// @route   GET /api/resume/:id
// @access  Public
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes
// @route   GET /api/resume
// @access  Public (can add auth later)
export const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find()
      .select('-extractedText')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Public (can add auth later)
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
