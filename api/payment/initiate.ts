import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { PLANS, isValidPlan, generateTxnId, generateHash, getSupabaseAdmin } from '../_lib/payu';
import type { PlanId, Currency } from '../_lib/payu';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Authenticate user ──
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.slice(7);
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // ── Validate request ──
  const { plan, currency } = req.body as { plan: string; currency: string };

  if (!isValidPlan(plan)) {
    return res.status(400).json({ error: `Invalid plan: ${plan}` });
  }
  if (currency !== 'INR' && currency !== 'USD') {
    return res.status(400).json({ error: `Invalid currency: ${currency}` });
  }

  // ── Check PayU config ──
  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT;
  const payuBaseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';

  if (!merchantKey || !merchantSalt) {
    console.error('PayU credentials not configured');
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  // ── Build payment params ──
  const planConfig = PLANS[plan as PlanId];
  const amount = planConfig[currency as Currency].toFixed(2);
  const txnid = generateTxnId();
  const productinfo = planConfig.label;
  const firstname = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer';
  const email = user.email || '';
  const phone = user.phone || '';

  // Build origin for success/failure URLs
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${protocol}://${host}`;

  const surl = `${origin}/api/payment/success`;
  const furl = `${origin}/api/payment/failure`;

  // udf fields carry context through the redirect flow
  const udf1 = plan;       // plan ID
  const udf2 = currency;   // currency
  const udf3 = user.id;    // user ID
  const udf4 = '';
  const udf5 = '';

  const hash = generateHash({
    key: merchantKey,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1, udf2, udf3, udf4, udf5,
    salt: merchantSalt,
  });

  // ── Record pending payment ──
  const admin = getSupabaseAdmin();
  const { error: insertError } = await admin.from('payments').insert({
    user_id: user.id,
    txnid,
    amount: parseFloat(amount),
    currency,
    status: 'pending',
    plan,
  });

  if (insertError) {
    console.error('Failed to record payment:', insertError);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }

  // ── Return PayU form params ──
  res.status(200).json({
    payu_base_url: payuBaseUrl,
    key: merchantKey,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl,
    furl,
    hash,
    udf1, udf2, udf3, udf4, udf5,
  });
}
