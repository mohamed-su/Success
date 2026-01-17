import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Layout
import MainLayout from '../layouts/MainLayout';

// Landing Page
import LandingPage from '../../pages/LandingPage';

// Auth Pages
import Login from '../../pages/auth/Login';
import ModernLogin from '../../pages/auth/ModernLogin';
import Register from '../../pages/auth/Register';
import ModernRegister from '../../pages/auth/ModernRegister';
import ForgotPassword from '../../pages/auth/ForgotPassword';

// Researcher Pages
import ResearcherDashboard from '../../pages/researcher/Dashboard';
import SubmitProtocol from '../../pages/researcher/SubmitProtocol';
import MyProtocols from '../../pages/researcher/MyProtocols';
import ProtocolDetails from '../../pages/researcher/ProtocolDetails';
import EditProtocol from '../../pages/researcher/EditProtocol';
import ResearcherDecisions from '../../pages/researcher/Decisions';

// Secretary Pages
import SecretaryDashboard from '../../pages/secretary/Dashboard';
import ValidateProtocols from '../../pages/secretary/ValidateProtocols';
import PaymentTracker from '../../pages/secretary/PaymentTracker';
import GenerateReports from '../../pages/secretary/GenerateReports';
import EthicsCommittee from '../../pages/secretary/EthicsCommittee';

// Committee Pages
import CommitteeDashboard from '../../pages/committee/Dashboard';
import ReviewProtocol from '../../pages/committee/ReviewProtocol';
import AssignedProtocols from '../../pages/committee/AssignedProtocols';
import MyAssignedProtocols from '../../pages/committee/MyAssignedProtocols';

// Member Pages
import MemberAssignedProtocols from '../../pages/member/AssignedProtocols';
import ProtocolEvaluation from '../../pages/member/ProtocolEvaluation';

// Rapporteur Pages
import RapporteurDashboard from '../../pages/rapporteur/Dashboard';
import SynthesisReport from '../../pages/rapporteur/SynthesisReport';
import ProtocolDecisions from '../../pages/rapporteur/ProtocolDecisions';

// President Pages
import PresidentDashboard from '../../pages/president/Dashboard';
import DistributeProtocols from '../../pages/president/DistributeProtocols';
import FinalValidation from '../../pages/president/FinalValidation';
import ProtocolAssignment from '../../pages/president/ProtocolAssignment';
import AutoProtocolAssignment from '../../pages/president/AutoProtocolAssignment';
import PresidentAssignedProtocols from '../../pages/president/MyAssignedProtocols';
import FinalReports from '../../pages/president/FinalReports';

// Admin Pages
import AdminDashboard from '../../pages/admin/Dashboard';
import UserManagement from '../../pages/admin/UserManagement';
import PaymentManagement from '../../pages/admin/PaymentManagement';
import SystemSettings from '../../pages/admin/SystemSettings';
import ActivityLogs from '../../pages/admin/ActivityLogs';

// Role Redirect
import RoleRedirect from '../common/RoleRedirect';

