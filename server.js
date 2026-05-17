import { createServer } from 'http';
import { request as httpsRequest } from 'https';
import { config } from 'dotenv';
import { Buffer } from 'buffer';

config();

const PORT    = process.env.PORT || 3001;
const API_KEY = process.env.GROQ_API_KEY || '';

if (!API_KEY) {
  console.error('GROQ_API_KEY env variable is not set.');
  process.exit(1);
}

// ── Allow ALL origins ──
// GitHub Pages, APK, localhost, file:// — all work
function setCORS(res, origin) {
  res.setHeader('Access-Control-Allow-Origin',  origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

const server = createServer((req, res) => {
  const origin = req.headers['origin'] || '*';

  // Preflight
  if (req.method === 'OPTIONS') {
    setCORS(res, origin);
    res.writeHead(204);
    res.end();
    return;
  }

  setCORS(res, origin);

  // Health check — also keeps Railway awake
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Aayuh proxy running',
      time: new Date().toISOString()
    }));
    return;
  }

  // Only accept POST /chat
  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    const groqBody = JSON.stringify({
      model:       payload.model       || 'llama-3.3-70b-versatile',
      messages:    payload.messages    || [],
      temperature: payload.temperature ?? 0.4,
      max_tokens:  payload.max_tokens  ?? 1200,
    });

    console.log(`→ model=${payload.model} msgs=${payload.messages?.length}`);

    const options = {
      hostname: 'api.groq.com',
      path:     '/openai/v1/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(groqBody),
      },
    };

    const proxyReq = httpsRequest(options, proxyRes => {
      let data = '';
      proxyRes.on('data', c => { data += c; });
      proxyRes.on('end', () => {
        console.log(`← status=${proxyRes.statusCode}`);
        if (proxyRes.statusCode !== 200) {
          console.error('Groq error:', data);
        }
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
        });
        res.end(data);
      });
    });

    proxyReq.on('error', err => {
      console.error('Proxy error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.write(groqBody);
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
  console.log(`Key: ${API_KEY.slice(0, 8)}...`);
});

// ── Keep Railway awake every 14 minutes ──
const DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN;
if (DOMAIN) {
  setInterval(() => {
    httpsRequest(
      { hostname: DOMAIN, path: '/', method: 'GET' },
      r => console.log(`Keep-alive: ${r.statusCode}`)
    ).on('error', () => {}).end();
  }, 14 * 60 * 1000);
  console.log(`Keep-alive enabled for ${DOMAIN}`);
}