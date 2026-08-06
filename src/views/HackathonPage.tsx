'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Code2,
  Gift,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Send,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import hackathon from '../data/hackathon.json';
import type { HackathonMember } from '../data/hackathon-types';
import { isHackathonRegistrationOpen } from '../data/hackathon-utils';
import {
  HACKATHON_RULEBOOK_CONTACT,
  HACKATHON_RULEBOOK_SECTIONS,
  HACKATHON_RULEBOOK_SUBTITLE,
  HACKATHON_RULEBOOK_TITLE,
  type HackathonRuleSection,
} from '../data/hackathon-rulebook';

const ELIGIBILITY_OPTIONS = [
  'UG Student',
  'PG Student',
  'Fresher',
  'Recent Passout',
] as const;

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

const TSHIRT_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;

type MemberForm = Omit<HackathonMember, 'isLead'> & { isLead?: boolean };

type MemberErrors = Partial<Record<keyof MemberForm, string>>;

function emptyMember(): MemberForm {
  return {
    name: '',
    email: '',
    phone: '',
    institution: '',
    eligibility: '',
    gender: '',
    tshirtSize: '',
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/[\s\-()]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(digits);
}

/** Allow only + at start and digits (spaces/dashes stripped while typing). */
function sanitizePhoneInput(value: string) {
  const cleaned = value.replace(/[^\d+]/g, '');
  if (!cleaned) return '';

  const hasPlus = cleaned.startsWith('+');
  const digits = cleaned.replace(/\D/g, '').slice(0, hasPlus ? 12 : 10);
  return hasPlus ? `+${digits}` : digits;
}

function validateTeamName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Team name is required';
  if (trimmed.length < 2) return 'Team name must be at least 2 characters';
  if (trimmed.length > 80) return 'Team name must be under 80 characters';
  return '';
}

