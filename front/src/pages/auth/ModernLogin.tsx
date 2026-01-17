import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AuthContextType } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ModernLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth() ?? {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) {
      setError('Le service de connexion n\'est pas disponible.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const result = await login(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Identifiants incorrects. Veuillez vérifier votre nom d\'utilisateur et mot de passe.');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAECEF] to-white flex items-center justify-center p-4 relative">
      {/* Bouton retour */}
      <Link to="/" className="absolute top-6 left-6 flex items-center text-[#00213B] hover:text-[#2C224E] transition-colors z-10">
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Retour à l'accueil</span>
      </Link>
      
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-black">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Illustration 3D côté gauche */}
          <div className="lg:w-1/2 bg-gradient-to-br from-[#00213B] via-[#1B384F] to-[#2C224E] p-8 flex items-center justify-center relative overflow-hidden">
            {/* Éléments décoratifs 3D */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-20 h-20 bg-[#EAECEF] rounded-full transform rotate-12"></div>
              <div className="absolute bottom-20 right-10 w-16 h-16 bg-[#EAECEF] rounded-lg transform -rotate-12"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#EAECEF] rounded-full"></div>
            </div>
            
            {/* Personnage et environnement de travail stylisé */}
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <img src="/Armoiries_du_Burkina.jpeg.jpg" alt="Armoiries du Burkina Faso" className="h-16 w-auto" />
                  <div className="w-16 h-16 bg-[#EAECEF] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-[#00213B]">CERS</span>
                  </div>
                </div>
              </div>
              
              {/* Éléments de bureau stylisés */}
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-16 h-12 bg-[#EAECEF] rounded-lg shadow-md transform rotate-3"></div>
                <div className="w-8 h-8 bg-[#2C224E] rounded-full shadow-md"></div>
                <div className="w-6 h-10 bg-[#EAECEF] rounded-md shadow-md transform -rotate-6"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Bienvenue au CERS
              </h2>
              <p className="text-[#EAECEF] text-base leading-relaxed">
                Plateforme de gestion des protocoles<br />
                de recherche éthique
              </p>
              
              {/* Image 4 intégrée */}
              <div className="mt-6 flex justify-center">
                <img src="/4.jpg" alt="Image 4" className="h-48 w-auto rounded-lg shadow-xl" />
              </div>
            </div>
          </div>

          {/* Formulaire côté droit */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              
              {/* Logo et titre */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-[#00213B] rounded-full flex items-center justify-center mr-3">
                    <div className="w-6 h-6 bg-[#EAECEF] rounded-full"></div>
                  </div>
                  <span className="text-2xl font-bold text-[#00213B]">CERS</span>
                </div>
                <h1 className="text-3xl font-bold text-[#00213B] mb-2">Connexion</h1>
                <p className="text-[#1B384F]">Accédez à votre espace professionnel</p>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B384F] w-5 h-5" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#EAECEF] rounded-xl focus:border-[#00213B] focus:outline-none transition-colors"
                      placeholder="Votre nom d'utilisateur"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B384F] w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border-2 border-[#EAECEF] rounded-xl focus:border-[#00213B] focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1B384F]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00213B] hover:bg-[#2C224E] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>



              {/* Liens */}
              <div className="mt-8 text-center space-y-2">
                <Link to="/forgot-password" className="text-[#00213B] hover:text-[#2C224E] text-sm">
                  Mot de passe oublié ?
                </Link>
                <div className="text-sm text-[#1B384F]">
                  Pas de compte ?{' '}
                  <Link to="/register" className="text-[#00213B] hover:text-[#2C224E] font-semibold">
                    Créer un compte
                  </Link>
                </div>
              </div>

              {/* Liens légaux */}
              <div className="mt-6 text-center text-xs text-[#1B384F] space-x-4">
                <Link to="#" className="hover:text-[#00213B]">Conditions d'utilisation</Link>
                <span>•</span>
                <Link to="#" className="hover:text-[#00213B]">Politique de confidentialité</Link>
              </div>
              

              
              {/* Contact CERS */}
              <div className="mt-4 text-center text-xs text-[#1B384F]">
                <p>Contact CERS : <span className="font-semibold">+226 25 48 59 37</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;
