import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { resumeAPI, skillsAPI, userAPI } from '../services';
import { getUserDataField, setUserData, trackMatchScoreImprovement } from '../utils';

const SkillGapContext = createContext();

// USER-SCOPED STORAGE FIX: Use user-specific storage keys
// Each user's data is isolated by their email in the storage utility

// Helper to load from user-scoped storage
const loadFromUserStorage = (key, defaultValue) => {
  return getUserDataField(key, defaultValue);
};

// Helper to save to user-scoped storage
const saveToUserStorage = (key, value) => {
  setUserData(key, value);
};

export const useSkillGap = () => {
  const context = useContext(SkillGapContext);
  if (!context) {
    throw new Error('useSkillGap must be used within SkillGapProvider');
  }
  return context;
};

export const SkillGapProvider = ({ children }) => {
  // USER-SCOPED STORAGE FIX: Load from user-specific storage
  // Resume data
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(() => loadFromUserStorage('resumeData', null));

  // Extracted skills from AI processing
  const [extractedSkills, setExtractedSkills] = useState(() => loadFromUserStorage('extractedSkills', []));

  // Matched job roles
  const [matchedRoles, setMatchedRoles] = useState(() => loadFromUserStorage('matchedRoles', []));

  // Selected target role
  const [selectedRole, setSelectedRole] = useState(() => loadFromUserStorage('selectedRole', null));

  // Skill gap analysis data
  const [skillGapData, setSkillGapData] = useState(() => loadFromUserStorage('skillGapData', {
    overallScore: 0,
    missingSkills: [],
    weakSkills: [],
    strongSkills: [],
    aiConfidence: 0,
  }));

  // Recommended courses
  const [recommendedCourses, setRecommendedCourses] = useState(() => loadFromUserStorage('recommendedCourses', []));

  // Career roadmap
  const [careerRoadmap, setCareerRoadmap] = useState(() => loadFromUserStorage('careerRoadmap', []));

  // CAREER GROWTH TRACKER: Certifications and Internships
  const [certifications, setCertifications] = useState(() => loadFromUserStorage('certifications', []));
  const [internships, setInternships] = useState(() => loadFromUserStorage('internships', []));

  // Log loaded data on mount
  useEffect(() => {
    const hasData = extractedSkills.length > 0 || selectedRole !== null;
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📋 [SkillGapContext] INITIAL DATA LOAD FROM LOCALSTORAGE');
    console.log('═══════════════════════════════════════════════════');
    if (hasData) {
      console.log('✅ Loaded persisted data from localStorage:');
      console.log('  - Resume Data:', resumeData ? 'Present' : 'None');
      console.log('  - Extracted Skills:', extractedSkills.length, 'skills');
      console.log('  - Matched Roles:', matchedRoles?.length || 0, 'roles');
      console.log('  - Selected Role:', selectedRole?.title || 'None');
      console.log('  - Match Score:', skillGapData.overallScore);
      console.log('  - Missing Skills:', skillGapData.missingSkills?.length || 0);
      console.log('  - Weak Skills:', skillGapData.weakSkills?.length || 0);
      console.log('  - Strong Skills:', skillGapData.strongSkills?.length || 0);
      console.log('  - Recommended Courses:', recommendedCourses?.length || 0);
      console.log('  - Career Roadmap Phases:', careerRoadmap?.length || 0);
      console.log('\n📊 Full skillGapData:', skillGapData);
      console.log('🗺️ Full careerRoadmap:', careerRoadmap);
    } else {
      console.log('ℹ️ No persisted data found in localStorage');
    }
    console.log('═══════════════════════════════════════════════════\n');
  }, []); // Empty dependency array - runs once on mount

  // USER-SCOPED STORAGE FIX: Save to user-specific storage whenever state changes
  useEffect(() => {
    if (resumeData) {
      console.log('💾 [UserStorage] Saving resumeData for current user');
      saveToUserStorage('resumeData', resumeData);
    }
  }, [resumeData]);

  useEffect(() => {
    if (extractedSkills.length > 0) {
      console.log('💾 [UserStorage] Saving', extractedSkills.length, 'extractedSkills for current user');
      saveToUserStorage('extractedSkills', extractedSkills);
    }
  }, [extractedSkills]);

  useEffect(() => {
    if (matchedRoles.length > 0) {
      console.log('💾 [UserStorage] Saving', matchedRoles.length, 'matchedRoles for current user');
      saveToUserStorage('matchedRoles', matchedRoles);
    }
  }, [matchedRoles]);

  useEffect(() => {
    if (selectedRole) {
      console.log('💾 [UserStorage] Saving selectedRole for current user:', selectedRole.title);
      saveToUserStorage('selectedRole', selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    console.log('💾 [UserStorage] Saving skillGapData for current user:', {
      overallScore: skillGapData.overallScore,
      missingSkills: skillGapData.missingSkills?.length,
      weakSkills: skillGapData.weakSkills?.length,
      strongSkills: skillGapData.strongSkills?.length,
    });
    saveToUserStorage('skillGapData', skillGapData);
    
    // CAREER GROWTH TRACKER: Track match score improvement
    if (skillGapData.overallScore > 0) {
      trackMatchScoreImprovement(skillGapData.overallScore);
    }
  }, [skillGapData]);

  useEffect(() => {
    if (recommendedCourses.length > 0) {
      console.log('💾 [UserStorage] Saving', recommendedCourses.length, 'recommendedCourses for current user');
      saveToUserStorage('recommendedCourses', recommendedCourses);
    }
  }, [recommendedCourses]);

  useEffect(() => {
    if (careerRoadmap.length > 0) {
      console.log('💾 [UserStorage] Saving', careerRoadmap.length, 'careerRoadmap phases for current user');
      console.log('📊 [UserStorage] Phase 1 skills count:', careerRoadmap[0]?.skills?.length);
      console.log('📊 [UserStorage] Phase 1 first 3 skills:', careerRoadmap[0]?.skills?.slice(0, 3).map(s => s.name || s));
      saveToUserStorage('careerRoadmap', careerRoadmap);
    }
  }, [careerRoadmap]);

  // CAREER GROWTH TRACKER: Save certifications and internships
  useEffect(() => {
    console.log('💾 [UserStorage] Saving', certifications.length, 'certifications for current user');
    saveToUserStorage('certifications', certifications);
  }, [certifications]);

  useEffect(() => {
    console.log('💾 [UserStorage] Saving', internships.length, 'internships for current user');
    saveToUserStorage('internships', internships);
  }, [internships]);

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
    
    // Clear from localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🔄 Context: All data reset and cleared from storage');
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

      // Check if it's a rate limit error
      if (error.message && (error.message.includes('rate limit') || error.message.includes('too many requests'))) {
        alert(`⏳ AI Service Rate Limit Reached\n\nThe AI service is experiencing high demand.\n\n✋ Please wait 60 seconds and try again.\n\nTip: The Groq API has rate limits. If you're testing frequently, wait a minute between uploads.`);
      } else if (error.message && error.message.includes('quota exceeded')) {
        alert(`🚫 AI Service Quota Exceeded\n\nYour Groq API key has reached its quota limit.\n\nPlease:\n1. Wait for your quota to reset\n2. Or use a different API key from https://console.groq.com`);
      } else if (error.message && error.message.includes('Cannot connect to server')) {
        alert(`🔌 Backend Connection Failed\n\nCannot connect to the backend server.\n\nPlease make sure:\n1. Backend server is running (port 5001)\n2. MongoDB is connected\n3. Check the terminal for any errors`);
      } else {
        alert(`❌ Failed to process resume\n\n${error.message}\n\nPlease make sure:\n1. Backend server is running (port 5001)\n2. MongoDB is connected\n3. Groq API key is configured in backend/.env`);
      }

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

      console.log('\n📦 [SkillGapContext] API Response Structure:');
      console.log('  - overallScore:', analysisData.overallScore);
      console.log('  - missingSkills:', analysisData.missingSkills?.length, 'items');
      console.log('  - missingSkills data:', analysisData.missingSkills);
      console.log('  - weakSkills:', analysisData.weakSkills?.length, 'items');
      console.log('  - strongSkills:', analysisData.strongSkills?.length, 'items');
      console.log('  - recommendedCourses:', analysisData.recommendedCourses?.length, 'items');
      console.log('  - careerRoadmap:', analysisData.careerRoadmap?.length, 'phases');
      console.log('  - careerRoadmap data:', analysisData.careerRoadmap);

      // PART 1: COMPUTE MISSING SKILLS IF AI DIDN'T RETURN THEM
      let computedMissingSkills = analysisData.missingSkills || [];
      
      if (!computedMissingSkills || computedMissingSkills.length === 0) {
        console.log('⚠️ [Missing Skills FIX] AI returned empty missing skills, computing manually...');
        
        // Extract user skill names (normalize: lowercase, trim)
        const userSkillNames = (extractedSkills || []).map(skill => 
          (typeof skill === 'string' ? skill : skill.name).toLowerCase().trim()
        );
        
        // Extract required skill names from role
        const requiredSkillNames = (role.requiredSkills || []).map(skill => 
          skill.toLowerCase().trim()
        );
        
        console.log('  - User skills:', userSkillNames);
        console.log('  - Required skills:', requiredSkillNames);
        
        // Compute missing = required - user
        const missingSkillNames = requiredSkillNames.filter(
          skill => !userSkillNames.includes(skill)
        );
        
        console.log('  - Computed missing skills:', missingSkillNames);
        
        // Convert to proper format with priority and learning time
        computedMissingSkills = missingSkillNames.map((skill, index) => {
          // Assign priority based on position (first 40% are High, next 40% Medium, rest Low)
          const position = index / missingSkillNames.length;
          const priority = position < 0.4 ? 'High' : position < 0.8 ? 'Medium' : 'Low';
          const learningTime = priority === 'High' ? '2-3 months' : priority === 'Medium' ? '1-2 months' : '2-4 weeks';
          
          return {
            name: skill,
            priority,
            learningTime,
            gap: Math.round((1 - position) * 60 + 40) // Gap percentage (40-100%)
          };
        });
        
        console.log('✅ [Missing Skills FIX] Computed', computedMissingSkills.length, 'missing skills');
        console.log('  - Missing skills data:', computedMissingSkills);
      }

      // PART 2: GENERATE DETAILED CAREER ROADMAP IF AI DIDN'T RETURN ONE
      let computedCareerRoadmap = analysisData.careerRoadmap || [];
      
      // Ensure computedCareerRoadmap is an array
      if (!Array.isArray(computedCareerRoadmap)) {
        console.warn('⚠️ [Roadmap] careerRoadmap is not an array, converting to empty array');
        computedCareerRoadmap = [];
      }
      
      // Transform roadmap to ensure skills are objects with name, completed, approved
      computedCareerRoadmap = computedCareerRoadmap.map(phase => {
        let skills = [];
        
        // If phase has 'focus' array (old format), convert to skills objects
        if (phase.focus && Array.isArray(phase.focus)) {
          skills = phase.focus.map(skillName => ({
            name: skillName,
            completed: false,
            approved: false
          }));
        }
        // If phase has 'skills' array, ensure they're objects
        else if (phase.skills && Array.isArray(phase.skills)) {
          skills = phase.skills.map(skill => {
            if (typeof skill === 'string') {
              return { name: skill, completed: false, approved: false };
            }
            return {
              name: skill.name || 'Unnamed Skill',
              completed: skill.completed || false,
              approved: skill.approved || false
            };
          });
        }
        
        return {
          ...phase,
          skills,
          milestone: phase.milestone || (phase.milestones && phase.milestones[0]) || '',
          resources: phase.resources || phase.milestones || []
        };
      });
      
      // Check if roadmap exists but lacks detail
      const hasDetailedRoadmap = computedCareerRoadmap.length > 0 && 
        computedCareerRoadmap.some(phase => 
          (phase.skills && phase.skills.length > 0)
        );
      
      if (!hasDetailedRoadmap) {
        console.log('⚠️ [Roadmap FIX] AI returned empty/incomplete roadmap, generating detailed roadmap...');
        
        // Split missing skills into 3 phases
        const totalMissing = computedMissingSkills.length;
        const phase1Count = Math.ceil(totalMissing * 0.4); // First 40%
        const phase2Count = Math.ceil(totalMissing * 0.4); // Next 40%
        const phase3Count = totalMissing - phase1Count - phase2Count; // Remaining 20%
        
        const phase1Skills = computedMissingSkills.slice(0, phase1Count);
        const phase2Skills = computedMissingSkills.slice(phase1Count, phase1Count + phase2Count);
        const phase3Skills = computedMissingSkills.slice(phase1Count + phase2Count);
        
        console.log('  - Phase 1 skills:', phase1Skills.map(s => s.name));
        console.log('  - Phase 2 skills:', phase2Skills.map(s => s.name));
        console.log('  - Phase 3 skills:', phase3Skills.map(s => s.name));
        
        // Helper function to generate course recommendations with real links
        const generateCourseLinks = (skillNames) => {
          const courses = [];
          const skillsForCourses = skillNames.slice(0, 3); // Top 3 skills for this phase
          
          skillsForCourses.forEach(skillName => {
            const encodedSkill = encodeURIComponent(skillName);
            // Add Udemy course
            courses.push({
              courseName: `${skillName} - Complete Course`,
              platform: 'Udemy',
              link: `https://www.udemy.com/courses/search/?q=${encodedSkill}`
            });
            // Add Coursera course
            courses.push({
              courseName: `${skillName} Specialization`,
              platform: 'Coursera',
              link: `https://www.coursera.org/search?query=${encodedSkill}`
            });
          });
          
          // Add YouTube tutorial
          const allSkills = skillNames.join(' ');
          courses.push({
            courseName: `${role.title} - Video Tutorials`,
            platform: 'YouTube',
            link: `https://www.youtube.com/results?search_query=${encodeURIComponent(allSkills + ' tutorial')}`
          });
          
          // Add FreeCodeCamp
          courses.push({
            courseName: `${role.title} - Free Learning Path`,
            platform: 'FreeCodeCamp',
            link: `https://www.freecodecamp.org/learn/`
          });
          
          return courses;
        };
        
        // CAREER GROWTH TRACKER: Restructured 3-phase roadmap with sequential durations
        computedCareerRoadmap = [
          {
            phase: 'Phase 1',
            title: 'Core Skill Improvement',
            duration: '1-2 months',
            skills: phase1Skills.map(s => ({
              name: s.name,
              completed: false,
              approved: false
            })),
            milestone: `Learn essential skills: ${phase1Skills.slice(0, 3).map(s => s.name).join(', ')}`,
            resources: generateCourseLinks(phase1Skills.map(s => s.name))
          },
          {
            phase: 'Phase 2',
            title: 'Practical Application',
            duration: '2-4 months',
            skills: phase2Skills.map(s => ({
              name: s.name,
              completed: false,
              approved: false
            })),
            milestone: `Apply skills in real scenarios: ${phase2Skills.slice(0, 3).map(s => s.name).join(', ')}`,
            resources: generateCourseLinks(phase2Skills.map(s => s.name))
          },
          {
            phase: 'Phase 3',
            title: 'Internship / Job Readiness',
            duration: '4-6 months',
            skills: phase3Skills.length > 0 ? phase3Skills.map(s => ({
              name: s.name,
              completed: false,
              approved: false
            })) : [
              { name: 'System Design', completed: false, approved: false },
              { name: 'Industry Best Practices', completed: false, approved: false },
              { name: 'Professional Skills', completed: false, approved: false }
            ],
            milestone: phase3Skills.length > 0 ? `Polish advanced skills: ${phase3Skills.slice(0, 2).map(s => s.name).join(', ')}` : 'System design and best practices',
            resources: [
              {
                courseName: `${role.title} - Advanced Topics`,
                platform: 'Udemy',
                link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(role.title + ' advanced')}`
              },
              {
                courseName: 'System Design Interview Prep',
                platform: 'Coursera',
                link: 'https://www.coursera.org/search?query=system%20design'
              },
              {
                courseName: 'Professional Development',
                platform: 'LinkedIn Learning',
                link: 'https://www.linkedin.com/learning/'
              }
            ]
          }
        ];
        
        console.log('✅ [Roadmap FIX] Generated detailed', computedCareerRoadmap.length, 'phase roadmap');
        console.log('  - Roadmap data:', computedCareerRoadmap);
      }

      // Update state with real analysis from backend (or computed fallbacks)
      setSkillGapData({
        overallScore: analysisData.overallScore,
        missingSkills: computedMissingSkills, // Use computed missing skills
        weakSkills: analysisData.weakSkills,
        strongSkills: analysisData.strongSkills,
        aiConfidence: analysisData.aiConfidence,
      });

      setRecommendedCourses(analysisData.recommendedCourses);
      setCareerRoadmap(computedCareerRoadmap); // Use computed roadmap

      console.log('✅ [SkillGapContext] Skill gap data updated in context');
      console.log('💾 [SkillGapContext] Data will be saved to localStorage by useEffect hooks');
      console.log('📊 Final missing skills count:', computedMissingSkills.length);
      console.log('🗺️ Final roadmap phases:', computedCareerRoadmap.length);

      // SAVE TO BACKEND: Update user profile with role selection and roadmap
      try {
        console.log('💾 [SkillGapContext] Saving user profile to backend...');
        console.log('📋 [SkillGapContext] computedCareerRoadmap before transform:');
        computedCareerRoadmap.forEach((phase, idx) => {
          console.log(`  Phase ${idx + 1}: ${phase.title} - ${phase.skills?.length} skills`);
          console.log(`    Skills:`, phase.skills?.map(s => s.name).join(', '));
        });
        
        // Transform roadmap to match backend schema
        const roadmapForBackend = {
          phases: computedCareerRoadmap.map((phase, index) => {
            const transformedPhase = {
              phaseNumber: index + 1,
              title: phase.phase || phase.title || `Phase ${index + 1}`,
              duration: phase.duration || '1-2 months',
              locked: index === 0 ? false : true, // First phase unlocked
              completed: false,
              skills: (phase.skills || []).map(skill => ({
                name: typeof skill === 'string' ? skill : skill.name,
                completed: false,
                approved: false,
                certificateUrl: null,
                platform: null,
              })),
              resources: (phase.resources || []).map(resource => {
                // If resource is a string (old format), convert to object
                if (typeof resource === 'string') {
                  return {
                    courseName: resource,
                    platform: 'Online',
                    link: '',
                  };
                }
                return resource;
              }),
            };
            
            console.log(`✅ Transformed Phase ${index + 1}: ${transformedPhase.title} - ${transformedPhase.skills.length} skills`);
            return transformedPhase;
          }),
        };
        
        console.log('📦 [SkillGapContext] roadmapForBackend prepared with', roadmapForBackend.phases.length, 'phases');

        // Prepare resume skills for backend
        const resumeSkillsForBackend = (extractedSkills || []).map(skill => ({
          name: typeof skill === 'string' ? skill : skill.name,
          level: typeof skill === 'object' && skill.level ? skill.level : 70,
          category: typeof skill === 'object' && skill.category ? skill.category : 'General',
        }));

        const token = localStorage.getItem('token');
        if (token) {
          await userAPI.updateProfile({
            jobTitle: role.title,
            department: role.category || 'Technology',
            resumeSkills: resumeSkillsForBackend,
            roadmap: roadmapForBackend,
            targetRole: role.title,
          }, token);
          
          console.log('✅ [SkillGapContext] User profile saved to backend');
          console.log('  - jobTitle:', role.title);
          console.log('  - department:', role.category || 'Technology');
          console.log('  - resumeSkills count:', resumeSkillsForBackend.length);
          console.log('  - roadmap phases:', roadmapForBackend.phases.length);
        } else {
          console.warn('⚠️ [SkillGapContext] No auth token found, skipping backend save');
        }
      } catch (backendError) {
        console.error('❌ [SkillGapContext] Failed to save to backend:', backendError);
        // Don't throw error, just log it - localStorage will still work
      }

      console.log('\n');

    } catch (error) {
      console.error('❌ Error analyzing skill gap:', error);

      // Check if it's a rate limit error
      if (error.message && (error.message.includes('rate limit') || error.message.includes('too many requests'))) {
        alert(`⏳ AI Service Rate Limit Reached\n\nThe AI service is experiencing high demand.\n\n✋ Please wait 60 seconds and try again.\n\nTip: Wait a minute between analysis requests.`);
      } else if (error.message && error.message.includes('quota exceeded')) {
        alert(`🚫 AI Service Quota Exceeded\n\nYour Gemini API key has reached its quota limit.\n\nPlease wait or upgrade your API plan.`);
      } else {
        alert(`❌ Failed to analyze skill gap\n\n${error.message}\n\nPlease make sure backend is running.`);
      }

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
    certifications,
    internships,
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
    setCertifications,
    setInternships,
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
