import { useState, useEffect } from 'react';

// ── One Cell Becomes Two ─────────────────────────────────────
// Animated mitosis cycling through all phases:
// Interphase → Prophase → Metaphase → Anaphase → Telophase → Cytokinesis
// Chromosomes condense, line up, split, and two daughter cells form.
// Phase label updates; click next/prev to step through manually.

type Phase = 'interphase' | 'prophase' | 'metaphase' | 'anaphase' | 'telophase' | 'cytokinesis';

const PHASES: Phase[] = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];

const PHASE_INFO: Record<Phase, { label: string; desc: string; duration: string }> = {
  interphase: { label: 'Interphase', desc: 'DNA replicates; cell grows.', duration: '~22 hours (90% of cycle)' },
  prophase: { label: 'Prophase', desc: 'Chromosomes condense; nuclear membrane breaks down; spindle fibres form.', duration: '~30 min' },
  metaphase: { label: 'Metaphase', desc: 'Chromosomes line up at the cell equator.', duration: '~20 min' },
  anaphase: { label: 'Anaphase', desc: 'Sister chromatids pulled apart to opposite poles.', duration: '~5 min' },
  telophase: { label: 'Telophase', desc: 'Two new nuclei form; chromosomes decondense.', duration: '~30 min' },
  cytokinesis: { label: 'Cytokinesis', desc: 'Cytoplasm pinches into two daughter cells.', duration: '~30 min' },
};

