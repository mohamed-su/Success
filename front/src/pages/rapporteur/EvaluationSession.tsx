import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Protocol {
  id: number;
  title: string;
  principalInvestigator: string;
  assignedMembers: string[];
  protocolCode: string;
}

interface EvaluationForm {
  protocolId: number;
  memberEvaluations: { [memberId: string]: string };
  finalDecision: string;
  rapporteurComments: string;
}

const EvaluationSession: React.FC = () => {
  const { currentUser } = useAuth();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>({
    protocolId: 0,
    memberEvaluations: {},
    finalDecision: '',
    rapporteurComments: ''
  });

  useEffect(() => {
    fetchProtocolsForEvaluation();
  }, []);

  const fetchProtocolsForEvaluation = async () => {
    try {
      const response = await fetch('${BASE_URL}/rapporteur/evaluation-protocols');
      const data = await response.json();
      
      if (data.success) {
        setProtocols(data.protocols || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const openProtocolEvaluation = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setEvaluationForm({
      protocolId: protocol.id,
      memberEvaluations: {},
      finalDecision: '',
      rapporteurComments: ''
    });
  };

  const downloadProtocolPDF = async (protocolId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/protocols/${protocolId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PROT-${protocolId}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const submitEvaluation = async () => {
    try {
      const response = await fetch('${BASE_URL}/rapporteur/submit-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...evaluationForm,
          rapporteurId: currentUser?.id
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Évaluation soumise avec succès');
        setSelectedProtocol(null);
        fetchProtocolsForEvaluation();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Session d'Évaluation</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Retour
        </button>
      </div>

      {!selectedProtocol ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Protocoles à Évaluer</h2>
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{protocol.protocolCode}</h3>
                    <p className="text-gray-900">{protocol.title}</p>
                    <p className="text-sm text-gray-600">
                      Chercheur: {protocol.principalInvestigator}
                    </p>
                    <p className="text-sm text-blue-600">
                      Membres assignés: {protocol.assignedMembers.join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadProtocolPDF(protocol.id)}
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => openProtocolEvaluation(protocol)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Évaluer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Évaluation: {selectedProtocol.protocolCode}
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Informations du Protocole</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Titre:</strong> {selectedProtocol.title}</p>
                <p><strong>Chercheur:</strong> {selectedProtocol.principalInvestigator}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Avis des Membres Assignés</h3>
              {selectedProtocol.assignedMembers.map((member, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <label className="block font-medium mb-2">{member}</label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    placeholder="Avis et commentaires du membre..."
                    value={evaluationForm.memberEvaluations[member] || ''}
                    onChange={(e) => setEvaluationForm({
                      ...evaluationForm,
                      memberEvaluations: {
                        ...evaluationForm.memberEvaluations,
                        [member]: e.target.value
                      }
                    })}
                  />
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-medium mb-2">Décision Finale du Rapporteur</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="finalDecision"
                      value="APPROVED"
                      checked={evaluationForm.finalDecision === 'APPROVED'}
                      onChange={(e) => setEvaluationForm({
                        ...evaluationForm,
                        finalDecision: e.target.value
                      })}
                      className="mr-2"
                    />
                    ✅ Approuvé
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="finalDecision"
                      value="REJECTED"
                      checked={evaluationForm.finalDecision === 'REJECTED'}
                      onChange={(e) => setEvaluationForm({
                        ...evaluationForm,
                        finalDecision: e.target.value
                      })}
                      className="mr-2"
                    />
                    ❌ Rejeté
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="finalDecision"
                      value="REVISION_REQUIRED"
                      checked={evaluationForm.finalDecision === 'REVISION_REQUIRED'}
                      onChange={(e) => setEvaluationForm({
                        ...evaluationForm,
                        finalDecision: e.target.value
                      })}
                      className="mr-2"
                    />
                    🔄 Révision Requise
                  </label>
                </div>
                
                <textarea
                  className="w-full border rounded p-3"
                  rows={4}
                  placeholder="Commentaires et justification de la décision finale..."
                  value={evaluationForm.rapporteurComments}
                  onChange={(e) => setEvaluationForm({
                    ...evaluationForm,
                    rapporteurComments: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedProtocol(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitEvaluation}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={!evaluationForm.finalDecision || !evaluationForm.rapporteurComments}
              >
                Soumettre l'Évaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationSession;
