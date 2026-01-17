import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Users, BarChart3 } from 'lucide-react';

const RapporteurDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tableau de Bord du Rapporteur
        </h2>
        <p className="text-gray-600 mb-6">
          Gérez les décisions finales du comité d'éthique et supervisez les protocoles assignés.
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/dashboard/rapporteur/decisions" className="bg-blue-600 overflow-hidden shadow-sm rounded-lg hover:bg-blue-700 transition-colors">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-700 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">
                Décisions Finales
              </h3>
              <p className="mt-1 text-sm text-blue-100">
                Approuver ou rejeter les protocoles
              </p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/member/assigned" className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <div className="p-6 flex items-center">
            <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Protocoles Assignés
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Voir mes protocoles à évaluer
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
                Voir les rapports d'activité
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nouvelle fonctionnalité */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>🎉 NOUVELLE FONCTIONNALITÉ AJOUTÉE !</strong><br />
              • <strong>"Décisions Finales"</strong> - Nouvelle page pour examiner tous les protocoles conformes<br />
              • Accès direct aux protocoles validés par la secrétaire<br />
              • Formulaire de décision finale (Approuvé/Rejeté)<br />
              • Cliquez sur le bouton bleu "Décisions Finales" ci-dessus pour accéder à cette fonctionnalité
            </p>
          </div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Rôle du Rapporteur :</strong><br />
              • Examiner tous les protocoles conformes validés par la secrétaire<br />
              • Prendre les décisions finales lors des sessions du comité<br />
              • Remplir les formulaires de décision (approbation/rejet)<br />
              • Superviser le processus d'évaluation des membres du comité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapporteurDashboard;
