import React, { useState } from 'react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';

const ModernRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: 'RESEARCHER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError('⚠️ Tous les champs sont requis');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const username = formData.email.split('@')[0] || formData.email;
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: username,
        role: formData.role
      };
      
      console.log('Sending user data:', userData);
      
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setSuccess('✅ Compte créé avec succès ! Un email contenant votre mot de passe a été envoyé à ' + formData.email + '. Redirection...');
        setTimeout(() => navigate('/login'), 5000);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('❌ Erreur: ' + (errorText || 'Nom d\'utilisateur ou email déjà utilisé'));
      }
    } catch (error) {
      setError('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAECEF] to-white flex items-center justify-center p-4 relative">
      {/* Bouton retour */}
      <Link to="/" className="absolute top-6 left-6 flex items-center text-[#00213B] hover:text-[#2C224E] transition-colors z-10">
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Retour à l'accueil</span>
      </Link>
      
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-black">
        <div className="flex flex-col lg:flex-row min-h-[580px]">
          
          {/* Illustration 3D côté gauche */}
          <div className="lg:w-1/2 bg-gradient-to-br from-[#2C224E] via-[#1B384F] to-[#00213B] p-8 flex items-center justify-center relative overflow-hidden">
            {/* Éléments décoratifs 3D */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-16 right-12 w-24 h-24 bg-[#EAECEF] rounded-lg transform rotate-45"></div>
              <div className="absolute bottom-16 left-12 w-20 h-20 bg-[#EAECEF] rounded-full transform -rotate-12"></div>
              <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-[#EAECEF] rounded-full"></div>
            </div>
            
            {/* Contenu principal */}
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <img src="/Armoiries_du_Burkina.jpeg.jpg" alt="Armoiries du Burkina Faso" className="h-16 w-auto" />
                  <div className="w-20 h-20 bg-[#EAECEF] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                    <span className="text-lg font-bold text-[#2C224E]">CERS</span>
                  </div>
                </div>
              </div>
              
              {/* Image 4 et éléments créatifs */}
              <div className="flex justify-center items-center space-x-6 mb-8">
                <img src="/4.jpg" alt="Image 4" className="h-40 w-auto rounded-lg shadow-xl" />
                <div className="w-10 h-10 bg-[#00213B] rounded-full shadow-lg"></div>
                <div className="w-8 h-12 bg-[#EAECEF] rounded-md shadow-lg transform -rotate-12"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Rejoignez le CERS
              </h2>
              <p className="text-[#EAECEF] text-base leading-relaxed mb-6">
                Créez votre compte pour accéder<br />
                à la plateforme de recherche éthique
              </p>
              
              {/* Indicateurs de fonctionnalités */}
              <div className="space-y-4">
                <div className="flex items-center justify-center text-[#EAECEF]">
                  <div className="w-2 h-2 bg-[#EAECEF] rounded-full mr-3"></div>
                  <span>Soumission de protocoles</span>
                </div>
                <div className="flex items-center justify-center text-[#EAECEF]">
                  <div className="w-2 h-2 bg-[#EAECEF] rounded-full mr-3"></div>
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center justify-center text-[#EAECEF]">
                  <div className="w-2 h-2 bg-[#EAECEF] rounded-full mr-3"></div>
                  <span>Collaboration sécurisée</span>
                </div>
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
                <h1 className="text-3xl font-bold text-[#00213B] mb-2">Créer un compte</h1>
                <p className="text-[#1B384F]">Rejoignez la communauté de recherche</p>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Message de succès */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B384F] w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#EAECEF] rounded-xl focus:border-[#00213B] focus:outline-none transition-colors"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B384F] w-5 h-5" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#EAECEF] rounded-xl focus:border-[#00213B] focus:outline-none transition-colors"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#00213B] mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B384F] w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#EAECEF] rounded-xl focus:border-[#00213B] focus:outline-none transition-colors"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">🔑 Mot de passe automatique</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Un mot de passe sécurisé sera généré automatiquement et envoyé par email à l'adresse fournie.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00213B] hover:bg-[#2C224E] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 shadow-lg relative"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Création du compte...
                    </div>
                  ) : (
                    'Créer un compte'
                  )}
                </button>
              </form>

              {/* Options de connexion sociale */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#EAECEF]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#1B384F]">Ou inscrivez-vous avec</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                  {/* Google */}
                  <button className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  {/* Microsoft */}
                  <button className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M1 1h10v10H1z"/>
                      <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                      <path fill="#7fba00" d="M1 13h10v10H1z"/>
                      <path fill="#ffb900" d="M13 13h10v10H13z"/>
                    </svg>
                  </button>
                  {/* GitHub */}
                  <button className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-5 h-5" fill="#181717" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Liens */}
              <div className="mt-6 text-center">
                <div className="text-sm text-[#1B384F]">
                  Déjà un compte ?{' '}
                  <Link to="/login" className="text-[#00213B] hover:text-[#2C224E] font-semibold">
                    Se connecter
                  </Link>
                </div>
              </div>

              {/* Liens légaux */}
              <div className="mt-4 text-center text-xs text-[#1B384F] space-x-4">
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

export default ModernRegister;
