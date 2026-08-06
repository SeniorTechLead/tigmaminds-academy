import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import hackathon from '../../../../src/data/hackathon.json';
import type { HackathonMember, HackathonRegistration } from '../../../../src/data/hackathon-types';
import { isHackathonRegistrationOpen } from '../../../../src/data/hackathon-utils';
import {
  hackathonConfirmationEmail,
  hackathonOrganizerEmail,
  sendEmail,
} from '../../../../src/lib/email';

const REGISTRATIONS_PATH = path.join(process.cwd(), 'data', 'hackathon-registrations.json');

const ELIGIBILITY_OPTIONS = new Set([
  'UG Student',
  'PG Student',
  'Fresher',
  'Recent Passout',
]);

const GENDER_OPTIONS = new Set(['Male', 'Female', 'Other', 'Prefer not to say']);

const TSHIRT_SIZE_OPTIONS = new Set(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']);

async function readRegistrations(): Promise<HackathonRegistration[]> {
  try {
    const raw = await fs.readFile(REGISTRATIONS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRegistrations(registrations: HackathonRegistration[]) {
  await fs.mkdir(path.dirname(REGISTRATIONS_PATH), { recursive: true });
  await fs.writeFile(REGISTRATIONS_PATH, JSON.stringify(registrations, null, 2), 'utf8');
}

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
  if (!institution || institution.length < 2) return `Member ${index + 1}: institution is required`;
  if (!ELIGIBILITY_OPTIONS.has(eligibility)) return `Member ${index + 1}: participant type is invalid`;
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
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
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

  // Ensure exactly one lead (first member)
  members.forEach((m, i) => {
    m.isLead = i === 0;
  });

  const emails = members.map((m) => m.email);
  if (new Set(emails).size !== emails.length) {
    return NextResponse.json({ error: 'Each team member must have a unique email.' }, { status: 400 });
  }

  const registration: HackathonRegistration = {
    id: `hk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    teamName,
    members,
    ideaSummary: String(body.ideaSummary ?? '').trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const existing = await readRegistrations();
  existing.push(registration);
  await writeRegistrations(existing);

  const emailPayload = {
    registrationId: registration.id,
    teamName: registration.teamName,
    members: registration.members,
    ideaSummary: registration.ideaSummary,
    eventTitle: hackathon.title,
    eventDates: hackathon.dates,
    eventLocation: hackathon.location,
    registrationCloses: hackathon.registrationCloses,
  };

  const emailResults = await Promise.all([
    ...registration.members.map((member) =>
      sendEmail(hackathonConfirmationEmail(emailPayload, member)),
    ),
    sendEmail(hackathonOrganizerEmail(emailPayload, hackathon.notifyEmail)),
  ]);

  const emailsSent = emailResults.filter((r) => r.success).length;
  if (emailsSent < emailResults.length) {
    console.warn(
      '[Hackathon] Some registration emails failed:',
      emailResults.filter((r) => !r.success).map((r) => r.error),
    );
  }

  return NextResponse.json({
    ok: true,
    id: registration.id,
    emailsSent,
  });
}
