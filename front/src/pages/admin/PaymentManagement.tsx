import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PaymentManagement = () => {
  const { currentUser } = useAuth();
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationData, setVerificationData] = useState({
    action: 'verify',
    comments: ''
  });

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      const response = await fetch('${BASE_URL}/admin/protocols/pending-payment');
      if (response.ok) {
        const data = await response.json();
        setProtocols(data.protocols || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/admin/protocols/${selectedProtocol.id}/verify-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...verificationData,
          adminId: currentUser.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShowVerifyModal(false);
          setSelectedProtocol(null);
          setVerificationData({ action: 'verify', comments: '' });
          loadPendingPayments();
          alert(data.message);
        } else {
          alert(data.error || 'Erreur lors de la vérification');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      alert('Erreur lors de la vérification du paiement');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING: 'En attente',
      PAID: 'Payé (DAF)',
      VERIFIED: 'Vérifié',
      REJECTED: 'Rejeté'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C224E]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B384F]">Gestion des paiements</h1>
        <div className="text-sm text-gray-600">
          {protocols.length} paiement(s) en attente de vérification
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Instructions:</strong> Vérifiez auprès de la DAF que le paiement de 25 000 F CFA a bien été effectué 
              par le chercheur avant de valider le statut de paiement. Une fois vérifié, le protocole pourra passer 
              à l'étape suivante du processus d'évaluation.
            </p>
          </div>
        </div>
      </div>

      {protocols.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun paiement en attente</h3>
          <p className="text-gray-500">Tous les paiements ont été vérifiés.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocole
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chercheur principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date soumission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {protocols.map((protocol) => (
                  <tr key={protocol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {protocol.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: PROT-{protocol.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {protocol.principalInvestigator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {protocol.institution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(protocol.submittedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(protocol.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      25 000 F CFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProtocol(protocol);
                          setShowVerifyModal(true);
                        }}
                        className="bg-[#2C224E] text-white px-4 py-2 rounded-lg hover:bg-[#1B384F] transition-colors"
                      >
                        Vérifier paiement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de vérification de paiement */}
      {showVerifyModal && selectedProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-[#1B384F] mb-4">
              Vérification du paiement
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Détails du protocole</h3>
              <p><strong>Titre:</strong> {selectedProtocol.title}</p>
              <p><strong>Chercheur:</strong> {selectedProtocol.principalInvestigator}</p>
              <p><strong>Institution:</strong> {selectedProtocol.institution}</p>
              <p><strong>Montant:</strong> 25 000 F CFA</p>
            </div>

            <form onSubmit={handleVerifyPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action à effectuer
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="verify"
                      checked={verificationData.action === 'verify'}
                      onChange={(e) => setVerificationData({...verificationData, action: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-green-700">Confirmer le paiement (vérifié auprès de la DAF)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="reject"
                      checked={verificationData.action === 'reject'}
                      onChange={(e) => setVerificationData({...verificationData, action: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-red-700">Rejeter le paiement (non effectué)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaires
                </label>
                <textarea
                  value={verificationData.comments}
                  onChange={(e) => setVerificationData({...verificationData, comments: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent"
                  placeholder="Ajoutez des commentaires sur la vérification..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVerifyModal(false);
                    setSelectedProtocol(null);
                    setVerificationData({ action: 'verify', comments: '' });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    verificationData.action === 'verify' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {verificationData.action === 'verify' ? 'Confirmer le paiement' : 'Rejeter le paiement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
