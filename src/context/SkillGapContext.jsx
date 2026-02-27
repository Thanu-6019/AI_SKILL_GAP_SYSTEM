import { createContext, useContext, useState, useCallback } from 'react';
import { resumeAPI, skillsAPI } from '../services';

const SkillGapContext = createContext();

export const useSkillGap = () => {
  const context = useContext(SkillGapContext);
  if (!context) {
    throw new Error('useSkillGap must be used within SkillGapProvider');
  }
  return context;
};

export const SkillGapProvider = ({ children }) => {
  // Resume data
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  // Extracted skills from AI processing
  const [extractedSkills, setExtractedSkills] = useState([]);

  // Matched job roles
  const [matchedRoles, setMatchedRoles] = useState([]);

  // Selected target role
  const [selectedRole, setSelectedRole] = useState(null);

  // Skill gap analysis data
  const [skillGapData, setSkillGapData] = useState({
    overallScore: 0,
    missingSkills: [],
    weakSkills: [],
    strongSkills: [],
    aiConfidence: 0,
  });

  // Recommended courses
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Career roadmap
  const [careerRoadmap, setCareerRoadmap] = useState([]);

  // Processing status
  const [processingStatus, setProcessingStatus] = useState({
    isProcessing: false,
    currentStep: 0,
    steps: [
      'Extracting skills using NLP',
      'Matching resume with job roles',
      'Calculating skill gap',
      'Generating personalized recommendations',
    ],
  });

  // Reset all data
  const resetData = useCallback(() => {
    setResumeFile(null);
    setResumeData(null);
    setExtractedSkills([]);
    setMatchedRoles([]);
    setSelectedRole(null);
    setSkillGapData({
      overallScore: 0,
      missingSkills: [],
      weakSkills: [],
      strongSkills: [],
      aiConfidence: 0,
    });
    setRecommendedCourses([]);
    setCareerRoadmap([]);
    setProcessingStatus({
      isProcessing: false,
      currentStep: 0,
      steps: [
        'Extracting skills using NLP',
        'Matching resume with job roles',
        'Calculating skill gap',
        'Generating personalized recommendations',
      ],
    });
    console.log('🔄 Context: All data reset');
  }, []);

  // Simulate AI processing
  const processResume = useCallback(async (file) => {
    console.log('🚀 Context: Starting resume processing for:', file?.name);
    setResumeFile(file);
    setProcessingStatus(prev => ({ ...prev, isProcessing: true, currentStep: 0 }));

    try {
      // Step 1: Upload resume to backend
      console.log('📤 Uploading resume to backend...');
      setProcessingStatus(prev => ({ ...prev, currentStep: 1 }));
      
      const uploadResponse = await resumeAPI.upload(file);
      console.log('✅ Resume uploaded:', uploadResponse);

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.error || 'Failed to upload resume');
      }

      const { resumeId, extractedSkills, personalInfo, aiConfidence } = uploadResponse.data;
      
      // Store resume data
      setResumeData({
        id: resumeId,
        personalInfo,
        aiConfidence,
      });
      setExtractedSkills(extractedSkills);

      // Step 2: Match roles using backend AI
      console.log('🎯 Matching roles with AI...');
      setProcessingStatus(prev => ({ ...prev, currentStep: 2 }));
      
      const rolesResponse = await skillsAPI.matchRoles(resumeId, 5);
      console.log('✅ Roles matched:', rolesResponse);

      if (!rolesResponse.success) {
        throw new Error(rolesResponse.error || 'Failed to match roles');
      }

      const matchedRolesData = rolesResponse.data.roles.map((role, index) => ({
        id: role.id || index + 1,
        title: role.title,
        matchScore: role.matchScore,
        salaryRange: role.salaryRange,
        requiredSkills: role.requiredSkills,
        demandLevel: role.demandLevel,
        companies: role.companies,
        type: role.type || 'AI Recommended Role',
      }));

      setMatchedRoles(matchedRolesData);

      // Complete processing
      console.log('✅ Processing complete!');
      setProcessingStatus(prev => ({ ...prev, currentStep: 4, isProcessing: false }));

      return { skills: extractedSkills, roles: matchedRolesData };

    } catch (error) {
      console.error('❌ Error processing resume:', error);
      setProcessingStatus(prev => ({ ...prev, isProcessing: false }));
      
      // Show error to user
      alert(`Failed to process resume: ${error.message}\n\nPlease make sure:\n1. Backend server is running (port 5000)\n2. MongoDB is connected\n3. OpenAI API key is configured`);
      
      throw error;
    }
  }, []);

  // Calculate skill gap for selected role
  const calculateSkillGap = useCallback(async (role) => {
    setSelectedRole(role);

    try {
      console.log('📊 Analyzing skill gap with backend AI...');
      
      // Call backend API to analyze skill gap
      const response = await skillsAPI.analyzeGap(resumeData.id, {
        title: role.title,
        requiredSkills: role.requiredSkills,
        category: role.category || 'Technology',
      });

      console.log('✅ Skill gap analysis complete:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to analyze skill gap');
      }

      const analysisData = response.data;

      // Update state with real analysis from backend
      setSkillGapData({
        overallScore: analysisData.overallScore,
        missingSkills: analysisData.missingSkills,
        weakSkills: analysisData.weakSkills,
        strongSkills: analysisData.strongSkills,
        aiConfidence: analysisData.aiConfidence,
      });

      setRecommendedCourses(analysisData.recommendedCourses);
      setCareerRoadmap(analysisData.careerRoadmap);

      console.log('✅ Skill gap data updated in context');

    } catch (error) {
      console.error('❌ Error analyzing skill gap:', error);
      
      alert(`Failed to analyze skill gap: ${error.message}\n\nPlease make sure backend is running.`);
      
      // Set fallback data
      setSkillGapData({
        overallScore: 0,
        missingSkills: [],
        weakSkills: [],
        strongSkills: [],
        aiConfidence: 0,
      });
    }
  }, [resumeData]);

  const value = {
    // State
    resumeFile,
    resumeData,
    extractedSkills,
    matchedRoles,
    selectedRole,
    skillGapData,
    recommendedCourses,
    careerRoadmap,
    processingStatus,
    
    // Actions
    setResumeFile,
    setResumeData,
    setExtractedSkills,
    setMatchedRoles,
    setSelectedRole,
    setSkillGapData,
    setRecommendedCourses,
    setCareerRoadmap,
    setProcessingStatus,
    processResume,
    calculateSkillGap,
    resetData,
  };

  return (
    <SkillGapContext.Provider value={value}>
      {children}
    </SkillGapContext.Provider>
  );
};

export default SkillGapContext;
