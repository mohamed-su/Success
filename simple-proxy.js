const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-ID, X-User-Role, X-User-Username');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`Proxy: ${req.method} ${req.url}`);
  
  // Construire l'URL de destination
  const targetUrl = `http://localhost:8081${req.url}`;
  const parsedUrl = url.parse(targetUrl);
  
  // Options pour la requête vers le backend
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: req.method,
    headers: req.headers
  };
  
  // Supprimer le header host pour éviter les conflits
  delete options.headers.host;
  
  // Faire la requête vers le backend
  const proxyReq = http.request(options, (proxyRes) => {
    // Copier les headers de réponse
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    // Pipe la réponse
    proxyRes.pipe(res);
  });
  
  // Gérer les erreurs
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500);
    res.end('Proxy error');
  });
  
  // Pipe la requête
  req.pipe(proxyReq);
});

server.listen(8082, () => {
  console.log('Proxy server running on port 8082');
  console.log('Add this to your hosts file:');
  console.log('127.0.0.1 e-agrement.minsante.bf');
});