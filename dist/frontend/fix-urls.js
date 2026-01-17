// Configuration dynamique du BASE_URL - FORCE même IP
const currentHost = window.location.hostname;
const backendPort = '8081';

window.BASE_URL = `http://${currentHost}:${backendPort}`;

window.ENV = {
  BASE_URL: window.BASE_URL,
  API_BASE_URL: window.BASE_URL + '/api'
};

// Patch global: remplace toute URL contenant "${BASE_URL}" ou sa version encodée lors de tous les fetch
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string') {
      // Remplace localhost par l'IP actuelle
      url = url.replace(/http:\/\/localhost:8081/g, window.BASE_URL);
      url = url.replace(/\$\{BASE_URL\}/g, window.BASE_URL);
      url = url.replace(/%24%7BBASE_URL%7D/g, window.BASE_URL);
    }
    return originalFetch.call(this, url, options);
  };

  // Si axios est présent dans la page
  if (window.axios) {
    ['get', 'post', 'put', 'delete', 'patch'].forEach((method) => {
      const orig = window.axios[method];
      window.axios[method] = function(url, ...args) {
        if (typeof url === 'string') {
          url = url.replace(/\$\{BASE_URL\}/g, window.BASE_URL);
          url = url.replace(/%24%7BBASE_URL%7D/g, window.BASE_URL);
        }
        return orig.call(this, url, ...args);
      };
    });
  }
})();
