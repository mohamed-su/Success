import React, { useState } from 'react';
import { FileTextIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, UserIcon, CalendarIcon, DollarSignIcon, BarChartIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const FinancialDashboard = () => {
  const {
    currentUser
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  // Mock data for financial dashboard
  const stats = {
    totalProtocols: 45,
    paidProtocols: 32,
    pendingPayments: 13,
    totalRevenue: 2250000,
    thisMonth: 450000 // in CFA
  };
  // Mock data for payment history
  const paymentHistory = [{
    id: '301',
    protocolId: '101',
    title: "Étude sur l'impact des pesticides sur les écosystèmes aquatiques",
    researcher: 'Dr. Moussa Ouédraogo',
    institution: 'Université de Ouagadougou',
    submittedDate: '2023-11-25',
    paymentDate: '2023-11-26',
    amount: 50000,
    status: 'paid',
    paymentMethod: 'Orange Money',
    reference: 'OM12345678'
  }, {
    id: '302',
    protocolId: '102',
    title: 'Analyse des facteurs de risque du paludisme dans les zones urbaines',
    researcher: 'Dr. Aïcha Konaté',
    institution: 'Institut National de Santé Publique',
    submittedDate: '2023-11-23',
    paymentDate: '2023-11-24',
    amount: 50000,
    status: 'paid',
    paymentMethod: 'Virement bancaire',
    reference: 'VB98765432'
  }, {
    id: '303',
    protocolId: '103',
    title: "Évaluation de l'efficacité des programmes de nutrition communautaire",
    researcher: 'Dr. Ibrahim Traoré',
    institution: 'Centre de Recherche en Santé de Nouna',
    submittedDate: '2023-11-20',
    paymentDate: null,
    amount: 50000,
    status: 'pending',
    paymentMethod: null,
    reference: null
  }, {
    id: '304',
    protocolId: '104',
    title: 'Impact des changements climatiques sur les cultures vivrières',
    researcher: 'Dr. Aminata Diallo',
    institution: "Institut de l'Environnement et de Recherches Agricoles",
    submittedDate: '2023-11-18',
    paymentDate: '2023-11-19',
    amount: 50000,
    status: 'paid',
    paymentMethod: 'MoMo',
    reference: 'MM87654321'
  }, {
    id: '305',
    protocolId: '105',
    title: 'Étude sur la prévalence des maladies respiratoires chez les enfants',
    researcher: 'Dr. Souleymane Ouattara',
    institution: 'Centre Hospitalier Universitaire Pédiatrique',
    submittedDate: '2023-11-15',
    paymentDate: null,
    amount: 50000,
    status: 'pending',
    paymentMethod: null,
    reference: null
  }];
  // Filter payments based on search and filters
  const filteredPayments = paymentHistory.filter(payment => {
    // Search filter
    const matchesSearch = payment.title.toLowerCase().includes(searchTerm.toLowerCase()) || payment.researcher.toLowerCase().includes(searchTerm.toLowerCase()) || payment.institution.toLowerCase().includes(searchTerm.toLowerCase());
    // Status filter
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusBadge = status => {
    switch (status) {
      case 'paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Payé
          </span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Inconnu
          </span>;
    }
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };
  return <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Bienvenue, {currentUser?.name}
          </h2>
          <p className="mt-1 text-gray-600">
            Tableau de bord du service financier (DAFF) - Gestion des paiements
            des protocoles
          </p>
        </div>
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
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Protocoles payés
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.paidProtocols}
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
                    Paiements en attente
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.pendingPayments}
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
                <DollarSignIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenu total
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.totalRevenue)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Revenue Chart */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Revenus par mois
            </h3>
            <div className="flex items-center">
              <BarChartIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">2023</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              [Graphique des revenus mensuels - Représentation visuelle]
            </div>
          </div>
        </div>
      </div>
      {/* Payment History */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Historique des paiements
          </h3>
        </div>
        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="relative rounded-md shadow-sm max-w-xs">
              <input type="text" className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Rechercher par titre, chercheur..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center">
              <select id="status-filter" className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="paid">Payés</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>
        {/* Payment list */}
        {filteredPayments.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocole
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chercheur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de soumission
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails du paiement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map(payment => <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileTextIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-green-700 truncate max-w-xs">
                            {payment.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {payment.protocolId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.researcher}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.institution}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.status === 'paid' ? <>
                          <div>{payment.paymentMethod}</div>
                          <div className="text-xs">
                            Réf: {payment.reference}
                          </div>
                          <div className="text-xs">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                        </> : <span className="text-yellow-600">
                          En attente de paiement
                        </span>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="px-6 py-10 text-center">
            <DollarSignIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun paiement trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun paiement ne correspond à vos critères de recherche.
            </p>
          </div>}
      </div>
    </div>;
};
export default FinancialDashboard;
