const http = require('http');
const httpProxy = require('http-proxy');

// Créer le proxy
const proxy = httpProxy.createProxyServer({});

// Créer le serveur
const server = http.createServer((req, res) => {
  // Ajouter les headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-ID, X-User-Role, X-User-Username');
  
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`Proxy: ${req.method} ${req.url} -> http://localhost:8081${req.url}`);
  
  // Rediriger vers le backend local
  proxy.web(req, res, {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false
  });
});

// Gérer les erreurs du proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy error');
});

// Démarrer le serveur sur le port 443 (HTTPS) ou 80 (HTTP)
const PORT = 8082;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Redirecting https://e-agrement.minsante.bf/api -> http://localhost:8081/api`);
});