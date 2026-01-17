import React, { useState, useEffect } from 'react';

interface AssignedProtocol {
  id: number;
  title: string;
  description: string;
  submittedAt: string;
  status: string;
  assignedAt: string;
  canEdit: boolean;
  downloaded: boolean;
  protocolCode: string;
}

const MyAssignedProtocols: React.FC = () => {
  const [protocols, setProtocols] = useState<AssignedProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    
    if (user && user.id) {
      fetchAssignedProtocols(user.id);
    } else {
      setError('Utilisateur non connecté');
      setLoading(false);
    }
  }, []);

  const fetchAssignedProtocols = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/member/protocols/assigned/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProtocols(data.protocols || []);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const markAsDownloaded = async (protocolId: number) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`${BASE_URL}/member/protocols/${protocolId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId: currentUser.id }),
      });

      const data = await response.json();
      if (data.success) {
        fetchAssignedProtocols(currentUser.id);
      }
    } catch (err) {
      console.error('Erreur lors du marquage comme téléchargé:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div>Chargement des protocoles assignés...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
        <p>Erreur: {error}</p>
        <button 
          onClick={() => currentUser?.id && fetchAssignedProtocols(currentUser.id)} 
          style={{ marginTop: '10px', padding: '8px 16px' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Mes Protocoles Assignés
        </h1>
        <p style={{ color: '#6b7280' }}>
          Vous avez {protocols.length} protocole(s) assigné(s) pour évaluation
        </p>
        {currentUser && (
          <p style={{ fontSize: '0.875rem', color: '#3b82f6', marginTop: '4px' }}>
            Connecté en tant que: {currentUser.firstName} {currentUser.lastName} (ID: {currentUser.id})
          </p>
        )}
      </div>

      {protocols.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '32px', 
          textAlign: 'center' 
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
            Aucun protocole assigné
          </h3>
          <p style={{ color: '#6b7280' }}>
            Vous n'avez actuellement aucun protocole assigné pour évaluation.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {protocols.map((protocol) => (
            <div key={protocol.id} style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: '#1e40af', fontWeight: 'bold', marginBottom: '4px' }}>
                    {protocol.protocolCode}
                  </h2>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {protocol.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    backgroundColor: protocol.downloaded ? '#10b981' : '#6b7280',
                    color: 'white'
                  }}>
                    {protocol.downloaded ? "Téléchargé" : "Non téléchargé"}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white'
                  }}>
                    {protocol.status}
                  </span>
                </div>
              </div>
              
              <p style={{ color: '#374151', marginBottom: '16px' }}>
                {protocol.description}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>📅 Soumis le: {formatDate(protocol.submittedAt)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>⏰ Assigné le: {formatDate(protocol.assignedAt)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => markAsDownloaded(protocol.id)}
                  disabled={protocol.downloaded}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: protocol.downloaded ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    cursor: protocol.downloaded ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📥 {protocol.downloaded ? "Déjà téléchargé" : "Marquer comme téléchargé"}
                </button>
                
                {protocol.canEdit && (
                  <button style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}>
                    Commencer l'évaluation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssignedProtocols;
