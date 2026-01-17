import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, Calendar, User, CheckCircle } from 'lucide-react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

interface EvaluationGridsModalProps {
  protocolId: number;
  protocolCode: string;
  onClose: () => void;
}

const EvaluationGridsModal: React.FC<EvaluationGridsModalProps> = ({ 
  protocolId, 
  protocolCode, 
  onClose 
}) => {
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvaluationGrids();
  }, [protocolId]);

  const loadEvaluationGrids = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/protocol-evaluation/protocol/${protocolId}/grids`);
      const data = await response.json();
      
      console.log('Données reçues:', data); // Debug
      console.log('Première grille:', data.grids?.[0]); // Debug commentaires
      console.log('Commentaires première grille:', data.grids?.[0]?.comments); // Debug spécifique
      
      if (data.success) {
        setGrids(data.grids);
        setError(null);
      } else {
        setError(data.error || 'Aucune grille d\'évaluation trouvée');
      }
    } catch (err) {
      console.error('Erreur:', err); // Debug
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (gridId, memberName) => {
    try {
      const response = await fetch(`${BASE_URL}/protocol-evaluation/grid/${gridId}/pdf`);
      
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
    } catch (error) {
      alert('Erreur lors du téléchargement');
    }
  };

  const handleViewPdf = (gridId) => {
    window.open(`${BASE_URL}/protocol-evaluation/grid/${gridId}/pdf`, '_blank');
  };

  const handleAddMoreMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/protocol-evaluation/protocol/${protocolId}/add-members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.addedCount} membre(s) supplémentaire(s) ajouté(s) automatiquement`);
        loadEvaluationGrids();
      } else {
        alert('❌ Erreur: ' + data.error);
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout automatique des membres');
    }
  };

  const handleGeneratePdf = async (gridId) => {
    try {
      const response = await fetch(`${BASE_URL}/protocol-evaluation/grid/${gridId}/generate-pdf`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('PDF généré avec succès!');
        loadEvaluationGrids();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      alert('Erreur lors de la génération: ' + err.message);
    }
  };

  const getDecisionLabel = (decision) => {
    switch (decision) {
      case 'APPROVE': return 'Approuvé';
      case 'REJECT': return 'Rejeté';
      default: return decision;
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'APPROVE': return 'bg-green-100 text-green-800';
      case 'REJECT': return 'bg-red-100 text-red-800';
      case 'MINOR_REVISION': return 'bg-yellow-100 text-yellow-800';
      case 'MAJOR_REVISION': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Grilles d'Évaluation PDF</h2>
            <p className="text-sm text-gray-600">Protocole: {protocolCode}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement des PDFs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600 font-bold">{error}</p>
              <button 
                onClick={loadEvaluationGrids}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          ) : grids.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Aucune grille d'évaluation trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-green-800">{grids.length} Grille(s) avec PDF Professionnel</h3>
                  {grids.length >= 6 && (
                    <button
                      onClick={() => handleAddMoreMembers()}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 flex items-center gap-1 text-sm font-bold"
                      title="Ajouter automatiquement plus de membres"
                    >
                      <span className="text-lg">+</span>
                      Ajouter Membres
                    </button>
                  )}
                </div>
              </div>

              {grids.map((grid) => (
  <div key={grid.id} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <table className="mt-3 w-full text-sm border">
          <thead>
            <tr>
              <th className="border p-1">N°</th>
              <th className="border p-1">Critères</th>
              <th className="border p-1">OBS</th>
              <th className="border p-1">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">1</td>
              <td className="border p-1">Documents administratifs</td>
              <td className="border p-1">
                Protocole: {grid.protocolFrench || ''}<br/>
                CV: {grid.cvSigned || ''}<br/>
                Formulaire: {grid.consentForm || ''}<br/>
                Assurance: {grid.insurance || ''}<br/>
                Paiement: {grid.paymentProof || ''}
              </td>
              <td className="border p-1">{grid.comments?.['1'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">2</td>
              <td className="border p-1">Investigateur principal qualifié</td>
              <td className="border p-1">{grid.investigatorQualified || ''}</td>
              <td className="border p-1">{grid.comments?.['2'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">3</td>
              <td className="border p-1">Investigateurs associés pertinents</td>
              <td className="border p-1">{grid.associatedInvestigators || ''}</td>
              <td className="border p-1">{grid.comments?.['3'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">4</td>
              <td className="border p-1">Justification pertinente ? Objectifs clairs ?</td>
              <td className="border p-1">{grid.studyJustification || ''}</td>
              <td className="border p-1">{grid.comments?.['4'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">5</td>
              <td className="border p-1">Méthodologie solide ?</td>
              <td className="border p-1">{grid.methodology || ''}</td>
              <td className="border p-1">{grid.comments?.['5'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">6</td>
              <td className="border p-1">Budget approprié</td>
              <td className="border p-1">{grid.budget || ''}</td>
              <td className="border p-1">{grid.comments?.['6'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">7</td>
              <td className="border p-1">Produit d'essai</td>
              <td className="border p-1">{grid.investigationProduct || ''}</td>
              <td className="border p-1">{grid.comments?.['7'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">8</td>
              <td className="border p-1">Produit comparateur</td>
              <td className="border p-1">{grid.comparatorProduct || ''}</td>
              <td className="border p-1">{grid.comments?.['8'] || ''}</td>
            </tr>
            <tr>
              <td className="border p-1">9</td>
              <td className="border p-1">Produit concomitant</td>
              <td className="border p-1">{grid.concomitantProduct || ''}</td>
              <td className="border p-1">{grid.comments?.['9'] || ''}</td>
            </tr>
          </tbody>
        </table>
        
        {/* Section Décision finale */}
        <div className="mt-4 p-3 border-2 border-gray-300 bg-gray-50">
          <h4 className="font-bold text-lg mb-2">DÉCISION FINALE</h4>
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-medium">Décision:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              grid.finalDecision === 'Favorable' ? 'bg-green-100 text-green-800' :
              grid.finalDecision === 'Non favorable' ? 'bg-red-100 text-red-800' :
              grid.finalDecision === 'Ajourné' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {grid.finalDecision || 'Non définie'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Évaluateur:</span>
              <span className="ml-2">{grid.evaluatorName || 'Non défini'}</span>
            </div>
            <div>
              <span className="font-medium">Date:</span>
              <span className="ml-2">{grid.evaluationDate || 'Non définie'}</span>
            </div>
          </div>
          
          {grid.signatureImage ? (
            <div className="mt-3">
              <span className="font-medium">Signature:</span>
              <div className="mt-1 border border-gray-300 p-2 bg-white">
                <img 
                  src={grid.signatureImage} 
                  alt="Signature de l'évaluateur" 
                  className="max-h-16 max-w-full"
                />
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <span className="font-medium">Signature:</span>
              <div className="mt-1 border border-gray-300 p-2 bg-white text-gray-500 text-sm">
                Signature non disponible - Problème de sauvegarde backend
              </div>
            </div>
          )}
        </div>
      </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-blue-900 text-lg">{grid.memberName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-6 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-600 mr-1" />
                          <span className="text-sm font-medium text-gray-700">
                            {formatDate(grid.submittedAt)}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-gray-700">
                          Score: {grid.averageScore?.toFixed(1) || 'N/A'}/5
                        </div>
                        <div className={`px-3 py-1 text-sm font-bold rounded-full ${getDecisionColor(grid.decision)}`}>
                          {getDecisionLabel(grid.decision)}
                        </div>
                      </div>

                      {grid.hasPdf && (
                        <div className="flex items-center text-sm font-medium text-green-700 bg-green-100 rounded p-2">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>PDF Professionnel Disponible</span>
                          {grid.pdfGeneratedAt && (
                            <span className="ml-2 text-xs text-green-600">
                              (généré le {formatDate(grid.pdfGeneratedAt)})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {grid.hasPdf ? (
                        <>
                          <button
                            onClick={() => handleViewPdf(grid.id)}
                            className="flex items-center px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualiser PDF
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(grid.id, grid.memberName)}
                            className="flex items-center px-4 py-2 text-sm font-bold bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PDF
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleGeneratePdf(grid.id)}
                          className="flex items-center px-4 py-2 text-sm font-bold bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Générer PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-bold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationGridsModal;
