import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, CheckCircle, XCircle, Clock, Download, Eye } from 'lucide-react';

interface Decision {
  id: number;
  protocolid: number;
  protocolcode: string;
  deliberationnumber: string;
  researchtitle: string;
  protocolreference: string;
  principalinvestigator: string;
  requesterreference: string;
  researchsite: string;
  deliberationdate: string;
  documentation: string;
  scientificconception: boolean;
  participantprotection: boolean;
  dataconfidentiality: boolean;
  consentprocess: boolean;
  researchbudget: boolean;
  cvdocuments: boolean;
  observations: string;
  reserves: string;
  recommendations: string;
  decision: string;
  memberspresent: string;
  rapporteur: string;
  evaluationdate: string;
  presidentsignaturedate: string;
  presidentname: string;
  presidentsignature: string;
  institution?: string;
  participants?: string;
  duration?: string;
  description?: string;
  studytype?: string;
  ethical_considerations?: string;
  protocol_file_name?: string;
  consent_form_file_name?: string;
  cv_files_names?: string;
  payment_receipt_file_name?: string;
  payment_status?: string;
}

const ResearcherDecisions = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/researcher/decisions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'researcher'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des décisions');
      }

      const data = await response.json();
      if (data.success) {
        setDecisions(data.decisions);
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

  const downloadSignature = async (decisionId: number) => {
    try {
      const response = await fetch(`/api/researcher/decisions/${decisionId}/signature`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'researcher'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signature_president_${decisionId}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      alert('Erreur lors du téléchargement de la signature');
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
            <h2 className="text-2xl font-bold text-gray-800">Décisions du Comité</h2>
            <p className="text-gray-600 mt-1">
              Décisions officielles signées par le président du comité d'éthique
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-blue-600">
              {decisions.length} décision{decisions.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {decisions.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune décision reçue</h3>
          <p className="text-gray-500">
            Vous n'avez pas encore reçu de décision signée du comité d'éthique.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {decisions.map((decision) => (
            <div key={decision.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {decision.protocolcode}
                      </h3>
                      {getDecisionBadge(decision.decision)}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{decision.researchtitle}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Délibération: {new Date(decision.deliberationdate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Signé par: {decision.presidentname}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Signé le: {new Date(decision.presidentsignaturedate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedDecision(decision)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir détails
                    </button>
                    {decision.presidentsignature && (
                      <button
                        onClick={() => downloadSignature(decision.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Signature
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Décision Officielle - {selectedDecision.deliberationnumber}
                </h3>
                <button
                  onClick={() => setSelectedDecision(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedDecision.protocolcode}</h4>
                    <p className="text-gray-600">{selectedDecision.researchtitle}</p>
                  </div>
                  <div className="text-right">
                    {getDecisionBadge(selectedDecision.decision)}
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(selectedDecision.deliberationdate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Informations du Protocole</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Investigateur principal:</span> {selectedDecision.principalinvestigator}</p>
                      <p><span className="font-medium">Institution:</span> {selectedDecision.institution || 'Non renseigné'}</p>
                      <p><span className="font-medium">Site de recherche:</span> {selectedDecision.researchsite || 'Non renseigné'}</p>
                      <p><span className="font-medium">Type d'étude:</span> {selectedDecision.studytype || 'Non renseigné'}</p>
                      <p><span className="font-medium">Nombre de participants:</span> {selectedDecision.participants || 'Non renseigné'}</p>
                      <p><span className="font-medium">Durée (mois):</span> {selectedDecision.duration || 'Non renseignée'}</p>
                      <p><span className="font-medium">Référence du demandeur:</span> {selectedDecision.requesterreference}</p>
                      <p><span className="font-medium">Documentation:</span> {selectedDecision.documentation}</p>
                    </div>
                  </div>
                  
                  {selectedDecision.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description du projet</h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {selectedDecision.description}
                      </div>
                    </div>
                  )}
                  
                  {selectedDecision.ethical_considerations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Considérations éthiques</h4>
                      <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md">
                        {selectedDecision.ethical_considerations}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Éléments Examinés</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDecision.scientificconception ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Conception scientifique</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDecision.participantprotection ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Protection des participants</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDecision.dataconfidentiality ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Confidentialité des données</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDecision.consentprocess ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Processus de consentement</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDecision.researchbudget ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Budget de recherche</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDecision.cvdocuments ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>CV des investigateurs</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Membres ayant siégé</h4>
                    <div className="bg-blue-50 p-3 rounded-md">
                      {(() => {
                        try {
                          const membres = selectedDecision.memberspresent && selectedDecision.memberspresent !== '[]' 
                            ? JSON.parse(selectedDecision.memberspresent) 
                            : [];
                          return membres.length > 0 ? (
                            membres.map((member: string, index: number) => (
                              <div key={index} className="flex items-center mb-1">
                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                <span className="text-sm">{member}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">Aucun membre spécifié</span>
                          );
                        } catch (e) {
                          return <span className="text-sm text-gray-500">Aucun membre spécifié</span>;
                        }
                      })()}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                    <h4 className="font-semibold text-green-800 mb-2">Signature Officielle</h4>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-green-700 font-medium">{selectedDecision.presidentname}</p>
                        <p className="text-sm text-green-600">Président du Comité d'Éthique</p>
                      </div>
                      <p className="text-sm text-green-600">
                        {new Date(selectedDecision.presidentsignaturedate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {selectedDecision.presidentsignature && (
                      <button
                        onClick={() => downloadSignature(selectedDecision.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger la signature
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedDecision.observations && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Observations</h4>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                      {selectedDecision.observations}
                    </p>
                  </div>
                )}
                
                {selectedDecision.reserves && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Réserves</h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-md">
                      {selectedDecision.reserves}
                    </p>
                  </div>
                )}
                
                {selectedDecision.recommendations && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommandations</h4>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-md">
                      {selectedDecision.recommendations}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedDecision(null)}
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

export default ResearcherDecisions;
