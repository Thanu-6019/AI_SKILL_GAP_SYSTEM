/**
 * User-Scoped Storage Utility
 * 
 * Provides user-specific localStorage operations to prevent data leakage between accounts.
 * Each user's data is isolated by their email address as the unique identifier.
 */

/**
 * Get current logged-in user's email
 * @returns {string|null} User email or null if not logged in
 */
const getCurrentUserEmail = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user.email || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get all users data structure
 * @returns {Object} Users object with email keys
 */
const getAllUsersData = () => {
  try {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading users data:', error);
    return {};
  }
};

/**
 * Save all users data structure
 * @param {Object} usersData - Complete users data object
 */
const saveAllUsersData = (usersData) => {
  try {
    localStorage.setItem('users', JSON.stringify(usersData));
  } catch (error) {
    console.error('Error saving users data:', error);
  }
};

/**
 * Get current user's data
 * @returns {Object} Current user's data object
 */
export const getUserData = () => {
  const email = getCurrentUserEmail();
  if (!email) return {};
  
  const allUsers = getAllUsersData();
  return allUsers[email] || {};
};

/**
 * Set current user's data field
 * @param {string} key - Data field key (e.g., 'skills', 'settings')
 * @param {*} value - Value to store
 */
export const setUserData = (key, value) => {
  const email = getCurrentUserEmail();
  if (!email) {
    console.warn('Cannot set user data: No user logged in');
    return;
  }
  
  const allUsers = getAllUsersData();
  
  // Initialize user data if doesn't exist
  if (!allUsers[email]) {
    allUsers[email] = {};
  }
  
  // Update specific key
  allUsers[email][key] = value;
  
  // Save back to localStorage
  saveAllUsersData(allUsers);
  
  console.log(`✅ [UserStorage] Saved ${key} for user ${email}`);
};

/**
 * Get specific field from current user's data
 * @param {string} key - Data field key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The stored value or default value
 */
export const getUserDataField = (key, defaultValue = null) => {
  const userData = getUserData();
  return userData[key] !== undefined ? userData[key] : defaultValue;
};

/**
 * Delete current user's data completely
 * @returns {boolean} Success status
 */
export const deleteUserData = () => {
  const email = getCurrentUserEmail();
  if (!email) {
    console.warn('Cannot delete user data: No user logged in');
    return false;
  }
  
  const allUsers = getAllUsersData();
  
  if (allUsers[email]) {
    delete allUsers[email];
    saveAllUsersData(allUsers);
    console.log(`✅ [UserStorage] Deleted data for user ${email}`);
    return true;
  }
  
  return false;
};

/**
 * Clear all data for current user (but keep user structure)
 */
export const clearUserData = () => {
  const email = getCurrentUserEmail();
  if (!email) return;
  
  const allUsers = getAllUsersData();
  allUsers[email] = {};
  saveAllUsersData(allUsers);
  
  console.log(`✅ [UserStorage] Cleared all data for user ${email}`);
};

/**
 * Update user profile (name, jobTitle, department)
 * @param {Object} profile - Profile fields to update
 */
export const updateUserProfile = (profile) => {
  const email = getCurrentUserEmail();
  if (!email) return;
  
  const allUsers = getAllUsersData();
  
  if (!allUsers[email]) {
    allUsers[email] = {};
  }
  
  // Merge profile updates
  allUsers[email].profile = {
    ...(allUsers[email].profile || {}),
    ...profile,
  };
  
  saveAllUsersData(allUsers);
  
  // Also update the global 'user' localStorage for immediate reflection in UI
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: profile.name || user.name,
        jobTitle: profile.jobTitle || user.jobTitle,
        department: profile.department || user.department,
      }));
    }
  } catch (error) {
    console.error('Error updating user profile in auth storage:', error);
  }
  
  console.log(`✅ [UserStorage] Updated profile for user ${email}`);
};

/**
 * Get user profile
 * @returns {Object} User profile data
 */
