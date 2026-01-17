import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileTextIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, UserIcon, CalendarIcon, EyeIcon, MessageSquareIcon } from 'lucide-react';

const CommitteeDashboard = () => {
  const { currentUser } = useAuth();

const [assignedProtocols, setAssignedProtocols] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const stats = {
    assignedProtocols: assignedProtocols.length,
    pendingReview: assignedProtocols.filter(p => p.status === 'ASSIGNED').length,
    reviewed: 0,
    thisMonth: assignedProtocols.length,
    avgReviewTime: 7
  };

  React.useEffect(() => {
    const fetchAssignedProtocols = async () => {
      try {
        const response = await fetch('${BASE_URL}/member/protocols/assigned', {
          headers: {
            'X-User-ID': currentUser?.id?.toString() || '',
            'X-User-Role': currentUser?.role || '',
            'X-User-Username': currentUser?.username || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAssignedProtocols(data.protocols.slice(0, 3)); // Limiter à 3 pour le dashboard
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchAssignedProtocols();
    }
  }, [currentUser]);


  const upcomingMeetings = [
    {
      id: 1,
      title: 'Réunion du comité d\'éthique',
      date: '2023-12-15',
      time: '14:00',
      type: 'committee'
    },
    {
      id: 2,
      title: 'Présentation des protocoles prioritaires',
      date: '2023-12-12',
      time: '10:00',
      type: 'presentation'
    },
    {
      id: 3,
      title: 'Formation sur les nouvelles directives éthiques',
      date: '2023-12-20',
      time: '09:00',
      type: 'training'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Terminé</span>;
      case 'in-review':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">En cours</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Haute</span>;
      case 'medium':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Moyenne</span>;
      case 'low':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Basse</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">-</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#00213B]">
            Bienvenue, {currentUser?.name}
          </h2>
          <p className="mt-1 text-[#1B384F]">
            Tableau de bord membre du comité d'éthique
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/dashboard/committee/my-protocols" className="bg-[#00213B] overflow-hidden shadow-sm rounded-lg hover:bg-[#2C224E] transition-colors">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#2C224E] rounded-md p-3">
              <FileTextIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">Mes Protocoles</h3>
              <p className="mt-1 text-sm text-[#EAECEF]">Protocoles qui me sont assignés</p>
            </div>
          </div>
        </Link>

        <Link to="#" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-[#EAECEF]">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#EAECEF] rounded-md p-3">
              <MessageSquareIcon className="h-6 w-6 text-[#00213B]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#00213B]">Commentaires</h3>
              <p className="mt-1 text-sm text-[#1B384F]">Ajouter des observations</p>
            </div>
          </div>
        </Link>

        <Link to="#" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-[#EAECEF]">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-[#EAECEF] rounded-md p-3">
              <CalendarIcon className="h-6 w-6 text-[#00213B]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#00213B]">Réunions</h3>
              <p className="mt-1 text-sm text-[#1B384F]">Calendrier des réunions</p>
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
                <FileTextIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Protocoles assignés</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.assignedProtocols}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">En attente</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingReview}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Examinés</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.reviewed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ce mois-ci</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.thisMonth}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Temps moyen</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.avgReviewTime}j</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Assigned Protocols */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Protocoles assignés</h3>
          </div>
          <div className="bg-white divide-y divide-gray-200">
{loading ? (
              <div className="px-6 py-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : assignedProtocols.length > 0 ? (
              assignedProtocols.map(protocol => (
                <div key={protocol.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#00213B] truncate">{protocol.title}</p>
                      <div className="flex items-center mt-1">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">{protocol.principalInvestigator}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          Assigné le: {new Date(protocol.assignedAt).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-2">
                          {getStatusBadge('pending')}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link to={`/dashboard/committee/review/${protocol.id}`} className="text-[#00213B] hover:text-[#2C224E]">
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                Aucun protocole assigné
              </div>
            )}

          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-center">
            <Link to="/dashboard/committee/my-protocols" className="text-sm font-medium text-[#00213B] hover:text-[#2C224E]">
              Voir mes protocoles assignés
            </Link>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Réunions à venir</h3>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.date).toLocaleDateString()} à {meeting.time}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {meeting.type === 'committee' ? 'Comité' :
                       meeting.type === 'presentation' ? 'Présentation' : 'Formation'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
