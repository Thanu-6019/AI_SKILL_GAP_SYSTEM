import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillGap, useAuth } from '../context';
import { 
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button, Card } from '../components/ui';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const { setResumeFile } = useSkillGap();
  const { isAuthenticated, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('❌ Not authenticated, redirecting to home');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleContinue = () => {
    if (file) {
      // Store file in context and navigate to processing
      setResumeFile(file);
      navigate('/processing');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">SB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SkillBridge AI</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">1</div>
              <span className="text-white font-medium">Upload Resume</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-semibold">2</div>
              <span className="text-slate-400">Analysis</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-semibold">3</div>
              <span className="text-slate-400">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Upload Your Resume</h1>
            <p className="text-slate-400 text-lg">Upload your resume in PDF format to get started with AI-powered skill analysis</p>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
              }`}
            >
              <DocumentArrowUpIcon className="w-20 h-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-2">Drag and drop your resume here</h3>
              <p className="text-slate-400 mb-6">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 inline-block">
                  Browse Files
                </span>
              </label>
              <p className="text-sm text-slate-500 mt-6">Supported format: PDF (Max size: 10MB)</p>
            </div>
          ) : (
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <CheckCircleIcon className="w-12 h-12 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{file.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{(file.size / 1024).toFixed(2)} KB</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full"></div>
                      </div>
                      <span className="text-sm text-green-400 font-medium">Ready</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-slate-400 hover:text-red-400 transition-colors ml-4"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleContinue}
              disabled={!file}
              className={`${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue to Analysis
            </Button>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="text-blue-400 text-3xl mb-2">🔒</div>
            <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
            <p className="text-slate-400 text-sm">Your resume is encrypted and never shared with third parties</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="text-purple-400 text-3xl mb-2">⚡</div>
            <h3 className="text-white font-semibold mb-2">Fast Analysis</h3>
            <p className="text-slate-400 text-sm">Get comprehensive skill analysis in seconds using advanced AI</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="text-pink-400 text-3xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-2">Accurate Results</h3>
            <p className="text-slate-400 text-sm">95% accuracy in skill identification and gap analysis</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
