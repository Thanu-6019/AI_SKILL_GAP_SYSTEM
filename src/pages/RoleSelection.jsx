import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BriefcaseIcon,
  CurrencyDollarIcon,
  FireIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { useSkillGap } from '../context';
import { Button, Badge } from '../components/ui';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { matchedRoles, extractedSkills, selectedRole, calculateSkillGap } = useSkillGap();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Dummy data for "Explore Other Career Paths" section
  const exploreRoles = [
    {
      id: 'explore-1',
      title: 'Business Analyst',
      matchScore: 58,
      salaryRange: '$65K - $95K',
      requiredSkills: ['SQL', 'Excel', 'Tableau', 'Business Intelligence', 'Data Analysis', 'JIRA'],
      demandLevel: 'High',
      companies: 320,
      type: 'Career Switch Role'
    },
    {
      id: 'explore-2',
      title: 'Data Scientist',
      matchScore: 52,
      salaryRange: '$90K - $130K',
      requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow', 'Data Visualization', 'SQL'],
      demandLevel: 'Very High',
      companies: 280,
      type: 'Career Switch Role'
    },
    {
      id: 'explore-3',
      title: 'AI/ML Engineer',
      matchScore: 48,
      salaryRange: '$100K - $150K',
      requiredSkills: ['Python', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'AWS'],
      demandLevel: 'Very High',
      companies: 210,
      type: 'Career Switch Role'
    },
    {
      id: 'explore-4',
      title: 'Product Manager',
      matchScore: 55,
      salaryRange: '$85K - $125K',
      requiredSkills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping', 'Analytics', 'Stakeholder Management'],
      demandLevel: 'High',
      companies: 410,
      type: 'Career Switch Role'
    },
    {
      id: 'explore-5',
      title: 'DevOps Engineer',
      matchScore: 62,
      salaryRange: '$80K - $120K',
      requiredSkills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'CI/CD', 'Terraform'],
      demandLevel: 'Very High',
      companies: 350,
      type: 'Career Switch Role'
    },
    {
      id: 'explore-6',
      title: 'Cloud Engineer',
      matchScore: 60,
      salaryRange: '$85K - $125K',
      requiredSkills: ['AWS', 'Azure', 'Cloud Architecture', 'Networking', 'Security', 'IaC'],
      demandLevel: 'Very High',
      companies: 390,
      type: 'Career Switch Role'
    },
  ];

  useEffect(() => {
    // Redirect if no matched roles
    if (!matchedRoles || matchedRoles.length === 0) {
      navigate('/upload');
    }
  }, [matchedRoles, navigate]);

  // Navigate after skill gap calculation completes
  useEffect(() => {
    if (shouldNavigate && selectedRole) {
      console.log('🚀 Navigating to /analysis with role:', selectedRole?.title);
      navigate('/analysis');
    }
  }, [shouldNavigate, selectedRole, navigate]);

  const handleRoleSelect = (role) => {
    console.log('🎯 Role selected:', role.title);
    setSelectedRoleId(role.id);
  };

  const handleContinue = () => {
    const role = matchedRoles.find(r => r.id === selectedRoleId);
    console.log('📍 Continue clicked. Selected role:', role?.title);
    console.log('📊 Current context - extractedSkills:', extractedSkills?.length, 'matchedRoles:', matchedRoles?.length);
    
    if (role) {
      console.log('✅ Calculating skill gap for:', role.title);
      calculateSkillGap(role);
      setShouldNavigate(true);
    } else {
      console.log('❌ No role selected');
    }
  };

  const handleExploreRoleClick = (role) => {
    console.log('🔍 Exploring career path:', role.title);
    // Navigate to career path with role name in URL
    const roleName = role.title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
    navigate(`/career-path/${roleName}`, { state: { exploreRole: role } });
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getDemandColor = (level) => {
    if (level === 'Very High') return 'text-green-400';
    if (level === 'High') return 'text-blue-400';
    return 'text-slate-400';
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-10 h-10 text-green-400" />
              <span className="text-slate-400">Upload</span>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-10 h-10 text-green-400" />
              <span className="text-slate-400">Processing</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-500"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">3</div>
              <span className="text-white font-medium">Select Role</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-semibold">4</div>
              <span className="text-slate-400">Analysis</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-2xl shadow-blue-500/30">
            <BriefcaseIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Select Your Target Role</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Based on your skills, we've identified {matchedRoles.length} roles that match your profile. 
            Select one to get a detailed skill gap analysis and personalized learning path.
          </p>
        </div>

        {/* AI Recommended Roles Label */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">AI Recommended Roles</h2>
            <Badge variant="primary" className="ml-2">Best Match</Badge>
          </div>
          <p className="text-slate-400 mt-2 ml-9">These roles closely match your current skill set</p>
        </div>

        {/* Extracted Skills Summary */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-6 mb-12 border border-blue-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Your Extracted Skills ({extractedSkills.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill, index) => (
              <Badge key={index} variant="primary" className="px-4 py-2">
                {skill.name} • {skill.level}%
              </Badge>
            ))}
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {matchedRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              className={`relative bg-slate-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                selectedRoleId === role.id
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]'
                  : 'border-slate-700 hover:border-slate-600 hover:shadow-xl'
              }`}
            >
              {/* Selected Badge */}
              {selectedRoleId === role.id && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <CheckCircleIcon className="w-7 h-7 text-white" />
                </div>
              )}

              {/* Role Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>{role.salaryRange}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span>{role.companies} companies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Match Score</span>
                  <span className={`text-2xl font-bold ${getMatchColor(role.matchScore)}`}>
                    {role.matchScore}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${role.matchScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Demand Level */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm">Market Demand</span>
                <div className="flex items-center space-x-2">
                  <FireIcon className={`w-5 h-5 ${getDemandColor(role.demandLevel)}`} />
                  <Badge variant={role.demandLevel === 'Very High' ? 'success' : 'warning'}>
                    {role.demandLevel}
                  </Badge>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {role.requiredSkills.slice(0, 6).map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full ${
                        extractedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {role.requiredSkills.length > 6 && (
                    <span className="px-3 py-1 text-xs rounded-full bg-slate-700 text-slate-400">
                      +{role.requiredSkills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
          >
            Start Over
          </button>
          <Button
            onClick={handleContinue}
            disabled={!selectedRoleId}
            icon={ArrowRightIcon}
            className={`px-8 py-4 ${!selectedRoleId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continue to Analysis
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[#0f172a] text-slate-500 text-sm font-medium">OR</span>
          </div>
        </div>

        {/* Explore Other Career Paths Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <LightBulbIcon className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Explore Other Career Paths</h2>
            <Badge variant="warning" className="ml-2">Career Switch</Badge>
          </div>
          <p className="text-slate-400 mb-8 ml-9">
            Discover new opportunities beyond your current skill set. These roles may require additional training but offer exciting career pivots.
          </p>

          {/* Explore Roles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exploreRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleExploreRoleClick(role)}
                className="relative bg-slate-800/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 border-slate-700/50 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10"
              >
                {/* Explore Path Badge */}
                <div className="absolute -top-3 -right-3">
                  <Badge variant="warning" className="shadow-lg">
                    <LightBulbIcon className="w-3 h-3 inline mr-1" />
                    Explore Path
                  </Badge>
                </div>

                {/* Role Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span>{role.salaryRange}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        <span>{role.companies} companies</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Potential Match</span>
                    <span className={`text-2xl font-bold ${getMatchColor(role.matchScore)}`}>
                      {role.matchScore}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 transition-all duration-1000"
                      style={{ width: `${role.matchScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Demand Level */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">Market Demand</span>
                  <div className="flex items-center space-x-2">
                    <FireIcon className={`w-5 h-5 ${getDemandColor(role.demandLevel)}`} />
                    <Badge variant={role.demandLevel === 'Very High' ? 'success' : 'warning'}>
                      {role.demandLevel}
                    </Badge>
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.requiredSkills.slice(0, 6).map((skill, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 text-xs rounded-full ${
                          extractedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Switch Label */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{role.type}</span>
                    <span className="text-amber-400">Click to explore →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
