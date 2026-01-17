import React, { useState, useEffect } from 'react';

const AssignmentDebug: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAllAssignments();
  }, []);

  const loadAllAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('${BASE_URL}/debug/assignments/all');
      const data = await response.json();
      
      console.log('Debug assignments response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        setAssignments(data.assignments);
        setMessage(`${data.totalAssignments} assignations trouvées dans la base de données`);
      } else {
        setMessage('Erreur: ' + data.error);
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const checkUserAssignments = async (userId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/debug/assignments/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        alert(`${data.userName} (${data.userRole}) a ${data.assignmentCount} protocole(s) assigné(s)`);
      }
    } catch (error) {
      alert('Erreur de vérification');
    }
  };

  const clearAllAssignments = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les assignations ?')) return;
    
    try {
      const response = await fetch('${BASE_URL}/debug/assignments/clear', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        loadAllAssignments();
      }
    } catch (error) {
      setMessage('Erreur lors de la suppression');
    }
  };

  const reassignProtocol = async (protocolId: number, newMemberId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/debug/assignments/reassign/${protocolId}/${newMemberId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        loadAllAssignments();
      }
    } catch (error) {
      setMessage('Erreur lors de la réassignation');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Debug des Assignations de Protocoles
      </h1>

      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#dbeafe',
          border: '1px solid #3b82f6',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={loadAllAssignments}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Chargement...' : '🔄 Actualiser'}
        </button>
        
        <button
          onClick={() => checkUserAssignments(4)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Vérifier Président (ID: 4)
        </button>
        
        <button
          onClick={() => checkUserAssignments(5)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Vérifier Membre1 (ID: 5)
        </button>
        
        <button
          onClick={clearAllAssignments}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Supprimer Toutes les Assignations
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Assignations Actuelles ({assignments.length})
        </h2>
        
        {assignments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            Aucune assignation trouvée dans la base de données
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {assignments.map((assignment, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  border: '1px solid #d1fae5',
                  borderRadius: '6px',
                  backgroundColor: '#f0fdf4'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {assignment.protocolTitle || `Protocole ID: ${assignment.protocolId}`}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <div><strong>Code:</strong> PROT-{assignment.protocolId}</div>
                      <div><strong>Assigné à:</strong> {assignment.memberName} ({assignment.memberRole})</div>
                      <div><strong>Membre ID:</strong> {assignment.assignedMemberId}</div>
                      <div><strong>Status:</strong> {assignment.protocolStatus}</div>
                      <div><strong>Assigné le:</strong> {new Date(assignment.assignedAt).toLocaleDateString('fr-FR')}</div>
                      <div><strong>Téléchargé:</strong> {assignment.downloaded ? 'Oui' : 'Non'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => reassignProtocol(assignment.protocolId, 4)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      → Président
                    </button>
                    <button
                      onClick={() => reassignProtocol(assignment.protocolId, 5)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      → Membre1
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDebug;
