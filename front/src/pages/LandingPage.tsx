import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, InfoIcon, PhoneIcon, LayoutListIcon, ChevronRightIcon, CheckCircleIcon, BarChart3Icon, UsersIcon, FileTextIcon, ArrowRightIcon } from 'lucide-react';
const LandingPage = () => {
  return <div className="min-h-screen bg-[#EAECEF] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Motto */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/Armoiries_du_Burkina.jpeg.jpg" alt="Armoiries du Burkina Faso" className="h-16 w-auto" />
                <div className="ml-3 border-l border-gray-300 pl-3">
                  <p className="font-['Montserrat'] font-bold text-[#00213B] text-lg">
                    CERS
                  </p>
                  <p className="font-['Montserrat'] text-[#1B384F] text-xs">
                    Unité - Progrès - Justice
                  </p>
                </div>
              </Link>
            </div>
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="font-['Montserrat'] font-medium text-[#00213B] hover:text-[#2C224E] flex items-center">
                <HomeIcon size={18} className="mr-1" />
                Accueil
              </Link>
              <Link to="#services" className="font-['Montserrat'] font-medium text-[#00213B] hover:text-[#2C224E] flex items-center">
                <LayoutListIcon size={18} className="mr-1" />
                Services
              </Link>
              <Link to="#informations" className="font-['Montserrat'] font-medium text-[#00213B] hover:text-[#2C224E] flex items-center">
                <InfoIcon size={18} className="mr-1" />
                Informations
              </Link>
              <Link to="#contacts" className="font-['Montserrat'] font-medium text-[#00213B] hover:text-[#2C224E] flex items-center">
                <PhoneIcon size={18} className="mr-1" />
                Contacts
              </Link>
            </nav>
            {/* Login Button */}
            <div>
              <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-['Montserrat'] font-medium rounded-md text-white bg-[#2C224E] hover:bg-[#00213B] transition-colors">
                Connexion espace professionnel
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#00213B] to-[#2C224E] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-16 md:py-20">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white font-['Montserrat'] sm:text-5xl lg:text-6xl">
                Comité d'Éthique pour la Recherche en Santé
              </h1>
              <p className="mt-6 text-xl text-[#EAECEF] max-w-3xl mx-auto font-['Roboto']">
                Plateforme de soumission et de suivi des protocoles de recherche
                pour une évaluation éthique rigoureuse et transparente au
                Burkina Faso.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link to="#services" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-['Montserrat'] font-medium rounded-md text-[#00213B] bg-white hover:bg-[#EAECEF]">
                    Découvrir nos services
                    <ChevronRightIcon className="ml-3 -mr-1 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern-squares" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="8" height="8" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern-squares)" />
          </svg>
        </div>
      </div>
      {/* Objectives Section */}
      <div id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-[#2C224E] tracking-wide uppercase font-['Montserrat']">
              Notre Mission
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-[#00213B] font-['Montserrat'] sm:text-4xl sm:tracking-tight">
              Promouvoir une recherche éthique et responsable
            </p>
            <p className="max-w-xl mt-5 mx-auto text-lg text-[#1B384F] font-['Roboto']">
              Le Comité d'Éthique pour la Recherche en Santé (CERS) veille à ce
              que les recherches menées respectent les principes éthiques
              fondamentaux.
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-[#EAECEF] rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#00213B] text-white">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Protection des participants
                  </h3>
                  <p className="mt-2 text-base text-[#1B384F] font-['Roboto']">
                    Nous assurons que les droits et le bien-être des
                    participants aux recherches sont protégés conformément aux
                    normes internationales.
                  </p>
                </div>
              </div>
              <div className="bg-[#EAECEF] rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#00213B] text-white">
                  <FileTextIcon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Évaluation rigoureuse
                  </h3>
                  <p className="mt-2 text-base text-[#1B384F] font-['Roboto']">
                    Chaque protocole est évalué par des experts pour garantir sa
                    conformité aux principes éthiques et aux bonnes pratiques
                    scientifiques.
                  </p>
                </div>
              </div>
              <div className="bg-[#EAECEF] rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#00213B] text-white">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Accompagnement des chercheurs
                  </h3>
                  <p className="mt-2 text-base text-[#1B384F] font-['Roboto']">
                    Nous guidons les chercheurs dans la conception de protocoles
                    respectueux des principes éthiques et conformes aux
                    réglementations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Key Indicators Section */}
      <div id="informations" className="py-16 bg-[#EAECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-[#2C224E] tracking-wide uppercase font-['Montserrat']">
              Informations
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-[#00213B] font-['Montserrat'] sm:text-4xl sm:tracking-tight">
              Chiffres clés de notre activité
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#2C224E] text-white mx-auto">
                  <FileTextIcon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-3xl font-bold text-[#00213B] font-['Montserrat']">
                    245
                  </h3>
                  <p className="mt-1 text-base text-[#1B384F] font-['Roboto']">
                    Protocoles évalués en 2023
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#2C224E] text-white mx-auto">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-3xl font-bold text-[#00213B] font-['Montserrat']">
                    92%
                  </h3>
                  <p className="mt-1 text-base text-[#1B384F] font-['Roboto']">
                    Taux d'approbation
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#2C224E] text-white mx-auto">
                  <BarChart3Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-3xl font-bold text-[#00213B] font-['Montserrat']">
                    15
                  </h3>
                  <p className="mt-1 text-base text-[#1B384F] font-['Roboto']">
                    Jours de délai moyen
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#2C224E] text-white mx-auto">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-3xl font-bold text-[#00213B] font-['Montserrat']">
                    120
                  </h3>
                  <p className="mt-1 text-base text-[#1B384F] font-['Roboto']">
                    Chercheurs inscrits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Process Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-[#2C224E] tracking-wide uppercase font-['Montserrat']">
              Processus
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-[#00213B] font-['Montserrat'] sm:text-4xl sm:tracking-tight">
              Comment fonctionne notre système
            </p>
          </div>
          <div className="mt-16">
            <div className="relative">
              {/* Line connecting steps */}
              <div className="hidden md:block absolute top-1/2 w-full border-t-2 border-[#EAECEF] transform -translate-y-1/2"></div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00213B] text-white z-10 font-['Montserrat']">
                    1
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Soumission
                  </h3>
                  <p className="mt-2 text-base text-center text-[#1B384F] font-['Roboto']">
                    Le chercheur soumet son protocole via la plateforme en ligne
                  </p>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00213B] text-white z-10 font-['Montserrat']">
                    2
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Validation initiale
                  </h3>
                  <p className="mt-2 text-base text-center text-[#1B384F] font-['Roboto']">
                    Le secrétariat vérifie que le dossier est complet
                  </p>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00213B] text-white z-10 font-['Montserrat']">
                    3
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Évaluation
                  </h3>
                  <p className="mt-2 text-base text-center text-[#1B384F] font-['Roboto']">
                    Le comité d'éthique évalue le protocole et formule des
                    recommandations
                  </p>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00213B] text-white z-10 font-['Montserrat']">
                    4
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#00213B] font-['Montserrat']">
                    Décision
                  </h3>
                  <p className="mt-2 text-base text-center text-[#1B384F] font-['Roboto']">
                    Le chercheur reçoit la décision finale et les
                    recommandations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action */}
      <div className="bg-[#2C224E]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-['Montserrat'] sm:text-4xl">
            <span className="block">Prêt à soumettre votre protocole?</span>
            <span className="block text-[#EAECEF]">
              Créez un compte ou connectez-vous pour commencer.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#00213B] bg-white hover:bg-[#EAECEF] font-['Montserrat']">
                Se connecter
                <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" />
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#00213B] hover:bg-[#1B384F] font-['Montserrat']">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer id="contacts" className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-[#00213B] tracking-wider uppercase font-['Montserrat']">
                À propos
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Le comité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Notre mission
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Membres
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#00213B] tracking-wider uppercase font-['Montserrat']">
                Ressources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Guide de soumission
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Formulaires
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Réglementations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#00213B] tracking-wider uppercase font-['Montserrat']">
                Légal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    Accessibilité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#00213B] tracking-wider uppercase font-['Montserrat']">
                Contact
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="mailto:cers@sante.gov.bf" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    cers@sante.gov.bf
                  </a>
                </li>
                <li>
                  <a href="tel:+22625000000" className="text-base text-[#1B384F] hover:text-[#2C224E] font-['Roboto']">
                    +226 25 00 00 00
                  </a>
                </li>
                <li>
                  <span className="text-base text-[#1B384F] font-['Roboto']">
                    Ouagadougou, Burkina Faso
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-[#1B384F] hover:text-[#2C224E]">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[#1B384F] hover:text-[#2C224E]">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-[#1B384F] md:mt-0 md:order-1 font-['Roboto']">
              &copy; {new Date().getFullYear()} Comité d'Éthique pour la
              Recherche en Santé (CERS). Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;
