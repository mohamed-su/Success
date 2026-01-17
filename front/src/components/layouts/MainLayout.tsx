import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { HomeIcon, FileTextIcon, UsersIcon, SettingsIcon, LogOutIcon, BellIcon, MenuIcon, XIcon } from 'lucide-react';

const MainLayout = () => {
  const {
    currentUser,
    userRole,
    logout
  } = useAuth();
  const {
    notifications,
    getUnreadCount
  } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  const getNavLinks = () => {
    switch (userRole) {
      case 'researcher':
        return [{
          to: '/dashboard/researcher',
          label: 'Tableau de bord',
          icon: <HomeIcon size={20} />
        }, {
          to: '/dashboard/researcher/submit',
          label: 'Soumettre un protocole',
          icon: <FileTextIcon size={20} />
        }, {
          to: '/dashboard/researcher/protocols',
          label: 'Mes protocoles',
          icon: <FileTextIcon size={20} />
        }, {
          to: '/dashboard/researcher/decisions',
          label: 'Décisions',
          icon: <FileTextIcon size={20} />
        }];
      case 'secretary':
        return [{
          to: '/dashboard/secretary',
          label: 'Tableau de bord',
          icon: <HomeIcon size={20} />
        }, {
          to: '/dashboard/secretary/validate',
          label: 'Valider les protocoles',
          icon: <FileTextIcon size={20} />
        }, {
          to: '/dashboard/secretary/reports',
          label: 'Générer des rapports',
          icon: <FileTextIcon size={20} />
        }];
      case 'committee':
      case 'committee_member':
        return [{
          to: '/dashboard/committee',
          label: 'Tableau de bord',
          icon: <HomeIcon size={20} />
        }, {
          to: '/dashboard/member/assigned',
          label: 'Protocoles assignés',
          icon: <FileTextIcon size={20} />
        }];
      case 'rapporteur':
        return [{
          to: '/dashboard/rapporteur',
          label: 'Tableau de bord',
          icon: <HomeIcon size={20} />
        }, {
          to: '/dashboard/member/assigned',
          label: 'Protocoles assignés',
          icon: <FileTextIcon size={20} />
        }];
      case 'president':
        return [{
          to: '/dashboard/president',
          label: 'Tableau de bord',
          icon: <HomeIcon size={20} />
        }, {
          to: '/dashboard/president/auto-assignments',
          label: 'Attribution automatique',
          icon: <FileTextIcon size={20} />
        }, {
          to: '/dashboard/member/assigned',
          label: 'Mes protocoles assignés',
          icon: <FileTextIcon size={20} />
        }, {
          to: '/dashboard/president/final-reports',
          label: 'Rapport Final',
          icon: <FileTextIcon size={20} />
        }];
      case 'admin':
        return [{
          to: '/dashboard/admin',
          label: 'Tableau de bord',
          icon: <HomeIcon size={20} />
        }, {
          to: '/dashboard/admin/users',
          label: 'Gestion des utilisateurs',
          icon: <UsersIcon size={20} />
        }, {
          to: '/dashboard/admin/settings',
          label: 'Paramètres système',
          icon: <SettingsIcon size={20} />
        }, {
          to: '/dashboard/admin/logs',
          label: "Journaux d'activité",
          icon: <FileTextIcon size={20} />
        }];
      default:
        return [];
    }
  };
  const getRoleName = () => {
    switch (userRole) {
      case 'researcher':
        return 'Chercheur';
      case 'secretary':
        return 'Secrétaire';
      case 'committee':
      case 'committee_member':
        return 'Membre du comité';
      case 'rapporteur':
        return 'Rapporteur';
      case 'president':
        return 'Président';
      case 'admin':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };
  const navLinks = getNavLinks();
  const unreadCount = getUnreadCount();
  return <div className="flex h-screen bg-[#EAECEF]">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white bg-[#00213B] p-2 rounded-md">
          {sidebarOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out bg-[#00213B] text-white flex flex-col`}>
        <div className="p-5 border-b border-[#1B384F]">
          <div className="flex flex-col items-center">
            <img src="/Armoiries_du_Burkina.jpeg.jpg" alt="Armoiries du Burkina Faso" className="h-24 w-auto mb-3" />
            <h1 className="text-2xl font-bold text-center">CERS</h1>
            <p className="text-[#EAECEF] text-sm text-center">
              Gestion des Protocoles
            </p>
          </div>
        </div>
        <div className="p-5 border-b border-[#1B384F]">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#2C224E] flex items-center justify-center text-white font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-sm text-[#EAECEF]">{getRoleName()}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-5 overflow-y-auto">
          <ul className="space-y-2">
            {navLinks.map((link, index) => <li key={index}>
                <Link to={link.to} className={`flex items-center p-2 rounded-lg ${location.pathname === link.to ? 'bg-[#2C224E] text-white' : 'text-[#EAECEF] hover:bg-[#1B384F]'}`}>
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              </li>)}
          </ul>
        </nav>
        <div className="p-5 border-t border-[#1B384F]">
          <button onClick={handleLogout} className="flex items-center p-2 w-full text-[#EAECEF] hover:bg-[#1B384F] rounded-lg">
            <LogOutIcon size={20} />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm z-30 sticky top-0">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-[#00213B]">
              {navLinks.find(link => link.to === location.pathname)?.label || 'Tableau de bord'}
            </h1>
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-full hover:bg-gray-100 relative">
                <BellIcon size={24} className="text-[#00213B]" />
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>}
              </button>
              {/* Notifications dropdown */}
              {notificationsOpen && <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="py-2 px-4 bg-[#00213B] text-white font-medium flex justify-between items-center">
                    <span>Notifications</span>
                    <button className="text-sm hover:underline">
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notification => <div key={notification.id} className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${notification.read ? '' : 'bg-green-50'}`}>
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>) : <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>}
                  </div>
                  <div className="py-2 px-4 bg-gray-50 text-center">
                    <Link to="/notifications" className="text-sm text-[#00213B] hover:underline">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>}
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">
          <div className="max-w-7xl mx-auto">
            {/* <RoleSwitcher /> */}
            {/* <PageNavigator /> */}
            <Outlet />
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-white p-4 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} CERS - Système de Gestion des
          Protocoles de Recherche
        </footer>
      </div>
    </div>;
};
export default MainLayout;
