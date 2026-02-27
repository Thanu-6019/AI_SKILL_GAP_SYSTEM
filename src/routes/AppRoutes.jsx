import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { ProtectedRoute } from '../components/common';
import Landing from '../pages/Landing';
import ResumeUpload from '../pages/ResumeUpload';
import AIProcessing from '../pages/AIProcessing';
import RoleSelection from '../pages/RoleSelection';
import AnalysisResult from '../pages/AnalysisResult';
import CareerPathExplorer from '../pages/CareerPathExplorer';
import Dashboard from '../pages/Dashboard';
import Skills from '../pages/Skills';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes without sidebar */}
      <Route path="/" element={<Landing />} />
      <Route path="/upload" element={<ResumeUpload />} />
      
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
      <Route path="/career-path/:roleName" element={<CareerPathExplorer />} />

      {/* Protected routes with sidebar layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="skills" element={<Skills />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
