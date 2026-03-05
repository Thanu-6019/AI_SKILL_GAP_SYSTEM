import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge } from '../components/ui';
import { useAuth } from '../context';
import { getUserProfile, updateUserProfile, deleteUserData } from '../utils';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // USER-SPECIFIC DATA FIX: Load from authenticated user
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    department: '',
  });
  
  // Load user profile on mount - FIXED to fetch from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          // First, try to fetch from backend using environment variable
          const token = localStorage.getItem('token');
          if (token) {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
            const response = await fetch(`${API_BASE_URL}/users/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              const backendUser = data.data;
              
              console.log('✅ [Settings] Loaded user profile from backend:', backendUser);
              console.log('📋 Job Title:', backendUser.jobTitle);
              console.log('🏢 Department:', backendUser.department);
              
              setProfileData({
                name: backendUser.name || user.name || '',
                email: backendUser.email || user.email || '',
                jobTitle: backendUser.jobTitle || '',
                department: backendUser.department || '',
              });
              return;
            }
          }
        } catch (error) {
          console.error('❌ [Settings] Failed to fetch from backend:', error);
        }
        
        // Fallback to localStorage
        const profile = getUserProfile();
        setProfileData({
          name: profile?.name || user.name || '',
          email: profile?.email || user.email || '',
          jobTitle: profile?.jobTitle || user.jobTitle || '',
          department: profile?.department || user.department || '',
        });
      }
    };
    
    loadUserProfile();
  }, [user]);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const applyTheme = (newTheme) => {
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    
    // Add new theme class
    html.classList.add(newTheme);
    
    // Update body background color
    if (newTheme === 'light') {
      document.body.style.backgroundColor = '#f8fafc'; // slate-50
    } else {
      document.body.style.backgroundColor = '#0f172a'; // slate-900
    }
    
    console.log('✅ [Settings] Theme applied:', newTheme);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // Validate inputs
    if (!profileData.name.trim()) {
      alert('Name cannot be empty');
      return;
    }
    
    // Update user profile
    updateUserProfile({
      name: profileData.name,
      jobTitle: profileData.jobTitle,
      department: profileData.department,
    });
    
    setIsEditing(false);
    
    // Force refresh to update UI
    window.location.reload();
  };
  
  const handleCancel = () => {
    // Reload original data
    const profile = getUserProfile();
    setProfileData({
      name: profile?.name || user.name || '',
      email: profile?.email || user.email || '',
      jobTitle: profile?.jobTitle || user.jobTitle || '',
      department: profile?.department || user.department || '',
    });
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    // Delete ONLY current user's data
    const success = deleteUserData();
    
    if (success) {
      alert('Your account data has been deleted successfully.');
      logout();
      navigate('/auth');
    } else {
      alert('Failed to delete account');
    }
  };
  
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const settingsCategories = [
    {
      title: 'Profile Settings',
      icon: UserCircleIcon,
      description: 'Manage your personal information',
      items: [
        { label: 'Full Name', value: profileData.name, field: 'name', editable: true },
        { label: 'Email', value: profileData.email, field: 'email', editable: false },
        { 
          label: 'Job Title', 
          value: profileData.jobTitle && profileData.jobTitle !== 'null' ? profileData.jobTitle : '', 
          displayValue: profileData.jobTitle && profileData.jobTitle !== 'null' ? profileData.jobTitle : 'Not set',
          field: 'jobTitle', 
          editable: true 
        },
        { 
          label: 'Department', 
          value: profileData.department && profileData.department !== 'null' ? profileData.department : '', 
          displayValue: profileData.department && profileData.department !== 'null' ? profileData.department : 'Not set',
          field: 'department', 
          editable: true 
        },
      ],
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      description: 'Configure notification preferences',
      items: [
        { label: 'Email Notifications', value: 'Enabled', status: 'success' },
        { label: 'Push Notifications', value: 'Enabled', status: 'success' },
        { label: 'Weekly Reports', value: 'Enabled', status: 'success' },
        { label: 'Skill Reminders', value: 'Disabled', status: 'neutral' },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      description: 'Manage your account security',
      items: [
        { label: 'Two-Factor Auth', value: 'Enabled', status: 'success' },
        { label: 'Password', value: 'Last changed 30 days ago' },
        { label: 'Active Sessions', value: '3 devices' },
        { label: 'Data Export', value: 'Request available' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and settings</p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-6">
        {settingsCategories.map((category, index) => (
          <Card 
            key={index}
            title={category.title}
            subtitle={category.description}
            icon={category.icon}
          >
            <div className="space-y-4 mt-4">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <div className="flex-1 mr-4">
                    <p className="text-slate-200 font-medium mb-2">{item.label}</p>
                    {isEditing && item.editable ? (
                      <input
                        type="text"
                        value={item.value || ''}
                        onChange={(e) => handleInputChange(item.field, e.target.value)}
                        placeholder={item.label}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-sm text-slate-500">{item.displayValue || item.value}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {item.status && !isEditing && (
                      <Badge variant={item.status} size="sm">
                        {item.value}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Appearance" icon={PaintBrushIcon}>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
              <div>
                <p className="text-slate-200 font-medium">Theme</p>
                <p className="text-sm text-slate-500 mt-1">
                  {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={theme === 'dark' ? 'primary' : 'warning'} size="sm">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </Badge>
                <button
                  onClick={handleThemeToggle}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Language & Region" icon={GlobeAltIcon}>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
              <div>
                <p className="text-slate-200 font-medium">Language</p>
                <p className="text-sm text-slate-500 mt-1">English (US)</p>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Change
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card title="Danger Zone" className="border-red-500/20">
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div>
              <p className="text-red-400 font-medium">Delete Account</p>
              <p className="text-sm text-slate-500 mt-1">Permanently delete your account data</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-red-500/30">
            <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Confirm Deletion</h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete your account data? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        ) : (
          <Button onClick={handleEdit}>Edit Profile</Button>
        )}
      </div>
    </div>
  );
};

export default Settings;
