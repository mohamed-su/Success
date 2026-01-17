import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>);
