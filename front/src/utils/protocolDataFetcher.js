import { API_CONFIG } from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

// Fonction pour récupérer les données d'un protocole par ID
export const fetchProtocolById = async (protocolId) => {
  try {
    const response = await fetch(`${BASE_URL}/protocol-data/${protocolId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.protocol;
    } else {
      throw new Error(data.error || 'Erreur lors de la récupération du protocole');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Exemple d'utilisation :
// const protocol = await fetchProtocolById(22);
// console.log(protocol);
