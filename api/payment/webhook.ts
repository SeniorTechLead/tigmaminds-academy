import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyHash, isValidPlan, calculatePeriodEnd, PLANS, getSupabaseAdmin } from '../_lib/payu.js';
import type { PlanId } from '../_lib/payu.js';
import { parse } from 'querystring';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body: Record<string, string>;
  if (typeof req.body === 'string') {
    body = parse(req.body) as Record<string, string>;
  } else {
    body = req.body as Record<string, string>;
  }

  const {
    mihpayid, status, txnid, amount, productinfo,
    firstname, email, hash,
    udf1, udf2, udf3, udf4, udf5,
  } = body;

  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT;

  if (!merchantKey || !merchantSalt) {
    console.error('PayU credentials not configured for webhook');
    return res.status(500).json({ error: 'Not configured' });
  }

  // ── Verify hash ──
  const isValid = verifyHash({
    key: merchantKey,
    salt: merchantSalt,
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1, udf2, udf3, udf4, udf5,
    receivedHash: hash,
  });

  if (!isValid) {
    console.error('Webhook hash verification failed for txnid:', txnid);
    return res.status(400).json({ error: 'Invalid hash' });
  }

  const admin = getSupabaseAdmin();
  const plan = udf1 || '';
  const currency = udf2 || 'INR';
  const userId = udf3 || '';

  // ── Check if already processed (idempotency) ──
  const { data: existing } = await admin
    .from('payments')
    .select('status')
    .eq('txnid', txnid)
    .single();

  if (existing?.status === 'success') {
    // Already processed — no-op
    return res.status(200).json({ message: 'Already processed' });
  }

  if (status === 'success') {
    // Update payment
    await admin
      .from('payments')
      .update({
        status: 'success',
        payu_mihpayid: mihpayid,
        payu_response: body,
      })
      .eq('txnid', txnid);

    // Create subscription if not already active
    if (userId && isValidPlan(plan)) {
      const { data: activeSub } = await admin
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('period_end', new Date().toISOString())
        .maybeSingle();

      if (!activeSub) {
        const planConfig = PLANS[plan as PlanId];
        const periodEnd = calculatePeriodEnd(planConfig.months);

        await admin.from('subscriptions').insert({
          user_id: userId,
          plan,
          status: 'active',
          currency,
          amount: parseFloat(amount),
          period_start: new Date().toISOString(),
          period_end: periodEnd,
        });
      }
    }
  } else {
    // Failed payment
    await admin
      .from('payments')
      .update({
        status: 'failed',
        payu_mihpayid: mihpayid || null,
        payu_response: body,
      })
      .eq('txnid', txnid);
  }

  return res.status(200).json({ message: 'OK' });
}
