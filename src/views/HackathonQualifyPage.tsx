'use client';

import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HackathonQualifyingSection from './HackathonQualifyingSection';
import { isHackathonRegistrationOpen } from '../data/hackathon-utils';
import { HackathonEventDetails, HackathonHero, HackPageBackdrop } from './hackathon-shared';

export default function HackathonQualifyPage() {
  const registrationOpen = isHackathonRegistrationOpen();

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const timer = window.setTimeout(scrollToHash, 80);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white transition-colors">
      <HackPageBackdrop />
      <div className="relative z-10">
        <Header />

        <HackathonHero
          actions={
            <>
              <a
                href="#qualifying"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all"
              >
                <FileText className="w-5 h-5" />
                Qualifying Rounds
              </a>
              <a
                href="#details"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 font-medium hover:bg-white/10 transition-colors"
              >
                View Details
              </a>
              {registrationOpen ? (
                <a
                  href="/hackathon#register"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-100 font-medium hover:bg-amber-500/20 transition-colors"
                >
                  Register Your Team
                </a>
              ) : null}
            </>
          }
        />

        <HackathonEventDetails />
        <HackathonQualifyingSection />

        <Footer contactEmail="hackathon@tigmaminds.com" />
      </div>
    </div>
  );
}