export const getUserProfile = () => {
  const email = getCurrentUserEmail();
  if (!email) return null;
  
  const userData = getUserData();
  
  // Try to get from user-scoped storage first
  if (userData.profile) {
    return userData.profile;
  }
  
  // Fallback: get from auth storage
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle || '',
        department: user.department || '',
      };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
  }
  
  return null;
};

/**
 * Track previous match score for improvement comparison
 * @param {number} newScore - New match score
 * @returns {Object} { previousScore, improvement }
 */
export const trackMatchScoreImprovement = (newScore) => {
  const currentScore = getUserDataField('currentMatchScore', null);
  const previousScore = currentScore !== null ? currentScore : null;
  
  // Update current score
  setUserData('currentMatchScore', newScore);
  
  // Calculate improvement
  const improvement = previousScore !== null ? newScore - previousScore : 0;
  
  // Store improvement history
  const history = getUserDataField('matchScoreHistory', []);
  history.push({
    score: newScore,
    date: new Date().toISOString(),
    improvement,
  });
  setUserData('matchScoreHistory', history);
  
  console.log(`📊 [UserStorage] Match score updated: ${previousScore} → ${newScore} (${improvement >= 0 ? '+' : ''}${improvement}%)`);
  
  return { previousScore, improvement };
};

/**
 * Get career progress metrics
 * @returns {Object} Career metrics including improvements, certifications, internships, readiness
 */
export const getCareerMetrics = () => {
  const certs = getUserDataField('certifications', []);
  const phases = getPhaseCompletionStatus();
  const skillGapData = getUserDataField('skillGapData', {});
  
  // Calculate certifications progress
  const totalCerts = certs.length;
  const completedCertsCount = certs.filter(c => c.completed).length;
  const certsProgress = totalCerts > 0 ? Math.round((completedCertsCount / totalCerts) * 100) : 0;
  
  // Internship readiness
  let readinessStatus = 'Not Ready';
  if (phases.phase3.unlocked) {
    readinessStatus = 'Ready';
  } else if (skillGapData.overallScore > 80) {
    readinessStatus = 'Nearly Ready';
  } else if (phases.phase1.completed || certsProgress > 50) {
    readinessStatus = 'In Progress';
  }
  
  return {
    currentMatchScore: skillGapData.overallScore || 0,
    previousMatchScore: getUserDataField('matchScoreHistory', [])[getUserDataField('matchScoreHistory', []).length - 2]?.score || null,
    skillsImproved: getUserDataField('skillsImprovedCount', 0),
    certificationsCompleted: completedCertsCount,
    certificationsTotal: totalCerts,
    certificationsProgress: certsProgress,
    internshipReadiness: readinessStatus,
    internshipReadinessUnlocked: phases.phase3.unlocked,
    phases: phases
  };
};

/**
 * Add certification with skill linking
 * @param {Object} certification - { name, platform, completionDate, certificateUrl, relatedSkill, duration, certificationType }
 */
export const addCertification = (certification) => {
  const certs = getUserDataField('certifications', []);
  certs.push({
    ...certification,
    id: Date.now(),
    addedDate: new Date().toISOString(),
    completed: false,
  });
  setUserData('certifications', certs);
  
  console.log(`🎓 [UserStorage] Certification added: ${certification.name}`);
  return certs;
};

/**
 * Complete a certification and update related skill
 * @param {number} certificationId - ID of certification to complete
 * @param {string} certificateUrl - Certificate URL
 * @param {string} completionDate - Completion date
 */
export const completeCertification = (certificationId, certificateUrl, completionDate) => {
  const certs = getUserDataField('certifications', []);
  const certIndex = certs.findIndex(c => c.id === certificationId);
  
  if (certIndex === -1) {
    console.warn(`Certification ${certificationId} not found`);
    return certs;
  }
  
  const cert = certs[certIndex];
  cert.completed = true;
  cert.certificateUrl = certificateUrl;
  cert.completionDate = completionDate;
  
  setUserData('certifications', certs);
  
  // Update related skill status if exists
  if (cert.relatedSkill) {
    updateMissingSkillStatus(cert.relatedSkill);
  }
  
  console.log(`✅ [UserStorage] Certification completed: ${cert.name}, skill improved: ${cert.relatedSkill}`);
  return certs;
};

