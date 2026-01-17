import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

interface Protocol {
  id: number;
  title: string;
  principalInvestigator: string;
  institution: string;
  participants: number;
  duration: number;
  status: string;
  isAssigned: boolean;
  isassigned?: boolean; // Backend utilise minuscules
  assignedMembers?: string;
  assignedmembers?: string; // Backend utilise minuscules
}

interface Assignment {
  id: number;
  protocol_id: number;
  assigned_member_id: number;
  assigned_at: string;
  memberName: string;
  memberRole: string;
}

interface Member {
  id: number;
  name: string;
  role: string;
  username: string;
  active: boolean;
}

const AutoProtocolAssignment: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<{[key: number]: Assignment[]}>({});
  const [loading, setLoading] = useState(true);
  const [selectedProtocols, setSelectedProtocols] = useState<number[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/president/auto-assignment/protocols-with-status`, {
        headers: {
          'X-User-ID': localStorage.getItem('userId') || '',
          'X-User-Role': localStorage.getItem('userRole') || ''
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Normaliser les données du backend
        const normalizedProtocols = data.protocols.map((p: any) => ({
          ...p,
          isAssigned: p.isassigned || p.isAssigned,
          assignedMembers: p.assignedmembers || p.assignedMembers
        }));
        
        setProtocols(normalizedProtocols);
        setMembers(data.members);
        
        // Récupérer les assignations pour chaque protocole assigné
        const assignedProtocols = data.protocols.filter((p: Protocol) => p.isAssigned);
        const assignmentPromises = assignedProtocols.map((protocol: Protocol) => 
          fetchProtocolAssignments(protocol.id)
        );
        
        const assignmentResults = await Promise.all(assignmentPromises);
        const assignmentsMap: {[key: number]: Assignment[]} = {};
        
        assignmentResults.forEach((result, index) => {
          if (result.success) {
            assignmentsMap[assignedProtocols[index].id] = result.assignments;
          }
        });
        
        setAssignments(assignmentsMap);
      } else {
        setMessage('Erreur: ' + data.error);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const fetchProtocolAssignments = async (protocolId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/president/protocols/${protocolId}/assignments`, {
        headers: {
          'X-User-ID': localStorage.getItem('userId') || '',
          'X-User-Role': localStorage.getItem('userRole') || ''
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, assignments: [] };
    }
  };

  const handleSelectProtocol = (id: number) => {
    const protocol = protocols.find(p => p.id === id);
    if (protocol?.isAssigned && protocol.assignedMembers) {
      setMessage(`Le protocole PROT-${id} est déjà assigné à: ${protocol.assignedMembers}`);
      return;
    }

    if (selectedProtocols.includes(id)) {
      setSelectedProtocols(selectedProtocols.filter(pid => pid !== id));
    } else {
      setSelectedProtocols([...selectedProtocols, id]);
    }
  };

  const handleSelectMember = (id: number) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(mid => mid !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const openAssignModal = () => {
    const availableProtocols = selectedProtocols.filter(id => {
      const protocol = protocols.find(p => p.id === id);
      return protocol && !protocol.isAssigned;
    });

    if (availableProtocols.length === 0) {
      setMessage('Aucun protocole disponible sélectionné');
      return;
    }

    setSelectedProtocols(availableProtocols);
    setShowModal(true);
  };

  const handleBulkAssign = async () => {
    if (selectedMembers.length === 0) {
      setMessage('Veuillez sélectionner au moins un membre');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/president/auto-assignment/bulk-assign`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '',
          'X-User-Role': localStorage.getItem('userRole') || ''
        },
        body: JSON.stringify({
          protocolIds: selectedProtocols,
          memberIds: selectedMembers
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(result.message);
        setShowModal(false);
        setSelectedProtocols([]);
        setSelectedMembers([]);
        fetchData(); // Actualiser les données
      } else {
        setMessage('Erreur: ' + result.error);
      }
    } catch (error) {
      setMessage('Erreur lors de l\'assignation');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Chargement...</div>
      </div>
    );
  }

  const availableProtocols = protocols.filter(p => !p.isAssigned);
  const assignedProtocols = protocols.filter(p => p.isAssigned);

  console.log('Protocoles disponibles:', availableProtocols.length);
  console.log('Protocoles assignés:', assignedProtocols.length);
  console.log('Protocoles avec noms:', protocols.map(p => ({ id: p.id, isAssigned: p.isAssigned, assignedMembers: p.assignedMembers })));
  console.log('Données reçues:', { protocols, members });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Attribution Automatique des Protocoles</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={fetchData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Actualiser
          </button>
          <span style={{ padding: '4px 8px', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
            {availableProtocols.length} disponibles
          </span>
          <span style={{ padding: '4px 8px', backgroundColor: '#d1fae5', borderRadius: '4px' }}>
            {assignedProtocols.length} assignés
          </span>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '4px'
        }}>
          {message}
          <button
            onClick={() => setMessage('')}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {selectedProtocols.length > 0 && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#d1fae5',
          border: '1px solid #10b981',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{selectedProtocols.length} protocole(s) sélectionné(s)</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={openAssignModal}
              style={{
                padding: '6px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Assigner
            </button>
            <button
              onClick={() => setSelectedProtocols([])}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Protocoles Disponibles ({availableProtocols.length})
          </h2>
          
          {availableProtocols.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
              Aucun protocole disponible pour assignation
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {availableProtocols.map(protocol => (
                <div key={protocol.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedProtocols.includes(protocol.id)}
                    onChange={() => handleSelectProtocol(protocol.id)}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>
                      PROT-{protocol.id}: {protocol.title}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <p>Chercheur: {protocol.principalInvestigator}</p>
                      <p>Institution: {protocol.institution}</p>
                      <p>Participants: {protocol.participants} | Durée: {protocol.duration} mois</p>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    Disponible
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {assignedProtocols.length > 0 ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Protocoles Assignés ({assignedProtocols.length})
            </h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {assignedProtocols.map(protocol => (
                <div key={protocol.id} style={{
                  border: '1px solid #d1fae5',
                  borderRadius: '6px',
                  padding: '16px',
                  backgroundColor: '#f0fdf4'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>
                        PROT-{protocol.id}: {protocol.title}
                      </h3>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <p>Chercheur: {protocol.principalInvestigator}</p>
                        {protocol.assignedMembers && protocol.assignedMembers !== 'Aucun membre assigné' && (
                          <p><strong>Assigné à:</strong> {protocol.assignedMembers}</p>
                        )}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      ✓ Assigné
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Protocoles Assignés (0)
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
              Aucun protocole assigné
            </p>
          </div>
        )}
      </div>

      {/* Modal d'assignation */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Assigner {selectedProtocols.length} protocole(s)
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Sélectionner les membres du comité:
              </h4>
              <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px' }}>
                {members.map(member => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>{member.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {member.role} • {member.username}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleBulkAssign}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Assigner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoProtocolAssignment;
