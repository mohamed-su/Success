import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle, UserCheckIcon, SendIcon } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useProtocolsByRole, usePermissions } from '../../hooks/useRoleBasedData';
import DataProtection from '../../components/common/DataProtection';


interface Protocol {
  id: number;
  title: string;
  principalInvestigator: string;
  institution: string;
  participants: number;
  duration: number;
  verifiedAt: string;
  submitterName?: string;
  status?: string;
  isAssigned?: boolean;
  assignedTo?: string;
  assignedAt?: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  username: string;
  assignmentCount?: number;
}

const ProtocolAssignment: React.FC = () => {
  const { addNotification } = useNotifications();
  const { hasPermission, currentUser } = usePermissions();
  const { data: protocolData, loading, error, refetch } = useProtocolsByRole();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<{[key: string]: number}>({});
  const [protocolStats, setProtocolStats] = useState<{pending: number, assigned: number, assignedProtocols: any[]}>({pending: 0, assigned: 0, assignedProtocols: []});
  const [showAssignedProtocols, setShowAssignedProtocols] = useState(false);
  const [selectedProtocols, setSelectedProtocols] = useState<number[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Vérifier les permissions d'accès
  if (!hasPermission('president', 'protocol_assignment')) {
    return (
      <DataProtection requiredRole="president" resource="protocol_assignment">
        <div></div>
      </DataProtection>
    );
  }

  useEffect(() => {
    if (protocolData) {
      setProtocols(protocolData.protocols || []);
      // Garder seulement les utilisateurs actifs
      const eligibleMembers = (protocolData.members || []).filter(member => 
        member.active !== false
      );
      setMembers(eligibleMembers);
      setAssignments(protocolData.assignments || {});
    }
    fetchProtocolStats();
    fetchMembersWithCounts();
  }, [protocolData]);

  useEffect(() => {
    if (error) {
      addNotification({
        title: 'Erreur',
        message: error
      });
    }
  }, [error]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('${BASE_URL}/president/protocols/assignments', {
        headers: {
          'X-User-ID': currentUser?.id?.toString() || '',
          'X-User-Role': currentUser?.role || '',
          'X-User-Username': currentUser?.username || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAssignments(data.assignmentsByMember);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  const fetchProtocolStats = async () => {
    try {
      const response = await fetch('${BASE_URL}/president/protocols/status', {
        headers: {
          'X-User-ID': currentUser?.id?.toString() || '',
          'X-User-Role': currentUser?.role || '',
          'X-User-Username': currentUser?.username || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProtocolStats(data);
        }

      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchMembersWithCounts = async () => {
    try {
      const response = await fetch('${BASE_URL}/auto-assignment/protocols-with-status');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.members) {
          setMembers(data.members);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

const handleSelectProtocol = (id: number) => {
    const protocol = protocols.find(p => p.id === id);
    
    // Empêcher la sélection des protocoles déjà assignés
    if (protocol?.isAssigned) {
      addNotification({
        title: 'Protocole déjà assigné',
        message: `Le protocole PROT-${id} est déjà assigné à ${protocol.assignedTo || 'un membre'}.`
      });
      return;
    }
    
    if (selectedProtocols.includes(id)) {
      setSelectedProtocols(selectedProtocols.filter(protocolId => protocolId !== id));
    } else {
      setSelectedProtocols([...selectedProtocols, id]);
    }
  };

  const handleSelectMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(memberId => memberId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const openAssignModal = () => {
    // Filtrer les protocoles disponibles (non assignés)
    const availableProtocols = selectedProtocols.filter(protocolId => {
      const protocol = protocols.find(p => p.id === protocolId);
      return protocol && !protocol.isAssigned;
    });
    
    if (availableProtocols.length === 0) {
      addNotification({
        title: 'Action impossible',
        message: selectedProtocols.length > 0 ? 
          'Tous les protocoles sélectionnés sont déjà assignés.' : 
          'Veuillez sélectionner au moins un protocole disponible.'
      });
      // Nettoyer la sélection des protocoles déjà assignés
      setSelectedProtocols(availableProtocols);
      return;
    }
    
    // Mettre à jour la sélection avec seulement les protocoles disponibles
    setSelectedProtocols(availableProtocols);
    setSelectedMembers([]);
    setShowAssignModal(true);
  };

  const handleAssignProtocols = async () => {
    if (selectedMembers.length === 0) {
      addNotification({
        title: 'Action incomplète',
        message: 'Veuillez sélectionner au moins un membre du comité.'
      });
      return;
    }

    try {
      let successCount = 0;
      const assignmentResults = [];
      
      // Filtrer les protocoles non assignés
      const availableProtocols = selectedProtocols.filter(protocolId => {
        const protocol = protocols.find(p => p.id === protocolId);
        return protocol && !protocol.isAssigned;
      });
      
      if (availableProtocols.length === 0) {
        addNotification({
          title: 'Information',
          message: 'Tous les protocoles sélectionnés sont déjà assignés.'
        });
        setShowAssignModal(false);
        setSelectedProtocols([]);
        return;
      }
      
      // Utiliser l'assignation multiple pour chaque protocole
      for (const protocolId of availableProtocols) {
        try {
          const response = await fetch(`${BASE_URL}/protocols/${protocolId}/assign-multiple`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-User-ID': currentUser?.id?.toString() || '',
              'X-User-Role': currentUser?.role || ''
            },
            body: JSON.stringify({ memberIds: selectedMembers.map(id => parseInt(id)) })
          });
          
          const result = await response.json();
          
          if (result.success) {
            successCount += result.assignedMembers?.length || 0;
            assignmentResults.push(`PROT-${protocolId} → ${result.assignedMembers?.join(', ') || 'membres sélectionnés'}`);
          } else {
            console.error('Erreur:', result.error);
          }
        } catch (error) {
          console.error('Erreur réseau:', error);
        }
      }
      
      addNotification({
        title: 'Assignation terminée',
        message: successCount > 0 ? 
          `${successCount} assignation(s) effectuée(s)` : 
          'Aucune assignation effectuée',
        details: assignmentResults
      });
      
      setShowAssignModal(false);
      setSelectedProtocols([]);
      refetch();
      fetchAssignments();
      fetchProtocolStats();
      fetchMembersWithCounts();
    } catch (error) {
      console.error('Erreur assignation:', error);
      addNotification({
        title: 'Erreur',
        message: 'Erreur lors de l\'assignation des protocoles.'
      });
    }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Chargement des protocoles...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur: {error}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attribution des Protocoles</h1>
        <div className="text-sm text-gray-600 flex items-center gap-4">
          <button
            onClick={() => {
              refetch();
              fetchAssignments();
              fetchProtocolStats();
              fetchMembersWithCounts();
            }}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 flex items-center gap-1"
          >
            🔄 Actualiser
          </button>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {protocols.filter(p => !p.isAssigned).length} en attente
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            {protocols.filter(p => p.isAssigned).length} assignés
          </span>
          <button
            onClick={() => setShowAssignedProtocols(!showAssignedProtocols)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {showAssignedProtocols ? 'Masquer' : 'Voir'} les assignés
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/member/assigned'}
            className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs hover:bg-purple-200"
          >
            Mes protocoles assignés
          </button>
          {currentUser && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Connecté: {currentUser.firstName} {currentUser.lastName}
            </span>
          )}
        </div>
      </div>

      {/* Résumé des attributions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Répartition par Membre du Comité
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {members.map((member) => (
<div key={member.id} className="border rounded p-3">
              <div className="font-medium text-sm">{member.name}</div>
              <div className="text-xs text-gray-500">{member.role}</div>
              <div className="text-lg font-bold text-blue-600">
                {member.assignmentCount || 0} protocole(s)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des protocoles */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Protocoles Conformes à Attribuer
          </h2>
        </div>
{selectedProtocols.length > 0 && (
          <div className="px-6 py-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
            <div className="text-sm text-green-800">
              <span className="font-medium">{selectedProtocols.length}</span> protocole(s) sélectionné(s)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={openAssignModal}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800"
              >
                <Users className="h-4 w-4 mr-1" />
                Assigner au comité
              </button>
              <button
                onClick={() => setSelectedProtocols([])}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="space-y-4">
            {protocols.filter(p => !showAssignedProtocols || p.status !== 'ASSIGNED_TO_MEMBER').map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded"
                    checked={selectedProtocols.includes(protocol.id)}
                    onChange={() => handleSelectProtocol(protocol.id)}
                    disabled={protocol.isAssigned || protocol.status === 'ASSIGNED_TO_MEMBER'}
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">PROT-{protocol.id}</h3>
                    <p className="text-gray-600 mb-2">{protocol.title}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Chercheur:</span> {protocol.principalInvestigator}
                      </div>
                      <div>
                        <span className="font-medium">Institution:</span> {protocol.institution}
                      </div>
                      <div>
                        <span className="font-medium">Participants:</span> {protocol.participants}
                      </div>
                      <div>
                        <span className="font-medium">Durée:</span> {protocol.duration} mois
                      </div>
                    </div>
                  </div>
                  {protocol.isAssigned || protocol.status === 'ASSIGNED_TO_MEMBER' ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Assigné</span>
                      </div>
                      {protocol.assignedTo && (
                        <span className="text-xs text-gray-600">à {protocol.assignedTo}</span>
                      )}
                      {protocol.assignedAt && (
                        <span className="text-xs text-gray-500">
                          le {new Date(protocol.assignedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      Conforme - En attente
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {showAssignedProtocols && protocolStats.assignedProtocols.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Protocoles Assignés</h3>
                {protocolStats.assignedProtocols.map((protocol) => (
                  <div key={protocol.id} className="border border-green-200 rounded-lg p-4 mb-2 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">PROT-{protocol.id}: {protocol.title}</h4>
                        <p className="text-sm text-gray-600">Chercheur: {protocol.submitter_name}</p>
                        <p className="text-sm text-green-700">Assigné à: {protocol.member_name}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(protocol.assigned_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {protocols.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />

                Aucun protocole conforme en attente d'attribution
              </div>
            )}
          </div>
        </div>
      </div>
{/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Assigner des protocoles
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Sélectionnez les membres du comité pour les {selectedProtocols.length} protocole(s) sélectionné(s).
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Membres du comité
                    </label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`member-${member.id}`}
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => handleSelectMember(member.id)}
                              className="h-4 w-4 text-green-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`member-${member.id}`} className="font-medium text-gray-700">
                              {member.name}
                            </label>
                            <p className="text-gray-500">
                              {member.role} • {member.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAssignProtocols}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <SendIcon className="h-4 w-4 mr-1" />
                  Assigner
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProtocolAssignment;
