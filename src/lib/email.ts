/**
 * Configurable email service.
 * Providers: azure | resend | gmail | outlook | smtp
 * Used for: email verification, password reset, enrollment invites, hackathon notifications.
 */

import nodemailer from 'nodemailer';

type EmailProvider = 'azure' | 'resend' | 'gmail' | 'outlook' | 'smtp';

const PROVIDER = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase() as EmailProvider;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL =
  process.env.EMAIL_FROM ||
  process.env.SENDER_EMAIL ||
  'noreply@tigmaminds.academy';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'TigmaMinds Academy';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tigmaminds.academy';

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID || '';
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID || '';
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || FROM_EMAIL;

/** Outlook/GAL shows the Azure AD mailbox display name, not EMAIL_FROM_NAME, for same-tenant mail. */
let azureSenderDisplayNameChecked = false;

const SMTP_PRESETS: Record<'gmail' | 'outlook', { host: string; port: number; secure: boolean }> = {
  gmail: { host: 'smtp.gmail.com', port: 587, secure: false },
  outlook: { host: 'smtp.office365.com', port: 587, secure: false },
};

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

function getSmtpConfig() {
  if (PROVIDER === 'gmail' || PROVIDER === 'outlook') {
    const preset = SMTP_PRESETS[PROVIDER];
    return {
      host: process.env.EMAIL_SMTP_HOST || preset.host,
      port: Number(process.env.EMAIL_SMTP_PORT || preset.port),
      secure: process.env.EMAIL_SMTP_SECURE === 'true' ? true : preset.secure,
      user: process.env.EMAIL_SMTP_USER || '',
      pass: process.env.EMAIL_SMTP_PASSWORD || '',
    };
  }

  return {
    host: process.env.EMAIL_SMTP_HOST || '',
    port: Number(process.env.EMAIL_SMTP_PORT || 587),
    secure: process.env.EMAIL_SMTP_SECURE === 'true',
    user: process.env.EMAIL_SMTP_USER || '',
    pass: process.env.EMAIL_SMTP_PASSWORD || '',
  };
}

async function getAzureAccessToken(): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: AZURE_CLIENT_ID,
    client_secret: AZURE_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    console.error('[Email] Azure token error:', res.status, data);
    throw new Error(data.error_description || data.error || 'Failed to get Azure access token');
  }

  return data.access_token as string;
}

/**
 * Outlook shows the Azure AD mailbox Display Name (e.g. "Web User"), not EMAIL_FROM_NAME.
 * Try to align it once per process when the app has User.ReadWrite.All.
 */
async function ensureAzureSenderDisplayName(accessToken: string) {
  if (azureSenderDisplayNameChecked) return;
  azureSenderDisplayNameChecked = true;

  try {
    const userUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER_EMAIL)}?$select=id,displayName`;
    const getRes = await fetch(userUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await getRes.json().catch(() => ({}));

    if (!getRes.ok || !user.id) {
      console.warn(
        `[Email] Could not read Azure sender profile for ${SENDER_EMAIL}. ` +
          `Set the mailbox Display Name to "${FROM_NAME}" in Microsoft 365 admin ` +
          `(Users → ${SENDER_EMAIL} → Display name), or grant the app User.Read.All.`,
      );
      return;
    }

    if (String(user.displayName || '').trim() === FROM_NAME) return;

    const patchRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(user.id)}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: FROM_NAME }),
      },
    );

    if (patchRes.ok) {
      console.info(`[Email] Updated Azure sender display name to "${FROM_NAME}"`);
      return;
    }

    console.warn(
      `[Email] Azure mailbox "${SENDER_EMAIL}" is named "${user.displayName}", so Outlook shows that instead of "${FROM_NAME}". ` +
        `Rename Display Name to "${FROM_NAME}" in Microsoft 365 admin (Users → ${SENDER_EMAIL}), ` +
        `or grant the app User.ReadWrite.All so it can update automatically.`,
    );
  } catch (err) {
    console.warn('[Email] Could not verify Azure sender display name:', err);
  }
}

async function sendViaAzure({ to, toName, subject, html }: SendEmailParams) {
  if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET || !SENDER_EMAIL) {
    console.warn('[Email] Azure credentials not configured — email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  const accessToken = await getAzureAccessToken();
  await ensureAzureSenderDisplayName(accessToken);
  const sendUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER_EMAIL)}/sendMail`;

  const res = await fetch(sendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject,
        body: {
          contentType: 'HTML',
          content: html,
        },
        from: {
          emailAddress: {
            address: SENDER_EMAIL,
            name: FROM_NAME,
          },
        },
        sender: {
          emailAddress: {
            address: SENDER_EMAIL,
            name: FROM_NAME,
          },
        },
        toRecipients: [
          {
            emailAddress: {
              address: to,
              name: toName || to,
            },
          },
        ],
      },
      saveToSentItems: true,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error('[Email] Azure Graph error:', res.status, body);
    return {
      success: false,
      error: body.error?.message || body.message || `Azure email returned ${res.status}`,
    };
  }

  return { success: true };
}

