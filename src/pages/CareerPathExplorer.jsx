import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSkillGap } from '../context';
import { 
  LightBulbIcon,
  AcademicCapIcon,
  ClockIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { Card, Badge, Button } from '../components/ui';

const CareerPathExplorer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roleName } = useParams();
  const { setSelectedRole, setCareerRoadmap, setSkillGapData } = useSkillGap();
  const exploreRole = location.state?.exploreRole;

  useEffect(() => {
    if (!exploreRole) {
      console.log('⚠️ No explore role data, redirecting to role selection');
      navigate('/role-selection', { replace: true });
    }
  }, [exploreRole, navigate]);

  const handleStartTracking = async () => {
    console.log('📌 Starting to track role:', exploreRole.title);
    
    try {
      // Get the auth token
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      
      // Save the new role and roadmap to context FIRST
      setSelectedRole(exploreRole);
      setCareerRoadmap(dummyRoadmap);
      setSkillGapData({
        overallScore: exploreRole.matchScore,
        missingSkills: dummyMissingSkills,
        weakSkills: [],
        strongSkills: [],
        aiConfidence: 85,
      });
      
      console.log('✅ Role saved to context');
      
      if (token) {
        // Save the new role and roadmap to backend
        console.log('💾 Saving new role to backend:', exploreRole.title);
        
        const updatePayload = {
          jobTitle: exploreRole.title,
          roadmap: {
            selectedRole: exploreRole,
            phases: dummyRoadmap
          }
        };
        
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
          });
          
          if (response.ok) {
            console.log('✅ Successfully saved new role to backend');
          } else {
            console.error('❌ Failed to save role to backend:', response.statusText);
          }
        } catch (fetchError) {
          console.error('❌ Error saving to backend:', fetchError);
        }
      }
      
      console.log('✅ Navigating to dashboard with new role');
      // Navigate to dashboard - add a query param to force refresh
      navigate('/dashboard?roleChanged=true');
    } catch (error) {
      console.error('❌ Error in handleStartTracking:', error);
      // Still navigate even if there's an error
      navigate('/dashboard?roleChanged=true');
    }
  };

  if (!exploreRole) {
    return null;
  }

  // Dummy missing skills data
  const dummyMissingSkills = [
    { name: 'Advanced Analytics', priority: 'High', estimatedTime: '3 months' },
    { name: 'Domain Expertise', priority: 'High', estimatedTime: '4 months' },
    { name: 'Communication Skills', priority: 'Medium', estimatedTime: '2 months' },
    { name: 'Industry Tools', priority: 'Medium', estimatedTime: '2 months' },
    { name: 'Certification', priority: 'Low', estimatedTime: '1 month' },
  ];

  // Generate certifications for each missing skill
  const generateCertificationsForSkills = (skills) => {
    return skills.flatMap(skill => [
      {
        id: `cert-${skill.name}-1`,
        courseName: `${skill.name} Fundamentals`,
        platform: 'Coursera',
        duration: '4 weeks',
        certificationType: 'Professional Certificate',
        relatedSkill: skill.name,
        completed: false
      },
      {
        id: `cert-${skill.name}-2`,
        courseName: `Advanced ${skill.name}`,
        platform: 'Udemy',
        duration: '6 weeks',
        certificationType: 'Specialization',
        relatedSkill: skill.name,
        completed: false
      }
    ]);
  };

  // Dummy roadmap timeline with certifications in Phase 1
  const dummyRoadmap = [
    {
      phase: 1,
      title: 'Core Skill Improvement',
      duration: '2-3 months',
      status: 'upcoming',
      milestones: [
        'Complete foundational courses',
        'Build 2-3 beginner projects',
        'Join relevant communities'
      ],
      certifications: generateCertificationsForSkills(dummyMissingSkills)
    },
    {
      phase: 2,
      title: 'Practical Application',
      duration: '3-4 months',
      status: 'upcoming',
      milestones: [
        'Real-world project experience',
        'Networking with professionals',
        'Build portfolio projects'
      ],
      projects: [
        { name: 'Portfolio Project 1', completed: false },
        { name: 'Capstone Project', completed: false }
      ]
    },
    {
      phase: 3,
      title: 'Career Transition',
      duration: '2-3 months',
      status: 'locked',
      milestones: [
        'Portfolio development',
        'Interview preparation',
        'Job applications & networking'
      ],
      internshipSuggestions: true
    }
  ];

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (priority === 'Medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">SB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SkillBridge AI</span>
            </div>
            <button
              onClick={() => navigate('/role-selection')}
              className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Roles</span>
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-6 shadow-2xl shadow-amber-500/30">
            <LightBulbIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{exploreRole.title}</h1>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Badge variant="warning" size="lg">Career Switch Role</Badge>
            <Badge variant="neutral" size="lg">Exploratory Path</Badge>
          </div>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore this career path and discover what it takes to make the transition
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl p-8 mb-8 border-2 border-amber-500/30">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="w-12 h-12 text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
                <SparklesIcon className="w-6 h-6 text-amber-400 mr-2" />
                AI Skill Gap Analysis Coming Soon
              </h2>
              <p className="text-slate-300 text-lg mb-4">
                Our AI is learning to analyze career switch paths! Soon, you'll get personalized insights on:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Transferable skills identification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Personalized learning paths</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Estimated transition timeline</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Recommended courses & certifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Role Overview */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 text-blue-400 mr-3" />
            Role Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400 text-sm mb-2">Potential Match</div>
              <div className="text-3xl font-bold text-amber-400 mb-2">{exploreRole.matchScore}%</div>
              <div className="text-sm text-slate-500">Based on current skills</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400 text-sm mb-2">Salary Range</div>
              <div className="text-3xl font-bold text-green-400 mb-2">{exploreRole.salaryRange}</div>
              <div className="text-sm text-slate-500">Average in US market</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400 text-sm mb-2">Market Demand</div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{exploreRole.demandLevel}</div>
              <div className="text-sm text-slate-500">{exploreRole.companies}+ companies hiring</div>
            </div>
          </div>
        </Card>

        {/* Key Skills to Acquire */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <AcademicCapIcon className="w-6 h-6 text-purple-400 mr-3" />
            Key Skills to Acquire (Sample)
          </h2>
          <p className="text-slate-400 mb-6">
            These are placeholder skills to give you an idea of what might be required for career transition:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyMissingSkills.map((skill, index) => (
              <div 
                key={index}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                  <Badge variant={skill.priority === 'High' ? 'danger' : skill.priority === 'Medium' ? 'warning' : 'neutral'}>
                    {skill.priority}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span>Est. Time: {skill.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Career Transition Roadmap */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <RocketLaunchIcon className="w-6 h-6 text-pink-400 mr-3" />
            Sample Career Transition Roadmap
          </h2>
          <p className="text-slate-400 mb-8">
            A typical journey for transitioning to this role might look like this:
          </p>
          
          <div className="flex gap-6">
            {/* Timeline Column */}
            <div className="relative flex flex-col items-center" style={{ width: '100px' }}>
              {/* Vertical Timeline Line */}
              <div className="absolute top-10 bottom-10 left-1/2 w-0.5 bg-gradient-to-b from-amber-500 to-slate-700" style={{ transform: 'translateX(-50%)', zIndex: 0 }}></div>
              
              {/* Timeline Circles */}
              {dummyRoadmap.map((phase, index) => (
                <div key={index} className="relative z-10 mb-12 last:mb-0" style={{ marginTop: index === 0 ? '0' : '48px' }}>
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <div className="text-center px-1">
                      <div className="text-xs font-medium text-white opacity-90">Phase</div>
                      <div className="text-2xl font-bold text-white">{index + 1}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Content Column */}
            <div className="flex-1 space-y-12">
            {dummyRoadmap.map((phase, index) => (
              <div key={index}>
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <ClockIcon className="w-4 h-4" />
                          <span>{phase.duration}</span>
                        </div>
                      </div>
                      <Badge variant={phase.status === 'locked' ? 'neutral' : 'warning'}>
                        {phase.status === 'locked' ? 'Locked' : 'Upcoming'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3">Key Milestones:</h4>
                      {phase.milestones.map((milestone, mIndex) => (
                        <div key={mIndex} className="flex items-center space-x-3 text-slate-400">
                          <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
                          <span>{milestone}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Phase 1: Show Certifications */}
                    {phase.certifications && phase.certifications.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <h4 className="text-sm font-semibold text-purple-400 mb-4 flex items-center">
                          <AcademicCapIcon className="w-4 h-4 mr-2" />
                          Suggested Certifications ({phase.certifications.length})
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {phase.certifications.slice(0, 6).map((cert, cIndex) => (
                            <div key={cIndex} className="bg-slate-900 rounded-lg p-4 border border-purple-500/30">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="text-sm font-medium text-white">{cert.courseName}</h5>
                                <Badge variant="primary" size="sm">{cert.platform}</Badge>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-slate-400">
                                <span>Duration: {cert.duration}</span>
                                <span>•</span>
                                <span>{cert.certificationType}</span>
                              </div>
                              <div className="text-xs text-purple-400 mt-2">
                                For: {cert.relatedSkill}
                              </div>
                            </div>
                          ))}
                          {phase.certifications.length > 6 && (
                            <p className="text-xs text-slate-500 text-center">
                              +{phase.certifications.length - 6} more certifications
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Phase 2: Show Projects */}
                    {phase.projects && phase.projects.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <h4 className="text-sm font-semibold text-blue-400 mb-4">
                          Projects to Complete ({phase.projects.length})
                        </h4>
                        <div className="space-y-2">
                          {phase.projects.map((project, pIndex) => (
                            <div key={pIndex} className="flex items-center space-x-3 text-slate-400">
                              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                              <span>{project.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Phase 3: Internship Note */}
                    {phase.internshipSuggestions && (
                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                          <h4 className="text-sm font-semibold text-green-400 mb-2">
                            Internship Opportunities
                          </h4>
                          <p className="text-xs text-slate-400">
                            Once Phase 1 & 2 are completed, you'll see personalized internship suggestions here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            ))}
            </div>
          </div>
        </Card>

        {/* Action Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start This Journey?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Begin tracking your progress toward this role. We'll create a personalized dashboard to help you achieve your career goals.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => navigate('/role-selection')}
              variant="outline"
              className="px-6 py-3"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2 inline" />
              Back to Role Selection
            </Button>
            <Button
              onClick={handleStartTracking}
              className="px-6 py-3"
            >
              <RocketLaunchIcon className="w-4 h-4 mr-2 inline" />
              Start Tracking This Role
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPathExplorer;
