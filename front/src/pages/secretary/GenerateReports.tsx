import React, { useState, useEffect } from 'react';
import { FileTextIcon, DownloadIcon, PrinterIcon, CalendarIcon, FilterIcon, BarChartIcon, PieChartIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
const GenerateReports = () => {
  const {
    addNotification
  } = useNotifications();
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Début d'année
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    status: 'all',
    researchArea: 'all',
    institution: 'all'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [protocols, setProtocols] = useState([]);
  const [filteredProtocols, setFilteredProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [studyTypes, setStudyTypes] = useState([]);

  // Charger les protocoles depuis l'API
  const loadProtocols = async () => {
    try {
const response = await fetch('${BASE_URL}/secretary/protocols/all');

      const data = await response.json();
      console.log('Données reçues:', data);
      if (data.success) {
        setProtocols(data.protocols);
        console.log('Protocoles chargés:', data.protocols.length);
        // Extraire les institutions et types d'étude uniques
        const uniqueInstitutions = [...new Set(data.protocols.map(p => p.institution).filter(Boolean))];
        const uniqueStudyTypes = [...new Set(data.protocols.map(p => p.studyType).filter(Boolean))];
        setInstitutions(uniqueInstitutions);
        setStudyTypes(uniqueStudyTypes);
        console.log('Institutions:', uniqueInstitutions);
        console.log('Types d\'\u00e9tude:', uniqueStudyTypes);
      } else {
        console.error('Erreur lors du chargement des protocoles:', data.error);
      }
    } catch (error) {
      console.error('Erreur de connexion à l\'API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProtocols();
  }, []);

  // Mise à jour automatique des filtres
  useEffect(() => {
    const interval = setInterval(() => {
      loadProtocols();
    }, 30000); // Actualiser toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  // Filtrer les protocoles selon les critères
  useEffect(() => {
    let filtered = protocols.filter(protocol => {
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'approved' && (protocol.status === 'VERIFIED' || protocol.status === 'verified')) ||
        (filters.status === 'pending' && (protocol.status === 'SUBMITTED' || protocol.status === 'submitted')) ||
        (filters.status === 'rejected' && (protocol.status === 'VERIFICATION_REJECTED' || protocol.status === 'verification_rejected'));
      
      const matchesInstitution = filters.institution === 'all' || protocol.institution === filters.institution;
      const matchesStudyType = filters.researchArea === 'all' || protocol.studyType === filters.researchArea;
      
      // Filtrage par date plus flexible
      let matchesDateRange = true;
      if (protocol.submittedAt && dateRange.startDate && dateRange.endDate) {
        const protocolDate = new Date(protocol.submittedAt);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
        matchesDateRange = protocolDate >= startDate && protocolDate <= endDate;
      }
      
      return matchesStatus && matchesInstitution && matchesStudyType && matchesDateRange;
    });
    
    setFilteredProtocols(filtered);
  }, [protocols, filters, dateRange]);
  // Calculer les statistiques à partir des données filtrées
  const statistics = {
    totalProtocols: filteredProtocols.length,
    approved: filteredProtocols.filter(p => p.status === 'VERIFIED' || p.status === 'verified').length,
    rejected: filteredProtocols.filter(p => p.status === 'VERIFICATION_REJECTED' || p.status === 'verification_rejected').length,
    pending: filteredProtocols.filter(p => p.status === 'SUBMITTED' || p.status === 'submitted').length,
    totalParticipants: filteredProtocols.reduce((sum, p) => sum + (p.participants || 0), 0),
    averageParticipants: filteredProtocols.length > 0 ? Math.round(filteredProtocols.reduce((sum, p) => sum + (p.participants || 0), 0) / filteredProtocols.length) : 0,
    averageDuration: filteredProtocols.length > 0 ? Math.round(filteredProtocols.reduce((sum, p) => sum + (p.duration || 0), 0) / filteredProtocols.length) : 0,
    institutionStats: institutions.map(inst => ({
      name: inst,
      count: filteredProtocols.filter(p => p.institution === inst).length
    })),
    studyTypeStats: studyTypes.map(type => ({
      name: type,
      count: filteredProtocols.filter(p => p.studyType === type).length
    })),
    processingTime: {
      average: 14,
      min: 7,
      max: 30
    }
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      addNotification({
        title: 'Rapport généré',
        message: 'Le rapport a été généré avec succès et est prêt à être téléchargé.'
      });
    }, 2000);
  };
  const handleFilterChange = e => {
    const {
      name,
      value
    } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  const handleDateRangeChange = e => {
    const {
      name,
      value
    } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };
  const downloadPDF = async (status = 'all') => {
    try {
const response = await fetch(`${BASE_URL}/secretary/protocols/simple-pdf?status=${status}`);

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
        addNotification({
          title: 'Téléchargement réussi',
          message: 'Le fichier PDF a été téléchargé avec succès.'
        });
      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      addNotification({
        title: 'Erreur de téléchargement',
        message: 'Une erreur est survenue lors du téléchargement du PDF.'
      });
    }
  };

  const shareWithPresident = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/ethics-committee/protocols/export-for-president');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `protocoles-pour-president-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        addNotification({
          title: 'Partage réussi',
          message: 'La liste des protocoles conformes a été partagée avec le président.'
        });
      } else {
        throw new Error('Erreur lors du partage');
      }
    } catch (error) {
      console.error('Erreur:', error);
      addNotification({
        title: 'Erreur de partage',
        message: 'Une erreur est survenue lors du partage avec le président.'
      });
    }
  };

  const getStatusBadge = status => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'verified':
      case 'approved':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Conforme
          </span>;
      case 'submitted':
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>;
      case 'verification_rejected':
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Refusé
          </span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Inconnu
          </span>;
    }
  };
  return <div className="space-y-6">
      {/* Quick Download Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => downloadPDF('all')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Tous les protocoles</span>
        </button>
        <button
          onClick={() => downloadPDF('pending')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>En attente</span>
        </button>
        <button
          onClick={() => downloadPDF('verified')}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Conformes</span>
        </button>
        <button
          onClick={() => downloadPDF('rejected')}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Refusés</span>
        </button>
      </div>

      {/* Partage avec le président */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Partager avec le Président du Comité</h3>
        <p className="text-sm text-blue-700 mb-4">
          Envoyer la liste des protocoles conformes au président pour attribution aux membres du comité.
        </p>
        <button
          onClick={() => shareWithPresident()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Partager les protocoles conformes</span>
        </button>
      </div>

      {/* Report Configuration */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Génération de la liste des protocoles soumis
          </h2>
          <button
            onClick={loadProtocols}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de rapport
              </label>
              <div className="mt-1">
                <select className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" value={reportType} onChange={e => setReportType(e.target.value)}>
                  <option value="monthly">Rapport mensuel</option>
                  <option value="quarterly">Rapport trimestriel</option>
                  <option value="annual">Rapport annuel</option>
                  <option value="custom">Période personnalisée</option>
                  <option value="committee">Liste pour le comité</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <div className="mt-1">
                  <input type="date" id="startDate" name="startDate" value={dateRange.startDate} onChange={handleDateRangeChange} className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <div className="mt-1">
                  <input type="date" id="endDate" name="endDate" value={dateRange.endDate} onChange={handleDateRangeChange} className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <div className="mt-1">
                <select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <option value="all">Tous les statuts</option>
                  <option value="approved">Approuvés</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="researchArea" className="block text-sm font-medium text-gray-700">
                Type d'étude
              </label>
              <div className="mt-1">
                <select id="researchArea" name="researchArea" value={filters.researchArea} onChange={handleFilterChange} className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <option value="all">Tous les types</option>
                  {studyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <div className="mt-1">
                <select id="institution" name="institution" value={filters.institution} onChange={handleFilterChange} className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <option value="all">Toutes les institutions</option>
                  {institutions.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button 
              type="button" 
              onClick={() => {
                setFilters({ status: 'all', researchArea: 'all', institution: 'all' });
                setDateRange({
                  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                });
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FilterIcon className="-ml-1 mr-2 h-4 w-4" />
              Réinitialiser les filtres
            </button>
            <button type="button" onClick={handleGenerateReport} disabled={isGenerating} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
              {isGenerating ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </> : <>
                  <FileTextIcon className="-ml-1 mr-2 h-5 w-5" />
                  Générer la liste
                </>}
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Aperçu de la liste
          </h2>
          <div className="flex space-x-2">
            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <PrinterIcon className="h-4 w-4 mr-1" />
              Imprimer
            </button>
            <button 
              type="button" 
              onClick={() => downloadPDF(filters.status)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              Télécharger PDF
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Liste des protocoles de recherche
              </h3>
              <div className="text-sm text-gray-500 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Période: {new Date(dateRange.startDate).toLocaleDateString()} -{' '}
                {new Date(dateRange.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="py-6 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Résumé statistique
            </h4>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 overflow-hidden shadow-sm rounded-lg">
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
                        <dd className="text-lg font-medium text-gray-900">
                          {statistics.totalProtocols}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow-sm rounded-lg">
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
                        <dd className="text-lg font-medium text-gray-900">
                          {statistics.approved}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow-sm rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          En attente
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {statistics.pending}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow-sm rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Rejetés
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {statistics.rejected}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques détaillées */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Participants
                  </h5>
                  <BarChartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total participants:</span>
                    <span className="font-medium">{statistics.totalParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Moyenne par protocole:</span>
                    <span className="font-medium">{statistics.averageParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Durée moyenne:</span>
                    <span className="font-medium">{statistics.averageDuration} mois</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Par type d'étude
                  </h5>
                  <PieChartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {statistics.studyTypeStats.slice(0, 5).map(stat => (
                    <div key={stat.name} className="flex justify-between">
                      <span className="text-sm text-gray-600 truncate">{stat.name}:</span>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Par institution
                  </h5>
                  <BarChartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {statistics.institutionStats.slice(0, 5).map(stat => (
                    <div key={stat.name} className="flex justify-between">
                      <span className="text-sm text-gray-600 truncate">{stat.name}:</span>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-4">
                  Temps de traitement des protocoles
                </h5>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <span className="block text-lg font-medium text-gray-900">
                      {statistics.processingTime.min} jours
                    </span>
                    <span className="text-sm text-gray-500">Minimum</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-medium text-gray-900">
                      {statistics.processingTime.average} jours
                    </span>
                    <span className="text-sm text-gray-500">Moyenne</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-medium text-gray-900">
                      {statistics.processingTime.max} jours
                    </span>
                    <span className="text-sm text-gray-500">Maximum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Protocol List */}
          <div className="py-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Liste des protocoles ({filteredProtocols.length}/{protocols.length})
              </h4>
              <div className="text-sm text-gray-500">
                Filtres actifs: {filters.status !== 'all' ? 'Statut, ' : ''}
                {filters.institution !== 'all' ? 'Institution, ' : ''}
                {filters.researchArea !== 'all' ? 'Type, ' : ''}
                Période
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocole
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chercheur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de soumission
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Chargement des protocoles...
                      </td>
                    </tr>
                  ) : filteredProtocols.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Aucun protocole trouvé avec les filtres actuels
                        <br />
                        <small className="text-xs">
                          Total dans la base: {protocols.length} protocoles
                        </small>
                      </td>
                    </tr>
                  ) : (
                    filteredProtocols.map(protocol => <tr key={protocol.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {protocol.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {protocol.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {protocol.studyType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {protocol.principalInvestigator}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {protocol.institution}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(protocol.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(protocol.status)}
                        </td>
                      </tr>)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default GenerateReports;
