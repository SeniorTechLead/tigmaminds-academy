'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); }
      else { setDone(true); }
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="max-w-md mx-auto pt-32 px-4 text-center">
          <p className="text-red-500 font-semibold">Invalid reset link. Please request a new one from the login page.</p>
          <Link href="/auth" className="text-amber-600 hover:underline text-sm mt-4 block">Go to login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-xl">TMA</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose New Password</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">For {email}</p>
          </div>

          {done ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Password updated!</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You can now log in with your new password.</p>
              <Link href="/auth" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Log In <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6}
                    placeholder="Type it again"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
