import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { answer } from './src/bi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const INDEX = path.join(__dirname, 'index.html');

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function readJson(req, maxBytes = 1_000_000) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
      if (Buffer.byteLength(data, 'utf8') > maxBytes) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON request.'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/') {
      const html = fs.readFileSync(INDEX, 'utf8');
      return send(res, 200, html, 'text/html; charset=utf-8');
    }

    if (req.method === 'POST' && url.pathname === '/api/query') {
      const body = await readJson(req);
      const question = String(body?.question ?? '').trim();
      if (!question) return send(res, 400, JSON.stringify({ error: 'Question is required.' }), 'application/json');

      const result = await answer(question, process.env);
      return send(res, 200, JSON.stringify({ answer: result }), 'application/json');
    }

    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, JSON.stringify({ ok: true }), 'application/json');
    }

    return send(res, 404, 'Not found');
  } catch (error) {
    return send(
      res,
      500,
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected server error.' }),
      'application/json'
    );
  }
});

server.listen(PORT, () => {
  console.log(`Skylark Intelligence running on http://localhost:${PORT}`);
});
