'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutButton from '../components/CheckoutButton';
import { useSubscription } from '../contexts/SubscriptionContext';
import { lessonsMeta as lessons } from '../data/lessons-meta';
import { problemMeta } from '../data/playground-meta';

export default function PricingPage() {
  // const { plan: currentPlan, hasActiveSubscription } = useSubscription();
  const searchParams = useSearchParams();
  const enrolled = searchParams?.get('enrolled') === 'true';
  const studentName = searchParams?.get('student') || '';

  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
        setIsIndia(true);
      } else {
        setIsIndia(false);
      }
    } catch {
      setIsIndia(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* If redirected after submitting enrollment */}
        {enrolled && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Enrollment Request Submitted Successfully!
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-0.5">
                  We have received your enrollment request{studentName ? ` for ${studentName}` : ''}. Our admissions team will review your application and contact you within 2 business days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Pricing Detail Section ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center">
              Pricing
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Start free. Upgrade when you are ready.
            </p>

            {/* Currency toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-semibold">
                <button
                  onClick={() => setIsIndia(true)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isIndia ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🇮🇳 INR (₹)
                </button>
                <button
                  onClick={() => setIsIndia(false)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    !isIndia ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🌍 USD ($)
                </button>
              </div>
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

              {/* Free 2-Week Demo */}
              <div className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 p-6 bg-white dark:bg-gray-800 text-center flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">2-Week Free Demo</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{isIndia ? '₹0' : '$0'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">for first 2 weeks &middot; no card required</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2.5 text-left mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>2 Weeks Live Cohort:</strong> Experience live classes from the 12-month program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Assess Teaching Quality:</strong> Evaluate our mentorship &amp; pedagogy risk-free</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Foundations Preview:</strong> Hands-on coding labs &amp; live mentor Q&amp;A</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Story &amp; Practice Access:</strong> Level 0 lessons &amp; Python basics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Zero Risk:</strong> Decide whether to enroll after the 2-week demo</span>
                    </li>
                  </ul>
                </div>
                {/* <Link href="/programs#enroll" className="block w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors text-center">
                  Join 2-Week Free Demo
                </Link> */}
              </div>

              {/* 12-Month Curriculum */}
              <div id="plan-online" className="rounded-2xl border-2 border-amber-400 dark:border-amber-600 p-6 bg-amber-50/50 dark:bg-amber-900/10 text-center relative flex flex-col justify-between shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">
                  Early Bird Access
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 mt-1">12-Month Curriculum</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 line-through mb-0.5">
                    {isIndia ? '₹9,999/mo' : '$100/mo'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {isIndia ? '₹6,666' : '$69'}<span className="text-base font-normal text-gray-500">/mo</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    or {isIndia ? '₹6,666 × 3' : '$69 × 3'} quarterly
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2.5 text-left mb-5">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span><strong>9 Months Core:</strong> 7 full-stack & AI engineering domains</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span><strong>1 Flagship Product:</strong> Build & deploy a live production app</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span><strong>3 Months Specialization:</strong> AI/ML, Backend, Frontend, or Full-Stack</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span><strong>Dedicated Mentor:</strong> 1-on-1 code reviews & small cohort (max 12)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span><strong>Live Demo Day:</strong> Showcase your capstone to industry engineers</span>
                    </li>
                  </ul>
                  <Link href="/curriculum" className="block text-xs text-amber-600 dark:text-amber-400 hover:underline mb-4 text-center">
                    View 9+3 month curriculum →
                  </Link>
                </div>
                {/* <div>
                  {hasActiveSubscription && currentPlan === 'online' ? (
                    <div className="py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold text-center">
                      ✓ Current Plan
                    </div>
                  ) : (
                    <CheckoutButton plan="curriculum_quarterly" label="Subscribe — Quarterly" />
                  )}
                </div> */}
              </div>

              {/* 12-Month Curriculum */}
              {/* <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6 bg-white dark:bg-gray-800 text-center flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">12-Month Curriculum</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{isIndia ? '₹9,999' : '$59'}<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">12 months &middot; Grades 6-12</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left mb-6">
                    <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Everything in Online, plus:</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Dedicated mentor &amp; cohort (max 12)</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Hands-on hardware &amp; sensors</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Monthly project showcases</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Parent progress reports</li>
                  </ul>
                </div>
                <div>
                  <Link href="/curriculum" className="block text-xs text-emerald-600 dark:text-emerald-400 hover:underline mb-3">View 48-week curriculum →</Link>
                  <Link href="/programs#enroll" className="block w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors text-center">
                    Enroll Now
                  </Link>
                </div>
              </div> */}

              {/* Bootcamp */}
              {/* <div className="rounded-2xl border-2 border-purple-300 dark:border-purple-700 p-6 bg-white dark:bg-gray-800 text-center relative flex flex-col justify-between shadow-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">Early Bird — 24 Seats</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 mt-1">Bootcamp</h3>
                  <p className="text-sm text-gray-400 line-through">{isIndia ? '₹19,999/mo' : '$119/mo'}</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">{isIndia ? '₹14,999' : '$89'}<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">24 weeks &middot; Career changers</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left mb-6">
                    <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Full-Stack, AI/ML, or Cloud/DevOps</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Dedicated mentor &amp; cohort (max 15)</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> 8+ portfolio projects</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Mock interviews &amp; job referrals</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Hardware kit included</li>
                  </ul>
                </div>
                <div>
                  <Link href="/curriculum/bootcamp" className="block text-xs text-purple-600 dark:text-purple-400 hover:underline mb-3">View 24-week curriculum →</Link>
                  <Link href="/programs#enroll" className="block w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors text-center">
                    Join Early Bird
                  </Link>
                </div>
              </div> */}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
