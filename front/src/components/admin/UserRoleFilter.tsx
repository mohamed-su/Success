import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

interface Role {
  name: string;
  displayName: string;
  count: number;
}

interface UserRoleFilterProps {
  onRoleChange: (role: string | null) => void;
  selectedRole: string | null;
}

const UserRoleFilter: React.FC<UserRoleFilterProps> = ({ onRoleChange, selectedRole }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await apiService.getRoles();
      console.log('Réponse getRoles:', response);
      if (response.success && response.data) {
        // Vérifier si response.data.roles existe, sinon utiliser response.data directement
        const rolesData = response.data.roles || response.data;
        console.log('Données des rôles:', rolesData);
        if (Array.isArray(rolesData)) {
          setRoles(rolesData);
        } else {
          console.error('Les données des rôles ne sont pas un tableau:', rolesData);
          setRoles([]);
        }
      } else {
        console.error('Réponse invalide:', response);
        setRoles([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onRoleChange(value === 'all' ? null : value);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Chargement des rôles...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">
        Filtrer par rôle :
      </label>
      <select
        id="role-filter"
        value={selectedRole || 'all'}
        onChange={handleRoleChange}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">Tous les rôles</option>
        {roles.map((role) => (
          <option key={role.name} value={role.name}>
            {role.displayName} ({role.count})
          </option>
        ))}
      </select>
      
      {selectedRole && (
        <button
          onClick={() => onRoleChange(null)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Effacer le filtre
        </button>
      )}
    </div>
  );
};

export default UserRoleFilter;
