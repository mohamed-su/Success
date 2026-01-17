import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

interface ReceivedDeliberation {
  id: number;
  protocolid: number;
  protocolcode: string;
  deliberationnumber: string;
  researchtitle: string;
  decision: string;
  deliberationdate: string;
  presidentsignaturedate: string;
  presidentname: string;
  presidentsignature: string;
  observations: string;
  reserves: string;
  recommendations: string;
}

const ResearcherDeliberations = () => {
  const [deliberations, setDeliberations] = useState<ReceivedDeliberation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliberation, setSelectedDeliberation] = useState<ReceivedDeliberation | null>(null);

  useEffect(() => {
    fetchReceivedDeliberations();
  }, []);

  const fetchReceivedDeliberations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/researcher/received-deliberations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'researcher'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des délibérations');
      }

      const data = await response.json();
      if (data.success) {
        setDeliberations(data.deliberations);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'FAVORABLE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Favorable
          </span>
        );
      case 'NON_FAVORABLE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Non Favorable
          </span>
        );
      case 'AJOURNE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Ajourné
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {decision}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <XCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Délibérations Reçues</h2>
            <p className="text-gray-600 mt-1">
              Décisions du comité d'éthique pour vos protocoles de recherche
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-blue-600">
              {deliberations.length} délibération{deliberations.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {deliberations.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune délibération reçue</h3>
          <p className="text-gray-500">
            Vous n'avez pas encore reçu de décision du comité d'éthique.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {deliberations.map((deliberation) => (
            <div key={deliberation.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {deliberation.protocolcode}
                      </h3>
                      {getDecisionBadge(deliberation.decision)}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{deliberation.researchtitle}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Délibération: {new Date(deliberation.deliberationdate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Signé par: {deliberation.presidentname}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedDeliberation(deliberation)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      {selectedDeliberation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Délibération {selectedDeliberation.deliberationnumber}
                </h3>
                <button
                  onClick={() => setSelectedDeliberation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedDeliberation.protocolcode}</h4>
                    <p className="text-gray-600">{selectedDeliberation.researchtitle}</p>
                  </div>
                  <div className="text-right">
                    {getDecisionBadge(selectedDeliberation.decision)}
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(selectedDeliberation.deliberationdate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedDeliberation.observations && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Observations</h4>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                      {selectedDeliberation.observations}
                    </p>
                  </div>
                )}
                
                {selectedDeliberation.reserves && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Réserves</h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-md">
                      {selectedDeliberation.reserves}
                    </p>
                  </div>
                )}
                
                {selectedDeliberation.recommendations && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommandations</h4>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-md">
                      {selectedDeliberation.recommendations}
                    </p>
                  </div>
                )}
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">Signature du Président</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-700 font-medium">{selectedDeliberation.presidentsignature}</p>
                      <p className="text-sm text-green-600">{selectedDeliberation.presidentname}</p>
                    </div>
                    <p className="text-sm text-green-600">
                      {new Date(selectedDeliberation.presidentsignaturedate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedDeliberation(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDeliberations;
