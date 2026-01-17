import React, { useState, useEffect } from 'react';

const SimpleAssignedProtocols: React.FC = () => {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [evaluation, setEvaluation] = useState({ decision: '', comments: '' });
  const [memberName, setMemberName] = useState<string>('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User data:', user);
    
    const name = `${user.firstName} ${user.lastName}`;
    setMemberName(name);
    
    // Forcer l'ID 4 pour le président
    const identifier = 4;
    console.log('Using identifier:', identifier);
    fetchProtocols(identifier);
  }, []);

  const fetchProtocols = async (identifier: any) => {
    try {
      console.log('Fetching protocols for:', identifier);
      const response = await fetch(`${BASE_URL}/committee-member/protocols/assigned/${identifier}`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setProtocols(data.protocols || []);
      } else {
        setError(data.error || 'Aucun protocole assigné');
        setProtocols([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const openProtocolDetails = async (protocolId: number) => {
    const protocol = protocols.find(p => p.id === protocolId);
    if (protocol) {
      setSelectedProtocol(protocol);
      setShowModal(true);
    }
  };

  const submitEvaluation = async () => {
    if (!evaluation.decision || !evaluation.comments.trim()) {
      alert('Veuillez sélectionner une décision et ajouter des commentaires');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${BASE_URL}/committee-member/protocols/${selectedProtocol.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName,
          decision: evaluation.decision,
          comments: evaluation.comments
        })
      });

      if (response.ok) {
        setShowModal(false);
        setEvaluation({ decision: '', comments: '' });
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && (user.id || user.username)) {
          const identifier = user.id || user.username;
          fetchProtocols(identifier);
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ASSIGNED_TO_MEMBER':
        return 'bg-blue-100 text-blue-800';
      case 'COMMITTEE_APPROVED':
        return 'bg-green-100 text-green-800';
      case 'COMMITTEE_REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ASSIGNED_TO_MEMBER':
        return 'À évaluer';
      case 'COMMITTEE_APPROVED':
        return 'Approuvé';
      case 'COMMITTEE_REJECTED':
        return 'Rejeté';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des protocoles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Protocoles Assignés pour Évaluation</h1>
        <div className="text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {protocols.length} protocole(s)
          </span>
        </div>
      </div>

      {protocols.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-500">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun protocole assigné
            </h3>
            <p className="text-gray-500">
              Vous n'avez actuellement aucun protocole assigné pour évaluation.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {protocols.map(protocol => (
                <div key={protocol.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-blue-900">
                        PROT-{protocol.id}
                      </h3>
                      <p className="text-gray-900 font-medium mb-2">{protocol.title}</p>
                      <p className="text-gray-600 mb-3">{protocol.description}</p>
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
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusBadge(protocol.status)}`}>
                        {getStatusText(protocol.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => openProtocolDetails(protocol.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Examiner le Protocole
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'évaluation */}
      {showModal && selectedProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">PROT-{selectedProtocol.id}: {selectedProtocol.title}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Chercheur principal:</strong> {selectedProtocol.principalInvestigator}</p>
                  <p><strong>Institution:</strong> {selectedProtocol.institution}</p>
                  <p><strong>Participants:</strong> {selectedProtocol.participants}</p>
                  <p><strong>Durée:</strong> {selectedProtocol.duration} mois</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedProtocol.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Considérations éthiques</h3>
                <p className="text-gray-700">{selectedProtocol.ethicalConsiderations || 'Non spécifiées'}</p>
              </div>
            </div>

            {selectedProtocol.status === 'ASSIGNED_TO_MEMBER' && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Évaluation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Décision</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="decision"
                          value="APPROVED"
                          checked={evaluation.decision === 'APPROVED'}
                          onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})}
                          className="mr-2"
                        />
                        Approuver
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="decision"
                          value="REJECTED"
                          checked={evaluation.decision === 'REJECTED'}
                          onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})}
                          className="mr-2"
                        />
                        Rejeter
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Commentaires *</label>
                    <textarea
                      value={evaluation.comments}
                      onChange={(e) => setEvaluation({...evaluation, comments: e.target.value})}
                      className="w-full border rounded p-2 h-24"
                      placeholder="Veuillez justifier votre décision..."
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={submitEvaluation}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Soumettre l'évaluation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAssignedProtocols;
