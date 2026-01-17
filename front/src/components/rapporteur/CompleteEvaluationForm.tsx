import React, { useState } from 'react';
import { Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CompleteFormData {
  // Informations générales
  titreEtude: string;
  typeDemandeSubmission: boolean;
  typeDemandeResoumission: boolean;
  version: string;
  promoteurEtude: string;
  investigateurPrincipal: string;
  numeroReference: string;
  
  // Documents administratifs
  protocoleEnFrancaisFourni: boolean;
  protocoleEnFrancaisNonFourni: boolean;
  protocoleEnFrancaisObservations: string;
  cvInvestigateursFournis: boolean;
  cvInvestigateursNonFournis: boolean;
  cvInvestigateursObservations: string;
  noteInformationFournie: boolean;
  noteInformationNonFournie: boolean;
  noteInformationObservations: string;
  certificatAssuranceFourni: boolean;
  certificatAssuranceNonFourni: boolean;
  certificatAssuranceNA: boolean;
  certificatAssuranceObservations: string;
  piecesJustificativesFournies: boolean;
  piecesJustificativesNonFournies: boolean;
  piecesJustificativesObservations: string;
  commentairesDocuments: string;
  
  // Investigateur principal
  nomPrenomQualificationAdresse: string;
  investigateurQualifieOui: boolean;
  investigateurQualifieNon: boolean;
  justificationInvestigateur: string;
  commentairesInvestigateur: string;
  
  // Investigateurs associés
  investigateursAssociesPerinentsOui: boolean;
  investigateursAssociesPerinentsNon: boolean;
  observationsInvestigateursAssocies: string;
  commentairesInvestigateursAssocies: string;
  
  // Justification et objectifs
  justificationPertinenteOui: boolean;
  justificationPertinenteNon: boolean;
  objectifsClaireOui: boolean;
  objectifsClaireNon: boolean;
  observationsObjectifs: string;
  commentairesObjectifs: string;
  
  // Méthodologie
  methodologieSolideOui: boolean;
  methodologieSolideNon: boolean;
  typeEtudeAproprie: boolean;
  tailleEchantillonSuffisante: boolean;
  collecteDonneesApropriee: boolean;
  variablesEtudePerinentes: boolean;
  observationsMethodologie: string;
  commentairesMethodologie: string;
  
  // Budget
  budgetAproprieOui: boolean;
  budgetAproprieNon: boolean;
  observationsBudget: string;
  commentairesBudget: string;
  
  // Produits d'essai
  produitEssaiPerinenceOui: boolean;
  produitEssaiPerinenceNon: boolean;
  produitEssaiPerinenceNA: boolean;
  produitEssaiDesignation: string;
  produitEssaiComposition: string;
  produitEssaiNoticeFourni: boolean;
  produitEssaiNoticeNonFourni: boolean;
  observationsProduitEssai: string;
  commentairesProduitEssai: string;
  
  // Produit comparateur
  produitComparateurDesignation: string;
  produitComparateurComposition: string;
  produitComparateurNoticeFourni: boolean;
  produitComparateurNoticeNonFourni: boolean;
  observationsProduitComparateur: string;
  commentairesProduitComparateur: string;
  
  // Produit concomitant
  produitConcomitantDesignation: string;
  produitConcomitantComposition: string;
  produitConcomitantNoticeFourni: boolean;
  produitConcomitantNoticeNonFourni: boolean;
  observationsProduitConcomitant: string;
  commentairesProduitConcomitant: string;
  
  // Évaluation éthique - Bienfaisance
  risquesBenefices: string;
  mesuresReductionRisquesOui: boolean;
  mesuresReductionRisquesNon: boolean;
  observationsBienfaisance: string;
  
  // Évaluation éthique - Autonomie
  dispositionsConsentement: string;
  dispositionsPerinentesEfficacesOui: boolean;
  dispositionsPerinentesEfficacesNon: boolean;
  observationsAutonomie: string;
  
  // Évaluation éthique - Justice
  dispositifsCompensation: string;
  observationsJustice: string;
  
  // Décision finale
  decisionFavorable: boolean;
  decisionAjourne: boolean;
  decisionNonFavorable: boolean;
  resumeObservations: string;
  
  // Métadonnées
  evaluateurNom: string;
  dateEvaluation: string;
}

interface CompleteEvaluationFormProps {
  protocol: any;
  onSubmit: (formData: CompleteFormData) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const CompleteEvaluationForm: React.FC<CompleteEvaluationFormProps> = ({
  protocol,
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const [formData, setFormData] = useState<CompleteFormData>({
    titreEtude: protocol.title || '',
    typeDemandeSubmission: true,
    typeDemandeResoumission: false,
    version: '1.0',
    promoteurEtude: protocol.institution || '',
    investigateurPrincipal: protocol.principalInvestigator || '',
    numeroReference: protocol.protocolCode || '',
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>('');
    
    protocoleEnFrancaisFourni: false,
    protocoleEnFrancaisNonFourni: false,
    protocoleEnFrancaisObservations: '',
    cvInvestigateursFournis: false,
    cvInvestigateursNonFournis: false,
    cvInvestigateursObservations: '',
    noteInformationFournie: false,
    noteInformationNonFournie: false,
    noteInformationObservations: '',
    certificatAssuranceFourni: false,
    certificatAssuranceNonFourni: false,
    certificatAssuranceNA: false,
    certificatAssuranceObservations: '',
    piecesJustificativesFournies: false,
    piecesJustificativesNonFournies: false,
    piecesJustificativesObservations: '',
    commentairesDocuments: '',
    
    nomPrenomQualificationAdresse: '',
    investigateurQualifieOui: false,
    investigateurQualifieNon: false,
    justificationInvestigateur: '',
    commentairesInvestigateur: '',
    
    investigateursAssociesPerinentsOui: false,
    investigateursAssociesPerinentsNon: false,
    observationsInvestigateursAssocies: '',
    commentairesInvestigateursAssocies: '',
    
    justificationPertinenteOui: false,
    justificationPertinenteNon: false,
    objectifsClaireOui: false,
    objectifsClaireNon: false,
    observationsObjectifs: '',
    commentairesObjectifs: '',
    
    methodologieSolideOui: false,
    methodologieSolideNon: false,
    typeEtudeAproprie: false,
    tailleEchantillonSuffisante: false,
    collecteDonneesApropriee: false,
    variablesEtudePerinentes: false,
    observationsMethodologie: '',
    commentairesMethodologie: '',
    
    budgetAproprieOui: false,
    budgetAproprieNon: false,
    observationsBudget: '',
    commentairesBudget: '',
    
    produitEssaiPerinenceOui: false,
    produitEssaiPerinenceNon: false,
    produitEssaiPerinenceNA: false,
    produitEssaiDesignation: '',
    produitEssaiComposition: '',
    produitEssaiNoticeFourni: false,
    produitEssaiNoticeNonFourni: false,
    observationsProduitEssai: '',
    commentairesProduitEssai: '',
    
    produitComparateurDesignation: '',
    produitComparateurComposition: '',
    produitComparateurNoticeFourni: false,
    produitComparateurNoticeNonFourni: false,
    observationsProduitComparateur: '',
    commentairesProduitComparateur: '',
    
    produitConcomitantDesignation: '',
    produitConcomitantComposition: '',
    produitConcomitantNoticeFourni: false,
    produitConcomitantNoticeNonFourni: false,
    observationsProduitConcomitant: '',
    commentairesProduitConcomitant: '',
    
    risquesBenefices: '',
    mesuresReductionRisquesOui: false,
    mesuresReductionRisquesNon: false,
    observationsBienfaisance: '',
    
    dispositionsConsentement: '',
    dispositionsPerinentesEfficacesOui: false,
    dispositionsPerinentesEfficacesNon: false,
    observationsAutonomie: '',
    
    dispositifsCompensation: '',
    observationsJustice: '',
    
    decisionFavorable: false,
    decisionAjourne: false,
    decisionNonFavorable: false,
    resumeObservations: '',
    
    evaluateurNom: '',
    dateEvaluation: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let decision = '';
    if (formData.decisionFavorable) decision = 'FAVORABLE';
    else if (formData.decisionAjourne) decision = 'AJOURNE';
    else if (formData.decisionNonFavorable) decision = 'NON_FAVORABLE';
    
    if (!decision) {
      alert('Veuillez sélectionner une décision finale');
      return;
    }
    
    // Ajouter la signature à formData si elle existe
    const finalFormData = {
      ...formData,
      decision,
      signatureImage: signaturePreview
    };
    
    onSubmit(finalFormData);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 2MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }
      
      setSignatureFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignaturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignatureFile(null);
    setSignaturePreview('');
  };

  const updateField = (field: keyof CompleteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg print:shadow-none print:max-w-none">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">GRILLE D'ÉVALUATION DE PROTOCOLE</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* INFORMATIONS GÉNÉRALES */}
        <section className="border-2 border-black p-6 rounded print:border-black">
          <h2 className="text-xl font-bold mb-6">INFORMATIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="font-bold mr-4 min-w-[200px]">Titre de l'étude :</label>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={formData.titreEtude}
                  onChange={(e) => updateField('titreEtude', e.target.value)}
                  className="w-full p-1 bg-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center">
                <label className="font-bold mr-4">Type de demande :</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.typeDemandeSubmission}
                      onChange={(e) => updateField('typeDemandeSubmission', e.target.checked)}
                      className="mr-2 w-4 h-4"
                    />
                    Soumission
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.typeDemandeResoumission}
                      onChange={(e) => updateField('typeDemandeResoumission', e.target.checked)}
                      className="mr-2 w-4 h-4"
                    />
                    Re-soumission
                  </label>
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="font-bold mr-4">Version :</label>
                <div className="border-b-2 border-black w-32">
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => updateField('version', e.target.value)}
                    className="w-full p-1 bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-bold mr-4 min-w-[200px]">Promoteur de l'étude :</label>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={formData.promoteurEtude}
                  onChange={(e) => updateField('promoteurEtude', e.target.value)}
                  className="w-full p-1 bg-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-bold mr-4 min-w-[200px]">Investigateur Principal de l'étude :</label>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={formData.investigateurPrincipal}
                  onChange={(e) => updateField('investigateurPrincipal', e.target.value)}
                  className="w-full p-1 bg-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-bold mr-4 min-w-[200px]">N° de référence de la demande au CERS :</label>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={formData.numeroReference}
                  onChange={(e) => updateField('numeroReference', e.target.value)}
                  className="w-full p-1 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* I. CRITÈRES GÉNÉRAUX */}
        <section className="border-2 border-black p-6 rounded print:border-black">
          <h2 className="text-xl font-bold mb-6">I. CRITÈRES GÉNÉRAUX - CONCEPTION ET CONDUITE SCIENTIFIQUE</h2>
          
          {/* 1. Documents administratifs */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">1. Documents administratifs</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-black">
                <thead>
                  <tr>
                    <th className="border border-black p-3 text-left font-bold bg-gray-100">Document</th>
                    <th className="border border-black p-3 text-center font-bold bg-gray-100">Statut</th>
                    <th className="border border-black p-3 text-left font-bold bg-gray-100">Observations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-3">Protocole en Français</td>
                    <td className="border border-black p-3 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.protocoleEnFrancaisFourni}
                            onChange={(e) => updateField('protocoleEnFrancaisFourni', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.protocoleEnFrancaisNonFourni}
                            onChange={(e) => updateField('protocoleEnFrancaisNonFourni', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Non fourni
                        </label>
                      </div>
                    </td>
                    <td className="border border-black p-3">
                      <input
                        type="text"
                        value={formData.protocoleEnFrancaisObservations}
                        onChange={(e) => updateField('protocoleEnFrancaisObservations', e.target.value)}
                        className="w-full p-1 bg-transparent outline-none border-b border-gray-400"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-black p-3">CV signés des investigateurs</td>
                    <td className="border border-black p-3 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.cvInvestigateursFournis}
                            onChange={(e) => updateField('cvInvestigateursFournis', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Fournis
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.cvInvestigateursNonFournis}
                            onChange={(e) => updateField('cvInvestigateursNonFournis', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Non fournis
                        </label>
                      </div>
                    </td>
                    <td className="border border-black p-3">
                      <input
                        type="text"
                        value={formData.cvInvestigateursObservations}
                        onChange={(e) => updateField('cvInvestigateursObservations', e.target.value)}
                        className="w-full p-1 bg-transparent outline-none border-b border-gray-400"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-black p-3">Note/Prospectus d'information du participant et formulaire de consentement éclairé</td>
                    <td className="border border-black p-3 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.noteInformationFournie}
                            onChange={(e) => updateField('noteInformationFournie', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.noteInformationNonFournie}
                            onChange={(e) => updateField('noteInformationNonFournie', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Non fourni
                        </label>
                      </div>
                    </td>
                    <td className="border border-black p-3">
                      <input
                        type="text"
                        value={formData.noteInformationObservations}
                        onChange={(e) => updateField('noteInformationObservations', e.target.value)}
                        className="w-full p-1 bg-transparent outline-none border-b border-gray-400"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-black p-3">Certificat d'assurance actualisé et valide pour l'essai clinique</td>
                    <td className="border border-black p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certificatAssuranceFourni}
                            onChange={(e) => updateField('certificatAssuranceFourni', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certificatAssuranceNonFourni}
                            onChange={(e) => updateField('certificatAssuranceNonFourni', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Non fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certificatAssuranceNA}
                            onChange={(e) => updateField('certificatAssuranceNA', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          NA
                        </label>
                      </div>
                    </td>
                    <td className="border border-black p-3">
                      <input
                        type="text"
                        value={formData.certificatAssuranceObservations}
                        onChange={(e) => updateField('certificatAssuranceObservations', e.target.value)}
                        className="w-full p-1 bg-transparent outline-none border-b border-gray-400"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-black p-3">Pièces justificatives du paiement des frais de dossiers</td>
                    <td className="border border-black p-3 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.piecesJustificativesFournies}
                            onChange={(e) => updateField('piecesJustificativesFournies', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Fournies
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.piecesJustificativesNonFournies}
                            onChange={(e) => updateField('piecesJustificativesNonFournies', e.target.checked)}
                            className="mr-1 w-4 h-4"
                          />
                          Non fournies
                        </label>
                      </div>
                    </td>
                    <td className="border border-black p-3">
                      <input
                        type="text"
                        value={formData.piecesJustificativesObservations}
                        onChange={(e) => updateField('piecesJustificativesObservations', e.target.value)}
                        className="w-full p-1 bg-transparent outline-none border-b border-gray-400"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <label className="block font-bold mb-2">Commentaires/Avis :</label>
              <div className="border-b-2 border-black">
                <textarea
                  value={formData.commentairesDocuments}
                  onChange={(e) => updateField('commentairesDocuments', e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Investigateur principal */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">2. Investigateur principal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Nom/Prénom/Qualification/Adresse complète :</label>
                <div className="border-b-2 border-black">
                  <textarea
                    value={formData.nomPrenomQualificationAdresse}
                    onChange={(e) => updateField('nomPrenomQualificationAdresse', e.target.value)}
                    rows={2}
                    className="w-full p-2 bg-transparent outline-none resize-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-bold mb-2">L'investigateur principal est-il qualifié pour la conduite de cette étude ?</label>
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.investigateurQualifieOui}
                      onChange={(e) => updateField('investigateurQualifieOui', e.target.checked)}
                      className="mr-2 w-4 h-4"
                    />
                    Oui
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.investigateurQualifieNon}
                      onChange={(e) => updateField('investigateurQualifieNon', e.target.checked)}
                      className="mr-2 w-4 h-4"
                    />
                    Non
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block font-bold mb-2">Justification :</label>
                <div className="border-b-2 border-black">
                  <textarea
                    value={formData.justificationInvestigateur}
                    onChange={(e) => updateField('justificationInvestigateur', e.target.value)}
                    rows={2}
                    className="w-full p-2 bg-transparent outline-none resize-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-bold mb-2">Commentaires/Avis :</label>
                <div className="border-b-2 border-black">
                  <textarea
                    value={formData.commentairesInvestigateur}
                    onChange={(e) => updateField('commentairesInvestigateur', e.target.value)}
                    rows={2}
                    className="w-full p-2 bg-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Décision finale */}
        <section className="border-2 border-black p-6 rounded print:border-black">
          <h2 className="text-xl font-bold mb-6">IV. AVIS SUR L'ENSEMBLE DU DOSSIER</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-4">Décision finale :</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.decisionFavorable}
                    onChange={(e) => {
                      updateField('decisionFavorable', e.target.checked);
                      if (e.target.checked) {
                        updateField('decisionAjourne', false);
                        updateField('decisionNonFavorable', false);
                      }
                    }}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold text-lg">Favorable</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.decisionAjourne}
                    onChange={(e) => {
                      updateField('decisionAjourne', e.target.checked);
                      if (e.target.checked) {
                        updateField('decisionFavorable', false);
                        updateField('decisionNonFavorable', false);
                      }
                    }}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold text-lg">Ajourné</span> <span className="ml-2">(révisions demandées)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.decisionNonFavorable}
                    onChange={(e) => {
                      updateField('decisionNonFavorable', e.target.checked);
                      if (e.target.checked) {
                        updateField('decisionFavorable', false);
                        updateField('decisionAjourne', false);
                      }
                    }}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold text-lg">Non favorable</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">
                Résumé des observations sur le protocole et recommandations :
              </label>
              <div className="border-2 border-black">
                <textarea
                  value={formData.resumeObservations}
                  onChange={(e) => updateField('resumeObservations', e.target.value)}
                  rows={8}
                  className="w-full p-3 bg-transparent outline-none resize-none"
                  placeholder="Résumé détaillé des observations et recommandations..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block font-bold mb-2">Nom et prénom(s) de l'évaluateur :</label>
                <div className="border-b-2 border-black">
                  <input
                    type="text"
                    value={formData.evaluateurNom}
                    onChange={(e) => updateField('evaluateurNom', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-2">Date :</label>
                <div className="border-b-2 border-black">
                  <input
                    type="date"
                    value={formData.dateEvaluation}
                    onChange={(e) => updateField('dateEvaluation', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block font-bold mb-2">Signature :</label>
              <div className="space-y-3">
                {!signaturePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
                    >
                      📁 Uploader Signature
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 2MB</p>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">Signature uploadée :</span>
                      <button
                        type="button"
                        onClick={removeSignature}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="max-h-20 max-w-full border border-gray-200 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t print:hidden">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {submitting ? 'Enregistrement...' : 'Enregistrer l\'Évaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteEvaluationForm;
