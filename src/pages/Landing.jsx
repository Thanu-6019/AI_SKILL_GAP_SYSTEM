import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth?mode=signup');
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
          {/* Futuristic Tech Background */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyMjJiM2QiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          </div>
          {/* Animated elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to SkillBridge AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
            <span className="text-cyan-400 font-semibold">SkillBridge AI</span> empowers your career growth with cutting-edge AI technology, offering personalized recommendations and resources tailored to your professional journey.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={handleLearnMore}
              className="px-10 py-4 text-lg font-semibold text-white border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-cyan-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Innovative AI Features</h3>
              <p className="text-gray-400 leading-relaxed">
                Explore advanced AI-driven tools designed to enhance your career progression.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Career Growth Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Get personalized insights and recommendations to meet your career goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Learning Resources</h3>
              <p className="text-gray-400 leading-relaxed">
                Access a curated selection of resources to maximize your skillset.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Left Side - Branding */}
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">SkillBridge AI</h3>
              <p className="text-gray-400 max-w-md">
                Empowering your professional journey with AI-driven insights and resources.
              </p>
            </div>

            {/* Right Side - Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/')} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth?mode=login')} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Resume Upload
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth?mode=login')} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Skill Comparison
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth?mode=login')} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Personalized Plan
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth?mode=login')} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Learning Resources
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; 2026 SkillBridge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
