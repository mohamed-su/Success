import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import apiService from '../../services/apiService';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

const ApiConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const testConnection = async () => {
    setConnectionStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await apiService.testConnection();
      
      if (response.success) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        setErrorMessage(response.error || 'Erreur de connexion inconnue');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erreur de connexion');
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'loading':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'loading':
        return 'Test de connexion...';
      case 'success':
        return 'Backend connecté';
      case 'error':
        return 'Backend déconnecté';
      default:
        return 'Statut inconnu';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium">{getStatusText()}</p>
            {lastChecked && (
              <p className="text-sm opacity-75">
                Dernière vérification: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={testConnection}
          disabled={connectionStatus === 'loading'}
          className="px-3 py-1 text-sm font-medium rounded-md border border-current hover:bg-current hover:bg-opacity-10 transition-colors disabled:opacity-50"
        >
          Tester
        </button>
      </div>
      
      {connectionStatus === 'error' && errorMessage && (
        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <strong>Erreur:</strong> {errorMessage}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Vérifiez que le backend Spring Boot est démarré sur le port configuré
          </p>
        </div>
      )}
      
      {connectionStatus === 'success' && (
        <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✅ Connexion établie avec le backend CERS
          </p>
          <p className="text-xs text-green-600 mt-1">
            API disponible sur: {BASE_URL}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;
