import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        // Redirection directe vers l'interface du rôle
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Préparer les données pour l'API (sans confirmPassword)
      const { confirmPassword, ...apiData } = registerData;
      
      const result = await apiService.register(apiData);
      
      if (result.success) {
        setIsRegistering(false);
        setError('');
        // Optionnel: afficher un message de succès
      } else {
        setError(result.error || 'Échec de l\'inscription. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Écran de chargement plein écran
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#EAECEF] border-t-[#00213B] mx-auto mb-4"></div>
          <p className="text-[#00213B] text-lg font-medium">
            {isRegistering ? 'Inscription en cours...' : 'Connexion en cours...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAECEF] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl relative overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl h-[600px] relative">
          {/* Login Form */}
          <div className={`absolute inset-0 flex transition-transform duration-500 ease-in-out ${
            isRegistering ? '-translate-x-full' : 'translate-x-0'
          }`}>
            {/* Image Left */}
            <div className="w-1/2 bg-gradient-to-br from-[#00213B] to-[#2C224E] flex items-center justify-center p-8">
              <div className="text-center text-white">
                <img 
                  src="/image4.png" 
                  alt="CERS Logo" 
                  className="w-32 h-32 mx-auto mb-6 object-contain"
                />
                <h1 className="text-3xl font-bold mb-4">Système CERS</h1>
                <p className="text-lg opacity-90">Comité d'Éthique pour la Recherche en Santé</p>
                <p className="text-sm opacity-75 mt-2">Burkina Faso</p>
              </div>
            </div>
            
            {/* Form Right */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-[#00213B] mb-8 text-center">
                  Connexion
                </h2>
                
                {error && !isRegistering && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent"
                      placeholder="Votre nom d'utilisateur"
                      autoComplete="username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-2">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00213B] text-white py-3 rounded-lg hover:bg-[#2C224E] transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Pas encore de compte ?</p>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-[#2C224E] hover:text-[#00213B] font-medium"
                  >
                    Créer un compte
                  </button>
                </div>
                

              </div>
            </div>
          </div>
          
          {/* Register Form */}
          <div className={`absolute inset-0 flex transition-transform duration-500 ease-in-out ${
            isRegistering ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Form Left */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-[#00213B] mb-8 text-center">
                  Inscription
                </h2>
                
                {error && isRegistering && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#00213B] mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        required
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#00213B] mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        required
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-1">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      required
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                      placeholder="Choisissez un nom d'utilisateur"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-1">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={registerData.phoneNumber}
                      onChange={(e) => setRegisterData({...registerData, phoneNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#00213B] mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C224E] focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00213B] text-white py-3 rounded-lg hover:bg-[#2C224E] transition-colors disabled:opacity-50 mt-6 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Inscription...
                      </>
                    ) : (
                      'S\'inscrire'
                    )}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600 mb-2">Déjà un compte ?</p>
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-[#2C224E] hover:text-[#00213B] font-medium"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </div>
            
            {/* Image Right */}
            <div className="w-1/2 bg-gradient-to-br from-[#2C224E] to-[#00213B] flex items-center justify-center p-8">
              <div className="text-center text-white">
                <img 
                  src="/image4.png" 
                  alt="CERS Logo" 
                  className="w-32 h-32 mx-auto mb-6 object-contain"
                />
                <h1 className="text-3xl font-bold mb-4">Rejoignez CERS</h1>
                <p className="text-lg opacity-90">Comité d'Éthique pour la Recherche en Santé</p>
                <p className="text-sm opacity-75 mt-2">Burkina Faso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
