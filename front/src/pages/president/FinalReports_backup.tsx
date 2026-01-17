import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Deliberation {
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
  memberkoueta: boolean;
  membernanga: boolean;
  memberdrabo: boolean;
  membertoe: boolean;
  memberouedraogo1: boolean;
  memberouedraogo2: boolean;
  memberspresent: string;
  rapporteur: string;
  evaluationdate: string;
  status: string;
  presidentsignaturedate?: string;
  presidentname?: string;
  secretarystampdate?: string;
  secretaryname?: string;
}

const FinalReports = () => {
  const [deliberations, setDeliberations] = useState<Deliberation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliberation, setSelectedDeliberation] = useState<Deliberation | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureDeliberation, setSignatureDeliberation] = useState<Deliberation | null>(null);
  const [signature, setSignature] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDeliberations();
  }, []);

  const fetchDeliberations = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('=== DEBUGGING FETCH DELIBERATIONS ===');
      console.log('Fetching deliberations with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/president/final-reports?t=' + Date.now(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'president',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Erreur lors du chargement des délibérations');
      }

      const data = await response.json();
      console.log('=== DONNÉES BRUTES DE L\'API ===');
      console.log(JSON.stringify(data, null, 2));
      console.log('=== PREMIÈRE DÉLIBÉRATION ===');
      if (data.deliberations && data.deliberations.length > 0) {
        const first = data.deliberations[0];
        console.log('ID:', first.id);
        console.log('INVESTIGATEUR:', first.principalinvestigator);
        console.log('DEMANDEUR:', first.requesterreference);
        console.log('MEMBRES:', first.memberspresent);
        console.log('TOUTES LES CLÉS:', Object.keys(first));
      }
      
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

  const handleSendWithSignature = (deliberation: Deliberation) => {
    setSignatureDeliberation(deliberation);
    setShowSignatureModal(true);
    setSignature('');
  };

  const submitSignatureAndSend = async () => {
    if (!signatureDeliberation || !signature.trim()) {
      alert('Veuillez saisir votre signature');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/president/send-deliberation/${signatureDeliberation.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'president'
        },
        body: JSON.stringify({
          signature: signature.trim(),
          presidentName: 'Pr Fla KOUETA'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      const result = await response.json();
      if (result.success) {
        alert('✓ Délibération signée et envoyée au chercheur avec succès !');
        setShowSignatureModal(false);
        setSignatureDeliberation(null);
        setSignature('');
        fetchDeliberations();
      } else {
        alert('❌ Erreur: ' + result.error);
      }
    } catch (err) {
      alert('❌ Erreur lors de l\'envoi: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    } finally {
      setSending(false);
    }
  };

  const getDecisionBadge = (decision: string) => {
      case 'FAVORABLE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Favorable
          </span>
        );
      case 'NON_FAVORABLE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Non Favorable
          </span>
        );
      case 'AJOURNE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Ajourné
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
            <h2 className="text-2xl font-bold text-gray-800">Rapport Final des Délibérations</h2>
            <p className="text-gray-600 mt-1">
              Toutes les délibérations finalisées par le rapporteur
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune délibération</h3>
          <p className="text-gray-500">
            Aucune délibération n'a encore été finalisée par le rapporteur.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocole
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Délibération
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investigateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Décision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rapporteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliberations.map((deliberation) => (
                  <tr key={deliberation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {deliberation.protocolcode}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {deliberation.researchtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {deliberation.deliberationnumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-900">
                          {deliberation.principalinvestigator}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-900">
                          {new Date(deliberation.deliberationdate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDecisionBadge(deliberation.decision)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliberation.rapporteur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDeliberation(deliberation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir détails
                        </button>
                        {!deliberation.presidentsignaturedate && (
                          <button
                            onClick={() => handleSendWithSignature(deliberation)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            Envoyer
                          </button>
                        )}
                        {deliberation.presidentsignaturedate && (
                          <span className="text-green-600 text-xs font-medium">
                            ✓ Envoyé
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de signature */}
      {showSignatureModal && signatureDeliberation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Signature du Président
                </h3>
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Délibération: <strong>{signatureDeliberation.deliberationnumber}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Protocole: <strong>{signatureDeliberation.protocolcode}</strong>
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre signature (nom complet):
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Ex: Pr Fla KOUETA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  disabled={sending}
                >
                  Annuler
                </button>
                <button
                  onClick={submitSignatureAndSend}
                  disabled={sending || !signature.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {sending ? 'Envoi...' : 'Signer et Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {selectedDeliberation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la Délibération {selectedDeliberation.deliberationnumber}
                </h3>
                <button
                  onClick={() => setSelectedDeliberation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Protocole</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.protocolcode}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Titre de la recherche</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.researchtitle || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Référence du protocole</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.protocolreference || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Investigateur principal</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.principalinvestigator || 'Investigateur non spécifié'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Référence du demandeur</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.requesterreference || 'Demandeur non spécifié'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site de recherche</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.researchsite || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Documentation</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.documentation || 'Non spécifié'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de délibération</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDeliberation.deliberationdate ? 
                        new Date(selectedDeliberation.deliberationdate).toLocaleDateString('fr-FR') : 
                        'Date non spécifiée'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Décision</label>
                    <div className="mt-1">
                      {getDecisionBadge(selectedDeliberation.decision)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rapporteur</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeliberation.rapporteur}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Éléments examinés</label>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDeliberation.scientificconception ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-sm">Conception scientifique</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDeliberation.participantprotection ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-sm">Protection des participants</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDeliberation.dataconfidentiality ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-sm">Confidentialité des données</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDeliberation.consentprocess ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-sm">Processus de consentement</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDeliberation.researchbudget ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-sm">Budget de recherche</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${selectedDeliberation.cvdocuments ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-sm">CV des investigateurs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Membres ayant siégé</label>
                    <div className="mt-1 bg-blue-50 p-3 rounded-md">
                      {(() => {
                        try {
                          const membres = selectedDeliberation.memberspresent && selectedDeliberation.memberspresent !== '[]' 
                            ? JSON.parse(selectedDeliberation.memberspresent) 
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
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Observations</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedDeliberation.observations || 'Aucune observation'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Réserves</label>
                  <p className="mt-1 text-sm text-gray-900 bg-yellow-50 p-3 rounded-md">
                    {selectedDeliberation.reserves || 'Aucune réserve'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recommandations</label>
                  <p className="mt-1 text-sm text-gray-900 bg-blue-50 p-3 rounded-md">
                    {selectedDeliberation.recommendations || 'Aucune recommandation'}
                  </p>
                </div>
                
                {(selectedDeliberation.presidentname || selectedDeliberation.secretaryname) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Signatures</label>
                    <div className="mt-1 bg-green-50 p-3 rounded-md space-y-2">
                      {selectedDeliberation.presidentname && (
                        <div className="flex justify-between">
                          <span className="font-medium">Président:</span>
                          <span>{selectedDeliberation.presidentname}</span>
                          <span className="text-sm text-gray-500">
                            {selectedDeliberation.presidentsignaturedate && 
                              new Date(selectedDeliberation.presidentsignaturedate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                      {selectedDeliberation.secretaryname && (
                        <div className="flex justify-between">
                          <span className="font-medium">Secrétaire:</span>
                          <span>{selectedDeliberation.secretaryname}</span>
                          <span className="text-sm text-gray-500">
                            {selectedDeliberation.secretarystampdate && 
                              new Date(selectedDeliberation.secretarystampdate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
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

export default FinalReports;
