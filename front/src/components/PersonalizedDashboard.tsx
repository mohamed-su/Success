import React, { useState, useEffect } from 'react';
import { personalizedProtocolService } from '../services/personalizedProtocolService';

interface Protocol {
  id: number;
  title: string;
  description: string;
  status: string;
  protocolCode: string;
  principalInvestigator: string;
  institution: string;
  submittedAt: string;
  assignedAt?: string;
  canEvaluate?: boolean;
  canEdit?: boolean;
  needsValidation?: boolean;
}

interface DashboardSection {
  name: string;
  protocols: Protocol[];
  actions: string[];
}

interface DashboardInterface {
  title: string;
  sections: DashboardSection[];
  permissions: Record<string, boolean>;
}

/**
 * Composant de tableau de bord personnalisé selon le rôle utilisateur
 */
const PersonalizedDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardInterface, setDashboardInterface] = useState<DashboardInterface | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les informations utilisateur
      const userInfoResponse = await personalizedProtocolService.getUserInfo();
      setUserInfo(userInfoResponse);

      // Récupérer les protocoles personnalisés
      const protocolsResponse = await personalizedProtocolService.getPersonalizedProtocols();
      setDashboardData(protocolsResponse);

      // Générer l'interface selon le rôle
      const allProtocols = extractAllProtocols(protocolsResponse);
      const interfaceConfig = personalizedProtocolService.generateRoleBasedInterface(
        userInfoResponse.role,
        allProtocols
      );
      setDashboardInterface(interfaceConfig);

    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const extractAllProtocols = (data: any): Protocol[] => {
    const protocols: Protocol[] = [];
    
    // Extraire les protocoles selon le type de réponse
    if (data.assignedProtocols) protocols.push(...data.assignedProtocols);
    if (data.supervisionProtocols) protocols.push(...data.supervisionProtocols);
    if (data.pendingProtocols) protocols.push(...data.pendingProtocols);
    if (data.myProtocols) protocols.push(...data.myProtocols);
    if (data.allProtocols) protocols.push(...data.allProtocols);

    return protocols;
  };

  const handleProtocolAction = async (action: string, protocolId: number) => {
    try {
      // Valider l'action
      const hasPermission = await personalizedProtocolService.validateAction(action, protocolId);
      if (!hasPermission) {
        alert('Vous n\'avez pas les permissions pour cette action');
        return;
      }

      switch (action) {
        case 'view':
          handleViewProtocol(protocolId);
          break;
        case 'evaluate':
          handleEvaluateProtocol(protocolId);
          break;
        case 'assign':
          handleAssignProtocol(protocolId);
          break;
        case 'validate':
          handleValidateProtocol(protocolId);
          break;
        case 'edit':
          handleEditProtocol(protocolId);
          break;
        default:
          console.log(`Action ${action} non implémentée`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      alert('Erreur lors de l\'exécution de l\'action');
    }
  };

  const handleViewProtocol = (protocolId: number) => {
    // Rediriger vers la page de détails du protocole
    window.location.href = `/protocols/${protocolId}`;
  };

  const handleEvaluateProtocol = (protocolId: number) => {
    // Rediriger vers la page d'évaluation
    window.location.href = `/protocols/${protocolId}/evaluate`;
  };

  const handleAssignProtocol = (protocolId: number) => {
    // Ouvrir une modal d'assignation ou rediriger
    window.location.href = `/protocols/${protocolId}/assign`;
  };

  const handleValidateProtocol = (protocolId: number) => {
    // Rediriger vers la page de validation
    window.location.href = `/protocols/${protocolId}/validate`;
  };

  const handleEditProtocol = (protocolId: number) => {
    // Rediriger vers la page d'édition
    window.location.href = `/protocols/${protocolId}/edit`;
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      view: 'Voir',
      evaluate: 'Évaluer',
      assign: 'Assigner',
      validate: 'Valider',
      edit: 'Modifier',
      download: 'Télécharger',
      approve: 'Approuver',
      supervise: 'Superviser',
      manage: 'Gérer'
    };
    return labels[action] || action;
  };

  const getStatusBadgeClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      'SUBMITTED': 'bg-blue-100 text-blue-800',
      'VERIFIED': 'bg-green-100 text-green-800',
      'ASSIGNED_TO_MEMBER': 'bg-yellow-100 text-yellow-800',
      'COMMITTEE_APPROVED': 'bg-green-100 text-green-800',
      'COMMITTEE_REJECTED': 'bg-red-100 text-red-800',
      'DRAFT': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={loadDashboardData}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du tableau de bord */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {dashboardInterface?.title || 'Tableau de bord'}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Bienvenue, {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {userInfo?.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: {userInfo?.userIdentifier}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={loadDashboardData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sections du tableau de bord */}
        {dashboardInterface?.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {section.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {section.protocols.length} protocole(s)
                </p>
              </div>
              
              {section.protocols.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">Aucun protocole dans cette section</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Protocole
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chercheur principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {section.protocols.map((protocol) => (
                        <tr key={protocol.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {protocol.protocolCode}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {protocol.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {protocol.principalInvestigator}
                            </div>
                            <div className="text-sm text-gray-500">
                              {protocol.institution}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(protocol.status)}`}>
                              {protocol.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(protocol.assignedAt || protocol.submittedAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {section.actions.map((action) => (
                                <button
                                  key={action}
                                  onClick={() => handleProtocolAction(action, protocol.id)}
                                  className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded border border-blue-200 hover:border-blue-300"
                                >
                                  {getActionLabel(action)}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Informations de permissions */}
        {dashboardInterface?.permissions && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vos permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dashboardInterface.permissions).map(([permission, hasPermission]) => (
                <div key={permission} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${hasPermission ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-700">
                    {permission.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
