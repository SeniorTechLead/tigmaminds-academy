import { NextRequest, NextResponse } from 'next/server';
import hackathon from '../../../../src/data/hackathon.json';
import type { HackathonMember } from '../../../../src/data/hackathon-types';
import { isHackathonRegistrationOpen } from '../../../../src/data/hackathon-utils';
import {
  HACKATHON_ELIGIBILITY_OTHER,
  HACKATHON_INSTITUTION_OTHER,
} from '../../../../src/data/hackathon-institutions';
import {
  hackathonConfirmationEmail,
  hackathonOrganizerEmail,
  sendEmail,
} from '../../../../src/lib/email';

const GENDER_OPTIONS = new Set(['Male', 'Female', 'Other', 'Prefer not to say']);

const TSHIRT_SIZE_OPTIONS = new Set(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/[\s\-()]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(digits);
}

function normalizeMember(raw: Partial<HackathonMember>, index: number): HackathonMember | string {
  const name = String(raw.name ?? '').trim();
  const email = String(raw.email ?? '').trim().toLowerCase();
  const phone = String(raw.phone ?? '').trim();
  const institution = String(raw.institution ?? '').trim();
  const eligibility = String(raw.eligibility ?? '').trim();
  const gender = String(raw.gender ?? '').trim();
  const tshirtSize = String(raw.tshirtSize ?? '').trim().toUpperCase();

  if (!name || name.length < 2) return `Member ${index + 1}: valid full name is required`;
  if (!email || !isValidEmail(email)) return `Member ${index + 1}: valid email is required`;
  if (!phone || !isValidPhone(phone)) return `Member ${index + 1}: valid 10-digit Indian mobile is required`;
  if (!institution || institution.length < 2) {
    return `Member ${index + 1}: institution is required`;
  }
  if (institution === HACKATHON_INSTITUTION_OTHER) {
    return `Member ${index + 1}: enter your college / institution name`;
  }
  if (!eligibility || eligibility.length < 2) {
    return `Member ${index + 1}: participant type is required`;
  }
  if (eligibility === HACKATHON_ELIGIBILITY_OTHER) {
    return `Member ${index + 1}: enter your participant type`;
  }
  if (!GENDER_OPTIONS.has(gender)) return `Member ${index + 1}: gender is invalid`;
  if (!TSHIRT_SIZE_OPTIONS.has(tshirtSize)) return `Member ${index + 1}: t-shirt size is invalid`;

  return {
    name,
    email,
    phone,
    institution,
    eligibility,
    gender,
    tshirtSize,
    isLead: Boolean(raw.isLead) || index === 0,
  };
}

export async function POST(request: NextRequest) {
  if (!isHackathonRegistrationOpen()) {
    return NextResponse.json({ error: 'Registration is closed.' }, { status: 403 });
  }

  let body: {
    teamName?: string;
    members?: Partial<HackathonMember>[];
    ideaSummary?: string;
    acceptedTerms?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (body.acceptedTerms !== true) {
    return NextResponse.json(
      { error: 'You must accept the Official Rules and Terms to register.' },
      { status: 400 },
    );
  }

  const teamName = String(body.teamName ?? '').trim();
  if (!teamName || teamName.length < 2) {
    return NextResponse.json({ error: 'Team name must be at least 2 characters.' }, { status: 400 });
  }
  if (teamName.length > 80) {
    return NextResponse.json({ error: 'Team name must be under 80 characters.' }, { status: 400 });
  }

  if (!Array.isArray(body.members)) {
    return NextResponse.json({ error: 'Members list is required.' }, { status: 400 });
  }

  if (body.members.length < hackathon.minTeamSize || body.members.length > hackathon.maxTeamSize) {
    return NextResponse.json(
      { error: `Team must have ${hackathon.minTeamSize}–${hackathon.maxTeamSize} members.` },
      { status: 400 },
    );
  }

  const members: HackathonMember[] = [];
  for (let i = 0; i < body.members.length; i++) {
    const result = normalizeMember(body.members[i], i);
    if (typeof result === 'string') {
      return NextResponse.json({ error: result }, { status: 400 });
    }
    members.push(result);
  }

  members.forEach((m, i) => {
    m.isLead = i === 0;
  });

  const emails = members.map((m) => m.email);
  if (new Set(emails).size !== emails.length) {
    return NextResponse.json({ error: 'Each team member must have a unique email.' }, { status: 400 });
  }

  const registrationId = `hk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ideaSummary = String(body.ideaSummary ?? '').trim() || undefined;

  const emailPayload = {
    registrationId,
    teamName,
    members,
    ideaSummary,
    eventTitle: hackathon.title,
    eventDates: hackathon.dates,
    eventLocation: hackathon.location,
    registrationCloses: hackathon.registrationCloses,
  };

  const emailResults = await Promise.all([
    ...members.map((member) => sendEmail(hackathonConfirmationEmail(emailPayload, member))),
    sendEmail(hackathonOrganizerEmail(emailPayload, hackathon.notifyEmail)),
  ]);

  const emailsSent = emailResults.filter((r) => r.success).length;
  if (emailsSent === 0) {
    console.error(
      '[Hackathon] All registration emails failed:',
      emailResults.map((r) => r.error),
    );
    return NextResponse.json(
      { error: 'Could not send confirmation emails. Please try again.' },
      { status: 500 },
    );
  }

  if (emailsSent < emailResults.length) {
    console.warn(
      '[Hackathon] Some registration emails failed:',
      emailResults.filter((r) => !r.success).map((r) => r.error),
    );
  }

  return NextResponse.json({
    ok: true,
    id: registrationId,
    emailsSent,
  });
}
