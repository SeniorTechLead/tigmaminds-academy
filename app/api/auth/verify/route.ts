import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const email = req.nextUrl.searchParams.get('email');

  if (!token || !email) {
    return NextResponse.redirect(new URL('/auth?error=invalid_link', req.url));
  }

  const admin = getSupabaseAdmin();

  const { data: tokenRow } = await admin
    .from('email_tokens')
    .select('*')
    .eq('token', token)
    .eq('email', email)
    .eq('type', 'verify')
    .is('used_at', null)
    .single();

  if (!tokenRow) {
    return NextResponse.redirect(new URL('/auth?error=invalid_or_expired_token', req.url));
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/auth?error=token_expired', req.url));
  }

  await admin.from('email_tokens').update({ used_at: new Date().toISOString() }).eq('id', tokenRow.id);

  // Mark verified via our own table (no listUsers)
  await admin.from('user_profiles').update({ email_verified: true }).eq('email', email);

  return NextResponse.redirect(new URL('/auth?verified=true', req.url));
}