/**
 * Update missing skill status when certification completed
 * @param {string} skillName - Name of skill to update
 */
export const updateMissingSkillStatus = (skillName) => {
  const skillGapData = getUserDataField('skillGapData', {});
  
  if (!skillGapData.missingSkills) return;
  
  const skillIndex = skillGapData.missingSkills.findIndex(
    skill => (typeof skill === 'string' ? skill : skill.name) === skillName
  );
  
  if (skillIndex !== -1) {
    const skill = skillGapData.missingSkills[skillIndex];
    const skillObj = typeof skill === 'string' ? { name: skill } : skill;
    
    // Change status to improving
    skillObj.status = 'improving';
    skillGapData.missingSkills[skillIndex] = skillObj;
    
    // Check if all certifications for this skill are completed
    const certs = getUserDataField('certifications', []);
    const relatedCerts = certs.filter(c => c.relatedSkill === skillName);
    const allCompleted = relatedCerts.length > 0 && relatedCerts.every(c => c.completed);
    
    if (allCompleted) {
      // Mark as completed and remove from missing skills
      skillGapData.missingSkills.splice(skillIndex, 1);
      
      // Add to strong skills
      if (!skillGapData.strongSkills) skillGapData.strongSkills = [];
      skillGapData.strongSkills.push(skillName);
      
      // Increment skills improved counter
      incrementSkillsImproved();
    }
    
    // Recalculate match score
    const totalSkills = (skillGapData.missingSkills?.length || 0) + 
                       (skillGapData.weakSkills?.length || 0) + 
                       (skillGapData.strongSkills?.length || 0);
    const strongSkillsCount = skillGapData.strongSkills?.length || 0;
    const newScore = totalSkills > 0 ? Math.round((strongSkillsCount / totalSkills) * 100) : 0;
    
    skillGapData.overallScore = Math.max(skillGapData.overallScore || 0, newScore);
    
    setUserData('skillGapData', skillGapData);
    console.log(`📈 [UserStorage] Skill "${skillName}" updated. Match score: ${skillGapData.overallScore}%`);
  }
};

/**
 * Get suggested internships based on readiness
 * @returns {Array} Array of suggested internships
 */
export const getInternshipSuggestions = () => {
  const skillGapData = getUserDataField('skillGapData', {});
  const selectedRole = getUserDataField('selectedRole', null);
  const phases = getPhaseCompletionStatus();
  
  // Only suggest internships if Phase 1 & 2 complete OR match score > 80%
  const isReady = (phases.phase1.completed && phases.phase2.completed) || 
                  (skillGapData.overallScore > 80);
  
  if (!isReady || !selectedRole) {
    return [];
  }
  
  // Generate role-based internship suggestions
  const roleName = selectedRole.title || '';
  const suggestions = [
    {
      id: 1,
      company: 'Tech Companies',
      role: `${roleName} Intern`,
      type: 'Remote',
      duration: '3-6 months',
      requirements: 'Based on your current skill level',
      applyLink: 'https://www.linkedin.com/jobs/',
      recommended: true
    },
    {
      id: 2,
      company: 'Startups',
      role: `Junior ${roleName}`,
      type: 'Hybrid',
      duration: '3 months',
      requirements: 'Hands-on project experience',
      applyLink: 'https://angel.co/jobs',
      recommended: true
    },
  ];
  
  return suggestions;
};

/**
 * Get phase completion status
 * @returns {Object} Phase status for Phase 1, 2, 3
 */
