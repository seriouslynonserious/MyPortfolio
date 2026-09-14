import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root = resolve('dist/portfolio/browser');
const port = Number(process.env.PREVIEW_PORT || 4300);
const types = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.xml':'application/xml', '.txt':'text/plain', '.png':'image/png', '.jpg':'image/jpeg', '.woff2':'font/woff2'};
const unavailable = res => {
  if (res.headersSent) { res.destroy(); return; }
  res.writeHead(503, {'Content-Type':'text/plain', 'Retry-After':'2'});
  res.end('The portfolio is rebuilding. Refresh in a moment.');
};

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    const upstream = http.request({hostname:'127.0.0.1', port:8080, path:req.url, method:req.method, headers:req.headers}, response => {
      res.writeHead(response.statusCode, response.headers);
      response.on('error', () => res.destroy());
      response.pipe(res);
    });
    upstream.on('error', () => {
      if (res.headersSent) { res.destroy(); return; }
      res.writeHead(503, {'Content-Type':'application/json'});
      res.end('{"error":"Backend unavailable"}');
    });
    req.pipe(upstream);
    res.on('close', () => upstream.destroy());
    return;
  }
  let path;
  try { path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400); res.end(); return; }
  if (path !== root && !path.startsWith(root + '/')) { res.writeHead(403); res.end(); return; }
  try {
    const info = await stat(path).catch(() => null);
    if (!info || info.isDirectory()) {
      if (extname(path) && extname(path) !== '.html') { res.writeHead(404); res.end(); return; }
      path = resolve(root, 'index.html');
    }
    const stream = createReadStream(path);
    stream.on('error', () => unavailable(res));
    stream.once('open', () => {
      res.writeHead(200, {'Content-Type':types[extname(path)] || 'application/octet-stream'});
      if (req.method === 'HEAD') { stream.destroy(); res.end(); } else stream.pipe(res);
    });
  } catch { unavailable(res); }
}).listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${server.address().port}`));
