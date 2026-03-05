import Resume from '../models/Resume.model.js';
import { pdfService, aiService } from '../services/index.js';
import fs from 'fs/promises';

// @desc    Upload and process resume
// @route   POST /api/resume/upload
// @access  Protected
export const uploadResume = async (req, res, next) => {
  let uploadedFilePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
      });
    }

    uploadedFilePath = req.file.path;
    console.log('📄 Processing resume:', req.file.filename);

    // Extract text from PDF
    let pdfData;
    try {
      pdfData = await pdfService.extractTextFromPDF(req.file.path);
    } catch (pdfError) {
      console.error('PDF extraction error:', pdfError);
      await fs.unlink(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: 'Failed to read PDF file. Please ensure the file is a valid PDF and try again.',
      });
    }
    
    if (!pdfData.text || pdfData.text.trim().length < 100) {
      // Clean up the file
      await fs.unlink(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: 'Resume appears to be empty or contains insufficient text',
      });
    }

    console.log('✅ PDF text extracted successfully');

    // Use AI to extract skills and personal info
    console.log('🤖 Extracting skills using AI...');
    let aiAnalysis;
    try {
      aiAnalysis = await aiService.extractSkillsFromText(pdfData.text);
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      await fs.unlink(uploadedFilePath);
      
      // Return specific status code for rate limiting
      const errorMsg = aiError.message || '';
      if (errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('too many requests')) {
        return res.status(429).json({
          success: false,
          error: 'AI service rate limit reached. Please wait 60 seconds before trying again.',
          retryAfter: 60, // seconds
        });
      }
      
      // Return user-friendly error message
      return res.status(500).json({
        success: false,
        error: aiError.message || 'AI processing failed. Please try again later.',
      });
    }

    // Create resume record
    const resume = await Resume.create({
      userId: req.user?._id, // Link to authenticated user if available
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

    // Update user's job title and department from resume analysis
    if (req.user && aiAnalysis.personalInfo) {
      try {
        const User = (await import('../models/User.model.js')).default;
        const updateData = {};
        
        if (aiAnalysis.personalInfo.currentJobTitle) {
          updateData.jobTitle = aiAnalysis.personalInfo.currentJobTitle;
          console.log('📋 Extracted Job Title:', aiAnalysis.personalInfo.currentJobTitle);
        }
        
        if (aiAnalysis.personalInfo.department) {
          updateData.department = aiAnalysis.personalInfo.department;
          console.log('🏢 Extracted Department:', aiAnalysis.personalInfo.department);
        }

        if (Object.keys(updateData).length > 0) {
          await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
          console.log('✅ User profile updated with job title and department');
        }
      } catch (updateError) {
        console.error('⚠️ Failed to update user profile:', updateError.message);
        // Don't fail the request, just log the error
      }
    }

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
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    // Send user-friendly error response instead of crashing
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your resume. Please try again.',
    });
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
