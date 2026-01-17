import React, { useState, createContext, useContext, useEffect } from 'react';
import apiService from '../services/apiService';

// Interface pour l'utilisateur
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Interface pour le résultat de connexion
interface LoginResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Interface pour le contexte d'authentification
export interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<boolean>;
  switchRole: (newRole: string) => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        const normalizedRole = user.role ? user.role.toLowerCase() : null;
        const userWithNormalizedRole = { ...user, role: normalizedRole };
        
        console.log('Chargement utilisateur:', userWithNormalizedRole);
        console.log('Rôle au chargement:', normalizedRole);
        
        setCurrentUser(userWithNormalizedRole);
        setUserRole(normalizedRole);
        setIsAuthenticated(true);
        
        // S'assurer que userId et userRole sont dans localStorage
        localStorage.setItem('userId', userWithNormalizedRole.id?.toString() || '');
        localStorage.setItem('userRole', normalizedRole || '');
        
        apiService.setToken(token);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  // Fonction de connexion réelle
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login({ username: email, password });
      console.log('Réponse de connexion:', response);

      if (response.success && response.data) {
        const { user, token } = response.data;
        console.log('Données utilisateur reçues:', user);
        
        // Normaliser le rôle mais garder la version originale pour les headers
        const normalizedRole = user.role ? user.role.toLowerCase() : null;
        const userWithNormalizedRole = { ...user, role: user.role }; // Garder le rôle original
        
        console.log('Rôle original:', user.role);
        console.log('Rôle normalisé:', normalizedRole);

        // S'assurer que l'utilisateur a un identifiant
        if (!userWithNormalizedRole.userIdentifier && !userWithNormalizedRole.username) {
          userWithNormalizedRole.userIdentifier = userWithNormalizedRole.id?.toString() || 'user_' + Date.now();
        }
        
        // Stocker les données utilisateur
        setCurrentUser(userWithNormalizedRole);
        setUserRole(user.role); // Utiliser le rôle original
        setIsAuthenticated(true);

        // Stocker dans localStorage
        localStorage.setItem('userData', JSON.stringify(userWithNormalizedRole));
        localStorage.setItem('userId', userWithNormalizedRole.id?.toString() || '');
        localStorage.setItem('userRole', user.role || ''); // Rôle original
        localStorage.setItem('authToken', token);
        apiService.setToken(token);

        setLoading(false);
        return { success: true };
      } else {
        // Gérer les erreurs spécifiques
        setLoading(false);
        return {
          success: false,
          error: response.error || 'INVALID_CREDENTIALS',
          message: response.error || 'Échec de la connexion'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setLoading(false);
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Erreur de connexion au serveur'
      };
    }
  };
  
  // Fonction pour changer de rôle (pour les tests uniquement)
  const switchRole = (newRole: string) => {
    if (currentUser) {
      const updatedUser: User = { ...currentUser, role: newRole };
      setUserRole(newRole);
      setCurrentUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    setLoading(true);
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer l'état local
      setCurrentUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userData');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      apiService.removeToken();
      setLoading(false);
    }
    return true;
  };
  const value = {
    currentUser,
    userRole,
    loading,
    isAuthenticated,
    login,
    logout,
    switchRole
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
