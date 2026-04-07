import { NextRequest, NextResponse } from 'next/server';
import { verifyHash, isValidPlan, calculatePeriodEnd, PLANS, getSupabaseAdmin } from '../../../../src/lib/payu';
import type { PlanId } from '../../../../src/lib/payu';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const body: Record<string, string> = {};
  formData.forEach((value, key) => { body[key] = value.toString(); });

  const { mihpayid, status, txnid, amount, productinfo, firstname, email, hash, udf1, udf2, udf3, udf4, udf5 } = body;

  const merchantKey = process.env.PAYU_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT!;

  const isValid = verifyHash({
    key: merchantKey, salt: merchantSalt, status, txnid, amount, productinfo, firstname, email,
    udf1, udf2, udf3, udf4, udf5, receivedHash: hash,
  });

  if (!isValid) {
    return NextResponse.redirect(new URL('/programs?payment=error&reason=verification_failed', req.url));
  }

  const admin = getSupabaseAdmin();
  const plan = udf1 || '';
  const currency = udf2 || 'INR';
  const userId = udf3 || '';

  if (status === 'success') {
    await admin.from('payments').update({ status: 'success', payu_mihpayid: mihpayid, payu_response: body }).eq('txnid', txnid);

    if (userId && isValidPlan(plan)) {
      const planConfig = PLANS[plan as PlanId];
      const periodEnd = calculatePeriodEnd(planConfig.months);
      await admin.from('subscriptions').update({ status: 'expired' }).eq('user_id', userId).eq('status', 'active');
      const { data: sub } = await admin.from('subscriptions').insert({
        user_id: userId, plan, status: 'active', currency, amount: parseFloat(amount),
        period_start: new Date().toISOString(), period_end: periodEnd,
      }).select('id').single();
      if (sub) await admin.from('payments').update({ subscription_id: sub.id }).eq('txnid', txnid);
    }

    return NextResponse.redirect(new URL('/programs?payment=success', req.url));
  }

  await admin.from('payments').update({ status: 'failed', payu_mihpayid: mihpayid || null, payu_response: body }).eq('txnid', txnid);
  return NextResponse.redirect(new URL('/programs?payment=failed', req.url));
}
