import { useState } from 'react';

// ── Same Mean, Different Spread ──────────────────────────────
// Interactive std-dev visualiser. Pick a dataset (tight, normal,
// wide); see the values as dots on a number line, the mean as a
// vertical line, and ± 1 std dev shaded. Counter shows σ in real
// time.

interface Dataset {
  name: string;
  values: number[];
  desc: string;
  color: string;
}

const DATASETS: Dataset[] = [
  {
    name: 'Tight',
    values: [147, 148, 149, 150, 151, 152, 153],
    desc: 'Same-age children — all close to mean',
    color: '#10b981',
  },
  {
    name: 'Moderate',
    values: [140, 145, 148, 150, 152, 155, 160],
    desc: 'Mixed ages — some spread',
    color: '#3b82f6',
  },
  {
    name: 'Wide',
    values: [120, 135, 145, 150, 155, 165, 180],
    desc: 'All ages in a school — big spread',
    color: '#f59e0b',
  },
  {
    name: 'Extreme',
    values: [100, 130, 140, 150, 160, 170, 200],
    desc: 'Babies to basketball players',
    color: '#ef4444',
  },
];

function mean(vals: number[]) {
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}
function stdev(vals: number[]) {
  const m = mean(vals);
  const variance = vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length;
  return Math.sqrt(variance);
}

export default function StdDevDiagram() {
  const [idx, setIdx] = useState(0);
  const ds = DATASETS[idx];
  const m = mean(ds.values);
  const s = stdev(ds.values);

  // Chart range: 110 to 200 cm
  const minX = 110, maxX = 200;
  const W = 580, H = 220;
  const padX = 40;
  const plotW = W - padX * 2;
  const xAt = (v: number) => padX + ((v - minX) / (maxX - minX)) * plotW;

  const yDots = 130;

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-emerald-50 dark:from-sky-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          Same Mean, Different Spread
        </p>
        <div className="flex gap-1 flex-wrap">
          {DATASETS.map((d, i) => (
            <button key={d.name}
              onClick={() => setIdx(i)}
              className={`text-xs font-mono px-2.5 py-0.5 rounded transition ${
                idx === i
                  ? 'text-white'
                  : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
              }`}
              style={idx === i ? { background: d.color } : undefined}>
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Standard deviation visualiser: same mean, different spread">

        {/* ± 1σ shaded band */}
        <rect x={xAt(m - s)} y={80} width={xAt(m + s) - xAt(m - s)} height={110}
          fill={ds.color} opacity="0.15" />
        <rect x={xAt(m - s)} y={80} width={xAt(m + s) - xAt(m - s)} height={110}
          fill="none" stroke={ds.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

        {/* σ labels */}
        <text x={xAt(m - s)} y={75} textAnchor="middle" fill={ds.color} fontSize="9" fontWeight="bold">
          −1σ
        </text>
        <text x={xAt(m + s)} y={75} textAnchor="middle" fill={ds.color} fontSize="9" fontWeight="bold">
          +1σ
        </text>

        {/* Mean line */}
        <line x1={xAt(m)} y1={80} x2={xAt(m)} y2={180}
          stroke={ds.color} strokeWidth="2.5" />
        <text x={xAt(m)} y={95} textAnchor="middle" fill={ds.color} fontSize="10" fontWeight="bold">
          mean
        </text>

        {/* X axis */}
        <line x1={padX} y1={yDots} x2={W - padX} y2={yDots}
          stroke="#94a3b8" strokeWidth="1" />

        {/* Axis ticks */}
        {[120, 140, 160, 180, 200].map(v => (
          <g key={v}>
            <line x1={xAt(v)} y1={yDots} x2={xAt(v)} y2={yDots + 4} stroke="#94a3b8" strokeWidth="1" />
            <text x={xAt(v)} y={yDots + 16} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
              {v}
            </text>
          </g>
        ))}
        <text x={W - padX + 5} y={yDots + 4} className="fill-gray-500 dark:fill-gray-400" fontSize="8">cm</text>

        {/* Data points */}
        {ds.values.map((v, i) => (
          <g key={i}>
            {/* Vertical line from dot to mean to show distance */}
            <line x1={xAt(v)} y1={yDots} x2={xAt(v)} y2={yDots - 30 - (i % 3) * 10}
              stroke={ds.color} strokeWidth="0.8" opacity="0.3" />
            <circle cx={xAt(v)} cy={yDots} r="6"
              fill={ds.color} stroke="#1e293b" strokeWidth="1" opacity="0.95" />
            <text x={xAt(v)} y={yDots + 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
              {v}
            </text>
          </g>
        ))}
      </svg>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2 text-center">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Mean</div>
          <div className="font-mono font-bold text-lg text-slate-800 dark:text-slate-100">{m.toFixed(1)}</div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2 text-center border-2" style={{ borderColor: ds.color }}>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: ds.color }}>Std dev (σ)</div>
          <div className="font-mono font-bold text-lg" style={{ color: ds.color }}>{s.toFixed(1)}</div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2 text-center">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Range</div>
          <div className="font-mono font-bold text-lg text-slate-800 dark:text-slate-100">
            {Math.min(...ds.values)}–{Math.max(...ds.values)}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        <strong>{ds.desc}</strong> — same mean (~150), but σ differs hugely. The mean alone hides the spread.
      </p>
    </div>
  );
}
