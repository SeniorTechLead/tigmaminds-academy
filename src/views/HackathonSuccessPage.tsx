'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import hackathon from '../data/hackathon.json';

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('id') || '';
  const teamName = searchParams.get('team') || '';

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
        <CheckCircle className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Registration submitted successfully
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        {teamName ? (
          <>
            Team <strong className="text-gray-900 dark:text-white">{teamName}</strong> is registered for{' '}
            {hackathon.title}.
          </>
        ) : (
          <>Your team is registered for {hackathon.title}.</>
        )}{' '}
        Confirmation emails were sent to your team members. We&apos;ll follow up with qualifier
        details.
      </p>

      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5 text-left mb-8 space-y-3">
        {registrationId && (
          <p className="text-sm text-emerald-900 dark:text-emerald-200">
            <span className="font-semibold">Reference ID:</span>{' '}
            <span className="font-mono">{registrationId}</span>
          </p>
        )}
        <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
          <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
          Check your inbox (and spam) for the confirmation email.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/hackathon"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back to hackathon details
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all"
        >
          <Home className="w-4 h-4" />
          Go to home
        </Link>
      </div>
    </div>
  );
}

export default function HackathonSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="max-w-xl mx-auto text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