export default function MitosisDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (paused || !auto) return;
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, [paused, auto]);

  // Auto-advance through phases (~90 ticks per phase)
  useEffect(() => {
    if (!auto) return;
    if (tick > 0 && tick % 90 === 0) {
      setPhaseIdx(p => (p + 1) % PHASES.length);
    }
  }, [tick, auto]);

  const phase = PHASES[phaseIdx];
  const W = 520, H = 340;
  const cx = 260, cy = 170;

  // Progress within current phase (0-1)
  const phaseProgress = auto ? (tick % 90) / 90 : 0.5;

  // Chromosome positions depend on phase
  // 4 chromosomes total (2 pairs)
  type Chromo = { x: number; y: number; condensed: number; separated: boolean };

  const getChromosomes = (): Chromo[] => {
    if (phase === 'interphase') {
      // Loose DNA inside nucleus
      return [
        { x: cx - 20, y: cy - 10, condensed: 0, separated: false },
        { x: cx + 15, y: cy + 5, condensed: 0, separated: false },
        { x: cx - 5, y: cy + 20, condensed: 0, separated: false },
        { x: cx + 25, y: cy - 15, condensed: 0, separated: false },
      ];
    }
    if (phase === 'prophase') {
      // Chromosomes condensing — appear as X shapes scattering
      return [
        { x: cx - 30, y: cy - 20, condensed: phaseProgress, separated: false },
        { x: cx + 20, y: cy + 15, condensed: phaseProgress, separated: false },
        { x: cx - 15, y: cy + 25, condensed: phaseProgress, separated: false },
        { x: cx + 30, y: cy - 15, condensed: phaseProgress, separated: false },
      ];
    }
    if (phase === 'metaphase') {
      // Lined up at equator (middle vertical line)
      return [
        { x: cx, y: cy - 40, condensed: 1, separated: false },
        { x: cx, y: cy - 15, condensed: 1, separated: false },
        { x: cx, y: cy + 10, condensed: 1, separated: false },
        { x: cx, y: cy + 35, condensed: 1, separated: false },
      ];
    }
    if (phase === 'anaphase') {
      // Sisters separating — moving to opposite poles
      const t = phaseProgress;
      return [
        { x: cx - t * 70, y: cy - 40, condensed: 1, separated: true },
        { x: cx + t * 70, y: cy - 40, condensed: 1, separated: true },
        { x: cx - t * 70, y: cy - 15, condensed: 1, separated: true },
        { x: cx + t * 70, y: cy - 15, condensed: 1, separated: true },
        { x: cx - t * 70, y: cy + 10, condensed: 1, separated: true },
        { x: cx + t * 70, y: cy + 10, condensed: 1, separated: true },
        { x: cx - t * 70, y: cy + 35, condensed: 1, separated: true },
        { x: cx + t * 70, y: cy + 35, condensed: 1, separated: true },
      ];
    }
    if (phase === 'telophase' || phase === 'cytokinesis') {
      // Two clusters at poles, decondensing
      const condensed = phase === 'telophase' ? 1 - phaseProgress * 0.5 : 0.3;
      return [
        { x: cx - 75, y: cy - 20, condensed, separated: true },
        { x: cx - 65, y: cy + 10, condensed, separated: true },
        { x: cx - 80, y: cy + 25, condensed, separated: true },
        { x: cx - 70, y: cy - 5, condensed, separated: true },
        { x: cx + 75, y: cy - 20, condensed, separated: true },
        { x: cx + 65, y: cy + 10, condensed, separated: true },
        { x: cx + 80, y: cy + 25, condensed, separated: true },
        { x: cx + 70, y: cy - 5, condensed, separated: true },
      ];
    }
    return [];
  };

  const chromosomes = getChromosomes();

  // Cell shape — single cell or pinched/split
  const pinchAmount = phase === 'cytokinesis' ? phaseProgress : 0;
  const splitCells = phase === 'cytokinesis' && phaseProgress > 0.7;

  // Nuclear envelope visible?
  const nuclearEnvelope = phase === 'interphase' || phase === 'telophase' || phase === 'cytokinesis';

  return (
    <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-slate-50 dark:from-blue-950 dark:via-purple-950 dark:to-slate-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
          One Cell Becomes Two
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAuto(false); setPhaseIdx(p => (p - 1 + PHASES.length) % PHASES.length); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            ← Prev
          </button>
          <button
            onClick={() => setAuto(!auto)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              auto
                ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            {auto ? 'Auto ●' : 'Manual'}
          </button>
          <button
            onClick={() => { setAuto(false); setPhaseIdx(p => (p + 1) % PHASES.length); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Next →
          </button>
          {auto && (
            <button
              onClick={() => setPaused(!paused)}
              className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
            >
              {paused ? '▶' : '⏸'}
            </button>
          )}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated mitosis — one cell divides into two through phases">

        {/* Cell membrane */}
        {!splitCells ? (
          <path d={`M ${cx - 130},${cy}
            Q ${cx - 130},${cy - 110} ${cx - 60 + pinchAmount * 20},${cy - 110}
            Q ${cx - 10 - pinchAmount * 30},${cy - 100 + pinchAmount * 10} ${cx + 10 + pinchAmount * 30},${cy - 100 + pinchAmount * 10}
            Q ${cx + 60 - pinchAmount * 20},${cy - 110} ${cx + 130},${cy - 110}
            Q ${cx + 130},${cy} ${cx + 130},${cy + 110}
            Q ${cx + 60 - pinchAmount * 20},${cy + 110} ${cx + 10 + pinchAmount * 30},${cy + 100 - pinchAmount * 10}
            Q ${cx - 10 - pinchAmount * 30},${cy + 100 - pinchAmount * 10} ${cx - 60 + pinchAmount * 20},${cy + 110}
            Q ${cx - 130},${cy + 110} ${cx - 130},${cy} Z`}
            fill="#fef9c3" stroke="#fbbf24" strokeWidth="3" opacity="0.4" />
        ) : (
          <>
            {/* Two daughter cells */}
            <ellipse cx={cx - 100} cy={cy} rx={90} ry={100}
              fill="#fef9c3" stroke="#fbbf24" strokeWidth="3" opacity="0.4" />
            <ellipse cx={cx + 100} cy={cy} rx={90} ry={100}
              fill="#fef9c3" stroke="#fbbf24" strokeWidth="3" opacity="0.4" />
          </>
        )}

        {/* Nuclear envelope */}
        {nuclearEnvelope && !splitCells && (
          <ellipse cx={cx} cy={cy} rx={80} ry={60}
            fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
        )}
        {nuclearEnvelope && splitCells && (
          <>
            <ellipse cx={cx - 100} cy={cy} rx={45} ry={40}
              fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
            <ellipse cx={cx + 100} cy={cy} rx={45} ry={40}
              fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          </>
        )}

        {/* Spindle fibres */}
        {(phase === 'metaphase' || phase === 'anaphase') && (
          <g opacity="0.4">
            <circle cx={cx - 120} cy={cy} r="3" fill="#8b5cf6" />
            <circle cx={cx + 120} cy={cy} r="3" fill="#8b5cf6" />
            {[-50, -25, 0, 25, 50].map(dy => (
              <g key={`sp-${dy}`}>
                <line x1={cx - 120} y1={cy} x2={cx} y2={cy + dy}
                  stroke="#8b5cf6" strokeWidth="1" />
                <line x1={cx + 120} y1={cy} x2={cx} y2={cy + dy}
                  stroke="#8b5cf6" strokeWidth="1" />
              </g>
            ))}
          </g>
        )}

        {/* Chromosomes */}
        {chromosomes.map((c, i) => {
          const color = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'][i % 4];
          const condensedLook = c.condensed;

          if (condensedLook < 0.2) {
            // Loose DNA — thin squiggles
            return (
              <path key={`ch-${i}`}
                d={`M ${c.x - 15},${c.y} Q ${c.x},${c.y - 8} ${c.x + 15},${c.y} Q ${c.x + 5},${c.y + 8} ${c.x - 10},${c.y + 5}`}
                fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
            );
          }

          // Condensed — X shape (or I shape if separated)
          const size = 4 + condensedLook * 6;
          if (c.separated) {
            // Single chromatid (I shape)
            return (
              <rect key={`ch-${i}`}
                x={c.x - size * 0.6} y={c.y - size}
                width={size * 1.2} height={size * 2}
                rx={size * 0.3}
                fill={color} stroke={color} strokeWidth="1" opacity="0.9" />
            );
          }
          // X shape (two chromatids joined at centromere)
          return (
            <g key={`ch-${i}`} opacity="0.9">
              <rect x={c.x - size * 0.8} y={c.y - size * 1.2}
                width={size * 0.7} height={size * 2.4}
                rx={size * 0.3}
                fill={color} transform={`rotate(20, ${c.x}, ${c.y})`} />
              <rect x={c.x + size * 0.1} y={c.y - size * 1.2}
                width={size * 0.7} height={size * 2.4}
                rx={size * 0.3}
                fill={color} transform={`rotate(-20, ${c.x}, ${c.y})`} />
              <circle cx={c.x} cy={c.y} r={2} fill="#1e293b" opacity="0.8" />
            </g>
          );
        })}

        {/* Equator line (for metaphase) */}
        {phase === 'metaphase' && (
          <line x1={cx} y1={cy - 80} x2={cx} y2={cy + 80}
            stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
        )}

        {/* Phase label */}
        <text x={W / 2} y={H - 50} textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="14" fontWeight="bold">
          {PHASE_INFO[phase].label}
        </text>
        <text x={W / 2} y={H - 34} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10">
          {PHASE_INFO[phase].desc}
        </text>
        <text x={W / 2} y={H - 20} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Duration: {PHASE_INFO[phase].duration}
        </text>

        {/* Progress dots */}
        <g transform={`translate(${W / 2 - 45}, ${H - 8})`}>
          {PHASES.map((p, i) => (
            <circle key={`dot-${p}`}
              cx={i * 18} cy={0} r={3}
              fill={i === phaseIdx ? '#8b5cf6' : '#cbd5e1'}
              className={i === phaseIdx ? '' : 'dark:fill-gray-700'} />
          ))}
        </g>
      </svg>
    </div>
  );
}
