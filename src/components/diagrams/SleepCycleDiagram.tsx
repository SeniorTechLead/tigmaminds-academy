'use client';
import { useState } from 'react';

type SleepStage = 'Wake' | 'REM' | 'N1' | 'N2' | 'N3';

interface StageInfo {
  label: string;
  description: string;
  color: string;
  yLevel: number; // 0=wake, 1=REM, 2=N1, 3=N2, 4=N3
}

const STAGES: Record<SleepStage, StageInfo> = {
  Wake: { label: 'Wake', description: 'Fully awake, conscious brain activity', color: '#f59e0b', yLevel: 0 },
  REM: { label: 'REM', description: 'Rapid eye movement — vivid dreams, memory consolidation, emotional processing. Brain nearly as active as waking.', color: '#ef4444', yLevel: 1 },
  N1: { label: 'N1 (Light)', description: 'Transition to sleep — 1-5 min. Muscles relax, hypnic jerks possible. Easy to wake.', color: '#22c55e', yLevel: 2 },
  N2: { label: 'N2 (Light)', description: 'Sleep spindles and K-complexes. Body temp drops, heart rate slows. ~50% of total sleep.', color: '#3b82f6', yLevel: 3 },
  N3: { label: 'N3 (Deep)', description: 'Slow-wave sleep — growth hormone released. Glymphatic clearance removes brain waste (amyloid-β). Hardest to wake from. Tissue repair.', color: '#8b5cf6', yLevel: 4 },
};

// 8 hours of sleep cycles (~5 cycles, each ~90 min)
// Simplified sequence: timestamps in minutes and stages
const HYPNOGRAM: { start: number; stage: SleepStage }[] = [
  { start: 0, stage: 'Wake' },
  { start: 5, stage: 'N1' },
  { start: 15, stage: 'N2' },
  { start: 30, stage: 'N3' },
  { start: 60, stage: 'N2' },
  { start: 70, stage: 'REM' },
  { start: 90, stage: 'N1' },
  { start: 95, stage: 'N2' },
  { start: 115, stage: 'N3' },
  { start: 140, stage: 'N2' },
  { start: 150, stage: 'REM' },
  { start: 180, stage: 'N1' },
  { start: 185, stage: 'N2' },
  { start: 200, stage: 'N3' },
  { start: 220, stage: 'N2' },
  { start: 235, stage: 'REM' },
  { start: 270, stage: 'N1' },
  { start: 275, stage: 'N2' },
  { start: 290, stage: 'N3' },
  { start: 305, stage: 'N2' },
  { start: 320, stage: 'REM' },
  { start: 360, stage: 'N1' },
  { start: 365, stage: 'N2' },
  { start: 380, stage: 'REM' },
  { start: 420, stage: 'N2' },
  { start: 440, stage: 'REM' },
  { start: 470, stage: 'N1' },
  { start: 475, stage: 'Wake' },
];

const TOTAL_MIN = 480; // 8 hours

export default function SleepCycleDiagram() {
  const [hovered, setHovered] = useState<SleepStage | null>(null);

  const W = 460, H = 290;
  const mx = 55, mr = 15, mt = 40, mb = 55;
  const pw = W - mx - mr;
  const ph = H - mt - mb;

  const toX = (min: number) => mx + (min / TOTAL_MIN) * pw;
  const stageY = (s: SleepStage) => mt + (STAGES[s].yLevel / 4) * ph;

  // Build step path
  const pathParts: string[] = [];
  for (let i = 0; i < HYPNOGRAM.length; i++) {
    const curr = HYPNOGRAM[i];
    const next = HYPNOGRAM[i + 1];
    const x1 = toX(curr.start);
    const y1 = stageY(curr.stage);
    if (i === 0) pathParts.push(`M ${x1} ${y1}`);
    if (next) {
      const x2 = toX(next.start);
      const y2 = stageY(next.stage);
      pathParts.push(`L ${x2} ${y1}`); // horizontal
      pathParts.push(`L ${x2} ${y2}`); // vertical step
    } else {
      pathParts.push(`L ${toX(TOTAL_MIN)} ${y1}`);
    }
  }

  const info = hovered ? STAGES[hovered] : null;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Sleep cycle hypnogram showing 5 sleep cycles over 8 hours"
      >
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        <text x={W / 2} y={20} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Sleep Hypnogram — 8 Hours
        </text>

        {/* Stage labels on Y axis */}
        {(Object.entries(STAGES) as [SleepStage, StageInfo][]).map(([key, s]) => (
          <g key={key}>
            <line x1={mx - 4} y1={stageY(key)} x2={mx} y2={stageY(key)} stroke="#94a3b8" strokeWidth="1" />
            <text
              x={mx - 8}
              y={stageY(key) + 3}
              textAnchor="end"
              fill={s.color}
              fontSize="8"
              fontWeight="600"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              {s.label}
            </text>
            {/* Grid line */}
            <line x1={mx} y1={stageY(key)} x2={mx + pw} y2={stageY(key)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" className="dark:stroke-slate-700" />
          </g>
        ))}

        {/* X axis — hours */}
        <line x1={mx} y1={mt + ph + 2} x2={mx + pw} y2={mt + ph + 2} stroke="#94a3b8" strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((hr) => (
          <g key={hr}>
            <line x1={toX(hr * 60)} y1={mt + ph + 2} x2={toX(hr * 60)} y2={mt + ph + 6} stroke="#94a3b8" strokeWidth="1" />
            <text x={toX(hr * 60)} y={mt + ph + 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{hr}h</text>
          </g>
        ))}

        {/* Colored background bands for each segment */}
        {HYPNOGRAM.map((seg, i) => {
          const next = HYPNOGRAM[i + 1];
          const x1 = toX(seg.start);
          const x2 = next ? toX(next.start) : toX(TOTAL_MIN);
          const y = stageY(seg.stage);
          const baseY = mt + ph;
          return (
            <rect
              key={i}
              x={x1}
              y={y}
              width={x2 - x1}
              height={baseY - y}
              fill={STAGES[seg.stage].color}
              opacity={hovered === seg.stage ? 0.25 : 0.08}
              onMouseEnter={() => setHovered(seg.stage)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
              className="transition-opacity duration-200"
            />
          );
        })}

        {/* Hypnogram path */}
        <path d={pathParts.join(' ')} fill="none" stroke="#1e293b" className="dark:stroke-white" strokeWidth="2" />

        {/* Hover info box */}
        {info && (
          <foreignObject x={mx} y={H - 50} width={pw} height={46}>
            <div className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-center">
              <span className="text-xs font-semibold" style={{ color: info.color }}>{info.label}: </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">{info.description}</span>
            </div>
          </foreignObject>
        )}

        {!info && (
          <text x={W / 2} y={H - 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
            Hover over a stage name or band for details. Deep sleep decreases; REM increases as the night progresses.
          </text>
        )}
      </svg>
    </div>
  );
}