function validateMember(member: MemberForm): MemberErrors {
  const errors: MemberErrors = {};
  const name = member.name.trim();
  const email = member.email.trim();
  const phone = member.phone.trim();
  const institution = member.institution.trim();

  if (!name) errors.name = 'Full name is required';
  else if (name.length < 2) errors.name = 'Enter a valid full name';

  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';

  if (!phone) errors.phone = 'Phone number is required';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';

  if (!institution) errors.institution = 'College / institution is required';
  else if (institution.length < 2) errors.institution = 'Enter a valid institution name';

  if (!member.eligibility) errors.eligibility = 'Select participant type';
  if (!member.gender) errors.gender = 'Select gender';
  if (!member.tshirtSize) errors.tshirtSize = 'Select t-shirt size';

  return errors;
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 border bg-slate-950/80 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
    hasError ? 'border-red-400' : 'border-white/15'
  }`;

export default function HackathonPage() {
  const router = useRouter();
  const registrationOpen = isHackathonRegistrationOpen();
  const [teamName, setTeamName] = useState('');
  const [ideaSummary, setIdeaSummary] = useState('');
  const [members, setMembers] = useState<MemberForm[]>([emptyMember(), emptyMember()]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [teamNameError, setTeamNameError] = useState('');
  const [memberErrors, setMemberErrors] = useState<MemberErrors[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [showRulebook, setShowRulebook] = useState(false);

  useEffect(() => {
    if (!showRulebook) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowRulebook(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showRulebook]);

  const clearMemberFieldError = (index: number, field: keyof MemberErrors) => {
    setMemberErrors((prev) => {
      if (!prev[index]?.[field]) return prev;
      return prev.map((errors, i) => (i === index ? { ...errors, [field]: undefined } : errors));
    });
  };

  const updateMember = (index: number, field: keyof MemberForm, value: string) => {
    setMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, [field]: value } : member)),
    );
    if (field in { name: 1, email: 1, phone: 1, institution: 1, eligibility: 1, gender: 1, tshirtSize: 1 }) {
      clearMemberFieldError(index, field as keyof MemberErrors);
    }
  };

  const addMember = () => {
    if (members.length >= hackathon.maxTeamSize) return;
    setMembers((prev) => [...prev, emptyMember()]);
    setMemberErrors((prev) => [...prev, {}]);
  };

  const removeMember = (index: number) => {
    if (members.length <= hackathon.minTeamSize) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
    setMemberErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const nextTeamError = validateTeamName(teamName);
    const nextMemberErrors = members.map(validateMember);
    const emails = members.map((m) => m.email.trim().toLowerCase()).filter(Boolean);
    const emailCounts = emails.reduce<Record<string, number>>((acc, email) => {
      acc[email] = (acc[email] || 0) + 1;
      return acc;
    }, {});

    members.forEach((member, index) => {
      const email = member.email.trim().toLowerCase();
      if (email && emailCounts[email] > 1) {
        nextMemberErrors[index] = {
          ...nextMemberErrors[index],
          email: 'Each team member must use a unique email',
        };
      }
    });

    setTeamNameError(nextTeamError);
    setMemberErrors(nextMemberErrors);

    const nextTermsError = acceptedTerms
      ? ''
      : 'Open the Official Rules and Terms and click I agree to register.';
    setTermsError(nextTermsError);

    const hasMemberErrors = nextMemberErrors.some((errors) =>
      Object.values(errors).some(Boolean),
    );
    return !nextTeamError && !hasMemberErrors && !nextTermsError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    if (!validateForm()) {
      setStatus('error');
      setErrorMessage('Please fix the highlighted fields and try again.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/hackathon/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: teamName.trim(),
          ideaSummary: ideaSummary.trim(),
          acceptedTerms: true,
          members: members.map((member, index) => ({
            ...member,
            name: member.name.trim(),
            email: member.email.trim(),
            phone: member.phone.trim(),
            institution: member.institution.trim(),
            isLead: index === 0,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Registration failed. Please try again.');
        setSubmitting(false);
        return;
      }

      const params = new URLSearchParams({
        id: data.id,
        team: teamName.trim(),
      });
      router.push(`/hackathon/success?${params.toString()}`);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const detailItems = [
    { icon: MapPin, label: 'Location', value: hackathon.location },
    { icon: Calendar, label: 'Dates', value: hackathon.dates },
    { icon: Users, label: 'Team', value: hackathon.teamSize },
    { icon: Clock, label: 'Duration', value: hackathon.duration },
    { icon: MapPin, label: 'Venue', value: hackathon.venue },
    { icon: Trophy, label: 'Prize Pool', value: hackathon.prizePool },
  ];

  return (
    <div className="relative min-h-screen text-white transition-colors">
      <HackPageBackdrop />
      <div className="relative z-10">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="relative max-w-5xl mx-auto animate-fade-in">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-amber-300 mb-4">
            {hackathon.organizedBy}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
              {hackathon.title}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-4 leading-relaxed">
            {hackathon.tagline}
          </p>
          <p className="text-sm text-slate-400 mb-8 max-w-2xl">
            {hackathon.location} · {hackathon.dates} · Registration closes{' '}
            {hackathon.registrationCloses}
          </p>
          <div className="flex flex-wrap items-center gap-4 animate-slide-up">
            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all"
            >
              <Code2 className="w-5 h-5" />
              Register your team
            </a>
            <a
              href="#details"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 font-medium hover:bg-white/10 transition-colors"
            >
              View details
            </a>
          </div>
        </div>
      </section>

      {/* Key details */}
      <section id="details" className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400 mb-2">
                Event brief
              </p>
              <h2 className="text-3xl font-bold text-white">Hackathon Details</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              live / guwahati
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {detailItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-xl border border-white/15 bg-slate-950/40 backdrop-blur-sm p-5 transition-colors hover:border-amber-400/50 hover:bg-slate-950/55"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 opacity-80" />
                  <div className="flex items-center gap-2 text-amber-400 mb-2 pl-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                  </div>
                  <p className="text-white font-semibold pl-2">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <DetailBlock title="Eligibility" body={hackathon.eligibility} />
              <DetailBlock title="Format" body={hackathon.format} />
              <DetailBlock title="Event Category" body={hackathon.eventCategory} />
              <DetailBlock title="Development Objective" body={hackathon.developmentObjective} />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Mode of Conduct</h3>
                <ol className="space-y-2">
                  {hackathon.modeOfConduct.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-slate-300">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DetailBlock title="Certificates" body={hackathon.certificates} />
              <DetailBlock title="Goodies & Mentorship" body={hackathon.goodiesAndMentorship} />
              <DetailBlock title="Theme / Problem Statements" body={hackathon.theme} />
            </div>
          </div>
        </div>
      </section>

      {/* Build + prizes */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="relative max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">What You Can Build</h2>
            </div>
            <ul className="space-y-3">
              {hackathon.whatYouCanBuild.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Prize Details</h2>
            </div>
            <p className="text-slate-200 mb-4">
              Total Prize Pool: <strong className="text-amber-300">{hackathon.prizes.totalPool}</strong>
            </p>
            <ul className="space-y-2 mb-6">
              {hackathon.prizes.categories.map((category) => (
                <li key={category} className="flex items-center gap-2 text-slate-200">
                  <Award className="w-4 h-4 text-amber-400" />
                  {category}
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 text-sm text-slate-400">
              <Gift className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
              <p>{hackathon.goodiesAndMentorship}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Judging */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Judging Criteria</h2>
          <p className="text-slate-400 mb-8 max-w-3xl">{hackathon.finalEvaluation}</p>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <table className="w-full text-left">
              <thead className="bg-white/[0.06]">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold text-amber-300">Criteria</th>
                  <th className="px-5 py-3 text-sm font-semibold text-amber-300">Weightage</th>
                </tr>
              </thead>
              <tbody>
                {hackathon.judgingCriteria.map((row) => (
                  <tr key={row.criteria} className="border-t border-white/10">
                    <td className="px-5 py-3 text-slate-200">{row.criteria}</td>
                    <td className="px-5 py-3 font-semibold text-amber-300 font-mono">{row.weightage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section id="register" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400 mb-2">
              Join the build
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">Team Registration</h2>
            <p className="text-slate-300 mb-1">Teams of {hackathon.teamSize}.</p>
            <p className="text-sm text-slate-400">
              Registration closes {hackathon.registrationCloses}.
            </p>
          </div>

          {!registrationOpen && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl text-amber-200 text-center">
              Registration is currently closed.
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]"
          >
            <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Team Name *
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  if (teamNameError) setTeamNameError('');
                }}
                disabled={!registrationOpen}
                aria-invalid={Boolean(teamNameError)}
                className={inputClass(Boolean(teamNameError))}
                placeholder="Your team name"
              />
              {teamNameError ? (
                <p className="mt-1.5 text-sm text-red-400">{teamNameError}</p>
              ) : null}
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-white">Team Members</h3>
                <p className="text-sm text-slate-400">
                  {members.length}/{hackathon.maxTeamSize} members
                </p>
              </div>

              {members.map((member, index) => {
                const errors = memberErrors[index] || {};
                const canRemove = registrationOpen && members.length > hackathon.minTeamSize;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">
                        Member {index + 1}
                        {index === 0 ? (
                          <span className="ml-2 text-xs font-medium text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-full">
                            Team Lead
                          </span>
                        ) : null}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        disabled={!canRemove}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-red-400/30 text-red-300 hover:bg-red-500/10 disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Minus className="w-4 h-4" /> Remove
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Full Name *"
                        value={member.name}
                        onChange={(v) => updateMember(index, 'name', v)}
                        disabled={!registrationOpen}
                        placeholder="Full name"
                        error={errors.name}
                      />
                      <Field
                        label="Email *"
                        type="email"
                        value={member.email}
                        onChange={(v) => updateMember(index, 'email', v)}
                        disabled={!registrationOpen}
                        placeholder="you@example.com"
                        error={errors.email}
                      />
                      <Field
                        label="Phone *"
                        type="tel"
                        inputMode="numeric"
                        value={member.phone}
                        onChange={(v) => updateMember(index, 'phone', sanitizePhoneInput(v))}
                        disabled={!registrationOpen}
                        placeholder="+91 9876543210"
                        error={errors.phone}
                        maxLength={13}
                      />
                      <Field
                        label="College / Institution *"
                        value={member.institution}
                        onChange={(v) => updateMember(index, 'institution', v)}
                        disabled={!registrationOpen}
                        placeholder="Your college or organization"
                        error={errors.institution}
                      />
                      <SelectField
                        label="Participant type *"
                        value={member.eligibility}
                        onChange={(v) => updateMember(index, 'eligibility', v)}
                        disabled={!registrationOpen}
                        placeholder="Select participant type"
                        options={ELIGIBILITY_OPTIONS}
                        error={errors.eligibility}
                      />
                      <SelectField
                        label="Gender *"
                        value={member.gender}
                        onChange={(v) => updateMember(index, 'gender', v)}
                        disabled={!registrationOpen}
                        placeholder="Select gender"
                        options={GENDER_OPTIONS}
                        error={errors.gender}
                      />
                      <SelectField
                        label="T-shirt size *"
                        value={member.tshirtSize}
                        onChange={(v) => updateMember(index, 'tshirtSize', v)}
                        disabled={!registrationOpen}
                        placeholder="Select size"
                        options={TSHIRT_SIZE_OPTIONS}
                        error={errors.tshirtSize}
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addMember}
                disabled={!registrationOpen || members.length >= hackathon.maxTeamSize}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl border border-dashed border-amber-400/40 text-amber-300 hover:bg-amber-500/10 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" /> Add member
                {members.length >= hackathon.maxTeamSize
                  ? ` (max ${hackathon.maxTeamSize})`
                  : ''}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Idea summary (optional)
              </label>
              <textarea
                value={ideaSummary}
                onChange={(e) => setIdeaSummary(e.target.value)}
                rows={3}
                disabled={!registrationOpen}
                className="w-full px-4 py-3 border border-white/15 bg-slate-950/80 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Briefly share what you hope to build (problem statements come after the qualifier)."
              />
            </div>

            <div
              className={`rounded-xl border p-4 ${
                termsError
                  ? 'border-red-400/50 bg-red-500/10'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  disabled={!registrationOpen}
                  onChange={() => {
                    if (!registrationOpen) return;
                    if (acceptedTerms) {
                      setAcceptedTerms(false);
                      return;
                    }
                    setShowRulebook(true);
                  }}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer disabled:cursor-not-allowed"
                  aria-describedby="hackathon-terms-hint"
                />
                <div className="text-sm text-slate-300 leading-relaxed">
                  <p>
                    I have read and agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowRulebook(true)}
                      disabled={!registrationOpen}
                      className="font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200 disabled:opacity-50"
                    >
                      Official Rules and Terms
                    </button>{' '}
                    for {hackathon.title}. *
                  </p>
                  <p
                    id="hackathon-terms-hint"
                    className="mt-1.5 text-xs text-slate-500"
                  >
                    {acceptedTerms
                      ? 'Rules accepted. You can uncheck to withdraw agreement.'
                      : (
                        <>
                          Open the rules and click <span className="font-medium text-slate-300">I agree</span> to
                          enable this checkbox.
                        </>
                      )}
                  </p>
                </div>
              </div>
              {termsError ? (
                <p className="mt-2 text-sm text-red-400">{termsError}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting || !registrationOpen}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Registration
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {showRulebook ? (
        <RulebookModal
          onClose={() => setShowRulebook(false)}
          onAccept={() => {
            setAcceptedTerms(true);
            setTermsError('');
            setShowRulebook(false);
          }}
        />
      ) : null}

      <Footer />
      </div>
    </div>
  );
}

