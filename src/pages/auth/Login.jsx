import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context';
import { Button } from '../../components/ui';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, hasExistingAnalysis } = useAuth();

  // Check if mode is set in URL (login or signup)
  const urlMode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(urlMode !== 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Update mode when URL changes
  useEffect(() => {
    if (urlMode === 'signup') {
      setIsLogin(false);
    } else if (urlMode === 'login') {
      setIsLogin(true);
    }
  }, [urlMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        
        // For existing user login, check backend for analysis
        const hasAnalysis = await hasExistingAnalysis();
        if (hasAnalysis) {
          console.log('✅ [Login] Existing user with analysis, redirecting to Dashboard');
          navigate('/dashboard');
        } else {
          console.log('✅ [Login] User has no analysis, redirecting to Upload');
          navigate('/upload');
        }
      } else {
        await register(formData.name, formData.email, formData.password);
        // For new signup, always start fresh with upload
        console.log('✅ [Signup] New user, starting onboarding flow at Upload');
        navigate('/upload');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4A90E2] to-[#357ABD] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">SB</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#5A6978]">
            {isLogin
              ? 'Sign in to continue your career journey'
              : 'Start your career development journey'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#2C3E50] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all text-[#2C3E50] bg-white placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2C3E50] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all text-[#2C3E50] bg-white placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2C3E50] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all text-[#2C3E50] bg-white placeholder-gray-400"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-[#4A90E2] hover:text-[#357ABD] font-medium text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Quick Start Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#5A6978]">
            {isLogin ? 'Login to view your progress' : 'After signup, upload your resume to get started'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
