import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, Download, Eye } from 'lucide-react';

const PaymentTracker = () => {
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadProtocols = () => {
      const submittedProtocols = JSON.parse(localStorage.getItem('submittedProtocols') || '[]');
      // Filtrer seulement les protocoles avec reçu de paiement
      const protocolsWithPayment = submittedProtocols.filter(p => p.paymentReceipt);
      setProtocols(protocolsWithPayment);
    };

    loadProtocols();
    const interval = setInterval(loadProtocols, 5000);
    return () => clearInterval(interval);
  }, []);

  const updatePaymentStatus = (protocolId, status) => {
    const allProtocols = JSON.parse(localStorage.getItem('submittedProtocols') || '[]');
    const updatedProtocols = allProtocols.map(protocol => {
      if (protocol.id === protocolId) {
        return {
          ...protocol,
          paymentStatus: status,
          paymentVerifiedDate: new Date().toISOString(),
          paymentVerifiedBy: 'Secrétaire CERS'
        };
      }
      return protocol;
    });
    
    localStorage.setItem('submittedProtocols', JSON.stringify(updatedProtocols));
    
    // Mettre à jour l'état local
    const protocolsWithPayment = updatedProtocols.filter(p => p.paymentReceipt);
    setProtocols(protocolsWithPayment);
    setShowModal(false);
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Vérification en cours' },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Paiement vérifié' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Reçu rejeté' }
    };

    const config = statusConfig[status] || statusConfig.pending;
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#00213B]">Suivi des Paiements</h1>
        <div className="text-sm text-[#1B384F]">
          {protocols.filter(p => !p.paymentStatus || p.paymentStatus === 'pending').length} reçu(s) à vérifier
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">À vérifier</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => !p.paymentStatus || p.paymentStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Vérifiés</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => p.paymentStatus === 'verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rejetés</p>
              <p className="text-lg font-semibold text-gray-900">
                {protocols.filter(p => p.paymentStatus === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des protocoles avec paiement */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-[#00213B]">Chercheurs ayant soumis un reçu de paiement</h3>
        </div>
        
        {protocols.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun reçu de paiement soumis</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-[#00213B] truncate">
                        {protocol.title}
                      </h4>
                      {getPaymentStatusBadge(protocol.paymentStatus)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span><strong>Chercheur:</strong> {protocol.principalInvestigator}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span><strong>Soumis le:</strong> {new Date(protocol.submittedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        <span><strong>ID:</strong> {protocol.id}</span>
                      </div>
                    </div>

                    <div className="text-sm text-[#1B384F]">
                      <span className="font-medium">Institution:</span> {protocol.institution}
                    </div>
                    
                    {protocol.paymentVerifiedDate && (
                      <div className="text-sm text-green-600 mt-1">
                        <span className="font-medium">Vérifié le:</span> {new Date(protocol.paymentVerifiedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openModal(protocol)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir reçu
                    </button>
                    
                    {(!protocol.paymentStatus || protocol.paymentStatus === 'pending') && (
                      <>
                        <button
                          onClick={() => updatePaymentStatus(protocol.id, 'verified')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Vérifier
                        </button>
                        
                        <button
                          onClick={() => updatePaymentStatus(protocol.id, 'rejected')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de visualisation du reçu */}
      {showModal && selectedProtocol && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-[#00213B]">
                  Reçu de Paiement - {selectedProtocol.id}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#EAECEF] p-4 rounded-lg">
                  <h4 className="font-medium text-[#00213B] mb-2">Informations du Chercheur</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Nom:</span> {selectedProtocol.principalInvestigator}
                    </div>
                    <div>
                      <span className="font-medium">Institution:</span> {selectedProtocol.institution}
                    </div>
                    <div>
                      <span className="font-medium">Protocole:</span> {selectedProtocol.id}
                    </div>
                    <div>
                      <span className="font-medium">Date soumission:</span> {new Date(selectedProtocol.submittedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#00213B] mb-2">Reçu de Paiement</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Reçu de paiement: {selectedProtocol.paymentReceipt?.name || 'Document téléchargé'}
                    </p>
                    <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50">
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Vérification:</strong> Assurez-vous que le reçu contient le montant correct (25 000 F CFA), 
                        la date de paiement et le cachet de la DAF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                >
                  Fermer
                </button>
                
                {(!selectedProtocol.paymentStatus || selectedProtocol.paymentStatus === 'pending') && (
                  <>
                    <button
                      onClick={() => updatePaymentStatus(selectedProtocol.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                    >
                      Rejeter le reçu
                    </button>
                    
                    <button
                      onClick={() => updatePaymentStatus(selectedProtocol.id, 'verified')}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                    >
                      Vérifier le paiement
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTracker;
