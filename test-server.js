const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const HTTPS_PORT = 8443;

// HTTPS options
let httpsOptions;
try {
  httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
  };
} catch (err) {
  console.log('⚠️  SSL certificates not found, HTTPS server will not be available');
}

const server = http.createServer((req, res) => {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the test chat HTML file
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'test-chat.html');
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading test file');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  // Handle other routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🌐 HTTP test server running at http://localhost:${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to test WebSocket`);
});

// Start HTTPS server if certificates are available
if (httpsOptions) {
  const httpsServer = https.createServer(httpsOptions, (req, res) => {
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Serve the test chat HTML file
    if (req.url === '/' || req.url === '/index.html') {
      const filePath = path.join(__dirname, 'test-chat.html');
      
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error loading test file');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      });
      return;
    }

    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });

  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🔒 HTTPS test server running at https://localhost:${HTTPS_PORT}`);
    console.log(`📱 Open https://localhost:${HTTPS_PORT} to test WebSocket (recommended)`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test server');
  server.close(() => {
    process.exit(0);
  });
});
