import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSupabaseAdmin } from '../../../../src/lib/payu';
import { sendEmail, passwordResetEmail } from '../../../../src/lib/email';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const admin = getSupabaseAdmin();

  // Check if user exists via our own table
  const { data: profile } = await admin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (!profile) {
    // Check if enrolled — if so, create account via our SQL function
    const { data: enrollment } = await admin
      .from('enrollments')
      .select('id')
      .or(`student_email.eq.${email},parent_email.eq.${email}`)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (enrollment) {
      // Create account via SQL function
      const tempPassword = randomBytes(16).toString('hex');
      await admin.rpc('create_auth_user', {
        user_email: email,
        user_password: tempPassword,
        user_display_name: email.split('@')[0],
      });
    } else {
      // Don't reveal whether the email exists — security best practice
      return NextResponse.json({ success: true, action: 'reset_sent' });
    }
  }

  // Send password setup link
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await admin.from('email_tokens').delete().eq('email', email).eq('type', 'reset').is('used_at', null);
  await admin.from('email_tokens').insert({ email, token, type: 'reset', expires_at: expiresAt });

  const result = await sendEmail(passwordResetEmail(token, email));
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ success: true, action: 'reset_sent' });
}
