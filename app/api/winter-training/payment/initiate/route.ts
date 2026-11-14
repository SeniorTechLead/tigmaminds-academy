import { NextRequest, NextResponse } from 'next/server';
import { generateTxnId, generateHash } from '../../../../../src/lib/payu';
import { createPendingPaymentRecord } from '../../../../../src/lib/winter-db';

const DEFAULT_AMOUNT = 499.0;
const ENVOY_BASE_URL = 'https://development.xorai.com/hackathone';

// ── In-Memory IP Rate Limiter (Max 5 attempts per 10 minutes per IP) ──
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_MAX = 6;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Clean up expired IP entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.expiresAt) rateLimitMap.delete(ip);
  }
}, 15 * 60 * 1000).unref();

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting Check
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let { registrationId } = body;
    const { firstName, lastName, email, phone, organization, honeypot } = body;

    // 2. Anti-Spam: Invisible Honeypot check (Bots fill this, humans never do)
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('[AntiSpam] Bot detected via honeypot trap:', { clientIp, honeypot });
      return NextResponse.json({ error: 'Suspicious request detected.' }, { status: 400 });
    }

    // 3. Anti-Spam: Reject URL / HTML Script injection in text fields
    const urlPattern = /(https?:\/\/|www\.|<script|<a\s)/i;
    if (
      urlPattern.test(String(firstName || '')) ||
      urlPattern.test(String(lastName || '')) ||
      urlPattern.test(String(organization || ''))
    ) {
      return NextResponse.json(
        { error: 'Names or institution cannot contain website links or code.' },
        { status: 400 }
      );
    }

    // 5. Field Validations
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid first name.' }, { status: 400 });
    }
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 1) {
      return NextResponse.json({ error: 'Please enter a valid last name.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    const cleanPhone = (phone || '').toString().replace(/\D/g, '');
    if (!/^[1-9][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' },
        { status: 400 }
      );
    }
    if (!organization || typeof organization !== 'string' || organization.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your college or company name.' },
        { status: 400 }
      );
    }

    // 6. If registrationId was not passed, call xorai registration API
    if (!registrationId) {
      try {
        const regRes = await fetch(`${ENVOY_BASE_URL}/registration`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: cleanPhone,
            email: email.trim(),
            institution: organization.trim(),
          }),
        });

        if (regRes.ok) {
          const regData = await regRes.json();
          registrationId = regData.registrationId || regData.registration_id || '';
        }
      } catch (envoyErr) {
        console.warn('[WinterTraining] Envoy registration call error:', envoyErr);
      }
    }

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is missing. Please ensure registration completed in xorai first.' },
        { status: 400 }
      );
    }

    // 7. Read PayU merchant configuration
    const merchantKey = process.env.PAYU_MERCHANT_KEY || 'lGWab3';
    const merchantSalt = process.env.PAYU_MERCHANT_SALT || 'aq1BPSnGpbtTMV8FmIdDznx0HQt9LtKJ';
    const payuBaseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';

    // 8. Prepare payment transaction details
    const txnid = generateTxnId();
    const amountStr = DEFAULT_AMOUNT.toFixed(2);
    const productinfo = 'Winter Training: Python, FastAPI & LLM Apps';
    const cleanFirstName = firstName.trim();
    const cleanEmail = email.trim();

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    const surl = `${origin}/api/winter-training/payment/success`;
    const furl = `${origin}/api/winter-training/payment/failure`;

    const udf1 = registrationId;
    const udf2 = organization.trim().slice(0, 50);
    const udf3 = lastName.trim().slice(0, 50);
    const udf4 = 'winter_training';
    const udf5 = cleanPhone;

    // 9. Generate secure PayU SHA-512 hash
    const hash = generateHash({
      key: merchantKey,
      txnid,
      amount: amountStr,
      productinfo,
      firstname: cleanFirstName,
      email: cleanEmail,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      salt: merchantSalt,
    });

    // 10. Record pending transaction in PostgreSQL registration_payments table
    try {
      await createPendingPaymentRecord({
        registrationId,
        txnid,
        amount: DEFAULT_AMOUNT,
        currency: 'INR',
        hash,
      });
    } catch (payDbErr) {
      console.warn('[WinterTraining] Warning recording pending payment in DB:', payDbErr);
    }

    return NextResponse.json({
      success: true,
      registrationId,
      payu_base_url: payuBaseUrl,
      params: {
        key: merchantKey,
        txnid,
        amount: amountStr,
        productinfo,
        firstname: cleanFirstName,
        email: cleanEmail,
        phone: cleanPhone,
        surl,
        furl,
        hash,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
      },
    });
  } catch (error: unknown) {
    console.error('[WinterTraining] Payment initiation error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
