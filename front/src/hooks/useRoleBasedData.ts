import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

interface UseRoleBasedDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoleBasedData = <T = any>(
  dataType: 'protocols' | 'users' | 'profile' | 'notifications',
  dependencies: any[] = []
): UseRoleBasedDataResult<T> => {
  const { currentUser, userRole } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!currentUser || !userRole) {
      setError('Utilisateur non authentifié');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      switch (dataType) {
        case 'protocols':
          response = await apiService.getMyProtocols();
          break;
        case 'users':
          if (userRole === 'admin') {
            response = await apiService.getUsers();
          } else {
            setError('Accès non autorisé');
            setLoading(false);
            return;
          }
          break;
        case 'profile':
          response = await apiService.getUserProfile();
          break;
        case 'notifications':
          response = await apiService.getNotifications();
          break;
        default:
          setError('Type de données non supporté');
          setLoading(false);
          return;
      }

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser, userRole, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// Hook spécialisé pour les protocoles selon le rôle
export const useProtocolsByRole = () => {
  const { userRole } = useAuth();
  
  return useRoleBasedData('protocols', [userRole]);
};

// Hook pour vérifier les permissions
export const usePermissions = () => {
  const { currentUser, userRole } = useAuth();

  const hasPermission = (requiredRole: string | string[], resource?: string): boolean => {
    if (!currentUser || !userRole) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = roles.includes(userRole);

    // Vérifications spécifiques par ressource
    if (resource && hasRole) {
      switch (resource) {
        case 'admin_panel':
          return userRole === 'admin';
        case 'user_management':
          return userRole === 'admin';
        case 'protocol_validation':
          return ['secretary', 'admin'].includes(userRole);
        case 'protocol_review':
          return ['committee', 'committee_member', 'rapporteur', 'president'].includes(userRole);
        case 'view_assigned_protocols':
          return ['committee', 'committee_member', 'rapporteur', 'president'].includes(userRole);
        case 'protocol_assignment':
          return userRole === 'president';
        default:
          return hasRole;
      }
    }

    return hasRole;
  };

  const canAccessResource = (resource: string): boolean => {
    const resourcePermissions: Record<string, string[]> = {
      'protocols': ['researcher', 'secretary', 'committee', 'committee_member', 'rapporteur', 'president', 'admin'],
      'assigned_protocols': ['committee', 'committee_member', 'rapporteur', 'president'],
      'users': ['admin'],
      'payments': ['secretary', 'admin'],
      'reports': ['secretary', 'president', 'admin'],
      'settings': ['admin']
    };

    const allowedRoles = resourcePermissions[resource];
    return allowedRoles ? hasPermission(allowedRoles) : false;
  };

  return {
    hasPermission,
    canAccessResource,
    currentUser,
    userRole
  };
};
