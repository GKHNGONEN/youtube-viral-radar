const http = require('http');
const fs = require('fs');
const path = require('path');
const discoverHandler = require('./api/discover.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (reqUrl.pathname.startsWith('/api/discover')) {
    return discoverHandler(req, res);
  }

  // Serve static files
  let filePath = path.join(PUBLIC_DIR, reqUrl.pathname === '/' ? 'index.html' : reqUrl.pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json'
  };

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 YouTube Viral Radar Bulut Sunucusu çalışıyor: port ${PORT}`);
});
