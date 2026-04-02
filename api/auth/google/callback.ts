import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = req.query.code as string | undefined;
  const returnTo = (req.query.state as string) || '/lessons';

  if (!code) {
    const errorDesc = req.query.error_description || 'No authorization code received';
    return res.redirect(302, `/auth?error=${encodeURIComponent(String(errorDesc))}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

  // Build redirect_uri (must match what was sent in /login)
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${protocol}://${host}`;
  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    // 1. Exchange authorization code for tokens
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
      return res.redirect(302, `/auth?error=${encodeURIComponent('Google sign-in failed. Please try again.')}`);
    }

    const tokens = await tokenRes.json();
    const idToken: string = tokens.id_token;

    if (!idToken) {
      return res.redirect(302, `/auth?error=${encodeURIComponent('No ID token received from Google.')}`);
    }

    // 2. Use signInWithIdToken to authenticate with Supabase
    //    This creates the user if they don't exist, or signs them in if they do.
    //    Uses the anon key — Supabase validates the Google ID token server-side.
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error || !data.session) {
      console.error('Supabase signInWithIdToken failed:', error?.message);
      return res.redirect(302, `/auth?error=${encodeURIComponent(error?.message || 'Authentication failed.')}`);
    }

    // 3. Set session tokens as cookies so the browser picks them up
    const { access_token, refresh_token } = data.session;
    const isProduction = origin.includes('tigmaminds.academy');
    const cookieOpts = [
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=604800`, // 7 days
      ...(isProduction ? ['Secure'] : []),
    ].join('; ');

    // 4. Build redirect URL that passes tokens via hash fragment
    const separator = returnTo.includes('#') ? '&' : '#';
    const redirectUrl = `${origin}${returnTo}${separator}access_token=${access_token}&refresh_token=${refresh_token}&type=recovery`;

    console.log('OAuth callback redirecting to:', redirectUrl.replace(/access_token=[^&]+/, 'access_token=REDACTED'));
    res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect(302, `/auth?error=${encodeURIComponent('An unexpected error occurred. Please try again.')}`);
  }
}
