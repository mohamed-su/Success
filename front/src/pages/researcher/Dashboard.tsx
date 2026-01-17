import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import SessionInfo from '../../components/common/SessionInfo';
import DataProtection from '../../components/common/DataProtection';

import { FileTextIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, PlusIcon } from 'lucide-react';

const ResearcherDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalProtocols: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0
  });
  const [recentProtocols, setRecentProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les protocoles
        const protocolsResponse = await apiService.getMyProtocols();
        if (protocolsResponse.success) {
          const protocols = protocolsResponse.data?.protocols || protocolsResponse.data || [];
          
          // Calculer les statistiques à partir des protocoles
          const newStats = {
            totalProtocols: protocols.length,
            pendingReview: protocols.filter(p => ['SUBMITTED', 'VERIFIED'].includes(p.status)).length,
            approved: protocols.filter(p => ['APPROVED', 'VERIFIED'].includes(p.status)).length,
            rejected: protocols.filter(p => ['REJECTED', 'VERIFICATION_REJECTED'].includes(p.status)).length
          };
          setStats(newStats);
          
          // Protocoles récents
          const recent = protocols
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
            .slice(0, 3)
            .map(p => ({
              id: p.id,
              title: p.title,
              submittedDate: p.submittedAt,
              status: p.status,
              comments: 0
            }));
          setRecentProtocols(recent);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'VERIFIED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Approuvé
          </span>;
      case 'SUBMITTED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>;
      case 'REJECTED':
      case 'VERIFICATION_REJECTED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejeté
          </span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>;
    }
  };

  return (
<DataProtection requiredRole="researcher">
      <div className="space-y-6">
        {/* Welcome Banner avec informations de session */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#00213B]">
                  Bienvenue, {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <p className="mt-1 text-[#1B384F]">
                  Voici un aperçu de vos protocoles de recherche et leur statut.
                </p>
                {loading && (
                  <p className="mt-2 text-sm text-blue-600">Chargement de vos données...</p>
                )}
                {error && (
                  <p className="mt-2 text-sm text-red-600">Erreur: {error}</p>
                )}
              </div>
              <SessionInfo />
            </div>
          </div>
        </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/dashboard/researcher/submit" className="bg-[#00213B] overflow-hidden shadow-sm rounded-lg hover:bg-[#2C224E] transition-colors">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#2C224E] rounded-md p-3">
              <PlusIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">
                Soumettre un protocole
              </h3>
              <p className="mt-1 text-sm text-[#EAECEF]">
                Déposez un nouveau protocole pour évaluation
              </p>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/researcher/protocols" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-[#EAECEF]">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#EAECEF] rounded-md p-3">
              <FileTextIcon className="h-6 w-6 text-[#00213B]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#00213B]">
                Mes protocoles
              </h3>
              <p className="mt-1 text-sm text-[#1B384F]">
                Consultez tous vos protocoles soumis
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total des protocoles
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.totalProtocols}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En attente d'évaluation
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.pendingReview}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approuvés
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.approved}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejetés
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.rejected}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Protocols */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Protocoles récents
          </h3>
        </div>
        <div className="bg-white divide-y divide-gray-200">
          {recentProtocols.map(protocol => (
            <Link key={protocol.id} to={`/protocol/${protocol.id}`} className="block hover:bg-gray-50">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#00213B] truncate">
                      {protocol.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Soumis le {new Date(protocol.submittedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                    {getStatusBadge(protocol.status)}
                    <div className="text-sm text-gray-500">
                      {protocol.comments} commentaire(s)
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-center">
          <Link to="/dashboard/researcher/protocols" className="text-sm font-medium text-[#00213B] hover:text-[#2C224E]">
            Voir tous les protocoles
          </Link>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Dates importantes
          </h3>
        </div>
        <div className="px-6 py-5">
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Révision du protocole #2
                  </p>
                  <p className="text-sm text-gray-500">
                    Réponse attendue du comité d'éthique
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Dans 3 jours
                </div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Soumission de documents complémentaires
                  </p>
                  <p className="text-sm text-gray-500">
                    Protocole #3 - Documents manquants
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Dans 7 jours
                </div>
              </div>
            </li>
          </ul>
        </div>
</div>
      </div>
    </DataProtection>

  );
};

export default ResearcherDashboard;
