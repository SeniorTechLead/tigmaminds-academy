/**
 * Email service using Resend HTTP API.
 * No SMTP dependency — direct HTTP calls.
 * Used for: email verification, password reset, enrollment invites, notifications.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@tigmaminds.academy';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'TigmaMinds Academy';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tigmaminds.academy';

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, toName, subject, html, text }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured — email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [to],
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('[Email] Resend error:', res.status, body);
      return { success: false, error: body.message || `Email service returned ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error('[Email] Network error:', err);
    return { success: false, error: 'Network error sending email' };
  }
}

// ── Email Templates ──────────────────────────────────────

export function verificationEmail(token: string, email: string): SendEmailParams {
  const link = `${APP_URL}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
  return {
    to: email,
    subject: 'Verify your TigmaMinds Academy account',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #f59e0b; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: 800; font-size: 18px;">TMA</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center;">Verify your email</h1>
        <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">Click the button below to verify your email address and activate your account.</p>
        <div style="text-align: center; margin: 28px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="background-color: #f59e0b; border-radius: 10px; padding: 12px 32px;">
            <a href="${link}" style="color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">Verify Email</a>
          </td></tr></table>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't create an account, ignore this email. The link expires in 24 hours.</p>
        <p style="color: #ccc; font-size: 11px; text-align: center; margin-top: 32px;">TigmaMinds Academy</p>
      </div>
    `,
  };
}

export function passwordResetEmail(token: string, email: string): SendEmailParams {
  const link = `${APP_URL}/auth/reset?token=${token}&email=${encodeURIComponent(email)}`;
  return {
    to: email,
    subject: 'Reset your TigmaMinds Academy password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #f59e0b; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: 800; font-size: 18px;">TMA</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center;">Reset your password</h1>
        <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">Click the button below to choose a new password.</p>
        <div style="text-align: center; margin: 28px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="background-color: #f59e0b; border-radius: 10px; padding: 12px 32px;">
            <a href="${link}" style="color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">Reset Password</a>
          </td></tr></table>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, ignore this email. The link expires in 1 hour.</p>
        <p style="color: #ccc; font-size: 11px; text-align: center; margin-top: 32px;">TigmaMinds Academy</p>
      </div>
    `,
  };
}

export function enrollmentInviteEmail(studentName: string, email: string, cohortName: string): SendEmailParams {
  const link = `${APP_URL}/auth?returnTo=/program/student`;
  return {
    to: email,
    toName: studentName,
    subject: `You're enrolled in ${cohortName} — TigmaMinds Academy`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: 800; font-size: 18px;">TMA</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center;">Welcome, ${studentName}!</h1>
        <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">You've been enrolled in <strong>${cohortName}</strong>. Create your account to get started.</p>
        <div style="text-align: center; margin: 28px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="background-color: #f59e0b; border-radius: 10px; padding: 12px 32px;">
            <a href="${link}" style="color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">Get Started</a>
          </td></tr></table>
        </div>
        <p style="color: #ccc; font-size: 11px; text-align: center; margin-top: 32px;">TigmaMinds Academy</p>
      </div>
    `,
  };
}
