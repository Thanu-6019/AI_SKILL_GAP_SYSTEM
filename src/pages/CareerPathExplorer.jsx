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

  const handleStartTracking = () => {
    console.log('📌 Starting to track role:', exploreRole.title);
    // Save explore role to context
    setSelectedRole(exploreRole);
    
    // Save dummy roadmap to context for dashboard display
    setCareerRoadmap(dummyRoadmap);
    
    // Save dummy skill gap data
    setSkillGapData({
      overallScore: exploreRole.matchScore,
      missingSkills: dummyMissingSkills,
      weakSkills: [],
      strongSkills: [],
      aiConfidence: 85,
    });
    
    console.log('✅ Role saved, navigating to dashboard');
    navigate('/dashboard');
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

  // Dummy roadmap timeline
  const dummyRoadmap = [
    {
      phase: 1,
      title: 'Foundation Building',
      duration: '2-3 months',
      status: 'upcoming',
      milestones: [
        'Complete foundational courses',
        'Build 2-3 beginner projects',
        'Join relevant communities'
      ]
    },
    {
      phase: 2,
      title: 'Skill Development',
      duration: '3-4 months',
      status: 'upcoming',
      milestones: [
        'Advanced certifications',
        'Real-world project experience',
        'Networking with professionals'
      ]
    },
    {
      phase: 3,
      title: 'Career Transition',
      duration: '2-3 months',
      status: 'upcoming',
      milestones: [
        'Portfolio development',
        'Interview preparation',
        'Job applications & networking'
      ]
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          
          <div className="space-y-6">
            {dummyRoadmap.map((phase, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < dummyRoadmap.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-amber-500 to-slate-700"></div>
                )}
                
                <div className="flex items-start space-x-6">
                  {/* Phase Number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 relative z-10">
                    <span className="text-white font-bold text-xl">{phase.phase}</span>
                  </div>
                  
                  {/* Phase Content */}
                  <div className="flex-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <ClockIcon className="w-4 h-4" />
                          <span>{phase.duration}</span>
                        </div>
                      </div>
                      <Badge variant="warning">Upcoming</Badge>
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
                  </div>
                </div>
              </div>
            ))}
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
  );
};

export default CareerPathExplorer;
