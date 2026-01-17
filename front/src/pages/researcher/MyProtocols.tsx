import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageSquare, Download, Clock, CheckCircle, XCircle, AlertCircle, Upload } from 'lucide-react';
import { apiService } from '../../services/apiService';


const MyProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    verified: 0,
    rejected: 0,
    approved: 0
  });

  // Charger les protocoles depuis l'API
  useEffect(() => {
    const loadProtocols = async () => {
      try {
        const userData = localStorage.getItem('userData');
        console.log('UserData from localStorage:', userData);
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('Parsed user data:', user);
          const userIdentifier = user.userIdentifier || user.username || user.id;
          console.log('User identifier will be:', userIdentifier);
        }
        
        const response = await apiService.getMyProtocols();
        console.log('Réponse getMyProtocols:', response);
        
        if (response.success) {
          let protocolsData = [];
          
          // Vérifier si les données sont dans response.data.protocols ou directement dans response.data
          if (response.data && response.data.protocols) {
            protocolsData = Array.isArray(response.data.protocols) ? response.data.protocols : [];
          } else if (Array.isArray(response.data)) {
            protocolsData = response.data;
          }
          
          // Trier par date de soumission décroissante (plus récent en premier)
          const sortedProtocols = protocolsData.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
          console.log('Protocoles chargés:', sortedProtocols);
          console.log('Status des protocoles:', sortedProtocols.map(p => ({ id: p.id, status: p.status })));
          setProtocols(sortedProtocols);
          
          // Calculer les statistiques à partir des protocoles
          const newStats = {
            total: sortedProtocols.length,
            submitted: sortedProtocols.filter(p => p.status === 'SUBMITTED').length,
            verified: sortedProtocols.filter(p => p.status === 'VERIFIED' || p.status === 'COMMITTEE_APPROVED').length,
            rejected: sortedProtocols.filter(p => p.status === 'VERIFICATION_REJECTED' || p.status === 'COMMITTEE_REJECTED').length,
            inReview: sortedProtocols.filter(p => p.status === 'ASSIGNED_TO_MEMBER').length
          };
          setStats(newStats);
        } else {
          console.error('Erreur lors du chargement des protocoles:', response.error);
        }
      } catch (error) {
        console.error('Erreur de connexion à l\'API:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProtocols();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00213B]"></div>
        <span className="ml-2 text-[#00213B]">Chargement des protocoles...</span>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      SUBMITTED: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Soumis' },
      VERIFIED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Conforme' },
      VERIFICATION_REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Non conforme' },
      ASSIGNED_TO_MEMBER: { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, text: 'En évaluation' },
      COMMITTEE_APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approuvé' },
      COMMITTEE_REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejeté' },
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Brouillon' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, text: status || 'Inconnu' };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#00213B]">Mes Protocoles</h1>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const userIdentifier = userData.userIdentifier || userData.username || userData.email;
                
                const response = await fetch('${BASE_URL}/researcher/fix-protocol-ownership', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userIdentifier })
                });
                const data = await response.json();
                console.log('Fix result:', data);
                window.location.reload();
              } catch (error) {
                console.error('Fix failed:', error);
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50"
          >
            Corriger mes protocoles
          </button>
          <Link
            to="/dashboard/submit-protocol"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00213B] hover:bg-[#2C224E]"
          >
            Nouveau protocole
          </Link>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Soumis</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.submitted}
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
              <p className="text-sm font-medium text-gray-500">Conformes</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.verified}
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
              <p className="text-sm font-medium text-gray-500">Refusés</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En évaluation</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.inReview}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Évolution mensuelle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-[#00213B] mb-4">Évolution des soumissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Derniers 3 mois</h4>
            {(() => {
              const now = new Date();
              const months = [];
              for (let i = 2; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                months.push({ name: monthName, date });
              }
              return months.map((month, idx) => {
                const count = protocols.filter(p => {
                  const pDate = new Date(p.submittedAt);
                  return pDate.getMonth() === month.date.getMonth() && pDate.getFullYear() === month.date.getFullYear();
                }).length;
                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{month.name}</span>
                    <span className="font-semibold text-[#00213B]">{count}</span>
                  </div>
                );
              });
            })()}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Taux de réussite</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Validés</span>
                <span>{stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Refusés</span>
                <span>{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Résumé</h4>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-600">protocoles soumis</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <div className="text-sm text-green-600">approuvés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des protocoles */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-[#00213B]">Historique des protocoles</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {protocols.map((protocol) => (
            <div key={protocol.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-[#00213B] truncate">
                      {protocol.title}
                    </h4>
                    {getStatusBadge(protocol.status)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                    <span>ID: PROT-{protocol.id}</span>
                    <span>Soumis le {new Date(protocol.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    <span>Investigateur: {protocol.principalInvestigator}</span>
                  </div>

                  <div className="text-sm text-[#1B384F] space-y-1">
                    <div><span className="font-medium">Institution:</span> {protocol.institution}</div>
                    <div><span className="font-medium">Durée:</span> {protocol.duration} mois</div>
                    <div><span className="font-medium">Participants:</span> {protocol.participants}</div>
                    {protocol.ethicsConsiderations && (
                      <div><span className="font-medium">Considérations éthiques:</span> {protocol.ethicsConsiderations.substring(0, 100)}...</div>
                    )}
                  </div>
                  
                  {/* Commentaires de vérification pour les protocoles refusés */}
                  {(protocol.status === 'VERIFICATION_REJECTED' || protocol.status === 'COMMITTEE_REJECTED') && protocol.verificationComments && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">Commentaires du secrétariat :</p>
                          <p className="text-sm text-red-700 mt-1">{protocol.verificationComments}</p>
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                            <p className="text-xs text-orange-700">
                              📝 <strong>Action requise :</strong> Vous pouvez modifier ce protocole pour corriger les problèmes signalés et le resoumettre.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Message pour les brouillons */}
                  {protocol.status === 'DRAFT' && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Brouillon non soumis</p>
                          <p className="text-sm text-blue-700 mt-1">Ce protocole est encore en brouillon. Vous pouvez le modifier et le soumettre.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/dashboard/researcher/protocol/${protocol.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-[#00213B] bg-white hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Link>
                  
                  {/* Bouton Modifier pour les protocoles rejetés ou brouillons */}
                  {(['VERIFICATION_REJECTED', 'COMMITTEE_REJECTED', 'DRAFT'].includes(protocol.status)) && (
                    <Link
                      to={`/dashboard/researcher/protocol/${protocol.id}/edit`}
                      className="inline-flex items-center px-3 py-1.5 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Modifier
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProtocols;
