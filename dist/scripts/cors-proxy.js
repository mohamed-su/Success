const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Proxy to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8081',
  changeOrigin: true,
  logLevel: 'debug'
}));

app.listen(8082, () => {
  console.log('CORS Proxy running on http://localhost:8082');
  console.log('Frontend should use http://localhost:8082/api instead of http://localhost:8081/api');
});