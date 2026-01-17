import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, FileText, Users, DollarSign, Calendar, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import ConfirmationToast from '../../components/common/ConfirmationToast';
import { apiService } from '../../services/apiService';

const EditProtocol = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [protocol, setProtocol] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    studyType: '',
    principalInvestigator: '',
    institution: '',
    duration: '',
    participants: '',
    paymentReceipt: null,
    protocolFile: null,
    consentForm: null,
    cvFiles: null,
    ethicsConsiderations: ''
  });

  const steps = [
    { id: 1, name: 'Informations Générales', icon: FileText },
    { id: 2, name: 'Documents Requis', icon: Upload },
    { id: 3, name: 'Reçu de Paiement', icon: DollarSign },
    { id: 4, name: 'Révision et Soumission', icon: CheckCircle }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'info' | 'success' | 'error' | 'warning' });

  // Charger les détails du protocole
  useEffect(() => {
    const loadProtocol = async () => {
      if (!id) return;
      
      try {
        const response = await apiService.getProtocolDetails(id);
        if (response.success && response.data.protocol) {
          const p = response.data.protocol;
          
          // Vérifier que le protocole peut être modifié
          if (!['VERIFICATION_REJECTED', 'REJECTED', 'DRAFT'].includes(p.status)) {
            setToast({
              show: true,
              message: 'Ce protocole ne peut plus être modifié',
              type: 'error'
            });
            setTimeout(() => navigate('/dashboard/researcher/protocols'), 2000);
            return;
          }
          
          setProtocol(p);
          setFormData({
            title: p.title || '',
            studyType: p.studyType || '',
            principalInvestigator: p.principalInvestigator || '',
            institution: p.institution || '',
            duration: p.duration?.toString() || '',
            participants: p.participants?.toString() || '',
            paymentReceipt: null,
            protocolFile: null,
            consentForm: null,
            cvFiles: null,
            ethicsConsiderations: p.ethicsConsiderations || ''
          });
        } else {
          setToast({
            show: true,
            message: 'Protocole non trouvé',
            type: 'error'
          });
          navigate('/dashboard/researcher/protocols');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du protocole:', error);
        setToast({
          show: true,
          message: 'Erreur lors du chargement du protocole',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProtocol();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      // Vérifier la taille du fichier (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes
      if (file.size > maxSize) {
        setToast({
          show: true,
          message: `Le fichier ${file.name} est trop volumineux. Taille maximale autorisée : 10MB`,
          type: 'error'
        });
        e.target.value = ''; // Reset le champ
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitConfirmation(false);

    try {
      // Créer un FormData pour envoyer les fichiers
      const submitData = new FormData();

      // Ajouter les champs texte seulement s'ils ont changé
      submitData.append('title', formData.title);
      submitData.append('description', `Type d'étude: ${formData.studyType}\nInvestigateur principal: ${formData.principalInvestigator}\nInstitution: ${formData.institution}\nDurée: ${formData.duration} mois\nParticipants: ${formData.participants}\nConsidérations éthiques: ${formData.ethicsConsiderations}`);
      submitData.append('studyType', formData.studyType);
      submitData.append('principalInvestigator', formData.principalInvestigator);
      submitData.append('institution', formData.institution);
      submitData.append('duration', formData.duration);
      submitData.append('participants', formData.participants);
      submitData.append('ethicsConsiderations', formData.ethicsConsiderations);

      // Ajouter les fichiers seulement s'ils ont été modifiés
      if (formData.protocolFile) {
        submitData.append('protocolFile', formData.protocolFile);
      }
      if (formData.consentForm) {
        submitData.append('consentForm', formData.consentForm);
      }
      if (formData.cvFiles) {
        submitData.append('cvFiles', formData.cvFiles);
      }
      if (formData.paymentReceipt) {
        submitData.append('paymentReceipt', formData.paymentReceipt);
      }

      // Appeler l'API backend pour mettre à jour
      const response = await apiService.updateExistingProtocol(id!, submitData);

      if (response.success) {
        setShowConfirmation(true);
      } else {
        setToast({
          show: true,
          message: response.error || 'Erreur lors de la mise à jour du protocole',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setToast({
        show: true,
        message: 'Erreur de connexion. Veuillez réessayer.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmation = () => {
    navigate('/dashboard/researcher/protocols');
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title || !formData.studyType || !formData.principalInvestigator || !formData.institution) {
          setToast({ show: true, message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
          return false;
        }
        break;
      case 3:
        if (!formData.duration || !formData.participants) {
          setToast({ show: true, message: 'Veuillez compléter les informations d\'étude', type: 'error' });
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, 4);
      if (next > prev) {
        setToast({ show: true, message: `Étape ${next}/4 complétée`, type: 'success' });
      }
      return next;
    });
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00213B]"></div>
        <span className="ml-2 text-[#00213B]">Chargement du protocole...</span>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Protocole non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête avec bouton retour */}
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard/researcher/protocols')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#00213B]">Modifier le Protocole</h1>
          <p className="text-sm text-gray-600">PROT-{protocol.id} - {protocol.status === 'VERIFICATION_REJECTED' ? 'Refusé par le secrétariat' : 'Brouillon'}</p>
        </div>
      </div>

      {/* Alerte de modification */}
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
          <div>
            <p className="text-sm text-yellow-700">
              <strong>Modification de protocole :</strong> Vous pouvez modifier les informations et ajouter les documents manquants. 
              Une fois resoumis, votre protocole sera à nouveau évalué par le secrétariat.
            </p>
            {protocol.verificationComments && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  <strong>Commentaires du secrétariat :</strong> {protocol.verificationComments}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id ? 'bg-[#00213B] border-[#00213B] text-white' : 'border-gray-300 text-gray-500'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-[#00213B]' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-[#00213B]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {/* Étape 1: Informations Générales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00213B]">Informations Générales</h3>
              
              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Thème du protocole *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Type d'étude *
                </label>
                <select
                  name="studyType"
                  value={formData.studyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="observational">Étude observationnelle</option>
                  <option value="interventional">Étude interventionnelle</option>
                  <option value="qualitative">Étude qualitative</option>
                  <option value="mixed">Étude mixte</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Investigateur principal *
                  </label>
                  <input
                    type="text"
                    name="principalInvestigator"
                    value={formData.principalInvestigator}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Documents Requis */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00213B]">Documents Requis</h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm text-blue-700">
                  <strong>Information :</strong> Vous pouvez télécharger de nouveaux documents pour remplacer les anciens. 
                  Si vous ne téléchargez pas de nouveau fichier, l'ancien sera conservé.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Protocole complet (PDF)
                  {protocol.protocolFileName && protocol.protocolFileName !== 'Aucun' && (
                    <span className="text-green-600 text-xs ml-2">✓ Fichier actuel: {protocol.protocolFileName}</span>
                  )}
                </label>
                <input
                  type="file"
                  name="protocolFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Format accepté : PDF (max 10MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Formulaire de consentement (PDF)
                  {protocol.consentFormFileName && protocol.consentFormFileName !== 'Aucun' && (
                    <span className="text-green-600 text-xs ml-2">✓ Fichier actuel: {protocol.consentFormFileName}</span>
                  )}
                </label>
                <input
                  type="file"
                  name="consentForm"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Format accepté : PDF (max 10MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  CVs des investigateurs (PDF)
                  {protocol.cvFilesNames && protocol.cvFilesNames !== 'Aucun' && (
                    <span className="text-green-600 text-xs ml-2">✓ Fichier actuel: {protocol.cvFilesNames}</span>
                  )}
                </label>
                <input
                  type="file"
                  name="cvFiles"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Format accepté : PDF (max 10MB par fichier)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Considérations éthiques spéciales
                </label>
                <textarea
                  name="ethicsConsiderations"
                  value={formData.ethicsConsiderations}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  placeholder="Décrivez les considérations éthiques particulières de votre étude..."
                />
              </div>
            </div>
          )}

          {/* Étape 3: Reçu de Paiement */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00213B]">Reçu de Paiement DAF</h3>
              
              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Reçu de paiement DAF (PDF, JPG, PNG)
                  {protocol.paymentReceiptFileName && protocol.paymentReceiptFileName !== 'Aucun' && (
                    <span className="text-green-600 text-xs ml-2">✓ Fichier actuel: {protocol.paymentReceiptFileName}</span>
                  )}
                </label>
                <input
                  type="file"
                  name="paymentReceipt"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Formats acceptés : PDF, JPG, PNG (max 10MB)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Durée de l'étude (mois) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Nombre de participants *
                  </label>
                  <input
                    type="number"
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Révision et Soumission */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00213B]">Révision et Resoumission</h3>
              
              <div className="bg-[#EAECEF] p-4 rounded-lg">
                <h4 className="font-medium text-[#00213B] mb-3">Résumé de vos modifications</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Thème :</span> {formData.title}</p>
                  <p><span className="font-medium">Type :</span> {formData.studyType}</p>
                  <p><span className="font-medium">Investigateur :</span> {formData.principalInvestigator}</p>
                  <p><span className="font-medium">Institution :</span> {formData.institution}</p>
                  <p><span className="font-medium">Durée :</span> {formData.duration} mois</p>
                  <p><span className="font-medium">Participants :</span> {formData.participants}</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-green-700">
                      <strong>Prêt pour la resoumission :</strong> Votre protocole sera resoumis avec les modifications apportées. 
                      Il sera à nouveau évalué par le secrétariat du CERS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-[#1B384F] bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-[#00213B] border border-transparent rounded-md hover:bg-[#2C224E]"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSubmitConfirmation(true)}
                disabled={!validateCurrentStep()}
                className="px-6 py-2 text-sm font-medium text-white bg-[#00213B] border border-transparent rounded-md hover:bg-[#2C224E] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                RESOUMETRE LE PROTOCOLE
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Toast de confirmation */}
      <ConfirmationToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Modal de confirmation de soumission */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-[#00213B] mt-4">
                Confirmer la resoumission
              </h3>
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-[#1B384F]">
                  Êtes-vous sûr de vouloir resoumetre ce protocole modifié ?
                  Il sera à nouveau évalué par le secrétariat.
                </p>
              </div>
              <div className="flex space-x-3 px-4 py-3">
                <button
                  onClick={() => setShowSubmitConfirmation(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#00213B] text-white text-base font-medium rounded-md hover:bg-[#2C224E] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resoumission...
                    </div>
                  ) : (
                    'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de succès */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-[#00213B] mt-4">
                Protocole resoumis avec succès !
              </h3>
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-[#1B384F]">
                  Votre protocole modifié a été resoumis au secrétariat du CERS pour une nouvelle évaluation.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleConfirmation}
                  className="px-4 py-2 bg-[#00213B] text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-[#2C224E]"
                >
                  Retour à mes protocoles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProtocol;
