import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, paymentsResponse] = await Promise.all([
        fetch(`${BASE_URL}/admin/dashboard/stats`),
        fetch(`${BASE_URL}/admin/protocols/pending-payment`)

      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPendingPayments(paymentsData.protocols || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C224E]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1B384F] mb-6">Tableau de bord - Administrateur</h1>
      
      {/* Statistiques générales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Utilisateurs totaux</h3>
            <p className="text-3xl font-bold text-[#2C224E]">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">{stats.activeUsers} actifs</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Protocoles totaux</h3>
            <p className="text-3xl font-bold text-[#2C224E]">{stats.totalProtocols}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Paiements en attente</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Rôles</h3>
            <div className="text-sm">
              <p>Chercheurs: {stats.usersByRole?.researcher || 0}</p>
              <p>Comité: {stats.usersByRole?.committee || 0}</p>
              <p>Secrétaires: {stats.usersByRole?.secretary || 0}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard/admin/users')}
        >
          <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Gestion des utilisateurs</h3>
          <p className="text-gray-600">Créer, modifier et gérer les comptes utilisateurs</p>
        </div>
        
        <div 
          className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard/admin/payments')}
        >
          <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Vérification paiements</h3>
          <p className="text-gray-600">Vérifier les paiements effectués à la DAF</p>
          {pendingPayments.length > 0 && (
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-2">
              {pendingPayments.length} en attente
            </span>
          )}
        </div>
        
        <div 
          className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard/admin/settings')}
        >
          <h3 className="text-lg font-semibold text-[#1B384F] mb-2">Configuration système</h3>
          <p className="text-gray-600">Paramètres et configuration du système</p>
        </div>
      </div>
      
      {/* Paiements en attente de vérification */}
      {pendingPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#1B384F] mb-4">Paiements à vérifier</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Protocole</th>
                  <th className="px-4 py-2 text-left">Chercheur</th>
                  <th className="px-4 py-2 text-left">Institution</th>
                  <th className="px-4 py-2 text-left">Date soumission</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.slice(0, 5).map((protocol) => (
                  <tr key={protocol.id} className="border-t">
                    <td className="px-4 py-2">{protocol.title}</td>
                    <td className="px-4 py-2">{protocol.principalInvestigator}</td>
                    <td className="px-4 py-2">{protocol.institution}</td>
                    <td className="px-4 py-2">
                      {new Date(protocol.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button 
                        className="bg-[#2C224E] text-white px-3 py-1 rounded text-sm hover:bg-[#1B384F]"
                        onClick={() => navigate(`/dashboard/admin/payments/${protocol.id}`)}
                      >
                        Vérifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingPayments.length > 5 && (
            <div className="mt-4 text-center">
              <button 
                className="text-[#2C224E] hover:text-[#1B384F] font-medium"
                onClick={() => navigate('/dashboard/admin/payments')}
              >
                Voir tous les paiements ({pendingPayments.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
