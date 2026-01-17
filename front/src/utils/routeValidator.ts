// Utilitaire pour valider la cohérence des routes
import { ROLE_DASHBOARDS } from '../config/routes';

export const validateRoutes = () => {
  const issues: string[] = [];
  
  // Vérifier que tous les rôles ont un dashboard défini
  const expectedRoles = ['researcher', 'secretary', 'committee', 'rapporteur', 'president', 'admin'];
  
  expectedRoles.forEach(role => {
    if (!ROLE_DASHBOARDS[role]) {
      issues.push(`Rôle "${role}" n'a pas de dashboard défini`);
    }
  });
  
  // Vérifier que toutes les routes commencent par /dashboard
  Object.entries(ROLE_DASHBOARDS).forEach(([role, path]) => {
    if (!path.startsWith('/dashboard/')) {
      issues.push(`Route pour le rôle "${role}" ne commence pas par /dashboard/: ${path}`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Fonction pour obtenir la route correcte selon le rôle
export const getCorrectRoute = (userRole: string, page?: string) => {
  const basePath = ROLE_DASHBOARDS[userRole];
  if (!basePath) {
    console.warn(`Rôle "${userRole}" non reconnu`);
    return '/dashboard';
  }
  
  if (page) {
    return `${basePath}/${page}`;
  }
  
  return basePath;
};

// Validation au démarrage de l'application
if (process.env.NODE_ENV === 'development') {
  const validation = validateRoutes();
  if (!validation.isValid) {
    console.warn('Problèmes de configuration des routes détectés:');
    validation.issues.forEach(issue => console.warn(`- ${issue}`));
  } else {
    console.log('✅ Configuration des routes validée');
  }
}
