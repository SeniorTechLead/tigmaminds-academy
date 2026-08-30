'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import results from '../data/hackathon-venue-results.json';
import { HackPageBackdrop, TigmaMindsWordmark, VenueFullscreenButton } from './hackathon-shared';

type ResultSlide = (typeof results.slides)[number];
type Step = 'suspense' | 'boom' | 'reveal';

const SLIDES = results.slides;
const SLIDE_COUNT = SLIDES.length;
const BOOM_MS = 1100;
const CONFETTI_COLORS = ['#fbbf24', '#f59e0b', '#34d399', '#e2e8f0', '#fb7185', '#93c5fd'];
const CONFETTI_SHAPES = ['square', 'circle', 'diamond'] as const;

const CONFETTI = Array.from({ length: 56 }, (_, index) => ({
  left: `${(index * 13 + 4) % 98}%`,
  delay: `${(index % 10) * 0.12}s`,
  duration: `${2.8 + (index % 5) * 0.35}s`,
  size: 7 + (index % 6) * 2,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  shape: CONFETTI_SHAPES[index % CONFETTI_SHAPES.length],
  drift: `${index % 2 === 0 ? 36 : -30}px`,
}));

function memberDisplay(name: string) {
  const lead = /\(\s*Team Lead\s*\)/i.test(name);
  const display = name.replace(/\(\s*Team Lead\s*\)/gi, '').trim();
  return { display, lead };
}

function isRevealKey(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  if (event.key === 'F' || event.key === 'f' || event.key === 'Escape' || event.key === 'Tab') return false;
  if (event.key.startsWith('F') && event.key.length > 1) return false;
  return true;
}

function nextHint(index: number) {
  const next = SLIDES[index + 1];
  if (!next) return 'Press any key to replay';
  if (next.place === 'Winner') return 'Press any key for the winner';
  if (next.place === 'Runner-up') return 'Press any key for runner-up';
  if (next.place === 'Third Prize') return 'Press any key for third prize';
  return 'Press any key for the next award';
}

export default function HackathonVenueWinnersScreen() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>('suspense');
  const stepRef = useRef<Step>('suspense');
  const lockRef = useRef(false);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const advance = useCallback(() => {
    if (lockRef.current || stepRef.current === 'boom') return;

    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, 400);

    if (stepRef.current === 'suspense') {
      setStep('boom');
      return;
    }

    setIndex((slide) => (slide + 1) % SLIDE_COUNT);
    setStep('suspense');
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    if (step !== 'boom') return undefined;
    const timer = window.setTimeout(() => setStep('reveal'), BOOM_MS);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isRevealKey(event)) return;
      event.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  const slide = SLIDES[index];
  const booming = step === 'boom';
  const revealing = step === 'reveal';
  const suspense = step === 'suspense';

  return (
    <div
      className={`relative h-[100dvh] w-screen overflow-hidden text-white ${booming ? 'reveal-shake' : ''} ${
        suspense ? 'cursor-pointer' : ''
      }`}
      onClick={advance}
    >
      <HackPageBackdrop />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/60" />
      <div className="pointer-events-none absolute inset-0 z-[1] reveal-vignette" />
      {suspense ? <div className="pointer-events-none absolute inset-0 z-[2] reveal-spotlight" /> : null}

      <div className="pointer-events-none absolute inset-[5%] z-[2] hidden sm:block">
        <span className="venue-bracket venue-bracket-tl" />
        <span className="venue-bracket venue-bracket-tr" />
        <span className="venue-bracket venue-bracket-bl" />
        <span className="venue-bracket venue-bracket-br" />
      </div>

      {booming ? <BoomLayer /> : null}
      {revealing ? <ConfettiLayer burstKey={`${index}-${slide.place}`} /> : null}

      <div className="absolute right-4 top-4 z-30 sm:right-6 sm:top-6" onClick={(event) => event.stopPropagation()}>
        <VenueFullscreenButton />
      </div>

      <div className="relative z-10 flex h-full flex-col px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(1rem,2.2vh,1.75rem)]">
        <header className="relative z-20 flex shrink-0 justify-center pb-6">
          <div className="venue-wordmark-glow relative inline-block overflow-hidden">
            <TigmaMindsWordmark />
            <span className="venue-shimmer" />
          </div>
        </header>

        <main className="relative z-10 min-h-0 flex-1 overflow-hidden">
          {suspense ? <SuspenseStage slide={slide} /> : null}
          {revealing ? <RevealStage slide={slide} hint={nextHint(index)} /> : null}
        </main>
      </div>
    </div>
  );
}

