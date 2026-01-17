import React, { useState, useEffect } from 'react';
import { FileText, Download, MessageSquare, CheckCircle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { usePermissions } from '../../hooks/useRoleBasedData';
import DataProtection from '../../components/common/DataProtection';

interface AssignedProtocol {
  id: number;
  title: string;
  principalInvestigator: string;
  institution: string;
  participants: number;
  duration: number;
  assignedAt: string;
  status: string;
  canEdit: boolean;
}

const AssignedProtocols: React.FC = () => {
  const { addNotification } = useNotifications();
  const { hasPermission, currentUser } = usePermissions();
  const [protocols, setProtocols] = useState<AssignedProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [savedComments, setSavedComments] = useState<{[key: number]: string}>({});
  
  // Charger les commentaires sauvegardés au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('protocol-comments');
    if (saved) {
      try {
        setSavedComments(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur lors du chargement des commentaires:', e);
      }
    }
  }, []);

  // Vérifier les permissions d'accès
  if (!hasPermission(['committee', 'committee_member', 'rapporteur', 'president'], 'view_assigned_protocols')) {
    return (
      <DataProtection requiredRole="committee" resource="view_assigned_protocols">
        <div></div>
      </DataProtection>
    );
  }
  
  // Sauvegarder automatiquement les commentaires
  const saveCommentsLocally = (protocolId: number, text: string) => {
    const updated = { ...savedComments, [protocolId]: text };
    setSavedComments(updated);
    localStorage.setItem('protocol-comments', JSON.stringify(updated));
  };

  useEffect(() => {
    fetchAssignedProtocols();
  }, []);

  const fetchAssignedProtocols = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('${BASE_URL}/member/protocols/assigned', {
        headers: {
          'X-User-ID': currentUser?.id?.toString() || '',
          'X-User-Role': currentUser?.role || '',
          'X-User-Username': currentUser?.username || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedProtocols = data.protocols.map((p: any) => ({
            id: p.id,
            title: p.title,
            principalInvestigator: p.principalInvestigator,
            institution: p.institution,
            participants: p.participants,
            duration: p.duration,
            assignedAt: p.assignedAt,
            status: p.status,
            canEdit: true
          }));
          setProtocols(formattedProtocols);
        }
      } else {
        // Fallback vers les données mock si le backend n'est pas disponible
        const mockProtocols: AssignedProtocol[] = [];
        
        // Ajouter des protocoles de test selon l'utilisateur connecté
        if (currentUser?.id === 10) {
          // Dr. Amadou OUEDRAOGO
          mockProtocols.push({
            id: 1,
            title: "Étude sur l'efficacité des traitements antipaludiques",
            principalInvestigator: "Dr. Marie Ouattara",
            institution: "CHU-YO",
            participants: 200,
            duration: 18,
            assignedAt: "2024-01-20T10:00:00Z",
            status: "ASSIGNED",
            canEdit: true
          });
        } else if (currentUser?.id === 11) {
          // Dr. Fatimata KONE
          mockProtocols.push({
            id: 2,
            title: "Recherche sur la malnutrition infantile",
            principalInvestigator: "Prof. Jean Kaboré",
            institution: "IRSS",
            participants: 150,
            duration: 24,
            assignedAt: "2024-01-22T14:30:00Z",
            status: "ASSIGNED",
            canEdit: true
          });
        } else if (currentUser?.id === 12) {
          // Prof. Jean SAWADOGO
          mockProtocols.push({
            id: 3,
            title: "Impact des changements climatiques sur la santé",
            principalInvestigator: "Dr. Aminata Sana",
            institution: "Université Joseph Ki-Zerbo",
            participants: 300,
            duration: 36,
            assignedAt: "2024-01-25T09:15:00Z",
            status: "ASSIGNED",
            canEdit: true
          });
        }
        
        setProtocols(mockProtocols);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      addNotification({
        title: 'Erreur',
        message: 'Impossible de charger les protocoles assignés'
      });
      setLoading(false);
    }
  };

  const handleDownload = async (protocolId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/files/view-by-protocol/${protocolId}/protocol`, {
        headers: {
          'X-User-ID': currentUser?.id?.toString() || '',
          'X-User-Role': currentUser?.role || '',
          'X-User-Username': currentUser?.username || ''
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Protocole_PROT-${protocolId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addNotification({
          title: 'Téléchargement réussi',
          message: `Protocole PROT-${protocolId} téléchargé avec succès`
        });
      } else {
        throw new Error('Erreur de téléchargement');
      }
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      addNotification({
        title: 'Erreur',
        message: 'Erreur lors du téléchargement. Fichier non disponible.'
      });
    }
  };
  
  const handleViewProtocol = (protocolId: number) => {
    // Ouvrir le protocole dans un nouvel onglet
    const viewUrl = `${BASE_URL}/files/view-by-protocol/${protocolId}/protocol`;
    window.open(viewUrl, '_blank');
  };
  
  const handleViewDocuments = (protocolId: number) => {
    // Ouvrir les documents dans des onglets séparés
    window.open(`${BASE_URL}/files/view-by-protocol/${protocolId}/protocol`, '_blank');
    window.open(`${BASE_URL}/files/view-by-protocol/${protocolId}/consent`, '_blank');
    window.open(`${BASE_URL}/files/view-by-protocol/${protocolId}/cv`, '_blank');
    window.open(`${BASE_URL}/files/view-by-protocol/${protocolId}/receipt`, '_blank');
  };

  const handleSubmitComments = async (protocolId: number) => {
    if (!comments.trim()) {
      addNotification({
        title: 'Commentaires requis',
        message: 'Veuillez saisir vos commentaires avant de soumettre.'
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/member/protocols/${protocolId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': currentUser?.id?.toString() || '',
          'X-User-Role': currentUser?.role || '',
          'X-User-Username': currentUser?.username || ''
        },
        body: JSON.stringify({
          comments: comments,
          decision: 'REVIEWED'
        })
      });
      
      if (response.ok) {
        addNotification({
          title: 'Commentaires soumis',
          message: `Vos commentaires pour le protocole PROT-${protocolId} ont été soumis avec succès.`
        });
      } else {
        throw new Error('Erreur lors de la soumission');
      }
      
      setSelectedProtocol(null);
      setComments('');
      fetchAssignedProtocols();
    } catch (error) {
      console.error('Erreur soumission:', error);
      addNotification({
        title: 'Erreur',
        message: 'Erreur lors de la soumission des commentaires'
      });
    }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Chargement des protocoles assignés...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Protocoles Assignés</h1>
        <div className="text-sm text-gray-600">
          {protocols.length} protocole(s) assigné(s)
          {currentUser && (
            <span className="ml-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Connecté: {currentUser.firstName} {currentUser.lastName} ({currentUser.role})
            </span>
          )}
        </div>
      </div>

      {/* Liste des protocoles assignés */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Protocoles à Réviser
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-blue-800">PROT-{protocol.id}</h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        À réviser
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium mb-3">{protocol.title}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Chercheur principal:</span>
                          <p className="text-gray-900">{protocol.principalInvestigator}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Institution:</span>
                          <p className="text-gray-900">{protocol.institution}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Participants:</span>
                          <p className="text-gray-900">{protocol.participants} personnes</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Durée prévue:</span>
                          <p className="text-gray-900">{protocol.duration} mois</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="font-medium text-gray-700">Assigné le:</span>
                        <span className="text-gray-900 ml-2">{new Date(protocol.assignedAt).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleViewProtocol(protocol.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Protocole complet (PDF)
                      </button>
                      <button
                        onClick={() => handleDownload(protocol.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </button>
                      <button
                        onClick={() => handleViewDocuments(protocol.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md shadow-sm text-green-700 bg-green-50 hover:bg-green-100"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Documents soumis
                      </button>
                    </div>
                    
                    {protocol.canEdit && (
                      <button
                        onClick={() => {
                          setSelectedProtocol(protocol.id);
                          setComments(savedComments[protocol.id] || '');
                        }}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                          savedComments[protocol.id] ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {savedComments[protocol.id] ? 'Modifier commentaires' : 'Ajouter commentaires'}
                        {savedComments[protocol.id] && (
                          <span className="ml-1 bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      📝 <strong>Instructions:</strong> Consultez le protocole, analysez les aspects éthiques et ajoutez vos commentaires pour la délibération.
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {protocols.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                Aucun protocole assigné pour le moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de commentaires */}
      {selectedProtocol && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Ajouter des commentaires
                    </h3>
                    <div className="mt-2">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Protocole PROT-{selectedProtocol}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Vos commentaires seront utilisés lors de la session de délibération du comité d'éthique
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commentaires pour la délibération
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => {
                          setComments(e.target.value);
                          if (selectedProtocol) {
                            const updated = { ...savedComments, [selectedProtocol]: e.target.value };
                            setSavedComments(updated);
                            localStorage.setItem('protocol-comments', JSON.stringify(updated));
                          }
                        }}
                        rows={6}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Saisissez vos commentaires détaillés sur ce protocole de recherche. Ces commentaires seront utilisés lors de la session de délibération du comité d'éthique..."
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        💡 <strong>Conseil :</strong> Incluez vos observations sur :
                        <ul className="list-disc list-inside mt-1 ml-2">
                          <li>Aspects éthiques et respect des participants</li>
                          <li>Méthodologie et faisabilité de l'étude</li>
                          <li>Conformité aux standards de recherche</li>
                          <li>Risques et bénéfices pour les participants</li>
                        </ul>
                      </div>
                      <div className="mt-2 text-xs text-green-600">
                        ✓ Vos commentaires sont automatiquement sauvegardés localement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleSubmitComments(selectedProtocol)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Soumettre
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProtocol(null);
                    setComments('');
                  }}
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


export default AssignedProtocols;
