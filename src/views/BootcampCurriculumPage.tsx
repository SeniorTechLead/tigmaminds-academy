import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown, ChevronRight, BookOpen, Wrench,
  Clock, Target, AlertTriangle, ExternalLink,
} from 'lucide-react';
import Header from '../components/Header';
import CallbackForm from '../components/CallbackForm';
import Footer from '../components/Footer';
import { allBootcampTracks, aiMlTrack } from '../data/bootcamp-curriculum';
import type { TrackCurriculum, TermPlan, WeekPlan } from '../data/school-curriculum';

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
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 text-amber-600">
          {week.week}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{week.topic}</p>
          {week.project && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Project: {week.project}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[9px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">NEW</span>
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
        </div>
      )}
    </div>
  );
}

function TermSection({ term, trackColor }: { term: TermPlan; trackColor: string }) {
  const [open, setOpen] = useState(false);
  const totalWeeks = term.weeks.length;

  const bgMap: Record<string, string> = {
    emerald: 'bg-emerald-600', rose: 'bg-rose-600', violet: 'bg-violet-600', amber: 'bg-amber-600',
  };

  return (
    <div className="mb-6">
      <button onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
        <div className={`w-10 h-10 rounded-lg ${bgMap[trackColor] || 'bg-gray-600'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          P{term.term}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{term.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{term.description}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-400">
          <span>{totalWeeks} weeks</span>
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
  const totalWeeks = track.terms.reduce((s, t) => s + t.weeks.length, 0);
  const withProjects = track.terms.reduce((s, t) => s + t.weeks.filter(w => w.project).length, 0);
  const totalPhases = track.terms.length;

  return (
    <div>
      {/* Track header */}
      <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{track.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{track.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{track.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWeeks}</p>
            <p className="text-xs text-gray-500">weeks</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPhases}</p>
            <p className="text-xs text-gray-500">phases</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{withProjects}</p>
            <p className="text-xs text-gray-500">projects</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {track.audience}</span>
          <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Capstone: {track.capstoneProject}</span>
        </div>
      </div>

      {/* Phases */}
      {track.terms.map(term => (
        <TermSection key={term.term} term={term} trackColor={track.color} />
      ))}
    </div>
  );
}

/* Visual journey for AI/ML track */
function AiMlJourneyVisual() {
  const milestones = [
    { month: 'Month 1', label: 'Python & Data', icon: '🐍', desc: 'Python fluency, NumPy, Pandas, visualization' },
    { month: 'Month 2', label: 'Classical ML', icon: '📊', desc: 'Regression, trees, feature engineering, tuning' },
    { month: 'Month 3', label: 'Deep Learning', icon: '🧠', desc: 'Neural networks, CNNs, PyTorch, transfer learning' },
    { month: 'Month 4', label: 'NLP & LLMs', icon: '💬', desc: 'Transformers, BERT, LLM APIs, prompt engineering' },
    { month: 'Month 5', label: 'Production ML', icon: '🚀', desc: 'FastAPI, Docker, MLflow, A/B testing' },
    { month: 'Month 6', label: 'Job Ready', icon: '🎓', desc: 'Portfolio, mock interviews, employer referrals' },
  ];

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hidden md:block" />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
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
  );
}

export default function BootcampCurriculumPage() {
  const [activeTrack, setActiveTrack] = useState(1); // Default to AI/ML (most popular)
  const track = allBootcampTracks[activeTrack];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            24-Week Bootcamp Curriculum
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Intensive, career-focused. 24 weeks from fundamentals to job-ready.
            Small cohorts, hands-on projects every week, and direct employer introductions.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
            Looking for the school program? See the <Link href="/curriculum" className="text-amber-600 dark:text-amber-400 hover:underline">12-Month School Curriculum</Link>.
          </p>
        </div>

        {/* Featured: AI/ML Track Hero */}
        <div className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/15 dark:to-red-900/10 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🧠 AI & Machine Learning
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                The hottest career track in tech. Go from Python basics to deploying production ML pipelines.
                By month 6, you present your ML portfolio to hiring partners and get{' '}
                <span className="font-semibold text-gray-900 dark:text-white">warm introductions to employers</span>.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Python</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">PyTorch</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">scikit-learn</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">LLM APIs</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">FastAPI</span>
                <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Docker</span>
              </div>
            </div>
            <button onClick={() => { setActiveTrack(1); document.getElementById('track-content')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="self-start md:self-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 transition-all flex-shrink-0">
              View Full Curriculum →
            </button>
          </div>

          {/* Visual journey */}
          <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/50">
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">Your journey — month by month</p>
            <AiMlJourneyVisual />
          </div>
        </div>

        {/* Track selector */}
        <div id="track-content" className="flex flex-wrap gap-3 mb-10 justify-center scroll-mt-24">
          {allBootcampTracks.map((t, i) => (
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

        {/* Pricing + Value */}
        <div className="mt-12 p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800">
          <div className="text-center mb-6">
            <span className="inline-block text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full uppercase tracking-wider mb-3">Early Bird — 24 Seats Only</span>
            <p className="text-sm text-gray-400 line-through">₹19,999/mo (₹4,79,976 total)</p>
            <p className="text-4xl font-bold text-purple-700 dark:text-purple-300 mt-1">₹14,999<span className="text-lg font-normal text-gray-500">/mo for 24 months</span></p>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mt-1">Save ₹1,20,000 — early bird rate</p>
            <p className="text-xs text-gray-400 mt-1">₹3,59,976 total</p>
          </div>

          {/* Value comparison */}
          <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What's included</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>24 weeks of live mentorship</span>
                <span className="text-gray-400">₹2-4L value</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>8+ production portfolio projects</span>
                <span className="text-gray-400">included</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Mock interviews + job referrals</span>
                <span className="text-gray-400">₹50K value</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Hardware kit (Arduino, sensors, components)</span>
                <span className="text-gray-400">₹8-10K value</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>1-year full platform access</span>
                <span className="text-gray-400">₹24K value</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2.5 mt-2.5 font-bold text-gray-900 dark:text-white">
                <span>Total value</span>
                <span>₹5L+</span>
              </div>
              <div className="flex justify-between font-bold text-purple-700 dark:text-purple-300 text-lg">
                <span>You pay (early bird rate)</span>
                <span>₹3.6L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Join CTA + Callback */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Left: Waitlist */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to launch your career?</h2>
            <p className="text-gray-300 mb-4 text-sm">
              24 weeks of intensive training. Small cohorts (max 15), dedicated mentor, weekly projects,
              mock interviews, and direct employer introductions.
            </p>
            <p className="text-amber-400 font-semibold mb-6">Early bird — only 24 seats at this rate</p>
            <div className="space-y-3">
              <Link href="/programs#waitlist"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all">
                Join the Waitlist <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/partner/employers"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-xl font-medium transition-all text-sm">
                Partner as an Employer
              </Link>
            </div>
          </div>

          {/* Right: Callback form */}
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CallbackForm context="24-Week Bootcamp" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
