'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Loader2,
  Sparkles,
  User,
  Mail,
  Phone,
  Building2,
  HelpCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Lock,
  Copy,
  Check,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export interface WinterTrainingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
}

export type FormField = keyof WinterTrainingFormData;
export type FormErrors = Partial<Record<FormField, string>>;

export interface PaymentSuccessData {
  registrationId: string;
  orderId: string;
  paymentId: string;
  signature: string;
  amount?: string | number;
  currency?: string;
  status?: string;
}

const INITIAL_FORM: WinterTrainingFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  organization: '',
};

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.error) && obj.error.length > 0) {
      const first = obj.error[0];
      if (typeof first === 'string') return first;
      if (
        first &&
        typeof first === 'object' &&
        typeof (first as Record<string, unknown>).message === 'string'
      ) {
        return (first as Record<string, unknown>).message as string;
      }
    }
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.application_error === 'string') return obj.application_error;
    if (typeof obj.error === 'string') return obj.error;
  }
  return fallback;
}

function validateField(field: FormField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case 'firstName':
      if (!v) return 'First name is required.';
      if (v.length < 2) return 'First name must be at least 2 characters.';
      if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'First name should only contain letters.';
      return undefined;

    case 'lastName':
      if (!v) return 'Last name is required.';
      if (v.length < 1) return 'Last name is required.';
      if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'Last name should only contain letters.';
      return undefined;

    case 'email':
      if (!v) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return 'Please enter a valid email address (e.g. name@example.com).';
      }
      return undefined;

    case 'phone': {
      if (!v) return 'Phone / WhatsApp number is required.';
      const digits = v.replace(/\D/g, '');
      if (digits.length === 0) return 'Please enter a valid 10-digit mobile number.';
      if (digits.length !== 10) return 'Phone number must be exactly 10 digits.';
      if (!/^[1-9][0-9]{9}$/.test(digits)) {
        return 'Enter a valid 10-digit mobile number starting with 1-9.';
      }
      return undefined;
    }

    case 'organization':
      if (!v) return 'College or company name is required.';
      if (v.length < 2) return 'Please enter at least 2 characters.';
      return undefined;

    default:
      return undefined;
  }
}

function validateAll(data: WinterTrainingFormData): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(data) as FormField[]).forEach((field) => {
    const err = validateField(field, data[field]);
    if (err) errors[field] = err;
  });
  return errors;
}

const ENVOY_BASE_URL = 'https://development.xorai.com/hackathone';

