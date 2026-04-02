import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyHash, isValidPlan, calculatePeriodEnd, PLANS, getSupabaseAdmin } from '../_lib/payu.js';
import type { PlanId } from '../_lib/payu.js';
import { parse } from 'querystring';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.redirect(302, '/programs?payment=error&reason=invalid_method');
  }

  // PayU sends application/x-www-form-urlencoded
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

  const merchantKey = process.env.PAYU_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT!;

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
    console.error('PayU hash verification failed for txnid:', txnid);
    return res.redirect(302, '/programs?payment=error&reason=verification_failed');
  }

  const admin = getSupabaseAdmin();
  const plan = udf1 || '';
  const currency = udf2 || 'INR';
  const userId = udf3 || '';

  if (status === 'success') {
    // ── Update payment record ──
    const { error: paymentError } = await admin
      .from('payments')
      .update({
        status: 'success',
        payu_mihpayid: mihpayid,
        payu_response: body,
      })
      .eq('txnid', txnid);

    if (paymentError) {
      console.error('Failed to update payment:', paymentError);
    }

    // ── Create/update subscription ──
    if (userId && isValidPlan(plan)) {
      const planConfig = PLANS[plan as PlanId];
      const periodEnd = calculatePeriodEnd(planConfig.months);

      // Expire any existing active subscription for this user
      await admin
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Create new active subscription
      const { data: sub, error: subError } = await admin
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          status: 'active',
          currency,
          amount: parseFloat(amount),
          period_start: new Date().toISOString(),
          period_end: periodEnd,
        })
        .select('id')
        .single();

      if (subError) {
        console.error('Failed to create subscription:', subError);
      } else if (sub) {
        // Link payment to subscription
        await admin
          .from('payments')
          .update({ subscription_id: sub.id })
          .eq('txnid', txnid);
      }
    }

    return res.redirect(302, '/programs?payment=success');
  }

  // ── Payment not successful ──
  await admin
    .from('payments')
    .update({
      status: 'failed',
      payu_mihpayid: mihpayid || null,
      payu_response: body,
    })
    .eq('txnid', txnid);

  return res.redirect(302, '/programs?payment=failed');
}