// Test Page
import TestRoleFiltering from '../../pages/TestRoleFiltering';
import TestAssignments from '../../pages/TestAssignments';
import SimpleAssignedProtocols from '../../pages/SimpleAssignedProtocols';
import UnifiedAssignedProtocols from '../../pages/UnifiedAssignedProtocols';
import AssignmentDebug from '../../pages/AssignmentDebug';
import RapporteurDiagnostic from '../../pages/RapporteurDiagnostic';
// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }: { element: React.ReactElement; allowedRoles?: string[] }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C224E] mx-auto"></div>
          <p className="mt-4 text-[#1B384F]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { userRole } = useAuth();

  const getDashboardRoute = () => {
    switch (userRole) {
      case 'researcher':
        return <ResearcherDashboard />;
      case 'secretary':
        return <SecretaryDashboard />;
      case 'committee':
      case 'committee_member':
        return <CommitteeDashboard />;
      case 'rapporteur':
        return <RapporteurDashboard />;
      case 'president':
        return <PresidentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Navigate to="/" />;
    }
  };

  return getDashboardRoute();
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={<ModernLogin />} />
      <Route path="/register" element={<ModernRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/test-roles" element={<TestRoleFiltering />} />
      <Route path="/test-assignments" element={<TestAssignments />} />
      <Route path="/simple-assigned" element={<SimpleAssignedProtocols />} />
      <Route path="/debug-assignments" element={<AssignmentDebug />} />
      <Route path="/rapporteur-diagnostic" element={<RapporteurDiagnostic />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute 
            element={<MainLayout />} 
            allowedRoles={['researcher', 'secretary', 'committee', 'committee_member', 'rapporteur', 'president', 'admin']} 
          />
        }
      >
        <Route index element={<RoleRedirect />} />
        
        {/* Routes Researcher */}
        <Route path="researcher" element={<ProtectedRoute element={<ResearcherDashboard />} allowedRoles={['researcher']} />} />
        <Route path="researcher/submit" element={<ProtectedRoute element={<SubmitProtocol />} allowedRoles={['researcher']} />} />
        <Route path="submit-protocol" element={<ProtectedRoute element={<SubmitProtocol />} allowedRoles={['researcher']} />} />
        <Route path="researcher/protocols" element={<ProtectedRoute element={<MyProtocols />} allowedRoles={['researcher']} />} />
        <Route path="researcher/protocol/:id" element={<ProtectedRoute element={<ProtocolDetails />} allowedRoles={['researcher']} />} />
        <Route path="researcher/protocol/:id/edit" element={<ProtectedRoute element={<EditProtocol />} allowedRoles={['researcher']} />} />
        <Route path="researcher/decisions" element={<ProtectedRoute element={<ResearcherDecisions />} allowedRoles={['researcher']} />} />
        
        {/* Routes Secretary */}
        <Route path="secretary" element={<ProtectedRoute element={<SecretaryDashboard />} allowedRoles={['secretary']} />} />
        <Route path="secretary/validate" element={<ProtectedRoute element={<ValidateProtocols />} allowedRoles={['secretary']} />} />
        <Route path="secretary/payments" element={<ProtectedRoute element={<PaymentTracker />} allowedRoles={['secretary']} />} />
        <Route path="secretary/reports" element={<ProtectedRoute element={<GenerateReports />} allowedRoles={['secretary']} />} />
        <Route path="secretary/ethics-committee" element={<ProtectedRoute element={<EthicsCommittee />} allowedRoles={['secretary']} />} />
        
        {/* Routes Committee */}
        <Route path="committee" element={<ProtectedRoute element={<CommitteeDashboard />} allowedRoles={['committee', 'committee_member']} />} />
        <Route path="committee/review/:id" element={<ProtectedRoute element={<ReviewProtocol />} allowedRoles={['committee', 'committee_member']} />} />
        <Route path="committee/assigned" element={<ProtectedRoute element={<AssignedProtocols />} allowedRoles={['committee', 'committee_member', 'president', 'rapporteur']} />} />
        <Route path="committee/my-protocols" element={<ProtectedRoute element={<MyAssignedProtocols />} allowedRoles={['committee', 'committee_member', 'rapporteur']} />} />
        
        {/* Routes Member - Protocoles Assignés */}
        <Route path="member/assigned" element={<ProtectedRoute element={<UnifiedAssignedProtocols />} allowedRoles={['committee', 'committee_member', 'rapporteur', 'president']} />} />
        <Route path="member/evaluate/:protocolId" element={<ProtectedRoute element={<ProtocolEvaluation />} allowedRoles={['committee', 'committee_member', 'rapporteur', 'president']} />} />
        
        {/* Routes Rapporteur */}
        <Route path="rapporteur" element={<ProtectedRoute element={<RapporteurDashboard />} allowedRoles={['rapporteur']} />} />
        <Route path="rapporteur/decisions" element={<ProtectedRoute element={<ProtocolDecisions />} allowedRoles={['rapporteur']} />} />
        <Route path="rapporteur/synthesis/:id" element={<ProtectedRoute element={<SynthesisReport />} allowedRoles={['rapporteur']} />} />
        
        {/* Routes President */}
        <Route path="president" element={<ProtectedRoute element={<PresidentDashboard />} allowedRoles={['president']} />} />
        <Route path="president/distribute" element={<ProtectedRoute element={<DistributeProtocols />} allowedRoles={['president']} />} />
        <Route path="president/validation" element={<ProtectedRoute element={<FinalValidation />} allowedRoles={['president']} />} />
        <Route path="president/assignments" element={<ProtectedRoute element={<ProtocolAssignment />} allowedRoles={['president']} />} />
        <Route path="president/auto-assignments" element={<ProtectedRoute element={<AutoProtocolAssignment />} allowedRoles={['president']} />} />
        <Route path="president/my-assigned" element={<ProtectedRoute element={<PresidentAssignedProtocols />} allowedRoles={['president']} />} />
        <Route path="president/assigned" element={<ProtectedRoute element={<AssignedProtocols />} allowedRoles={['president']} />} />
        <Route path="president/final-reports" element={<ProtectedRoute element={<FinalReports />} allowedRoles={['president']} />} />
        
        {/* Routes Admin */}
        <Route path="admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
        <Route path="admin/users" element={<ProtectedRoute element={<UserManagement />} allowedRoles={['admin']} />} />
        <Route path="admin/payments" element={<ProtectedRoute element={<PaymentManagement />} allowedRoles={['admin']} />} />
        <Route path="admin/settings" element={<ProtectedRoute element={<SystemSettings />} allowedRoles={['admin']} />} />
        <Route path="admin/logs" element={<ProtectedRoute element={<ActivityLogs />} allowedRoles={['admin']} />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
