'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Search,
  Crown,
  ShieldCheck,
  TrendingUp,
  Leaf,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import hackathon from '../data/hackathon.json';
import resultsData from '../data/hackathon-venue-results.json';
import venueTeamsData from '../data/hackathon-venue-teams.json';

function memberDisplay(name: string) {
  const lead = /\(\s*Team Lead\s*\)/i.test(name);
  const display = name.replace(/\(\s*Team Lead\s*\)/gi, '').trim();
  return { display, lead };
}

export default function HackathonPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'winners' | 'finalists'>('all');

  // Categorize winners
  const winnerSlide = resultsData.slides.find((s) => s.place === 'Winner');
  const runnerUpSlide = resultsData.slides.find((s) => s.place === 'Runner-up');
  const thirdPrizeSlide = resultsData.slides.find((s) => s.place === 'Third Prize');

  const specialCategorySlides = resultsData.slides.filter(
    (s) => !['Winner', 'Runner-up', 'Third Prize'].includes(s.place)
  );

  const winningTeamNames = useMemo(() => {
    return new Set(resultsData.slides.map((s) => s.teamName.toLowerCase().replace(/\s+/g, '')));
  }, []);

  const filteredTeams = useMemo(() => {
    return venueTeamsData.filter((team) => {
      const normalizedName = team.teamName.toLowerCase().replace(/\s+/g, '');
      const isWinner = winningTeamNames.has(normalizedName);

      if (selectedFilter === 'winners' && !isWinner) return false;
      if (selectedFilter === 'finalists' && isWinner) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTeamName = team.teamName.toLowerCase().includes(q);
      const matchMember = team.members.some(
        (m) => m.name.toLowerCase().includes(q) || m.college.toLowerCase().includes(q)
      );

      return matchTeamName || matchMember;
    });
  }, [searchQuery, selectedFilter, winningTeamNames]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Decorative Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[800px] left-10 w-[500px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[1400px] right-10 w-[600px] h-[600px] bg-sky-500/10 blur-3xl rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,191,36,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.2) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ===================== HERO SECTION ===================== */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Celebratory Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 px-5 py-2 text-xs sm:text-sm font-bold text-amber-300 backdrop-blur-md mb-6 shadow-lg shadow-amber-500/10 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL HALL OF FAME · EVENT CONCLUDED SUCCESSFULLY</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
              TigmaMinds Hackathon <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">2026</span>
            </h1>

            <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-medium mb-8 leading-relaxed">
              48-Hour In-Person Prototype Championship · Guwahati, Assam
            </p>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              On 29–30 August 2026, over 50 brilliant young builders, engineers, and visionaries came together to build, 
              innovate, and present working software prototypes. Here are the champion teams and award winners.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
              <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md shadow-lg shadow-amber-500/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block mb-1">₹1,00,000+</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prize Pool & Honors</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-extrabold text-white block mb-1">18+</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Finalist Teams</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-extrabold text-white block mb-1">50+</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Innovators & Builders</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block mb-1">7</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prestigious Awards</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#podium"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:brightness-110 transition transform hover:-translate-y-0.5"
              >
                <Trophy className="w-4 h-4" />
                Champions Podium
              </a>
              <a
                href="#special-awards"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                <Award className="w-4 h-4 text-amber-400" />
                Category Winners
              </a>
              <a
                href="#all-teams"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <Users className="w-4 h-4 text-amber-400" />
                All Finalist Teams
              </a>
            </div>
          </div>
        </section>

        {/* ===================== PODIUM CHAMPIONS SECTION ===================== */}
        <section id="podium" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-2">
                <Crown className="w-4 h-4" />
                Top 3 Grand Honors
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                The Champions Podium
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Selected by a panel of industry experts after rigorous prototype evaluation and live demonstrations.
              </p>
            </div>

            {/* 3-Column Podium Layout (2nd - 1st - 3rd) */}
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {/* 2nd Place: ZeDev */}
              {runnerUpSlide && (
                <div className="order-2 lg:order-1 flex flex-col justify-between rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all hover:border-slate-500">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-600 px-3 py-1 text-xs font-black text-slate-200 uppercase tracking-wider">
                        <Medal className="w-3.5 h-3.5 text-slate-300" />
                        🥈 Runner-Up (2nd Place)
                      </span>
                    </div>

                    <h3 className="text-3xl font-extrabold text-white mb-1">{runnerUpSlide.teamName}</h3>
                    <p className="text-base font-semibold text-slate-300 mb-4">
                      Project: <span className="text-amber-300">{runnerUpSlide.projectName}</span>
                    </p>

                    <div className="rounded-xl bg-slate-950/80 border border-white/5 p-4 mb-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Team Roster</p>
                      <div className="grid grid-cols-2 gap-3">
                        {runnerUpSlide.members.map((m) => {
                          const { display, lead } = memberDisplay(m.name);
                          return (
                            <div key={m.name} className="flex items-center gap-2.5">
                              <img
                                src={m.photo}
                                alt={display}
                                className="w-10 h-10 rounded-full object-cover border border-slate-600 flex-shrink-0 bg-slate-800"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{display}</p>
                                <span className={`text-[10px] ${lead ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                                  {lead ? 'Team Lead' : 'Member'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Prototype
                    </span>
                    <span className="font-bold text-slate-200">Runner-Up Trophy & Cash</span>
                  </div>
                </div>
              )}

              {/* 1st Place: D Noobs (Grand Winner - Elevated) */}
              {winnerSlide && (
                <div className="order-1 lg:order-2 flex flex-col justify-between rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-950/40 via-slate-900/95 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-amber-500/20 relative overflow-hidden transform lg:-translate-y-4">
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3.5 py-1 text-xs font-black text-slate-950 uppercase tracking-wider shadow-md">
                        <Crown className="w-4 h-4 text-slate-950" />
                        🥇 Grand Winner (1st Place)
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white mb-1">{winnerSlide.teamName}</h3>
                    <p className="text-lg font-bold text-amber-200 mb-4">
                      Project: <span className="text-white underline decoration-amber-400 decoration-2 underline-offset-4">{winnerSlide.projectName}</span>
                    </p>

                    <div className="rounded-xl bg-slate-950/90 border border-amber-500/20 p-4 mb-6">
                      <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">Champion Team Roster</p>
                      <div className="grid grid-cols-2 gap-3">
                        {winnerSlide.members.map((m) => {
                          const { display, lead } = memberDisplay(m.name);
                          return (
                            <div key={m.name} className="flex items-center gap-2.5">
                              <img
                                src={m.photo}
                                alt={display}
                                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 flex-shrink-0 bg-slate-800 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{display}</p>
                                <span className={`text-[10px] ${lead ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                                  {lead ? '★ Team Lead' : 'Member'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-400" /> Winner Champion Trophy
                    </span>
                    <span className="text-white font-extrabold">₹ Cash Prize & Certificates</span>
                  </div>
                </div>
              )}

              {/* 3rd Place: Buri Buri Zaemon */}
              {thirdPrizeSlide && (
                <div className="order-3 flex flex-col justify-between rounded-3xl border border-amber-900/60 bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all hover:border-amber-700/80">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/60 border border-amber-800/80 px-3 py-1 text-xs font-black text-amber-300 uppercase tracking-wider">
                        <Medal className="w-3.5 h-3.5 text-amber-400" />
                        🥉 Third Prize (3rd Place)
                      </span>
                    </div>

                    <h3 className="text-3xl font-extrabold text-white mb-1">{thirdPrizeSlide.teamName}</h3>
                    <p className="text-base font-semibold text-slate-300 mb-4">
                      Project: <span className="text-amber-300">{thirdPrizeSlide.projectName}</span>
                    </p>

                    <div className="rounded-xl bg-slate-950/80 border border-white/5 p-4 mb-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Team Roster</p>
                      <div className="grid grid-cols-2 gap-3">
                        {thirdPrizeSlide.members.map((m) => {
                          const { display, lead } = memberDisplay(m.name);
                          return (
                            <div key={m.name} className="flex items-center gap-2.5">
                              <img
                                src={m.photo}
                                alt={display}
                                className="w-10 h-10 rounded-full object-cover border border-amber-700 flex-shrink-0 bg-slate-800"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{display}</p>
                                <span className={`text-[10px] ${lead ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                                  {lead ? 'Team Lead' : 'Member'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Prototype
                    </span>
                    <span className="font-bold text-amber-300">3rd Prize Trophy & Cash</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================== SPECIAL THEMATIC AWARDS ===================== */}
        <section id="special-awards" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2">
                <Award className="w-4 h-4" />
                Category Excellence
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Special Category Award Winners
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Recognizing teams that demonstrated outstanding depth in specific technical domains and real-world impact.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {specialCategorySlides.map((slide) => {
                let badgeColor = 'text-amber-300 border-amber-500/30 bg-amber-500/10';
                let icon = <Award className="w-4 h-4 text-amber-400" />;

                if (slide.place.includes('Enterprise')) {
                  badgeColor = 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
                  icon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;
                } else if (slide.place.includes('Commercial')) {
                  badgeColor = 'text-sky-300 border-sky-500/30 bg-sky-500/10';
                  icon = <TrendingUp className="w-4 h-4 text-sky-400" />;
                } else if (slide.place.includes('Sustainability')) {
                  badgeColor = 'text-green-300 border-green-500/30 bg-green-500/10';
                  icon = <Leaf className="w-4 h-4 text-green-400" />;
                } else if (slide.place.includes('Community')) {
                  badgeColor = 'text-purple-300 border-purple-500/30 bg-purple-500/10';
                  icon = <HeartHandshake className="w-4 h-4 text-purple-400" />;
                }

                return (
                  <div
                    key={slide.place}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md shadow-lg hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold ${badgeColor}`}>
                        {icon}
                        {slide.place}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-2xl font-bold text-white">{slide.teamName}</h4>
                      <p className="text-sm font-semibold text-amber-200 mt-1">
                        Project: <span className="text-white">{slide.projectName}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                      {slide.members.map((m) => {
                        const { display, lead } = memberDisplay(m.name);
                        return (
                          <div key={m.name} className="flex flex-col items-center text-center">
                            <img
                              src={m.photo}
                              alt={display}
                              className="w-12 h-12 rounded-full object-cover border border-white/15 bg-slate-800 mb-1.5 shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <p className="text-xs font-bold text-white line-clamp-1">{display}</p>
                            <span className={`text-[10px] ${lead ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                              {lead ? 'Lead' : 'Member'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== ALL FINALISTS ROSTER ===================== */}
        <section id="all-teams" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-2">Finalist Teams Archive</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Meet All 2026 Finalist Teams
                </h2>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search team, member, college..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 w-56 sm:w-64"
                  />
                </div>

                <div className="inline-flex rounded-xl border border-white/10 bg-slate-900 p-1 text-xs font-semibold">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${selectedFilter === 'all' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    All ({venueTeamsData.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('winners')}
                    className={`px-3 py-1.5 rounded-lg transition ${selectedFilter === 'winners' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Winners ({resultsData.slides.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('finalists')}
                    className={`px-3 py-1.5 rounded-lg transition ${selectedFilter === 'finalists' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Finalists
                  </button>
                </div>
              </div>
            </div>

            {/* Teams Roster Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTeams.map((team) => {
                const normalizedName = team.teamName.toLowerCase().replace(/\s+/g, '');
                const awardSlide = resultsData.slides.find(
                  (s) => s.teamName.toLowerCase().replace(/\s+/g, '') === normalizedName
                );

                return (
                  <div
                    key={team.teamName}
                    className={`rounded-2xl border p-5 backdrop-blur-sm transition ${
                      awardSlide
                        ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/80 to-slate-950 shadow-md'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-white">{team.teamName}</h4>
                        {awardSlide && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-300 mt-1">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            {awardSlide.place} ({awardSlide.projectName})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-3 border-t border-white/5 text-xs">
                      {team.members.map((m) => {
                        const { display, lead } = memberDisplay(m.name);
                        return (
                          <div key={m.name} className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-200">
                              {display} {lead && <span className="text-amber-400 font-bold">(Lead)</span>}
                            </span>
                            <span className="text-slate-400 text-right truncate max-w-[150px]">{m.college}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTeams.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-400 text-sm">No teams found matching your query.</p>
              </div>
            )}
          </div>
        </section>

        {/* ===================== EVENT RETROSPECTIVE & FAQS ===================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-slate-900/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">About Hackathon 2026</h3>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                TigmaMinds Academy is proud to host initiatives empowering North East India's young developers and thinkers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 48-Hour In-Person Build
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Teams engineered software models from scratch across AI, Sustainability, Healthcare, Education, and Cloud domains.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Industry Mentorship & Panels
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Experienced engineers and architects guided participants throughout development, providing critical real-time architecture feedback.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Community & Next Edition
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  All finalists received certificates and goodies. Stay tuned for announcements on TigmaMinds Hackathon 2027!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
