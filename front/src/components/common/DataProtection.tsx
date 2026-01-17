import React from 'react';
import { usePermissions } from '../../hooks/useRoleBasedData';
import { Shield, AlertTriangle } from 'lucide-react';

interface DataProtectionProps {
  requiredRole: string | string[];
  resource?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

const DataProtection: React.FC<DataProtectionProps> = ({
  requiredRole,
  resource,
  children,
  fallback,
  showError = true
}) => {
  const { hasPermission } = usePermissions();

  const hasAccess = hasPermission(requiredRole, resource);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Accès non autorisé
            </h3>
            <p className="text-red-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

// Composant pour masquer des données sensibles
interface SensitiveDataProps {
  data: any;
  allowedRoles: string[];
  maskChar?: string;
  children?: (data: any) => React.ReactNode;
}

export const SensitiveData: React.FC<SensitiveDataProps> = ({
  data,
  allowedRoles,
  maskChar = '*',
  children
}) => {
  const { hasPermission } = usePermissions();

  const canView = hasPermission(allowedRoles);

  if (!canView) {
    const maskedData = typeof data === 'string' 
      ? maskChar.repeat(data.length) 
      : maskChar.repeat(8);
    
    return children ? children(maskedData) : <span>{maskedData}</span>;
  }

  return children ? children(data) : <span>{data}</span>;
};

// Composant pour filtrer les listes selon les permissions
interface FilteredListProps<T> {
  items: T[];
  filterFn: (item: T, userRole: string, userId: number) => boolean;
  children: (filteredItems: T[]) => React.ReactNode;
}

export const FilteredList = <T,>({
  items,
  filterFn,
  children
}: FilteredListProps<T>) => {
  const { currentUser, userRole } = usePermissions();

  if (!currentUser || !userRole) {
    return children([]);
  }

  const filteredItems = items.filter(item => 
    filterFn(item, userRole, currentUser.id)
  );

  return children(filteredItems);
};

export default DataProtection;
