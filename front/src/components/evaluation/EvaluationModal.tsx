import React, { useState } from 'react';
import { Save, Send } from 'lucide-react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

interface EvaluationModalProps {
  protocol: any;
  currentUser: any;
  onClose: () => void;
  onSaved: () => void;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ protocol, currentUser, onClose, onSaved }) => {
  const [evaluation, setEvaluation] = useState({
    protocolFrench: '', cvSigned: '', consentForm: '', insurance: '', paymentProof: '',
    investigatorQualified: '', investigatorExplanation: '', associatedInvestigators: '',
    studyJustification: '', methodology: '', budget: '', investigationProduct: '',
    comparatorProduct: '', concomitantProduct: '', decision: '', observations: '',
    evaluatorName: currentUser?.firstName + ' ' + currentUser?.lastName || '', comments: {} as any
  });
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>('');

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner une image');
    }
  };

  const handleSave = async (submit = false) => {
    try {
      // Préparer les données avec les commentaires en JSON
      const evaluationData = {
        ...evaluation,
        comments: JSON.stringify(evaluation.comments),
        submit: submit
      };
      
      const res = await fetch(`${BASE_URL}/protocol-evaluation/protocol/${protocol.id}/evaluator/${currentUser?.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData)
      });
      
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (submit) { 
          onSaved(); 
          onClose(); 
        }
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">Évaluation - {protocol.protocolCode}</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold mb-4">GRILLE D'ÉVALUATION DE PROTOCOLE</h1>
            <p className="text-lg"><strong>Protocole:</strong> {protocol.protocolCode} - {protocol.title}</p>
            <p className="text-md mt-2"><strong>Investigateur:</strong> {protocol.principalInvestigator}</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">📁 Documents</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'protocol', label: 'Protocole' },
                { type: 'consent', label: 'Consentement' },
                { type: 'cv', label: 'CVs' },
                { type: 'receipt', label: 'Paiement' },
                { type: 'president_letter', label: 'Lettre au Président' },
                { type: 'information_notice', label: 'Notice d\'information' },
                { type: 'informed_consent', label: 'Consentement éclairé' },
                { type: 'chronogram', label: 'Chronogramme' },
                { type: 'detailed_budget', label: 'Budget détaillé' },
                { type: 'evaluation_report', label: 'Rapport d\'évaluation' }
              ].map(doc => (
                <button key={doc.type} onClick={() => window.open(`${BASE_URL}/files/view-by-protocol/${protocol.id}/${doc.type}`, '_blank')} className="bg-white border p-3 rounded hover:bg-gray-50 text-left">
                  <p className="font-semibold text-sm">{doc.label}</p>
                  <span className="text-xs text-blue-600">👁️ Voir</span>
                </button>
              ))}
            </div>
          </div>

          <table className="w-full border-collapse border-2 border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-gray-400 p-2 w-12">N°</th>
                <th className="border-2 border-gray-400 p-2">Critères</th>
                <th className="border-2 border-gray-400 p-2 w-32">OBS</th>
                <th className="border-2 border-gray-400 p-2 w-48">COMMENTAIRES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-2 border-gray-400 p-3 font-bold">1.</td>
                <td className="border-2 border-gray-400 p-3">
                  <div className="space-y-2 text-xs">
                    {['protocolFrench', 'cvSigned', 'consentForm', 'insurance', 'paymentProof'].map((field, i) => (
                      <div key={field}>
                        <strong>{['Protocole Français', 'CV signés', 'Formulaire consentement', 'Assurance', 'Paiement'][i]}:</strong>
                        {['Oui', 'Non', ...(field === 'insurance' ? ['NA'] : [])].map(opt => (
                          <label key={opt} className="inline-flex items-center ml-2">
                            <input type="radio" name={field} value={opt} checked={evaluation[field as keyof typeof evaluation] === opt} onChange={(e) => setEvaluation({...evaluation, [field]: e.target.value})} className="mr-1"/> {opt}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border-2 border-gray-400 p-3"></td>
                <td className="border-2 border-gray-400 p-3">
                  <textarea className="w-full border rounded p-1 text-xs" rows={4} value={evaluation.comments['1'] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, '1': e.target.value}})} />
                </td>
              </tr>

              {[
                { num: 2, text: "Investigateur principal qualifié?", hasTextarea: true },
                { num: 3, text: "Investigateurs associés pertinents?" },
                { num: 4, text: "Justification pertinente? Objectifs clairs?" },
                { num: 5, text: "Méthodologie solide?" },
                { num: 6, text: "Budget approprié" }
              ].map(item => (
                <tr key={item.num}>
                  <td className="border-2 border-gray-400 p-3 font-bold">{item.num}.</td>
                  <td className="border-2 border-gray-400 p-3 text-xs">
                    {item.text}
                    {item.hasTextarea && <textarea className="w-full border rounded p-1 mt-1 text-xs" rows={2} placeholder="Expliquez..." value={evaluation.investigatorExplanation} onChange={(e) => setEvaluation({...evaluation, investigatorExplanation: e.target.value})} />}
                  </td>
                  <td className="border-2 border-gray-400 p-3"></td>
                  <td className="border-2 border-gray-400 p-3">
                    <textarea className="w-full border rounded p-1 text-xs" rows={2} value={evaluation.comments[item.num] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, [item.num]: e.target.value}})} />
                  </td>
                </tr>
              ))}

              <tr className="bg-gray-100">
                <td colSpan={4} className="border-2 border-gray-400 p-2 font-bold text-center text-xs">CRITERES ESSAIS THERAPEUTIQUES</td>
              </tr>

              {[7, 8, 9].map(num => (
                <tr key={num}>
                  <td className="border-2 border-gray-400 p-3 font-bold">{num}.</td>
                  <td className="border-2 border-gray-400 p-3 text-xs">Produit {num === 7 ? "d'essai" : num === 8 ? 'comparateur' : 'concomitant'}</td>
                  <td className="border-2 border-gray-400 p-3"></td>
                  <td className="border-2 border-gray-400 p-3">
                    <textarea className="w-full border rounded p-1 text-xs" rows={2} value={evaluation.comments[num] || ''} onChange={(e) => setEvaluation({...evaluation, comments: {...evaluation.comments, [num]: e.target.value}})} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-2 border-gray-400 p-4 space-y-3 bg-gray-50">
            <h3 className="font-bold text-lg text-center">DÉCISION FINALE</h3>
            <div className="flex justify-center gap-6">
              {['Favorable', 'Ajourné', 'Non favorable'].map(dec => (
                <label key={dec} className="flex items-center gap-2">
                  <input type="radio" name="decision" value={dec} checked={evaluation.decision === dec} onChange={(e) => setEvaluation({...evaluation, decision: e.target.value})} className="w-4 h-4" />
                  <span className="font-medium">{dec}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-bold mb-1">Résumé:</label>
              <textarea className="w-full border-2 border-gray-400 rounded p-2" rows={3} value={evaluation.observations} onChange={(e) => setEvaluation({...evaluation, observations: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Évaluateur:</label>
                <input type="text" className="w-full border-2 border-gray-400 rounded p-2" value={evaluation.evaluatorName} onChange={(e) => setEvaluation({...evaluation, evaluatorName: e.target.value})} />
              </div>
              <div>
                <label className="block font-bold mb-1">Date:</label>
                <input type="date" className="w-full border-2 border-gray-400 rounded p-2" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Signature:</label>
              <div className="border-2 border-gray-400 rounded p-3 bg-white">
                {signaturePreview ? (
                  <div className="space-y-2">
                    <img src={signaturePreview} alt="Signature" className="max-h-20 mx-auto" />
                    <button onClick={() => { setSignatureFile(null); setSignaturePreview(''); }} className="text-sm text-red-600">❌ Supprimer</button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input type="file" id="sig" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                    <label htmlFor="sig" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      📎 Charger signature
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t-2">
            <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-4 py-2 border-2 rounded hover:bg-gray-100">
              <Save className="w-4 h-4" />Sauvegarder
            </button>
            <button onClick={() => handleSave(true)} disabled={!evaluation.decision} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
              <Send className="w-4 h-4" />Soumettre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
