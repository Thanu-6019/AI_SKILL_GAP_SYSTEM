import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CpuChipIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useSkillGap } from '../context';

const AIProcessing = () => {
  const navigate = useNavigate();
  const { processingStatus, resumeFile, processResume } = useSkillGap();
  const hasProcessed = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Redirect if no resume file
    if (!resumeFile) {
      console.log('❌ No resume file, redirecting to upload');
      navigate('/upload');
      return;
    }

    // Only process once
    if (hasProcessed.current) {
      console.log('⚠️ Processing already initiated');
      return;
    }

    hasProcessed.current = true;
    console.log('🚀 Starting AI processing...');

    // Start processing
    const startProcessing = async () => {
      try {
        await processResume(resumeFile);
        console.log('✅ Processing completed, navigating to role selection...');
        // Navigate to role selection after processing
        timeoutRef.current = setTimeout(() => {
          navigate('/role-selection');
        }, 1000);
      } catch (error) {
        console.error('❌ Processing error:', error);
        hasProcessed.current = false;
      }
    };

    startProcessing();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeFile, navigate]); // processResume intentionally excluded to prevent infinite loop

  const steps = [
    {
      icon: CpuChipIcon,
      title: 'Extracting skills using NLP',
      description: 'AI analyzing your resume with advanced natural language processing',
      color: 'blue',
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Matching resume with job roles',
      description: 'Comparing your skills with 10,000+ job descriptions in our database',
      color: 'purple',
    },
    {
      icon: ChartBarIcon,
      title: 'Calculating skill gap',
      description: 'Identifying gaps and calculating match scores for each role',
      color: 'pink',
    },
    {
      icon: SparklesIcon,
      title: 'Generating personalized recommendations',
      description: 'Creating your customized learning path with AI recommendations',
      color: 'green',
    },
  ];

  const getStepStatus = (index) => {
    if (processingStatus.currentStep > index) return 'completed';
    if (processingStatus.currentStep === index) return 'processing';
    return 'pending';
  };

  const getColorClasses = (color, status) => {
    const colors = {
      blue: {
        pending: 'text-slate-600 bg-slate-800',
        processing: 'text-blue-400 bg-blue-500/10 border-blue-500/50 animate-pulse',
        completed: 'text-blue-400 bg-blue-500/20',
      },
      purple: {
        pending: 'text-slate-600 bg-slate-800',
        processing: 'text-purple-400 bg-purple-500/10 border-purple-500/50 animate-pulse',
        completed: 'text-purple-400 bg-purple-500/20',
      },
      pink: {
        pending: 'text-slate-600 bg-slate-800',
        processing: 'text-pink-400 bg-pink-500/10 border-pink-500/50 animate-pulse',
        completed: 'text-pink-400 bg-pink-500/20',
      },
      green: {
        pending: 'text-slate-600 bg-slate-800',
        processing: 'text-green-400 bg-green-500/10 border-green-500/50 animate-pulse',
        completed: 'text-green-400 bg-green-500/20',
      },
    };
    return colors[color]?.[status] || colors.blue.pending;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SkillBridge AI</span>
          </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
            <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl shadow-blue-500/50 animate-pulse">
              <CpuChipIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">AI Processing Your Resume</h1>
            <p className="text-xl text-slate-400">
              Our advanced AI is analyzing your skills and matching them with career opportunities
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-6 mb-12">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const StepIcon = step.icon;
              
              return (
                <div
                  key={index}
                  className={`relative bg-slate-800 rounded-2xl p-6 border-2 transition-all duration-500 ${
                    status === 'processing' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]' 
                      : status === 'completed'
                      ? 'border-green-500/50'
                      : 'border-slate-700'
                  }`}
                >
                    <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${getColorClasses(step.color, status)}`}>
                      {status === 'completed' ? (
                        <CheckCircleIcon className="w-8 h-8" />
                      ) : (
                        <StepIcon className="w-8 h-8" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                        status === 'completed' ? 'text-green-400' : status === 'processing' ? 'text-white' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-slate-400">{step.description}</p>

                      {/* Progress Bar */}
                      {status === 'processing' && (
                        <div className="mt-4">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {status === 'completed' && (
                        <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                          Completed
                        </div>
                      )}
                      {status === 'processing' && (
                        <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                          <span>Processing</span>
                        </div>
                      )}
                      {status === 'pending' && (
                        <div className="px-4 py-2 bg-slate-700 text-slate-400 rounded-full text-sm font-medium">
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-slate-400">Job Descriptions Analyzed</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-slate-400">Skills in Database</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <div className="text-3xl font-bold text-pink-400 mb-2">95%</div>
              <div className="text-slate-400">AI Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIProcessing;
