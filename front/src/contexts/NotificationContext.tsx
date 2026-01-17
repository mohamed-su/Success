import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  protocolId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Protocole attribué',
      message: 'Votre protocole CERS-2024-002 a été attribué au Dr. Ibrahim Ouédraogo',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      protocolId: 'CERS-2024-002'
    },
    {
      id: '2',
      title: 'Commentaires reçus',
      message: 'Le rapporteur a ajouté des commentaires sur votre protocole CERS-2024-003',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      protocolId: 'CERS-2024-003'
    },
    {
      id: '3',
      title: 'Protocole approuvé',
      message: 'Félicitations! Votre protocole CERS-2024-001 a été approuvé par le CERS',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      protocolId: 'CERS-2024-001'
    }
  ]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  // Simulation de nouvelles notifications (désactivée pour éviter les boucles)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomNotifications = [
  //       {
  //         title: 'Rappel d\'échéance',
  //         message: 'N\'oubliez pas de répondre aux commentaires avant le 15/03',
  //         type: 'warning' as const
  //       },
  //       {
  //         title: 'Session CERS programmée',
  //         message: 'Prochaine session le premier mercredi du mois',
  //         type: 'info' as const
  //       }
  //     ];

  //     if (Math.random() > 0.8) { // 20% de chance
  //       const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
  //       addNotification(randomNotif);
  //     }
  //   }, 30000); // Toutes les 30 secondes

  //   return () => clearInterval(interval);
  // }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte de notification
function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export { useNotifications };
