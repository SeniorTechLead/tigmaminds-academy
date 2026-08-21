'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  Loader2,
  Minus,
  Plus,
  Send,
  X,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import hackathon from '../data/hackathon.json';
import type { HackathonMember } from '../data/hackathon-types';
import { isHackathonRegistrationOpen } from '../data/hackathon-utils';
import { HackathonEventDetails, HackathonHero, HackPageBackdrop } from './hackathon-shared';
import {
  HACKATHON_RULEBOOK_CONTACT,
  HACKATHON_RULEBOOK_SECTIONS,
  HACKATHON_RULEBOOK_SUBTITLE,
  HACKATHON_RULEBOOK_TITLE,
  type HackathonRuleSection,
} from '../data/hackathon-rulebook';

import {
  HACKATHON_ELIGIBILITY_OPTIONS,
  HACKATHON_ELIGIBILITY_OTHER,
  HACKATHON_INSTITUTION_OTHER,
  HACKATHON_INSTITUTIONS,
} from '../data/hackathon-institutions';

const ELIGIBILITY_OPTIONS = HACKATHON_ELIGIBILITY_OPTIONS;

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

const TSHIRT_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;

type MemberForm = Omit<HackathonMember, 'isLead' | 'institution' | 'eligibility'> & {
  isLead?: boolean;
  institutionOption: string;
  institutionOther: string;
  eligibilityOption: string;
  eligibilityOther: string;
};

type MemberErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'institution' | 'eligibility' | 'gender' | 'tshirtSize', string>
>;

function emptyMember(): MemberForm {
  return {
    name: '',
    email: '',
    phone: '',
    institutionOption: '',
    institutionOther: '',
    eligibilityOption: '',
    eligibilityOther: '',
    gender: '',
    tshirtSize: '',
  };
}

function resolveInstitution(member: MemberForm) {
  if (member.institutionOption === HACKATHON_INSTITUTION_OTHER) {
    return member.institutionOther.trim();
  }
  return member.institutionOption.trim();
}

function resolveEligibility(member: MemberForm) {
  if (member.eligibilityOption === HACKATHON_ELIGIBILITY_OTHER) {
    return member.eligibilityOther.trim();
  }
  return member.eligibilityOption.trim();
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
  const institution = resolveInstitution(member);

  if (!name) errors.name = 'Full name is required';
  else if (name.length < 2) errors.name = 'Enter a valid full name';

  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';

  if (!phone) errors.phone = 'Phone number is required';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';

  if (!member.institutionOption) errors.institution = 'Select college / institution';
  else if (member.institutionOption === HACKATHON_INSTITUTION_OTHER && !institution) {
    errors.institution = 'Enter your college / institution name';
  } else if (institution.length < 2) {
    errors.institution = 'Enter a valid institution name';
  }

  const eligibility = resolveEligibility(member);
  if (!member.eligibilityOption) errors.eligibility = 'Select participant type';
  else if (member.eligibilityOption === HACKATHON_ELIGIBILITY_OTHER && !eligibility) {
    errors.eligibility = 'Enter your participant type';
  } else if (eligibility.length < 2) {
    errors.eligibility = 'Enter a valid participant type';
  }

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
    if (
      field === 'name' ||
      field === 'email' ||
      field === 'phone' ||
      field === 'institutionOption' ||
      field === 'institutionOther' ||
      field === 'eligibilityOption' ||
      field === 'eligibilityOther' ||
      field === 'gender' ||
      field === 'tshirtSize'
    ) {
      clearMemberFieldError(
        index,
        field === 'institutionOption' || field === 'institutionOther'
          ? 'institution'
          : field === 'eligibilityOption' || field === 'eligibilityOther'
            ? 'eligibility'
            : field,
      );
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
            name: member.name.trim(),
            email: member.email.trim(),
            phone: member.phone.trim(),
            institution: resolveInstitution(member),
            eligibility: resolveEligibility(member),
            gender: member.gender,
            tshirtSize: member.tshirtSize,
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

  return (
    <div className="relative min-h-screen text-white transition-colors">
      <HackPageBackdrop />
      <div className="relative z-10">
      <Header />

      <HackathonHero
        actions={
          <>
            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all"
            >
              <Code2 className="w-5 h-5" />
              Register Your Team
            </a>
            <a
              href="#details"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 font-medium hover:bg-white/10 transition-colors"
            >
              View Details
            </a>
            <a
              href="/hackathon/qualify#qualifying"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-100 font-medium hover:bg-amber-500/20 transition-colors"
            >
              Qualifying Rounds
            </a>
          </>
        }
      />

      <HackathonEventDetails />

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
            <p className="text-sm text-slate-400 mt-3">
              Already registered?{' '}
              <a href="/hackathon/qualify#qualifying" className="text-amber-300 hover:text-amber-200 font-medium">
                Go to qualifying
              </a>
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
                      <div className="sm:col-span-2 space-y-3">
                        <SelectField
                          label="College / Institution *"
                          value={member.institutionOption}
                          onChange={(v) => {
                            setMembers((prev) =>
                              prev.map((m, i) =>
                                i === index
                                  ? {
                                      ...m,
                                      institutionOption: v,
                                      institutionOther:
                                        v === HACKATHON_INSTITUTION_OTHER ? m.institutionOther : '',
                                    }
                                  : m,
                              ),
                            );
                            clearMemberFieldError(index, 'institution');
                          }}
                          disabled={!registrationOpen}
                          placeholder="Select college / institution"
                          options={HACKATHON_INSTITUTIONS}
                          error={
                            member.institutionOption === HACKATHON_INSTITUTION_OTHER
                              ? undefined
                              : errors.institution
                          }
                        />
                        {member.institutionOption === HACKATHON_INSTITUTION_OTHER ? (
                          <Field
                            label="Enter college / institution *"
                            value={member.institutionOther}
                            onChange={(v) => updateMember(index, 'institutionOther', v)}
                            disabled={!registrationOpen}
                            placeholder="Type your college or organization name"
                            error={errors.institution}
                          />
                        ) : null}
                      </div>
                      <div className="space-y-3">
                        <SelectField
                          label="Participant type *"
                          value={member.eligibilityOption}
                          onChange={(v) => {
                            setMembers((prev) =>
                              prev.map((m, i) =>
                                i === index
                                  ? {
                                      ...m,
                                      eligibilityOption: v,
                                      eligibilityOther:
                                        v === HACKATHON_ELIGIBILITY_OTHER ? m.eligibilityOther : '',
                                    }
                                  : m,
                              ),
                            );
                            clearMemberFieldError(index, 'eligibility');
                          }}
                          disabled={!registrationOpen}
                          placeholder="Select participant type"
                          options={ELIGIBILITY_OPTIONS}
                          error={
                            member.eligibilityOption === HACKATHON_ELIGIBILITY_OTHER
                              ? undefined
                              : errors.eligibility
                          }
                        />
                        {member.eligibilityOption === HACKATHON_ELIGIBILITY_OTHER ? (
                          <Field
                            label="Enter participant type *"
                            value={member.eligibilityOther}
                            onChange={(v) => updateMember(index, 'eligibilityOther', v)}
                            disabled={!registrationOpen}
                            placeholder="e.g. Working professional, Faculty"
                            error={errors.eligibility}
                          />
                        ) : null}
                      </div>
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

      <Footer contactEmail="hackathon@tigmaminds.com" />
      </div>
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
