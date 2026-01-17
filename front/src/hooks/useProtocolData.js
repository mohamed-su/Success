import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

export const useProtocolData = (protocolId) => {
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProtocol = async () => {
      if (!protocolId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/protocol-data/${protocolId}`);
        const data = await response.json();
        
        if (data.success) {
          setProtocol(data.protocol);
          setError(null);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocol();
  }, [protocolId]);

  return { protocol, loading, error };
};

// Exemple d'utilisation dans un composant :
// const { protocol, loading, error } = useProtocolData(22);
