import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Smart Skill Analysis',
      description: 'AI-powered analysis of your resume to identify your current skills and proficiency levels'
    },
    {
      icon: ChartBarIcon,
      title: 'Gap Identification',
      description: 'Discover skill gaps between your current abilities and industry requirements'
    },
    {
      icon: SparklesIcon,
      title: 'Personalized Recommendations',
      description: 'Get tailored course recommendations to bridge your skill gaps and advance your career'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-xl">SB</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SkillBridge AI</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bridge Your Skill Gaps
              </span>
              <br />
              <span className="text-white">With AI-Powered Insights</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and let our AI analyze your skills, identify gaps, and recommend personalized learning paths to accelerate your career growth.
            </p>
            <Button 
              onClick={() => navigate('/upload')}
              icon={ArrowRightIcon}
              className="text-lg px-8 py-4 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              Get Started - Upload Resume
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-800 rounded-2xl p-8 shadow-lg hover:scale-105 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-slate-400">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-slate-400">Skills Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">95%</div>
              <div className="text-slate-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-slate-400">AI Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
