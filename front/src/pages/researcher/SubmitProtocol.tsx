import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Users, DollarSign, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import ConfirmationToast from '../../components/common/ConfirmationToast';
import { apiService } from '../../services/apiService';

const SubmitProtocol = () => {
  const navigate = useNavigate();
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
    // Nouveaux fichiers requis
    presidentLetter: null,
    informationNotice: null,
    informedConsent: null,
    chronogram: null,
    detailedBudget: null,
    evaluationReport: null
  });

  const steps = [
    { id: 1, name: 'Informations Générales', icon: FileText },
    { id: 2, name: 'Documents Requis', icon: Upload },
    { id: 3, name: 'Reçu de Paiement', icon: DollarSign },
    { id: 4, name: 'Révision et Soumission', icon: CheckCircle }
  ];

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'info' | 'success' | 'error' | 'warning' });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitConfirmation(false);

    try {
      // Créer un FormData pour envoyer les fichiers
      const submitData = new FormData();

      // Ajouter les champs texte
      submitData.append('title', formData.title);
      submitData.append('description', `Type d'étude: ${formData.studyType}\nInvestigateur principal: ${formData.principalInvestigator}\nInstitution: ${formData.institution}\nDurée: ${formData.duration} mois\nParticipants: ${formData.participants}`);
      submitData.append('studyType', formData.studyType);
      submitData.append('principalInvestigator', formData.principalInvestigator);
      submitData.append('institution', formData.institution);
      submitData.append('duration', formData.duration);
      submitData.append('participants', formData.participants);

      // Ajouter les fichiers
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
      
      // Ajouter les nouveaux fichiers requis
      if (formData.presidentLetter) {
        submitData.append('presidentLetter', formData.presidentLetter);
      }
      if (formData.informationNotice) {
        submitData.append('informationNotice', formData.informationNotice);
      }
      if (formData.informedConsent) {
        submitData.append('informedConsent', formData.informedConsent);
      }
      if (formData.chronogram) {
        submitData.append('chronogram', formData.chronogram);
      }
      if (formData.detailedBudget) {
        submitData.append('detailedBudget', formData.detailedBudget);
      }
      if (formData.evaluationReport) {
        submitData.append('evaluationReport', formData.evaluationReport);
      }

      // Appeler l'API backend
      const response = await apiService.submitProtocol(submitData);

      if (response.success) {
        setShowConfirmation(true);
      } else {
        setToast({
          show: true,
          message: response.error || 'Erreur lors de la soumission du protocole',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
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
      case 2:
        if (!formData.protocolFile || !formData.consentForm || !formData.cvFiles || 
            !formData.presidentLetter || !formData.informationNotice || !formData.informedConsent ||
            !formData.chronogram || !formData.detailedBudget || !formData.evaluationReport) {
          setToast({ show: true, message: 'Veuillez télécharger tous les documents requis', type: 'error' });
          return false;
        }
        break;
      case 3:
        if (!formData.paymentReceipt || !formData.duration || !formData.participants) {
          setToast({ show: true, message: 'Veuillez télécharger le reçu de paiement et compléter les informations d\'étude', type: 'error' });
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

  return (
    <div className="max-w-4xl mx-auto">
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
                  <option value="quantitative">Étude quantitative</option>
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
              
              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Protocole complet (PDF) *
                </label>
                <input
                  type="file"
                  name="protocolFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  required
                />
<p className="text-xs text-gray-600 mt-1">
                  Format accepté : PDF (max 10MB)
                </p>

              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Formulaire de consentement (PDF) *
                </label>
                <input
                  type="file"
                  name="consentForm"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  required
                />
<p className="text-xs text-gray-600 mt-1">
                  Format accepté : PDF (max 10MB)
                </p>

              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  CVs des investigateurs (PDF) *
                </label>
                <input
                  type="file"
                  name="cvFiles"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  required
                />
<p className="text-xs text-gray-600 mt-1">
                  Format accepté : PDF (max 10MB par fichier)
                </p>

              </div>

              {/* Nouveaux documents requis */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-[#00213B] mb-4">Documents supplémentaires requis</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Lettre adressée au Président du Comité (PDF) *
                    </label>
                    <input
                      type="file"
                      name="presidentLetter"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format accepté : PDF (max 10MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Notice d'information (PDF) *
                    </label>
                    <input
                      type="file"
                      name="informationNotice"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format accepté : PDF (max 10MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Consentement éclairé (PDF) *
                    </label>
                    <input
                      type="file"
                      name="informedConsent"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format accepté : PDF (max 10MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Chronogramme (PDF) *
                    </label>
                    <input
                      type="file"
                      name="chronogram"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format accepté : PDF (max 10MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Budget détaillé en Franc CFA (PDF) *
                    </label>
                    <input
                      type="file"
                      name="detailedBudget"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format accepté : PDF (max 10MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Rapport d'évaluation (décision finale) (PDF) *
                    </label>
                    <input
                      type="file"
                      name="evaluationReport"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format accepté : PDF (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Reçu de Paiement */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00213B]">Reçu de Paiement DAF</h3>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <strong>OBLIGATOIRE :</strong> Vous devez télécharger le reçu de paiement effectué 
                      à la DAF du Ministère de la Santé comme preuve de paiement selon les tarifs suivants :
                      <br />• <strong>25 000 F CFA</strong> pour les protocoles de recherche d'un étudiant burkinabé
                      <br />• <strong>100 000 F CFA</strong> pour un étudiant non burkinabé
                      <br />• <strong>200 000 F CFA</strong> pour les institutions nationales
                      <br />• <strong>500 000 F CFA</strong> pour les études multicentriques (par exemple le Mali, la Côte d'Ivoire)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00213B] mb-2">
                  Reçu de paiement DAF (PDF, JPG, PNG) *
                </label>
                <input
                  type="file"
                  name="paymentReceipt"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E]"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
Formats acceptés : PDF, JPG, PNG (max 10MB)

                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Information :</strong> Ce reçu servira de preuve que vous avez effectué le paiement 
                      des frais d'évaluation requis. L'administration vérifiera l'authenticité du document.
                    </p>
                  </div>
                </div>
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

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <strong>Vérifiez que le reçu contient :</strong><br />
                      • Le montant exact selon votre catégorie<br />
                      • La date de paiement<br />
                      • Le cachet et signature de la DAF<br />
                      • Votre nom ou celui de l'institution<br />
                      • Les CVs datés et signés des investigateurs (en français)<br />
                      • Une lettre adressée au Président du Comité
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Révision et Soumission */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00213B]">Révision et Soumission</h3>
              
              <div className="bg-[#EAECEF] p-4 rounded-lg">
                <h4 className="font-medium text-[#00213B] mb-3">Résumé de votre soumission</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Thème :</span> {formData.title}</p>
                  <p><span className="font-medium">Type :</span> {formData.studyType}</p>
                  <p><span className="font-medium">Investigateur :</span> {formData.principalInvestigator}</p>
                  <p><span className="font-medium">Institution :</span> {formData.institution}</p>
                  <p><span className="font-medium">Reçu de paiement :</span> {formData.paymentReceipt ? `Téléchargé (${formData.paymentReceipt.name})` : 'Non fourni'}</p>
                  <p><span className="font-medium">Durée :</span> {formData.duration} mois</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important :</strong> Assurez-vous que tous les documents sont complets avant la soumission. 
                      Une fois soumis, votre protocole sera attribué à un rapporteur pour évaluation.
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
                SOUMETTRE LE PROTOCOLE
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
                Confirmer la soumission
              </h3>
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-[#1B384F]">
                  Êtes-vous sûr de vouloir soumettre définitivement ce protocole ?
                  Une fois soumis, vous ne pourrez plus le modifier.
                </p>
                <div className="mt-4 p-3 bg-[#EAECEF] rounded-lg">
                  <p className="text-xs text-[#1B384F]">
                    <strong>Vérifiez que :</strong><br />
                    • Tous les champs sont correctement remplis<br />
                    • Tous les documents sont joints<br />
                    • Le reçu de paiement est valide
                  </p>
                </div>
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
                      Soumission...
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
                Protocole soumis avec succès !
              </h3>
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-[#1B384F]">
                  Votre protocole a été transmis au secrétariat du CERS pour validation initiale.
                  Vous recevrez une notification dès qu'il sera attribué à un rapporteur.
                </p>
                <div className="mt-4 p-3 bg-[#EAECEF] rounded-lg">
                  <p className="text-xs text-[#1B384F]">
                    <strong>Prochaines étapes :</strong><br />
                    1. Vérification par le secrétariat<br />
                    2. Attribution à un rapporteur<br />
                    3. Évaluation du protocole<br />
                    4. Décision du comité CERS
                  </p>
                </div>
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

export default SubmitProtocol;
