import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const AssignedProtocols: React.FC = () => {
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState<AssignedProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const memberId = currentUser?.id;
  
  // Vérifier si l'utilisateur est connecté
  if (!currentUser || !memberId) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Accès non autorisé</h2>
        <p>Veuillez vous connecter pour accéder à cette page.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{ padding: '8px 16px', marginTop: '16px' }}
        >
          Se connecter
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetchAssignedProtocols();
  }, []);

  const fetchAssignedProtocols = async () => {
    try {
      const response = await fetch(`${BASE_URL}/member/protocols/assigned/${memberId}`);
      const data = await response.json();
      
      if (data.success) {
        setProtocols(data.protocols);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const markAsDownloaded = async (protocolId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/member/protocols/${protocolId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });

      const data = await response.json();
      if (data.success) {
        fetchAssignedProtocols();
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
        <button onClick={fetchAssignedProtocols} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Protocoles Assignés
        </h1>
        <p style={{ color: '#6b7280' }}>
          Vous avez {protocols.length} protocole(s) assigné(s) pour évaluation
        </p>
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
                
                <button 
                  onClick={() => window.open(`${BASE_URL}/evaluation/form/${protocol.id}`, '_blank')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📋 Évaluer protocole
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedProtocols;
