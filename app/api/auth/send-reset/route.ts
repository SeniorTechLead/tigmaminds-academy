import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSupabaseAdmin } from '../../../../src/lib/payu';
import { sendEmail, passwordResetEmail } from '../../../../src/lib/email';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const admin = getSupabaseAdmin();

  // Check if user exists via our own table (not listUsers)
  const { data: profile } = await admin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (!profile) {
    // Don't reveal that the email doesn't exist — security best practice
    return NextResponse.json({ success: true });
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await admin.from('email_tokens').delete().eq('email', email).eq('type', 'reset').is('used_at', null);
  await admin.from('email_tokens').insert({ email, token, type: 'reset', expires_at: expiresAt });

  const result = await sendEmail(passwordResetEmail(token, email));
  if (!result.success) {
    console.error('[Reset] Email send error:', result.error);
  }

  // Always return success
  return NextResponse.json({ success: true });
}
