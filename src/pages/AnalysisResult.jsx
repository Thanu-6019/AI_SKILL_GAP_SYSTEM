import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillGap } from '../context';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Card, Badge, Button } from '../components/ui';

const AnalysisResult = () => {
  const navigate = useNavigate();
  const { 
    selectedRole,
    extractedSkills,
    skillGapData,
    recommendedCourses,
    careerRoadmap
  } = useSkillGap();

  // Safety check - redirect if no selected role
  useEffect(() => {
    console.log('🔍 AnalysisResult - Checking data...');
    console.log('  selectedRole:', selectedRole?.title);
    console.log('  extractedSkills:', extractedSkills?.length);
    
    if (!selectedRole) {
      console.log('⚠️ No selected role, redirecting to role selection');
      navigate('/role-selection', { replace: true });
    }
  }, [selectedRole, extractedSkills, navigate]);

  // Use context data instead of mock data
  const analysisData = {
    gapScore: skillGapData.overallScore,
    resumeSkills: extractedSkills,
    requiredSkills: selectedRole?.requiredSkills?.map(skill => ({
      name: skill,
      level: 85, // Can be enhanced with actual required levels
      category: 'Required',
    })) || [],
    missingSkills: skillGapData.missingSkills,
    recommendedCourses: recommendedCourses,
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'from-green-500';
    if (score >= 60) return 'from-yellow-500';
    return 'from-red-500';
  };

  const getPriorityVariant = (priority) => {
    if (priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'neutral';
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
              <span className="text-slate-400">Upload Resume</span>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">2</div>
              <span className="text-white font-medium">Analysis</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-semibold">3</div>
              <span className="text-slate-400">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Analysis Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Analysis Complete!</h1>
          <p className="text-xl text-slate-400">Here's your comprehensive skill gap analysis</p>
        </div>

        {/* Gap Score Card */}
        <Card className="mb-8 text-center bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700">
          <div className="flex flex-col items-center">
            <ChartBarIcon className="w-16 h-16 text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Overall Gap Score</h2>
            <div className={`text-7xl font-bold ${getScoreColor(analysisData.gapScore)} mb-4`}>
              {analysisData.gapScore}%
            </div>
            <p className="text-slate-400 max-w-xl mb-6">
              Your current skills match {analysisData.gapScore}% of the required skills for <span className="text-white font-semibold">{selectedRole?.title}</span>. 
              Let's bridge the remaining gap!
            </p>
            {/* AI Confidence */}
            <div className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 rounded-full border border-green-500/50">
              <SparklesIcon className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">AI Confidence: {skillGapData.aiConfidence}%</span>
            </div>
          </div>
        </Card>

        {/* Skills Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Skills */}
          <Card title="Your Current Skills" icon={AcademicCapIcon}>
            <div className="space-y-3 mt-4">
              {analysisData.resumeSkills.map((skill, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <Badge variant="primary" size="sm">{skill.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getScoreBgColor(skill.level)} to-blue-500`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(skill.level)}`}>{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Required Skills */}
          <Card title="Required Skills" icon={ChartBarIcon}>
            <div className="space-y-3 mt-4">
              {analysisData.requiredSkills.map((skill, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <Badge variant="warning" size="sm">{skill.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-purple-400">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Missing Skills */}
        <Card title="Missing Skills" subtitle="Skills you need to develop" icon={ExclamationTriangleIcon} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {analysisData.missingSkills.map((skill, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 rounded-xl p-4 border-l-4 border-red-500/50 hover:border-red-500 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">{skill.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityVariant(skill.priority)} size="sm">
                        {skill.priority} Priority
                      </Badge>
                      <span className="text-sm text-slate-400">Gap: {skill.gap}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weak Skills Section */}
        {skillGapData.weakSkills && skillGapData.weakSkills.length > 0 && (
          <Card title="Skills Needing Improvement" subtitle="Skills you have but need to strengthen" icon={ChartBarIcon} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {skillGapData.weakSkills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/50 rounded-xl p-4 border-l-4 border-yellow-500/50 hover:border-yellow-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{skill.name}</h4>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant={getPriorityVariant(skill.priority)} size="sm">
                          {skill.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Current:</span>
                      <span className="text-yellow-400 font-semibold">{skill.currentLevel}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Required:</span>
                      <span className="text-green-400 font-semibold">{skill.requiredLevel}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                        style={{ width: `${(skill.currentLevel / skill.requiredLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Career Roadmap */}
        {careerRoadmap && careerRoadmap.length > 0 && (
          <Card title="Your Career Roadmap" subtitle="Step-by-step path to achieve your goal" icon={ArrowRightIcon} className="mb-8">
            <div className="mt-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="space-y-8">
                {careerRoadmap.map((phase, index) => (
                  <div key={index} className="relative pl-20">
                    {/* Phase Number */}
                    <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                      {phase.phase}
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">{phase.title}</h4>
                          <p className="text-sm text-slate-400">{phase.duration}</p>
                        </div>
                      </div>
                      
                      {phase.focus && phase.focus.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Focus Skills:</h5>
                          <div className="flex flex-wrap gap-2">
                            {phase.focus.map((skill, idx) => (
                              <Badge key={idx} variant="primary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {phase.milestones && phase.milestones.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Milestones:</h5>
                          <ul className="space-y-1">
                            {phase.milestones.map((milestone, idx) => (
                              <li key={idx} className="text-sm text-slate-400 flex items-start space-x-2">
                                <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Recommended Courses */}
        {recommendedCourses && recommendedCourses.length > 0 && (
          <Card title="Recommended Courses" subtitle="Personalized learning path to bridge your gaps" icon={BookOpenIcon} className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {recommendedCourses.map((course, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors flex-1">
                      {course.title}
                    </h4>
                    {course.relevance && <Badge variant="success" size="sm">{course.relevance}%</Badge>}
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{course.provider}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">⏱️ {course.duration}</span>
                    {course.level && <Badge variant="neutral" size="sm">{course.level}</Badge>}
                  </div>
                  {course.skills && course.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {course.skills.map((skill, idx) => (
                        <Badge key={idx} variant="primary" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Access your personalized dashboard to track progress, explore courses, and achieve your career goals.
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            icon={ArrowRightIcon}
            className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
