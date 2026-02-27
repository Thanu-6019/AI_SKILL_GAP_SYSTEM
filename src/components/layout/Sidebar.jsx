import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Skills', path: '/dashboard/skills', icon: AcademicCapIcon },
    { name: 'Reports', path: '/dashboard/reports', icon: ChartBarIcon },
    { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SkillBridge AI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white hover:scale-105 hover:pl-5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-gradient-to-t from-slate-900/50 to-transparent">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30">
            <p className="text-sm text-slate-400 mb-3">💡 Need help?</p>
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30">
              Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
