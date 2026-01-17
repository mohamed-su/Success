import { API_CONFIG } from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

// Service API temporaire pour tester
export const testSubmitProtocol = async (formData: FormData) => {
  try {
    console.log('Test de soumission avec endpoint simple...');
    
    const response = await fetch(`${BASE_URL}/researcher/test-submit`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Réponse du test:', data);
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erreur test API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};
