// Service d'authentification mock pour tester le filtrage par rôle
export interface MockUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const mockUsers: MockUser[] = [
  // Utilisateurs de base
  {
    id: 1,
    username: 'admin@cers.bf',
    email: 'admin@cers.bf',
    firstName: 'Admin',
    lastName: 'CERS',
    role: 'admin'
  },
  {
    id: 2,
    username: 'researcher@cers.bf',
    email: 'researcher@cers.bf',
    firstName: 'Dr. Marie',
    lastName: 'Ouédraogo',
    role: 'researcher'
  },
  {
    id: 3,
    username: 'secretary@cers.bf',
    email: 'secretary@cers.bf',
    firstName: 'Secrétaire',
    lastName: 'CERS',
    role: 'secretary'
  },
  // Président (avec accès membre du comité)
  {
    id: 4,
    username: 'president@cers.bf',
    email: 'president@cers.bf',
    firstName: 'Prof. Aminata',
    lastName: 'Traoré',
    role: 'president'
  },
  // 6 Membres du comité
  {
    id: 5,
    username: 'membre1@comite-ethique.bf',
    email: 'membre1@comite-ethique.bf',
    firstName: 'Dr. Amadou',
    lastName: 'OUEDRAOGO',
    role: 'committee_member'
  },
  {
    id: 6,
    username: 'membre2@comite-ethique.bf',
    email: 'membre2@comite-ethique.bf',
    firstName: 'Dr. Fatimata',
    lastName: 'KONE',
    role: 'committee_member'
  },
  {
    id: 7,
    username: 'membre3@comite-ethique.bf',
    email: 'membre3@comite-ethique.bf',
    firstName: 'Prof. Jean',
    lastName: 'SAWADOGO',
    role: 'committee_member'
  },
  {
    id: 8,
    username: 'membre4@comite-ethique.bf',
    email: 'membre4@comite-ethique.bf',
    firstName: 'Dr. Marie',
    lastName: 'TRAORE',
    role: 'committee_member'
  },
  {
    id: 9,
    username: 'membre5@comite-ethique.bf',
    email: 'membre5@comite-ethique.bf',
    firstName: 'Prof. Ibrahim',
    lastName: 'ZONGO',
    role: 'committee_member'
  },
  {
    id: 10,
    username: 'committee@cers.bf',
    email: 'committee@cers.bf',
    firstName: 'Dr. Fatou',
    lastName: 'Zongo',
    role: 'committee_member'
  },
  // 2 Rapporteurs (avec accès membre du comité)
  {
    id: 11,
    username: 'rapporteur1@comite-ethique.bf',
    email: 'rapporteur1@comite-ethique.bf',
    firstName: 'Dr. Salimata',
    lastName: 'OUATTARA',
    role: 'rapporteur'
  },
  {
    id: 12,
    username: 'rapporteur2@comite-ethique.bf',
    email: 'rapporteur2@comite-ethique.bf',
    firstName: 'Prof. Boukary',
    lastName: 'DIALLO',
    role: 'rapporteur'
  }
];

export const mockAuthService = {
  async login(email: string, password: string) {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email || u.username === email);
    
    if (user && password === 'password123') {
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      return {
        success: true,
        data: {
          user,
          token
        }
      };
    }
    
    return {
      success: false,
      error: 'Identifiants invalides'
    };
  },

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },

  // Données mock par rôle
  getMockDataByRole(role: string, userId: number) {
    switch (role) {
      case 'researcher':
        return {
          protocols: [
            {
              id: 1,
              title: "Étude sur l'efficacité des vaccins contre le paludisme",
              status: 'SUBMITTED',
              submittedAt: '2024-01-15T10:00:00Z',
              principalInvestigator: 'Dr. Fatimata Ouédraogo',
              institution: 'Centre Muraz',
              participants: 100,
              duration: 12
            },
            {
              id: 2,
              title: "Impact des changements climatiques sur la santé",
              status: 'VERIFIED',
              submittedAt: '2024-01-10T14:30:00Z',
              principalInvestigator: 'Dr. Fatimata Ouédraogo',
              institution: 'Centre Muraz',
              participants: 200,
              duration: 18
            }
          ]
        };
      
      case 'president':
        return {
          protocols: [
            {
              id: 3,
              title: "Recherche sur les maladies tropicales",
              status: 'VERIFIED',
              submittedAt: '2024-01-20T09:00:00Z',
              principalInvestigator: 'Dr. Ibrahim Sanogo',
              institution: 'IRSS',
              participants: 150,
              duration: 24
            }
          ],
          members: [
            { id: '4', name: 'Dr. Mariam Sawadogo', role: 'Membre du Comité', username: 'committee1' },
            { id: '5', name: 'Dr. Boukary Ouattara', role: 'Membre du Comité', username: 'committee2' },
            { id: '6', name: 'Dr. Salimata Compaoré', role: 'Membre du Comité', username: 'committee3' },
            { id: '7', name: 'Dr. Moussa Kaboré', role: 'Membre du Comité', username: 'committee4' },
            { id: '8', name: 'Dr. Aïcha Zongo', role: 'Membre du Comité', username: 'committee5' },
            { id: '9', name: 'Dr. Adama Diallo', role: 'Rapporteur', username: 'rapporteur1' },
            { id: '10', name: 'Dr. Rasmané Semde', role: 'Rapporteur', username: 'rapporteur2' }
          ],
          assignments: {}
        };
      
      default:
        return { protocols: [] };
    }
  }
};
