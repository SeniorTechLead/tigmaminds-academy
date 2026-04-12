import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSupabaseAdmin } from '../../../src/lib/payu';
import { sendEmail } from '../../../src/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentEmail, parentEmail, cohortName } = body;

    if (!studentEmail) {
      return NextResponse.json({ error: 'studentEmail required' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // Verify caller is admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const { data: { user: caller } } = await admin.auth.getUser(authHeader.slice(7));
    if (!caller) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: callerProfile } = await admin
      .from('user_profiles')
      .select('roles')
      .eq('id', caller.id)
      .single();
    if (!callerProfile?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'admin only' }, { status: 403 });
    }

    const results: { email: string; status: string }[] = [];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tigmaminds.academy';

    async function inviteUser(email: string, role: 'student' | 'parent') {
      // Check if user already has an account
      const { data: existingProfile } = await admin
        .from('user_profiles')
        .select('id, roles')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        // User exists — add role if they don't have it
        const currentRoles: string[] = existingProfile.roles || [];
        if (!currentRoles.includes(role)) {
          await admin.from('user_profiles')
            .update({ roles: [...currentRoles, role] })
            .eq('id', existingProfile.id);
        }

        // Send a notification email (not a "set password" email)
        await sendEmail({
          to: email,
          toName: email.split('@')[0],
          subject: `You've been added as a ${role === 'parent' ? 'guardian' : 'student'} — ${cohortName || 'TigmaMinds Academy'}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #f59e0b; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: 800; font-size: 18px;">TMA</div>
              </div>
              <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center;">You've been added as a ${role === 'parent' ? 'guardian' : 'student'}</h1>
              <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">You now have ${role === 'parent' ? 'guardian' : 'student'} access for <strong>${cohortName || 'the School Program'}</strong>. Log in with your existing account to view the ${role === 'parent' ? 'guardian dashboard' : 'student dashboard'}.</p>
              <div style="text-align: center; margin: 28px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="background-color: #f59e0b; border-radius: 10px; padding: 12px 32px;">
                  <a href="${appUrl}/auth" style="color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">Log In</a>
                </td></tr></table>
              </div>
              <p style="color: #ccc; font-size: 11px; text-align: center; margin-top: 32px;">TigmaMinds Academy</p>
            </div>
          `,
        });

        results.push({ email, status: 'existing account — role added' });
        return;
      }

      // New user — create account via SQL function
      const tempPassword = randomBytes(16).toString('hex');
      const { error: createErr } = await admin.rpc('create_auth_user', {
        user_email: email,
        user_password: tempPassword,
        user_display_name: email.split('@')[0],
      });

      if (createErr) {
        results.push({ email, status: `error: ${createErr.message}` });
        return;
      }

      // Update role on the auto-created profile
      await admin.from('user_profiles')
        .update({ role, roles: [role] })
        .eq('email', email);

      // Generate password setup token (7 days)
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await admin.from('email_tokens').delete().eq('email', email).eq('type', 'reset').is('used_at', null);
      await admin.from('email_tokens').insert({ email, token, type: 'reset', expires_at: expiresAt });

      // Send invite email with password setup link
      const setupLink = `${appUrl}/auth/reset?token=${token}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        toName: email.split('@')[0],
        subject: role === 'parent'
          ? `Your ward is enrolled in ${cohortName || 'TigmaMinds Academy'} — set up your guardian account`
          : `You're enrolled in ${cohortName || 'TigmaMinds Academy'} — set up your account`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background-color: #f59e0b; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: 800; font-size: 18px;">TMA</div>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center;">Welcome to TigmaMinds Academy!</h1>
            <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">${
              role === 'parent'
                ? `Your ward has been enrolled in <strong>${cohortName || 'the School Program'}</strong>. Set up your guardian account to track their progress, view reports, and communicate with mentors.`
                : `You've been enrolled in <strong>${cohortName || 'the School Program'}</strong>. Click below to set your password and get started.`
            }</p>
            <div style="text-align: center; margin: 28px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="background-color: #f59e0b; border-radius: 10px; padding: 12px 32px;">
                <a href="${setupLink}" style="color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">Set Your Password</a>
              </td></tr></table>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">This link expires in 7 days.</p>
            <p style="color: #ccc; font-size: 11px; text-align: center; margin-top: 32px;">TigmaMinds Academy</p>
          </div>
        `,
      });

      results.push({ email, status: 'invited' });
    }

    if (studentEmail) await inviteUser(studentEmail, 'student');
    if (parentEmail) await inviteUser(parentEmail, 'parent');

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('[Invite] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