export const getPhaseCompletionStatus = () => {
  const certs = getUserDataField('certifications', []);
  const projects = getUserDataField('projects', []);
  
  // Phase 1: All suggested certifications completed
  const totalCerts = certs.length;
  const completedCerts = certs.filter(c => c.completed).length;
  const phase1Completed = totalCerts > 0 && completedCerts === totalCerts;
  
  // Phase 2: Projects marked complete
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.completed).length;
  const phase2Completed = totalProjects > 0 && completedProjects === totalProjects;
  
  // Phase 3: Unlocked only after Phase 1 & 2 complete
  const phase3Unlocked = phase1Completed && phase2Completed;
  
  return {
    phase1: {
      completed: phase1Completed,
      progress: totalCerts > 0 ? Math.round((completedCerts / totalCerts) * 100) : 0,
      total: totalCerts,
      completedCount: completedCerts
    },
    phase2: {
      completed: phase2Completed,
      progress: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
      total: totalProjects,
      completedCount: completedProjects
    },
    phase3: {
      unlocked: phase3Unlocked,
      readyForInternships: phase3Unlocked
    }
  };
};

/**
 * Toggle project completion
 * @param {number} projectId - Project ID to toggle
 */
export const toggleProjectCompletion = (projectId) => {
  const projects = getUserDataField('projects', []);
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    projects[projectIndex].completed = !projects[projectIndex].completed;
    setUserData('projects', projects);
    console.log(`✅ [UserStorage] Project ${projectId} completion toggled`);
  }
  
  return projects;
};

/**
 * Add project
 * @param {Object} project - Project details
 */
export const addProject = (project) => {
  const projects = getUserDataField('projects', []);
  projects.push({
    ...project,
    id: Date.now(),
    completed: false,
    addedDate: new Date().toISOString()
  });
  setUserData('projects', projects);
  console.log(`📁 [UserStorage] Project added: ${project.name}`);
  return projects;
};

/**
 * Add internship experience
 * @param {Object} internship - { company, role, duration, certificateLink }
 * @deprecated Use getInternshipSuggestions instead - internships are now read-only suggestions
 */
export const addInternship = (internship) => {
  const internships = getUserDataField('internships', []);
  internships.push({
    ...internship,
    id: Date.now(),
    addedDate: new Date().toISOString(),
  });
  setUserData('internships', internships);
  
  console.log(`💼 [UserStorage] Internship added: ${internship.role} at ${internship.company}`);
  return internships;
};

/**
 * Increment skills improved counter
 */
export const incrementSkillsImproved = () => {
  const count = getUserDataField('skillsImprovedCount', 0);
  setUserData('skillsImprovedCount', count + 1);
  console.log(`✅ [UserStorage] Skills improved count: ${count + 1}`);
};

/**
 * Track course click and associate with skill
 * @param {Object} course - Course details
 * @param {string} skillName - Related skill name
 */
export const trackCourseClick = (course, skillName) => {
  const trackedCourses = getUserDataField('trackedCourses', []);
  
  const courseData = {
    ...course,
    skillName,
    clickedAt: new Date().toISOString(),
    status: 'in-progress'
  };
  
  // Check if course already tracked
  const existingIndex = trackedCourses.findIndex(c => c.id === course.id || c.title === course.title);
  
  if (existingIndex !== -1) {
    // Update existing
    trackedCourses[existingIndex] = {
      ...trackedCourses[existingIndex],
      clickedAt: new Date().toISOString()
    };
  } else {
    // Add new
    trackedCourses.push(courseData);
  }
  
  setUserData('trackedCourses', trackedCourses);
  
  // Update skill status if missing
  if (skillName) {
    const skillGapData = getUserDataField('skillGapData', {});
    if (skillGapData.missingSkills) {
      const skillIndex = skillGapData.missingSkills.findIndex(
        skill => (typeof skill === 'string' ? skill : skill.name) === skillName
      );
      
      if (skillIndex !== -1) {
        const skill = skillGapData.missingSkills[skillIndex];
        const skillObj = typeof skill === 'string' ? { name: skill } : skill;
        skillObj.status = 'learning';
        skillGapData.missingSkills[skillIndex] = skillObj;
        setUserData('skillGapData', skillGapData);
        console.log(`📚 [UserStorage] Started learning: ${skillName} via course: ${course.title}`);
      }
    }
  }
  
  return trackedCourses;
};

