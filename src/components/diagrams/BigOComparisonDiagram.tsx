'use client';
import { useState } from 'react';

const COLORS: Record<string, string> = {
  'O(1)': '#22c55e',
  'O(log n)': '#3b82f6',
  'O(n)': '#f59e0b',
  'O(n log n)': '#f97316',
  'O(n²)': '#ef4444',
  'O(2ⁿ)': '#a855f7',
};

const SCALE_OPTIONS = [10, 100, 1000, 10000] as const;

function log2(x: number) {
  return x <= 0 ? 0 : Math.log2(x);
}

function opCount(algo: string, n: number): number {
  switch (algo) {
    case 'O(1)': return 1;
    case 'O(log n)': return Math.max(0, log2(n));
    case 'O(n)': return n;
    case 'O(n log n)': return n <= 0 ? 0 : n * log2(n);
    case 'O(n²)': return n * n;
    case 'O(2ⁿ)': return Math.pow(2, n);
    default: return 0;
  }
}

function formatOps(ops: number): string {
  if (ops >= 1e15) return 'practically infinite';
  if (ops >= 1e12) return `${(ops / 1e12).toFixed(1)}T`;
  if (ops >= 1e9) return `${(ops / 1e9).toFixed(1)}B`;
  if (ops >= 1e6) return `${(ops / 1e6).toFixed(1)}M`;
  if (ops >= 1e3) return `${(ops / 1e3).toFixed(1)}K`;
  return ops.toFixed(ops < 10 ? 1 : 0);
}

function formatTime(ops: number): string {
  const OPS_PER_SEC = 1e9;
  const secs = ops / OPS_PER_SEC;
  if (secs < 1e-6) return `${(secs * 1e9).toFixed(0)} ns`;
  if (secs < 1e-3) return `${(secs * 1e6).toFixed(1)} μs`;
  if (secs < 1) return `${(secs * 1e3).toFixed(2)} ms`;
  if (secs < 60) return `${secs.toFixed(2)} sec`;
  if (secs < 3600) return `${(secs / 60).toFixed(1)} min`;
  if (secs < 86400) return `${(secs / 3600).toFixed(1)} hr`;
  if (secs < 86400 * 365) return `${(secs / 86400).toFixed(0)} days`;
  if (secs < 86400 * 365 * 1e6) return `${(secs / (86400 * 365)).toFixed(0)} years`;
  return 'longer than the universe';
}

export default function BigOComparisonDiagram() {
  const [maxN, setMaxN] = useState<number>(100);
  const [sliderN, setSliderN] = useState<number>(50);

  const ALGOS = maxN <= 30
    ? ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)']
    : ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'];

  // Chart area
  const left = 52, top = 10, right = 390, bottom = 200;
  const chartW = right - left;
  const chartH = bottom - top;

  // Compute Y max: cap at the largest value that matters
  const yMax = Math.max(
    ...ALGOS.map(a => {
      const v = opCount(a, maxN);
      return v > 1e15 ? 1e15 : v;
    }),
    10
  );

  function toX(n: number) {
    return left + (n / maxN) * chartW;
  }
  function toY(ops: number) {
    const capped = Math.min(ops, yMax);
    return bottom - (capped / yMax) * chartH;
  }

  // Build polyline paths
  const STEPS = 80;
  function buildPath(algo: string) {
    const pts: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const n = (i / STEPS) * maxN;
      const ops = opCount(algo, n);
      if (ops > yMax * 1.1) break;
      pts.push(`${toX(n).toFixed(1)},${toY(ops).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  const currentN = Math.round((sliderN / 100) * maxN);
  const sliderX = toX(currentN);

  const context = maxN <= 10
    ? 'Tiny inputs: all algorithms are fast. Differences appear as n grows.'
    : maxN <= 100
    ? 'At moderate sizes, O(n²) starts to slow down noticeably.'
    : maxN <= 1000
    ? 'At n=1,000, O(n²) takes a million operations — 1000x more than O(n).'
    : 'At n=10,000, O(n²) needs 100 million ops. O(n log n) needs only ~130,000.';

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Scale buttons */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">Max n:</span>
        {SCALE_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setMaxN(s); setSliderN(50); }}
            className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
              maxN === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {s.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500 dark:text-slate-400 w-12">n = {currentN}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderN}
          onChange={e => setSliderN(Number(e.target.value))}
          className="flex-1 h-1.5 accent-blue-600"
        />
      </div>

      <svg viewBox="0 0 460 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Big O comparison chart showing algorithm growth rates">
        <rect width="460" height="260" rx="8" className="fill-white dark:fill-slate-950" />

        {/* Axes */}
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="#94a3b8" strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={bottom} stroke="#94a3b8" strokeWidth="1" />
        <text x={left + chartW / 2} y={bottom + 16} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Input size (n)</text>
        <text x={left - 6} y={top + chartH / 2} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" transform={`rotate(-90, ${left - 6}, ${top + chartH / 2})`}>Operations</text>

        {/* Axis tick labels */}
        <text x={left} y={bottom + 12} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">0</text>
        <text x={right} y={bottom + 12} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">{maxN.toLocaleString()}</text>
        <text x={left - 4} y={bottom + 2} textAnchor="end" fontSize="8" className="fill-gray-400 dark:fill-slate-500">0</text>
        <text x={left - 4} y={top + 4} textAnchor="end" fontSize="8" className="fill-gray-400 dark:fill-slate-500">{formatOps(yMax)}</text>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={left} y1={bottom - f * chartH} x2={right} y2={bottom - f * chartH} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" className="dark:stroke-slate-800" />
        ))}

        {/* Curves */}
        {ALGOS.map(algo => (
          <polyline
            key={algo}
            points={buildPath(algo)}
            fill="none"
            stroke={COLORS[algo]}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Vertical slider line */}
        {currentN > 0 && (
          <line x1={sliderX} y1={top} x2={sliderX} y2={bottom} stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        )}

        {/* Dots on curves at current n */}
        {currentN > 0 && ALGOS.map(algo => {
          const ops = opCount(algo, currentN);
          if (ops > yMax * 1.1) return null;
          return (
            <circle key={algo} cx={sliderX} cy={toY(ops)} r="3" fill={COLORS[algo]} stroke="#fff" strokeWidth="1" />
          );
        })}

        {/* Legend */}
        {ALGOS.map((algo, i) => {
          const lx = right + 8;
          const ly = top + 14 + i * 16;
          return (
            <g key={algo}>
              <line x1={lx} y1={ly} x2={lx + 14} y2={ly} stroke={COLORS[algo]} strokeWidth="2" />
              <text x={lx + 18} y={ly + 3} fontSize="9" fill={COLORS[algo]} fontWeight="600">{algo}</text>
            </g>
          );
        })}

        {/* "Goes to infinity" label for O(2^n) when visible but maxN > 20 */}
        {maxN <= 30 && (
          <text x={right - 4} y={top + 10} textAnchor="end" fontSize="8" fill={COLORS['O(2ⁿ)']} fontWeight="600">↑ explodes for n &gt; 30</text>
        )}
      </svg>

      {/* Operation counts table */}
      {currentN > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          {ALGOS.map(algo => {
            const ops = opCount(algo, currentN);
            return (
              <div key={algo} className="flex justify-between" style={{ color: COLORS[algo] }}>
                <span className="font-semibold">{algo}:</span>
                <span>{formatOps(ops)} ops ({formatTime(ops)})</span>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{context}</p>
    </div>
  );
}