export default function WinterTrainingRegistrationForm() {
  const [form, setForm] = useState<WinterTrainingFormData>(() => {
    if (typeof window === 'undefined') return INITIAL_FORM;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const studentName = params.get('name') || '';
        const email = params.get('email') || '';
        const parts = studentName.split(' ');
        return {
          ...INITIAL_FORM,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
          email: email || '',
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_FORM;
  });

  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  // Loading & stage tracking
  const [submitting, setSubmitting] = useState(false);
  const [processStage, setProcessStage] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Anti-bot security traps
  const [honeypot, setHoneypot] = useState('');

  // Completion state
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccessData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const txnid = params.get('txnid') || '';
        return {
          registrationId: params.get('regId') || 'CONFIRMED',
          orderId: txnid,
          paymentId: params.get('mihpayid') || txnid || 'PAYU-VERIFIED',
          signature: 'SHA-512 PayU Verified',
          amount: params.get('amount') || '499.00',
          currency: 'INR',
          status: 'success',
        };
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Check URL query parameters for PayU callback response
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');

      if (paymentStatus === 'success') {
        const txnid = params.get('txnid') || '';
        const regId = params.get('regId') || 'CONFIRMED';
        const mihpayid = params.get('mihpayid') || txnid || 'PAYU-VERIFIED';
        const amount = params.get('amount') || '499.00';
        const studentName = params.get('name') || '';
        const email = params.get('email') || '';

        setPaymentSuccess({
          registrationId: regId,
          orderId: txnid,
          paymentId: mihpayid,
          signature: 'SHA-512 PayU Verified',
          amount,
          currency: 'INR',
          status: 'success',
        });

        if (studentName) {
          const parts = studentName.split(' ');
          setForm((prev) => ({
            ...prev,
            firstName: parts[0] || prev.firstName,
            lastName: parts.slice(1).join(' ') || prev.lastName,
            email: email || prev.email,
          }));
        }
      } else if (paymentStatus === 'failed') {
        const reason =
          params.get('reason') ||
          'Your payment was cancelled or could not be completed. Please try again.';
        setSubmitError(reason);

        // Instant scroll to error on form without smooth animation
        setTimeout(() => {
          const el = document.getElementById('register');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, 50);
      }
    } catch (e) {
      console.warn('[WinterTraining] Error reading callback search params:', e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as FormField;

    // For phone: restrict strictly to numbers and max 10 digits
    const cleanValue =
      field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;

    setForm((prev) => ({ ...prev, [field]: cleanValue }));

    if (touched[field] || fieldErrors[field]) {
      const error = validateField(field, cleanValue);
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all as touched
    const allTouched: Record<FormField, boolean> = {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      organization: true,
    };
    setTouched(allTouched);

    const errors = validateAll(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError('Please fix the highlighted fields before submitting.');
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      // Step 1: Call xorai registration API
      setProcessStage('Registering your profile with xorai...');

      const cleanPhone = form.phone.replace(/\D/g, '').slice(0, 10);
      const regPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: cleanPhone,
        email: form.email.trim(),
        institution: form.organization.trim(),
      };

      const regRes = await fetch(`${ENVOY_BASE_URL}/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regPayload),
      });

      const regData = await regRes.json().catch(() => ({}));

      if (!regRes.ok) {
        const errorMsg = extractErrorMessage(
          regData,
          'Registration failed in xorai. Please check your details.'
        );
        throw new Error(errorMsg);
      }

      const receivedRegId =
        regData.registrationId || regData.registration_id || regData.id;

      if (!receivedRegId) {
        throw new Error('Registration succeeded in xorai, but no registrationId was returned.');
      }

      // Step 2: Call backend PayU initiation API with the xorai registrationId
      setProcessStage('Preparing secure PayU payment order...');

      const payRes = await fetch('/api/winter-training/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: receivedRegId,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: cleanPhone,
          organization: form.organization.trim(),
          honeypot,
        }),
      });

      const payData = await payRes.json().catch(() => ({}));

      if (!payRes.ok) {
        const errorMsg = extractErrorMessage(
          payData,
          'PayU payment preparation failed. Please try again.'
        );
        throw new Error(errorMsg);
      }

      // Step 3: Redirect to PayU gateway
      setProcessStage('Redirecting to PayU Secure Gateway...');

      const payuForm = document.createElement('form');
      payuForm.method = 'POST';
      payuForm.action = payData.payu_base_url || 'https://test.payu.in/_payment';
      payuForm.style.display = 'none';

      const paramsObj = (payData.params || {}) as Record<string, string>;
      Object.entries(paramsObj).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v ? String(v) : '';
        payuForm.appendChild(input);
      });

      document.body.appendChild(payuForm);
      payuForm.submit();
    } catch (err: unknown) {
      console.error('[RegistrationFlow] Error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during registration. Please try again.';
      setSubmitError(msg);
      setSubmitting(false);
      setProcessStage('');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const getInputStyle = (field: FormField) => {
    const hasError = touched[field] && !!fieldErrors[field];
    return hasError
      ? 'border-red-400 dark:border-red-500/80 focus:ring-2 focus:ring-red-400/50 focus:border-red-500'
      : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent';
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Success Confirmation View
  // ────────────────────────────────────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div id="registration-confirmation" className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-gray-900 dark:to-gray-900 border-2 border-emerald-400/80 dark:border-emerald-600/80 rounded-3xl p-8 sm:p-12 text-center shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

        <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          PayU Payment Verified &middot; Enrollment Complete
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          Welcome to the Cohort, {form.firstName || 'Student'}!
        </h3>

        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
          Your payment and registration for the{' '}
          <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
            Winter Training: Python, FastAPI &amp; LLM Apps
          </strong>{' '}
          have been successfully recorded and verified. An onboarding email with your syllabus and lab setup guide has been queued for{' '}
          <span className="font-semibold text-gray-900 dark:text-white underline">
            {form.email || 'your email'}
          </span>.
        </p>

        {/* Verification Summary Card */}
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800/90 rounded-2xl p-6 border border-emerald-200/80 dark:border-emerald-800/60 text-left mb-8 shadow-sm text-xs sm:text-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Registration ID:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {paymentSuccess.registrationId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(paymentSuccess.registrationId, 'regId')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Copy Registration ID"
              >
                {copiedKey === 'regId' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">PayU Payment Ref:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                {paymentSuccess.paymentId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(paymentSuccess.paymentId, 'payId')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Copy Payment ID"
              >
                {copiedKey === 'payId' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
            <span className="font-mono text-gray-600 dark:text-gray-400">
              {paymentSuccess.orderId}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Amount Paid:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ₹{paymentSuccess.amount || '499.00'}
            </span>
          </div>

          {form.firstName && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Student Name:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {form.firstName} {form.lastName}
              </span>
            </div>
          )}

          {form.organization && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Institution:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {form.organization}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-gray-100 dark:border-gray-700 gap-1 text-left">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Office Location:
            </span>
            <span className="font-medium text-xs sm:text-right text-gray-800 dark:text-gray-200">
              TigmaMinds Pvt Ltd, 4th Floor, Prithvi Centre, GS Rd, South Sarania, Lachit Nagar, Guwahati, Assam 781007
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Seat Confirmed &amp; Active
            </span>
          </div>
        </div>

        {/* Seat Confirmation Deduction Guarantee */}
        <div className="max-w-lg mx-auto bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 mb-8 text-center leading-relaxed">
          ✨ <strong>Seat Confirmation Guarantee:</strong> Your ₹{paymentSuccess.amount || '499.00'} registration fee has been locked in and will be <strong>100% deducted from the final ₹4,999 program fee</strong> when the cohort commences, with your early bird discount applied.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Anti-bot Honeypot trap: invisible to humans, catches automated bots */}
        <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
          <input
            type="text"
            name="contact_website_url"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

          <a
            href="#curriculum"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <span>Explore Cohort Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/programs/winter-training#register';
              }
            }}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 underline font-medium cursor-pointer"
          >
            Register another applicant
          </button>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Form View
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-gray-800/90 rounded-3xl border border-gray-200 dark:border-gray-700/80 shadow-2xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-sm">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Winter Cohort Enrollment
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Reserve Your Spot &amp; Enroll
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
          Full Program Fee: <strong>₹4,999</strong> (Early bird applicants receive priority discounts). Confirm your registration today with a <strong>₹499</strong> seat reservation — this amount will be <strong>100% deducted from your final program fee</strong> when the cohort begins.
        </p>

        {/* Office Location Badge */}
        <div className="mt-3.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Office Location:</span> TigmaMinds Pvt Ltd, 4th Floor, Prithvi Centre, GS Rd, South Sarania, Lachit Nagar, Guwahati, Assam 781007
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-300 flex items-start gap-3 animate-fade-in">
          <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold block mb-0.5">Notice</span>
            <span className="text-xs sm:text-sm">{submitError}</span>
          </div>
        </div>
      )}

      {/* Progress Stage Pill when submitting */}
      {submitting && processStage && (
        <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center gap-3 animate-fade-in">
          <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="font-medium">{processStage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              First Name <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="firstName"
                required
                disabled={submitting}
                value={form.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                placeholder="Ada"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white outline-none transition disabled:opacity-60 ${getInputStyle(
                  'firstName'
                )}`}
              />
            </div>
            {touched.firstName && fieldErrors.firstName && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.firstName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Last Name <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="lastName"
                required
                disabled={submitting}
                value={form.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur('lastName')}
                placeholder="Lovelace"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white outline-none transition disabled:opacity-60 ${getInputStyle(
                  'lastName'
                )}`}
              />
            </div>
            {touched.lastName && fieldErrors.lastName && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.lastName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Email Address & Phone / WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                disabled={submitting}
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="ada@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white outline-none transition disabled:opacity-60 ${getInputStyle(
                  'email'
                )}`}
              />
            </div>
            {touched.email && fieldErrors.email && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Phone / WhatsApp <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                inputMode="numeric"
                name="phone"
                maxLength={10}
                required
                disabled={submitting}
                value={form.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder="9876543210"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white outline-none transition disabled:opacity-60 ${getInputStyle(
                  'phone'
                )}`}
              />
            </div>
            {touched.phone && fieldErrors.phone ? (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.phone}</span>
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                Enter 10-digit mobile number without country code (e.g. 9876543210)
              </p>
            )}
          </div>
        </div>

        {/* College or Company Name (Required) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            College or Company Name <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              name="organization"
              required
              disabled={submitting}
              value={form.organization}
              onChange={handleChange}
              onBlur={() => handleBlur('organization')}
              placeholder="e.g. University / Company name"
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white outline-none transition disabled:opacity-60 ${getInputStyle(
                'organization'
              )}`}
            />
          </div>
          {touched.organization && fieldErrors.organization && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{fieldErrors.organization}</span>
            </p>
          )}
        </div>

        {/* Security & Payment Protection Note */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/80 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>256-bit SSL encrypted &middot; Powered by PayU</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-gray-400">
            <CreditCard className="w-3.5 h-3.5" />
            UPI / Cards / NetBanking
          </div>
        </div>

        {/* Anti-bot Honeypot trap: invisible to humans, catches automated bots */}
        <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
          <input
            type="text"
            name="contact_website_url"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting to PayU Gateway...</span>
            </>
          ) : (
            <>
              <span>Confirm Seat &amp; Pay ₹499 &rarr;</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
