import React, { useState, useEffect } from 'react';
import { Users, Send, FileText } from 'lucide-react';

interface Protocol {
  id: number;
  title: string;
  principalInvestigator: string;
  institution: string;
  submittedAt: string;
  verifiedAt: string;
  participants: number;
  status: string;
}

interface CommitteeMember {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

const EthicsCommittee: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(null);

useEffect(() => {
    fetchVerifiedProtocols();
    fetchCommitteeMembers();

  }, []);

  const fetchVerifiedProtocols = async () => {
    try {
const response = await fetch('${BASE_URL}/ethics-committee/protocols/verified');

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

const fetchCommitteeMembers = async () => {
    try {
      const response = await fetch('${BASE_URL}/ethics-committee/committee-members');
      const data = await response.json();
      if (data.success) {
        setCommitteeMembers(data.members);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
    }
  };

  const downloadForPresident = async () => {
    try {
      const response = await fetch('${BASE_URL}/ethics-committee/protocols/export-for-president');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protocoles-pour-president-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  const assignToMember = async (protocolId: number, memberName: string) => {
    try {
const response = await fetch(`${BASE_URL}/ethics-committee/protocols/${protocolId}/assign-to-member`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName })
      });
      
      if (response.ok) {
        alert(`Protocole assigné à ${memberName} avec succès`);
        fetchVerifiedProtocols();
      }
    } catch (error) {
      console.error('Erreur assignation:', error);
    }
  };

  const downloadProtocolForMember = async (protocolId: number) => {
    try {
const response = await fetch(`${BASE_URL}/ethics-committee/protocols/${protocolId}/export-for-member`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protocole-PROT-${protocolId}-evaluation.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion du Comité d'Éthique</h1>
        <button 
          onClick={downloadForPresident} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Envoyer au Président
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Protocoles Conformes ({protocols.length})
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
                        <span className="font-medium">Investigateur:</span> {protocol.principalInvestigator}
                      </div>
                      <div>
                        <span className="font-medium">Institution:</span> {protocol.institution}
                      </div>
                      <div>
                        <span className="font-medium">Participants:</span> {protocol.participants}
                      </div>
                      <div>
                        <span className="font-medium">Vérifié le:</span> {new Date(protocol.verifiedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Conforme</span>
                </div>
                
                <div className="flex gap-2 pt-3 border-t">
                  <div className="relative">
                    <select 
                      value={selectedMember} 
                      onChange={(e) => setSelectedMember(e.target.value)}
                      className="border rounded px-3 py-1 text-sm"
                    >
                      <option value="">Choisir un membre</option>
                      {committeeMembers.map((member) => (
<option key={member.id} value={`${member.firstName} ${member.lastName}`}>
                          {member.firstName} {member.lastName} - {member.role === 'PRESIDENT' ? 'Président' : member.role === 'RAPPORTEUR' ? 'Rapporteur' : 'Membre'}

                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => {
                        if (selectedMember) {
                          assignToMember(protocol.id, selectedMember);
                          setSelectedMember('');
                        }
                      }}
                      disabled={!selectedMember}
                      className="ml-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Users className="w-4 h-4" />
                      Assigner
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => downloadProtocolForMember(protocol.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Dossier Complet
                  </button>
                </div>
              </div>
            ))}
            
            {protocols.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun protocole conforme disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicsCommittee;
