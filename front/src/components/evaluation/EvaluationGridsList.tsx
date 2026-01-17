import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, Calendar, User } from 'lucide-react';

const EvaluationGridsList = ({ protocolId }) => {
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvaluationGrids();
  }, [protocolId]);

  const fetchEvaluationGrids = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/protocol-evaluation/protocol/${protocolId}/grids`);
      const data = await response.json();
      
      if (data.success) {
        setGrids(data.grids);
      } else {
        setError(data.error || 'Erreur lors du chargement des grilles');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (gridId, memberName) => {
    try {
      const response = await fetch(`/api/protocol-evaluation/grid/${gridId}/pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evaluation_${memberName.replace(' ', '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement du PDF');
      }
    } catch (err) {
      alert('Erreur lors du téléchargement: ' + err.message);
    }
  };

  const generatePdf = async (gridId) => {
    try {
      const response = await fetch(`/api/protocol-evaluation/grid/${gridId}/generate-pdf`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('PDF généré avec succès!');
        fetchEvaluationGrids(); // Recharger la liste
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      alert('Erreur lors de la génération: ' + err.message);
    }
  };

  const getDecisionBadge = (decision) => {
    const badges = {
      'APPROVE': { text: 'Approuvé', class: 'bg-green-100 text-green-800' },
      'REJECT': { text: 'Rejeté', class: 'bg-red-100 text-red-800' },
      'MINOR_REVISION': { text: 'Révisions mineures', class: 'bg-yellow-100 text-yellow-800' },
      'MAJOR_REVISION': { text: 'Révisions majeures', class: 'bg-orange-100 text-orange-800' }
    };
    
    const badge = badges[decision] || { text: decision, class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des grilles d'évaluation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (grids.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune grille d'évaluation</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucune grille d'évaluation n'a été soumise pour ce protocole.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Grilles d'Évaluation ({grids.length})
          </h3>
          
          <div className="space-y-4">
            {grids.map((grid) => (
              <div key={grid.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {grid.memberName}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(grid.submittedAt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Score moyen: {grid.averageScore?.toFixed(1) || 'N/A'}/5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getDecisionBadge(grid.decision)}
                    
                    <div className="flex space-x-2">
                      {grid.hasPdf ? (
                        <>
                          <button
                            onClick={() => downloadPdf(grid.id, grid.memberName)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger PDF
                          </button>
                          <button
                            onClick={() => window.open(`/api/protocol-evaluation/grid/${grid.id}/pdf`, '_blank')}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Visualiser
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => generatePdf(grid.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Générer PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {grid.pdfGeneratedAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    PDF généré le {formatDate(grid.pdfGeneratedAt)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationGridsList;
