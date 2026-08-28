'use client';

import { useEffect, useState } from 'react';
import teamsData from '../data/hackathon-venue-teams.json';
import { HackPageBackdrop, TigmaMindsWordmark, VenueFullscreenButton } from './hackathon-shared';

type VenueTeam = (typeof teamsData)[number];

const SLIDE_MS = 4000;
const IST = 'Asia/Kolkata';
const TEAM_COUNT = teamsData.length;

function formatClock(now: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);
}

function formatDate(now: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
}

function memberDisplay(name: string) {
  const lead = /\(\s*Team Lead\s*\)/i.test(name);
  const display = name.replace(/\(\s*Team Lead\s*\)/gi, '').trim();
  return { display, lead };
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export default function HackathonVenueTeamsScreen() {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());

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
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % TEAM_COUNT);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const prevTeam = teamsData[(index - 1 + TEAM_COUNT) % TEAM_COUNT];
  const currentTeam = teamsData[index];
  const nextTeam = teamsData[(index + 1) % TEAM_COUNT];

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden text-white">
      <HackPageBackdrop />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/55" />

      <div className="pointer-events-none absolute inset-[4%] z-[2] hidden sm:block">
        <span className="venue-bracket venue-bracket-tl" />
        <span className="venue-bracket venue-bracket-tr" />
        <span className="venue-bracket venue-bracket-bl" />
        <span className="venue-bracket venue-bracket-br" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
        <span className="venue-mote left-[16%] top-[24%]" />
        <span className="venue-mote venue-mote-slow left-[84%] top-[30%]" />
        <span className="venue-mote left-[12%] top-[72%]" />
        <span className="venue-mote venue-mote-slow left-[88%] top-[68%]" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(1rem,2.2vh,1.75rem)]">
        <header className="flex shrink-0 items-end justify-between gap-6">
          <div>
            <div className="venue-wordmark-glow relative inline-block">
              <TigmaMindsWordmark />
              <span className="venue-shimmer" />
            </div>
            <h1 className="mt-2 text-[clamp(1.6rem,3.6vw,3rem)] font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
                Participating Teams
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-mono text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold tabular-nums leading-none tracking-wider text-white">
                {formatClock(now)}
              </p>
              <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">{formatDate(now)} · IST</p>
            </div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-emerald-300 sm:text-base">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="venue-beacon" />
                <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Grand Finale
            </div>
            <VenueFullscreenButton />
          </div>
        </header>

        <main className="relative mt-6 min-h-0 flex-1" style={{ perspective: '1400px' }}>
          <div key={index} className="venue-team-stage flex h-full items-center justify-center gap-4 sm:gap-6">
            <TeamCard team={prevTeam} variant="left" />
            <TeamCard team={currentTeam} variant="featured" number={index + 1} />
            <TeamCard team={nextTeam} variant="right" />
          </div>
        </main>

        <footer className="mt-5 shrink-0">
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div key={index} className="venue-slide-progress h-full origin-left rounded-full bg-amber-400" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-sm tabular-nums text-amber-300 sm:text-base">
              {pad(index + 1)} / {pad(TEAM_COUNT)}
            </p>
            <p className="hidden text-sm uppercase tracking-[0.2em] text-slate-500 sm:block">
              Auto-cycling teams
            </p>
            <div className="flex max-w-[50%] flex-wrap items-center justify-end gap-1.5">
              {teamsData.map((team, dotIndex) => (
                <span
                  key={team.teamName}
                  className={`h-1.5 rounded-full transition-all ${
                    dotIndex === index ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function TeamCard({
  team,
  variant,
  number,
}: {
  team: VenueTeam;
  variant: 'featured' | 'left' | 'right';
  number?: number;
}) {
  const featured = variant === 'featured';

  return (
    <article
      className={`relative flex min-w-0 flex-col overflow-hidden rounded-3xl border backdrop-blur-sm ${
        featured
          ? 'venue-card-scan z-10 h-[min(100%,36rem)] w-[min(46vw,36rem)] flex-none border-amber-400/45 bg-slate-950/75 px-8 py-8 sm:px-11 sm:py-10'
          : `hidden h-[min(72%,24rem)] w-[min(22vw,17rem)] flex-none border-white/10 bg-slate-950/40 px-6 py-6 opacity-40 lg:flex ${
              variant === 'left' ? 'venue-card-left' : 'venue-card-right'
            }`
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400 sm:text-xs">
        {featured && number ? `Team ${pad(number)}` : variant === 'right' ? 'Up next' : 'Previous'}
      </p>
      <h2
        className={`mt-2 font-bold leading-tight text-white ${
          featured ? 'text-[clamp(1.7rem,3vw,2.8rem)]' : 'text-xl'
        }`}
      >
        {team.teamName}
      </h2>

      {featured ? <div className="venue-team-line mt-5" /> : <div className="mt-4 h-px bg-white/10" />}

      {featured ? (
        <ul className="mt-7 flex flex-1 flex-col justify-center gap-4">
          {team.members.map((member, memberIndex) => {
            const { display, lead } = memberDisplay(member.name);
            return (
              <li
                key={member.name}
                className="venue-member flex items-center gap-3"
                style={{ animationDelay: `${0.18 + memberIndex * 0.14}s` }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <span className="text-[clamp(1.1rem,1.8vw,1.65rem)] font-medium text-slate-100">{display}</span>
                {lead ? (
                  <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Lead
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-auto pt-6 text-sm text-slate-400">
          {team.members.length} member{team.members.length === 1 ? '' : 's'}
        </p>
      )}
    </article>
  );
}
