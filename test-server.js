const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8081;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.url === '/') {
    // Serve the test HTML file
    fs.readFile(path.join(__dirname, 'test-chat.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`🌐 Test server running at http://localhost:${port}`);
  console.log(`📱 Open http://localhost:${port} to test WebSocket`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test server');
  server.close();
  process.exit(0);
});
