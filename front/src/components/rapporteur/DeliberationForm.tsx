import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface DeliberationFormData {
  // Informations de base
  deliberationNumber: string;
  researchTitle: string;
  protocolReference: string;
  documentation: string;
  applicantReference: string;
  researchSite: string;
  deliberationDate: string;
  
  // Éléments examinés (checkboxes)
  protocolExamined: boolean;
  informationNoticeExamined: boolean;
  consentFormExamined: boolean;
  investigatorCVExamined: boolean;
  insuranceCertificateExamined: boolean;
  paymentProofExamined: boolean;
  
  // Observations
  observations: string;
  
  // Membres ayant siégé (dynamique)
  members: string[];
  
  // Avis du comité
  committeeOpinion: 'FAVORABLE' | 'AJOURNE' | 'NON_FAVORABLE' | '';
  
  // Réserves et recommandations
  reserves: string;
  recommendations: string;
  
  // Signatures
  rapporteurSignature: string;
  presidentSignature: string;
}

interface DeliberationFormProps {
  protocol: any;
  onSubmit: (formData: DeliberationFormData) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const DeliberationForm: React.FC<DeliberationFormProps> = ({
  protocol,
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const [formData, setFormData] = useState<DeliberationFormData>({
    deliberationNumber: `DEL-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    researchTitle: protocol.title || '',
    protocolReference: protocol.protocolCode || '',
    documentation: 'Dossier complet',
    applicantReference: protocol.principalInvestigator || '',
    researchSite: protocol.institution || '',
    deliberationDate: new Date().toISOString().split('T')[0],
    
    protocolExamined: true,
    informationNoticeExamined: true,
    consentFormExamined: true,
    investigatorCVExamined: true,
    insuranceCertificateExamined: false,
    paymentProofExamined: true,
    
    observations: '',
    
    members: ['', '', '', '', '', ''], // 6 membres par défaut
    
    committeeOpinion: '',
    reserves: '',
    recommendations: '',
    
    rapporteurSignature: '',
    presidentSignature: ''
  });
  
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.committeeOpinion) {
      alert('Veuillez sélectionner un avis du comité');
      return;
    }
    onSubmit(formData);
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

  const handleAddMoreMembers = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, '']
    }));
  };

  const updateMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => i === index ? value : member)
    }));
  };

  const updateField = (field: keyof DeliberationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg print:shadow-none print:max-w-none">
      {/* En-tête officiel */}
      <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
        <h1 className="text-2xl font-bold mb-2">BURKINA FASO</h1>
        <p className="text-lg">Unité - Travail - Progrès</p>
        <div className="mt-4">
          <h2 className="text-xl font-bold">MINISTÈRE DE LA SANTÉ</h2>
          <h3 className="text-lg font-semibold mt-2">COMITÉ D'ÉTHIQUE POUR LA RECHERCHE EN SANTÉ</h3>
          <h4 className="text-lg font-bold mt-4 underline">DÉLIBÉRATION</h4>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informations de base */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2">Délibération N°:</label>
            <input
              type="text"
              value={formData.deliberationNumber}
              onChange={(e) => updateField('deliberationNumber', e.target.value)}
              className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none font-medium"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Date de délibération:</label>
            <input
              type="date"
              value={formData.deliberationDate}
              onChange={(e) => updateField('deliberationDate', e.target.value)}
              className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2">Titre de la recherche:</label>
          <textarea
            value={formData.researchTitle}
            onChange={(e) => updateField('researchTitle', e.target.value)}
            rows={2}
            className="w-full p-2 border-2 border-gray-800 outline-none resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2">Référence du protocole:</label>
            <input
              type="text"
              value={formData.protocolReference}
              onChange={(e) => updateField('protocolReference', e.target.value)}
              className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Documentation:</label>
            <input
              type="text"
              value={formData.documentation}
              onChange={(e) => updateField('documentation', e.target.value)}
              className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2">Référence du demandeur:</label>
            <input
              type="text"
              value={formData.applicantReference}
              onChange={(e) => updateField('applicantReference', e.target.value)}
              className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Site de la recherche:</label>
            <input
              type="text"
              value={formData.researchSite}
              onChange={(e) => updateField('researchSite', e.target.value)}
              className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Section 2: Éléments examinés */}
        <div className="border-2 border-gray-800 p-4">
          <h3 className="text-lg font-bold mb-4">ÉLÉMENTS EXAMINÉS</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.protocolExamined}
                onChange={(e) => updateField('protocolExamined', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-medium">Protocole de recherche</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.informationNoticeExamined}
                onChange={(e) => updateField('informationNoticeExamined', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-medium">Notice d'information</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.consentFormExamined}
                onChange={(e) => updateField('consentFormExamined', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-medium">Formulaire de consentement</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.investigatorCVExamined}
                onChange={(e) => updateField('investigatorCVExamined', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-medium">CV de l'investigateur</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.insuranceCertificateExamined}
                onChange={(e) => updateField('insuranceCertificateExamined', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-medium">Certificat d'assurance</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.paymentProofExamined}
                onChange={(e) => updateField('paymentProofExamined', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-medium">Justificatif de paiement</span>
            </label>
          </div>
        </div>

        {/* Section 3: Observations */}
        <div>
          <label className="block font-bold mb-2">OBSERVATIONS:</label>
          <textarea
            value={formData.observations}
            onChange={(e) => updateField('observations', e.target.value)}
            rows={6}
            className="w-full p-3 border-2 border-gray-800 outline-none resize-none"
            placeholder="Observations détaillées sur le protocole de recherche..."
          />
        </div>

        {/* Section 4: Membres ayant siégé */}
        <div className="border-2 border-gray-800 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">MEMBRES AYANT SIÉGÉ</h3>
            <button
              type="button"
              onClick={handleAddMoreMembers}
              className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 flex items-center gap-1 text-sm font-bold"
              title="Ajouter automatiquement plus de membres"
            >
              <span className="text-lg">+</span>
              Ajouter Membres
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {formData.members.map((member, index) => (
              <div key={index}>
                <label className="block font-medium mb-1">Membre {index + 1}:</label>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(index, e.target.value)}
                  className="w-full p-2 border-b border-gray-600 bg-transparent outline-none"
                  placeholder={`Nom et prénom du membre ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Avis du comité */}
        <div className="border-2 border-gray-800 p-4">
          <h3 className="text-lg font-bold mb-4">AVIS DU COMITÉ</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="committeeOpinion"
                value="FAVORABLE"
                checked={formData.committeeOpinion === 'FAVORABLE'}
                onChange={(e) => updateField('committeeOpinion', e.target.value)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-bold text-green-700">FAVORABLE</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="committeeOpinion"
                value="AJOURNE"
                checked={formData.committeeOpinion === 'AJOURNE'}
                onChange={(e) => updateField('committeeOpinion', e.target.value)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-bold text-yellow-700">AJOURNÉ</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="committeeOpinion"
                value="NON_FAVORABLE"
                checked={formData.committeeOpinion === 'NON_FAVORABLE'}
                onChange={(e) => updateField('committeeOpinion', e.target.value)}
                className="mr-3 w-4 h-4"
              />
              <span className="font-bold text-red-700">NON FAVORABLE</span>
            </label>
          </div>
        </div>

        {/* Section 6: Réserves */}
        <div>
          <label className="block font-bold mb-2">RÉSERVES:</label>
          <textarea
            value={formData.reserves}
            onChange={(e) => updateField('reserves', e.target.value)}
            rows={4}
            className="w-full p-3 border-2 border-gray-800 outline-none resize-none"
            placeholder="Réserves émises par le comité (si applicable)..."
          />
        </div>

        {/* Section 7: Recommandations */}
        <div>
          <label className="block font-bold mb-2">RECOMMANDATIONS:</label>
          <textarea
            value={formData.recommendations}
            onChange={(e) => updateField('recommendations', e.target.value)}
            rows={4}
            className="w-full p-3 border-2 border-gray-800 outline-none resize-none"
            placeholder="Recommandations du comité..."
          />
        </div>

        {/* Section 8: Signatures */}
        <div className="border-2 border-gray-800 p-4">
          <h3 className="text-lg font-bold mb-4">SIGNATURES</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block font-bold mb-2">Le Rapporteur:</label>
              <input
                type="text"
                value={formData.rapporteurSignature}
                onChange={(e) => updateField('rapporteurSignature', e.target.value)}
                className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none mb-4"
                placeholder="Nom et prénom"
              />
              
              {/* Zone d'upload de signature */}
              <div className="mb-4">
                {!signaturePreview ? (
                  <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2 text-sm"
                    >
                      📁 Upload Signature
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 2MB</p>
                  </div>
                ) : (
                  <div className="border border-gray-400 rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">Signature:</span>
                      <button
                        type="button"
                        onClick={removeSignature}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="max-h-12 max-w-full border border-gray-200 rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="h-16 border-b-2 border-gray-800">
                <p className="text-sm text-gray-600 mt-12">Signature</p>
              </div>
            </div>
            <div>
              <label className="block font-bold mb-2">Le Président:</label>
              <input
                type="text"
                value={formData.presidentSignature}
                onChange={(e) => updateField('presidentSignature', e.target.value)}
                className="w-full p-2 border-b-2 border-gray-800 bg-transparent outline-none mb-4"
                placeholder="Nom et prénom"
              />
              <div className="h-16 border-b-2 border-gray-800">
                <p className="text-sm text-gray-600 mt-12">Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-800 print:hidden">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-400 rounded text-gray-700 hover:bg-gray-50 font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 font-medium"
          >
            <Save className="w-5 h-5" />
            {submitting ? 'Enregistrement...' : 'Enregistrer la Délibération'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliberationForm;
