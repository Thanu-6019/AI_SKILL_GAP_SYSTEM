// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Try to parse JSON, but handle cases where response isn't JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails and response is not OK, throw a generic error
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      throw parseError;
    }

    if (!response.ok) {
      console.error(`[API Error] ${response.status}:`, data);
      throw new Error(data.error || data.message || `API request failed with status ${response.status}`);
    }

    console.log(`[API Success] ${options.method || 'GET'} ${url}`);
    return data;
  } catch (error) {
    // Enhanced error logging
    if (error.message.includes('Failed to fetch')) {
      console.error('[API Error] Network error - is backend running?', {
        url,
        baseURL: API_BASE_URL,
        error: error.message
      });
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5001.');
    }
    console.error('[API Error]', error);
    throw error;
  }
}

// Resume API
export const resumeAPI = {
  // Upload resume
  async upload(file) {
    const formData = new FormData();
    formData.append('resume', file);
    const token = getAuthToken();

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/resume/upload`;
    console.log(`[API] POST ${url}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        throw parseError;
      }

      if (!response.ok) {
        console.error(`[API Error] Upload failed:`, data);
        throw new Error(data.error || data.message || 'Failed to upload resume');
      }

      console.log(`[API Success] Resume uploaded successfully`);
      return data;
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        console.error('[API Error] Network error during upload', error);
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 5001.');
      }
      throw error;
    }
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

  // Update user roadmap
  async updateRoadmap(roadmap) {
    return apiCall('/users/me/roadmap', {
      method: 'PUT',
      body: JSON.stringify({ roadmap }),
    });
  },

  // Get notifications
  async getNotifications() {
    return apiCall('/users/me/notifications');
  },

  // Add notification
  async addNotification(type, message) {
    return apiCall('/users/me/notifications', {
      method: 'POST',
      body: JSON.stringify({ type, message }),
    });
  },

  // Mark notification as read
  async markNotificationRead(notificationId) {
    return apiCall(`/users/me/notifications/${notificationId}/read`, {
      method: 'PUT',
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
