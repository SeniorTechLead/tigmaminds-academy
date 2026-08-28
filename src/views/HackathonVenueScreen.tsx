'use client';

import hackathon from '../data/hackathon.json';
import { HackPageBackdrop, TigmaMindsWordmark, VenueFullscreenButton } from './hackathon-shared';

export default function HackathonVenueScreen() {
  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden text-white">
      <HackPageBackdrop />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/50" />

      <div className="pointer-events-none absolute inset-[7%] z-[2] hidden sm:block">
        <span className="venue-bracket venue-bracket-tl" />
        <span className="venue-bracket venue-bracket-tr" />
        <span className="venue-bracket venue-bracket-bl" />
        <span className="venue-bracket venue-bracket-br" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
        <span className="venue-mote left-[22%] top-[28%]" />
        <span className="venue-mote venue-mote-slow left-[74%] top-[32%]" />
        <span className="venue-mote left-[18%] top-[68%]" />
        <span className="venue-mote venue-mote-slow left-[80%] top-[62%]" />
        <span className="venue-mote left-[48%] top-[18%]" />
      </div>

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <VenueFullscreenButton />
      </div>

      <main className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[8vh] text-center">
        <div className="venue-fade-in relative mb-8">
          <div className="venue-wordmark-glow relative inline-block">
            <TigmaMindsWordmark size="lg" />
            <span className="venue-shimmer" />
          </div>
        </div>

        <h1 className="venue-title-reveal max-w-5xl text-[clamp(2rem,5.4vw,4.6rem)] font-bold leading-[1.12] tracking-tight">
          <span className="block bg-gradient-to-r from-white via-amber-50 to-amber-100 bg-clip-text text-transparent">
            Welcome to TigmaMinds
          </span>
          <span className="mt-1 block bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Hackathon 2026
          </span>
        </h1>

        <div className="venue-rule mt-8" />

        <div className="venue-fade-in venue-delay-2 relative mt-10 flex items-center gap-4 text-[clamp(1.5rem,3.4vw,2.8rem)] font-semibold uppercase tracking-[0.28em] text-emerald-300">
          <span className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
            <span className="venue-beacon" />
            <span className="venue-beacon venue-beacon-delay" />
            <span className="relative z-10 h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
          </span>
          Grand Finale
        </div>

        <div className="venue-fade-in venue-delay-3 mt-12 flex items-stretch justify-center">
          <div className="px-10 text-right sm:px-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400 sm:text-xs">Dates</p>
            <p className="mt-2 text-lg font-medium text-white sm:text-2xl">{hackathon.dates}</p>
          </div>
          <div className="relative w-px self-stretch overflow-hidden">
            <span className="venue-connector" />
          </div>
          <div className="px-10 text-left sm:px-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400 sm:text-xs">Location</p>
            <p className="mt-2 text-lg font-medium text-white sm:text-2xl">{hackathon.location}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
