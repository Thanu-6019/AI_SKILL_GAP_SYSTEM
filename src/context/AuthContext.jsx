import { useState } from 'react';
import { AuthContext } from './AuthContextDefinition';
import { getUserDataField } from '../utils';

// Helper function to get initial state from localStorage
const getInitialAuthState = () => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  return {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialAuthState();
  const [user, setUser] = useState(initialState.user);
  const [token, setToken] = useState(initialState.token);
  const loading = false; // No async loading needed since we read from localStorage synchronously

  // Check if user has existing analysis - FIXED to check backend
  const hasExistingAnalysis = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Fetch user data from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return false;

      const data = await response.json();
      const user = data.data;

      // User has existing analysis if they have jobTitle and roadmap phases
      const hasAnalysis = user.jobTitle && 
                          user.roadmap && 
                          user.roadmap.phases && 
                          user.roadmap.phases.length > 0;

      console.log('🔍 [Auth] hasExistingAnalysis check:', {
        hasJobTitle: !!user.jobTitle,
        hasRoadmap: !!user.roadmap,
        phasesCount: user.roadmap?.phases?.length || 0,
        result: hasAnalysis
      });

      return hasAnalysis;
    } catch (error) {
      console.error('❌ [Auth] Error checking existing analysis:', error);
      // Fallback to localStorage check
      const resumeData = getUserDataField('resumeData', null);
      const selectedRole = getUserDataField('selectedRole', null);
      return resumeData !== null && selectedRole !== null;
    }
  };

  // Login function
  const login = async (email, password) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    
    setToken(data.data.token);
    setUser(data.data);

    return data;
  };

  // Register function
  const register = async (name, email, password) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    
    setToken(data.data.token);
    setUser(data.data);

    return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // USER-SCOPED STORAGE FIX: Don't clear user data on logout
    // User data persists across sessions for that specific user
    // Only clear authentication tokens
    
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasExistingAnalysis,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

