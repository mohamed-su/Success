import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, FileTextIcon, DownloadIcon } from 'lucide-react';

const ProtocolEvaluation = () => {
  const { protocolId } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<any>(null);
  const [evaluation, setEvaluation] = useState({
    protocolFrench: '',
    cvSigned: '',
    consentForm: '',
    insurance: '',
    paymentProof: '',
    investigatorQualified: '',
    investigatorExplanation: '',
    associatedInvestigators: '',
    studyJustification: '',
    methodology: '',
    budget: '',
    investigationProduct: '',
    comparatorProduct: '',
    concomitantProduct: '',
    decision: '',
    observations: '',
    evaluatorName: '',
    comments: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProtocol();
  }, [protocolId]);

  const loadProtocol = async () => {
    try {
      const res = await fetch(`${BASE_URL}/secretary/protocols/${protocolId}`);
      const data = await res.json();
      if (data.success) setProtocol(data.protocol);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (submit = false) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (submit && !evaluation.decision) {
      alert('Veuillez sélectionner une décision avant de soumettre.');
      return;
    }

    // FORCER L'UTILISATION DU NOUVEAU SYSTÈME POUR TOUS LES PROTOCOLES
    // Nouvelle structure par critère, attendue pour le backend et l'affichage rapporteur
    const evaluation_data = {
      critere_1: {
        protocole_francais: evaluation.protocolFrench,
        cv_signes: evaluation.cvSigned,
        formulaire_consentement: evaluation.consentForm,
        assurance: evaluation.insurance,
        paiement: evaluation.paymentProof,
        obs: '',
        commentaires: evaluation.comments['1'] || ''
      },
      critere_2: {
        qualification: evaluation.investigatorExplanation,
        obs: evaluation.investigatorQualified,
        commentaires: evaluation.comments['2'] || ''
      },
      critere_3: {
        associes_pertinents: evaluation.associatedInvestigators,
        obs: evaluation.associatedInvestigators,
        commentaires: evaluation.comments['3'] || ''
      },
      critere_4: {
        justification: evaluation.studyJustification,
        obs: evaluation.studyJustification,
        commentaires: evaluation.comments['4'] || ''
      },
      critere_5: {
        methodologie: evaluation.methodology,
        obs: evaluation.methodology,
        commentaires: evaluation.comments['5'] || ''
      },
      critere_6: {
        budget: evaluation.budget,
        obs: evaluation.budget,
        commentaires: evaluation.comments['6'] || ''
      },
      critere_7: {
        produit_essai: evaluation.investigationProduct,
        obs: evaluation.investigationProduct,
        commentaires: evaluation.comments['7'] || ''
      },
      critere_8: {
        produit_comparateur: evaluation.comparatorProduct,
        obs: evaluation.comparatorProduct,
        commentaires: evaluation.comments['8'] || ''
      },
      critere_9: {
        produit_concomitant: evaluation.concomitantProduct,
        obs: evaluation.concomitantProduct,
        commentaires: evaluation.comments['9'] || ''
      }
    };
    const saveData = {
      protocolId: parseInt(protocolId),
      memberId: userData.id || 4,
      evaluation_data,
      decision: evaluation.decision,
      recommendations: evaluation.observations,
      evaluatorName: evaluation.evaluatorName
    };


    try {
      // TOUJOURS UTILISER LE NOUVEAU ENDPOINT
      const res = await fetch('${BASE_URL}/evaluation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      
      const data = await res.json();
      if (data.success) {
        alert('✅ Évaluation persistée avec succès dans member_evaluation_grids !');
        if (submit) navigate('/dashboard/member/assigned');
      } else {
        alert('❌ Erreur: ' + (data.error || 'Erreur lors de la sauvegarde'));
      }
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  const RadioGroup = ({ name, value, onChange }: any) => (
    <div className="flex gap-4">
      {['Oui', 'Non', 'NA'].map(opt => (
        <label key={opt} className="flex items-center gap-2">
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
        <ArrowLeft className="w-4 h-4 mr-2" />Retour
      </button>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h1 className="text-2xl font-bold text-center mb-4">GRILLE D'ÉVALUATION DE PROTOCOLE</h1>
        <div className="text-center mb-6">
          <p className="text-lg font-semibold">Protocole: PROT-{protocol?.id} - {protocol?.title}</p>
          <p>Investigateur: {protocol?.principalInvestigator}</p>
        </div>

        {/* Documents Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">📁 Documents</h3>
          <div className="border border-gray-300 rounded-md">
            <ul className="divide-y divide-gray-200">
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Protocole</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/protocol`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Consentement</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/consent`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">CVs</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/cv`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Paiement</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/receipt`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Lettre au Président du Comité</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/president_letter`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Notice d'information</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/information_notice`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Consentement éclairé</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/informed_consent`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Chronogramme</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/chronogram`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Budget détaillé en Franc CFA</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/detailed_budget`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">Rapport d'évaluation (décision finale)</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a 
                    href={`${BASE_URL}/files/view-by-protocol/${protocolId}/evaluation_report`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Voir
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 w-12">N°</th>
              <th className="border border-gray-300 p-2">Critères généraux-Conception-Conduite scientifique</th>
              <th className="border border-gray-300 p-2 w-32">OBSERVATIONS</th>
              <th className="border border-gray-300 p-2">COMMENTAIRES/AVIS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 font-bold">1.</td>
              <td className="border border-gray-300 p-3">
                <div className="space-y-3">
                  <div>Protocole en Français<br/>Fourni: <RadioGroup name="protocolFrench" value={evaluation.protocolFrench} onChange={(e:any) => setEvaluation({...evaluation, protocolFrench: e.target.value})} /></div>
                  <div>CV signés des investigateurs<br/>Fournis: <RadioGroup name="cvSigned" value={evaluation.cvSigned} onChange={(e:any) => setEvaluation({...evaluation, cvSigned: e.target.value})} /></div>
                  <div>Note/Prospectus d'information du participant et formulaire de consentement éclairé<br/>Fourni: <RadioGroup name="consentForm" value={evaluation.consentForm} onChange={(e:any) => setEvaluation({...evaluation, consentForm: e.target.value})} /></div>
                  <div>Certificat d'assurance actualisé et valide pour l'essai clinique<br/>Fourni: <RadioGroup name="insurance" value={evaluation.insurance} onChange={(e:any) => setEvaluation({...evaluation, insurance: e.target.value})} /></div>
                  <div>Pièces justificatives du paiement des frais de dossiers<br/>Fournies: <RadioGroup name="paymentProof" value={evaluation.paymentProof} onChange={(e:any) => setEvaluation({...evaluation, paymentProof: e.target.value})} /></div>
                </div>
              </td>
              <td className="border border-gray-300 p-3"></td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={4} value={evaluation.comments['1'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '1': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">2.</td>
              <td className="border border-gray-300 p-3">
                <div>Investigateur principal<br/>Nom/prénom/qualification/adresse complète<br/>L'investigateur principal est-il qualifié pour la conduite de cette étude.</div>
                <textarea className="w-full border rounded p-2 mt-2" rows={2} placeholder="Expliquez..." value={evaluation.investigatorExplanation} onChange={(e) => setEvaluation({...evaluation, investigatorExplanation: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="investigatorQualified" value={evaluation.investigatorQualified} onChange={(e:any) => setEvaluation({...evaluation, investigatorQualified: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['2'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '2': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">3.</td>
              <td className="border border-gray-300 p-3">
                Investigateurs associés<br/>Le nombre d'investigateurs associé est-il pertinent. Sont-ils complémentaires et qualifiés ?
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="associatedInvestigators" value={evaluation.associatedInvestigators} onChange={(e:any) => setEvaluation({...evaluation, associatedInvestigators: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['3'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '3': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">4.</td>
              <td className="border border-gray-300 p-3">
                La justification de l'étude est-elle pertinente ? cette étude permettra t'elle d'avoir une réponse à une question prioritaire de recherche dans notre pays ?<br/>Les objectifs de l'étude sont ils clairs ?
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="studyJustification" value={evaluation.studyJustification} onChange={(e:any) => setEvaluation({...evaluation, studyJustification: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['4'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '4': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">5.</td>
              <td className="border border-gray-300 p-3">
                La méthodologie est-elle solide, (type d'étude appropriée, taille de l'échantillon suffisante, collecte des données appropriées, variables de l'étude)
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="methodology" value={evaluation.methodology} onChange={(e:any) => setEvaluation({...evaluation, methodology: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['5'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '5': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">6.</td>
              <td className="border border-gray-300 p-3">Budget de la recherche approprié</td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="budget" value={evaluation.budget} onChange={(e:any) => setEvaluation({...evaluation, budget: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['6'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '6': e.target.value}})} />
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td colSpan={4} className="border border-gray-300 p-3 font-bold">CRITERES SPECIFIQUES AUX ESSAIS THERAPEUTIQUES</td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">7.</td>
              <td className="border border-gray-300 p-3">
                Produit(s) d'essai ou d'investigation (pertinences de la proposition):<br/>Désignation/forme/dosage/Présentation<br/>Composition quantitative et qualitative<br/>Notice ou données pharmacologiques complètes
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="investigationProduct" value={evaluation.investigationProduct} onChange={(e:any) => setEvaluation({...evaluation, investigationProduct: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['7'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '7': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">8.</td>
              <td className="border border-gray-300 p-3">
                Produit comparateur (si applicable)<br/>Désignation/forme/dosage/Présentation<br/>Composition quantitative et qualitative<br/>Notice ou données pharmacologiques complètes
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="comparatorProduct" value={evaluation.comparatorProduct} onChange={(e:any) => setEvaluation({...evaluation, comparatorProduct: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['8'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '8': e.target.value}})} />
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 p-3 font-bold">9.</td>
              <td className="border border-gray-300 p-3">
                Produit(s) concomitant (si applicable)<br/>Désignation/forme/dosage/Présentation<br/>Composition quantitative et qualitative<br/>Notice ou données pharmacologiques complètes
              </td>
              <td className="border border-gray-300 p-3">
                <RadioGroup name="concomitantProduct" value={evaluation.concomitantProduct} onChange={(e:any) => setEvaluation({...evaluation, concomitantProduct: e.target.value})} />
              </td>
              <td className="border border-gray-300 p-3">
                <textarea className="w-full border rounded p-2" rows={3} value={evaluation.comments['9'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '9': e.target.value}})} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 space-y-4 border border-gray-300 p-4">
          <h3 className="font-bold text-lg">DÉCISION FINALE</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="decision" value="Favorable" checked={evaluation.decision === 'Favorable'} onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})} />
              <span>Favorable</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="decision" value="Ajourné" checked={evaluation.decision === 'Ajourné'} onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})} />
              <span>Ajourné (révisions demandées)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="decision" value="Non favorable" checked={evaluation.decision === 'Non favorable'} onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})} />
              <span>Non favorable</span>
            </label>
          </div>

          <div>
            <label className="block font-medium mb-2">Résumé des observations et recommandations:</label>
            <textarea className="w-full border rounded p-2" rows={4} value={evaluation.observations} onChange={(e) => setEvaluation({...evaluation, observations: e.target.value})} />
          </div>

          <div>
            <label className="block font-medium mb-2">Nom et prénom(s) de l'évaluateur:</label>
            <input type="text" className="w-full border rounded p-2" value={evaluation.evaluatorName} onChange={(e) => setEvaluation({...evaluation, evaluatorName: e.target.value})} />
          </div>

          <div>
            <label className="block font-medium mb-2">Date:</label>
            <input type="date" className="border rounded p-2" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
            <Save className="w-4 h-4" />Sauvegarder brouillon
          </button>
          <button onClick={() => handleSave(true)} disabled={!evaluation.decision} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
            <Send className="w-4 h-4" />Soumettre l'évaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolEvaluation;
