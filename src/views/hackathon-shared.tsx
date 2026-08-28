'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Code2,
  Gift,
  MapPin,
  Maximize2,
  Trophy,
  Users,
} from 'lucide-react';
import hackathon from '../data/hackathon.json';

const detailItems = [
  { icon: MapPin, label: 'Location', value: hackathon.location },
  { icon: Calendar, label: 'Dates', value: hackathon.dates },
  { icon: Users, label: 'Team', value: hackathon.teamSize },
  { icon: Clock, label: 'Duration', value: hackathon.duration },
  { icon: MapPin, label: 'Venue', value: hackathon.venue },
  { icon: Trophy, label: 'Prize Pool', value: hackathon.prizePool },
];

export function HackathonHero({ actions }: { actions: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="relative max-w-5xl mx-auto animate-fade-in">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-amber-300 mb-4">
          {hackathon.organizedBy}
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
            {hackathon.title}
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
          {hackathon.tagline}
        </p>
        <div className="flex flex-wrap items-center gap-4 animate-slide-up">{actions}</div>
      </div>
    </section>
  );
}

export function HackathonEventDetails() {
  return (
    <>
      <section id="details" className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400 mb-2">
                Event brief
              </p>
              <h2 className="text-3xl font-bold text-white">Hackathon Details</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              live / guwahati
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {detailItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-xl border border-white/15 bg-slate-950/40 backdrop-blur-sm p-5 transition-colors hover:border-amber-400/50 hover:bg-slate-950/55"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 opacity-80" />
                  <div className="flex items-center gap-2 text-amber-400 mb-2 pl-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                  </div>
                  <p className="text-white font-semibold pl-2">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <DetailBlock title="Eligibility" body={hackathon.eligibility} />
              <DetailBlock title="Format" body={hackathon.format} />
              <DetailBlock title="Event Category" body={hackathon.eventCategory} />
              <DetailBlock title="Development Objective" body={hackathon.developmentObjective} />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Mode of Conduct</h3>
                <ol className="space-y-2">
                  {hackathon.modeOfConduct.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-slate-300">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DetailBlock title="Certificates" body={hackathon.certificates} />
              <DetailBlock title="Goodies & Mentorship" body={hackathon.goodiesAndMentorship} />
              <DetailBlock title="Theme / Problem Statements" body={hackathon.theme} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="relative max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">What You Can Build</h2>
            </div>
            <ul className="space-y-3">
              {hackathon.whatYouCanBuild.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Prize Details</h2>
            </div>
            <p className="text-slate-200 mb-4">
              Total Prize Pool: <strong className="text-amber-300">{hackathon.prizes.totalPool}</strong>
            </p>
            <ul className="space-y-2 mb-6">
              {hackathon.prizes.categories.map((category) => (
                <li key={category} className="flex items-center gap-2 text-slate-200">
                  <Award className="w-4 h-4 text-amber-400" />
                  {category}
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 text-sm text-slate-400">
              <Gift className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
              <p>{hackathon.goodiesAndMentorship}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Judging Criteria</h2>
          <p className="text-slate-400 mb-8 max-w-3xl">{hackathon.finalEvaluation}</p>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <table className="w-full text-left">
              <thead className="bg-white/[0.06]">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold text-amber-300">Criteria</th>
                  <th className="px-5 py-3 text-sm font-semibold text-amber-300">Weightage</th>
                </tr>
              </thead>
              <tbody>
                {hackathon.judgingCriteria.map((row) => (
                  <tr key={row.criteria} className="border-t border-white/10">
                    <td className="px-5 py-3 text-slate-200">{row.criteria}</td>
                    <td className="px-5 py-3 font-semibold text-amber-300 font-mono">{row.weightage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{body}</p>
    </div>
  );
}

export function HackPageBackdrop() {
  const matrixColumns = [
    { left: '3%', delay: '0s', duration: '11s', text: '01001101\n10110010\n11010101\n00101110\n11100011\n01011001' },
    { left: '11%', delay: '2.2s', duration: '14s', text: 'A9F3\n2C10\n7BE1\n44D0\n91AF\n0E62' },
    { left: '22%', delay: '4s', duration: '12s', text: 'fn()\n=> {}\nawait\nasync\nbuild\nship' },
    { left: '81%', delay: '1s', duration: '13s', text: '101010\n010101\n111000\n000111\n100110\n011001' },
    { left: '90%', delay: '3.5s', duration: '15s', text: 'hack()\npush()\npull()\nmerge\ndeploy\nlive' },
    { left: '96%', delay: '5.5s', duration: '10s', text: '0xFF\n0xA1\n0x3C\n0x90\n0x2B\n0xD4' },
  ];

  const eqBars = [40, 70, 35, 90, 55, 80, 45, 65, 30, 75, 50, 85];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_42%,_#020617_100%)]" />

      <div
        className="absolute inset-0 opacity-50 hack-grid-drift"
        style={{
          backgroundImage:
            'linear-gradient(rgba(251,146,60,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute inset-0 opacity-30 hack-grid-drift-alt"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-500/25 blur-3xl hack-float-x" />
      <div className="absolute right-[-4rem] top-1/3 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl hack-float-slow" />
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl hack-drift-diag" />

      {matrixColumns.map((col) => (
        <pre
          key={col.left}
          className="hack-matrix absolute top-0 font-mono text-[11px] sm:text-xs leading-5 text-amber-300/70 whitespace-pre"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          {col.text}
        </pre>
      ))}

      <svg
        className="absolute left-1/2 top-1/2 h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 opacity-80"
        viewBox="0 0 720 720"
        fill="none"
      >
        <path
          className="hack-dash"
          d="M80 360 C180 220, 300 220, 360 360 C420 500, 540 500, 640 360"
          stroke="rgba(251,146,60,0.65)"
          strokeWidth="2"
        />
        <path
          className="hack-dash-slow"
          d="M120 180 H360 V540 H600"
          stroke="rgba(56,189,248,0.55)"
          strokeWidth="2"
        />
        <path
          className="hack-dash"
          d="M160 520 C280 420, 440 420, 560 200"
          stroke="rgba(251,146,60,0.5)"
          strokeWidth="1.8"
        />

        {[
          [80, 360],
          [360, 360],
          [640, 360],
          [120, 180],
          [360, 180],
          [360, 540],
          [600, 540],
          [560, 200],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="6"
            fill={i % 2 === 0 ? 'rgb(251 146 60)' : 'rgb(56 189 248)'}
            className="hack-pulse"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}

        <circle r="5" fill="#fbbf24">
          <animateMotion
            dur="5.5s"
            repeatCount="indefinite"
            path="M80 360 C180 220, 300 220, 360 360 C420 500, 540 500, 640 360"
          />
        </circle>
        <circle r="4.5" fill="#38bdf8">
          <animateMotion dur="6.5s" repeatCount="indefinite" begin="1s" path="M120 180 H360 V540 H600" />
        </circle>
        <circle r="4.5" fill="#fb923c">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            begin="2s"
            path="M160 520 C280 420, 440 420, 560 200"
          />
        </circle>
      </svg>

      <div className="absolute right-[8%] top-[18%] h-44 w-44">
        <span className="absolute inset-0 rounded-full border-2 border-amber-400/70 hack-radar" />
        <span
          className="absolute inset-0 rounded-full border-2 border-amber-400/50 hack-radar"
          style={{ animationDelay: '1.1s' }}
        />
        <span
          className="absolute inset-0 rounded-full border border-sky-400/40 hack-radar"
          style={{ animationDelay: '2.2s' }}
        />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 hack-pulse" />
      </div>
      <div className="absolute left-[6%] bottom-[22%] h-36 w-36">
        <span className="absolute inset-0 rounded-full border-2 border-sky-400/60 hack-radar" />
        <span
          className="absolute inset-0 rounded-full border border-sky-400/40 hack-radar"
          style={{ animationDelay: '1.4s' }}
        />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 hack-pulse" />
      </div>

      <svg
        className="absolute left-[4%] top-[42%] h-40 w-40 opacity-60 hack-hex-spin"
        viewBox="0 0 100 100"
        fill="none"
      >
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" stroke="rgb(251 146 60)" strokeWidth="2" />
        <polygon
          points="50,22 74,36 74,64 50,78 26,64 26,36"
          stroke="rgb(56 189 248)"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
      </svg>

      <div className="absolute left-[5%] top-[14%] hidden md:block w-[210px] rounded-lg border border-amber-400/30 bg-slate-950/80 backdrop-blur-sm overflow-hidden opacity-90 hack-float">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/10 bg-white/[0.03]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[9px] text-slate-400">build.sh</span>
        </div>
        <div className="px-3 py-2 font-mono text-[10px] text-amber-200/90 space-y-1">
          <p>
            <span className="text-emerald-400">$</span>{' '}
            <span className="hack-type inline-block align-bottom">npm run hackathon</span>
            <span className="hack-blink text-amber-300">▋</span>
          </p>
          <p className="text-sky-300/80">compiling prototype...</p>
          <p className="text-emerald-300/80">ready on :2026</p>
        </div>
      </div>

      <div className="absolute right-[4%] bottom-[16%] hidden md:block w-[230px] rounded-lg border border-sky-400/30 bg-slate-950/80 backdrop-blur-sm overflow-hidden opacity-90 hack-float-delayed">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/10 bg-white/[0.03]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[9px] text-slate-400">telemetry.log</span>
        </div>
        <div className="px-3 py-2 font-mono text-[10px] space-y-1">
          <p className="text-slate-300">
            latency <span className="text-amber-300">12ms</span>
          </p>
          <p className="text-slate-300">
            nodes <span className="text-sky-300">online</span>
          </p>
          <p className="text-slate-300">
            stream <span className="hack-blink text-emerald-300">●</span> live
          </p>
        </div>
      </div>

      <div className="absolute right-[7%] top-[46%] hidden lg:flex h-16 items-end gap-1 opacity-80">
        {eqBars.map((h, i) => (
          <span
            key={i}
            className="hack-bar w-1.5 rounded-sm bg-gradient-to-t from-amber-500 to-sky-400"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 w-28 hack-scan-x bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-20 hack-scan-x-delayed bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 hack-scan bg-gradient-to-b from-amber-400/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 hack-scan-delayed bg-gradient-to-b from-sky-400/15 to-transparent" />

      <div className="absolute inset-0 overflow-hidden font-mono text-[11px] sm:text-sm select-none">
        <span className="hack-float absolute left-[28%] top-[20%] text-amber-200/60">
          {'const build = () => innovate();'}
        </span>
        <span className="hack-float-delayed absolute right-[22%] top-[30%] text-sky-200/55">
          {'while (idea) { ship(); }'}
        </span>
        <span className="hack-float-slow absolute left-[30%] top-[70%] text-amber-100/50">
          {'git commit -m "prototype"'}
        </span>
        <span className="hack-float-x absolute right-[26%] top-[68%] text-orange-200/50">
          {'{ status: "building" }'}
        </span>
      </div>
    </div>
  );
}

export function TigmaMindsWordmark({
  className = '',
  size = 'md',
}: {
  className?: string;
  size?: 'md' | 'lg';
}) {
  const height = size === 'lg' ? 'h-[clamp(2.1rem,4.8vw,3.5rem)]' : 'h-[clamp(1.35rem,2.4vw,2rem)]';

  return (
    <svg
      viewBox="0 0 470 90"
      className={`w-auto ${height} ${className}`}
      overflow="visible"
      role="img"
      aria-label="TigmaMinds"
    >
      <text
        x="0"
        y="76"
        fill="#E2B23A"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="500"
        letterSpacing="9"
      >
        <tspan fontSize="70">T</tspan>
        <tspan fontSize="52">IGMA</tspan>
        <tspan fontSize="70">M</tspan>
        <tspan fontSize="52">INDS</tspan>
      </text>
    </svg>
  );
}

export function VenueFullscreenButton({ className = '' }: { className?: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* Fullscreen can be blocked by the browser; the page still works. */
    }
  }, []);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        void toggleFullscreen();
      }
    };
    sync();
    document.addEventListener('fullscreenchange', sync);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      window.removeEventListener('keydown', onKey);
    };
  }, [toggleFullscreen]);

  if (isFullscreen) return null;

  return (
    <button
      type="button"
      onClick={() => void toggleFullscreen()}
      className={`inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 p-2 text-slate-200 hover:bg-white/10 ${className}`}
      aria-label="Enter fullscreen"
    >
      <Maximize2 className="h-4 w-4" />
    </button>
  );
}
