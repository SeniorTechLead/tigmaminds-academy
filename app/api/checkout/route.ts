import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateTxnId, generateHash, getSupabaseAdmin } from '../../../src/lib/payu';

/**
 * POST /api/checkout
 * Initiates a PayU payment for school program monthly fees.
 * Called from ParentPaymentsPage with: amount, productInfo, userId, email, name, udf1-3.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, name, amount, productInfo, returnUrl, failureUrl, udf1, udf2, udf3 } = body;

    if (!userId || !email || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    const merchantKey = process.env.PAYU_MERCHANT_KEY;
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    const payuBaseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';

    if (!merchantKey || !merchantSalt) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const txnid = generateTxnId();
    const amountStr = parseFloat(amount).toFixed(2);
    const firstname = name || email.split('@')[0] || 'Parent';

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const surl = returnUrl || `${origin}/program/guardian/payments?result=success`;
    const furl = failureUrl || `${origin}/program/guardian/payments?result=failed`;

    // udf fields: udf1=enrollment_id, udf2=payment_id, udf3=month_label
    const hash = generateHash({
      key: merchantKey,
      txnid,
      amount: amountStr,
      productinfo: productInfo || 'Program Fee',
      firstname,
      email,
      udf1: udf1 || '',
      udf2: udf2 || '',
      udf3: udf3 || '',
      udf4: 'program_fee',
      udf5: userId,
      salt: merchantSalt,
    });

    // Record pending payment in program_payments table
    const admin = getSupabaseAdmin();
    if (udf2) {
      // Update the existing program_payments row status
      await admin.from('program_payments').update({
        status: 'processing',
        payu_txnid: txnid,
      }).eq('id', udf2);
    }

    // Build PayU auto-submit form
    const formFields = {
      key: merchantKey,
      txnid,
      amount: amountStr,
      productinfo: productInfo || 'Program Fee',
      firstname,
      email,
      phone: '',
      surl,
      furl,
      hash,
      udf1: udf1 || '',
      udf2: udf2 || '',
      udf3: udf3 || '',
      udf4: 'program_fee',
      udf5: userId,
    };

    const hiddenInputs = Object.entries(formFields)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
      .join('\n');

    const html = `
      <form id="payuForm" action="${payuBaseUrl}" method="POST">
        ${hiddenInputs}
      </form>
      <script>document.getElementById('payuForm').submit();</script>
    `;

    return NextResponse.json({ html });
  } catch (err) {
    console.error('[Checkout] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
