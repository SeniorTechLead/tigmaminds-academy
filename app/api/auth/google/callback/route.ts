import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const returnTo = req.nextUrl.searchParams.get('state') || '/lessons';

  if (!code) {
    const errorDesc = req.nextUrl.searchParams.get('error_description') || 'No authorization code received';
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(errorDesc)}`, req.url), 302);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const origin = `${protocol}://${host}`;
  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Google token exchange failed:', err);
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent('Google sign-in failed. Please try again.')}`, req.url), 302);
    }

    const tokens = await tokenRes.json();
    const idToken: string = tokens.id_token;

    if (!idToken) {
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent('No ID token received from Google.')}`, req.url), 302);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error || !data.session) {
      console.error('Supabase signInWithIdToken failed:', error?.message);
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(error?.message || 'Authentication failed.')}`, req.url), 302);
    }

    const { access_token, refresh_token } = data.session;
    const separator = returnTo.includes('#') ? '&' : '#';
    const redirectUrl = `${origin}${returnTo}${separator}access_token=${access_token}&refresh_token=${refresh_token}&type=recovery`;

    return NextResponse.redirect(redirectUrl, 302);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent('An unexpected error occurred. Please try again.')}`, req.url), 302);
  }
}
