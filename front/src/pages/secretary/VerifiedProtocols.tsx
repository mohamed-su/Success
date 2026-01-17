import React, { useState, useEffect } from 'react';
import { CheckCircle, Eye, Calendar, User, FileText, Download } from 'lucide-react';

const VerifiedProtocols = () => {
  const [verifiedProtocols, setVerifiedProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadVerifiedProtocols = async () => {
      try {
        const response = await fetch('${BASE_URL}/secretary/protocols/verified');
        const data = await response.json();
        if (data.success) {
          setVerifiedProtocols(data.protocols);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des protocoles vérifiés:', error);
      }
    };

    loadVerifiedProtocols();
  }, []);

  const openModal = (protocol) => {
    setSelectedProtocol(protocol);
    setShowModal(true);
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch('${BASE_URL}/secretary/protocols/export-pdf?status=verified');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'liste-protocoles-conformes.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Liste téléchargée avec succès !');
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
        <h1 className="text-2xl font-bold text-[#00213B]">Protocoles Conformes</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-[#1B384F]">
            {verifiedProtocols.length} protocole(s) conforme(s)
          </div>
          {verifiedProtocols.length > 0 && (
            <button
              onClick={downloadPDF}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger la liste PDF
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-[#00213B]">Protocoles Vérifiés et Conformes</h3>
            <p className="text-sm text-gray-600">
              Ces protocoles ont été vérifiés par la secrétaire et sont conformes aux exigences du CERS
            </p>
          </div>
        </div>
      </div>

      {/* Liste des protocoles conformes */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-[#00213B]">Liste des Protocoles Conformes</h3>
        </div>
        
        {verifiedProtocols.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun protocole conforme pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {verifiedProtocols.map((protocol) => (
              <div key={protocol.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-[#00213B] truncate">
                        {protocol.title}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conforme
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span><strong>Investigateur:</strong> {protocol.principalInvestigator}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        <span><strong>Institution:</strong> {protocol.institution}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span><strong>Vérifié le:</strong> {new Date(protocol.verifiedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span><strong>ID Protocole:</strong> PROT-{protocol.id}</span>
                      </div>
                    </div>

                    {protocol.verificationComments && (
                      <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                        <strong>Commentaires:</strong> {protocol.verificationComments}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openModal(protocol)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir détails
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
                  Détails du Protocole Conforme
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Titre</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Investigateur principal</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.principalInvestigator}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Institution</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.institution}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Type d'étude</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.studyType}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Durée (mois)</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.duration}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Participants</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProtocol.participants}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B]">Date de vérification</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedProtocol.verifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Statut de Conformité</h4>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Protocole Conforme</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedProtocol.verificationComments && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#00213B]">Commentaires de vérification</label>
                  <p className="mt-1 text-sm text-gray-900 bg-green-50 p-3 rounded-md">
                    {selectedProtocol.verificationComments}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedProtocols;
