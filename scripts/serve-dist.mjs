// Minimal static server for dist/ with gzip, used by playwright.prod.config.ts
// to test the real production build (SSR HTML + hydration) in every engine.
// /api/* is stubbed so pages behave as they do behind the Worker.
import http from 'http';
import { readFile } from 'fs/promises';
import { gzipSync } from 'zlib';
import { extname, join, normalize } from 'path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4176);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.txt': 'text/plain', '.md': 'text/markdown', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml' };

http.createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  if (path === '/api/geo') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"country_code":"CA","country_name":"Canada","timezone":"America/Toronto"}'); }
  if (path.startsWith('/api/')) { res.writeHead(204); return res.end(); }
  for (const candidate of [path, join(path, 'index.html'), '/__404-snapshot/index.html']) {
    try {
      let body = await readFile(join(root, candidate));
      const type = types[extname(candidate)] || 'application/octet-stream';
      const headers = { 'Content-Type': type };
      if (/text|javascript|json|svg|xml/.test(type)) { body = gzipSync(body); headers['Content-Encoding'] = 'gzip'; }
      res.writeHead(candidate.startsWith('/__404') ? 404 : 200, headers);
      return res.end(body);
    } catch { /* try next */ }
  }
  res.writeHead(404); res.end();
}).listen(port, () => console.log(`dist served on http://localhost:${port}`));
