import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface TableFormData {
  // Documents administratifs
  protocoleEnFrancaisOui: boolean;
  protocoleEnFrancaisNon: boolean;
  protocoleObservations: string;
  protocoleCommentaires: string;
  
  cvInvestigateursOui: boolean;
  cvInvestigateursNon: boolean;
  cvObservations: string;
  cvCommentaires: string;
  
  noteInformationOui: boolean;
  noteInformationNon: boolean;
  noteObservations: string;
  noteCommentaires: string;
  
  certificatAssuranceOui: boolean;
  certificatAssuranceNon: boolean;
  certificatAssuranceNA: boolean;
  certificatObservations: string;
  certificatCommentaires: string;
  
  piecesJustificativesOui: boolean;
  piecesJustificativesNon: boolean;
  piecesObservations: string;
  piecesCommentaires: string;
  
  // Investigateur principal
  investigateurNomPrenom: string;
  investigateurQualifie: string;
  investigateurObservations: string;
  investigateurCommentaires: string;
  
  // Investigateurs associés
  investigateursAssociesObservations: string;
  investigateursAssociesCommentaires: string;
  
  // Justification et objectifs
  justificationObservations: string;
  justificationCommentaires: string;
  
  // Méthodologie
  methodologieObservations: string;
  methodologieCommentaires: string;
  
  // Budget
  budgetObservations: string;
  budgetCommentaires: string;
  
  // Produits d'essai
  produitEssaiObservations: string;
  produitEssaiCommentaires: string;
  
  produitComparateurObservations: string;
  produitComparateurCommentaires: string;
  
  produitConcomitantObservations: string;
  produitConcomitantCommentaires: string;
  
  decision: 'FAVORABLE' | 'AJOURNE' | 'NON_FAVORABLE' | '';
  resumeObservations: string;
  evaluateurs: string[];
  dateEvaluation: string;
}

