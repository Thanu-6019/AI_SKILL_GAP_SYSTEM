import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <span className="text-white text-2xl font-bold">SB</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400">
            {isLogin
              ? 'Sign in to continue your career journey'
              : 'Start your career development journey'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white bg-slate-700 placeholder-slate-400"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white bg-slate-700 placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white bg-slate-700 placeholder-slate-400"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password - Only for Login */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert('Password reset feature coming soon!')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Social Sign In - Only for Signup */}
          {!isLogin && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert('Google sign-in coming soon!')}
                  className="flex items-center justify-center px-4 py-3 border-2 border-slate-600 rounded-lg hover:border-slate-500 hover:bg-slate-700 transition-all text-white"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                  </svg>
                  <span className="text-sm font-medium">Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Apple sign-in coming soon!')}
                  className="flex items-center justify-center px-4 py-3 border-2 border-slate-600 rounded-lg hover:border-slate-500 hover:bg-slate-700 transition-all text-white"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-sm font-medium">Apple</span>
                </button>
              </div>
            </>
          )}

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setShowPassword(false);
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Quick Start Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            {isLogin ? 'Login to view your progress' : 'After signup, upload your resume to get started'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
