import { useState, useEffect } from 'react';

// ── Hijack, Copy, Burst ───────────────────────────────────────
// Animated lytic cycle: phage lands on bacterium → injects DNA
// → bacterium bloats with copies → bursts → releases 100+ new
// viruses. Continuous loop with phase labels. Release counter.

export default function VirusReplicationDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [burstsCount, setBurstsCount] = useState(0);
  const [virionsReleased, setVirionsReleased] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  // Lytic cycle: one complete cycle = 300 ticks
  // 0-50: phage approaching
  // 50-80: attachment
  // 80-120: DNA injection
  // 120-220: replication (bacterium bloats, interior fills with virions)
  // 220-240: burst
  // 240-300: new phages drift away, clean slate
  const cycleTick = tick % 300;

  const W = 520, H = 340;
  const cx = 260, cy = 170;

  // ── Phase derivations ──
  const approaching = cycleTick < 50;
  const attaching = cycleTick >= 50 && cycleTick < 80;
  const injecting = cycleTick >= 80 && cycleTick < 120;
  const replicating = cycleTick >= 120 && cycleTick < 220;
  const bursting = cycleTick >= 220 && cycleTick < 240;
  const spreading = cycleTick >= 240;

  // Phage (approaches from top-right)
  const phageX = approaching
    ? 460 - (cycleTick / 50) * 150
    : attaching || injecting
    ? 310
    : 310;
  const phageY = approaching
    ? 40 + (cycleTick / 50) * 100
    : 140;
  const phageVisible = cycleTick < 120;

  // Bacterium size (bloats during replication, peaks before burst)
  const bacteriumScale = replicating
    ? 1 + ((cycleTick - 120) / 100) * 0.6
    : bursting
    ? 1.6 - ((cycleTick - 220) / 20) * 1.6
    : 1;

  // Internal viruses (appearing during replication)
  const internalViruses = replicating
    ? Math.min(40, Math.floor((cycleTick - 120) / 2))
    : 0;

  // Burst particles (flying out radially)
  const burstParticles = bursting || spreading
    ? Array.from({ length: 24 }, (_, i) => {
        const t = spreading ? (cycleTick - 220) / 60 : (cycleTick - 220) / 20;
        const angle = (i / 24) * Math.PI * 2;
        const dist = t * 200;
        return {
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          opacity: Math.max(0, 1 - t),
        };
      })
    : [];

  // Fire burst counter once per cycle
  useEffect(() => {
    if (cycleTick === 220) {
      setBurstsCount(c => c + 1);
      setVirionsReleased(v => v + 100);
    }
  }, [cycleTick]);

  const phaseLabel = approaching
    ? '1. Phage approaches bacterium'
    : attaching
    ? '2. Tail fibres attach to host surface'
    : injecting
    ? '3. DNA injected through tail'
    : replicating
    ? '4. Host machinery hijacked — 100s of new viruses assembled'
    : bursting
    ? '5. Cell BURSTS (lysis) — viruses released'
    : '6. New phages drift off to find fresh hosts';

  return (
    <div className="bg-gradient-to-b from-purple-50 via-slate-50 to-rose-50 dark:from-purple-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
          Hijack, Copy, Burst
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-rose-700 dark:text-rose-300 font-mono">
            {burstsCount} bursts • {virionsReleased.toLocaleString()} virions
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated viral lytic cycle — phage attaches, injects DNA, cell bursts, new viruses released">

        {/* ── Bacterium ── */}
        {!spreading && (
          <g transform={`translate(${cx}, ${cy}) scale(${bacteriumScale})`}>
            {/* Cell membrane */}
            <ellipse cx={0} cy={0} rx={55} ry={40}
              fill="#10b981" stroke="#047857" strokeWidth="2" opacity="0.75" />
            {/* Inner cytoplasm tint */}
            <ellipse cx={0} cy={0} rx={48} ry={34}
              fill="#34d399" opacity="0.4" />
            {/* Bacterial DNA (nucleoid) — visible until replication takes over */}
            {cycleTick < 180 && (
              <path d="M -20,-5 Q -10,-15 0,-10 Q 10,-5 15,5 Q 5,15 -10,10 Q -25,5 -20,-5"
                fill="none" stroke="#064e3b" strokeWidth="2" opacity={0.6 - (replicating ? (cycleTick - 120) / 100 : 0) * 0.6} />
            )}

            {/* Viruses being assembled inside */}
            {Array.from({ length: internalViruses }, (_, i) => {
              const a = (i / 40) * Math.PI * 2;
              const r = 10 + (i % 5) * 6;
              return (
                <circle key={`iv-${i}`}
                  cx={Math.cos(a) * r}
                  cy={Math.sin(a) * r}
                  r="2.5" fill="#a855f7" opacity="0.85" />
              );
            })}

            {/* Stress cracks right before burst */}
            {cycleTick > 215 && cycleTick < 220 && (
              [0, 1, 2, 3].map(i => {
                const a = i * (Math.PI / 2);
                return (
                  <line key={`crack-${i}`}
                    x1={0} y1={0}
                    x2={Math.cos(a) * 50} y2={Math.sin(a) * 38}
                    stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
                );
              })
            )}
          </g>
        )}

        {/* Burst flash */}
        {bursting && cycleTick < 230 && (
          <g>
            <circle cx={cx} cy={cy} r={100 - (cycleTick - 220) * 4}
              fill="none" stroke="#fde047" strokeWidth="3" opacity={1 - (cycleTick - 220) / 10} />
            <circle cx={cx} cy={cy} r={60 - (cycleTick - 220) * 2}
              fill="#fde047" opacity={0.4 - (cycleTick - 220) / 25} />
          </g>
        )}

        {/* Released virions after burst */}
        {burstParticles.map((p, i) => (
          <g key={`bp-${i}`} opacity={p.opacity}>
            <circle cx={p.x} cy={p.y} r="4" fill="#a855f7" />
            {/* Tiny tail on each */}
            <line x1={p.x} y1={p.y + 4} x2={p.x} y2={p.y + 10}
              stroke="#7c3aed" strokeWidth="1" />
          </g>
        ))}

        {/* ── Phage (bacteriophage) — T4 style with icosahedral head + tail ── */}
        {phageVisible && (
          <g transform={`translate(${phageX}, ${phageY})`}>
            {/* Head (hexagonal icosahedron) */}
            <polygon points="-8,-14 8,-14 14,-4 8,6 -8,6 -14,-4"
              fill="#a855f7" stroke="#6b21a8" strokeWidth="1.5" />
            {/* DNA inside head — getting smaller as injection proceeds */}
            <circle cx={0} cy={-4} r={injecting ? Math.max(0, 5 - (cycleTick - 80) / 8) : 5}
              fill="#ede9fe" opacity="0.9" />
            {/* Tail sheath */}
            <rect x={-3} y={6} width={6} height={injecting ? 24 - (cycleTick - 80) / 5 : 22}
              fill="#7c3aed" opacity="0.9" />
            {/* Tail fibres (legs) — anchor to bacterium when attached */}
            {[-1, 0, 1].map(i => (
              <line key={`fib-${i}`}
                x1={i * 3} y1={28}
                x2={i * 8} y2={attaching || injecting ? 40 : 36}
                stroke="#581c87" strokeWidth="1.2" />
            ))}

            {/* Injection squirt — DNA flowing out during injection */}
            {injecting && (
              <line x1={0} y1={28} x2={0} y2={42}
                stroke="#fde047" strokeWidth="2" opacity={0.8} strokeDasharray="2,2" />
            )}
          </g>
        )}

        {/* Phase caption */}
        <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">
          {phaseLabel}
        </text>

        {/* Step progress bar */}
        <rect x={40} y={H - 35} width={W - 80} height={4} rx={2}
          fill="#e5e7eb" className="dark:fill-gray-700" />
        <rect x={40} y={H - 35} width={(cycleTick / 300) * (W - 80)} height={4} rx={2}
          fill="#a855f7" />
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" /> Bacteriophage
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Bacterium (host)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> Viral DNA
        </span>
      </div>
    </div>
  );
}