interface TableEvaluationFormProps {
  protocol: any;
  onSubmit: (formData: TableFormData) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const TableEvaluationForm: React.FC<TableEvaluationFormProps> = ({
  protocol,
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const [formData, setFormData] = useState<TableFormData>({
    protocoleEnFrancaisOui: false,
    protocoleEnFrancaisNon: false,
    protocoleObservations: '',
    protocoleCommentaires: '',
    
    cvInvestigateursOui: false,
    cvInvestigateursNon: false,
    cvObservations: '',
    cvCommentaires: '',
    
    noteInformationOui: false,
    noteInformationNon: false,
    noteObservations: '',
    noteCommentaires: '',
    
    certificatAssuranceOui: false,
    certificatAssuranceNon: false,
    certificatAssuranceNA: false,
    certificatObservations: '',
    certificatCommentaires: '',
    
    piecesJustificativesOui: false,
    piecesJustificativesNon: false,
    piecesObservations: '',
    piecesCommentaires: '',
    
    investigateurNomPrenom: '',
    investigateurQualifie: '',
    investigateurObservations: '',
    investigateurCommentaires: '',
    
    investigateursAssociesObservations: '',
    investigateursAssociesCommentaires: '',
    
    justificationObservations: '',
    justificationCommentaires: '',
    
    methodologieObservations: '',
    methodologieCommentaires: '',
    
    budgetObservations: '',
    budgetCommentaires: '',
    
    produitEssaiObservations: '',
    produitEssaiCommentaires: '',
    
    produitComparateurObservations: '',
    produitComparateurCommentaires: '',
    
    produitConcomitantObservations: '',
    produitConcomitantCommentaires: '',
    
    decision: '',
    resumeObservations: '',
    evaluateurs: [''],
    dateEvaluation: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("========================================");
    console.log("PRÉPARATION DE LA SOUMISSION");
    console.log("========================================");
    
    console.log("État du formulaire (formData):", formData);
    
    if (!formData.decision) {
      alert('Veuillez sélectionner une décision finale');
      return;
    }
    
    // Construire le payload avec mapping détaillé
    const payload = {
      // Section 1 - Documents administratifs
      protocolFrench: formData.protocoleEnFrancaisOui ? "Oui" : (formData.protocoleEnFrancaisNon ? "Non" : ""),
      cvSigned: formData.cvInvestigateursOui ? "Oui" : (formData.cvInvestigateursNon ? "Non" : ""),
      consentForm: formData.noteInformationOui ? "Oui" : (formData.noteInformationNon ? "Non" : ""),
      insurance: formData.certificatAssuranceOui ? "Oui" : (formData.certificatAssuranceNon ? "Non" : (formData.certificatAssuranceNA ? "NA" : "")),
      paymentProof: formData.piecesJustificativesOui ? "Oui" : (formData.piecesJustificativesNon ? "Non" : ""),
      
      // Section 2 - Investigateur principal
      investigatorQualified: formData.investigateurQualifie,
      investigatorExplanation: formData.investigateurNomPrenom,
      
      // Section 3 - Investigateurs associés
      associatedInvestigators: formData.investigateursAssociesObservations,
      
      // Section 4 - Justification
      studyJustification: formData.justificationObservations,
      
      // Section 5 - Méthodologie
      methodology: formData.methodologieObservations,
      
      // Section 6 - Budget
      budget: formData.budgetObservations,
      
      // Essais thérapeutiques
      investigationProduct: formData.produitEssaiObservations,
      comparatorProduct: formData.produitComparateurObservations,
      concomitantProduct: formData.produitConcomitantObservations,
      
      // Décision et observations
      decision: formData.decision === 'FAVORABLE' ? 'Favorable' : 
                formData.decision === 'AJOURNE' ? 'Ajourné' : 
                formData.decision === 'NON_FAVORABLE' ? 'Non favorable' : '',
      observations: formData.resumeObservations,
      evaluatorName: formData.evaluateurs[0] || 'Évaluateur',
      
      // Commentaires structurés
      comments: {
        "1": formData.protocoleCommentaires,
        "2": formData.investigateurCommentaires,
        "3": formData.investigateursAssociesCommentaires,
        "4": formData.justificationCommentaires,
        "5": formData.methodologieCommentaires,
        "6": formData.budgetCommentaires,
        "7": formData.produitEssaiCommentaires,
        "8": formData.produitComparateurCommentaires,
        "9": formData.produitConcomitantCommentaires
      },
      
      // CORRECTION: Ajouter la signature (pour l'instant une signature par défaut)
      signatureImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj5TaWduYXR1cmUgw4l2YWx1YXRldXI8L3RleHQ+PC9zdmc+",
      
      submit: true
    };
    
    console.log("--- Section 1 ---");
    console.log("protocolFrench:", payload.protocolFrench);
    console.log("cvSigned:", payload.cvSigned);
    console.log("consentForm:", payload.consentForm);
    console.log("insurance:", payload.insurance);
    console.log("paymentProof:", payload.paymentProof);
    
    console.log("--- Section 2 ---");
    console.log("investigatorQualified:", payload.investigatorQualified);
    console.log("investigatorExplanation:", payload.investigatorExplanation);
    
    console.log("--- Section 3 ---");
    console.log("associatedInvestigators:", payload.associatedInvestigators);
    
    console.log("--- Section 4 ---");
    console.log("studyJustification:", payload.studyJustification);
    
    console.log("--- Section 5 ---");
    console.log("methodology:", payload.methodology);
    
    console.log("--- Section 6 ---");
    console.log("budget:", payload.budget);
    
    console.log("--- Essais thérapeutiques ---");
    console.log("investigationProduct:", payload.investigationProduct);
    console.log("comparatorProduct:", payload.comparatorProduct);
    console.log("concomitantProduct:", payload.concomitantProduct);
    
    console.log("--- Décision ---");
    console.log("decision:", payload.decision);
    console.log("observations:", payload.observations);
    console.log("comments:", payload.comments);
    
    console.log("Payload à envoyer:", JSON.stringify(payload, null, 2));
    console.log("========================================");
    
    // CORRECTION: Envoyer le payload au lieu de formData
    onSubmit(payload);
  };

  const updateField = (field: keyof TableFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg print:shadow-none print:max-w-none">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">GRILLE D'ÉVALUATION DE PROTOCOLE</h1>
        <div className="text-sm">
          <p><strong>Protocole:</strong> {protocol.protocolCode} - {protocol.title}</p>
          <p><strong>Investigateur:</strong> {protocol.principalInvestigator}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black text-sm">
            <thead>
              <tr>
                <th className="border-2 border-black p-2 w-12 bg-gray-100">N°</th>
                <th className="border-2 border-black p-2 w-1/3 bg-gray-100">Critères généraux-Conception-Conduite scientifique</th>
                <th className="border-2 border-black p-2 w-1/3 bg-gray-100">OBSERVATIONS</th>
                <th className="border-2 border-black p-2 w-1/3 bg-gray-100">COMMENTAIRES/AVIS</th>
              </tr>
            </thead>
            <tbody>
              {/* 1. Documents administratifs */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">1.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div className="space-y-4">
                    <div>
                      <strong>Protocole en Français</strong>
                      <div className="mt-1">
                        Fourni : 
                        <label className="ml-2"><input type="checkbox" checked={formData.protocoleEnFrancaisOui} onChange={(e) => updateField('protocoleEnFrancaisOui', e.target.checked)} className="mr-1"/> Oui</label>
                        <label className="ml-2"><input type="checkbox" checked={formData.protocoleEnFrancaisNon} onChange={(e) => updateField('protocoleEnFrancaisNon', e.target.checked)} className="mr-1"/> Non</label>
                      </div>
                    </div>
                    
                    <div>
                      <strong>CV signés des investigateurs</strong>
                      <div className="mt-1">
                        Fournis : 
                        <label className="ml-2"><input type="checkbox" checked={formData.cvInvestigateursOui} onChange={(e) => updateField('cvInvestigateursOui', e.target.checked)} className="mr-1"/> Oui</label>
                        <label className="ml-2"><input type="checkbox" checked={formData.cvInvestigateursNon} onChange={(e) => updateField('cvInvestigateursNon', e.target.checked)} className="mr-1"/> Non</label>
                      </div>
                    </div>
                    
                    <div>
                      <strong>Note/Prospectus d'information du participant et formulaire de consentement éclairé</strong>
                      <div className="mt-1">
                        Fourni : 
                        <label className="ml-2"><input type="checkbox" checked={formData.noteInformationOui} onChange={(e) => updateField('noteInformationOui', e.target.checked)} className="mr-1"/> Oui</label>
                        <label className="ml-2"><input type="checkbox" checked={formData.noteInformationNon} onChange={(e) => updateField('noteInformationNon', e.target.checked)} className="mr-1"/> Non</label>
                      </div>
                    </div>
                    
                    <div>
                      <strong>Certificat d'assurance actualisé et valide pour l'essai clinique</strong>
                      <div className="mt-1">
                        Fourni : 
                        <label className="ml-2"><input type="checkbox" checked={formData.certificatAssuranceOui} onChange={(e) => updateField('certificatAssuranceOui', e.target.checked)} className="mr-1"/> Oui</label>
                        <label className="ml-2"><input type="checkbox" checked={formData.certificatAssuranceNon} onChange={(e) => updateField('certificatAssuranceNon', e.target.checked)} className="mr-1"/> Non</label>
                        <label className="ml-2"><input type="checkbox" checked={formData.certificatAssuranceNA} onChange={(e) => updateField('certificatAssuranceNA', e.target.checked)} className="mr-1"/> NA</label>
                      </div>
                    </div>
                    
                    <div>
                      <strong>Pièces justificatives du paiement des frais de dossiers</strong>
                      <div className="mt-1">
                        Fournies : 
                        <label className="ml-2"><input type="checkbox" checked={formData.piecesJustificativesOui} onChange={(e) => updateField('piecesJustificativesOui', e.target.checked)} className="mr-1"/> Oui</label>
                        <label className="ml-2"><input type="checkbox" checked={formData.piecesJustificativesNon} onChange={(e) => updateField('piecesJustificativesNon', e.target.checked)} className="mr-1"/> Non</label>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.protocoleObservations}
                    onChange={(e) => updateField('protocoleObservations', e.target.value)}
                    rows={15}
                    className="w-full h-full bg-transparent outline-none resize-none"
                    placeholder="Observations sur les documents..."
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.protocoleCommentaires}
                    onChange={(e) => updateField('protocoleCommentaires', e.target.value)}
                    rows={15}
                    className="w-full h-full bg-transparent outline-none resize-none"
                    placeholder="Commentaires/Avis..."
                  />
                </td>
              </tr>

              {/* 2. Investigateur principal */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">2.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div className="space-y-3">
                    <div>
                      <strong>Investigateur principal</strong>
                    </div>
                    <div>
                      <strong>Nom/prénom/qualification/adresse complète</strong>
                      <textarea
                        value={formData.investigateurNomPrenom}
                        onChange={(e) => updateField('investigateurNomPrenom', e.target.value)}
                        rows={2}
                        className="w-full mt-1 p-1 border border-gray-300 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <strong>L'investigateur principal est-il qualifié pour la conduite de cette étude.</strong>
                      <div className="mt-1">Expliquez oui épidémiologiste avec expérience</div>
                      <textarea
                        value={formData.investigateurQualifie}
                        onChange={(e) => updateField('investigateurQualifie', e.target.value)}
                        rows={2}
                        className="w-full mt-1 p-1 border border-gray-300 outline-none resize-none"
                      />
                    </div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.investigateurObservations}
                    onChange={(e) => updateField('investigateurObservations', e.target.value)}
                    rows={8}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.investigateurCommentaires}
                    onChange={(e) => updateField('investigateurCommentaires', e.target.value)}
                    rows={8}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* 3. Investigateurs associés */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">3.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div>
                    <strong>Investigateurs associés</strong>
                    <div className="mt-2">Le nombre d'investigateurs associé est-il pertinent. Sont-ils complémentaires et qualifiés ?</div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.investigateursAssociesObservations}
                    onChange={(e) => updateField('investigateursAssociesObservations', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.investigateursAssociesCommentaires}
                    onChange={(e) => updateField('investigateursAssociesCommentaires', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* 4. Justification et objectifs */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">4.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div>
                    <div className="mb-2">La justification de l'étude est-elle pertinente ? cette étude permettra t'elle d'avoir une réponse à une question prioritaire de recherche dans notre pays ?</div>
                    <div>Les objectifs de l'étude sont ils clairs ?</div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.justificationObservations}
                    onChange={(e) => updateField('justificationObservations', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.justificationCommentaires}
                    onChange={(e) => updateField('justificationCommentaires', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* 5. Méthodologie */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">5.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div>
                    La méthodologie est-elle solide,
                    <div className="mt-1">(type d'étude appropriée, taille de l'échantillon suffisante, collecte des données appropriées, variables de l'étude, )</div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.methodologieObservations}
                    onChange={(e) => updateField('methodologieObservations', e.target.value)}
                    rows={4}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.methodologieCommentaires}
                    onChange={(e) => updateField('methodologieCommentaires', e.target.value)}
                    rows={4}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* 6. Budget */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">6.</td>
                <td className="border-2 border-black p-2 align-top">
                  <strong>Budget de la recherche approprié</strong>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.budgetObservations}
                    onChange={(e) => updateField('budgetObservations', e.target.value)}
                    rows={3}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.budgetCommentaires}
                    onChange={(e) => updateField('budgetCommentaires', e.target.value)}
                    rows={3}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* Section CRITERES SPECIFIQUES */}
              <tr>
                <td colSpan={4} className="border-2 border-black p-2 text-center font-bold bg-gray-200">
                  CRITERES SPECIFIQUES AUX ESSAIS THERAPEUTIQUES
                </td>
              </tr>

              {/* 7. Produit d'essai */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">7.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div className="space-y-2">
                    <div><strong>Produit(s) d'essai ou d'investigation (pertinences de la proposition):</strong></div>
                    <div>Désignation/forme/dosage/Présentation</div>
                    <div>Composition quantitative et qualitative</div>
                    <div>Notice ou données pharmacologiques complètes</div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.produitEssaiObservations}
                    onChange={(e) => updateField('produitEssaiObservations', e.target.value)}
                    rows={6}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.produitEssaiCommentaires}
                    onChange={(e) => updateField('produitEssaiCommentaires', e.target.value)}
                    rows={6}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* 8. Produit comparateur */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">8.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div className="space-y-2">
                    <div><strong>Produit comparateur (si applicable)</strong></div>
                    <div>Désignation/forme/dosage/Présentation</div>
                    <div>Composition quantitative et qualitative</div>
                    <div>Notice ou données pharmacologiques complètes</div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.produitComparateurObservations}
                    onChange={(e) => updateField('produitComparateurObservations', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.produitComparateurCommentaires}
                    onChange={(e) => updateField('produitComparateurCommentaires', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>

              {/* 9. Produit concomitant */}
              <tr>
                <td className="border-2 border-black p-2 text-center font-bold align-top">9.</td>
                <td className="border-2 border-black p-2 align-top">
                  <div className="space-y-2">
                    <div><strong>Produit(s) concomitant (si applicable)</strong></div>
                    <div>Désignation/forme/dosage/Présentation</div>
                    <div>Composition quantitative et qualitative</div>
                    <div>Notice ou données pharmacologiques complètes</div>
                  </div>
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.produitConcomitantObservations}
                    onChange={(e) => updateField('produitConcomitantObservations', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
                <td className="border-2 border-black p-2 align-top">
                  <textarea
                    value={formData.produitConcomitantCommentaires}
                    onChange={(e) => updateField('produitConcomitantCommentaires', e.target.value)}
                    rows={5}
                    className="w-full h-full bg-transparent outline-none resize-none"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Décision finale */}
        <div className="mt-8 border-2 border-black p-4">
          <h3 className="text-lg font-bold mb-4">DÉCISION FINALE</h3>
          <div className="space-y-3 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="decision"
                value="FAVORABLE"
                checked={formData.decision === 'FAVORABLE'}
                onChange={(e) => updateField('decision', e.target.value)}
                className="mr-2"
              />
              <strong>Favorable</strong>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="decision"
                value="AJOURNE"
                checked={formData.decision === 'AJOURNE'}
                onChange={(e) => updateField('decision', e.target.value)}
                className="mr-2"
              />
              <strong>Ajourné</strong> (révisions demandées)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="decision"
                value="NON_FAVORABLE"
                checked={formData.decision === 'NON_FAVORABLE'}
                onChange={(e) => updateField('decision', e.target.value)}
                className="mr-2"
              />
              <strong>Non favorable</strong>
            </label>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Résumé des observations et recommandations:</label>
            <textarea
              value={formData.resumeObservations}
              onChange={(e) => updateField('resumeObservations', e.target.value)}
              rows={6}
              className="w-full p-2 border-2 border-black outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-2">Nom et prénom(s) de l'évaluateur:</label>
              <div className="space-y-2">
                {formData.evaluateurs.map((evaluateur, index) => (
                  <div key={index} className="border-b-2 border-black h-12 flex">
                    <input
                      type="text"
                      value={evaluateur}
                      onChange={(e) => {
                        const newEvaluateurs = [...formData.evaluateurs];
                        newEvaluateurs[index] = e.target.value;
                        updateField('evaluateurs', newEvaluateurs);
                      }}
                      className="flex-1 p-2 bg-transparent outline-none"
                      placeholder={`Évaluateur ${index + 1}`}
                    />
                    {formData.evaluateurs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newEvaluateurs = formData.evaluateurs.filter((_, i) => i !== index);
                          updateField('evaluateurs', newEvaluateurs);
                        }}
                        className="px-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateField('evaluateurs', [...formData.evaluateurs, ''])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Ajouter un évaluateur
                </button>
              </div>
            </div>
            <div>
              <label className="block font-bold mb-2">Date:</label>
              <div className="border-b-2 border-black h-12">
                <input
                  type="date"
                  value={formData.dateEvaluation}
                  onChange={(e) => updateField('dateEvaluation', e.target.value)}
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold mb-2">Signature:</label>
              <div className="border-b-2 border-black h-12">
                {/* Zone vide pour signature manuscrite */}
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-6 print:hidden">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TableEvaluationForm;
