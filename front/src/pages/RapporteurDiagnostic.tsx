import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../config/api';

const RapporteurDiagnostic: React.FC = () => {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results: any = {};

    // Test 1: Vérifier les données utilisateur
    results.userData = {
      currentUser,
      localStorage: {
        userData: localStorage.getItem('userData'),
        userId: localStorage.getItem('userId'),
        userRole: localStorage.getItem('userRole'),
        authToken: localStorage.getItem('authToken')
      }
    };

    // Test 2: Test direct de l'API
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/rapporteur/protocols`, {
        headers: {
          'X-User-ID': currentUser?.id?.toString() || '',
          'X-User-Role': currentUser?.role || '',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      results.apiTest = {
        status: response.status,
        success: response.ok,
        data
      };
    } catch (error) {
      results.apiTest = {
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }

    // Test 3: Test avec différents formats de rôle
    const roleVariants = ['RAPPORTEUR', 'rapporteur', 'COMMITTEE_MEMBER', 'committee_member'];
    results.roleTests = {};
    
    for (const role of roleVariants) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/rapporteur/protocols`, {
          headers: {
            'X-User-ID': currentUser?.id?.toString() || '',
            'X-User-Role': role,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        results.roleTests[role] = {
          status: response.status,
          success: data.success,
          protocolCount: data.protocols?.length || 0
        };
      } catch (error) {
        results.roleTests[role] = { error: error instanceof Error ? error.message : 'Erreur' };
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.id) {
      runDiagnostic();
    }
  }, [currentUser]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Diagnostic Rapporteur</h1>
      
      <button 
        onClick={runDiagnostic}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Relancer les tests'}
      </button>

      <div className="space-y-6">
        {/* Données utilisateur */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">1. Données Utilisateur</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(testResults.userData, null, 2)}
          </pre>
        </div>

        {/* Test API */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">2. Test API Direct</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(testResults.apiTest, null, 2)}
          </pre>
        </div>

        {/* Tests de rôles */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">3. Tests avec Différents Rôles</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(testResults.roleTests, null, 2)}
          </pre>
        </div>

        {/* Recommandations */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-semibold text-yellow-800">Que vérifier :</h3>
          <ul className="mt-2 text-yellow-700 text-sm space-y-1">
            <li>• currentUser.id doit être 11 pour le rapporteur de test</li>
            <li>• currentUser.role doit être 'RAPPORTEUR' ou 'rapporteur'</li>
            <li>• L'API doit retourner success: true avec des protocoles</li>
            <li>• Au moins un des tests de rôle doit réussir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RapporteurDiagnostic;