function HackPageBackdrop() {
  const matrixColumns = [
    { left: '3%', delay: '0s', duration: '11s', text: '01001101\n10110010\n11010101\n00101110\n11100011\n01011001' },
    { left: '11%', delay: '2.2s', duration: '14s', text: 'A9F3\n2C10\n7BE1\n44D0\n91AF\n0E62' },
    { left: '22%', delay: '4s', duration: '12s', text: 'fn()\n=> {}\nawait\nasync\nbuild\nship' },
    { left: '81%', delay: '1s', duration: '13s', text: '101010\n010101\n111000\n000111\n100110\n011001' },
    { left: '90%', delay: '3.5s', duration: '15s', text: 'hack()\npush()\npull()\nmerge\ndeploy\nlive' },
    { left: '96%', delay: '5.5s', duration: '10s', text: '0xFF\n0xA1\n0x3C\n0x90\n0x2B\n0xD4' },
  ];

  const eqBars = [40, 70, 35, 90, 55, 80, 45, 65, 30, 75, 50, 85];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_42%,_#020617_100%)]" />

      {/* Dual drifting grids — high visibility */}
      <div
        className="absolute inset-0 opacity-50 hack-grid-drift"
        style={{
          backgroundImage:
            'linear-gradient(rgba(251,146,60,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute inset-0 opacity-30 hack-grid-drift-alt"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Soft washes */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-500/25 blur-3xl hack-float-x" />
      <div className="absolute right-[-4rem] top-1/3 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl hack-float-slow" />
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl hack-drift-diag" />

      {/* Matrix / binary rain */}
      {matrixColumns.map((col) => (
        <pre
          key={col.left}
          className="hack-matrix absolute top-0 font-mono text-[11px] sm:text-xs leading-5 text-amber-300/70 whitespace-pre"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          {col.text}
        </pre>
      ))}

      {/* Network graph with traveling data packets */}
      <svg
        className="absolute left-1/2 top-1/2 h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 opacity-80"
        viewBox="0 0 720 720"
        fill="none"
      >
        <path
          className="hack-dash"
          d="M80 360 C180 220, 300 220, 360 360 C420 500, 540 500, 640 360"
          stroke="rgba(251,146,60,0.65)"
          strokeWidth="2"
        />
        <path
          className="hack-dash-slow"
          d="M120 180 H360 V540 H600"
          stroke="rgba(56,189,248,0.55)"
          strokeWidth="2"
        />
        <path
          className="hack-dash"
          d="M160 520 C280 420, 440 420, 560 200"
          stroke="rgba(251,146,60,0.5)"
          strokeWidth="1.8"
        />

        {[
          [80, 360],
          [360, 360],
          [640, 360],
          [120, 180],
          [360, 180],
          [360, 540],
          [600, 540],
          [560, 200],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="6"
            fill={i % 2 === 0 ? 'rgb(251 146 60)' : 'rgb(56 189 248)'}
            className="hack-pulse"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}

        {/* SVG animateMotion packets — works without offset-path */}
        <circle r="5" fill="#fbbf24">
          <animateMotion
            dur="5.5s"
            repeatCount="indefinite"
            path="M80 360 C180 220, 300 220, 360 360 C420 500, 540 500, 640 360"
          />
        </circle>
        <circle r="4.5" fill="#38bdf8">
          <animateMotion
            dur="6.5s"
            repeatCount="indefinite"
            begin="1s"
            path="M120 180 H360 V540 H600"
          />
        </circle>
        <circle r="4.5" fill="#fb923c">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            begin="2s"
            path="M160 520 C280 420, 440 420, 560 200"
          />
        </circle>
      </svg>

      {/* Radar / sonar rings */}
      <div className="absolute right-[8%] top-[18%] h-44 w-44">
        <span className="absolute inset-0 rounded-full border-2 border-amber-400/70 hack-radar" />
        <span className="absolute inset-0 rounded-full border-2 border-amber-400/50 hack-radar" style={{ animationDelay: '1.1s' }} />
        <span className="absolute inset-0 rounded-full border border-sky-400/40 hack-radar" style={{ animationDelay: '2.2s' }} />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 hack-pulse" />
      </div>
      <div className="absolute left-[6%] bottom-[22%] h-36 w-36">
        <span className="absolute inset-0 rounded-full border-2 border-sky-400/60 hack-radar" />
        <span className="absolute inset-0 rounded-full border border-sky-400/40 hack-radar" style={{ animationDelay: '1.4s' }} />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 hack-pulse" />
      </div>

      {/* Spinning hex frame */}
      <svg
        className="absolute left-[4%] top-[42%] h-40 w-40 opacity-60 hack-hex-spin"
        viewBox="0 0 100 100"
        fill="none"
      >
        <polygon
          points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
          stroke="rgb(251 146 60)"
          strokeWidth="2"
        />
        <polygon
          points="50,22 74,36 74,64 50,78 26,64 26,36"
          stroke="rgb(56 189 248)"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
      </svg>

      {/* Mini terminal windows */}
      <div className="absolute left-[5%] top-[14%] hidden md:block w-[210px] rounded-lg border border-amber-400/30 bg-slate-950/80 backdrop-blur-sm overflow-hidden opacity-90 hack-float">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/10 bg-white/[0.03]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[9px] text-slate-400">build.sh</span>
        </div>
        <div className="px-3 py-2 font-mono text-[10px] text-amber-200/90 space-y-1">
          <p>
            <span className="text-emerald-400">$</span>{' '}
            <span className="hack-type inline-block align-bottom">npm run hackathon</span>
            <span className="hack-blink text-amber-300">▋</span>
          </p>
          <p className="text-sky-300/80">compiling prototype...</p>
          <p className="text-emerald-300/80">ready on :2026</p>
        </div>
      </div>

      <div className="absolute right-[4%] bottom-[16%] hidden md:block w-[230px] rounded-lg border border-sky-400/30 bg-slate-950/80 backdrop-blur-sm overflow-hidden opacity-90 hack-float-delayed">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/10 bg-white/[0.03]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[9px] text-slate-400">telemetry.log</span>
        </div>
        <div className="px-3 py-2 font-mono text-[10px] space-y-1">
          <p className="text-slate-300">latency <span className="text-amber-300">12ms</span></p>
          <p className="text-slate-300">nodes <span className="text-sky-300">online</span></p>
          <p className="text-slate-300">
            stream <span className="hack-blink text-emerald-300">●</span> live
          </p>
        </div>
      </div>

      {/* Equalizer bars */}
      <div className="absolute right-[7%] top-[46%] hidden lg:flex h-16 items-end gap-1 opacity-80">
        {eqBars.map((h, i) => (
          <span
            key={i}
            className="hack-bar w-1.5 rounded-sm bg-gradient-to-t from-amber-500 to-sky-400"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Scan beams */}
      <div className="absolute inset-y-0 left-0 w-28 hack-scan-x bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-20 hack-scan-x-delayed bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 hack-scan bg-gradient-to-b from-amber-400/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 hack-scan-delayed bg-gradient-to-b from-sky-400/15 to-transparent" />

      {/* Floating code fragments */}
      <div className="absolute inset-0 overflow-hidden font-mono text-[11px] sm:text-sm select-none">
        <span className="hack-float absolute left-[28%] top-[20%] text-amber-200/60">
          {'const build = () => innovate();'}
        </span>
        <span className="hack-float-delayed absolute right-[22%] top-[30%] text-sky-200/55">
          {'while (idea) { ship(); }'}
        </span>
        <span className="hack-float-slow absolute left-[30%] top-[70%] text-amber-100/50">
          {'git commit -m "prototype"'}
        </span>
        <span className="hack-float-x absolute right-[26%] top-[68%] text-orange-200/50">
          {'{ status: "building" }'}
        </span>
      </div>
    </div>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  disabled,
  error,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  disabled?: boolean;
  error?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-200 mb-1.5">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={inputClass(Boolean(error))}
      />
      {error ? <p className="mt-1.5 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly string[];
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-200 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={inputClass(Boolean(error))}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

function RulebookModal({
  onClose,
  onAccept,
}: {
  onClose: () => void;
  onAccept: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hackathon-rulebook-title"
    >
      <button
        type="button"
        aria-label="Close rulebook"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              {HACKATHON_RULEBOOK_SUBTITLE}
            </p>
            <h2
              id="hackathon-rulebook-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
            >
              {HACKATHON_RULEBOOK_TITLE}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {HACKATHON_RULEBOOK_SECTIONS.map((section) => (
            <RulebookSection key={section.id} section={section} />
          ))}
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-900 dark:text-amber-100">
            <p className="font-semibold mb-1">Questions?</p>
            <p>
              Email{' '}
              <a
                href={`mailto:${HACKATHON_RULEBOOK_CONTACT.email}`}
                className="underline underline-offset-2"
              >
                {HACKATHON_RULEBOOK_CONTACT.email}
              </a>{' '}
              or call {HACKATHON_RULEBOOK_CONTACT.phone}.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 px-5 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          <button
            type="button"
            onClick={onClose}
            className="sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-white dark:hover:bg-gray-800"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="sm:flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg"
          >
            I agree
          </button>
        </div>
      </div>
    </div>
  );
}

function RulebookSection({ section }: { section: HackathonRuleSection }) {
  return (
    <section>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
        {section.title}
      </h3>

      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph}
          className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2"
        >
          {paragraph}
        </p>
      ))}

      {section.subsections?.map((subsection) => (
        <div key={subsection.title} className="mt-3 mb-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            {subsection.title}
          </h4>
          {subsection.paragraphs?.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2"
            >
              {paragraph}
            </p>
          ))}
          {subsection.bullets ? <BulletList items={subsection.bullets} /> : null}
        </div>
      ))}

      {section.bullets ? <BulletList items={section.bullets} /> : null}

      {section.table ? (
        <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                {section.table.headers.map((header) => (
                  <th key={header} className="px-3 py-2 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr
                  key={row.join('-')}
                  className="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${row[0]}-${cellIndex}`}
                      className={`px-3 py-2 ${cellIndex === 0 ? 'font-medium text-gray-900 dark:text-white' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.note ? (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">{section.note}</p>
      ) : null}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
