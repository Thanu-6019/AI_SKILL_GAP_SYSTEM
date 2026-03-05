import { BellIcon, MagnifyingGlassIcon, Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useSkillGap } from '../../context';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { extractedSkills, recommendedCourses } = useSkillGap();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search logic
  const searchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // Search in skills
    extractedSkills?.forEach(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      if (skillName?.toLowerCase().includes(query)) {
        results.push({ type: 'skill', name: skillName, path: '/dashboard/skills' });
      }
    });

    // Search in courses
    recommendedCourses?.forEach(course => {
      if (course.title?.toLowerCase().includes(query)) {
        results.push({ type: 'course', name: course.title, path: '/dashboard' });
      }
    });

    return results.slice(0, 5); // Limit to 5 results
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            {/* Search bar */}
            <div className="hidden md:block relative">
              <div className="flex items-center bg-slate-900/80 backdrop-blur-sm rounded-2xl px-5 py-3 w-96 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search skills, courses..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full mt-2 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                  {searchResults().length > 0 ? (
                    <div className="p-2">
                      {searchResults().map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result.path)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-blue-400 text-sm font-medium">
                              {result.type === 'skill' ? '🎯' : '📚'}
                            </span>
                            <div>
                              <p className="text-white font-medium">{result.name}</p>
                              <p className="text-xs text-slate-400 capitalize">{result.type}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110 group">
              <BellIcon className="w-6 h-6 group-hover:animate-bounce" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse ring-2 ring-slate-800"></span>
            </button>

            {/* User avatar with dropdown */}
            <div className="relative">
              <div 
                className="flex items-center space-x-3 pl-4 border-l border-slate-700/50 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 ring-2 ring-slate-800 hover:ring-blue-500">
                  <span className="text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white flex items-center space-x-2 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
