import { NextRequest, NextResponse } from 'next/server';
import { verifyHash, isValidPlan, calculatePeriodEnd, PLANS, getSupabaseAdmin } from '../../../../src/lib/payu';
import type { PlanId } from '../../../../src/lib/payu';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const body: Record<string, string> = {};
  formData.forEach((value, key) => { body[key] = value.toString(); });

  const { mihpayid, status, txnid, amount, productinfo, firstname, email, hash, udf1, udf2, udf3, udf4, udf5 } = body;

  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT;

  if (!merchantKey || !merchantSalt) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const isValid = verifyHash({
    key: merchantKey, salt: merchantSalt, status, txnid, amount, productinfo, firstname, email,
    udf1, udf2, udf3, udf4, udf5, receivedHash: hash,
  });

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const plan = udf1 || '';
  const currency = udf2 || 'INR';
  const userId = udf3 || '';

  // Idempotency check
  const { data: existing } = await admin.from('payments').select('status').eq('txnid', txnid).single();
  if (existing?.status === 'success') {
    return NextResponse.json({ message: 'Already processed' });
  }

  if (status === 'success') {
    await admin.from('payments').update({ status: 'success', payu_mihpayid: mihpayid, payu_response: body }).eq('txnid', txnid);

    if (userId && isValidPlan(plan)) {
      const { data: activeSub } = await admin.from('subscriptions')
        .select('id').eq('user_id', userId).eq('status', 'active')
        .gte('period_end', new Date().toISOString()).maybeSingle();

      if (!activeSub) {
        const planConfig = PLANS[plan as PlanId];
        await admin.from('subscriptions').insert({
          user_id: userId, plan, status: 'active', currency, amount: parseFloat(amount),
          period_start: new Date().toISOString(), period_end: calculatePeriodEnd(planConfig.months),
        });
      }
    }
  } else {
    await admin.from('payments').update({ status: 'failed', payu_mihpayid: mihpayid || null, payu_response: body }).eq('txnid', txnid);
  }

  return NextResponse.json({ message: 'OK' });
}
