import { apiService } from './apiService';

/**
 * Service pour l'accès personnalisé aux protocoles basé sur JWT
 */
export class PersonalizedProtocolService {
  private static instance: PersonalizedProtocolService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('accessToken');
  }

  public static getInstance(): PersonalizedProtocolService {
    if (!PersonalizedProtocolService.instance) {
      PersonalizedProtocolService.instance = new PersonalizedProtocolService();
    }
    return PersonalizedProtocolService.instance;
  }

  /**
   * Met à jour le token d'authentification
   */
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Récupère les protocoles personnalisés selon le rôle utilisateur
   */
  public async getPersonalizedProtocols(): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('/api/personalized/protocols', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des protocoles');
      }

      return data;
    } catch (error) {
      console.error('Erreur getPersonalizedProtocols:', error);
      throw error;
    }
  }

  /**
   * Assigne un protocole avec validation JWT
   */
  public async assignProtocol(protocolId: number, memberId: number): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/personalized/protocols/${protocolId}/assign/${memberId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'assignation');
      }

      return data;
    } catch (error) {
      console.error('Erreur assignProtocol:', error);
      throw error;
    }
  }

  /**
   * Vérifie l'accès à un protocole spécifique
   */
  public async checkProtocolAccess(protocolId: number): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      const response = await fetch(`/api/personalized/protocols/${protocolId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur checkProtocolAccess:', error);
      return false;
    }
  }

  /**
   * Récupère les informations utilisateur depuis le JWT
   */
  public async getUserInfo(): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('/api/personalized/user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des informations utilisateur');
      }

      return data;
    } catch (error) {
      console.error('Erreur getUserInfo:', error);
      throw error;
    }
  }

  /**
   * Valide une action spécifique
   */
  public async validateAction(action: string, resourceId: number): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      const response = await fetch('/api/personalized/validate-access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          resourceId
        })
      });

      const data = await response.json();
      return data.success && data.hasPermission;
    } catch (error) {
      console.error('Erreur validateAction:', error);
      return false;
    }
  }

  /**
   * Génère l'interface utilisateur selon le rôle
   */
  public generateRoleBasedInterface(userRole: string, protocols: any[]): any {
    switch (userRole.toUpperCase()) {
      case 'PRESIDENT':
        return this.generatePresidentInterface(protocols);
      case 'COMMITTEE_MEMBER':
      case 'RAPPORTEUR':
        return this.generateMemberInterface(protocols);
      case 'SECRETARY':
        return this.generateSecretaryInterface(protocols);
      case 'RESEARCHER':
        return this.generateResearcherInterface(protocols);
      case 'ADMIN':
        return this.generateAdminInterface(protocols);
      default:
        return this.generateBasicInterface(protocols);
    }
  }

  private generatePresidentInterface(protocols: any[]): any {
    return {
      title: 'Tableau de bord Président',
      sections: [
        {
          name: 'Protocoles assignés',
          protocols: protocols.filter(p => p.assignedAt),
          actions: ['view', 'approve', 'reassign']
        },
        {
          name: 'Supervision générale',
          protocols: protocols,
          actions: ['view', 'assign', 'supervise']
        }
      ],
      permissions: {
        canAssign: true,
        canApprove: true,
        canSupervise: true
      }
    };
  }

  private generateMemberInterface(protocols: any[]): any {
    return {
      title: 'Mes protocoles assignés',
      sections: [
        {
          name: 'À évaluer',
          protocols: protocols.filter(p => p.canEvaluate),
          actions: ['view', 'evaluate', 'download']
        },
        {
          name: 'Évalués',
          protocols: protocols.filter(p => !p.canEvaluate),
          actions: ['view']
        }
      ],
      permissions: {
        canEvaluate: true,
        canDownload: true
      }
    };
  }

  private generateSecretaryInterface(protocols: any[]): any {
    return {
      title: 'Validation des protocoles',
      sections: [
        {
          name: 'En attente de validation',
          protocols: protocols.filter(p => p.needsValidation),
          actions: ['view', 'validate', 'return']
        },
        {
          name: 'Validés',
          protocols: protocols.filter(p => !p.needsValidation),
          actions: ['view', 'generate_report']
        }
      ],
      permissions: {
        canValidate: true,
        canGenerateReports: true
      }
    };
  }

  private generateResearcherInterface(protocols: any[]): any {
    return {
      title: 'Mes protocoles de recherche',
      sections: [
        {
          name: 'Brouillons',
          protocols: protocols.filter(p => p.status === 'DRAFT'),
          actions: ['edit', 'submit', 'delete']
        },
        {
          name: 'Soumis',
          protocols: protocols.filter(p => p.status !== 'DRAFT'),
          actions: ['view']
        }
      ],
      permissions: {
        canSubmit: true,
        canEdit: true
      }
    };
  }

  private generateAdminInterface(protocols: any[]): any {
    return {
      title: 'Administration système',
      sections: [
        {
          name: 'Tous les protocoles',
          protocols: protocols,
          actions: ['view', 'manage', 'assign', 'delete']
        }
      ],
      permissions: {
        canManageUsers: true,
        canViewAll: true,
        canAssign: true
      }
    };
  }

  private generateBasicInterface(protocols: any[]): any {
    return {
      title: 'Accès limité',
      sections: [
        {
          name: 'Protocoles accessibles',
          protocols: protocols,
          actions: ['view']
        }
      ],
      permissions: {
        canView: true
      }
    };
  }
}

export const personalizedProtocolService = PersonalizedProtocolService.getInstance();
