// CORRECTION DIRECTE - Remplace la fonction fetchDeliberations
const fetchDeliberations = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId') || '1';
    const userRole = localStorage.getItem('userRole') || 'president';
    
    // URL directe sans variables
    const url = 'http://localhost:8081/api/president/deliberations';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-ID': userId,
        'X-User-Role': userRole,
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      setDeliberations(data.deliberations || []);
    } else {
      setError(data.error || 'Erreur inconnue');
    }
  } catch (err) {
    setError('Erreur de connexion: ' + err.message);
  } finally {
    setLoading(false);
  }
};