import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 });
  }

  const returnTo = req.nextUrl.searchParams.get('returnTo') || '/lessons';

  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const origin = `${protocol}://${host}`;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: returnTo,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(googleAuthUrl, 302);
}
