import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface Protocol {
  id: number;
  title: string;
  protocolCode: string;
  principalInvestigator: string;
  status: string;
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

const QuickAssignment: React.FC = () => {
  const { currentUser } = useAuth();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProtocols();
    fetchMembers();
  }, []);

  const fetchProtocols = async () => {
    try {
      const response = await apiService.getMyProtocols();
      if (response.success) {
        setProtocols(response.data?.protocols || response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await apiService.getUsers();
      if (response.success) {
        setMembers(response.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedProtocol || selectedMembers.length === 0) {
      alert('Veuillez sélectionner un protocole et au moins un membre');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.assignProtocolToMultipleMembers(selectedProtocol, selectedMembers);
      if (response.success) {
        alert(`Protocole assigné avec succès à ${selectedMembers.length} membre(s)`);
        setSelectedProtocol(null);
        setSelectedMembers([]);
        fetchProtocols();
      } else {
        alert('Erreur: ' + response.error);
      }
    } catch (error) {
      alert('Erreur lors de l\'assignation');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId: number) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  if (currentUser?.role?.toLowerCase() !== 'president' && currentUser?.role?.toLowerCase() !== 'admin') {
    return <div className="p-4 text-red-600">Accès réservé aux présidents et administrateurs</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Assignation Rapide</h2>
      
      {/* Sélection du protocole */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Protocole à assigner:</label>
        <select 
          value={selectedProtocol || ''} 
          onChange={(e) => setSelectedProtocol(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un protocole</option>
          {protocols.map(protocol => (
            <option key={protocol.id} value={protocol.id}>
              {protocol.protocolCode} - {protocol.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sélection des membres */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Membres du comité:</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
          {members.map(member => (
            <label key={member.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member.id)}
                onChange={() => toggleMember(member.id)}
                className="rounded"
              />
              <span className="text-sm">
                {member.firstName} {member.lastName} ({member.role})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bouton d'assignation */}
      <button
        onClick={handleAssign}
        disabled={loading || !selectedProtocol || selectedMembers.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Assignation en cours...' : `Assigner à ${selectedMembers.length} membre(s)`}
      </button>

      {/* Résumé */}
      {selectedProtocol && selectedMembers.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>Protocole:</strong> {protocols.find(p => p.id === selectedProtocol)?.protocolCode}<br/>
            <strong>Membres sélectionnés:</strong> {selectedMembers.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickAssignment;
