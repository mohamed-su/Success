import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Settings, BarChart3 } from 'lucide-react';
import QuickAssignment from '../../components/QuickAssignment';

const PresidentDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tableau de Bord du Président
        </h2>
        <p className="text-gray-600 mb-6">
          Gérez les protocoles et supervisez le travail du comité d'éthique.
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/president/assignments" className="bg-blue-600 overflow-hidden shadow-sm rounded-lg hover:bg-blue-700 transition-colors">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-700 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">
                Attribution des Protocoles
              </h3>
              <p className="mt-1 text-sm text-blue-100">
                Attribuer les protocoles aux membres
              </p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/president/distribute" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Distribuer Protocoles
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Gérer la distribution
              </p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/president/validation" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Validation Finale
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Approuver les décisions
              </p>
            </div>
          </div>
        </Link>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
              <BarChart3 className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Statistiques
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Voir les rapports
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignation rapide */}
      <QuickAssignment />
    </div>
  );
};
export default PresidentDashboard;
