// Configuration dynamique basée sur l'URL actuelle
const currentHost = window.location.hostname;
const backendPort = '8081';

// FORCE l'utilisation de la même IP pour le backend
window.BASE_URL = `http://${currentHost}:${backendPort}`;
window.ENV = {
  BASE_URL: window.BASE_URL,
  API_BASE_URL: window.BASE_URL + '/api'
};

console.log('Configuration forcée:', {
  frontend: window.location.origin,
  backend: window.BASE_URL
});