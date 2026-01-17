import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import SessionInfo from '../components/common/SessionInfo';
import { User, Shield, Database, Eye, EyeOff } from 'lucide-react';

const TestRoleFiltering: React.FC = () => {
  const { currentUser, userRole, login, logout } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedRole, setSelectedRole] = useState('researcher');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const testUsers = [
    { email: 'researcher@cers.bf', role: 'researcher', name: 'Dr. Fatimata Ouédraogo' },
    { email: 'secretary@cers.bf', role: 'secretary', name: 'Aminata Traoré' },
    { email: 'president@cers.bf', role: 'president', name: 'Prof. Ibrahim Konaté' },
    { email: 'committee@cers.bf', role: 'committee', name: 'Dr. Mariam Sawadogo' },
    { email: 'rapporteur@cers.bf', role: 'rapporteur', name: 'Dr. Adama Diallo' },
    { email: 'admin@cers.bf', role: 'admin', name: 'Système Admin' }
  ];

  const handleTestLogin = async (email: string) => {
    const result = await login(email, 'password123');
    if (result.success) {
      addNotification({
        title: 'Connexion réussie',
        message: `Connecté en tant que ${email}`,
        type: 'success'
      });
    } else {
      addNotification({
        title: 'Erreur de connexion',
        message: result.error || 'Échec de la connexion',
        type: 'error'
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    addNotification({
      title: 'Déconnexion',
      message: 'Vous avez été déconnecté',
      type: 'info'
    });
  };

  const getRolePermissions = (role: string) => {
    const permissions: Record<string, string[]> = {
      'researcher': ['Soumettre protocoles', 'Voir ses protocoles', 'Modifier ses protocoles'],
      'secretary': ['Valider protocoles', 'Gérer paiements', 'Générer rapports'],
      'president': ['Attribuer protocoles', 'Validation finale', 'Vue d\'ensemble'],
      'committee': ['Évaluer protocoles', 'Commenter protocoles', 'Voter'],
      'rapporteur': ['Rédiger rapports', 'Synthèse évaluations', 'Recommandations'],
      'admin': ['Gestion utilisateurs', 'Configuration système', 'Accès complet']
    };
    return permissions[role] || [];
  };

  const getSensitiveData = (role: string) => {
    const sensitiveData: Record<string, any> = {
      'researcher': {
        protocols: ['PROT-001: Étude vaccins', 'PROT-002: Recherche climat'],
        personalData: 'Données personnelles du chercheur'
      },
      'secretary': {
        allProtocols: ['Tous les protocoles soumis', 'Informations de paiement'],
        adminData: 'Données administratives'
      },
      'president': {
        committees: ['Composition du comité', 'Décisions confidentielles'],
        strategicData: 'Données stratégiques'
      },
      'admin': {
        users: ['Tous les utilisateurs', 'Mots de passe hashés'],
        systemData: 'Configuration système complète'
      }
    };
    return sensitiveData[role] || {};
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test du Filtrage par Rôle et Session
          </h1>
          <p className="text-gray-600">
            Démonstration de la privatisation des données selon le rôle utilisateur
          </p>
        </div>

        {/* Session actuelle */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Session Actuelle</h2>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
            <SessionInfo showDetails={true} />
          </div>
        )}

        {/* Test de connexion */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test de Connexion par Rôle</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {testUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleTestLogin(user.email)}
                className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  currentUser?.email === user.email ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.role}</span>
                </div>
                <div className="text-sm text-gray-600">{user.name}</div>
                <div className="text-xs text-gray-500 mt-1">{user.email}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Mot de passe pour tous les comptes :</strong> password123
            </p>
          </div>
        </div>

        {/* Permissions par rôle */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Permissions du Rôle : {userRole}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Autorisations :</h3>
                <ul className="space-y-1">
                  {getRolePermissions(userRole).map((permission, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Restrictions :</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Accès limité aux données personnelles</li>
                  <li>• Pas d'accès aux autres rôles</li>
                  <li>• Données filtrées par session</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Données sensibles */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Database className="w-5 h-5" />
                Données Accessibles (Filtrées par Rôle)
              </h2>
              <button
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-50"
              >
                {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showSensitiveData ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            
            {showSensitiveData ? (
              <div className="space-y-4">
                {Object.entries(getSensitiveData(userRole)).map(([key, value]) => (
                  <div key={key} className="border rounded p-3">
                    <h3 className="font-medium capitalize mb-2">{key} :</h3>
                    {Array.isArray(value) ? (
                      <ul className="space-y-1">
                        {value.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">{value}</p>
                    )}
                  </div>
                ))}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    ✅ Ces données sont filtrées selon votre rôle et votre session utilisateur.
                    Un utilisateur avec un autre rôle verrait des données différentes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cliquez sur "Afficher" pour voir les données accessibles</p>
              </div>
            )}
          </div>
        )}

        {!currentUser && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Aucune Session Active</h2>
            <p className="text-gray-600 mb-4">
              Connectez-vous avec l'un des comptes de test ci-dessus pour voir le filtrage par rôle
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRoleFiltering;