async function sendViaResend({ to, subject, html, text }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured — email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
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
}

async function sendViaSmtp({ to, toName, subject, html, text }: SendEmailParams) {
  const smtp = getSmtpConfig();

  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.warn(`[Email] SMTP not configured for provider "${PROVIDER}" — email not sent`);
    return { success: false, error: 'Email service not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL || smtp.user}>`,
    to: toName ? `"${toName}" <${to}>` : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });

  return { success: true };
}

export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    if (PROVIDER === 'azure') {
      return await sendViaAzure(params);
    }

    if (PROVIDER === 'resend') {
      return await sendViaResend(params);
    }

    if (PROVIDER === 'gmail' || PROVIDER === 'outlook' || PROVIDER === 'smtp') {
      return await sendViaSmtp(params);
    }

    console.warn(`[Email] Unknown EMAIL_PROVIDER "${PROVIDER}" — email not sent`);
    return { success: false, error: `Unknown email provider: ${PROVIDER}` };
  } catch (err) {
    console.error('[Email] Send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error sending email',
    };
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

export interface HackathonEmailMember {
  name: string;
  email: string;
  phone: string;
  institution: string;
  eligibility: string;
  gender: string;
  tshirtSize: string;
  isLead: boolean;
}

export interface HackathonEmailPayload {
  registrationId: string;
  teamName: string;
  members: HackathonEmailMember[];
  ideaSummary?: string;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  registrationCloses: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hackathonMemberRows(members: HackathonEmailMember[]) {
  return members
    .map((member, index) => {
      const role = member.isLead || index === 0 ? ' (Team Lead)' : '';
      return `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333; font-size: 13px;">
            <strong>${escapeHtml(member.name)}${role}</strong><br/>
            ${escapeHtml(member.email)} · ${escapeHtml(member.phone)}<br/>
            ${escapeHtml(member.institution)} · Type: ${escapeHtml(member.eligibility)}<br/>
            Gender: ${escapeHtml(member.gender)} · T-shirt: ${escapeHtml(member.tshirtSize)}
          </td>
        </tr>`;
    })
    .join('');
}

export function hackathonConfirmationEmail(
  payload: HackathonEmailPayload,
  recipient: HackathonEmailMember,
): SendEmailParams {
  const membersHtml = hackathonMemberRows(payload.members);
  return {
    to: recipient.email,
    toName: recipient.name,
    subject: `Registration confirmed — ${payload.eventTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: 800; font-size: 18px;">TMA</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center;">You're registered!</h1>
        <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center;">
          Hi ${escapeHtml(recipient.name)}, team <strong>${escapeHtml(payload.teamName)}</strong> is registered for
          <strong>${escapeHtml(payload.eventTitle)}</strong>.
        </p>
        <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: #9a3412; font-size: 13px;"><strong>Reference ID:</strong> ${escapeHtml(payload.registrationId)}</p>
          <p style="margin: 0 0 8px; color: #9a3412; font-size: 13px;"><strong>Dates:</strong> ${escapeHtml(payload.eventDates)}</p>
          <p style="margin: 0 0 8px; color: #9a3412; font-size: 13px;"><strong>Location:</strong> ${escapeHtml(payload.eventLocation)}</p>
          <p style="margin: 0; color: #9a3412; font-size: 13px;"><strong>Registration closes:</strong> ${escapeHtml(payload.registrationCloses)}</p>
        </div>
        <h2 style="font-size: 16px; color: #1a1a1a; margin-bottom: 8px;">Team</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${membersHtml}</table>
        ${
          payload.ideaSummary
            ? `<p style="color: #666; font-size: 13px; margin-top: 16px;"><strong>Idea summary:</strong> ${escapeHtml(payload.ideaSummary)}</p>`
            : ''
        }
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
          We'll follow up with online qualifier details. Problem statements are shared after the qualifier round.
        </p>
        <p style="color: #ccc; font-size: 11px; text-align: center; margin-top: 32px;">TigmaMinds Academy</p>
      </div>
    `,
  };
}

export function hackathonOrganizerEmail(
  payload: HackathonEmailPayload,
  notifyTo = 'hackathon@tigmaminds.com',
): SendEmailParams {
  const membersHtml = hackathonMemberRows(payload.members);
  return {
    to: notifyTo,
    subject: `New hackathon registration — ${payload.teamName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">New hackathon registration</h1>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          <strong>Event:</strong> ${escapeHtml(payload.eventTitle)}<br/>
          <strong>Team:</strong> ${escapeHtml(payload.teamName)}<br/>
          <strong>Reference ID:</strong> ${escapeHtml(payload.registrationId)}<br/>
          <strong>Submitted:</strong> ${new Date().toISOString()}
        </p>
        <h2 style="font-size: 16px; color: #1a1a1a; margin: 20px 0 8px;">Members</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${membersHtml}</table>
        ${
          payload.ideaSummary
            ? `<p style="color: #666; font-size: 13px; margin-top: 16px;"><strong>Idea summary:</strong> ${escapeHtml(payload.ideaSummary)}</p>`
            : ''
        }
      </div>
    `,
  };
}