/**
 * Mark course as completed
 * @param {string} courseId - Course ID or title
 */
export const completeCourse = (courseId) => {
  const trackedCourses = getUserDataField('trackedCourses', []);
  const courseIndex = trackedCourses.findIndex(c => c.id === courseId || c.title === courseId);
  
  if (courseIndex !== -1) {
    trackedCourses[courseIndex].status = 'completed';
    trackedCourses[courseIndex].completedAt = new Date().toISOString();
    setUserData('trackedCourses', trackedCourses);
    
    // Update skill proficiency
    const skillName = trackedCourses[courseIndex].skillName;
    if (skillName) {
      incrementSkillsImproved();
      console.log(`✅ [UserStorage] Completed course: ${trackedCourses[courseIndex].title} for skill: ${skillName}`);
    }
  }
  
  return trackedCourses;
};

/**
 * Get phase completion data
 * @returns {Object} Phase completion status by phase index
 */
export const getPhaseCompletionData = () => {
  return getUserDataField('phaseCompletions', {});
};

/**
 * Upload certificate for a phase
 * @param {number} phaseIndex - Index of the phase (0-based)
 * @param {string} phaseName - Name of the phase
 * @param {string} certificateUrl - URL or file path of certificate
 * @param {string} skillName - Skill name the certificate is for (optional)
 * @returns {Object} Updated phase completions
 */
export const uploadPhaseCertificate = (phaseIndex, phaseName, certificateUrl, skillName = null) => {
  const phaseCompletions = getPhaseCompletionData();
  
  phaseCompletions[phaseIndex] = {
    phaseIndex,
    phaseName,
    completed: true,
    certificateUrl,
    skillName,
    completedAt: new Date().toISOString(),
  };
  
  setUserData('phaseCompletions', phaseCompletions);
  console.log(`✅ [UserStorage] Phase ${phaseIndex} completed with certificate`);
  
  return phaseCompletions;
};

/**
 * Check if a phase is completed
 * @param {number} phaseIndex - Index of the phase
 * @returns {boolean} True if phase is completed
 */
export const isPhaseCompleted = (phaseIndex) => {
  const phaseCompletions = getPhaseCompletionData();
  return phaseCompletions[phaseIndex]?.completed || false;
};

/**
 * Check if a phase is unlocked
 * @param {number} phaseIndex - Index of the phase
 * @returns {boolean} True if phase is unlocked
 */
export const isPhaseUnlocked = (phaseIndex) => {
  if (phaseIndex === 0) return true; // Phase 0 is always unlocked
  
  // Phase is unlocked if previous phase is completed
  return isPhaseCompleted(phaseIndex - 1);
};

/**
 * Calculate overall roadmap progress
 * @param {number} totalPhases - Total number of phases
 * @returns {Object} Progress data
 */
export const getRoadmapProgress = (totalPhases) => {
  const phaseCompletions = getPhaseCompletionData();
  const completedCount = Object.values(phaseCompletions).filter(p => p.completed).length;
  
  return {
    completedPhases: completedCount,
    totalPhases,
    percentage: totalPhases > 0 ? Math.round((completedCount / totalPhases) * 100) : 0,
  };
};

export default {
  getUserData,
  setUserData,
  getUserDataField,
  deleteUserData,
  clearUserData,
  updateUserProfile,
  getUserProfile,
  trackMatchScoreImprovement,
  getCareerMetrics,
  addCertification,
  completeCertification,
  updateMissingSkillStatus,
  addInternship,
  getInternshipSuggestions,
  getPhaseCompletionStatus,
  addProject,
  toggleProjectCompletion,
  incrementSkillsImproved,
  trackCourseClick,
  completeCourse,
  getPhaseCompletionData,
  uploadPhaseCertificate,
  isPhaseCompleted,
  isPhaseUnlocked,
  getRoadmapProgress,
};
