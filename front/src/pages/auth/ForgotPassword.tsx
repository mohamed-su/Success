import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
      setMessage('Un email avec les instructions de réinitialisation a été envoyé à votre adresse.');
    } catch (error) {
      setError('Échec de la demande de réinitialisation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-[#EAECEF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/Armoiries_du_Burkina.jpeg.jpg" alt="Armoiries du Burkina Faso" className="h-16 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#00213B]">
          Réinitialiser votre mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-[#1B384F]">
          Entrez votre adresse email pour recevoir les instructions
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>}
          {message && <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#00213B]">
                Adresse email
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2C224E] focus:border-[#2C224E] sm:text-sm" />
              </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00213B] hover:bg-[#2C224E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C224E] disabled:opacity-50">
                {loading ? 'Envoi en cours...' : 'Envoyer les instructions de réinitialisation'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-[#2C224E] hover:text-[#00213B]">
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default ForgotPassword;
