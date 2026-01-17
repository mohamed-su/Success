import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileTextIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, UserIcon, CalendarIcon, ListIcon, FileIcon, Users } from 'lucide-react';
const SecretaryDashboard = () => {
  const {
    currentUser
  } = useAuth();
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les protocoles depuis l'API
  useEffect(() => {
    const loadProtocols = async () => {
      try {
const response = await fetch('${BASE_URL}/secretary/protocols/all');

        const data = await response.json();
        if (data.success) {
          setProtocols(data.protocols);
        } else {
          console.error('Erreur lors du chargement des protocoles:', data.error);
        }
      } catch (error) {
        console.error('Erreur de connexion à l\'API:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProtocols();
  }, []);

  // Calculer les statistiques à partir des données réelles
  const stats = {
    totalProtocols: protocols.length,
    pendingValidation: protocols.filter(p => p.status === 'SUBMITTED').length,
    validated: protocols.filter(p => p.status === 'VERIFIED' || p.status === 'COMMITTEE_APPROVED').length,
    rejected: protocols.filter(p => p.status === 'VERIFICATION_REJECTED' || p.status === 'COMMITTEE_REJECTED').length,
    inReview: protocols.filter(p => p.status === 'ASSIGNED_TO_MEMBER').length,
    thisMonth: protocols.filter(p => {
      const submittedDate = new Date(p.submittedAt);
      const now = new Date();
      return submittedDate.getMonth() === now.getMonth() && submittedDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Prendre les 5 protocoles les plus récents
  const recentProtocols = protocols
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)
    .map(protocol => ({
      id: protocol.id,
      title: protocol.title,
      researcher: protocol.principalInvestigator,
      submittedDate: protocol.submittedAt,
      status: protocol.status === 'SUBMITTED' ? 'pending' :
              protocol.status === 'VERIFIED' || protocol.status === 'COMMITTEE_APPROVED' ? 'validated' :
              protocol.status === 'VERIFICATION_REJECTED' || protocol.status === 'COMMITTEE_REJECTED' ? 'rejected' :
              protocol.status === 'ASSIGNED_TO_MEMBER' ? 'in-review' : 'unknown'
    }));
  // Échéances dynamiques basées sur la date actuelle
  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Génération de la liste des protocoles soumis avant le 20',
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20).toISOString().split('T')[0],
      type: 'report'
    },
    {
      id: 2,
      title: "Réunion du comité d'éthique",
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString().split('T')[0],
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Date limite pour la validation initiale',
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString().split('T')[0],
      type: 'deadline'
    }
  ];
  const getStatusBadge = status => {
    switch (status) {
      case 'validated':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Conforme
          </span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Refusé
          </span>;
      case 'in-review':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            En évaluation
          </span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Inconnu
          </span>;
    }
  };
  const getDeadlineIcon = type => {
    switch (type) {
      case 'report':
        return <FileTextIcon className="h-5 w-5 text-green-500" />;
      case 'meeting':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      case 'deadline':
        return <ClockIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  return <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#00213B]">
            Bienvenue, {currentUser?.name}
          </h2>
          <p className="mt-1 text-[#1B384F]">
            Tableau de bord du secrétariat du comité d'éthique
          </p>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/secretary/validate" className="bg-[#00213B] overflow-hidden shadow-sm rounded-lg hover:bg-[#2C224E] transition-colors">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#2C224E] rounded-md p-3">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">
                Confirmer les protocoles
              </h3>
              <p className="mt-1 text-sm text-[#EAECEF]">
                Vérifier et confirmer les nouveaux protocoles soumis
              </p>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/secretary/payments" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-[#EAECEF]">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#EAECEF] rounded-md p-3">
              <ListIcon className="h-6 w-6 text-[#00213B]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#00213B]">
                Suivi des paiements
              </h3>
              <p className="mt-1 text-sm text-[#1B384F]">
                Vérifier les reçus de paiement
              </p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/secretary/reports" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-[#EAECEF]">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#EAECEF] rounded-md p-3">
              <FileTextIcon className="h-6 w-6 text-[#00213B]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#00213B]">
                Générer la liste des protocoles soumis
              </h3>
              <p className="mt-1 text-sm text-[#1B384F]">
                Créer des listes pour le comité
              </p>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/secretary/ethics-committee" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-[#EAECEF]">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#EAECEF] rounded-md p-3">
              <Users className="h-6 w-6 text-[#00213B]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#00213B]">Distribution des protocoles</h3>
              <p className="mt-1 text-sm text-[#1B384F]">
                Partager les protocoles avec le président du comité
              </p>
            </div>
          </div>
        </Link>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                    En attente de validation
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.pendingValidation}
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
                    Validés
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.validated}
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
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En évaluation
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.inReview}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Protocols */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Protocoles récents
            </h3>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-4 text-center text-gray-500">
                Chargement des protocoles...
              </div>
            ) : recentProtocols.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                Aucun protocole récent
              </div>
            ) : (
              recentProtocols.map(protocol => <div key={protocol.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#00213B] truncate">
                      {protocol.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {protocol.researcher}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Soumis le{' '}
                      {new Date(protocol.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {getStatusBadge(protocol.status)}
                  </div>
                </div>
              </div>)
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-center">
            <Link to="/dashboard/secretary/validate" className="text-sm font-medium text-[#00213B] hover:text-[#2C224E]">
              Voir tous les protocoles
            </Link>
          </div>
        </div>
        {/* Upcoming Deadlines */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Échéances à venir
            </h3>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {upcomingDeadlines.map(deadline => <div key={deadline.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getDeadlineIcon(deadline.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {deadline.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(deadline.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${new Date(deadline.date) < new Date(new Date().setDate(new Date().getDate() + 3)) ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24))}{' '}
                      jours
                    </span>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-center">
            <Link to="#" className="text-sm font-medium text-[#00213B] hover:text-[#2C224E]">
              Voir toutes les échéances
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default SecretaryDashboard;
