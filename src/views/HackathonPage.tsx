'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import hackathon from '../data/hackathon.json';
import type { HackathonMember } from '../data/hackathon-types';
import { isHackathonRegistrationOpen } from '../data/hackathon-utils';

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
  `w-full px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
    hasError
      ? 'border-red-400 dark:border-red-500'
      : 'border-gray-300 dark:border-gray-600'
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

    const hasMemberErrors = nextMemberErrors.some((errors) =>
      Object.values(errors).some(Boolean),
    );
    return !nextTeamError && !hasMemberErrors;
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-wide uppercase text-amber-700 dark:text-amber-300 mb-3">
            {hackathon.organizedBy}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {hackathon.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
            {hackathon.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              <MapPin className="w-4 h-4 text-amber-600" />
              {hackathon.location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              <Calendar className="w-4 h-4 text-amber-600" />
              {hackathon.dates}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              Registration closes {hackathon.registrationCloses}
            </span>
          </div>
          <div className="mt-8">
            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Register your team
            </a>
          </div>
        </div>
      </section>

      {/* Key details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hackathon Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {detailItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5"
                >
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{item.value}</p>
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Mode of Conduct</h3>
                <ol className="space-y-2">
                  {hackathon.modeOfConduct.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/40 dark:from-gray-900 dark:to-gray-800/40">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What You Can Build</h2>
            </div>
            <ul className="space-y-3">
              {hackathon.whatYouCanBuild.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prize Details</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Total Prize Pool: <strong>{hackathon.prizes.totalPool}</strong>
            </p>
            <ul className="space-y-2 mb-6">
              {hackathon.prizes.categories.map((category) => (
                <li key={category} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Award className="w-4 h-4 text-amber-500" />
                  {category}
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Gift className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <p>{hackathon.goodiesAndMentorship}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Judging */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Judging Criteria</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">{hackathon.finalEvaluation}</p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-amber-50 dark:bg-gray-800">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">Criteria</th>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">Weightage</th>
                </tr>
              </thead>
              <tbody>
                {hackathon.judgingCriteria.map((row) => (
                  <tr key={row.criteria} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{row.criteria}</td>
                    <td className="px-5 py-3 font-semibold text-amber-700 dark:text-amber-300">{row.weightage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section id="register" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Team Registration
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
            Teams of {hackathon.teamSize}.
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            Registration closes {hackathon.registrationCloses}.
          </p>

          {!registrationOpen && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-center">
              Registration is currently closed.
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
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
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{teamNameError}</p>
              ) : null}
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Members</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {members.length}/{hackathon.maxTeamSize} members
                </p>
              </div>

              {members.map((member, index) => {
                const errors = memberErrors[index] || {};
                const canRemove = registrationOpen && members.length > hackathon.minTeamSize;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 dark:border-gray-600 p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Member {index + 1}
                        {index === 0 ? (
                          <span className="ml-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                            Team Lead
                          </span>
                        ) : null}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        disabled={!canRemove}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 disabled:hover:bg-transparent"
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
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl border border-dashed border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" /> Add member
                {members.length >= hackathon.maxTeamSize
                  ? ` (max ${hackathon.maxTeamSize})`
                  : ''}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Idea summary (optional)
              </label>
              <textarea
                value={ideaSummary}
                onChange={(e) => setIdeaSummary(e.target.value)}
                rows={3}
                disabled={!registrationOpen}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Briefly share what you hope to build (problem statements come after the qualifier)."
              />
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

      <Footer />
    </div>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{body}</p>
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
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
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
      {error ? <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
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
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
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
      {error ? <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
