/**
 * Portable API server — works locally, on Vercel, AWS, Docker, or any Node.js host.
 *
 * Usage:
 *   npx tsx server.ts          → starts Express on port 3001
 *   npm run dev:full            → runs Vite + API server together
 *
 * The Vercel `api/` files remain as thin wrappers for Vercel deployment.
 * This server runs the SAME handlers for local dev and non-Vercel hosts.
 */

import express from 'express';
import { config } from 'dotenv';

// Load env vars from .env.local
config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for local dev (Vite runs on 5173, API on 3001)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Adapt Express req/res to match the shape Vercel handlers expect
function vercelCompat(handler: (req: any, res: any) => Promise<any>) {
  return async (req: express.Request, res: express.Response) => {
    // Add redirect method that Vercel handlers use
    const wrappedRes = Object.assign(res, {
      redirect: (status: number, url: string) => res.redirect(status, url),
    });
    try {
      await handler(req, wrappedRes);
    } catch (err: any) {
      console.error('Handler error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  };
}

// Dynamic import of handlers (they use ES module exports)
async function loadHandlers() {
  const { default: initiate } = await import('./api/payment/initiate.js');
  const { default: success } = await import('./api/payment/success.js');
  const { default: failure } = await import('./api/payment/failure.js');
  const { default: webhook } = await import('./api/payment/webhook.js');

  app.post('/api/payment/initiate', vercelCompat(initiate));
  app.post('/api/payment/success', vercelCompat(success));
  app.post('/api/payment/failure', vercelCompat(failure));
  app.post('/api/payment/webhook', vercelCompat(webhook));
}

const PORT = process.env.API_PORT || 3001;

loadHandlers().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
    console.log('PayU key:', process.env.PAYU_MERCHANT_KEY ? 'configured' : 'MISSING');
    console.log('Supabase URL:', process.env.VITE_SUPABASE_URL ? 'configured' : 'MISSING');
  });
}).catch(err => {
  console.error('Failed to load handlers:', err);
  process.exit(1);
});
