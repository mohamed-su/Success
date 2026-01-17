import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Layout
import MainLayout from '../components/layouts/MainLayout';
// Landing Page
import LandingPage from '../pages/LandingPage';
// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
// Researcher Pages
import ResearcherDashboard from '../pages/researcher/Dashboard';
import SubmitProtocol from '../pages/researcher/SubmitProtocol';
import MyProtocols from '../pages/researcher/MyProtocols';
import ProtocolDetails from '../pages/researcher/ProtocolDetails';
// Secretary Pages
import SecretaryDashboard from '../pages/secretary/Dashboard';
import ValidateProtocols from '../pages/secretary/ValidateProtocols';
import GenerateReports from '../pages/secretary/GenerateReports';
// Committee Pages
import CommitteeDashboard from '../pages/committee/Dashboard';
import ReviewProtocol from '../pages/committee/ReviewProtocol';
import AssignedProtocols from '../pages/committee/AssignedProtocols';
// Rapporteur Pages
import RapporteurDashboard from '../pages/rapporteur/Dashboard';
import SynthesisReport from '../pages/rapporteur/SynthesisReport';
// President Pages
import PresidentDashboard from '../pages/president/Dashboard';
import DistributeProtocols from '../pages/president/DistributeProtocols';
import FinalValidation from '../pages/president/FinalValidation';
// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import SystemSettings from '../pages/admin/SystemSettings';
import ActivityLogs from '../pages/admin/ActivityLogs';
// Financial Pages
import FinancialDashboard from '../pages/financial/Dashboard';
// Protected Route Component
export const ProtectedRoute = ({
  element,
  allowedRoles
}) => {
  const {
    currentUser,
    userRole,
    loading
  } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
        Chargement...
      </div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  return element;
};
// Route definitions
export const routes = [
// Public Routes
{
  path: '/landing',
  element: <LandingPage />,
  public: true
}, {
  path: '/login',
  element: <Login />,
  public: true
}, {
  path: '/register',
  element: <Register />,
  public: true
}, {
  path: '/forgot-password',
  element: <ForgotPassword />,
  public: true
},
// Protected Routes with Layout
{
  path: '/',
  element: <MainLayout />,
  protected: true,
  allowedRoles: ['researcher', 'secretary', 'committee', 'rapporteur', 'president', 'admin', 'financial'],
  children: [
  // Researcher Routes
  {
    path: '/',
    element: <ResearcherDashboard />,
    allowedRoles: ['researcher']
  }, {
    path: '/submit-protocol',
    element: <SubmitProtocol />,
    allowedRoles: ['researcher']
  }, {
    path: '/my-protocols',
    element: <MyProtocols />,
    allowedRoles: ['researcher']
  }, {
    path: '/protocol/:id',
    element: <ProtocolDetails />,
    allowedRoles: ['researcher']
  },
  // Secretary Routes
  {
    path: '/secretary',
    element: <SecretaryDashboard />,
    allowedRoles: ['secretary']
  }, {
    path: '/secretary/validate',
    element: <ValidateProtocols />,
    allowedRoles: ['secretary']
  }, {
    path: '/secretary/reports',
    element: <GenerateReports />,
    allowedRoles: ['secretary']
  },
  // Committee Routes
  {
    path: '/committee',
    element: <CommitteeDashboard />,
    allowedRoles: ['committee']
  }, {
    path: '/committee/review/:id',
    element: <ReviewProtocol />,
    allowedRoles: ['committee']
  }, {
    path: '/committee/assigned',
    element: <AssignedProtocols />,
    allowedRoles: ['committee']
  },
  // Rapporteur Routes
  {
    path: '/rapporteur',
    element: <RapporteurDashboard />,
    allowedRoles: ['rapporteur']
  }, {
    path: '/rapporteur/synthesis/:id',
    element: <SynthesisReport />,
    allowedRoles: ['rapporteur']
  },
  // President Routes
  {
    path: '/president',
    element: <PresidentDashboard />,
    allowedRoles: ['president']
  }, {
    path: '/president/distribute',
    element: <DistributeProtocols />,
    allowedRoles: ['president']
  }, {
    path: '/president/validation',
    element: <FinalValidation />,
    allowedRoles: ['president']
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminDashboard />,
    allowedRoles: ['admin']
  }, {
    path: '/admin/users',
    element: <UserManagement />,
    allowedRoles: ['admin']
  }, {
    path: '/admin/settings',
    element: <SystemSettings />,
    allowedRoles: ['admin']
  }, {
    path: '/admin/logs',
    element: <ActivityLogs />,
    allowedRoles: ['admin']
  },
  // Financial Routes
  {
    path: '/financial',
    element: <FinancialDashboard />,
    allowedRoles: ['financial']
  }]
},
// Fallback route - redirect to landing page
{
  path: '*',
  element: <Navigate to="/landing" />,
  public: true
}];
