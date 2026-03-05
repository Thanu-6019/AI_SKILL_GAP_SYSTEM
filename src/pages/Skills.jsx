import { useState, useMemo, useEffect } from 'react';
import { AcademicCapIcon, PlusIcon, XMarkIcon, MagnifyingGlassIcon, BriefcaseIcon, DocumentCheckIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Button } from '../components/ui';
import { useSkillGap } from '../context';
import { getUserDataField, setUserData, addCertification, completeCertification, getInternshipSuggestions, incrementSkillsImproved } from '../utils';

const Skills = () => {
  // DEBUGGING: Add console log at very top
  console.log('✅ [Skills] Component function is executing');
  
  // Get context - with error boundary
  const context = useSkillGap();
  
  console.log('📦 [Skills] Context retrieved:', context ? 'Available' : 'NULL');
  
  if (!context) {
    console.error('❌ [Skills Page] SkillGap context is null/undefined');
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center p-8 bg-slate-900 rounded-xl border border-red-500/30">
          <p className="text-red-400 text-lg mb-2">Error: Context not available</p>
          <p className="text-slate-400 text-sm">Please refresh the page or go back to the dashboard</p>
        </div>
      </div>
    );
  }
  
  const { extractedSkills, selectedRole, certifications, setCertifications, internships, skillGapData } = context;
  
  // Debug log
  console.log('🎯 [Skills Page] Component mounted', {
    extractedSkills: extractedSkills?.length || 0,
    certifications: certifications?.length || 0,
    internships: internships?.length || 0,
    selectedRole: selectedRole?.title || 'None',
    skillGapData: skillGapData ? 'Present' : 'Missing'
  });
  
  // TEST: Add very basic visible element for debugging
  console.log('🔍 [Skills] About to render component...');
  
  // Safety checks for context values
  const safeCertifications = Array.isArray(certifications) ? certifications : [];
  const safeSetCertifications = setCertifications || (() => {});
  const safeInternships = Array.isArray(internships) ? internships : [];
  
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'certifications', 'internships'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCompleteCertModal, setShowCompleteCertModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Certification completion form
  const [certCompletionForm, setCertCompletionForm] = useState({
    certificateUrl: '',
    completionDate: ''
  });
  
  // Certification form
  const [certForm, setCertForm] = useState({
    name: '',
    platform: '',
    duration: '',
    certificationType: '',
    relatedSkill: ''
  });
  
  // Get internship suggestions (read-only)
  const [internshipSuggestions, setInternshipSuggestions] = useState([]);
  
  useEffect(() => {
    try {
      const suggestions = getInternshipSuggestions();
      setInternshipSuggestions(suggestions || []);
    } catch (error) {
      console.error('Error loading internship suggestions:', error);
      setInternshipSuggestions([]);
    }
  }, [skillGapData, selectedRole]);
  
  // Get list of missing skills for certification form
  const missingSkillNames = useMemo(() => {
    if (!skillGapData?.missingSkills) return [];
    return skillGapData.missingSkills.map(skill => 
      typeof skill === 'string' ? skill : skill.name
    );
  }, [skillGapData]);
  
  // USER-SCOPED STORAGE FIX: Load skills from user-specific storage
  const [customSkills, setCustomSkills] = useState(() => {
    return getUserDataField('customSkills', []);
  });

  // Combine extracted skills with custom skills
  const allSkills = useMemo(() => {
    // Safety check for extractedSkills
    const validExtractedSkills = Array.isArray(extractedSkills) ? extractedSkills : [];
    
    const extracted = validExtractedSkills.map((skill, idx) => ({
      id: `extracted-${idx}`,
      name: typeof skill === 'string' ? skill : skill.name,
      category: 'Technical',
      current: typeof skill === 'object' ? skill.level : 70,
      required: 85,
      status: 'learning',
      lastUpdated: 'From resume',
    }));

    return [...extracted, ...customSkills];
  }, [extractedSkills, customSkills]);

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return allSkills;
    
    const query = searchQuery.toLowerCase().trim();
    return allSkills.filter(skill => 
      skill.name.toLowerCase().includes(query) ||
      skill.category?.toLowerCase().includes(query)
    );
  }, [allSkills, searchQuery]);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    
    const newSkill = {
      id: `custom-${Date.now()}`,
      name: newSkillName,
      category: 'Custom',
      current: parseInt(newSkillLevel),
      required: 85,
      status: 'learning',
      lastUpdated: 'Just now'
    };

    const updated = [...customSkills, newSkill];
    setCustomSkills(updated);
    
    // USER-SCOPED STORAGE FIX: Save to user-specific storage
    setUserData('customSkills', updated);
    console.log(`✅ [Skills] Added skill "${newSkillName}" to current user's storage`);
    
    // Increment skills improved counter
    incrementSkillsImproved();
    
    setNewSkillName('');
    setNewSkillLevel(50);
    setShowAddModal(false);
  };

  // CAREER GROWTH TRACKER: Add certification handler
  const handleAddCertification = () => {
    if (!certForm.name.trim() || !certForm.platform.trim()) {
      alert('Please fill in certificate name and platform');
      return;
    }
    
    const updated = addCertification({
      name: certForm.name,
      platform: certForm.platform,
      duration: certForm.duration || 'Not specified',
      certificationType: certForm.certificationType || 'Professional Certificate',
      relatedSkill: certForm.relatedSkill || null,
    });
    safeSetCertifications(updated);
    
    setCertForm({ name: '', platform: '', duration: '', certificationType: '', relatedSkill: '' });
    setShowAddModal(false);
    alert('Certification added! Complete it to update your skill progress.');
  };

  // CAREER GROWTH TRACKER: Complete certification handler
  const handleCompleteCertification = () => {
    if (!certCompletionForm.certificateUrl.trim() || !certCompletionForm.completionDate) {
      alert('Please fill in certificate URL and completion date');
      return;
    }
    
    const updated = completeCertification(
      selectedCert.id,
      certCompletionForm.certificateUrl,
      certCompletionForm.completionDate
    );
    safeSetCertifications(updated);
    
    setCertCompletionForm({ certificateUrl: '', completionDate: '' });
    setShowCompleteCertModal(false);
    setSelectedCert(null);
    alert('🎉 Certification completed! Your skill progress has been updated.');
  };
  
  const handleMarkCertComplete = (cert) => {
    setSelectedCert(cert);
    setShowCompleteCertModal(true);
  };

  const handleViewDetails = (skill) => {
    setSelectedSkill(skill);
    setShowDetailsModal(true);
  };

  // CAREER GROWTH TRACKER: No dummy data - use actual user skills only
  const skills = filteredSkills;

  const getStatusVariant = (status) => {
    const variants = {
      learning: 'primary',
      improving: 'warning',
      beginner: 'danger',
      proficient: 'success',
    };
    return variants[status] || 'neutral';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-transparent p-6 rounded-2xl border border-slate-700/30">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Career Growth Tracker</h1>
          <p className="text-slate-400 text-lg">
            Track your skills, certifications, and internship opportunities
          </p>
        </div>
        {activeTab !== 'internships' && (
          <Button 
            icon={PlusIcon} 
            onClick={() => setShowAddModal(true)}
          >
            Add {activeTab === 'skills' ? 'Skill' : 'Certification'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
            activeTab === 'skills'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <AcademicCapIcon className="w-5 h-5" />
            <span>Skills</span>
            <Badge variant={activeTab === 'skills' ? 'secondary' : 'neutral'} size="sm">
              {allSkills.length}
            </Badge>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
            activeTab === 'certifications'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <DocumentCheckIcon className="w-5 h-5" />
            <span>Certifications</span>
            <Badge variant={activeTab === 'certifications' ? 'secondary' : 'neutral'} size="sm">
              {safeCertifications.length}
            </Badge>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('internships')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
            activeTab === 'internships'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <BriefcaseIcon className="w-5 h-5" />
            <span>Internships</span>
            <Badge variant={activeTab === 'internships' ? 'secondary' : 'neutral'} size="sm">
              {safeInternships.length}
            </Badge>
          </div>
        </button>
      </div>

      {/* Skills Tab Content */}
      {activeTab === 'skills' && (
        <>
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <XMarkIcon className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* Skills Count */}
          <div className="text-sm text-slate-400">
            Showing {skills.length} skill{skills.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {/* No Results */}
          {skills.length === 0 && searchQuery && (
            <Card className="text-center py-12">
              <p className="text-slate-400">No skills found matching "{searchQuery}"</p>
              <Button onClick={() => setSearchQuery('')} variant="secondary" className="mt-4">
                Clear Search
              </Button>
            </Card>
          )}

          {/* Empty State - No Skills */}
          {skills.length === 0 && !searchQuery && (
            <Card className="text-center py-12">
              <AcademicCapIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No skills found. Upload your resume to extract skills or add them manually.</p>
              <Button onClick={() => setShowAddModal(true)} icon={PlusIcon}>
                Add Your First Skill
              </Button>
            </Card>
          )}

      {/* Skills Grid */}
      {skills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill.id} hoverable className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="space-y-4 relative z-10">
              {/* Skill Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{skill.name}</h3>
                  <p className="text-sm text-slate-400">{skill.category}</p>
                </div>
                <Badge variant={getStatusVariant(skill.status)} size="sm" className="group-hover:scale-110 transition-transform">
                  {skill.status}
                </Badge>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Current Level</span>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{skill.current}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-600">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/50"
                      style={{ width: `${skill.current}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Required Level</span>
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">{skill.required}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-600">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-500/50"
                      style={{ width: `${skill.required}%` }}
                    />
                  </div>
                </div>

                {/* Gap Indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400 font-medium">Gap</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    skill.required - skill.current <= 10 ? 'text-green-400 bg-green-500/10' : 
                    skill.required - skill.current <= 25 ? 'text-amber-400 bg-amber-500/10' : 
                    'text-red-400 bg-red-500/10'
                  }`}>
                    {skill.required - skill.current}%
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">Updated {skill.lastUpdated}</span>
                <button 
                  onClick={() => handleViewDetails(skill)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors flex items-center space-x-1 group"
                >
                  <span>View Details</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </Card>
          ))}
        </div>
      )}
        </>
      )}

      {/* Certifications Tab Content */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeCertifications.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <DocumentCheckIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No certifications added yet</p>
                <Button onClick={() => setShowAddModal(true)} icon={PlusIcon}>
                  Add Your First Certification
                </Button>
              </Card>
            </div>
          ) : (
            safeCertifications.map((cert) => (
              <Card key={cert.id} hoverable className={cert.completed ? 'border-green-500/30' : ''}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <DocumentCheckIcon className={`w-8 h-8 ${cert.completed ? 'text-green-400' : 'text-purple-400'}`} />
                    {cert.completed ? (
                      <Badge variant="success" size="sm">
                        <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">In Progress</Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{cert.name}</h3>
                  <p className="text-slate-400 text-sm">{cert.platform}</p>
                  <div className="text-xs text-slate-500">
                    <p>Duration: {cert.duration}</p>
                    <p>Type: {cert.certificationType}</p>
                    {cert.relatedSkill && (
                      <p className="text-purple-400 mt-1">For: {cert.relatedSkill}</p>
                    )}
                  </div>
                  {cert.completed ? (
                    <>
                      {cert.completionDate && (
                        <p className="text-slate-500 text-xs">Completed: {new Date(cert.completionDate).toLocaleDateString()}</p>
                      )}
                      {cert.certificateUrl && (
                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline flex items-center">
                          View Certificate <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleMarkCertComplete(cert)} 
                      size="sm" 
                      variant="primary"
                      className="w-full mt-2"
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Internships Tab Content */}
      {activeTab === 'internships' && (
        <div className="space-y-6">
          {internshipSuggestions.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <BriefcaseIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Internship Opportunities Coming Soon!</h3>
                <p className="text-slate-400 mb-2">Complete Phase 1 & Phase 2, or reach 80%+ match score to unlock internship suggestions.</p>
                <div className="mt-6 max-w-md mx-auto text-left">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Requirements:</h4>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Complete all certifications (Phase 1)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Complete projects (Phase 2)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>OR achieve 80%+ match score</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internshipSuggestions.map((intern) => (
                <Card key={intern.id} hoverable className="border-green-500/30">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <BriefcaseIcon className="w-8 h-8 text-green-400" />
                      {intern.recommended && (
                        <Badge variant="success" size="sm">Recommended</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{intern.role}</h3>
                    <p className="text-slate-400">{intern.company}</p>
                    <div className="text-sm text-slate-500 space-y-1">
                      <p>Type: {intern.type}</p>
                      <p>Duration: {intern.duration}</p>
                      <p className="text-xs">{intern.requirements}</p>
                    </div>
                    {intern.applyLink && (
                      <a 
                        href={intern.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-blue-400 text-sm hover:underline mt-2"
                      >
                        View Opportunities <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Modal (Skill/Certification) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Add {activeTab === 'skills' ? 'New Skill' : 'Certification'}
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <XMarkIcon className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>
            
            {/* Skills Form */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., Machine Learning"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Level: {newSkillLevel}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddSkill} className="flex-1">Add Skill</Button>
                  <Button onClick={() => setShowAddModal(false)} variant="secondary" className="flex-1">Cancel</Button>
                </div>
              </div>
            )}

            {/* Certifications Form */}
            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Certificate Name*</label>
                  <input
                    type="text"
                    value={certForm.name}
                    onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Platform*</label>
                  <input
                    type="text"
                    value={certForm.platform}
                    onChange={(e) => setCertForm({...certForm, platform: e.target.value})}
                    placeholder="e.g., Coursera, Udemy, AWS"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={certForm.duration}
                    onChange={(e) => setCertForm({...certForm, duration: e.target.value})}
                    placeholder="e.g., 4 weeks, 2 months"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Certification Type</label>
                  <select
                    value={certForm.certificationType}
                    onChange={(e) => setCertForm({...certForm, certificationType: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select type</option>
                    <option value="Professional Certificate">Professional Certificate</option>
                    <option value="Specialization">Specialization</option>
                    <option value="Course">Course</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Related Skill (Optional)</label>
                  <select
                    value={certForm.relatedSkill}
                    onChange={(e) => setCertForm({...certForm, relatedSkill: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select a skill</option>
                    {missingSkillNames.map((skill, idx) => (
                      <option key={idx} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Link this certification to a missing skill to track progress</p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddCertification} className="flex-1 bg-purple-600 hover:bg-purple-700">Add Certification</Button>
                  <Button onClick={() => setShowAddModal(false)} variant="secondary" className="flex-1">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Certificate Completion Modal */}
      {showCompleteCertModal && selectedCert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCompleteCertModal(false)}>
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Complete Certification</h3>
              <button onClick={() => setShowCompleteCertModal(false)}>
                <XMarkIcon className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-400 mb-2">Certification: <span className="text-white font-semibold">{selectedCert.name}</span></p>
              {selectedCert.relatedSkill && (
                <p className="text-sm text-purple-400">This will update your progress for: {selectedCert.relatedSkill}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Certificate URL*</label>
                <input
                  type="url"
                  value={certCompletionForm.certificateUrl}
                  onChange={(e) => setCertCompletionForm({...certCompletionForm, certificateUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Completion Date*</label>
                <input
                  type="date"
                  value={certCompletionForm.completionDate}
                  onChange={(e) => setCertCompletionForm({...certCompletionForm, completionDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCompleteCertification} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircleIcon className="w-4 h-4 inline mr-2" />
                  Mark Complete
                </Button>
                <Button onClick={() => setShowCompleteCertModal(false)} variant="secondary" className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Details Modal */}
      {showDetailsModal && selectedSkill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedSkill.name}</h3>
              <button onClick={() => setShowDetailsModal(false)}>
                <XMarkIcon className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Skill Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Category</p>
                    <p className="text-white font-semibold">{selectedSkill.category}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Gap to Close</p>
                    <p className="text-white font-semibold">{selectedSkill.required - selectedSkill.current}%</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Recommended Resources</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-blue-400 font-medium">📚 {selectedSkill.name} Complete Course</p>
                    <p className="text-sm text-slate-400">Learn from beginner to advanced</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-blue-400 font-medium">🎯 Practice Projects</p>
                    <p className="text-sm text-slate-400">Hands-on exercises</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
