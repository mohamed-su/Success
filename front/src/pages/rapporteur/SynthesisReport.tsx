import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileTextIcon, DownloadIcon, CheckCircleIcon, XCircleIcon, UsersIcon, SendIcon, ClipboardIcon, BookOpenIcon, CalendarIcon, AlertCircleIcon } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
const SynthesisReport = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    addNotification
  } = useNotifications();
  // State for report form
  const [reportForm, setReportForm] = useState({
    summary: '',
    methodology: '',
    ethicalConsiderations: '',
    concerns: '',
    recommendation: 'approve',
    additionalComments: ''
  });
  // State for committee reviews
  const [reviews, setReviews] = useState([{
    id: '1',
    reviewer: 'Dr. Amadou Diallo',
    date: '2023-12-01',
    scientificMerit: 4,
    methodology: 3,
    ethicalConsiderations: 4,
    feasibility: 4,
    recommendation: 'minor_revisions',
    comments: "Le protocole est bien conçu, mais il y a quelques préoccupations mineures concernant la méthode d'échantillonnage. Je recommande d'éclaircir la stratégie de recrutement des participants.",
    confidentialNotes: "Bon protocole dans l'ensemble. Le chercheur a une bonne expérience dans ce domaine."
  }, {
    id: '2',
    reviewer: 'Dr. Fatou Koné',
    date: '2023-12-02',
    scientificMerit: 5,
    methodology: 4,
    ethicalConsiderations: 3,
    feasibility: 4,
    recommendation: 'approve',
    comments: 'Excellente proposition avec une méthodologie solide. Les considérations éthiques pourraient être renforcées en ce qui concerne la confidentialité des données.',
    confidentialNotes: 'Très bon protocole, avec une forte pertinence pour les priorités de santé publique nationales.'
  }, {
    id: '3',
    reviewer: 'Dr. Ousmane Traoré',
    date: '2023-12-03',
    scientificMerit: 4,
    methodology: 4,
    ethicalConsiderations: 4,
    feasibility: 3,
    recommendation: 'minor_revisions',
    comments: 'Je suis préoccupé par le calendrier proposé qui semble ambitieux compte tenu des ressources disponibles. Recommande de réviser le chronogramme ou de justifier la faisabilité.',
    confidentialNotes: 'Protocole solide mais le budget semble sous-estimé pour les activités proposées.'
  }]);
  // Mock protocol data
  const protocol = {
    id: id || '201',
    title: "Évaluation de l'efficacité des vaccins contre le paludisme chez les enfants de moins de 5 ans",
    abstract: "Cette étude vise à évaluer l'efficacité des vaccins antipaludiques récemment introduits chez les enfants de moins de 5 ans dans les zones rurales à forte transmission. L'étude utilisera un design de cohorte prospective avec suivi pendant 24 mois pour mesurer l'incidence du paludisme clinique et l'immunité protectrice.",
    researcher: 'Dr. Fatimata Ouédraogo',
    institution: 'Centre Muraz',
    department: 'Département de Parasitologie',
    submittedDate: '2023-11-28',
    status: 'under_review',
    researchArea: 'Médical',
    startDate: '2024-02-01',
    endDate: '2026-02-01',
    fundingSource: 'Organisation Mondiale de la Santé',
    documents: [{
      name: 'Protocole_complet.pdf',
      type: 'pdf',
      size: '3.2 MB'
    }, {
      name: 'Formulaire_de_consentement.docx',
      type: 'docx',
      size: '0.7 MB'
    }, {
      name: 'Questionnaires.pdf',
      type: 'pdf',
      size: '1.5 MB'
    }, {
      name: 'Budget_detaille.xlsx',
      type: 'xlsx',
      size: '0.4 MB'
    }]
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setReportForm({
      ...reportForm,
      [name]: value
    });
  };
  const handleSubmitReport = () => {
    // Validate form
    if (!reportForm.summary || !reportForm.methodology || !reportForm.ethicalConsiderations || !reportForm.recommendation) {
      addNotification({
        title: 'Formulaire incomplet',
        message: 'Veuillez remplir tous les champs obligatoires du rapport de synthèse.'
      });
      return;
    }
    // In a real app, this would send the report to the backend
    addNotification({
      title: 'Rapport de synthèse soumis',
      message: 'Votre rapport de synthèse a été soumis avec succès au président du comité.'
    });
    // Navigate back to dashboard
    navigate('/rapporteur');
  };
  const getRecommendationLabel = recommendation => {
    switch (recommendation) {
      case 'approve':
        return 'Approuver sans modifications';
      case 'minor_revisions':
        return 'Approuver avec révisions mineures';
      case 'major_revisions':
        return 'Révisions majeures requises';
      case 'reject':
        return 'Rejeter';
      default:
        return 'Inconnu';
    }
  };
  const getRecommendationClass = recommendation => {
    switch (recommendation) {
      case 'approve':
        return 'bg-green-100 text-green-800';
      case 'minor_revisions':
        return 'bg-blue-100 text-blue-800';
      case 'major_revisions':
        return 'bg-yellow-100 text-yellow-800';
      case 'reject':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const renderRatingStars = value => {
    return <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => <span key={star} className={`${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>)}
      </div>;
  };
  return <div className="space-y-6">
      {/* Protocol header */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Rapport de synthèse
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                ID du protocole: {protocol.id}
              </p>
            </div>
          </div>
        </div>
        {/* Protocol title and researcher */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{protocol.title}</h3>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
            <div className="flex items-center">
              <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>
                {protocol.researcher}, {protocol.institution}
              </span>
            </div>
            <span className="hidden sm:inline mx-2">•</span>
            <div className="flex items-center mt-1 sm:mt-0">
              <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>
                Soumis le{' '}
                {new Date(protocol.submittedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900">
              Résumé du protocole
            </h4>
            <p className="mt-2 text-gray-600">{protocol.abstract}</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  En tant que rapporteur, votre rôle est de synthétiser les
                  évaluations des membres du comité et de formuler une
                  recommandation finale pour le président.
                </p>
              </div>
            </div>
          </div>
          {/* Committee Reviews */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Évaluations du comité
            </h4>
            <div className="space-y-6">
              {reviews.map(review => <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {review.reviewer}
                      </h5>
                      <p className="text-xs text-gray-500">
                        Évaluation soumise le{' '}
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationClass(review.recommendation)}`}>
                        {getRecommendationLabel(review.recommendation)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Mérite scientifique
                      </p>
                      {renderRatingStars(review.scientificMerit)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Méthodologie</p>
                      {renderRatingStars(review.methodology)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Considérations éthiques
                      </p>
                      {renderRatingStars(review.ethicalConsiderations)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Faisabilité</p>
                      {renderRatingStars(review.feasibility)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-xs font-medium text-gray-700 mb-1">
                      Commentaires pour le chercheur
                    </h6>
                    <p className="text-sm text-gray-600">{review.comments}</p>
                  </div>
                  <div>
                    <h6 className="text-xs font-medium text-gray-700 mb-1">
                      Notes confidentielles
                    </h6>
                    <p className="text-sm text-gray-600">
                      {review.confidentialNotes}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
          {/* Synthesis Report Form */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Formulaire de synthèse
            </h4>
            <div className="space-y-6">
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                  Résumé des évaluations <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea id="summary" name="summary" rows={4} value={reportForm.summary} onChange={handleInputChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Synthétisez les principales observations des évaluateurs..." />
                </div>
              </div>
              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700">
                  Évaluation de la méthodologie{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea id="methodology" name="methodology" rows={3} value={reportForm.methodology} onChange={handleInputChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Évaluez la rigueur et la pertinence de la méthodologie proposée..." />
                </div>
              </div>
              <div>
                <label htmlFor="ethicalConsiderations" className="block text-sm font-medium text-gray-700">
                  Considérations éthiques{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea id="ethicalConsiderations" name="ethicalConsiderations" rows={3} value={reportForm.ethicalConsiderations} onChange={handleInputChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Évaluez comment le protocole aborde les questions éthiques..." />
                </div>
              </div>
              <div>
                <label htmlFor="concerns" className="block text-sm font-medium text-gray-700">
                  Préoccupations et points à clarifier
                </label>
                <div className="mt-1">
                  <textarea id="concerns" name="concerns" rows={3} value={reportForm.concerns} onChange={handleInputChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Listez les préoccupations ou points qui nécessitent des clarifications..." />
                </div>
              </div>
              <div>
                <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
                  Recommandation finale <span className="text-red-500">*</span>
                </label>
                <select id="recommendation" name="recommendation" value={reportForm.recommendation} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                  <option value="approve">Approuver sans modifications</option>
                  <option value="minor_revisions">
                    Approuver avec révisions mineures
                  </option>
                  <option value="major_revisions">
                    Révisions majeures requises
                  </option>
                  <option value="reject">Rejeter</option>
                </select>
              </div>
              <div>
                <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
                  Commentaires additionnels
                </label>
                <div className="mt-1">
                  <textarea id="additionalComments" name="additionalComments" rows={3} value={reportForm.additionalComments} onChange={handleInputChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Ajoutez des commentaires supplémentaires si nécessaire..." />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={() => navigate('/rapporteur')} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Annuler
              </button>
              <button type="button" onClick={handleSubmitReport} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <SendIcon className="h-4 w-4 mr-1" />
                Soumettre le rapport
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default SynthesisReport;
