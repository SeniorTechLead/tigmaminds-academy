import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLANS, isValidPlan, generateTxnId, generateHash, getSupabaseAdmin } from '../../../../src/lib/payu';
import type { PlanId, Currency } from '../../../../src/lib/payu';

export async function POST(req: NextRequest) {
  // Authenticate user
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Validate request
  const { plan, currency } = await req.json();

  if (!isValidPlan(plan)) {
    return NextResponse.json({ error: `Invalid plan: ${plan}` }, { status: 400 });
  }
  if (currency !== 'INR' && currency !== 'USD') {
    return NextResponse.json({ error: `Invalid currency: ${currency}` }, { status: 400 });
  }

  // Check PayU config
  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT;
  const payuBaseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';

  if (!merchantKey || !merchantSalt) {
    return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
  }

  // Build payment params
  const planConfig = PLANS[plan as PlanId];
  const amount = planConfig[currency as Currency].toFixed(2);
  const txnid = generateTxnId();
  const productinfo = planConfig.label;
  const firstname = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer';
  const email = user.email || '';
  const phone = user.phone || '';

  const origin = req.headers.get('origin') || req.headers.get('x-forwarded-proto') + '://' + req.headers.get('host') || 'http://localhost:3000';
  const surl = `${origin}/api/payment/success`;
  const furl = `${origin}/api/payment/failure`;

  const udf1 = plan;
  const udf2 = currency;
  const udf3 = user.id;
  const udf4 = '';
  const udf5 = '';

  const hash = generateHash({
    key: merchantKey, txnid, amount, productinfo, firstname, email,
    udf1, udf2, udf3, udf4, udf5, salt: merchantSalt,
  });

  // Record pending payment
  const admin = getSupabaseAdmin();
  const { error: insertError } = await admin.from('payments').insert({
    user_id: user.id, txnid, amount: parseFloat(amount), currency, status: 'pending', plan,
  });

  if (insertError) {
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }

  return NextResponse.json({
    payu_base_url: payuBaseUrl,
    key: merchantKey, txnid, amount, productinfo, firstname, email, phone,
    surl, furl, hash, udf1, udf2, udf3, udf4, udf5,
  });
}
