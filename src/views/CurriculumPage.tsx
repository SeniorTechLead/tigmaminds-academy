import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown, ChevronRight, BookOpen, Wrench, CheckCircle,
  Clock, Target, AlertTriangle, ExternalLink,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CallbackForm from '../components/CallbackForm';
import EnrollmentRequestForm from '../components/EnrollmentRequestForm';
import { allTracks, type TrackCurriculum, type TermPlan, type WeekPlan } from '../data/school-curriculum';

function WeekCard({ week, trackColor }: { week: WeekPlan; trackColor: string }) {
  const [open, setOpen] = useState(false);
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500 bg-emerald-900/10',
    rose: 'border-rose-500 bg-rose-900/10',
    violet: 'border-violet-500 bg-violet-900/10',
    amber: 'border-amber-500 bg-amber-900/10',
  };
  const accentMap: Record<string, string> = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    rose: 'text-rose-600 dark:text-rose-400',
    violet: 'text-violet-600 dark:text-violet-400',
    amber: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className={`rounded-lg border ${open ? colorMap[trackColor] || 'border-gray-300' : 'border-gray-200 dark:border-gray-700'} transition-all`}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 flex items-center gap-3">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          week.newContent
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
        }`}>
          {week.week}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{week.topic}</p>
          {week.project && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Project: {week.project}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {week.newContent && <span className="text-[9px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">NEW</span>}
          {week.slugs.length > 0 && <span className="text-[9px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{week.slugs.length} story</span>}
          {week.levels.length > 0 && <span className="text-[9px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{week.levels.join(', ')}</span>}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Objectives */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Learning objectives</p>
            <ul className="space-y-1">
              {week.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <Target className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          {week.project && (
            <div className="flex items-start gap-2">
              <Wrench className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accentMap[trackColor]}`} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project deliverable</p>
                <p className="text-sm text-gray-900 dark:text-white">{week.project}</p>
              </div>
            </div>
          )}

          {/* Linked stories */}
          {week.slugs.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platform stories</p>
              <div className="flex flex-wrap gap-2">
                {week.slugs.map(slug => (
                  <Link key={slug} href={`/lessons/${slug}`}
                    className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">
                    {slug.replace(/-/g, ' ')} <ExternalLink className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Basics prerequisite */}
          {week.basics && (
            <Link href={week.basics} className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 hover:underline">
              <BookOpen className="w-3 h-3" /> Prerequisite: {week.basics.split('/').pop()?.replace(/-/g, ' ')}
            </Link>
          )}

          {/* New content needed */}
          {week.newContent && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3 h-3" /> Content to be authored for this week
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TermSection({ term, trackColor }: { term: TermPlan; trackColor: string }) {
  const [open, setOpen] = useState(false);
  const totalWeeks = term.weeks.length;
  const withContent = term.weeks.filter(w => w.slugs.length > 0).length;
  const newContent = term.weeks.filter(w => w.newContent).length;

  const bgMap: Record<string, string> = {
    emerald: 'bg-emerald-600', rose: 'bg-rose-600', violet: 'bg-violet-600', amber: 'bg-amber-600',
  };

  return (
    <div className="mb-6">
      <button onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
        <div className={`w-10 h-10 rounded-lg ${bgMap[trackColor] || 'bg-gray-600'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          T{term.term}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{term.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{term.description}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-400">
          <span>{totalWeeks} weeks</span>
          <span>{withContent} with stories</span>
          {newContent > 0 && <span className="text-amber-500">{newContent} new</span>}
          <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="mt-3 space-y-2 ml-2">
          {term.weeks.map(week => (
            <WeekCard key={week.week} week={week} trackColor={trackColor} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrackView({ track }: { track: TrackCurriculum }) {
  return (
    <div>
      {/* Track banner */}
      <div className="mb-6 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start gap-4 mb-3">
          <span className="text-3xl p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">{track.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{track.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{track.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700/60">
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-amber-500" /> <strong className="text-gray-800 dark:text-gray-200">Audience:</strong> {track.audience}</span>
          <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-amber-500" /> <strong className="text-gray-800 dark:text-gray-200">Capstone:</strong> {track.capstoneProject}</span>
        </div>
      </div>

      {/* Terms */}
      {track.terms.map(term => (
        <TermSection key={term.term} term={term} trackColor={track.color} />
      ))}
    </div>
  );
}

/* Static Program at a Glance overview from PPT */
function ProgramAtAGlance() {
  const stats = [
    { number: '9', label: 'Months of core curriculum' },
    { number: '7', label: 'Core technical domains covered' },
    { number: '1', label: 'Flagship product shipped by every student' },
    { number: '3', label: 'Optional months for specialization' },
  ];

  return (
    <div className="mb-8 p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Overview
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1.5">
            The Program at a Glance
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700/60 text-center flex flex-col items-center justify-center min-h-[140px] transition-all hover:border-amber-400/60 hover:shadow-sm"
          >
            <span className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {s.number}
            </span>
            <div className="w-8 h-1 bg-amber-500 rounded-full my-2.5" />
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-5">
        Months 10–12 are optional — a deep specialization sprint for students who want mastery in one area.
      </p>
    </div>
  );
}

/* Visual journey: what students build across the 9+3 month program */
function BuildJourneyVisual() {
  const milestones = [
    { month: 'Month 1', label: 'Programming + OOP', icon: '💻', desc: 'Core paradigms, abstraction & clean code' },
    { month: 'Month 2–3', label: 'DSA', icon: '⚡', desc: 'Data structures, algorithms & optimization' },
    { month: 'Month 4', label: 'SQL & NoSQL', icon: '🗄️', desc: 'Relational modeling, indexing & transactions' },
    { month: 'Month 5', label: 'OS & System Design', icon: '⚙️', desc: 'Memory, concurrency, processes & threads' },
    { month: 'Month 5–6', label: 'Frontend', icon: '🎨', desc: 'Component systems, state & web APIs' },
    { month: 'Month 6–7', label: 'Backend', icon: '🔌', desc: 'REST/GraphQL, auth, caching & services' },
    { month: 'Month 8', label: 'Applied AI / ML', icon: '🧠', desc: 'ML models, embeddings & LLM integrations' },
    { month: 'Month 9', label: 'Capstone Product', icon: '🚀', desc: 'Production deployment & graduation showcase' },
  ];

  const specializations = [
    { month: 'Months 10–12', label: 'AI/ML Deep Dive', icon: '🧠', desc: 'LLMs, neural networks, PyTorch & agentic AI' },
    { month: 'Months 10–12', label: 'Backend Systems & Scale', icon: '⚡', desc: 'Distributed systems, Kafka, Redis & microservices' },
    { month: 'Months 10–12', label: 'Frontend Engineering', icon: '🎨', desc: 'Design systems, Next.js perf & reactive UI' },
    { month: 'Months 10–12', label: 'Full-Stack Mastery', icon: '🚀', desc: 'End-to-end cloud infra, DevOps & CI/CD' },
  ];

  return (
    <div className="space-y-8">
      {/* 9-Month Core Journey */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Core Phase — Months 1 to 9 (Mandatory)
          </span>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-8 left-[6.25%] right-[6.25%] h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hidden lg:block" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {milestones.map((m, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center text-2xl relative z-10 ${
                  i === milestones.length - 1
                    ? 'bg-gradient-to-br from-amber-400 to-red-500 shadow-lg shadow-amber-500/30 scale-110'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}>
                  {m.icon}
                </div>
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{m.month}</p>
                <p className="text-xs font-semibold text-gray-900 dark:text-white mt-0.5">{m.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Month Specialization Timeline (+3 Model) */}
      <div className="pt-6 border-t border-amber-200/50 dark:border-amber-800/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Specialization Phase — Months 10 to 12 (Optional — Choose 1 Track)
          </span>
          <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            +3 Months
          </span>
        </div>

        <div className="relative">
          {/* Connection line for Specialization */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500 hidden sm:block" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {specializations.map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center text-2xl relative z-10 bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
                  {s.icon}
                </div>
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{s.month}</p>
                <p className="text-xs font-semibold text-gray-900 dark:text-white mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CurriculumPage() {
  const [activeTrack, setActiveTrack] = useState(0); // Default to 9 Month (Mandatory)
  const track = allTracks[activeTrack];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            12-Month Curriculum
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The 9+3 Month Real-World Software Engineering Program. Every concept is taught the way it actually shows up in the products you use every day.
          </p>
        </div>

        {/* Featured: Combined Track Hero */}
        <div className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/15 dark:to-red-900/10 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider">Featured Track</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ⚡ Flagship Programming
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Go beyond syntax. Build a rock-solid foundation in <span className="font-semibold text-gray-900 dark:text-white">computer science fundamentals</span>, <span className="font-semibold text-gray-900 dark:text-white">scalable distributed systems</span>, <span className="font-semibold text-gray-900 dark:text-white">modern frontend & backend architectures</span>, and <span className="font-semibold text-gray-900 dark:text-white">production AI pipelines</span>.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Programming & OOP</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">DSA</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">DBMS & SQL</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Operating Systems</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Frontend</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Backend</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Applied AI/ML</span>
              </div>
            </div>
            <button onClick={() => { setActiveTrack(0); document.getElementById('track-content')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="self-start md:self-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 transition-all flex-shrink-0">
              View Full Curriculum →
            </button>
          </div>

          {/* Visual journey */}
          <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/50">
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">The 9-Month Journey</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Modules build on each other and some run in parallel — just like real engineering teams work.</p>
            <BuildJourneyVisual />
          </div>
        </div>

        {/* Static Program at a Glance Overview (above pills) */}
        <div id="track-content" className="scroll-mt-24">
          <ProgramAtAGlance />
        </div>

        {/* Track selector pills */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {allTracks.map((t, i) => (
            <button key={t.id} onClick={() => setActiveTrack(i)}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                i === activeTrack
                  ? t.color === 'emerald' ? 'bg-emerald-600 text-white shadow-lg' :
                    t.color === 'rose' ? 'bg-rose-600 text-white shadow-lg' :
                    t.color === 'violet' ? 'bg-violet-600 text-white shadow-lg' :
                    'bg-amber-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <span className="mr-2">{t.icon}</span>
              {t.name}
            </button>
          ))}
        </div>

        {/* Active track */}
        <TrackView track={track} />

        {/* Join CTA + Callback (Stacked full-width with centered content) */}
        <div className="mt-12 space-y-6">
          {/* Ready to start? */}
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-center shadow-lg">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to start?</h2>
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                9 Months of core curriculum + 3 months optional specialization. Dedicated 1-on-1 mentorship, industry-anchored products, and live company demo day.
              </p>
              <p className="text-amber-400 font-semibold text-lg mb-1">₹9,999/month (₹1,19,988 total)</p>
              <p className="text-gray-400 text-xs mb-6">Coming to select cities &middot; <Link href="/curriculum/bootcamp" className="text-gray-300 hover:text-white underline">Looking for the bootcamp?</Link></p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <Link href="/programs#enroll"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all text-sm">
                  Enroll Now <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/partner"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-xl font-medium transition-all text-sm">
                  Partner with Us
                </Link>
              </div>
            </div>
          </div>

          {/* Have a doubt? Request a callback */}
          <div className="p-8 md:p-10 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-md mx-auto text-center">
              <CallbackForm
                context="ProductionReady Curriculum"
                title="Have a doubt ? Request a callback"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
