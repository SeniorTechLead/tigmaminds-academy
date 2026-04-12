import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'resend'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { user, profile, hasRole, signIn, signUp, signInWithGoogle } = useAuth();
  const [googleRedirecting, setGoogleRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitReturnTo = searchParams?.get('returnTo');
  const verified = searchParams?.get('verified');
  const urlError = searchParams?.get('error');

  // Show messages from redirect query params
  useEffect(() => {
    if (verified === 'true') setSuccess('Email verified! You can now log in.');
    if (urlError === 'invalid_link') setError('Invalid verification link.');
    if (urlError === 'invalid_or_expired_token') setError('This link is invalid or has already been used.');
    if (urlError === 'token_expired') setError('This link has expired. Please request a new one.');
  }, [verified, urlError]);

  // If user is already signed in, route based on role or explicit returnTo
  useEffect(() => {
    if (!user) return;
    if (explicitReturnTo) {
      router.push(explicitReturnTo, { replace: true });
      return;
    }
    // Role-based default routing (priority order)
    if (hasRole('admin') || hasRole('teacher')) {
      router.push('/program/mentor', { replace: true });
    } else if (hasRole('parent')) {
      router.push('/program/guardian', { replace: true });
    } else {
      router.push('/lessons', { replace: true });
    }
  }, [user, profile, router, explicitReturnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      }
      // Navigation handled by useEffect watching `user` — wait for auth state to propagate
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (!email.trim()) { setError('Enter your email address first.'); setLoading(false); return; }
    try {
      const res = await fetch('/api/auth/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send reset email.'); }
      else { setSuccess(`If an account exists for ${email}, a password reset link has been sent. Check your inbox.`); }
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (!email.trim()) { setError('Enter your email address first.'); setLoading(false); return; }
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send email.'); }
      else if (data.action === 'reset_sent') { setSuccess(`We found your account. A password setup link has been sent to ${email}. Check your inbox.`); }
      else { setSuccess(`Verification email sent to ${email}. Check your inbox (and spam folder).`); }
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-xl">TMA</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join TigmaMinds Academy' : mode === 'forgot' ? 'Reset Password' : 'Resend Confirmation'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {mode === 'login'
                ? 'Sign in to track your progress and earn certificates.'
                : mode === 'signup'
                ? 'Create an account to save your progress across devices.'
                : mode === 'forgot'
                ? 'We\'ll email you a link to reset your password.'
                : 'We\'ll send you a link to set up or reset your password.'}
            </p>
          </div>

          {/* Tab toggle — hide for forgot/resend */}
          {(mode === 'login' || mode === 'signup') && (
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Sign Up
            </button>
          </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
              {success}
            </div>
          )}

          {/* Google OAuth — hide for forgot/resend */}
          {(mode === 'login' || mode === 'signup') && <button
            type="button"
            onClick={() => { setGoogleRedirecting(true); signInWithGoogle(); }}
            disabled={googleRedirecting}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm mb-4 disabled:opacity-60"
          >
            {googleRedirecting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to Google...</>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>}

          {/* Divider */}
          {(mode === 'login' || mode === 'signup') && <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>}

          {/* Forgot password form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter your email and we'll send a password reset link.</p>
              <div className="mb-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Back to login</button>
              </p>
            </form>
          )}

          {/* Resend confirmation form */}
          {mode === 'resend' && (
            <form onSubmit={handleResendConfirmation} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Can't log in? Enter your email and we'll send a link to set up or reset your password.</p>
              <div className="mb-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Login Link'}
              </button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Back to login</button>
              </p>
            </form>
          )}

          {/* Main login/signup form */}
          {(mode === 'login' || mode === 'signup') && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {mode === 'signup' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Log In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Help links — only on login */}
            {mode === 'login' && (
              <div className="flex items-center justify-between mt-4 text-xs">
                <button onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                  Forgot password?
                </button>
                <button onClick={() => { setMode('resend'); setError(''); setSuccess(''); }} className="text-gray-500 dark:text-gray-400 hover:underline">
                  Can't log in?
                </button>
              </div>
            )}
          </form>
          )}

          {(mode === 'login' || mode === 'signup') && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {mode === 'login' ? (
              <>No account? <button onClick={() => setMode('signup')} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Sign up free</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('login')} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Log in</button></>
            )}
          </p>
          )}

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            You can also use the platform without an account — your progress will be saved locally in your browser.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
