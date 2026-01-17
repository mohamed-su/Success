// Configuration des routes de l'application
export const ROUTES = {
  // Routes publiques
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Routes protégées - Dashboard principal
  DASHBOARD: '/dashboard',
  
  // Routes Researcher
  RESEARCHER: {
    SUBMIT_PROTOCOL: '/dashboard/researcher/submit',
    MY_PROTOCOLS: '/dashboard/researcher/protocols',
    PROTOCOL_DETAILS: '/dashboard/researcher/protocol/:id',
  },
  
  // Routes Secretary
  SECRETARY: {
    VALIDATE: '/dashboard/secretary/validate',
    REPORTS: '/dashboard/secretary/reports',
  },
  
  // Routes Committee
  COMMITTEE: {
    REVIEW: '/dashboard/committee/review/:id',
    ASSIGNED: '/dashboard/committee/assigned',
  },
  
  // Routes Rapporteur
  RAPPORTEUR: {
    SYNTHESIS: '/dashboard/rapporteur/synthesis/:id',
  },
  
  // Routes President
  PRESIDENT: {
    DISTRIBUTE: '/dashboard/president/distribute',
    VALIDATION: '/dashboard/president/validation',
  },
  
  // Routes Admin
  ADMIN: {
    USERS: '/dashboard/admin/users',
    SETTINGS: '/dashboard/admin/settings',
    LOGS: '/dashboard/admin/logs',
  },
};

// Fonction utilitaire pour générer des routes avec paramètres
export const generateRoute = (route: string, params: Record<string, string>) => {
  let generatedRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    generatedRoute = generatedRoute.replace(`:${key}`, value);
  });
  return generatedRoute;
};

// Rôles utilisateur avec interfaces dédiées
export const USER_ROLES = {
  RESEARCHER: 'researcher',
  SECRETARY: 'secretary', 
  COMMITTEE: 'committee',
  COMMITTEE_MEMBER: 'committee',
  RAPPORTEUR: 'rapporteur',
  PRESIDENT: 'president',
  ADMIN: 'admin',
  FINANCIAL: 'financial',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Mapping rôle -> interface
export const ROLE_DASHBOARDS = {
  researcher: '/dashboard/researcher',
  secretary: '/dashboard/secretary',
  committee: '/dashboard/committee',
  committee_member: '/dashboard/committee',
  rapporteur: '/dashboard/rapporteur',
  president: '/dashboard/president',
  admin: '/dashboard/admin',
} as const;

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  [USER_ROLES.RESEARCHER]: {
    canSubmitProtocol: true,
    canViewOwnProtocols: true,
    canEditOwnProtocols: true,
  },
  [USER_ROLES.SECRETARY]: {
    canValidateProtocols: true,
    canManagePayments: true,
    canGenerateReports: true,
  },
  [USER_ROLES.COMMITTEE_MEMBER]: {
    canReviewProtocols: true,
    canAddComments: true,
    canVote: true,
  },
  [USER_ROLES.RAPPORTEUR]: {
    canCreateSynthesis: true,
    canViewAllProtocols: true,
  },
  [USER_ROLES.PRESIDENT]: {
    canDistributeProtocols: true,
    canFinalValidation: true,
    canViewAllProtocols: true,
  },
  [USER_ROLES.ADMIN]: {
    canManageUsers: true,
    canManageSystem: true,
    canViewLogs: true,
  },
} as const;
