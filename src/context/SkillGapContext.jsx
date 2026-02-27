import { createContext, useContext, useState, useCallback } from 'react';

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

    // Simulate processing steps
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`✅ Context: Completed step ${i + 1}/4`);
      setProcessingStatus(prev => ({ ...prev, currentStep: i + 1 }));
    }

    // Mock extracted skills
    const mockExtractedSkills = [
      { name: 'React', level: 75, category: 'Frontend', yearsOfExperience: 2 },
      { name: 'JavaScript', level: 80, category: 'Language', yearsOfExperience: 3 },
      { name: 'Node.js', level: 70, category: 'Backend', yearsOfExperience: 2 },
      { name: 'Git', level: 85, category: 'Tools', yearsOfExperience: 3 },
      { name: 'CSS', level: 70, category: 'Frontend', yearsOfExperience: 3 },
      { name: 'HTML', level: 90, category: 'Frontend', yearsOfExperience: 3 },
      { name: 'REST APIs', level: 75, category: 'Backend', yearsOfExperience: 2 },
      { name: 'MongoDB', level: 65, category: 'Database', yearsOfExperience: 1 },
    ];

    // Mock matched roles
    const mockMatchedRoles = [
      {
        id: 1,
        title: 'Frontend Developer',
        matchScore: 82,
        salaryRange: '$70K - $100K',
        requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Webpack'],
        demandLevel: 'High',
        companies: 150,
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        matchScore: 75,
        salaryRange: '$80K - $120K',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL'],
        demandLevel: 'Very High',
        companies: 230,
      },
      {
        id: 3,
        title: 'JavaScript Developer',
        matchScore: 78,
        salaryRange: '$65K - $95K',
        requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js', 'Express'],
        demandLevel: 'High',
        companies: 180,
      },
      {
        id: 4,
        title: 'React Developer',
        matchScore: 85,
        salaryRange: '$75K - $110K',
        requiredSkills: ['React', 'Redux', 'TypeScript', 'JavaScript', 'Next.js', 'Testing Library'],
        demandLevel: 'Very High',
        companies: 200,
      },
      {
        id: 5,
        title: 'Web Developer',
        matchScore: 80,
        salaryRange: '$60K - $90K',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design', 'Git'],
        demandLevel: 'Medium',
        companies: 120,
      },
    ];

    setExtractedSkills(mockExtractedSkills);
    setMatchedRoles(mockMatchedRoles);
    setProcessingStatus(prev => ({ ...prev, isProcessing: false }));

    return { skills: mockExtractedSkills, roles: mockMatchedRoles };
  }, []);

  // Calculate skill gap for selected role
  const calculateSkillGap = useCallback((role) => {
    setSelectedRole(role);

    // Mock skill gap calculation
    const mockMissingSkills = [
      { name: 'TypeScript', priority: 'High', requiredLevel: 85, currentLevel: 0, demand: 95 },
      { name: 'AWS', priority: 'High', requiredLevel: 75, currentLevel: 0, demand: 90 },
      { name: 'Docker', priority: 'Medium', requiredLevel: 80, currentLevel: 0, demand: 85 },
      { name: 'Redux', priority: 'Medium', requiredLevel: 70, currentLevel: 0, demand: 80 },
    ];

    const mockWeakSkills = [
      { name: 'Node.js', currentLevel: 70, requiredLevel: 85, gap: 15, priority: 'High' },
      { name: 'MongoDB', currentLevel: 65, requiredLevel: 80, gap: 15, priority: 'Medium' },
      { name: 'React', currentLevel: 75, requiredLevel: 90, gap: 15, priority: 'High' },
    ];

    const mockStrongSkills = [
      { name: 'JavaScript', currentLevel: 80, requiredLevel: 85, gap: 5 },
      { name: 'Git', currentLevel: 85, requiredLevel: 85, gap: 0 },
      { name: 'HTML', currentLevel: 90, requiredLevel: 85, gap: 0 },
      { name: 'CSS', currentLevel: 70, requiredLevel: 70, gap: 0 },
    ];

    const mockRecommendedCourses = [
      {
        id: 1,
        title: 'TypeScript Fundamentals for React Developers',
        provider: 'Udemy',
        duration: '8 hours',
        rating: 4.8,
        students: 45000,
        relevance: 98,
        price: '$49.99',
        skills: ['TypeScript', 'React'],
        level: 'Intermediate',
      },
      {
        id: 2,
        title: 'AWS Certified Solutions Architect',
        provider: 'Coursera',
        duration: '40 hours',
        rating: 4.7,
        students: 120000,
        relevance: 92,
        price: '$79.99',
        skills: ['AWS', 'Cloud Computing'],
        level: 'Advanced',
      },
      {
        id: 3,
        title: 'Docker & Kubernetes: The Complete Guide',
        provider: 'Pluralsight',
        duration: '12 hours',
        rating: 4.9,
        students: 35000,
        relevance: 88,
        price: '$29.99',
        skills: ['Docker', 'Kubernetes', 'DevOps'],
        level: 'Intermediate',
      },
      {
        id: 4,
        title: 'Advanced React Patterns & Redux Mastery',
        provider: 'Frontend Masters',
        duration: '10 hours',
        rating: 4.8,
        students: 25000,
        relevance: 95,
        price: '$39.99',
        skills: ['React', 'Redux', 'State Management'],
        level: 'Advanced',
      },
      {
        id: 5,
        title: 'Node.js Advanced Concepts',
        provider: 'Udemy',
        duration: '16 hours',
        rating: 4.7,
        students: 50000,
        relevance: 90,
        price: '$54.99',
        skills: ['Node.js', 'Express', 'Backend'],
        level: 'Advanced',
      },
    ];

    const mockRoadmap = [
      {
        phase: 1,
        title: 'Foundation Enhancement',
        duration: '4-6 weeks',
        skills: ['TypeScript', 'React Advanced'],
        milestones: ['Complete TypeScript course', 'Build 2 React projects'],
      },
      {
        phase: 2,
        title: 'Backend & DevOps',
        duration: '6-8 weeks',
        skills: ['Node.js', 'Docker', 'AWS Basics'],
        milestones: ['Deploy containerized app', 'AWS certification prep'],
      },
      {
        phase: 3,
        title: 'Production Ready',
        duration: '4-6 weeks',
        skills: ['Redux', 'Testing', 'CI/CD'],
        milestones: ['Build full-stack app', 'Interview preparation'],
      },
    ];

    setSkillGapData({
      overallScore: role.matchScore,
      missingSkills: mockMissingSkills,
      weakSkills: mockWeakSkills,
      strongSkills: mockStrongSkills,
      aiConfidence: 92,
    });

    setRecommendedCourses(mockRecommendedCourses);
    setCareerRoadmap(mockRoadmap);
  }, []);

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
