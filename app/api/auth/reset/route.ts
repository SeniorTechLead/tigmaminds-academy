import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

export async function POST(req: NextRequest) {
  const { token, email, password } = await req.json();

  if (!token || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data: tokenRow } = await admin
    .from('email_tokens')
    .select('*')
    .eq('token', token)
    .eq('email', email)
    .eq('type', 'reset')
    .is('used_at', null)
    .single();

  if (!tokenRow) {
    return NextResponse.json({ error: 'Invalid or already used reset link' }, { status: 400 });
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 });
  }

  // Update password via SQL function (admin API updateUserById is unreliable)
  const { error: updateErr } = await admin.rpc('update_user_password', {
    user_email: email,
    new_password: password,
  });

  if (updateErr) {
    console.error('[Reset] Password update error:', updateErr.message);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }

  // Mark token as used
  await admin.from('email_tokens').update({ used_at: new Date().toISOString() }).eq('id', tokenRow.id);

  return NextResponse.json({ success: true });
}
