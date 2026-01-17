import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { mockAuthService } from './mockAuthService';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    // URL forcée en local
    this.baseURL = 'http://localhost:8081/api';
    this.token = localStorage.getItem('authToken');
    console.log('ApiService initialized with baseURL:', this.baseURL);
  }

  // Méthode pour définir le token d'authentification
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Méthode pour supprimer le token
  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Méthode générique pour les requêtes HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Récupérer les informations utilisateur depuis localStorage
    const userData = localStorage.getItem('userData');
    let userInfo = null;
    if (userData) {
      try {
        userInfo = JSON.parse(userData);
      } catch (error) {
        console.error('Erreur parsing userData:', error);
      }
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...(userInfo && { 
          'X-User-ID': userInfo.id?.toString(),
          'X-User-Role': userInfo.role,
          'X-User-Username': userInfo.username
        }),
        ...options.headers,
      },
    };

    try {
      console.log('Requête envoyée:', { url, method: config.method || 'GET' });
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          const jsonError = await response.json();
          console.log('Erreur serveur:', jsonError);
          errorData = jsonError.message || jsonError.error || `HTTP ${response.status}`;
        } catch {
          errorData = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorData);
      }

      const data = await response.json();
      console.log('Réponse reçue:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }

  // Méthodes d'authentification
  async login(credentials: any): Promise<any> {
    console.log('Tentative de connexion:', credentials.username);
    
    try {
      const response = await this.request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.log('Backend non disponible, utilisation du service mock');
      // Fallback vers le service mock
      const mockResponse = await mockAuthService.login(credentials.username, credentials.password || 'password123');
      
      if (mockResponse.success && mockResponse.data?.token) {
        this.setToken(mockResponse.data.token);
      }
      
      return mockResponse;
    }
  }

  async register(userData: any): Promise<any> {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<any> {
    const response = await this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
    
    if (response.success) {
      this.removeToken();
    }
    
    return response;
  }

  // Méthode pour rechercher des protocoles par période
  async searchProtocols(filters: { userIdentifier?: string, month?: string, year?: string, status?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (filters.userIdentifier) params.append('userIdentifier', filters.userIdentifier);
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    if (filters.status) params.append('status', filters.status);
    
    return this.request(`/researcher/protocols/search?${params.toString()}`);
  }

  // Méthode pour récupérer les statistiques des protocoles
  async getProtocolStatistics(userIdentifier?: string): Promise<any> {
    const params = userIdentifier ? `?userIdentifier=${userIdentifier}` : '';
    return this.request(`/researcher/protocols/statistics${params}`);
  }

  // Méthodes pour les protocoles (filtrées par utilisateur)
  async getProtocols(): Promise<any> {
    return this.request(API_ENDPOINTS.PROTOCOLS.LIST);
  }

  // Méthodes spécifiques par rôle
  async getMyProtocolsAsResearcher(): Promise<any> {
    return this.request('/researcher/protocols/my-protocols');
  }

  async getProtocolsForSecretary(): Promise<any> {
    return this.request('/secretary/protocols');
  }

  async getProtocolsForCommittee(): Promise<any> {
    return this.request('/committee/protocols/assigned');
  }

  async getProtocolsForPresident(): Promise<any> {
    return this.request('/president/protocols');
  }

  async createProtocol(protocolData: any): Promise<any> {
    return this.request(API_ENDPOINTS.PROTOCOLS.CREATE, {
      method: 'POST',
      body: JSON.stringify(protocolData),
    });
  }

  async getProtocol(id: string): Promise<any> {
    return this.request(API_ENDPOINTS.PROTOCOLS.GET.replace(':id', id));
  }

  async getProtocolDetails(id: string): Promise<any> {
    const userData = localStorage.getItem('userData');
    if (!userData) return { success: false, error: 'Non authentifié' };
    
    const user = JSON.parse(userData);
    const userIdentifier = user.userIdentifier || user.username || user.email;
    
    if (!userIdentifier) {
      return { success: false, error: 'Identifiant utilisateur manquant' };
    }
    
    return this.request(`/researcher/protocols/${id}?userIdentifier=${userIdentifier}`);
  }

  async updateProtocol(id: string, protocolData: any): Promise<any> {
    return this.request(API_ENDPOINTS.PROTOCOLS.UPDATE.replace(':id', id), {
      method: 'PUT',
      body: JSON.stringify(protocolData),
    });
  }

  async deleteProtocol(id: string): Promise<any> {
    return this.request(API_ENDPOINTS.PROTOCOLS.DELETE.replace(':id', id), {
      method: 'DELETE',
    });
  }

  // Méthode pour soumettre un protocole avec fichiers et notification dynamique
  async submitProtocol(formData: FormData): Promise<any> {
    const url = `${this.baseURL}/researcher/protocols/submit`;

    // Récupérer les informations utilisateur depuis localStorage
    const userData = localStorage.getItem('userData');
    let userInfo = null;
    if (userData) {
      try {
        userInfo = JSON.parse(userData);
        // Ajouter l'identifiant utilisateur au FormData
        const userIdentifier = userInfo.userIdentifier || userInfo.username;
        if (userIdentifier) {
          formData.append('submitterIdentifier', userIdentifier);
        }
      } catch (error) {
        console.error('Erreur parsing userData:', error);
      }
    }

    try {
      console.log('Token utilisé pour la soumission:', this.token ? 'Token présent' : 'Aucun token');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...(userInfo && { 
            'X-User-ID': userInfo.id?.toString(),
            'X-User-Role': userInfo.role,
            'X-User-Username': userInfo.username
          }),
          // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
        },
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.text();
        } catch {
          errorData = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorData);
      }

      const data = await response.json();
      
      // Après soumission réussie, actualiser les notifications
      if (data.success) {
        this.refreshNotifications();
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }

  // Méthode pour mettre à jour un protocole existant
  async updateExistingProtocol(id: string, formData: FormData): Promise<any> {
    const url = `${this.baseURL}/researcher/protocols/${id}/update`;

    // Récupérer les informations utilisateur depuis localStorage
    const userData = localStorage.getItem('userData');
    let userInfo = null;
    if (userData) {
      try {
        userInfo = JSON.parse(userData);
        // Ajouter l'identifiant utilisateur au FormData
        const userIdentifier = userInfo.userIdentifier || userInfo.username;
        if (userIdentifier) {
          formData.append('userIdentifier', userIdentifier);
        }
      } catch (error) {
        console.error('Erreur parsing userData:', error);
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...(userInfo && { 
            'X-User-ID': userInfo.id?.toString(),
            'X-User-Role': userInfo.role,
            'X-User-Username': userInfo.username
          }),
        },
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.text();
        } catch {
          errorData = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorData);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }

  // Méthode pour récupérer les protocoles selon le rôle
  async getMyProtocols(): Promise<any> {
    const userData = localStorage.getItem('userData');
    if (!userData) return { success: false, error: 'Non authentifié' };
    
    const user = JSON.parse(userData);
    const role = user.role?.toLowerCase();
    const userIdentifier = user.userIdentifier || user.username || user.id;
    
    console.log('User data for getMyProtocols:', { user, role, userIdentifier });
    
    try {
      let response;
      
      // Utiliser les endpoints spécifiques selon le rôle
      if (role === 'rapporteur' || role === 'committee_member' || role === 'committee member') {
        response = await this.request('/rapporteur/protocols');
      } else if (role === 'president') {
        response = await this.request('/president/assigned-protocols');
      } else if (['committee', 'secretary', 'admin'].includes(role)) {
        response = await this.request('/assigned-protocols');
      } else if (role === 'researcher') {
        if (!userIdentifier) {
          return { success: false, error: 'Identifiant utilisateur manquant' };
        }
        response = await this.request(`/researcher/protocols/my-protocols?userIdentifier=${userIdentifier}`);
      } else {
        return { success: false, error: 'Rôle non reconnu' };
      }
      
      // Pour le chercheur, extraire les protocoles du format de réponse du backend
      if (response.success && role === 'researcher' && response.data?.protocols) {
        return {
          success: true,
          data: response.data.protocols
        };
      }
      
      return response;
    } catch (error) {
      console.log('Backend non disponible, utilisation des données mock');
      // Fallback vers les données mock
      const mockData = mockAuthService.getMockDataByRole(role, user.id);
      return {
        success: true,
        data: mockData
      };
    }
  }

  // Méthodes pour l'administration (accès restreint)
  async getUsers(role?: string): Promise<any> {
    const userData = localStorage.getItem('userData');
    if (!userData) return { success: false, error: 'Non authentifié' };
    
    const user = JSON.parse(userData);
    if (user.role?.toLowerCase() !== 'admin') {
      return { success: false, error: 'Accès non autorisé' };
    }
    
    const endpoint = role ? `${API_ENDPOINTS.ADMIN.USERS}?role=${role}` : API_ENDPOINTS.ADMIN.USERS;
    return this.request(endpoint);
  }
  
  async getRoles(): Promise<any> {
    return this.request('/admin/roles');
  }

  async getUserProfile(): Promise<any> {
    const userData = localStorage.getItem('userData');
    if (!userData) return { success: false, error: 'Non authentifié' };
    
    const user = JSON.parse(userData);
    return this.request(`${API_ENDPOINTS.USER.PROFILE}/${user.id}`);
  }

  async updateUserProfile(userData: any): Promise<any> {
    return this.request(API_ENDPOINTS.USER.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Méthode pour tester la connexion
  async testConnection(): Promise<any> {
    return this.request('/test');
  }
  
  // Méthode pour tester l'authentification
  async testAuth(): Promise<any> {
    return this.request('/test-auth');
  }
  
  // Méthode pour déboguer le token
  async debugToken(): Promise<any> {
    const url = `${this.baseURL}/debug/token`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
      });
      
      const data = await response.json();
      console.log('Debug token response:', data);
      
      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: response.ok ? null : data.error || 'Debug failed'
      };
    } catch (error) {
      console.error('Debug token error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Debug failed'
      };
    }
  }
  
  // Méthode pour assigner un protocole à un membre
  async assignProtocolToMember(protocolId: number, memberId: number): Promise<any> {
    return this.request(`/protocols/${protocolId}/assign/${memberId}`, {
      method: 'POST'
    });
  }

  // Méthode pour assigner un protocole à plusieurs membres
  async assignProtocolToMultipleMembers(protocolId: number, memberIds: number[]): Promise<any> {
    return this.request(`/protocols/${protocolId}/assign-multiple`, {
      method: 'POST',
      body: JSON.stringify({ memberIds })
    });
  }

  // Méthodes pour les notifications dynamiques
  async getNotifications(): Promise<any> {
    return this.request('/notifications');
  }
  
  async markNotificationAsRead(id: number): Promise<any> {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }
  
  async clearAllNotifications(): Promise<any> {
    return this.request('/notifications/clear', { method: 'DELETE' });
  }
  
  private async refreshNotifications(): Promise<void> {
    try {
      await this.getNotifications();
    } catch (error) {
      console.warn('Impossible d\'actualiser les notifications:', error);
    }
  }
}

// Instance singleton du service API
export const apiService = new ApiService();
export default apiService;
