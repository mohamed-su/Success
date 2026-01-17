import React, { useState, useEffect } from 'react';
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react';

interface Protocol {
  id: number;
  title: string;
  description: string;
  principalInvestigator: string;
  institution: string;
  participants: number;
  duration: number;
  ethicsConsiderations: string;
  status: string;
  verificationComments: string;
}

const MyAssignedProtocols: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState({ decision: '', comments: '' });
  
  // Simuler le nom du membre connecté (à remplacer par l'authentification réelle)
  const memberName = "Dr. Martin Dubois - Médecin";

  useEffect(() => {
    fetchAssignedProtocols();
  }, []);

  const fetchAssignedProtocols = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/committee-member/protocols/assigned/${encodeURIComponent(memberName)}`);
      const data = await response.json();
      if (data.success) {
        setProtocols(data.protocols);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewProtocol = async (protocolId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/committee-member/protocols/${protocolId}?memberName=${encodeURIComponent(memberName)}`);
      const data = await response.json();
      if (data.success) {
        setSelectedProtocol(data.protocol);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const submitEvaluation = async () => {
    if (!selectedProtocol || !evaluation.decision || !evaluation.comments) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/committee-member/protocols/${selectedProtocol.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName,
          decision: evaluation.decision,
          comments: evaluation.comments
        })
      });
      
      if (response.ok) {
        alert('Évaluation enregistrée avec succès');
        setSelectedProtocol(null);
        setEvaluation({ decision: '', comments: '' });
        fetchAssignedProtocols();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Protocoles Assignés</h1>
        <div className="text-sm text-gray-600">
          Membre: {memberName}
        </div>
      </div>

      {/* Liste des protocoles assignés */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Protocoles à Évaluer ({protocols.length})
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
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
                  <div className="flex flex-col gap-2">
                    {protocol.status === 'ASSIGNED_TO_MEMBER' ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        À évaluer
                      </span>
                    ) : protocol.status === 'COMMITTEE_APPROVED' ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Approuvé
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        Rejeté
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <button 
                    onClick={() => viewProtocol(protocol.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Examiner le Protocole
                  </button>
                </div>
              </div>
            ))}
            
            {protocols.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun protocole assigné pour le moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails du protocole */}
      {selectedProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Évaluation du Protocole PROT-{selectedProtocol.id}</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Détails du protocole */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Informations Générales</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Titre:</strong> {selectedProtocol.title}</p>
                  <p><strong>Chercheur Principal:</strong> {selectedProtocol.principalInvestigator}</p>
                  <p><strong>Institution:</strong> {selectedProtocol.institution}</p>
                  <p><strong>Participants:</strong> {selectedProtocol.participants}</p>
                  <p><strong>Durée:</strong> {selectedProtocol.duration} mois</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Description du Projet</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p>{selectedProtocol.description}</p>
                </div>
              </div>

              {selectedProtocol.ethicsConsiderations && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Considérations Éthiques</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>{selectedProtocol.ethicsConsiderations}</p>
                  </div>
                </div>
              )}

              {/* Formulaire d'évaluation */}
              {selectedProtocol.status === 'ASSIGNED_TO_MEMBER' && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Votre Évaluation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Décision</label>
                      <select 
                        value={evaluation.decision}
                        onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Sélectionner une décision</option>
                        <option value="APPROVED">Approuver le protocole</option>
                        <option value="REJECTED">Rejeter le protocole</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Commentaires et Justification</label>
                      <textarea 
                        value={evaluation.comments}
                        onChange={(e) => setEvaluation({...evaluation, comments: e.target.value})}
                        className="w-full border rounded px-3 py-2 h-32"
                        placeholder="Veuillez justifier votre décision..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-end gap-2">
              <button 
                onClick={() => setSelectedProtocol(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Fermer
              </button>
              {selectedProtocol.status === 'ASSIGNED_TO_MEMBER' && (
                <button 
                  onClick={submitEvaluation}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Soumettre l'Évaluation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignedProtocols;
