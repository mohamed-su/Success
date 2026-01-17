import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import EvaluationModal from '../components/evaluation/EvaluationModal';

interface AssignedProtocol {
  id: number;
  title: string;
  description: string;
  principalInvestigator: string;
  institution: string;
  participants: number;
  duration: number;
  status: string;
  submittedAt: string;
  assignedAt: string;
  canEdit: boolean;
  downloaded: boolean;
  protocolCode: string;
  ethicalConsiderations?: string;
}

const UnifiedAssignedProtocols: React.FC = () => {
  const { currentUser } = useAuth();
  const [protocols, setProtocols] = useState<AssignedProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedProtocol, setSelectedProtocol] = useState<AssignedProtocol | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      fetchAssignedProtocols();
    } else {
      setError('Utilisateur non authentifié');
      setLoading(false);
    }
  }, [currentUser]);

  const fetchAssignedProtocols = async () => {
    try {
      setLoading(true);
      
      console.log('Utilisateur actuel:', currentUser);
      console.log('Rôle utilisateur:', currentUser?.role);
      
      // Utiliser le service API au lieu d'un appel direct
      const response = await apiService.getMyProtocols();
      
      console.log('Réponse du service API:', response);
      
      if (response.success) {
        const protocols = response.data?.protocols || response.data || [];
        console.log('Protocoles reçus:', protocols.length);
        setProtocols(protocols);
      } else {
        console.error('Erreur service API:', response.error);
        setError(response.error || 'Aucun protocole assigné');
        setProtocols([]);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const openProtocolDetails = (protocol: AssignedProtocol) => {
    setSelectedProtocol(protocol);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ASSIGNED_TO_MEMBER': return 'bg-blue-100 text-blue-800';
      case 'COMMITTEE_APPROVED': return 'bg-green-100 text-green-800';
      case 'COMMITTEE_REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ASSIGNED_TO_MEMBER': return 'À évaluer';
      case 'COMMITTEE_APPROVED': return 'Approuvé';
      case 'COMMITTEE_REJECTED': return 'Rejeté';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des protocoles assignés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
          <button onClick={fetchAssignedProtocols} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mes Protocoles Assignés</h1>
          <p className="text-gray-600 mt-1">
            Connecté en tant que: {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.role})
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchAssignedProtocols} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200">
            🔄 Actualiser
          </button>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            {protocols.length} protocole(s)
          </span>
        </div>
      </div>

      {protocols.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-500">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun protocole assigné</h3>
            <p className="text-gray-500">Vous n'avez actuellement aucun protocole assigné pour évaluation.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {protocols.map((protocol) => (
                <div key={protocol.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-blue-900">{protocol.protocolCode}</h3>
                      <p className="text-gray-900 font-medium mb-2">{protocol.title}</p>
                      <p className="text-gray-600 mb-3">{protocol.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Chercheur:</span> {protocol.principalInvestigator}</div>
                        <div><span className="font-medium">Institution:</span> {protocol.institution}</div>
                        <div><span className="font-medium">Participants:</span> {protocol.participants}</div>
                        <div><span className="font-medium">Durée:</span> {protocol.duration} mois</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusBadge(protocol.status)}`}>
                        {getStatusText(protocol.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-sm text-gray-500">
                      <span>Assigné le: {formatDate(protocol.assignedAt)}</span>
                    </div>
                    <button onClick={() => openProtocolDetails(protocol)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Évaluer le Protocole
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showModal && selectedProtocol && (
        <EvaluationModal 
          protocol={selectedProtocol} 
          currentUser={currentUser} 
          onClose={() => setShowModal(false)} 
          onSaved={fetchAssignedProtocols}
        />
      )}
    </div>
  );
};

export default UnifiedAssignedProtocols;
