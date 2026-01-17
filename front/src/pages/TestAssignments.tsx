import React, { useState, useEffect } from 'react';

const TestAssignments: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userProtocols, setUserProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAllAssignments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('${BASE_URL}/user/all-active');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchAllAssignments = async () => {
    try {
      const response = await fetch('${BASE_URL}/president/protocols/assignments');
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchUserProtocols = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/member/protocols/assigned/${userId}`);
      const data = await response.json();
      
      console.log('Réponse pour utilisateur', userId, ':', data);
      
      if (data.success) {
        setUserProtocols(data.protocols || []);
      } else {
        setUserProtocols([]);
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setUserProtocols([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId);
    fetchUserProtocols(userId);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Test des Assignations de Protocoles
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Liste des utilisateurs */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Utilisateurs Actifs ({users.length})
          </h2>
          
          <div style={{ display: 'grid', gap: '8px' }}>
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedUser === user.id ? '#dbeafe' : 'white'
                }}
              >
                <div style={{ fontWeight: '600' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  ID: {user.id} | {user.role} | {user.username}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocoles assignés à l'utilisateur sélectionné */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Protocoles Assignés
            {selectedUser && (
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>
                {' '}pour l'utilisateur ID: {selectedUser}
              </span>
            )}
          </h2>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Chargement...
            </div>
          )}

          {!loading && selectedUser && (
            <div>
              {userProtocols.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Aucun protocole assigné à cet utilisateur
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {userProtocols.map(protocol => (
                    <div
                      key={protocol.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #d1fae5',
                        borderRadius: '6px',
                        backgroundColor: '#f0fdf4'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {protocol.protocolCode}: {protocol.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <div>Status: {protocol.status}</div>
                        <div>Assigné le: {new Date(protocol.assignedAt).toLocaleDateString('fr-FR')}</div>
                        <div>Téléchargé: {protocol.downloaded ? 'Oui' : 'Non'}</div>
                        <div>Peut éditer: {protocol.canEdit ? 'Oui' : 'Non'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!selectedUser && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
              Sélectionnez un utilisateur pour voir ses protocoles assignés
            </div>
          )}
        </div>
      </div>

      {/* Toutes les assignations */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Toutes les Assignations ({assignments.length})
        </h2>
        
        {assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            Aucune assignation trouvée
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {assignments.map((assignment, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div style={{ fontSize: '14px' }}>
                  <strong>ID:</strong> {assignment.id} | 
                  <strong> Protocole:</strong> {assignment.protocolId} | 
                  <strong> Membre:</strong> {assignment.assignedMemberId} | 
                  <strong> Assigné le:</strong> {new Date(assignment.assignedAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAssignments;
