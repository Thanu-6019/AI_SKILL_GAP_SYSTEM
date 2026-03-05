import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { DashboardLayout } from '../components/layout';
import { ProtectedRoute } from '../components/common';
import Landing from '../pages/Landing';
import ResumeUpload from '../pages/ResumeUpload';
import AIProcessing from '../pages/AIProcessing';
import RoleSelection from '../pages/RoleSelection';
import AnalysisResult from '../pages/AnalysisResult';
import CareerPathExplorer from '../pages/CareerPathExplorer';
import Dashboard from '../pages/Dashboard';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import { Login } from '../pages/auth';

const AppRoutes = () => {
  const location = useLocation();
  
  // Log every route change
  useEffect(() => {
    console.log('🛤️ [AppRoutes] Route changed to:', location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Login />} />
      
      {/* Protected upload route */}
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <ResumeUpload />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected AI flow routes */}
      <Route 
        path="/processing" 
        element={
          <ProtectedRoute requireResume={true}>
            <AIProcessing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/role-selection" 
        element={
          <ProtectedRoute requireRoles={true}>
            <RoleSelection />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analysis" 
        element={
          <ProtectedRoute requireRole={true}>
            <AnalysisResult />
          </ProtectedRoute>
        } 
      />
      
      {/* Career Path Explorer - Dynamic route with role name */}
      <Route 
        path="/career-path/:roleName" 
        element={
          <ProtectedRoute>
            <CareerPathExplorer />
          </ProtectedRoute>
        } 
      />

      {/* Protected routes with sidebar layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
