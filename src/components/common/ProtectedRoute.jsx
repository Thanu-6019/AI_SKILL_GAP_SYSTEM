import { Navigate, useLocation } from 'react-router-dom';
import { useSkillGap, useAuth } from '../../context';
import { LoadingSpinner } from '../ui';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ 
  children, 
  requireResume = false, 
  requireRoles = false, 
  requireRole = false
}) => {
  const { resumeFile, matchedRoles, selectedRole } = useSkillGap();
  const { isAuthenticated, loading, hasExistingAnalysis } = useAuth();
  const location = useLocation();
  const [checkingAnalysis, setCheckingAnalysis] = useState(false);
  const [shouldRedirectToUpload, setShouldRedirectToUpload] = useState(false);

  // For dashboard access ONLY, check if user has existing analysis
  useEffect(() => {
    const checkDashboardAccess = async () => {
      // Only check if we're accessing dashboard route specifically
      const isDashboardRoute = location.pathname.startsWith('/dashboard');
      
      if (isDashboardRoute && !requireResume && !requireRoles && !requireRole && isAuthenticated()) {
        setCheckingAnalysis(true);
        const hasAnalysis = await hasExistingAnalysis();
        console.log('🔍 [ProtectedRoute] Dashboard access check - Has analysis:', hasAnalysis);
        
        // If no existing analysis, redirect new users to upload
        if (!hasAnalysis) {
          console.log('⚠️ [ProtectedRoute] New user detected, will redirect to /upload');
          setShouldRedirectToUpload(true);
        }
        setCheckingAnalysis(false);
      }
    };
    
    checkDashboardAccess();
  }, [location.pathname, isAuthenticated, requireResume, requireRoles, requireRole, hasExistingAnalysis]);

  console.log('🔒 [ProtectedRoute] Checking access:', {
    path: location.pathname,
    loading,
    isAuthenticated: isAuthenticated(),
    requireResume,
    requireRoles,
    requireRole,
    hasResumeFile: !!resumeFile,
    hasMatchedRoles: matchedRoles?.length > 0,
    hasSelectedRole: !!selectedRole,
    checkingAnalysis,
    shouldRedirectToUpload,
  });

  // Show loading spinner while checking authentication or analysis
  if (loading || checkingAnalysis) {
    return <LoadingSpinner message={checkingAnalysis ? "Checking your profile..." : "Checking authentication..."} />;
  }

  // Check authentication first
  if (!isAuthenticated()) {
    console.log('❌ [ProtectedRoute] User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Redirect new users to upload page if accessing dashboard without analysis
  if (shouldRedirectToUpload) {
    console.log('🔄 [ProtectedRoute] Redirecting new user to /upload');
    return <Navigate to="/upload" replace />;
  }

  console.log('✅ [ProtectedRoute] Authentication passed');

  // Check if resume is required and available
  if (requireResume && !resumeFile) {
    console.log('❌ [ProtectedRoute] Resume required but not found, redirecting to /upload');
    return <Navigate to="/upload" replace />;
  }

  // Check if matched roles are required and available
  if (requireRoles && (!matchedRoles || matchedRoles.length === 0)) {
    console.log('❌ [ProtectedRoute] Matched roles required but not found, redirecting to /upload');
    return <Navigate to="/upload" replace />;
  }

  // Check if selected role is required and available
  if (requireRole && !selectedRole) {
    console.log('❌ [ProtectedRoute] Selected role required but not found, redirecting to /role-selection');
    return <Navigate to="/role-selection" replace />;
  }

  console.log('✅ [ProtectedRoute] All checks passed, rendering protected content');
  return children;
};

export default ProtectedRoute;
