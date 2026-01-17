import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { FileTextIcon, DownloadIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, MessageSquareIcon, ClipboardIcon, StarIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
const ReviewProtocol = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    addNotification
  } = useNotifications();
const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const response = await fetch(`${BASE_URL}/researcher/protocols/${id}/details`);
        const data = await response.json();
        if (data.success) {
          setProtocol(data.protocol);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProtocol();
    }
  }, [id]);

  if (loading) {
    return <div className="p-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (!protocol) {
    navigate('/dashboard/committee/assigned');
    return <div className="p-6 text-center">Redirection...</div>;
  }

  // State for review form
  const [reviewForm, setReviewForm] = useState({
    scientificMerit: 3,
    methodology: 3,
    ethicalConsiderations: 3,
    feasibility: 3,
    comments: '',
    recommendation: 'minor_revisions',
    confidentialNotes: ''
  });
  // State for tabs
  const [activeTab, setActiveTab] = useState('protocol');
  const handleReviewChange = e => {
    const {
      name,
      value
    } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: value
    });
  };
  const handleRatingChange = (field, value) => {
    setReviewForm({
      ...reviewForm,
      [field]: value
    });
  };
  const handleSubmitReview = () => {
    // In a real app, this would send the review to the backend
    addNotification({
      title: 'Évaluation soumise',
      message: `Votre évaluation du protocole "${protocol.title}" a été soumise avec succès.`
    });
    // Navigate back to assigned protocols
    navigate('/committee/assigned');
  };
  const renderRatingStars = (field, value) => {
    return <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => handleRatingChange(field, star)} className={`${star <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 focus:outline-none`}>
            <StarIcon className="h-5 w-5" />
          </button>)}
        <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
      </div>;
  };
  return <div className="space-y-6">
      {/* Protocol header */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Évaluation du protocole
              </h2>
              <p className="mt-1 text-sm text-gray-500">ID: {protocol.id}</p>
            </div>
            <div className="mt-3 md:mt-0 flex items-center">
              {getStatusBadge(protocol.status)}
            </div>
          </div>
        </div>
        {/* Protocol title and researcher */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{protocol.title}</h3>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>
{protocol.principalInvestigator || protocol.submitterName}, {protocol.institution}

              </span>
            </div>
            <span className="hidden sm:inline mx-2">•</span>
            <div className="flex items-center mt-1 sm:mt-0">
              <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>
                Soumis le{' '}
{new Date(protocol.submittedAt).toLocaleDateString()}

              </span>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('protocol')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'protocol' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <FileTextIcon className="h-5 w-5 inline mr-2 -mt-1" />
              Détails du protocole
            </button>
            <button onClick={() => setActiveTab('review')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'review' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <ClipboardIcon className="h-5 w-5 inline mr-2 -mt-1" />
              Formulaire d'évaluation
            </button>
          </nav>
        </div>
        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'protocol' ? <div className="space-y-6">
              {/* Protocol details */}
              <div>
                <h4 className="text-lg font-medium text-gray-900">Résumé</h4>
<p className="mt-2 text-gray-600">{protocol.description}</p>

              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Informations générales
                  </h4>
                  <dl className="mt-2 space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
Type d'étude
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {protocol.studyType || 'Non spécifié'}

                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Institution
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {protocol.institution}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
Chercheur principal
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {protocol.principalInvestigator || protocol.submitterName}

                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
Durée
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {protocol.duration} mois

                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
Participants
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {protocol.participants} personnes

                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Considérations éthiques
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
{protocol.ethicsConsiderations || 'Non spécifié'}
                  </p>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">
                    Date de soumission
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {new Date(protocol.submittedAt).toLocaleDateString()}

                  </p>
                </div>
              </div>
              {/* Documents */}
              <div>
                <h4 className="text-lg font-medium text-gray-900">Documents</h4>
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Protocole complet</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/protocol`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Formulaire de consentement</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/consent`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">CVs des investigateurs</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/cv`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Reçu de paiement</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/receipt`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Lettre au Président du Comité</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/president_letter`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Notice d'information</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/information_notice`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Consentement éclairé</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/informed_consent`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Chronogramme</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/chronogram`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Budget détaillé en Franc CFA</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/detailed_budget`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">Rapport d'évaluation (décision finale)</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <a 
                        href={`${BASE_URL}/files/view-by-protocol/${id}/evaluation_report`}
                        download
                        target="_blank"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div> : <div className="space-y-6">
              {/* Review form */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Veuillez évaluer ce protocole de recherche selon les
                      critères ci-dessous. Votre évaluation restera
                      confidentielle et ne sera partagée qu'avec le comité
                      d'éthique.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mérite scientifique
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Évaluez la valeur scientifique et la contribution
                    potentielle à la connaissance
                  </p>
                  <div className="mt-1">
                    {renderRatingStars('scientificMerit', reviewForm.scientificMerit)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Méthodologie
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Évaluez la pertinence et la rigueur de la méthodologie
                    proposée
                  </p>
                  <div className="mt-1">
                    {renderRatingStars('methodology', reviewForm.methodology)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Considérations éthiques
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Évaluez comment le protocole aborde les questions éthiques
                  </p>
                  <div className="mt-1">
                    {renderRatingStars('ethicalConsiderations', reviewForm.ethicalConsiderations)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Faisabilité
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Évaluez si le projet est réalisable dans les délais et avec
                    les ressources indiquées
                  </p>
                  <div className="mt-1">
                    {renderRatingStars('feasibility', reviewForm.feasibility)}
                  </div>
                </div>
                <div>
                  <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
                    Recommandation
                  </label>
                  <select id="recommendation" name="recommendation" value={reviewForm.recommendation} onChange={handleReviewChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                    <option value="approve">
                      Approuver sans modifications
                    </option>
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
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                    Commentaires pour le chercheur
                  </label>
                  <div className="mt-1">
                    <textarea id="comments" name="comments" rows={4} value={reviewForm.comments} onChange={handleReviewChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Fournissez des commentaires constructifs au chercheur" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ces commentaires seront partagés avec le chercheur.
                  </p>
                </div>
                <div>
                  <label htmlFor="confidentialNotes" className="block text-sm font-medium text-gray-700">
                    Notes confidentielles pour le comité
                  </label>
                  <div className="mt-1">
                    <textarea id="confidentialNotes" name="confidentialNotes" rows={4} value={reviewForm.confidentialNotes} onChange={handleReviewChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Notes confidentielles pour le comité d'éthique uniquement" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ces notes resteront confidentielles et ne seront visibles
                    que par les membres du comité.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/committee/assigned')} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Annuler
                </button>
                <button type="button" onClick={handleSubmitReview} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <MessageSquareIcon className="h-4 w-4 mr-1" />
                  Soumettre l'évaluation
                </button>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
// Helper function for status badges
const getStatusBadge = status => {
  switch (status) {
    case 'approved':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Approuvé
        </span>;
    case 'pending':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          En attente
        </span>;
    case 'rejected':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Rejeté
        </span>;
    default:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          Inconnu
        </span>;
  }
};
export default ReviewProtocol;
