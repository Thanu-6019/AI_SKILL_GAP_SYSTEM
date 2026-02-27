import { BellIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
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
            <div className="hidden md:flex items-center bg-slate-900/80 backdrop-blur-sm rounded-2xl px-5 py-3 w-96 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search skills, courses..."
                className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110 group">
              <BellIcon className="w-6 h-6 group-hover:animate-bounce" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse ring-2 ring-slate-800"></span>
            </button>

            {/* User avatar */}
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-700/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">John Doe</p>
                <p className="text-xs text-slate-400">Software Engineer</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 cursor-pointer ring-2 ring-slate-800 hover:ring-blue-500">
                <span className="text-white font-semibold">JD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