function SuspenseStage({ slide }: { slide: ResultSlide }) {
  const mainTitle = slide.place === 'Winner' || slide.place === 'Runner-up' || slide.place === 'Third Prize';

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="relative mb-10 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
        <span className="reveal-heartbeat" />
        <span className="reveal-heartbeat reveal-heartbeat-delay" />
        <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/70 bg-slate-950/80 sm:h-20 sm:w-20">
          <Trophy className="h-8 w-8 text-amber-400 sm:h-10 sm:w-10" />
        </span>
      </div>

      <p className="reveal-line text-sm font-semibold uppercase tracking-[0.45em] text-amber-300 sm:text-base">
        And the
      </p>
      <h1
        className={`reveal-slam mt-3 font-bold uppercase leading-[0.95] tracking-[0.04em] ${
          mainTitle
            ? 'text-[clamp(3.2rem,10vw,8.5rem)]'
            : 'max-w-5xl text-[clamp(1.7rem,5.4vw,4.2rem)]'
        }`}
      >
        <span className="bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
          {slide.place}
        </span>
      </h1>
      <p className="reveal-line reveal-delay-is mt-4 flex items-end gap-2 text-[clamp(1.8rem,4vw,3.4rem)] font-semibold uppercase tracking-[0.28em] text-white">
        is
        <span className="reveal-ellipsis" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </p>

      <div className="mt-12 flex h-12 items-end gap-1.5">
        {Array.from({ length: 14 }, (_, barIndex) => (
          <span
            key={barIndex}
            className="reveal-drum h-full w-1.5 rounded-full bg-gradient-to-t from-amber-600 to-amber-200"
            style={{ animationDelay: `${barIndex * 0.08}s` }}
          />
        ))}
      </div>

      <p className="reveal-hint mt-10 text-xs uppercase tracking-[0.32em] text-slate-400 sm:text-sm">
        Press any key to reveal
      </p>
    </div>
  );
}

function RevealStage({ slide, hint }: { slide: ResultSlide; hint: string }) {
  const winner = slide.place === 'Winner';

  return (
    <div className="flex h-full flex-col items-center justify-start overflow-hidden pt-2">
      <div className="venue-team-stage flex w-full max-w-6xl flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border ${
              winner ? 'venue-trophy-glow border-amber-400/70' : 'venue-trophy-glow-silver border-slate-300/50'
            }`}
          >
            <Trophy className={`h-7 w-7 ${winner ? 'text-amber-400' : 'text-slate-200'}`} />
          </span>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.32em] sm:text-sm ${
              winner ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            Hackathon 2026 — {slide.place}
          </p>
        </div>

        <h2 className="reveal-slam mt-5 text-[clamp(2.4rem,6vw,5.4rem)] font-bold leading-none tracking-tight text-white">
          {slide.teamName}
        </h2>
        {slide.projectName ? (
          <p className="venue-fade-in venue-delay-1 mt-3 text-[clamp(1.1rem,2vw,1.7rem)] font-medium text-amber-200">
            {slide.projectName}
          </p>
        ) : null}
        {slide.description ? (
          <p className="venue-fade-in venue-delay-2 mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">
            {slide.description}
          </p>
        ) : null}

        <div className="venue-rule mt-8" />

        <ul
          className={`mt-10 grid w-full gap-4 sm:gap-6 ${
            slide.members.length <= 2
              ? 'max-w-xl grid-cols-2'
              : slide.members.length === 3
                ? 'max-w-4xl grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {slide.members.map((member, memberIndex) => {
            const { display, lead } = memberDisplay(member.name);
            return (
              <li
                key={member.photo}
                className="reveal-photo flex flex-col items-center"
                style={{ animationDelay: `${0.25 + memberIndex * 0.16}s` }}
              >
                <div className="relative aspect-square w-full max-w-[13rem] overflow-hidden rounded-full border border-amber-400/35 bg-slate-950 shadow-[0_0_28px_rgba(251,191,36,0.18)]">
                  <img
                    src={encodeURI(member.photo)}
                    alt={display}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <p className="mt-3 text-[clamp(1rem,1.6vw,1.35rem)] font-semibold text-white">{display}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-amber-300/80">
                  {lead ? 'Team Lead' : member.role}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="venue-fade-in venue-delay-4 mt-8 text-xs uppercase tracking-[0.28em] text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

function BoomLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      <div className="reveal-flash" />
      <span className="reveal-shockwave" />
      <span className="reveal-shockwave reveal-shockwave-delay" />
      <span className="reveal-shockwave reveal-shockwave-late" />
      {Array.from({ length: 28 }, (_, index) => (
        <span
          key={index}
          className="reveal-spark"
          style={{
            ['--spark-angle' as string]: `${index * (360 / 28)}deg`,
            background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
          }}
        />
      ))}
    </div>
  );
}

function ConfettiLayer({ burstKey }: { burstKey: string }) {
  return (
    <div key={burstKey} className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      {CONFETTI.map((piece, pieceIndex) => (
        <span
          key={`${burstKey}-${pieceIndex}`}
          className={`venue-confetti-fall venue-confetti-${piece.shape}`}
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size,
            background: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            ['--confetti-drift' as string]: piece.drift,
          }}
        />
      ))}
    </div>
  );
}
