import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, generateRoute } from '../../config/routes';

// Hook personnalisé pour la navigation
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (route: string, params?: Record<string, string>) => {
    const finalRoute = params ? generateRoute(route, params) : route;
    navigate(finalRoute);
  };

  const goHome = () => navigate(ROUTES.HOME);
  const goToDashboard = () => navigate(ROUTES.DASHBOARD);
  const goToLogin = () => navigate(ROUTES.LOGIN);
  const goToRegister = () => navigate(ROUTES.REGISTER);

  return {
    navigateTo,
    goHome,
    goToDashboard,
    goToLogin,
    goToRegister,
  };
};

// Composant Link personnalisé avec les routes configurées
interface AppLinkProps {
  to: string;
  params?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
}

export const AppLink: React.FC<AppLinkProps> = ({ to, params, children, className }) => {
  const finalRoute = params ? generateRoute(to, params) : to;
  
  return (
    <Link to={finalRoute} className={className}>
      {children}
    </Link>
  );
};
