import React, { useState } from 'react';

const EvaluationGridsButton = ({ protocolId }) => {
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchGrids = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/evaluation/protocol/${protocolId}/grids`);
      const data = await response.json();
      if (data.success) {
        setGrids(data.grids);
        setShowModal(true);
      } else {
        alert('Erreur lors de la récupération des grilles');
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => status === 'COMPLETED' ? '#28a745' : '#ffc107';
  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'APPROVE': return '#28a745';
      case 'REJECT': return '#dc3545';
      case 'MINOR_REVISION': return '#ffc107';
      case 'MAJOR_REVISION': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  return (
    <>
      <button 
        onClick={fetchGrids}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#17a2b8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginLeft: '8px'
        }}
      >
        {loading ? 'Chargement...' : 'Grilles d\'Évaluations'}
      </button>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            maxWidth: '800px', maxHeight: '80vh', overflow: 'auto', width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Grilles d'Évaluation ({grids.length})</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            {grids.length === 0 ? (
              <p>Aucune grille d'évaluation trouvée.</p>
            ) : (
              grids.map(grid => (
                <div key={grid.id} style={{
                  border: '1px solid #ddd', borderRadius: '8px', padding: '16px',
                  marginBottom: '16px', backgroundColor: grid.status === 'COMPLETED' ? '#f8f9fa' : '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4>Évaluateur: {grid.memberName || 'Non défini'}</h4>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px',
                      backgroundColor: getStatusColor(grid.status),
                      color: 'white', fontSize: '12px'
                    }}>
                      {grid.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div><strong>Score moyen:</strong> {grid.averageScore ? grid.averageScore.toFixed(2) : 'N/A'}/5</div>
                    <div>
                      <strong>Décision:</strong> 
                      <span style={{ color: getDecisionColor(grid.decision), fontWeight: 'bold', marginLeft: '8px' }}>
                        {grid.decision || 'En attente'}
                      </span>
                    </div>
                    <div><strong>Assigné le:</strong> {new Date(grid.assignedAt).toLocaleDateString()}</div>
                    {grid.completedAt && <div><strong>Complété le:</strong> {new Date(grid.completedAt).toLocaleDateString()}</div>}
                  </div>

                  {grid.generalComments && (
                    <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                      <strong>Commentaires:</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{grid.generalComments}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluationGridsButton;