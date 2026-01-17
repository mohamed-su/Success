import React, { useState } from 'react';
import { Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface EvaluationFormData {
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

interface EvaluationFormProps {
  protocol: any;
  onSubmit: (formData: EvaluationFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EvaluationFormData>;
  submitting?: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  protocol,
  onSubmit,
  onCancel,
  initialData = {},
  submitting = false
}) => {
  const [formData, setFormData] = useState<EvaluationFormData>({
    titreEtude: protocol.title || '',
    typeDemandeSubmission: true,
    typeDemandeResoumission: false,
    version: '1.0',
    promoteurEtude: protocol.institution || '',
    investigateurPrincipal: protocol.principalInvestigator || '',
    numeroReference: protocol.protocolCode || '',
    
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
    dateEvaluation: new Date().toISOString().split('T')[0],
    ...initialData
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
    
    onSubmit({ ...formData, decision } as any);
  };

  const updateField = (field: keyof EvaluationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">GRILLE D'ÉVALUATION DE PROTOCOLE</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* INFORMATIONS GÉNÉRALES */}
        <section className="border-2 border-gray-300 p-4 rounded">
          <h3 className="text-lg font-bold mb-4">INFORMATIONS GÉNÉRALES</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Titre de l'étude:</label>
              <input
                type="text"
                value={formData.titreEtude}
                onChange={(e) => updateField('titreEtude', e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex gap-8">
              <div>
                <label className="block font-medium mb-2">Type de demande:</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.typeDemandeSubmission}
                      onChange={(e) => updateField('typeDemandeSubmission', e.target.checked)}
                      className="mr-2"
                    />
                    Soumission
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.typeDemandeResoumission}
                      onChange={(e) => updateField('typeDemandeResoumission', e.target.checked)}
                      className="mr-2"
                    />
                    Re-soumission
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Version:</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => updateField('version', e.target.value)}
                  className="w-32 p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-1">Promoteur de l'étude:</label>
              <input
                type="text"
                value={formData.promoteurEtude}
                onChange={(e) => updateField('promoteurEtude', e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-1">Investigateur Principal de l'étude:</label>
              <input
                type="text"
                value={formData.investigateurPrincipal}
                onChange={(e) => updateField('investigateurPrincipal', e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-1">N° de référence de la demande au CERS:</label>
              <input
                type="text"
                value={formData.numeroReference}
                onChange={(e) => updateField('numeroReference', e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* I. CRITÈRES GÉNÉRAUX */}
        <section className="border-2 border-gray-300 p-4 rounded">
          <h3 className="text-lg font-bold mb-4">I. CRITÈRES GÉNÉRAUX - CONCEPTION ET CONDUITE SCIENTIFIQUE</h3>
          
          {/* 1. Documents administratifs */}
          <div className="mb-6">
            <h4 className="font-bold mb-3">1. Documents administratifs</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Document</th>
                    <th className="border border-gray-300 p-2 text-center">Statut</th>
                    <th className="border border-gray-300 p-2 text-left">Observations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Protocole en Français</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.protocoleEnFrancaisFourni}
                            onChange={(e) => updateField('protocoleEnFrancaisFourni', e.target.checked)}
                            className="mr-1"
                          />
                          Fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.protocoleEnFrancaisNonFourni}
                            onChange={(e) => updateField('protocoleEnFrancaisNonFourni', e.target.checked)}
                            className="mr-1"
                          />
                          Non fourni
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.protocoleEnFrancaisObservations}
                        onChange={(e) => updateField('protocoleEnFrancaisObservations', e.target.value)}
                        className="w-full p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-gray-300 p-2">CV signés des investigateurs</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.cvInvestigateursFournis}
                            onChange={(e) => updateField('cvInvestigateursFournis', e.target.checked)}
                            className="mr-1"
                          />
                          Fournis
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.cvInvestigateursNonFournis}
                            onChange={(e) => updateField('cvInvestigateursNonFournis', e.target.checked)}
                            className="mr-1"
                          />
                          Non fournis
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.cvInvestigateursObservations}
                        onChange={(e) => updateField('cvInvestigateursObservations', e.target.value)}
                        className="w-full p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-gray-300 p-2">Note/Prospectus d'information du participant et formulaire de consentement éclairé</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.noteInformationFournie}
                            onChange={(e) => updateField('noteInformationFournie', e.target.checked)}
                            className="mr-1"
                          />
                          Fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.noteInformationNonFournie}
                            onChange={(e) => updateField('noteInformationNonFournie', e.target.checked)}
                            className="mr-1"
                          />
                          Non fourni
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.noteInformationObservations}
                        onChange={(e) => updateField('noteInformationObservations', e.target.value)}
                        className="w-full p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-gray-300 p-2">Certificat d'assurance actualisé et valide pour l'essai clinique</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certificatAssuranceFourni}
                            onChange={(e) => updateField('certificatAssuranceFourni', e.target.checked)}
                            className="mr-1"
                          />
                          Fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certificatAssuranceNonFourni}
                            onChange={(e) => updateField('certificatAssuranceNonFourni', e.target.checked)}
                            className="mr-1"
                          />
                          Non fourni
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certificatAssuranceNA}
                            onChange={(e) => updateField('certificatAssuranceNA', e.target.checked)}
                            className="mr-1"
                          />
                          NA
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.certificatAssuranceObservations}
                        onChange={(e) => updateField('certificatAssuranceObservations', e.target.value)}
                        className="w-full p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border border-gray-300 p-2">Pièces justificatives du paiement des frais de dossiers</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.piecesJustificativesFournies}
                            onChange={(e) => updateField('piecesJustificativesFournies', e.target.checked)}
                            className="mr-1"
                          />
                          Fournies
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.piecesJustificativesNonFournies}
                            onChange={(e) => updateField('piecesJustificativesNonFournies', e.target.checked)}
                            className="mr-1"
                          />
                          Non fournies
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.piecesJustificativesObservations}
                        onChange={(e) => updateField('piecesJustificativesObservations', e.target.value)}
                        className="w-full p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <label className="block font-medium mb-2">Commentaires/Avis:</label>
              <textarea
                value={formData.commentairesDocuments}
                onChange={(e) => updateField('commentairesDocuments', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Décision finale */}
        <section className="border-2 border-gray-300 p-4 rounded">
          <h3 className="text-lg font-bold mb-4">IV. AVIS SUR L'ENSEMBLE DU DOSSIER</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-3">Décision finale:</label>
              <div className="space-y-2">
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
                    className="mr-2"
                  />
                  <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                  <strong>Favorable</strong>
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
                    className="mr-2"
                  />
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-1" />
                  <strong>Ajourné</strong> (révisions demandées)
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
                    className="mr-2"
                  />
                  <XCircle className="w-5 h-5 text-red-600 mr-1" />
                  <strong>Non favorable</strong>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Résumé des observations sur le protocole et recommandations:
              </label>
              <textarea
                value={formData.resumeObservations}
                onChange={(e) => updateField('resumeObservations', e.target.value)}
                rows={8}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                placeholder="Résumé détaillé des observations et recommandations..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Nom et prénom(s) de l'évaluateur:</label>
                <input
                  type="text"
                  value={formData.evaluateurNom}
                  onChange={(e) => updateField('evaluateurNom', e.target.value)}
                  className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Date:</label>
                <input
                  type="date"
                  value={formData.dateEvaluation}
                  onChange={(e) => updateField('dateEvaluation', e.target.value)}
                  className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-2">Signature:</label>
              <div className="w-full h-16 border-b-2 border-gray-300"></div>
            </div>
          </div>
        </section>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Enregistrement...' : 'Enregistrer l\'Évaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
