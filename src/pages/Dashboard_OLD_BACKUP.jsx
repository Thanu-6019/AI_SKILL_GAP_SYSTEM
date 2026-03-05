import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { Card, Badge, Button } from '../components/ui';
import { SkillGapChart } from '../components/charts';
import { useSkillGap } from '../context';
import { getUserDataField, setUserData, getCareerMetrics, trackCourseClick } from '../utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { skillGapData, extractedSkills, selectedRole, careerRoadmap, recommendedCourses } = useSkillGap();

  // Get career metrics including improvements
  const careerMetrics = useMemo(() => getCareerMetrics(), [skillGapData]);

  // Track clicked courses
  const [trackedCourses, setTrackedCourses] = useState(() => getUserDataField('trackedCourses', []));

  // Handle course click
  const handleCourseClick = (course, skillName) => {
    try {
      console.log('📚 [Dashboard] Course clicked:', { course, skillName });
      const updated = trackCourseClick(course, skillName);
      setTrackedCourses(updated);
      
      // Open course link (backend uses 'url', some mock data might use 'link')
      const courseUrl = course.url || course.link;
      if (courseUrl) {
        console.log('🔗 [Dashboard] Opening course link:', courseUrl);
        window.open(courseUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.warn('⚠️ [Dashboard] No url/link found for course:', course.title);
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error handling course click:', error);
    }
  };

  // Debug: Log component mount and data availability
  console.log('\n═══════════════════════════════════════');
  console.log('📊 [Dashboard] COMPONENT MOUNTED');
  console.log('═══════════════════════════════════════');
  console.log('📊 [Dashboard] Full data state:', {
    extractedSkills: {
      count: extractedSkills?.length || 0,
      data: extractedSkills,
    },
    selectedRole: {
      title: selectedRole?.title || 'None',
      data: selectedRole,
    },
    skillGapData: {
      overallScore: skillGapData?.overallScore || 0,
      missingSkills: skillGapData?.missingSkills?.length || 0,
      missingSkillsData: skillGapData?.missingSkills,
      weakSkills: skillGapData?.weakSkills?.length || 0,
      strongSkills: skillGapData?.strongSkills?.length || 0,
      fullData: skillGapData,
    },
    careerRoadmap: {
      count: careerRoadmap?.length || 0,
      data: careerRoadmap,
    },
  });
  console.log('═══════════════════════════════════════\n');

  // Safety check - ensure context is available
  if (!skillGapData) {
    console.error('❌ SkillGapContext data is undefined!');
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error loading dashboard data</p>
          <Button onClick={() => navigate('/upload')} className="mt-4">
            Upload Resume
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has any data - show welcome message if not
  const hasData = extractedSkills && extractedSkills.length > 0;

  const stats = [
    {
      title: 'Target Role',
      value: selectedRole?.title || 'Not Selected',
      change: selectedRole?.type || 'Upload Resume',
      icon: AcademicCapIcon,
      trend: 'up',
      color: 'blue',
    },
    {
      title: 'Match Score',
      value: `${skillGapData.overallScore || 0}%`,
      change: careerMetrics.previousMatchScore !== null && careerMetrics.currentMatchScore !== careerMetrics.previousMatchScore
        ? `${careerMetrics.currentMatchScore > careerMetrics.previousMatchScore ? '+' : ''}${careerMetrics.currentMatchScore - careerMetrics.previousMatchScore}% from last`
        : hasData ? 'Current Level' : 'No data yet',
      icon: ChartBarIcon,
      trend: careerMetrics.previousMatchScore !== null && careerMetrics.currentMatchScore > careerMetrics.previousMatchScore ? 'up' : 'neutral',
      color: 'purple',
    },
    {
      title: 'Missing Skills',
      value: skillGapData.missingSkills?.length || 0,
      change: hasData ? 'Skills to learn' : 'Upload resume',
      icon: BookOpenIcon,
      trend: 'neutral',
      color: 'green',
    },
    {
      title: 'Certifications',
      value: `${careerMetrics.certificationsCompleted || 0}/${careerMetrics.certificationsTotal || 0}`,
      change: careerMetrics.certificationsTotal > 0 
        ? `${careerMetrics.certificationsProgress}% complete`
        : 'Add certifications',
      icon: AcademicCapIcon,
      trend: 'up',
      color: 'amber',
    },
  ];

  // Dynamic Recent Activity based on user data
  const recentActivities = useMemo(() => {
    // Check if user has data
    if (!hasData) {
      return [];
    }

    const activities = [];
    
    // Add assessment activity if role selected
    if (selectedRole) {
      activities.push({
        id: 1,
        action: 'Assessment',
        item: `${selectedRole.title} compatibility check`,
        time: 'Recently',
        type: 'success'
      });
    }

    // Add skill extraction activity
    if (extractedSkills?.length > 0) {
      activities.push({
        id: 2,
        action: 'Analyzed',
        item: `${extractedSkills.length} skills from resume`,
        time: 'Recently',
        type: 'primary'
      });
    }

    // Add roadmap activity
    if (careerRoadmap?.length > 0) {
      activities.push({
        id: 3,
        action: 'Generated',
        item: `${careerRoadmap.length}-phase career roadmap`,
        time: 'Recently',
        type: 'warning'
      });
    }

    return activities;
  }, [hasData, selectedRole, extractedSkills, careerRoadmap]);

  // CAREER GROWTH TRACKER: No fake streak - removed
  // Metrics are now based on real career progress (certifications, internships, skills improved)

  const recentActivitiesPlaceholder = [];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-400',
      purple: 'bg-purple-500/10 text-purple-400',
      green: 'bg-green-500/10 text-green-400',
      amber: 'bg-amber-500/10 text-amber-400',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header with Upload Button */}
      <div className="bg-gradient-to-r from-slate-800/50 to-transparent p-6 rounded-2xl border border-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
            <p className="text-slate-400 text-lg">
              {selectedRole ? `Tracking your journey to becoming a ${selectedRole.title}` : 'Welcome back! Here\'s your skill gap analysis overview.'}
            </p>
            {/* Match Score Improvement Indicator */}
            {careerMetrics.previousMatchScore !== null && hasData && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-slate-400">Match Score:</span>
                <span className="text-lg font-semibold text-white">{careerMetrics.currentMatchScore}%</span>
                {careerMetrics.currentMatchScore !== careerMetrics.previousMatchScore && (
                  <Badge 
                    variant={careerMetrics.currentMatchScore > careerMetrics.previousMatchScore ? 'success' : 'warning'}
                    size="sm"
                  >
                    {careerMetrics.currentMatchScore > careerMetrics.previousMatchScore ? '+' : ''}
                    {careerMetrics.currentMatchScore - careerMetrics.previousMatchScore}% from last analysis
                  </Badge>
                )}
              </div>
            )}
          </div>
          {/* Action Buttons */}
          {hasData && (
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/role-selection')}
                variant="secondary"
              >
                Change Target Role
              </Button>
              <Button 
                icon={ArrowUpTrayIcon}
                onClick={() => navigate('/upload')}
                variant="secondary"
              >
                Upload New Resume
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* No Data Message */}
      {!hasData && (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
              <AcademicCapIcon className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Welcome to Your Dashboard</h3>
            <p className="text-slate-400 mb-6 max-w-lg">
              Start your career journey by uploading your resume. Our AI will analyze your skills and recommend personalized learning paths.
            </p>
            <Button
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Upload Resume to Get Started
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hoverable className="group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm mb-2 group-hover:text-slate-300 transition-colors">{stat.title}</p>
                <h3 className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform origin-left">{stat.value}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${stat.trend === 'up' ? 'bg-green-500' : 'bg-slate-500'} animate-pulse`}></div>
                  <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{stat.change}</p>
                </div>
              </div>
              <div className={`p-4 ${getColorClasses(stat.color)} rounded-2xl ring-2 ring-transparent group-hover:ring-current/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Gap Chart */}
        <Card title="Skill Gap Analysis" subtitle="Current vs Required Levels" className="lg:col-span-2 overflow-hidden">
          <div className="w-full h-80 mt-4 -mx-2" style={{ minHeight: '320px' }}>
            <SkillGapChart />
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Your latest updates">
          <div className="space-y-3 mt-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-all duration-300 border border-transparent hover:border-slate-700/50 group cursor-pointer">
                  <ClockIcon className="w-5 h-5 text-slate-400 mt-0.5 group-hover:text-blue-400 transition-colors" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={activity.type} size="sm">
                        {activity.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium">{activity.item}</p>
                    <p className="text-xs text-slate-500 mt-1.5">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-2">No recent activity yet</p>
                <p className="text-sm text-slate-500">Upload your resume to start tracking</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Next Steps" subtitle="Recommended actions" hoverable>
          <div className="space-y-3 mt-4">
            {(() => {
              console.log('🔍 [Dashboard] Rendering Missing Skills section');
              console.log('   Missing Skills Data:', skillGapData?.missingSkills);
              console.log('   Missing Skills Count:', skillGapData?.missingSkills?.length);
              console.log('   Has Data:', hasData);
              
              // Check if we have missing skills data
              if (skillGapData?.missingSkills && Array.isArray(skillGapData.missingSkills) && skillGapData.missingSkills.length > 0) {
                console.log('✅ [Dashboard] Rendering', skillGapData.missingSkills.length, 'missing skills');
                return skillGapData.missingSkills.slice(0, 5).map((skill, index) => {
                  // Handle both string and object formats
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  const priority = skill.priority || 'High';
                  const learningTime = skill.learningTime || skill.estimatedTime || 'TBD';
                  const gap = skill.gap || 50;
                  
                  const priorityColor = priority === 'High' ? 'blue' : priority === 'Medium' ? 'purple' : 'green';
                  
                  return (
                    <div key={index} className={`flex items-start space-x-3 p-4 bg-gradient-to-r from-${priorityColor}-500/10 to-transparent rounded-xl border border-${priorityColor}-500/30 hover:border-${priorityColor}-500/50 transition-all duration-300 group cursor-pointer`}>
                      <div className={`w-3 h-3 bg-${priorityColor}-500 rounded-full animate-pulse group-hover:scale-125 transition-transform mt-1`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium">{skillName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {priority && (
                            <p className="text-xs text-slate-500">Priority: <span className={`text-${priorityColor}-400 font-semibold`}>{priority}</span></p>
                          )}
                          {learningTime && learningTime !== 'TBD' && (
                            <p className="text-xs text-slate-500">Time: <span className="text-amber-400">{learningTime}</span></p>
                          )}
                          {gap && (
                            <p className="text-xs text-slate-500">Gap: <span className="text-red-400">{gap}%</span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              } else if (hasData && selectedRole) {
                // User has data but no missing skills - they're a perfect match!
                console.log('🎉 [Dashboard] No missing skills - perfect match!');
                return (
                  <div className="text-center py-8 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border border-green-500/30">
                    <div className="text-5xl mb-3">🎉</div>
                    <p className="text-green-400 font-semibold mb-2">Perfect Match!</p>
                    <p className="text-sm text-slate-400">You have all the required skills for {selectedRole.title}</p>
                    <p className="text-xs text-slate-500 mt-2">Focus on building projects to showcase your expertise</p>
                  </div>
                );
              } else {
                // No data yet - show placeholder
                console.log('⚠️ [Dashboard] No data yet, showing placeholder');
                return (
                  <>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                      <p className="text-sm text-slate-200 group-hover:text-white transition-colors">Complete TypeScript fundamentals course</p>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                      <p className="text-sm text-slate-200 group-hover:text-white transition-colors">Take AWS certification assessment</p>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300 group cursor-pointer">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                      <p className="text-sm text-slate-200 group-hover:text-white transition-colors">Practice Docker containerization</p>
                    </div>
                  </>
                );
              }
            })()}
          </div>
        </Card>

        <Card title="Career Progress Metrics" subtitle="Your growth journey" hoverable>
          <div className="mt-4 space-y-3">
            {/* Match Score Progress */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300 text-sm">Match Score</span>
              <span className="text-white font-semibold text-lg">{careerMetrics.currentMatchScore}%</span>
            </div>
            
            {/* Certifications Progress */}
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Certifications Completed</span>
                <span className="text-white font-semibold text-lg">
                  {careerMetrics.certificationsCompleted}/{careerMetrics.certificationsTotal}
                </span>
              </div>
              {careerMetrics.certificationsTotal > 0 && (
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${careerMetrics.certificationsProgress}%` }}
                  />
                </div>
              )}
            </div>
            
            {/* Skills Improved */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300 text-sm">Skills Improved</span>
              <span className="text-white font-semibold text-lg">{careerMetrics.skillsImproved}</span>
            </div>
            
            {/* Internship Readiness */}
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Internship Readiness</span>
                <span className={`font-semibold text-sm px-3 py-1 rounded-full ${
                  careerMetrics.internshipReadiness === 'Ready' 
                    ? 'bg-green-500/20 text-green-400' 
                    : careerMetrics.internshipReadiness === 'Nearly Ready'
                    ? 'bg-amber-500/20 text-amber-400'
                    : careerMetrics.internshipReadiness === 'In Progress'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {careerMetrics.internshipReadiness}
                </span>
              </div>
              {!careerMetrics.internshipReadinessUnlocked && (
                <p className="text-xs text-slate-500 mt-2">Complete certifications and projects to unlock</p>
              )}
            </div>

            {!hasData && (
              <p className="text-slate-500 text-sm mt-3 text-center">Upload resume to start tracking your career growth!</p>
            )}
          </div>
        </Card>
      </div>

      {/* Career Roadmap Section - Enhanced with detailed phase information */}
      {careerRoadmap && careerRoadmap.length > 0 && (
        <Card title="Your Career Roadmap" subtitle={`Path to ${selectedRole?.title || 'your goal'}`}>
          {(() => {
            console.log('🗺️ [Dashboard] Rendering Career Roadmap');
            console.log('   Roadmap Data:', careerRoadmap);
            console.log('   Phases:', careerRoadmap.length);
            return null;
          })()}
          <div className="mt-6 space-y-4">
            {careerRoadmap.map((phase, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">{phase.title || `Phase ${index + 1}`}</h4>
                    <Badge variant="warning" size="sm">{phase.duration || 'Ongoing'}</Badge>
                  </div>
                  
                  {/* Focus Skills Section */}
                  {phase.focus && Array.isArray(phase.focus) && phase.focus.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                        <span className="text-amber-400 mr-2">📚</span>
                        What to Learn:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {phase.focus.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm border border-amber-500/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Milestones Section */}
                  {phase.milestones && Array.isArray(phase.milestones) && phase.milestones.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Action Steps:
                      </h5>
                      <ul className="space-y-2">
                        {phase.milestones.map((milestone, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Phase Description if no milestones */}
                  {(!phase.milestones || phase.milestones.length === 0) && phase.description && (
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {phase.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Courses Section */}
      {recommendedCourses && recommendedCourses.length > 0 && (
        <Card 
          title="Recommended Courses" 
          subtitle="Learn the skills you need to reach your goal"
          className="mt-6"
        >
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCourses.map((course, index) => {
              const isTracked = trackedCourses.some(c => 
                c.id === course.id || c.title === course.title
              );
              const trackedCourse = trackedCourses.find(c => 
                c.id === course.id || c.title === course.title
              );
              
              return (
                <div 
                  key={index} 
                  className={`p-4 bg-slate-900/50 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer group ${
                    isTracked 
                      ? 'border-blue-500/50 hover:border-blue-500' 
                      : 'border-slate-700/50 hover:border-purple-500/50'
                  }`}
                  onClick={() => handleCourseClick(course, course.skill)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-400">{course.platform}</p>
                    </div>
                    {isTracked && trackedCourse?.status === 'completed' ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                    ) : isTracked ? (
                      <Badge variant="primary" size="sm">Learning</Badge>
                    ) : (
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  {course.skill && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30">
                        {course.skill}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-3">
                      {course.duration && (
                        <span className="flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {course.duration}
                        </span>
                      )}
                      {course.level && (
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                          {course.level}
                        </span>
                      )}
                    </div>
                    {course.rating && (
                      <span className="text-amber-400">★ {course.rating}</span>
                    )}
                  </div>
                  
                  {isTracked && trackedCourse && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500">
                        Started: {new Date(trackedCourse.clickedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {hasData && recommendedCourses.length === 0 && (
            <p className="text-center text-slate-400 py-8">
              Complete your skill gap analysis to get personalized course recommendations
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
