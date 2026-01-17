import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, User, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';

const ProtocolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProtocol = async () => {
      try {
        const response = await apiService.getProtocolDetails(id!);
        if (response.success) {
          setProtocol(response.data.protocol);
        } else {
          console.error('Erreur:', response.error);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProtocol();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      SUBMITTED: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Soumis' },
      VALIDATED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Validé' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejeté' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: status };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00213B]"></div>
        <span className="ml-2 text-[#00213B]">Chargement...</span>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Protocole non trouvé</p>
        <button
          onClick={() => navigate('/dashboard/researcher/protocols')}
          className="mt-4 text-[#00213B] hover:underline"
        >
          Retour à mes protocoles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/researcher/protocols')}
          className="flex items-center text-[#00213B] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes protocoles
        </button>
        {getStatusBadge(protocol.status)}
      </div>

      {/* Informations principales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#00213B] mb-2">{protocol.title}</h1>
          <p className="text-gray-600">ID: PROT-{protocol.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#00213B] mb-1">
                Investigateur principal
              </label>
              <p className="text-gray-900">{protocol.principalInvestigator}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00213B] mb-1">
                Institution
              </label>
              <p className="text-gray-900">{protocol.institution}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00213B] mb-1">
                Type d'étude
              </label>
              <p className="text-gray-900">{protocol.studyType || 'Non spécifié'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#00213B] mb-1">
                Date de soumission
              </label>
              <p className="text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(protocol.submittedAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00213B] mb-1">
                Durée de l'étude
              </label>
              <p className="text-gray-900">{protocol.duration} mois</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00213B] mb-1">
                Nombre de participants
              </label>
              <p className="text-gray-900">{protocol.participants}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-[#00213B] mb-2">
            Description
          </label>
          <p className="text-gray-900 bg-gray-50 p-4 rounded-md">{protocol.description}</p>
        </div>

        {protocol.ethicsConsiderations && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#00213B] mb-2">
              Considérations éthiques
            </label>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {protocol.ethicsConsiderations}
            </p>
          </div>
        )}
      </div>

      {/* Documents soumis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-[#00213B] mb-4">Documents soumis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Protocole principal</p>
                <p className="text-sm text-gray-600">{protocol.protocolFileName}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(`${BASE_URL}/files/view-by-protocol/${protocol.id}/protocol`, '_blank')}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Ouvrir
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Formulaire de consentement</p>
                <p className="text-sm text-gray-600">{protocol.consentFormFileName}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(`${BASE_URL}/files/view-by-protocol/${protocol.id}/consent`, '_blank')}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Ouvrir
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">CVs des investigateurs</p>
                <p className="text-sm text-gray-600">{protocol.cvFilesNames}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(`${BASE_URL}/files/view-by-protocol/${protocol.id}/cv`, '_blank')}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Ouvrir
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Reçu de paiement</p>
                <p className="text-sm text-gray-600">{protocol.paymentReceiptFileName}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(`${BASE_URL}/files/view-by-protocol/${protocol.id}/receipt`, '_blank')}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Ouvrir
            </button>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-[#00213B] mb-4">Historique</h3>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div>
              <p className="font-medium text-blue-800">Protocole soumis</p>
              <p className="text-sm text-blue-600">
                {new Date(protocol.submittedAt).toLocaleDateString()} - Soumis par {protocol.submitterName}
              </p>
            </div>
          </div>

          {protocol.status === 'VALIDATED' && (
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-green-800">Protocole validé</p>
                <p className="text-sm text-green-600">Validé par le secrétariat</p>
              </div>
            </div>
          )}

          {protocol.status === 'REJECTED' && (
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-red-800">Protocole rejeté</p>
                <p className="text-sm text-red-600">Rejeté par le secrétariat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolDetails;
