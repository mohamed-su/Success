import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_DASHBOARDS, UserRole } from '../config/routes';

export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const { userRole, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole) {
      const dashboardPath = ROLE_DASHBOARDS[userRole as UserRole];
      if (dashboardPath) {
        navigate(dashboardPath);
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  return { userRole, isAuthenticated };
};

export const getRoleDashboard = (role: string): string => {
  return ROLE_DASHBOARDS[role as UserRole] || '/dashboard';
};
