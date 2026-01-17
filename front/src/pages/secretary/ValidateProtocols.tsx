import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;
import { Eye, CheckCircle, XCircle, Clock, User, Calendar, FileText, DollarSign, AlertTriangle, DownloadIcon } from 'lucide-react';

const ValidateProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Charger les protocoles soumis depuis l'API
  useEffect(() => {
    const loadProtocols = async () => {
      try {
        const userId = localStorage.getItem('userId') || '';
        const userRole = localStorage.getItem('userRole') || '';
        
        console.log('Headers envoyés:', { userId, userRole });
        
        // Charger TOUS les protocoles soumis pour vérification
        const response = await fetch(`${BASE_URL}/secretary/protocols/all`, {
          headers: {
            'X-User-ID': userId,
            'X-User-Role': userRole
          }
        });

        const data = await response.json();
        if (data.success) {
          console.log('Protocoles chargés:', data.protocols);
          data.protocols.forEach(p => console.log(`Protocole ${p.id}: status = ${p.status}`));
          setProtocols(data.protocols);
        } else {
          console.error('Erreur lors du chargement des protocoles:', data.error);
        }
      } catch (error) {
        console.error('Erreur de connexion à l\'API:', error);
      }
    };

    loadProtocols();
    // Recharger toutes les 10 secondes
    const interval = setInterval(loadProtocols, 10000);
    return () => clearInterval(interval);
  }, []);

  const [validationComments, setValidationComments] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [checklist, setChecklist] = useState({
    protocolComplete: false,
    consentForm: false,
    cvFiles: false,
    paymentReceipt: false,
    presidentLetter: false,
    informationNotice: false,
    informedConsent: false,
    chronogram: false,
    detailedBudget: false,
    evaluationReport: false
  });

  const handleValidate = async (protocolId, action) => {
    if (action === 'reject' && !validationComments.trim()) {
      alert('Veuillez indiquer les raisons de non-conformité dans les commentaires');
      return;
    }

    try {
        const response = await fetch(`${BASE_URL}/secretary/protocols/${protocolId}/verify`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('userId') || '',
          'X-User-Role': localStorage.getItem('userRole') || ''
        },
        body: JSON.stringify({
          action: action === 'approve' ? 'confirm' : 'reject',
          comments: validationComments || (action === 'approve' ? 'Protocole conforme' : 'Protocole non conforme')
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        // Recharger les protocoles
        const protocolsResponse = await fetch(`${BASE_URL}/secretary/protocols/all`, {
          headers: {
            'X-User-ID': localStorage.getItem('userId') || '',
            'X-User-Role': localStorage.getItem('userRole') || ''
          }
        });

        const protocolsData = await protocolsResponse.json();
        if (protocolsData.success) {
          setProtocols(protocolsData.protocols);
        }
        setShowModal(false);
        setValidationComments('');
        setChecklist({
          protocolComplete: false,
          consentForm: false,
          cvFiles: false,
          paymentReceipt: false,
          presidentLetter: false,
          informationNotice: false,
          informedConsent: false,
          chronogram: false,
          detailedBudget: false,
          evaluationReport: false
        });
      } else {
        console.error('Erreur lors de la validation:', data.error);
        alert('Erreur lors de la validation du protocole');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion à l\'API');
    }
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Paiement en attente' },
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Payé' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Paiement rejeté' }
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const calculateFees = (protocol) => {
    if (protocol.studyType === 'student') return 100000;
    if (protocol.studyType === 'national_institution') return 200000;
    if (protocol.studyType === 'multicentric') return 500000;
    return 25000;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      SUBMITTED: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'En attente' },
      VERIFIED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Conforme' },
      VERIFICATION_REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Refusé' },
      ASSIGNED_TO_MEMBER: { color: 'bg-purple-100 text-purple-800', icon: User, text: 'En évaluation' },
      COMMITTEE_APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approuvé' },
      COMMITTEE_REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejeté' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Inconnu' };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const openModal = (protocol) => {
    setSelectedProtocol(protocol);
    setShowModal(true);
    // Réinitialiser la checklist
    setChecklist({
      protocolComplete: false,
      consentForm: false,
      cvFiles: false,
      paymentReceipt: false,
      presidentLetter: false,
      informationNotice: false,
      informedConsent: false,
      chronogram: false,
      detailedBudget: false,
      evaluationReport: false
    });
  };

  const isChecklistComplete = () => {
    return Object.values(checklist).every(value => value === true);
  };

  const downloadPDF = async (status = 'all') => {
    try {
      const response = await fetch(`${BASE_URL}/secretary/protocols/simple-pdf?status=${status}`, {
        headers: {
          'X-User-ID': localStorage.getItem('userId') || '',
          'X-User-Role': localStorage.getItem('userRole') || ''
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `liste-protocoles-${status}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
alert('Liste PDF téléchargée avec succès !');

      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du téléchargement de la liste.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#00213B]">Confirmation de Protocole</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-[#1B384F]">
            {protocols.filter(p => p.status === 'SUBMITTED').length} protocole(s) en attente
          </div>
          <button
            onClick={() => downloadPDF('all')}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <DownloadIcon className="w-4 h-4 mr-1" />
            Télécharger la liste
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`p-4 rounded-lg shadow-sm border text-left transition-colors ${
            selectedFilter === 'all' 
              ? 'bg-blue-50 border-blue-300' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tous</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.length}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter('pending')}
          className={`p-4 rounded-lg shadow-sm border text-left transition-colors ${
            selectedFilter === 'pending' 
              ? 'bg-blue-50 border-blue-300' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => p.status === 'SUBMITTED').length}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter('verified')}
          className={`p-4 rounded-lg shadow-sm border text-left transition-colors ${
            selectedFilter === 'verified' 
              ? 'bg-green-50 border-green-300' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Conformes</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => p.status === 'VERIFIED' || p.status === 'COMMITTEE_APPROVED').length}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter('rejected')}
          className={`p-4 rounded-lg shadow-sm border text-left transition-colors ${
            selectedFilter === 'rejected' 
              ? 'bg-red-50 border-red-300' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Refusés</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => p.status === 'VERIFICATION_REJECTED' || p.status === 'COMMITTEE_REJECTED').length}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter('in-review')}
          className={`p-4 rounded-lg shadow-sm border text-left transition-colors ${
            selectedFilter === 'in-review' 
              ? 'bg-purple-50 border-purple-300' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En évaluation</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => p.status === 'ASSIGNED_TO_MEMBER').length}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Liste des protocoles */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-[#00213B]">
              {selectedFilter === 'all' && 'Tous les protocoles'}
              {selectedFilter === 'pending' && 'Protocoles en attente'}
              {selectedFilter === 'verified' && 'Protocoles conformes'}
              {selectedFilter === 'rejected' && 'Protocoles refusés'}
              {selectedFilter === 'in-review' && 'Protocoles en évaluation'}
            </h3>
            {selectedFilter !== 'all' && (
              <button
                onClick={() => setSelectedFilter('all')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Voir tous
              </button>
            )}
          </div>
        </div>
        
        {protocols.filter(protocol => {
          if (selectedFilter === 'all') return true;
          if (selectedFilter === 'pending') return protocol.status === 'SUBMITTED';
          if (selectedFilter === 'verified') return protocol.status === 'VERIFIED' || protocol.status === 'COMMITTEE_APPROVED';
          if (selectedFilter === 'rejected') return protocol.status === 'VERIFICATION_REJECTED' || protocol.status === 'COMMITTEE_REJECTED';
          if (selectedFilter === 'in-review') return protocol.status === 'ASSIGNED_TO_MEMBER';
          return true;
        }).length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {selectedFilter === 'all' && 'Aucun protocole pour le moment'}
              {selectedFilter === 'pending' && 'Aucun protocole en attente'}
              {selectedFilter === 'verified' && 'Aucun protocole conforme'}
              {selectedFilter === 'rejected' && 'Aucun protocole refusé'}
              {selectedFilter === 'in-review' && 'Aucun protocole en évaluation'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {protocols.filter(protocol => {
              if (selectedFilter === 'all') return true;
              if (selectedFilter === 'pending') return protocol.status === 'submitted' || protocol.status === 'SUBMITTED';
              if (selectedFilter === 'verified') return protocol.status === 'verified' || protocol.status === 'VERIFIED';
              if (selectedFilter === 'rejected') return protocol.status === 'verification_rejected' || protocol.status === 'VERIFICATION_REJECTED';
              return true;
            }).map((protocol) => (
              <div key={protocol.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-[#00213B] truncate">
                        {protocol.title}
                      </h4>
                      {getStatusBadge(protocol.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span><strong>Investigateur:</strong> {protocol.principalInvestigator}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span><strong>Soumis le:</strong> {new Date(protocol.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        <span><strong>Type:</strong> {protocol.studyType}</span>
                      </div>
</div>




                    <div className="text-sm text-[#1B384F]">
                      <span className="font-medium">ID:</span> {protocol.id}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openModal(protocol)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Examiner
                    </button>
                    

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedProtocol && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-[#00213B]">
                  Détails du Protocole
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Titre</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Type d'étude</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.studyType}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Investigateur principal</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.principalInvestigator}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Institution</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.institution}</p>
                  </div>
                  
                  {/* Vérification des documents */}
                  <div className="bg-[#EAECEF] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-[#00213B]">Vérification des Documents</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isChecklistComplete() 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isChecklistComplete() ? 'Checklist complète' : 'Checklist incomplète'}
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.protocolComplete}
                            onChange={(e) => setChecklist({...checklist, protocolComplete: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Protocole complet (PDF) - {selectedProtocol.protocolFileName}</span>
                        </label>
                        <button
                        onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/protocol`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Protocole complet (PDF)

                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.consentForm}
                            onChange={(e) => setChecklist({...checklist, consentForm: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Formulaire de consentement - {selectedProtocol.consentFormFileName}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/consent`, '_blank')}

                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.cvFiles}
                            onChange={(e) => setChecklist({...checklist, cvFiles: e.target.checked})}
                            className="mr-3"
                          />
                          <span>CVs des investigateurs - {selectedProtocol.cvFilesNames}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/cv`, '_blank')}

                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.paymentReceipt}
                            onChange={(e) => setChecklist({...checklist, paymentReceipt: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Reçu de paiement - {selectedProtocol.paymentReceiptFileName}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/receipt`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.presidentLetter}
                            onChange={(e) => setChecklist({...checklist, presidentLetter: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Lettre au Président du Comité - {selectedProtocol.presidentLetterFileName || 'Non fourni'}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/president_letter`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.informationNotice}
                            onChange={(e) => setChecklist({...checklist, informationNotice: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Notice d'information - {selectedProtocol.informationNoticeFileName || 'Non fourni'}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/information_notice`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.informedConsent}
                            onChange={(e) => setChecklist({...checklist, informedConsent: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Consentement éclairé - {selectedProtocol.informedConsentFileName || 'Non fourni'}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/informed_consent`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.chronogram}
                            onChange={(e) => setChecklist({...checklist, chronogram: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Chronogramme - {selectedProtocol.chronogramFileName || 'Non fourni'}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/chronogram`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.detailedBudget}
                            onChange={(e) => setChecklist({...checklist, detailedBudget: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Budget détaillé en Franc CFA - {selectedProtocol.detailedBudgetFileName || 'Non fourni'}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/detailed_budget`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklist.evaluationReport}
                            onChange={(e) => setChecklist({...checklist, evaluationReport: e.target.checked})}
                            className="mr-3"
                          />
                          <span>Rapport d'évaluation (décision finale) - {selectedProtocol.evaluationReportFileName || 'Non fourni'}</span>
                        </label>
                        <button
                          onClick={() => window.open(`${BASE_URL}/api/files/view-by-protocol/${selectedProtocol.id}/evaluation_report`, '_blank')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Ouvrir
                        </button>
                      </div>
                    </div>
                    

                  </div>
                  
                  {/* Zone de commentaires */}
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Commentaires (obligatoire en cas de refus)
                    </label>
                    <textarea
                      value={validationComments}
                      onChange={(e) => setValidationComments(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00213B] focus:border-[#00213B]"
                      placeholder="Indiquez les raisons du refus ou des observations..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Budget (F CFA)</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.budget?.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Durée (mois)</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.duration}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Participants</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.participants}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Date de soumission</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedProtocol.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  

                </div>
              </div>
              
              {selectedProtocol.ethicsConsiderations && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#00213B]">Considérations éthiques</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedProtocol.ethicsConsiderations}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                >
                  Fermer
                </button>
                
                {(selectedProtocol.status === 'SUBMITTED') && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleValidate(selectedProtocol.id, 'reject')}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Non conforme
                    </button>
                    
                    <button
                      onClick={() => handleValidate(selectedProtocol.id, 'approve')}
                      className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-md flex items-center justify-center bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Conforme
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidateProtocols;
