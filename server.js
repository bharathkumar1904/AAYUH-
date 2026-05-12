import { createServer } from 'http';
import { request as httpsRequest } from 'https';
import { config } from 'dotenv';
import { Buffer } from 'buffer';

config(); // loads .env file

const PORT    = process.env.PORT || 3001;
const API_KEY = process.env.GROQ_API_KEY || '';

if (!API_KEY) {
  console.error('❌  GROQ_API_KEY env variable is not set.');
  process.exit(1);
}

const ALLOWED_ORIGINS = [
  'http://localhost',
  'http://127.0.0.1',
  'null',           // file:// pages
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some(o => origin.startsWith(o));
}

const server = createServer((req, res) => {
  const origin = req.headers['origin'] || '';

  const corsOrigin = isAllowedOrigin(origin) ? (origin || '*') : '';
  res.setHeader('Access-Control-Allow-Origin',  corsOrigin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

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

    console.log(`→ Groq request: model=${payload.model}, messages=${payload.messages?.length}`);

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
        console.log(`← Groq response: status=${proxyRes.statusCode}`);
        if (proxyRes.statusCode !== 200) {
          console.error('Groq error body:', data);
        }
        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    });

    proxyReq.on('error', err => {
      console.error('Proxy network error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.write(groqBody);
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`✅  Groq proxy running on http://localhost:${PORT}`);
  console.log(`    POST http://localhost:${PORT}/chat`);
  console.log(`    API key loaded: ${API_KEY.slice(0, 8)}...`);
});