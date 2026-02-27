import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  ArrowTrendingUpIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { Card, Badge } from '../components/ui';
import { SkillGapChart } from '../components/charts';
import { useSkillGap } from '../context';

const Dashboard = () => {
  const navigate = useNavigate();
  const { skillGapData, extractedSkills, selectedRole, careerRoadmap } = useSkillGap();

  // Safety check - redirect if no data available
  useEffect(() => {
    console.log('🔍 Dashboard - Checking data...');
    console.log('  selectedRole:', selectedRole?.title);
    console.log('  extractedSkills:', extractedSkills?.length);
    console.log('  skillGapData.overallScore:', skillGapData.overallScore);
    
    if (!extractedSkills || extractedSkills.length === 0) {
      console.log('⚠️ No extracted skills, redirecting to upload');
      navigate('/upload', { replace: true });
    }
  }, [extractedSkills, selectedRole, skillGapData, navigate]);

  const stats = [
    {
      title: 'Target Role',
      value: selectedRole?.title || 'Not Selected',
      change: selectedRole?.type || 'AI Recommended',
      icon: AcademicCapIcon,
      trend: 'up',
      color: 'blue',
    },
    {
      title: 'Match Score',
      value: `${skillGapData.overallScore || 0}%`,
      change: 'Current Level',
      icon: ChartBarIcon,
      trend: 'up',
      color: 'purple',
    },
    {
      title: 'Skills to Learn',
      value: skillGapData.missingSkills?.length || 0,
      change: 'Priority items',
      icon: BookOpenIcon,
      trend: 'neutral',
      color: 'green',
    },
    {
      title: 'Roadmap Phases',
      value: careerRoadmap?.length || 0,
      change: 'Learning path',
      icon: ArrowTrendingUpIcon,
      trend: 'up',
      color: 'amber',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Completed', item: 'React Advanced Patterns', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Started', item: 'TypeScript Fundamentals', time: '5 hours ago', type: 'primary' },
    { id: 3, action: 'Assessment', item: 'Node.js Skill Test', time: '1 day ago', type: 'warning' },
    { id: 4, action: 'Updated', item: 'Profile Skills', time: '2 days ago', type: 'neutral' },
  ];

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
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-transparent p-6 rounded-2xl border border-slate-700/30">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-slate-400 text-lg">
          {selectedRole ? `Tracking your journey to becoming a ${selectedRole.title}` : 'Welcome back! Here\'s your skill gap analysis overview.'}
        </p>
      </div>

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
          <div className="h-80 mt-4 -mx-2">
            <SkillGapChart />
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Your latest updates">
          <div className="space-y-3 mt-4">
            {recentActivities.map((activity) => (
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
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Next Steps" subtitle="Recommended actions" hoverable>
          <div className="space-y-3 mt-4">
            {skillGapData.missingSkills && skillGapData.missingSkills.length > 0 ? (
              skillGapData.missingSkills.slice(0, 3).map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium">{skill.name}</p>
                    {skill.priority && (
                      <p className="text-xs text-slate-500 mt-1">Priority: {skill.priority}</p>
                    )}
                    {skill.estimatedTime && (
                      <p className="text-xs text-blue-400 mt-1">Est. time: {skill.estimatedTime}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
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
            )}
          </div>
        </Card>

        <Card title="Learning Streak" subtitle="Keep up the momentum!" hoverable>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center justify-center w-36 h-36 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mb-4 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-6xl font-bold text-white relative z-10">7</div>
            </div>
            <p className="text-slate-300 text-base font-medium mb-1">Days in a row</p>
            <p className="text-green-400 text-sm font-semibold mt-3 flex items-center justify-center space-x-2">
              <span className="text-2xl animate-bounce">🔥</span>
              <span>Best streak: 14 days</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Career Roadmap Section - Only show if tracking an explore role */}
      {careerRoadmap && careerRoadmap.length > 0 && (
        <Card title="Your Career Roadmap" subtitle={`Path to ${selectedRole?.title || 'your goal'}`}>
          <div className="mt-6 space-y-4">
            {careerRoadmap.map((phase, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 group">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">{phase.phase}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">{phase.title}</h4>
                    <Badge variant="warning" size="sm">{phase.duration}</Badge>
                  </div>
                  <ul className="space-y-2 mt-3">
                    {phase.milestones.map((milestone, mIndex) => (
                      <li key={mIndex} className="flex items-center space-x-2 text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        <span>{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
