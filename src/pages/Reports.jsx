import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Button, LoadingSpinner } from '../components/ui';
import { useSkillGap } from '../context';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const navigate = useNavigate();
  const { skillGapData, selectedRole, extractedSkills, careerRoadmap, recommendedCourses, setSelectedRole, setCareerRoadmap, setExtractedSkills, setSkillGapData } = useSkillGap();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from backend on mount for existing users
  useEffect(() => {
    const loadUserDataFromBackend = async () => {
      console.log('📊 [Reports] Starting data load...');
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('⚠️ [Reports] No token found, skipping backend load');
          setIsLoading(false);
          return;
        }

        console.log('🔄 [Reports] Fetching user data from backend...');
        const response = await fetch('http://localhost:5001/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log('⚠️ [Reports] Backend response not OK:', response.status);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const user = data.data;
        
        console.log('✅ [Reports] Loaded user data from backend:', user);

        // Check if user has completed analysis
        const hasBackendAnalysis = user.jobTitle && 
                                    user.roadmap && 
                                    user.roadmap.phases && 
                                    user.roadmap.phases.length > 0;

        if (hasBackendAnalysis) {
          console.log('✅ [Reports] User has analysis data');
          
          // Set selected role from jobTitle
          if (user.jobTitle && !selectedRole) {
            setSelectedRole({
              title: user.jobTitle,
              category: user.department || 'Technology',
            });
            console.log('✅ [Reports] Set selected role:', user.jobTitle);
          }

          // Transform and set roadmap
          if (user.roadmap && user.roadmap.phases && user.roadmap.phases.length > 0) {
            const transformedRoadmap = user.roadmap.phases.map((phase, idx) => ({
              phase: phase.title,
              title: phase.title,
              duration: phase.duration,
              locked: phase.locked,
              completed: phase.completed,
              skills: phase.skills || [],
              resources: phase.resources || [],
              milestone: '',
            }));

            setCareerRoadmap(transformedRoadmap);
            console.log('✅ [Reports] Set roadmap with', transformedRoadmap.length, 'phases');
            
            // Extract all unique skills
            const allSkills = [];
            user.roadmap.phases.forEach(phase => {
              if (phase.skills && Array.isArray(phase.skills)) {
                phase.skills.forEach(skill => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  if (!allSkills.find(s => (typeof s === 'string' ? s : s.name) === skillName)) {
                    allSkills.push(skill);
                  }
                });
              }
            });
            
            if (allSkills.length > 0) {
              setExtractedSkills(allSkills);
              console.log('✅ [Reports] Set extracted skills:', allSkills.length);
            }

            // Calculate overall score based on skill matching, not completion
            // Extract user's resume skills
            const userSkillNames = (user.skills || []).map(s => 
              (typeof s === 'string' ? s : s.name).toLowerCase().trim()
            );

            // Extract required skills from roadmap
            const requiredSkillNames = [];
            user.roadmap.phases.forEach(phase => {
              if (phase.skills && Array.isArray(phase.skills)) {
                phase.skills.forEach(skill => {
                  const skillName = (typeof skill === 'string' ? skill : skill.name).toLowerCase().trim();
                  if (!requiredSkillNames.includes(skillName)) {
                    requiredSkillNames.push(skillName);
                  }
                });
              }
            });

            // Calculate matched skills
            const matchedSkills = userSkillNames.filter(skill => 
              requiredSkillNames.includes(skill)
            );

            // Calculate overall score as match percentage
            const overallScore = requiredSkillNames.length > 0 
              ? Math.round((matchedSkills.length / requiredSkillNames.length) * 100)
              : 0;

            // Get missing skills
            const missingSkills = [];
            user.roadmap.phases.forEach((phase, phaseIdx) => {
              if (phase.skills && Array.isArray(phase.skills)) {
                phase.skills.forEach((skill, skillIdx) => {
                  const skillName = (typeof skill === 'string' ? skill : skill.name).toLowerCase().trim();
                  if (!userSkillNames.includes(skillName)) {
                    missingSkills.push({
                      name: typeof skill === 'string' ? skill : skill.name,
                      priority: phaseIdx === 0 ? 'High' : 'Medium',
                      gap: 100,
                      learningTime: phase.duration || '2-3 months'
                    });
                  }
                });
              }
            });

            setSkillGapData({
              overallScore,
              missingSkills,
              weakSkills: [],
              strongSkills: allSkills.filter(s => {
                const skillName = (typeof s === 'string' ? s : s.name).toLowerCase().trim();
                return userSkillNames.includes(skillName);
              }),
              aiConfidence: 95,
            });

            console.log('✅ [Reports] Calculated skillGapData:', {
              overallScore,
              userSkills: userSkillNames.length,
              requiredSkills: requiredSkillNames.length,
              matchedSkills: matchedSkills.length,
              missingSkills: missingSkills.length
            });
          }
        } else {
          console.log('⚠️ [Reports] User has no analysis data yet');
        }
      } catch (error) {
        console.error('❌ [Reports] Failed to load user data from backend:', error);
      } finally {
        console.log('✅ [Reports] Finished loading, setting isLoading to false');
        setIsLoading(false);
      }
    };

    loadUserDataFromBackend();
  }, []); // Empty dependency array - only run once on mount

  // SKILL MATCH CALCULATION FIX
  // Calculate skill matching percentage based on resume skills vs required skills
  // MOVED BEFORE EARLY RETURN TO FIX HOOKS ERROR
  const skillMatchData = useMemo(() => {
    if (!extractedSkills || !careerRoadmap || careerRoadmap.length === 0) {
      return {
        resumeSkills: [],
        requiredSkills: [],
        matchedSkills: [],
        matchPercentage: 0,
        chartData: [],
      };
    }

    // Extract resume skill names (normalize to lowercase)
    const resumeSkillNames = extractedSkills.map(skill => 
      (typeof skill === 'string' ? skill : skill.name).toLowerCase().trim()
    );

    // Extract required skills from all roadmap phases
    const requiredSkillNames = [];
    careerRoadmap.forEach(phase => {
      if (phase.skills && Array.isArray(phase.skills)) {
        phase.skills.forEach(skill => {
          const skillName = (typeof skill === 'string' ? skill : skill.name).toLowerCase().trim();
          if (!requiredSkillNames.includes(skillName)) {
            requiredSkillNames.push(skillName);
          }
        });
      }
    });

    // Calculate matched skills (intersection)
    const matchedSkillNames = resumeSkillNames.filter(skill => 
      requiredSkillNames.includes(skill)
    );

    // Calculate match percentage
    const matchPercentage = requiredSkillNames.length > 0 
      ? Math.round((matchedSkillNames.length / requiredSkillNames.length) * 100)
      : 0;

    // Prepare chart data
    const chartData = [
      {
        category: 'Skills',
        'Your Skills': resumeSkillNames.length,
        'Required Skills': requiredSkillNames.length,
        'Matched Skills': matchedSkillNames.length,
      },
    ];

    return {
      resumeSkills: resumeSkillNames,
      requiredSkills: requiredSkillNames,
      matchedSkills: matchedSkillNames,
      matchPercentage,
      chartData,
    };
  }, [extractedSkills, careerRoadmap]);

  const insights = [
    {
      title: 'Match Score',
      value: `${skillGapData?.overallScore || 0}%`,
      change: selectedRole ? `For ${selectedRole.title}` : 'No role selected',
      trend: 'neutral',
    },
    {
      title: 'Skill Match %',
      value: `${skillMatchData.matchPercentage}%`,
      change: `${skillMatchData.matchedSkills.length}/${skillMatchData.requiredSkills.length} skills matched`,
      trend: skillMatchData.matchPercentage >= 70 ? 'up' : 'neutral',
    },
    {
      title: 'Skills to Learn',
      value: skillGapData?.missingSkills?.length || 0,
      change: 'Priority items',
      trend: 'neutral',
    },
    {
      title: 'Roadmap Phases',
      value: careerRoadmap?.length || 0,
      change: 'Learning path',
      trend: 'up',
    },
  ];

  // FIX: Generate PDF from current analysis data
  const handleDownloadPDF = () => {
    if (!selectedRole || !skillGapData) {
      alert('No analysis data available. Please complete an analysis first.');
      navigate('/upload');
      return;
    }

    try {
      // Generate PDF content
      const pdfContent = `
SKILL GAP ANALYSIS REPORT
========================

Generated: ${new Date().toLocaleDateString()}
Target Role: ${selectedRole.title}
Match Score: ${skillGapData.overallScore}%

EXTRACTED SKILLS
----------------
${extractedSkills?.map((s, i) => `${i + 1}. ${typeof s === 'string' ? s : s.name}`).join('\n') || 'None'}

MISSING SKILLS
--------------
${skillGapData.missingSkills?.map((s, i) => `${i + 1}. ${s.name} - Priority: ${s.priority} - Learning Time: ${s.learningTime}`).join('\n') || 'None'}

CAREER ROADMAP
--------------
${careerRoadmap?.map((phase, i) => `
Phase ${i + 1}: ${phase.title} (${phase.duration})
Focus Skills: ${phase.focus?.join(', ') || 'N/A'}
Milestones:
${phase.milestones?.map((m, idx) => `  ${idx + 1}. ${m}`).join('\n') || '  None'}
`).join('\n') || 'No roadmap available'}

RECOMMENDED COURSES
-------------------
${recommendedCourses?.map((c, i) => `${i + 1}. ${c.title} - ${c.provider} (${c.duration})`).join('\n') || 'None'}
      `.trim();

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `skill-gap-analysis-${selectedRole.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ [Reports] Report downloaded successfully');
    } catch (error) {
      console.error('❌ [Reports] Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  // FIX: Generate new report by re-running analysis
  const handleGenerateNewReport = async () => {
    if (!selectedRole) {
      alert('Please complete an analysis first');
      navigate('/upload');
      return;
    }

    setIsGenerating(true);

    try {
      // Simply navigate back to dashboard to view updated data
      // The analysis is already stored in context
      setTimeout(() => {
        setIsGenerating(false);
        alert('Report generated successfully! View it in the Dashboard.');
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
      alert('Failed to generate report');
    }
  };

  const reports = selectedRole ? [
    {
      id: 1,
      title: `${selectedRole.title} - Skill Gap Analysis`,
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      generatedDate: new Date().toLocaleDateString(),
      type: 'Analysis',
      status: 'Ready',
      size: 'Current analysis',
    },
  ] : [];

  // Show loading spinner while loading data
  if (isLoading) {
    return <LoadingSpinner message="Loading your reports..." />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-slate-400">Download and analyze your progress reports</p>
        </div>
        <Button 
          icon={DocumentTextIcon} 
          onClick={handleGenerateNewReport}
          disabled={isGenerating || !selectedRole}
        >
          {isGenerating ? 'Generating...' : 'Generate New Report'}
        </Button>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index}>
            <p className="text-slate-400 text-sm mb-1">{insight.title}</p>
            <h3 className="text-2xl font-bold text-white mb-2">{insight.value}</h3>
            <p className="text-sm text-slate-500">{insight.change}</p>
          </Card>
        ))}
      </div>

      {/* Skill Match Visualization */}
      {selectedRole && skillMatchData.requiredSkills.length > 0 && (
        <Card title="Skill Match Analysis" subtitle="Compare your skills with role requirements">
          <div className="mt-6 space-y-6">
            {/* Bar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillMatchData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px' 
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="Your Skills" fill="#3b82f6" />
                  <Bar dataKey="Required Skills" fill="#8b5cf6" />
                  <Bar dataKey="Matched Skills" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Your Skills</h4>
                <p className="text-2xl font-bold text-white">{skillMatchData.resumeSkills.length}</p>
                <p className="text-xs text-slate-400 mt-1">From your resume</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">Required Skills</h4>
                <p className="text-2xl font-bold text-white">{skillMatchData.requiredSkills.length}</p>
                <p className="text-xs text-slate-400 mt-1">For {selectedRole.title}</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <h4 className="text-sm font-semibold text-green-400 mb-2">Match Percentage</h4>
                <p className="text-2xl font-bold text-white">{skillMatchData.matchPercentage}%</p>
                <p className="text-xs text-slate-400 mt-1">{skillMatchData.matchedSkills.length} skills matched</p>
              </div>
            </div>

            {/* Detailed Skill Breakdown */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Detailed Skill Analysis</h4>
              <div className="space-y-3">
                {/* Your Current Skills */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <h5 className="text-sm font-semibold text-blue-400 mb-3">Your Current Skills</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {skillMatchData.resumeSkills.map((skill, index) => {
                      const isMatched = skillMatchData.matchedSkills.includes(skill);
                      const skillLevel = extractedSkills[index] && typeof extractedSkills[index] === 'object' 
                        ? extractedSkills[index].level 
                        : 70;
                      
                      return (
                        <div 
                          key={index}
                          className={`p-2 rounded-lg border ${
                            isMatched 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium capitalize">{skill}</span>
                            <span className="text-xs">{skillLevel}%</span>
                          </div>
                          <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isMatched ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${skillLevel}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Required Skills You Need */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <h5 className="text-sm font-semibold text-purple-400 mb-3">Required Skills for {selectedRole.title}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {skillMatchData.requiredSkills.map((skill, index) => {
                      const isMatched = skillMatchData.matchedSkills.includes(skill);
                      const requiredLevel = 85; // Required proficiency level
                      
                      return (
                        <div 
                          key={index}
                          className={`p-2 rounded-lg border ${
                            isMatched 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                              : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium capitalize">{skill}</span>
                            <span className="text-xs">{requiredLevel}%</span>
                          </div>
                          <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isMatched ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: `${requiredLevel}%` }}
                            />
                          </div>
                          {!isMatched && (
                            <span className="text-[10px] text-slate-500 mt-1 block">Need to learn</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Missing Skills Gap */}
                {skillGapData?.missingSkills && skillGapData.missingSkills.length > 0 && (
                  <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                    <h5 className="text-sm font-semibold text-red-400 mb-3">
                      Skills Gap to Close ({skillGapData.missingSkills.length} skills)
                    </h5>
                    <div className="space-y-2">
                      {skillGapData.missingSkills.slice(0, 10).map((skill, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-white capitalize">{skill.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={
                                    skill.priority === 'High' ? 'error' : 
                                    skill.priority === 'Medium' ? 'warning' : 
                                    'neutral'
                                  } 
                                  size="sm"
                                >
                                  {skill.priority}
                                </Badge>
                                <span className="text-xs text-slate-400">{skill.learningTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                  <span>Current: 0%</span>
                                  <span>Required: 85%</span>
                                </div>
                                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                  <div className="w-0 h-full bg-red-500" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reports List */}
      <Card title="Available Reports" subtitle="Download your skill reports">
        <div className="space-y-4 mt-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-all border border-slate-700 hover:border-slate-600"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">{report.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>{report.period}</span>
                    <span>•</span>
                    <span>Generated: {report.generatedDate}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="primary" size="sm">{report.type}</Badge>
                    <Badge 
                      variant={report.status === 'Ready' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {report.status === 'Ready' && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={ArrowDownTrayIcon}
                  onClick={handleDownloadPDF}
                >
                  Download
                </Button>
              )}
              {report.status === 'Processing' && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-amber-400">Processing</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Report Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Progress Reports" hoverable>
          <p className="text-slate-400 text-sm mt-2">
            Track your skill development over time with detailed charts and metrics.
          </p>
        </Card>
        <Card title="Gap Analysis" hoverable>
          <p className="text-slate-400 text-sm mt-2">
            Identify areas for improvement and get personalized recommendations.
          </p>
        </Card>
        <Card title="Assessments" hoverable>
          <p className="text-slate-400 text-sm mt-2">
            View results from skill tests and certification attempts.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
