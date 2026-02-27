import { Navigate } from 'react-router-dom';
import { useSkillGap } from '../../context';

const ProtectedRoute = ({ children, requireResume = false, requireRoles = false, requireRole = false }) => {
  const { resumeFile, matchedRoles, selectedRole } = useSkillGap();

  // Check if resume is required and available
  if (requireResume && !resumeFile) {
    return <Navigate to="/upload" replace />;
  }

  // Check if matched roles are required and available
  if (requireRoles && (!matchedRoles || matchedRoles.length === 0)) {
    return <Navigate to="/upload" replace />;
  }

  // Check if selected role is required and available
  if (requireRole && !selectedRole) {
    return <Navigate to="/role-selection" replace />;
  }

  return children;
};

export default ProtectedRoute;
