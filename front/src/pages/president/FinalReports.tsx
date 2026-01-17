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
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDeliberations();
  }, []);

  const fetchDeliberations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/president/deliberations?t=' + Date.now(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'president',
          'Cache-Control': 'no-cache'
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

  const handleSendWithSignature = (deliberation: Deliberation) => {
    setSignatureDeliberation(deliberation);
    setShowSignatureModal(true);
    setSignatureFile(null);
  };

  const submitSignatureAndSend = async () => {
    if (!signatureDeliberation || !signatureFile) {
      alert('Veuillez sélectionner un fichier de signature');
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('signatureFile', signatureFile);
      formData.append('presidentName', 'Pr Fla KOUETA');

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/president/send-deliberation/${signatureDeliberation.protocolid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': localStorage.getItem('userId') || '1',
          'X-User-Role': localStorage.getItem('userRole') || 'president'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      const result = await response.json();
      if (result.success) {
        alert('✓ Délibération signée et envoyée au chercheur avec succès !');
        setShowSignatureModal(false);
        setSignatureDeliberation(null);
        setSignatureFile(null);
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
    switch (decision) {
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
                          {deliberation.deliberationdate ? 
                            new Date(deliberation.deliberationdate).toLocaleDateString('fr-FR') : 
                            'Date non disponible'
                          }
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

      {/* Modal de détails */}
      {selectedDeliberation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la délibération
                </h3>
                <button
                  onClick={() => setSelectedDeliberation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Code Protocole:</p>
                  <p className="text-sm text-gray-900 font-mono">{selectedDeliberation.protocolcode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Numéro Délibération:</p>
                  <p className="text-sm text-gray-900 font-mono">{selectedDeliberation.deliberationnumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-700">Titre de la recherche:</p>
                  <p className="text-sm text-gray-900 font-semibold">{selectedDeliberation.researchtitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Investigateur principal:</p>
                  <p className="text-sm text-gray-900">{selectedDeliberation.principalinvestigator}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Institution:</p>
                  <p className="text-sm text-gray-900">{selectedDeliberation.institution}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Type d'étude:</p>
                  <p className="text-sm text-gray-900">{selectedDeliberation.studytype || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Nombre de participants:</p>
                  <p className="text-sm text-gray-900">{selectedDeliberation.participants || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Durée (mois):</p>
                  <p className="text-sm text-gray-900">{selectedDeliberation.duration || 'Non spécifiée'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Rapporteur assigné:</p>
                  <p className="text-sm text-gray-900">{selectedDeliberation.rapporteur}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Statut:</p>
                  <p className="text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedDeliberation.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date de soumission:</p>
                  <p className="text-sm text-gray-900">
                    {selectedDeliberation.deliberationdate || selectedDeliberation.submissiondatetime || 'Non disponible'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Statut de paiement:</p>
                  <p className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedDeliberation.payment_status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                      selectedDeliberation.payment_status === 'PAID' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedDeliberation.payment_status || 'PENDING'}
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedDeliberation.description && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Description du projet:</p>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                    {selectedDeliberation.description}
                  </div>
                </div>
              )}
              
              {selectedDeliberation.ethical_considerations && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Considérations éthiques:</p>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                    {selectedDeliberation.ethical_considerations}
                  </div>
                </div>
              )}
              
              {selectedDeliberation.evaluation_comments && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Commentaires d'évaluation:</p>
                  <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded border border-blue-200">
                    {selectedDeliberation.evaluation_comments}
                  </div>
                </div>
              )}
              
              {selectedDeliberation.verification_comments && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Commentaires de vérification:</p>
                  <div className="text-sm text-gray-900 bg-yellow-50 p-3 rounded border border-yellow-200">
                    {selectedDeliberation.verification_comments}
                  </div>
                </div>
              )}
              
              {selectedDeliberation.files && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Fichiers soumis:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedDeliberation.files).map(([key, filename]) => {
                      if (!filename) return null;
                      const labels = {
                        protocolFile: 'Fichier protocole',
                        consentForm: 'Formulaire de consentement',
                        cvFiles: 'CV des chercheurs',
                        paymentReceipt: 'Reçu de paiement',
                        presidentLetter: 'Lettre du président',
                        informationNotice: 'Notice d\'information',
                        informedConsent: 'Consentement éclairé',
                        chronogram: 'Chronogramme',
                        detailedBudget: 'Budget détaillé',
                        evaluationReport: 'Rapport d\'evaluation'
                      };
                      return (
                        <div key={key} className="flex items-center p-2 bg-gray-50 rounded border">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">{labels[key] || key}</p>
                            <p className="text-xs text-gray-500 truncate max-w-32">{filename}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
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
                  Fichier de signature (PNG, JPG, PDF):
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {signatureFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Fichier sélectionné: {signatureFile.name}
                  </p>
                )}
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
                  disabled={sending || !signatureFile}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {sending ? 'Envoi...' : 'Signer et Envoyer'}
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
