import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircleIcon,
  LockClosedIcon,
  CloudArrowUpIcon,
  ArrowTopRightOnSquareIcon,
  DocumentPlusIcon,
  AcademicCapIcon,
  LockOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, Badge, Button, LoadingSpinner } from '../components/ui';
import { useSkillGap } from '../context';
import { 
  getUserDataField,
  setUserData
} from '../utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleChanged = searchParams.get('roleChanged') === 'true';
  const { selectedRole, careerRoadmap, extractedSkills, setSelectedRole, setCareerRoadmap, setExtractedSkills } = useSkillGap();
  
  // API Base URL - declared once for entire component
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [certificatePlatform, setCertificatePlatform] = useState('Udemy');
  const [certificateFile, setCertificateFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  
  // Load skill approvals from storage
  const [skillApprovals, setSkillApprovals] = useState(() => getUserDataField('skillApprovals', {}));

  // Loading and analysis completion state
  const [isLoading, setIsLoading] = useState(true);
  const [userLastLogin, setUserLastLogin] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Prepare radar chart data from extracted skills - MOVED BEFORE EARLY RETURNS
  const radarData = useMemo(() => {
    if (!extractedSkills || extractedSkills.length === 0) return [];
    
    return extractedSkills.slice(0, 8).map(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 70;
      
      return {
        skill: skillName.length > 15 ? skillName.substring(0, 15) + '...' : skillName,
        value: skillLevel,
      };
    });
  }, [extractedSkills]);

  // Calculate progress based on approved skills - FIXED LOGIC
  const progress = useMemo(() => {
    if (!careerRoadmap || careerRoadmap.length === 0) return { completedPhases: 0, totalPhases: 0, percentage: 0 };
    
    let completedCount = 0;
    careerRoadmap.forEach((phase, phaseIndex) => {
      // CRITICAL FIX: A phase is completed ONLY IF:
      // 1. It has skills (not empty)
      // 2. ALL skills are approved
      
      const hasSkills = phase.skills && Array.isArray(phase.skills) && phase.skills.length > 0;
      
      if (!hasSkills) {
        // Empty phase - NOT completed
        return;
      }
      
      const allSkillsApproved = phase.skills.every((skill, skillIdx) => {
        const key = `phase_${phaseIndex}_skill_${skillIdx}`;
        const approvedInStorage = skillApprovals[key]?.approved === true;
        const approvedInData = typeof skill === 'object' ? skill?.approved === true : false;
        return approvedInStorage || approvedInData;
      });
      
      if (allSkillsApproved) {
        completedCount++;
      }
    });
    
    return {
      completedPhases: completedCount,
      totalPhases: careerRoadmap.length,
      percentage: careerRoadmap.length > 0 ? Math.round((completedCount / careerRoadmap.length) * 100) : 0,
    };
  }, [careerRoadmap, skillApprovals]);

  // LOAD USER DATA FROM BACKEND ON MOUNT - FIXED DATA FLOW
  useEffect(() => {
    const loadUserDataFromBackend = async () => {
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ [Dashboard] No auth token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.data;
          
          console.log('\n═══ [Dashboard] BACKEND DATA LOADED ═══');
          console.log('User:', user.name, '|', user.email);
          console.log('Last Login:', user.lastLogin);
          console.log('Job Title:', user.jobTitle);
          console.log('Department:', user.department);
          console.log('Has Roadmap:', user.roadmap?.phases?.length > 0);
          if (user.roadmap?.phases) {
            console.log('Roadmap Phases:', user.roadmap.phases.length);
            user.roadmap.phases.forEach((phase, idx) => {
              console.log(`  Phase ${idx + 1}: ${phase.title} - ${phase.skills?.length || 0} skills`);
              console.log(`    Skills:`, phase.skills?.map(s => s.name).join(', '));
            });
          }
          console.log('═══════════════════════════════════════\n');

          // CHECK IF USER HAS COMPLETED ANALYSIS (Backend OR Context)
          const hasBackendAnalysis = user.jobTitle && 
                                      user.roadmap && 
                                      user.roadmap.phases && 
                                      user.roadmap.phases.length > 0;

          const hasContextAnalysis = selectedRole && careerRoadmap && careerRoadmap.length > 0;

          // EXISTING USER: Has backend data
          if (hasBackendAnalysis) {
            console.log('🟢 EXISTING USER DETECTED - Has previous analysis');
            setIsExistingUser(true);
            setUserLastLogin(user.lastLogin);
            
            // FIX: Load data from backend and SET EXPLICITLY (don't rely on context)
            if (user.roadmap && user.roadmap.phases && user.roadmap.phases.length > 0) {
              // Helper function to generate fallback skills if phase has no skills
              const generateFallbackSkills = (phaseTitle, phaseIndex, jobTitle) => {
                // Common skills by phase
                const skillsByRole = {
                  'Frontend Developer': [
                    ['HTML', 'CSS', 'JavaScript'],
                    ['React', 'TypeScript', 'Responsive Design'],
                    ['State Management', 'Testing', 'Performance Optimization']
                  ],
                  'Backend Developer': [
                    ['Node.js', 'Express', 'REST API'],
                    ['Database Design', 'Authentication', 'MongoDB'],
                    ['Microservices', 'Security', 'Deployment']
                  ],
                  'Full Stack Developer': [
                    ['HTML/CSS', 'JavaScript', 'Git'],
                    ['React', 'Node.js', 'Database'],
                    ['DevOps', 'Testing', 'Cloud Services']
                  ],
                  'default': [
                    ['Core Fundamentals', 'Problem Solving', 'Version Control'],
                    ['Intermediate Concepts', 'Best Practices', 'Tools'],
                    ['Advanced Topics', 'Architecture', 'Optimization']
                  ]
                };
                
                const roleSkills = skillsByRole[jobTitle] || skillsByRole['default'];
                const phaseSkills = roleSkills[phaseIndex] || roleSkills[0];
                
                return phaseSkills.map(skillName => ({
                  name: skillName,
                  completed: false,
                  approved: false,
                  certificateUrl: null,
                  platform: null
                }));
              };
              
              // Helper function to generate real course links from skills
              const generateCourseLinksFromSkills = (phaseTitle, skills) => {
                const courses = [];
                const skillNames = skills.slice(0, 3).map(s => typeof s === 'string' ? s : s.name);
                
                if (skillNames.length > 0) {
                  skillNames.forEach(skillName => {
                    const encodedSkill = encodeURIComponent(skillName);
                    courses.push({
                      courseName: `${skillName} - Complete Guide`,
                      platform: 'Udemy',
                      link: `https://www.udemy.com/courses/search/?q=${encodedSkill}`
                    });
                  });
                  
                  // Add YouTube tutorial
                  courses.push({
                    courseName: `${phaseTitle} - Video Tutorials`,
                    platform: 'YouTube',
                    link: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillNames.join(' ') + ' tutorial')}`
                  });
                  
                  // Add FreeCodeCamp
                  courses.push({
                    courseName: `${phaseTitle} - Free Learning`,
                    platform: 'FreeCodeCamp',
                    link: 'https://www.freecodecamp.org/learn/'
                  });
                } else {
                  // Fallback if no skills
                  courses.push({
                    courseName: `${phaseTitle} - Complete Course`,
                    platform: 'Udemy',
                    link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(phaseTitle)}`
                  });
                }
                
                return courses;
              };
              
              // Transform backend roadmap format to frontend format
              const transformedRoadmap = user.roadmap.phases.map((phase, idx) => {
                console.log('🔍 Transforming phase:', phase.title, '| Skills count:', phase.skills?.length, '| Resources count:', phase.resources?.length);
                
                // CRITICAL FIX: Generate fallback skills if none exist
                let phaseSkills = phase.skills || [];
                if (phaseSkills.length === 0) {
                  console.warn('⚠️ Phase has no skills, generating fallback skills based on role');
                  phaseSkills = generateFallbackSkills(phase.title, idx, user.jobTitle);
                }
                
                // Handle resources - convert old string format to new object format
                let resources = phase.resources || [];
                
                // Check if resources are in old string format
                const hasOldFormat = resources.some(r => typeof r === 'string');
                
                if (resources.length === 0 || hasOldFormat) {
                  console.warn('⚠️ Phase has old/empty resources, generating real course links from skills');
                  resources = generateCourseLinksFromSkills(phase.title, phaseSkills);
                }
                
                // Update duration to be sequential if it's in old format
                let sequentialDuration = phase.duration;
                if (idx === 0) sequentialDuration = '1-2 months';
                else if (idx === 1) sequentialDuration = '2-4 months';
                else if (idx === 2) sequentialDuration = '4-6 months';
                else if (idx === 3) sequentialDuration = '6-8 months';
                
                return {
                  phase: phase.title,
                  title: phase.title,
                  duration: sequentialDuration,
                  locked: phase.locked,
                  completed: phase.completed,
                  skills: phaseSkills, // Use generated skills if original was empty
                  resources: resources,
                  milestone: '',
                };
              });

              console.log('✅ Setting roadmap with', transformedRoadmap.length, 'phases');
              console.log('Phase 1 skills:', transformedRoadmap[0]?.skills);
              console.log('Phase 1 resources:', transformedRoadmap[0]?.resources);
              setCareerRoadmap(transformedRoadmap);
            }

            // FIXED: Load resumeSkills from backend to ensure radar chart shows correct skills
            // ExtractedSkills should be the user's RESUME skills, not roadmap skills
            if (user.resumeSkills && user.resumeSkills.length > 0) {
              setExtractedSkills(user.resumeSkills);
              console.log('✅ Set extracted skills from backend resume:', user.resumeSkills.length);
            } else if (!extractedSkills || extractedSkills.length === 0) {
              console.warn('⚠️ [Dashboard] No resumeSkills in backend, using context data');
            }

            // Set selected role from jobTitle
            if (user.jobTitle) {
              setSelectedRole({
                title: user.jobTitle,
                category: user.department || 'Technology',
              });
              console.log('✅ Set selected role:', user.jobTitle);
            }
          }
          // NEW USER or USER WITH CONTEXT DATA: Check context
          else if (hasContextAnalysis) {
            console.log('🆕 NEW USER - Using context data from current session');
          }
          // NO ANALYSIS: Redirect to upload
          else {
            console.warn('❌ NEW USER - No analysis found');
          }
        } else {
          // Check if user has context data (new user flow)
          if (selectedRole && careerRoadmap && careerRoadmap.length > 0) {
            console.log('✅ [Dashboard] Using context data from current session');
          }
        }
      } catch (error) {
        console.error('❌ [Dashboard] Failed to load user data from backend:', error);
        // Still check context data as fallback
        if (selectedRole && careerRoadmap && careerRoadmap.length > 0) {
          console.log('✅ [Dashboard] Using context data as fallback');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // If role was just changed, skip backend load and use context data
    if (roleChanged) {
      console.log('🔄 [Dashboard] Role changed - using context data directly');
      console.log('📊 [Dashboard] Context state after role change:');
      console.log('  - selectedRole:', selectedRole?.title);
      console.log('  - extractedSkills:', extractedSkills?.length, 'skills');
      console.log('  - careerRoadmap:', careerRoadmap?.length, 'phases');
      
      if (careerRoadmap && careerRoadmap.length > 0) {
        console.log('  - Phase 1:', careerRoadmap[0]?.title || careerRoadmap[0]?.phase);
        console.log('  - Phase 1 skills:', careerRoadmap[0]?.skills?.length);
        console.log('  - Phase 1 resources:', careerRoadmap[0]?.resources?.length);
        console.log('  - Full Phase 1 data:', JSON.stringify(careerRoadmap[0], null, 2));
      }
      
      // Verify we have valid data
      if (!selectedRole || !careerRoadmap || careerRoadmap.length === 0) {
        console.error('❌ [Dashboard] Role changed but context data is missing!');
        console.log('   Redirecting to role selection...');
        navigate('/role-selection', { replace: true });
      } else {
        console.log('✅ [Dashboard] Using fresh context data from role change');
        setIsLoading(false);
        
        // Clear the roleChanged param after component has rendered
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      }
    } else {
      loadUserDataFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleChanged]); // Depend on roleChanged to re-run when it changes

  // Show loading spinner while checking user status
  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  // Dashboard is protected by ProtectedRoute now, so if user reaches here, they have analysis
  // No need for redundant redirect - just show empty state if data is somehow missing

  // Handle certificate upload for a specific skill
  const handleCertificateUpload = async () => {
    if (selectedPhase === null || selectedSkillIndex === null) return;
    
    // Validate based on upload method
    if (uploadMethod === 'url' && !certificateUrl.trim()) {
      alert('Please enter a certificate URL');
      return;
    }
    if (uploadMethod === 'file' && !certificateFile) {
      alert('Please select a certificate file');
      return;
    }
    
    const key = `phase_${selectedPhase}_skill_${selectedSkillIndex}`;
    const skill = careerRoadmap[selectedPhase].skills[selectedSkillIndex];
    const skillName = typeof skill === 'string' ? skill : skill?.name || 'Unknown Skill';
    
    let finalCertificateUrl = certificateUrl;
    
    // If file upload, upload to backend first
    if (uploadMethod === 'file' && certificateFile) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to upload certificates');
          return;
        }
        
        const formData = new FormData();
        formData.append('certificate', certificateFile);
        formData.append('phaseIndex', selectedPhase);
        formData.append('skillIndex', selectedSkillIndex);
        formData.append('platform', certificatePlatform);
        
        const response = await fetch(`${API_BASE_URL}/users/me/certificate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload certificate');
        }
        
        const data = await response.json();
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
        finalCertificateUrl = `${baseUrl}${data.data.certificateUrl}`;
        console.log('✅ Certificate file uploaded:', finalCertificateUrl);
      } catch (error) {
        console.error('❌ Certificate upload failed:', error);
        alert(`Failed to upload certificate: ${error.message}`);
        return;
      }
    }
    
    const updatedApprovals = {
      ...skillApprovals,
      [key]: {
        approved: true,
        certificateUrl: finalCertificateUrl,
        platform: certificatePlatform,
        skillName,
        uploadedAt: new Date().toISOString(),
      }
    };
    
    setSkillApprovals(updatedApprovals);
    setUserData('skillApprovals', updatedApprovals);

    // UPDATE BACKEND: Mark skill as approved in database
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Check if all skills in current phase will be approved after this upload
        const currentPhaseSkills = careerRoadmap[selectedPhase].skills;
        const allSkillsWillBeApproved = currentPhaseSkills.every((s, sIdx) => {
          if (sIdx === selectedSkillIndex) return true; // This skill will be approved
          const k = `phase_${selectedPhase}_skill_${sIdx}`;
          return updatedApprovals[k]?.approved === true || (typeof s === 'object' && s.approved);
        });

        console.log(`🔍 [Dashboard] After this upload, all skills approved in Phase ${selectedPhase + 1}:`, allSkillsWillBeApproved);

        // Update roadmap in database with corrected locked status
        const updatedRoadmap = {
          phases: careerRoadmap.map((phase, pIdx) => {
            // Determine if this phase should be unlocked
            let shouldBeUnlocked;
            if (pIdx === 0) {
              // Phase 1 always unlocked
              shouldBeUnlocked = true;
            } else if (pIdx === selectedPhase + 1 && allSkillsWillBeApproved) {
              // Next phase after current - unlock if current phase completed
              shouldBeUnlocked = true;
            } else if (pIdx <= selectedPhase) {
              // Current and previous phases - unlocked
              shouldBeUnlocked = true;
            } else {
              // Future phases - stay locked
              shouldBeUnlocked = false;
            }

            return {
              phaseNumber: pIdx + 1,
              title: phase.title || phase.phase,
              duration: phase.duration,
              locked: !shouldBeUnlocked,
              completed: pIdx === selectedPhase && allSkillsWillBeApproved ? true : (phase.completed || false),
              skills: phase.skills.map((s, sIdx) => {
                const isTargetSkill = pIdx === selectedPhase && sIdx === selectedSkillIndex;
                return {
                  name: typeof s === 'string' ? s : s.name,
                  completed: isTargetSkill ? true : (typeof s === 'object' ? s.completed : false),
                  approved: isTargetSkill ? true : (typeof s === 'object' ? s.approved : false),
                  certificateUrl: isTargetSkill ? certificateUrl : (typeof s === 'object' ? s.certificateUrl : null),
                  platform: isTargetSkill ? certificatePlatform : (typeof s === 'object' ? s.platform : null),
                };
              }),
              resources: phase.resources || [],
            };
          }),
        };

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
        await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roadmap: updatedRoadmap,
          }),
        });

        console.log('✅ [Dashboard] Skill marked as approved in database');

        // Update local state to reflect the change
        const updatedCareerRoadmap = [...careerRoadmap];
        if (typeof updatedCareerRoadmap[selectedPhase].skills[selectedSkillIndex] === 'object') {
          updatedCareerRoadmap[selectedPhase].skills[selectedSkillIndex].approved = true;
          updatedCareerRoadmap[selectedPhase].skills[selectedSkillIndex].completed = true;
          updatedCareerRoadmap[selectedPhase].skills[selectedSkillIndex].certificateUrl = certificateUrl;
          updatedCareerRoadmap[selectedPhase].skills[selectedSkillIndex].platform = certificatePlatform;
        }
        
        // If all skills approved, mark phase as completed
        if (allSkillsWillBeApproved) {
          updatedCareerRoadmap[selectedPhase].completed = true;
          // Unlock next phase
          if (selectedPhase + 1 < updatedCareerRoadmap.length) {
            updatedCareerRoadmap[selectedPhase + 1].locked = false;
            console.log(`🔓 [Dashboard] Auto-unlocked Phase ${selectedPhase + 2}`);
          }
        }
        
        setCareerRoadmap(updatedCareerRoadmap);

        // ADD NOTIFICATION TO BACKEND
        await fetch(`${API_BASE_URL}/users/me/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'skill_approved',
            message: `Certificate uploaded for skill: ${skillName}`,
          }),
        });
        console.log('✅ [Dashboard] Notification added for skill approval');

        // If all skills approved, show phase complete notification
        if (allSkillsWillBeApproved) {
          await fetch(`${API_BASE_URL}/users/me/notifications`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'phase_completed',
              message: `Phase ${selectedPhase + 1} completed! ${selectedPhase + 1 < careerRoadmap.length ? 'Next phase unlocked.' : 'All phases complete!'}`,
            }),
          });
        }
      }
    } catch (error) {
      console.error('❌ [Dashboard] Failed to update backend:', error);
    }
    
    // Reset form
    setCertificateUrl('');
    setCertificatePlatform('Udemy');
    setCertificateFile(null);
    setUploadMethod('url');
    setSelectedPhase(null);
    setSelectedSkillIndex(null);
  };
  
  // Handle unlock next phase - UPDATE BACKEND
  const handleUnlockNextPhase = async (phaseIndex) => {
    const nextPhaseIndex = phaseIndex + 1;
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Update backend roadmap to unlock next phase
        const updatedRoadmap = {
          phases: careerRoadmap.map((phase, pIdx) => ({
            phaseNumber: pIdx + 1,
            title: phase.title || phase.phase,
            duration: phase.duration,
            locked: pIdx <= nextPhaseIndex ? false : true, // Unlock up to next phase
            completed: phase.completed || false,
            skills: (phase.skills || []).map(s => ({
              name: typeof s === 'string' ? s : s.name,
              completed: typeof s === 'object' ? s.completed : false,
              approved: typeof s === 'object' ? s.approved : false,
              certificateUrl: typeof s === 'object' ? s.certificateUrl : null,
              platform: typeof s === 'object' ? s.platform : null,
            })),
            resources: phase.resources || [],
          })),
        };

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
        await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roadmap: updatedRoadmap,
          }),
        });

        console.log(`✅ [Dashboard] Phase ${nextPhaseIndex + 1} unlocked in database`);

        // Update local roadmap state
        const updatedLocalRoadmap = careerRoadmap.map((phase, pIdx) => ({
          ...phase,
          locked: pIdx <= nextPhaseIndex ? false : true,
        }));
        setCareerRoadmap(updatedLocalRoadmap);

        // ADD NOTIFICATION TO BACKEND
        await fetch(`${API_BASE_URL}/users/me/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'phase_unlocked',
            message: `Phase ${nextPhaseIndex + 1} unlocked! Start learning new skills.`,
          }),
        });
        
        alert(`🎉 Phase ${nextPhaseIndex + 1} unlocked! You can now start working on it.`);
        console.log('✅ [Dashboard] Notification added for phase unlock');
      }
    } catch (error) {
      console.error('❌ [Dashboard] Failed to unlock phase:', error);
      alert('Failed to unlock phase. Please try again.');
    }
  };

  // Handle resume update
  const handleUpdateResume = () => {
    navigate('/upload');
  };

  // Handle change career goal (reselect role)
  const handleChangeGoal = () => {
    if (confirm('Are you sure you want to change your career goal? This will redirect you to select a new role.')) {
      // Add query param to indicate user is changing goal (already has resume)
      navigate('/role-selection?changeGoal=true');
    }
  };

  // Debug: Log roadmap structure
  console.log('🗺️ [Dashboard] Career Roadmap Data:', careerRoadmap);
  console.log('🎯 [Dashboard] Selected Role:', selectedRole);
  if (careerRoadmap && careerRoadmap.length > 0) {
    console.log('📋 [Dashboard] Phase 0 Skills:', careerRoadmap[0]?.skills);
    console.log('📋 [Dashboard] Full Phase 0:', careerRoadmap[0]);
  }

  // Check if user has data
  if (!selectedRole || !careerRoadmap || careerRoadmap.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AcademicCapIcon className="w-24 h-24 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Career Roadmap</h2>
          <p className="text-slate-400 mb-6">Upload your resume to get started</p>
          <Button onClick={handleUpdateResume} icon={CloudArrowUpIcon}>
            Upload Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Career Roadmap</h1>
          <p className="text-slate-400 text-lg">
            {selectedRole.title} - Phase-Based Learning Path
          </p>
          {isExistingUser && userLastLogin && (
            <p className="text-slate-500 text-sm mt-1">
              Last login: {new Date(userLastLogin).toLocaleDateString()} at {new Date(userLastLogin).toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleChangeGoal} 
            icon={ArrowRightIcon} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Change Goal
          </Button>
          <Button onClick={handleUpdateResume} icon={DocumentPlusIcon} className="bg-slate-700 hover:bg-slate-600">
            Update Resume
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
              <p className="text-sm text-slate-400">
                {progress.completedPhases} of {progress.totalPhases} phases completed
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {progress.percentage}%
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Skill Radar Chart */}
      {radarData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Your Skills Overview</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#475569" style={{ fontSize: '10px' }} />
                <Radar name="Skill Level" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Phases */}
      <div className="space-y-6">
        {careerRoadmap.map((phase, phaseIndex) => {
          // CRITICAL FIX: Phase completion logic
          // A phase is completed ONLY IF it has skills AND all are approved
          
          const hasSkills = phase.skills && Array.isArray(phase.skills) && phase.skills.length > 0;
          
          const allSkillsApproved = hasSkills && phase.skills.every((skill, skillIdx) => {
            const key = `phase_${phaseIndex}_skill_${skillIdx}`;
            const approvedInStorage = skillApprovals[key]?.approved === true;
            const approvedInData = typeof skill === 'object' ? skill?.approved === true : false;
            return approvedInStorage || approvedInData;
          });
          
          // Check if previous phase is completed
          const isPreviousPhaseCompleted = phaseIndex === 0 ? true : (
            careerRoadmap[phaseIndex - 1].skills && 
            careerRoadmap[phaseIndex - 1].skills.length > 0 &&
            careerRoadmap[phaseIndex - 1].skills.every((skill, skillIdx) => {
              const key = `phase_${phaseIndex - 1}_skill_${skillIdx}`;
              const approvedInStorage = skillApprovals[key]?.approved === true;
              const approvedInData = typeof skill === 'object' ? skill?.approved === true : false;
              return approvedInStorage || approvedInData;
            })
          );
          
          const completed = allSkillsApproved;
          const unlocked = isPreviousPhaseCompleted;

          return (
            <Card 
              key={phaseIndex} 
              className={`transition-all ${
                completed ? 'border-green-500/50 bg-green-500/5' : 
                unlocked ? 'border-blue-500/50' : 
                'border-slate-700/50 opacity-60'
              }`}
            >
              {/* Phase Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {completed ? (
                    <CheckCircleIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                  ) : unlocked ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-sm">{phaseIndex + 1}</span>
                    </div>
                  ) : (
                    <LockClosedIcon className="w-8 h-8 text-slate-600 flex-shrink-0" />
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{phase.phase}</h3>
                    <p className="text-sm text-slate-400">{phase.duration}</p>
                    {phase.milestone && (
                      <p className="text-sm text-blue-400 mt-1">🎯 {phase.milestone}</p>
                    )}
                  </div>
                </div>

                {completed && (
                  <Badge variant="success">Completed</Badge>
                )}
                {!completed && !unlocked && (
                  <Badge variant="neutral">Locked</Badge>
                )}
              </div>

              {/* Phase Content - Only show if unlocked */}
              {unlocked && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-700">
                  {/* Skills with individual upload/approval status */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Required Skills:</h4>
                    {console.log(`📊 [Dashboard] Phase ${phaseIndex} skills:`, phase.skills, '| Count:', phase.skills?.length)}
                    {!phase.skills || phase.skills.length === 0 ? (
                      <div className="p-4 bg-slate-800/20 rounded-lg border border-slate-700/30">
                        <p className="text-slate-500 text-sm italic">No skills available for this phase</p>
                        <p className="text-xs text-slate-600 mt-2">Debug: Phase has no skills array or empty array</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {phase.skills.map((skill, skillIdx) => {
                          // Handle both string and object formats
                          const skillName = typeof skill === 'string' ? skill : skill?.name || 'Unnamed Skill';
                          const skillCompleted = typeof skill === 'object' ? skill?.completed : false;
                          const skillApproved = typeof skill === 'object' ? skill?.approved : false;
                          
                          // Also check localStorage for approval
                          const key = `phase_${phaseIndex}_skill_${skillIdx}`;
                          const isApprovedInStorage = skillApprovals[key]?.approved === true;
                          
                          // Skill is approved if either data says so OR localStorage says so
                          const isApproved = skillApproved || isApprovedInStorage;
                          
                          console.log(`🔍 [Dashboard] Phase ${phaseIndex} Skill ${skillIdx}:`, { 
                            skillName, 
                            skillCompleted, 
                            skillApproved, 
                            isApprovedInStorage, 
                            isApproved,
                            showButton: !isApproved 
                          });
                          
                          return (
                            <div key={skillIdx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                              <div className="flex items-center space-x-3">
                                <span className="text-slate-300 font-medium">{skillName}</span>
                              </div>
                              
                              {isApproved ? (
                                <Badge variant="success" size="sm" className="flex items-center space-x-1">
                                  <CheckCircleIcon className="w-3 h-3" />
                                  <span>Approved</span>
                                </Badge>
                              ) : (
                                <Button 
                                  onClick={() => {
                                    console.log('🎯 Upload Certificate clicked for:', skillName);
                                    setSelectedPhase(phaseIndex);
                                    setSelectedSkillIndex(skillIdx);
                                  }}
                                  size="sm"
                                  icon={CloudArrowUpIcon}
                                  className="text-xs"
                                >
                                  Upload Certificate
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Recommended Courses */}
                  {console.log(`📚 [Dashboard] Phase ${phaseIndex} resources:`, phase.resources, '| Count:', phase.resources?.length)}
                  {phase.resources && phase.resources.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Recommended Courses:</h4>
                      <div className="space-y-2">
                        {phase.resources.map((resource, idx) => {
                          // Handle both old format (string) and new format (object)
                          if (typeof resource === 'object' && resource.courseName) {
                            // New format with courseName, platform, link
                            return (
                              <div key={idx} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="text-sm font-medium text-white mb-1">{resource.courseName}</h5>
                                    <p className="text-xs text-slate-400">{resource.platform || 'Online'}</p>
                                  </div>
                                  {resource.link && (
                                    <a 
                                      href={resource.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="ml-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded-lg flex items-center space-x-1 transition-colors"
                                    >
                                      <span>View</span>
                                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          } else {
                            // Old format - string (URL or text)
                            const resourceStr = typeof resource === 'string' ? resource : String(resource);
                            const isUrl = resourceStr.startsWith('http://') || resourceStr.startsWith('https://');
                            
                            return (
                              <div key={idx} className="flex items-center space-x-2">
                                {isUrl ? (
                                  <a 
                                    href={resourceStr} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                  >
                                    <span>{resourceStr}</span>
                                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-sm">• {resourceStr}</span>
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-400 text-sm">⚠️ No recommended courses available for this phase</p>
                      <p className="text-xs text-slate-500 mt-1">Check back later or search online for relevant courses</p>
                    </div>
                  )}

                  {/* Certificate Upload Modal */}
                  {selectedPhase === phaseIndex && selectedSkillIndex !== null && (
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="text-sm font-semibold text-white mb-3">
                        Upload Certificate for: {typeof phase.skills[selectedSkillIndex] === 'string' ? phase.skills[selectedSkillIndex] : phase.skills[selectedSkillIndex]?.name}
                      </h4>
                      
                      <div className="space-y-3">
                        {/* Upload Method Toggle */}
                        <div className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={() => setUploadMethod('url')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              uploadMethod === 'url' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                          >
                            URL
                          </button>
                          <button
                            onClick={() => setUploadMethod('file')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              uploadMethod === 'file' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                          >
                            Upload File
                          </button>
                        </div>

                        {uploadMethod === 'url' ? (
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">
                              Certificate URL
                            </label>
                            <input 
                              type="text"
                              value={certificateUrl}
                              onChange={(e) => setCertificateUrl(e.target.value)}
                              placeholder="https://certificate-url.com"
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">
                              Certificate File (PDF, JPG, PNG)
                            </label>
                            <input 
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              onChange={(e) => setCertificateFile(e.target.files[0])}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                            />
                            {certificateFile && (
                              <p className="text-xs text-green-400 mt-1">
                                Selected: {certificateFile.name} ({(certificateFile.size / 1024).toFixed(2)} KB)
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Platform
                          </label>
                          <select 
                            value={certificatePlatform}
                            onChange={(e) => setCertificatePlatform(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="Udemy">Udemy</option>
                            <option value="Coursera">Coursera</option>
                            <option value="edX">edX</option>
                            <option value="FreeCodeCamp">FreeCodeCamp</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button 
                            onClick={handleCertificateUpload}
                            disabled={uploadMethod === 'url' ? !certificateUrl.trim() : !certificateFile}
                            size="sm"
                            className="flex-1"
                          >
                            Submit Certificate
                          </Button>
                          <Button 
                            onClick={() => {
                              setSelectedPhase(null);
                              setSelectedSkillIndex(null);
                              setCertificateUrl('');
                              setCertificatePlatform('Udemy');
                              setCertificateFile(null);
                              setUploadMethod('url');
                            }}
                            size="sm"
                            className="bg-slate-700 hover:bg-slate-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Unlock Next Phase Button */}
                  {allSkillsApproved && phaseIndex < careerRoadmap.length - 1 && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-green-400">✓ All skills approved! Ready to unlock next phase.</p>
                        <Button 
                          onClick={() => handleUnlockNextPhase(phaseIndex)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          icon={LockOpenIcon}
                        >
                          Unlock Next Phase
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Show phase completed message */}
                  {completed && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-400">✓ Phase completed! All skills verified.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Locked Message */}
              {!unlocked && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-500 italic">
                    Complete all skills in Phase {phaseIndex} to unlock this phase
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Internship Recommendations - Show after all phases completed */}
      {console.log('🎓 [Dashboard] Checking internship eligibility - Progress:', progress.percentage, '% | Threshold: 100%')}
      {progress.percentage === 100 ? (
        <Card className="border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-blue-500/10">
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h2>
              <p className="text-slate-300 mb-4">
                You've completed all phases of your learning roadmap for {selectedRole?.title}
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-blue-400" />
                Ready for Internship Opportunities
              </h3>
              
              <p className="text-slate-400 mb-4">
                Based on your skills and completed roadmap, you're now qualified to apply for internships in:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Dynamic Internship recommendations with real links */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="text-white font-semibold mb-2">{selectedRole?.title} Intern</h4>
                  <p className="text-sm text-slate-400 mb-3">Apply your skills in real-world projects</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {extractedSkills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="primary" size="sm">
                        {typeof skill === 'string' ? skill : skill.name}
                      </Badge>
                    ))}
                  </div>
                  <a 
                    href={`https://internshala.com/internships/${encodeURIComponent(selectedRole?.title.toLowerCase().replace(/\s+/g, '-'))}-internship`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="w-full">Apply on Internshala</Button>
                  </a>
                </div>
                
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <h4 className="text-white font-semibold mb-2">Software Development Intern</h4>
                  <p className="text-sm text-slate-400 mb-3">Work with leading tech companies</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="primary" size="sm">Problem Solving</Badge>
                    <Badge variant="primary" size="sm">Coding</Badge>
                    <Badge variant="primary" size="sm">Teamwork</Badge>
                  </div>
                  <a 
                    href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedRole?.title + ' intern')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="w-full">Apply on LinkedIn</Button>
                  </a>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <h4 className="text-white font-semibold mb-2">Startup Opportunities</h4>
                  <p className="text-sm text-slate-400 mb-3">Join innovative startups and grow fast</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="primary" size="sm">Fast-paced</Badge>
                    <Badge variant="primary" size="sm">Learning</Badge>
                    <Badge variant="primary" size="sm">Innovation</Badge>
                  </div>
                  <a 
                    href={`https://wellfound.com/role/l/${encodeURIComponent(selectedRole?.title.toLowerCase().replace(/\s+/g, '-'))}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="w-full">Apply on Wellfound</Button>
                  </a>
                </div>

                <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/30">
                  <h4 className="text-white font-semibold mb-2">Remote Internships</h4>
                  <p className="text-sm text-slate-400 mb-3">Work from anywhere with global companies</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="primary" size="sm">Remote</Badge>
                    <Badge variant="primary" size="sm">Flexible</Badge>
                    <Badge variant="primary" size="sm">Global</Badge>
                  </div>
                  <a 
                    href={`https://internshala.com/internships/work-from-home-${encodeURIComponent(selectedRole?.title.toLowerCase().replace(/\s+/g, '-'))}-internships`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="w-full">Apply for Remote</Button>
                  </a>
                </div>
              </div>

              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                <h4 className="text-white font-semibold mb-2">Next Steps:</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Update your resume with all the skills you've learned</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Build a portfolio showcasing projects that demonstrate your skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Practice technical interview questions related to {selectedRole?.title}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Network with professionals in your field on LinkedIn</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">5.</span>
                    <span>Apply to internships that match your skill level</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border border-blue-500/30 bg-slate-900/50">
          <div className="text-center p-6">
            <AcademicCapIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Keep Learning!</h3>
            <p className="text-slate-400 mb-4">
              Complete all phases to unlock internship recommendations
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progress to Internships</span>
                <span className="text-lg font-bold text-blue-400">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${progress.percentage}%` }}
                >
                  {progress.percentage > 10 && (
                    <span className="text-xs text-white font-semibold">{progress.percentage}%</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {progress.completedPhases} of {progress.totalPhases} phases completed
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
