import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Protocol {
  id: number;
  title: string;
  principalInvestigator: string;
  institution: string;
  assignedTo: string;
  assignedAt: string;
  status: string;
  protocolCode: string;
}

const RapporteurDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [monthlyProtocols, setMonthlyProtocols] = useState<Protocol[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyProtocols();
  }, [selectedMonth]);

  const fetchMonthlyProtocols = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/rapporteur/monthly-protocols?month=${selectedMonth}`);
      const data = await response.json();
      
      if (data.success) {
        setMonthlyProtocols(data.protocols || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEvaluationSession = () => {
    window.location.href = '/dashboard/rapporteur/evaluation-session';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des protocoles du mois...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord - Rapporteur</h1>
          <p className="text-gray-600">
            Connecté: {currentUser?.firstName} {currentUser?.lastName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={openEvaluationSession}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Session d'Évaluation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Protocoles Assignés - {new Date(selectedMonth).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
        </h2>
        
        <div className="grid gap-4">
          {monthlyProtocols.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun protocole assigné ce mois-ci</p>
            </div>
          ) : (
            monthlyProtocols.map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{protocol.protocolCode}</h3>
                    <p className="text-gray-900">{protocol.title}</p>
                    <p className="text-sm text-gray-600">
                      Chercheur: {protocol.principalInvestigator} | Institution: {protocol.institution}
                    </p>
                    <p className="text-sm text-blue-600">
                      Assigné à: {protocol.assignedTo}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {protocol.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(protocol.assignedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RapporteurDashboard;
