import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, Clock } from 'lucide-react';

interface SessionInfoProps {
  showDetails?: boolean;
  className?: string;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ 
  showDetails = false, 
  className = "" 
}) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) return null;

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'researcher': 'Chercheur',
      'secretary': 'Secrétaire',
      'committee': 'Membre du Comité',
      'committee_member': 'Membre du Comité',
      'rapporteur': 'Rapporteur',
      'president': 'Président',
      'admin': 'Administrateur'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'researcher': 'bg-blue-100 text-blue-800',
      'secretary': 'bg-green-100 text-green-800',
      'committee': 'bg-purple-100 text-purple-800',
      'committee_member': 'bg-purple-100 text-purple-800',
      'rapporteur': 'bg-orange-100 text-orange-800',
      'president': 'bg-red-100 text-red-800',
      'admin': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getRoleColor(userRole)} ${className}`}>
        <User className="w-3 h-3" />
        <span>{currentUser.firstName} {currentUser.lastName}</span>
        <span className="font-medium">({getRoleDisplayName(userRole)})</span>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {currentUser.firstName} {currentUser.lastName}
          </h3>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
          <Shield className="w-3 h-3 inline mr-1" />
          {getRoleDisplayName(userRole)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">ID Utilisateur:</span>
          <p className="font-mono text-xs">{currentUser.id}</p>
        </div>
        <div>
          <span className="text-gray-500">Nom d'utilisateur:</span>
          <p className="font-mono text-xs">{currentUser.username}</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Session active - Données privées et sécurisées</span>
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;
