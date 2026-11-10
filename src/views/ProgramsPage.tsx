'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  CheckCircle,
  Rocket,
  ShieldCheck,
  Workflow,
  Zap,
  Radio,
  GitBranch,
  Award,
  BadgePercent,
  Tag,
  MapPin,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WinterTrainingRegistrationForm from '../components/WinterTrainingRegistrationForm';
import {
  WINTER_TRAINING_MODULES,
  TECH_STACK,
  CAPSTONE_LAYERS,
  GRADUATE_OUTCOMES,
  WINTER_TRAINING_FAQS,
  CurriculumModule,
} from '../data/winter-training';

// ── Interactive Module Blueprint Component ──────────────────────────────
function ModuleBlueprintCard({
  module,
  index,
  isExpanded,
  onToggle,
}: {
  module: CurriculumModule;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const phaseNumbers = ['01', '02', '03', '04', '05'];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl ${
        isExpanded
          ? 'bg-slate-900/90 border-amber-500/60 shadow-xl shadow-amber-500/10'
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/70'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
              PHASE {phaseNumbers[index]}
            </span>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              // ARCHITECTURE
            </span>
          </div>

          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate flex items-center gap-2">
              <span>{module.title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 truncate">
              {module.focus}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 mt-1 sm:mt-0">
          {module.lab.endpoints && module.lab.endpoints.length > 0 && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              {module.lab.endpoints[0]}
            </span>
          )}
          <span className="text-xs font-medium text-amber-400 hidden sm:inline">
            {isExpanded ? 'Collapse' : 'Inspect Architecture'}
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-slate-400 border border-slate-700 transition-transform duration-300 ${
              isExpanded ? 'rotate-180 bg-amber-500/20 text-amber-400 border-amber-500/40' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-fade-in">
          <p className="text-sm text-slate-300 leading-relaxed">
            {module.description}
          </p>

          {/* Topics Covered */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Architectural Implementations</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {module.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-On Lab Card */}
          <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Mission Lab Deliverable
                </span>
              </div>
              {module.lab.endpoints && module.lab.endpoints.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {module.lab.endpoints.map((ep) => (
                    <span
                      key={ep}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    >
                      {ep}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h6 className="text-sm font-bold text-white mb-1.5">
              {module.lab.title}
            </h6>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {module.lab.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {module.lab.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FAQ Item Component ───────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-md transition-colors">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <span className="text-sm sm:text-base font-bold text-slate-200 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-amber-400 flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180 text-amber-300' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-3 animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

// ── MAIN PROGRAM VIEW ────────────────────────────────────────────────────
export default function ProgramsPage() {
  const searchParams = useSearchParams();
  const isPaymentSuccess = searchParams.get('payment') === 'success';
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 font-sans relative overflow-x-hidden">
      <Header />

      {/* ── High-Tech Cyber Ambient Lighting & Background Grid ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-[600px] left-[-150px] w-[600px] h-[600px] bg-sky-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[1300px] right-[-150px] w-[650px] h-[650px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[2200px] left-1/3 w-[700px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />
        {/* Subtle Cyberpunk Mesh Grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.25) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10">
        {isPaymentSuccess ? (
          /* ===================== ENROLLMENT CONFIRMATION HERO ===================== */
          <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <WinterTrainingRegistrationForm />
            </div>
          </section>
        ) : (
          <>
            {/* ===================== HERO SECTION ===================== */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Live Operational Status Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-mono font-semibold mb-8 shadow-lg shadow-amber-500/10 backdrop-blur-md animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>STARTING DECEMBER 2026 // 1-MONTH IN-PERSON COHORT</span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-300 font-sans flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Guwahati Campus
              </span>
            </div>

            {/* Main Cybernetic Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6">
              Engineer{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                Autonomous AI Agents
              </span>
              <br />
              <span className="text-white">With Python &amp; FastAPI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
              Move beyond toy ChatGPT wrapper scripts. Master <strong>cyclical LangGraph state machines</strong>,
              deconstruct <strong>vector RAG from mathematical scratch</strong>, and deploy
              high-throughput <strong>async FastAPI microservices</strong> with zero black boxes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
                <span>Claim Your Spot &middot; &#8377;499</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#curriculum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-amber-500/50 font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Explore Curriculum</span>
              </a>
            </div>

            {/* High-Impact Stat Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left max-w-5xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">01 // DURATION</span>
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">1-Month Program</div>
                <p className="text-xs text-slate-400">Structured 4-week cohort with live coding &amp; mentor guidance.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-sky-400">02 // MECHANICS</span>
                  <Workflow className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">Zero Black Boxes</div>
                <p className="text-xs text-slate-400">Implement vector embeddings &amp; cosine math before frameworks.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">03 // QUALITY</span>
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">Production Rigor</div>
                <p className="text-xs text-slate-400">Pydantic v2 data contracts, ASGI streaming &amp; Pytest suites.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-400">04 // OUTCOME</span>
                  <Rocket className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">Live Capstone</div>
                <p className="text-xs text-slate-400">Deploy an enterprise knowledge assistant demo to your GitHub.</p>
              </div>
            </div>

            {/* Offline Campus Location Banner */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left max-w-5xl mx-auto">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Office Location
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      In-Person
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    TigmaMinds Pvt Ltd, 4th Floor, Prithvi Centre, GS Rd, South Sarania, Lachit Nagar, Guwahati, Assam 781007
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Equipped with dedicated workstation setups, high-throughput network access, and mentor code review rooms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ===================== PARADIGM SHIFT: GENAI 1.0 VS AGENTIC 2.0 ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                The 2026 Architectural Shift
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-3">
                Why Toy Wrappers Fail in Production
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Comparing standard YouTube tutorial bots against the enterprise-grade agentic systems you will construct in this cohort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old GenAI 1.0 */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-red-500/20 backdrop-blur-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                    Legacy GenAI 1.0 (Toy Bots)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                    Fragile
                  </span>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Single-shot prompt wrappers with no decision loops or self-healing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Silent hallucinations when information is missing from documents.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Synchronous blocking web routes that crash under 5+ concurrent users.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Opaque frameworks where you cannot debug embeddings or vector cosine math.</span>
                  </li>
                </ul>
              </div>

              {/* Modern Agentic AI 2.0 */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden shadow-xl shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Modern Agentic AI (What You Build)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                    Deterministic &middot; Tested
                  </span>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Cyclical LangGraph state machines</strong> with tool-calling and checkpoint memory.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Deterministic RAG with exact citations</strong> and strict refusal fallbacks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Async FastAPI + ASGI streaming</strong> serving hundreds of concurrent tokens smoothly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Automated Pytest test suites</strong> testing edge cases and Pydantic schema boundaries.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </>
    )}

        {/* ===================== CURRICULUM SYLLABUS SECTION ===================== */}
        <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Structured Engineering Progression</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                The 5 Architectural Milestones
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Every phase pairs foundational systems theory with an intensive live lab. You code, inspect execution traces, and debug real edge cases.
              </p>
            </div>

            {/* Module Blueprints */}
            <div className="space-y-4">
              {WINTER_TRAINING_MODULES.map((module, idx) => (
                <ModuleBlueprintCard
                  key={module.id}
                  module={module}
                  index={idx}
                  isExpanded={activeModuleIndex === idx}
                  onToggle={() => setActiveModuleIndex(activeModuleIndex === idx ? -1 : idx)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CAPSTONE ENTERPRISE SHOWCASE ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/70 border-t border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Rocket className="w-3.5 h-3.5" />
                <span>Featured Capstone Project</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Production Company Knowledge Assistant
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Synthesize all 5 modules into a production-grade AI knowledge copilot built over real document corpuses with strict factual grounding.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                      Live Portfolio Demonstration
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                      End-to-End System Blueprint
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>FastAPI + Chroma + LangGraph</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 divide-y divide-slate-800/80">
                {CAPSTONE_LAYERS.map((layer) => (
                  <div key={layer.step} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {layer.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-base font-bold text-white">
                          {layer.title}
                        </h4>
                        {layer.route && (
                          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-amber-300 border border-slate-700">
                            {layer.route}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                        {layer.description}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{layer.keyFeature}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== PRODUCTION TECH STACK ===================== */}
        <section className="py-20 border-y border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                Industry Standard Arsenal
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                The Modern Agentic AI Tech Stack
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TECH_STACK.map((item) => (
                <div
                  key={item.name}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm hover:border-amber-500/40 transition duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-amber-400 mb-1.5">
                    {item.role}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== GRADUATE CAPABILITIES & OUTCOMES ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Career Portfolio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                What You Will Own &amp; Demonstrate
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Concrete engineering capabilities you walk away with — ready to showcase in technical interviews and deploy in production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GRADUATE_OUTCOMES.map((outcome, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {outcome}
                  </p>
                </div>
              ))}

              {/* Bonus Portfolio Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex items-start gap-3.5 md:col-span-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Production-Grade GitHub Repository &amp; Verified Credential
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Walk away with a clean, documented GitHub repository featuring virtual environment setup, Pydantic data models, vector retrieval benchmarks, and a running FastAPI ASGI service you can demonstrate live during company hiring rounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!isPaymentSuccess && (
          <>
            {/* ===================== PROGRAM INVESTMENT & REGISTRATION POLICY ===================== */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/70 scroll-mt-16">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                    <BadgePercent className="w-4 h-4 text-amber-400" />
                    <span>Program Investment &amp; Early Bird Benefits</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    Program Tuition &amp; Seat Confirmation
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Clear, transparent pricing. Reserve your seat today with a nominal registration fee that is 100% deducted from your final tuition.
                  </p>
                </div>

                {/* Main Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Card 1: Total Program Fee */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 to-slate-600" />
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Total Program Fee
                      </span>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">&#8377;4,999</span>
                        <span className="text-xs text-slate-400 font-mono">/ ALL-INCLUSIVE</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        Complete 5-phase engineering curriculum across a 1-month intensive program, daily live coding labs, 1-on-1 mentor code reviews, capstone repository, and verified certificate.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Comprehensive masterclass &middot; Zero hidden fees</span>
                    </div>
                  </div>

                  {/* Card 2: Early Registration Discount */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-amber-500/40 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden shadow-xl shadow-amber-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        LIMITED SEATS
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                        Early Registration Perk
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                        Early Bird Discount
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        Early registrations receive exclusive tuition discounts and priority placement in the upcoming batch, strictly capped at 30 engineers for personalized attention.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Guaranteed cohort placement for early applicants</span>
                    </div>
                  </div>

                  {/* Card 3: Seat Confirmation & Deduction */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden shadow-xl shadow-emerald-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        100% DEDUCTIBLE
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                        Confirm Seat Today
                      </span>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">&#8377;499</span>
                        <span className="text-xs text-slate-400 font-mono">/ REGISTRATION PASS</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        Lock in your admission today by paying the &#8377;499 registration fee. Your seat is confirmed immediately upon successful payment.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Deducted from final &#8377;4,999 tuition later</span>
                    </div>
                  </div>
                </div>

                {/* How Seat Confirmation & Deduction Works - Informational Callout */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                        How the Seat Confirmation &amp; Fee Deduction Works:
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        To guarantee your spot, pay the registration fee today (<strong>&#8377;499</strong>). This registration payment will be <strong>100% deducted from the final &#8377;4,999 program fee</strong> when the cohort starts. You only pay the balance later, with your early bird discount applied!
                      </p>
                    </div>
                  </div>
                  <a
                    href="#register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-amber-500/20 transition cursor-pointer flex-shrink-0"
                  >
                    <span>Confirm Seat &middot; &#8377;499</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* ===================== REGISTRATION PORTAL WITH FORM ===================== */}
            <section id="register" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
              <div className="max-w-3xl mx-auto">
                {/* Header Badge & Callout */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-mono font-bold mb-3 shadow-lg shadow-amber-500/10">
                    <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>1-MONTH WINTER COHORT // STARTING DECEMBER &middot; ENROLLMENT PORTAL</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                    Secure Your Seat in the Cohort
                  </h2>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto">
                    Program Fee: &#8377;4,999 (Early registrations qualify for discounts). Pay &#8377;499 registration fee today to confirm your seat — 100% deducted from the final fee when the cohort begins.
                  </p>
                </div>

                {/* Glowing Cyber Registration Container */}
                <div className="rounded-3xl border border-amber-500/30 bg-slate-950/90 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-amber-500/10 relative">
                  <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono text-[11px] font-bold uppercase tracking-wider shadow-md">
                    &#9679; 30 SEATS MAXIMUM
                  </div>
                  <WinterTrainingRegistrationForm />
                </div>
              </div>
            </section>
          </>
        )}

        {/* ===================== FREQUENTLY ASKED QUESTIONS ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/60">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-400">
                Key details about schedule, live code reviews, and technology requirements.
              </p>
            </div>

            <div className="space-y-3">
              {WINTER_TRAINING_FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ===================== OTHER TMA ACADEMY PROGRAMS ===================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Explore Other Academy Offerings
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                From continuous school STEM curricula to comprehensive 24-week career bootcamps.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div id="school-program" className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Grades 6–12
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 mb-2">
                    12-Month Mentored Curriculum
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Continuous year-round STEM learning across Robotics, Arduino, Python, and Creative Coding with dedicated cohorts and monthly projects.
                  </p>
                </div>
                <Link
                  href="/curriculum"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:underline"
                >
                  View 12-Month Curriculum <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div id="bootcamp" className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                    Career Changers &amp; Grads
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 mb-2">
                    24-Week Career Bootcamp
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Full-Stack Development, AI &amp; Machine Learning, or Cloud &amp; DevOps. Production portfolio, mock interviews, and industry job referrals.
                  </p>
                </div>
                <Link
                  href="/curriculum/bootcamp"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-400 hover:underline"
                >
                  View 24-Week Bootcamp <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
