import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_DASHBOARDS } from '../../config/routes';

const RoleRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, isAuthenticated, currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && currentUser && userRole) {
      console.log('RoleRedirect - Rôle détecté:', userRole);
      const dashboardPath = ROLE_DASHBOARDS[userRole.toLowerCase()];
      console.log('RoleRedirect - Chemin de redirection:', dashboardPath);
      
      if (dashboardPath) {
        setTimeout(() => {
          navigate(dashboardPath, { replace: true });
        }, 100);
      } else {
        console.error('RoleRedirect - Aucun chemin trouvé pour le rôle:', userRole);
        navigate('/', { replace: true });
      }
    } else if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, userRole, currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C224E] mx-auto"></div>
          <p className="mt-4 text-[#1B384F]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C224E] mx-auto"></div>
        <p className="mt-4 text-[#1B384F]">Redirection vers votre interface...</p>
        <p className="mt-2 text-sm text-gray-600">Rôle: {userRole}</p>
      </div>
    </div>
  );
};

export default RoleRedirect;
