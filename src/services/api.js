// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Resume API
export const resumeAPI = {
  // Upload resume
  async upload(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload resume');
    }

    return data;
  },

  // Get resume by ID
  async getById(id) {
    return apiCall(`/resume/${id}`);
  },

  // Get all resumes
  async getAll() {
    return apiCall('/resume');
  },

  // Delete resume
  async delete(id) {
    return apiCall(`/resume/${id}`, { method: 'DELETE' });
  },
};

// Skills API
export const skillsAPI = {
  // Match roles for extracted skills
  async matchRoles(resumeId, topN = 5) {
    return apiCall('/skills/match-roles', {
      method: 'POST',
      body: JSON.stringify({ resumeId, topN }),
    });
  },

  // Analyze skill gap
  async analyzeGap(resumeId, targetRole) {
    return apiCall('/skills/analyze-gap', {
      method: 'POST',
      body: JSON.stringify({ resumeId, targetRole }),
    });
  },

  // Get analysis by ID
  async getAnalysis(id) {
    return apiCall(`/skills/analysis/${id}`);
  },

  // Get all analyses for a resume
  async getAnalysesByResume(resumeId) {
    return apiCall(`/skills/analysis/resume/${resumeId}`);
  },
};

// Roles API
export const rolesAPI = {
  // Get all roles
  async getAll() {
    return apiCall('/roles');
  },

  // Get role by ID
  async getById(id) {
    return apiCall(`/roles/${id}`);
  },

  // Search roles
  async search(query) {
    return apiCall(`/roles/search?q=${encodeURIComponent(query)}`);
  },

  // Create role (admin)
  async create(roleData) {
    return apiCall('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  },

  // Update role (admin)
  async update(id, roleData) {
    return apiCall(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  },

  // Delete role (admin)
  async delete(id) {
    return apiCall(`/roles/${id}`, { method: 'DELETE' });
  },
};

// Courses API
export const coursesAPI = {
  // Get course recommendations
  async getRecommendations(skills = [], level = 'all') {
    const skillsParam = skills.length ? `skills=${skills.join(',')}` : '';
    const levelParam = level !== 'all' ? `level=${level}` : '';
    const params = [skillsParam, levelParam].filter(Boolean).join('&');
    
    return apiCall(`/courses/recommendations${params ? `?${params}` : ''}`);
  },

  // Get course by ID
  async getById(id) {
    return apiCall(`/courses/${id}`);
  },

  // Search courses
  async search(query) {
    return apiCall(`/courses/search?q=${encodeURIComponent(query)}`);
  },
};

// User API
export const userAPI = {
  // Register new user
  async register(userData) {
    return apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  async login(credentials) {
    return apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user
  async getMe(token) {
    return apiCall('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  async updateProfile(userData, token) {
    return apiCall('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Health check
export const healthAPI = {
  async check() {
    return apiCall('/health');
  },
};

export default {
  resume: resumeAPI,
  skills: skillsAPI,
  roles: rolesAPI,
  courses: coursesAPI,
  user: userAPI,
  health: healthAPI,
};
