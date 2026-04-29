'use client';
import { useState, useMemo } from 'react';

/** Seeded pseudo-random (mulberry32) for reproducible data */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

interface DataPoint { x: number; y: number }

function generateData(corrType: string): DataPoint[] {
  const rng = mulberry32(42);
  const n = 20;
  const pts: DataPoint[] = [];

  for (let i = 0; i < n; i++) {
    const x = 10 + rng() * 80;
    const noise = (rng() - 0.5) * 2;

    let y: number;
    switch (corrType) {
      case 'strong_pos':
        y = 5 + 0.9 * x + noise * 8;
        break;
      case 'weak_pos':
        y = 20 + 0.4 * x + noise * 25;
        break;
      case 'none':
        y = 20 + rng() * 60;
        break;
      case 'negative':
        y = 90 - 0.85 * x + noise * 10;
        break;
      default:
        y = 50;
    }
    pts.push({ x, y: Math.max(5, Math.min(95, y)) });
  }
  return pts;
}

/** Least-squares regression: returns { slope, intercept, r } */
function leastSquares(pts: DataPoint[]) {
  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
  for (const p of pts) {
    sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x; sy2 += p.y * p.y;
  }
  const denom = n * sx2 - sx * sx;
  const slope = denom === 0 ? 0 : (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  const rNum = n * sxy - sx * sy;
  const rDen = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
  const r = rDen === 0 ? 0 : rNum / rDen;
  return { slope, intercept, r };
}

const CORR_TYPES = [
  { id: 'strong_pos', label: 'Strong positive (r≈0.9)', desc: 'As x increases, y increases consistently. Most points cluster tightly around the regression line.' },
  { id: 'weak_pos', label: 'Weak positive (r≈0.4)', desc: 'There is a slight upward trend, but points are widely scattered. The relationship exists but is noisy.' },
  { id: 'none', label: 'None (r≈0)', desc: 'No linear relationship between x and y. The points form a random cloud with no clear trend.' },
  { id: 'negative', label: 'Negative (r≈-0.8)', desc: 'As x increases, y decreases. The negative slope shows an inverse relationship.' },
];

export default function CorrelationRegressionDiagram() {
  const [corrIdx, setCorrIdx] = useState(0);
  const [showResiduals, setShowResiduals] = useState(false);
  const corr = CORR_TYPES[corrIdx];

  const data = useMemo(() => generateData(corr.id), [corr.id]);
  const { slope, intercept, r } = useMemo(() => leastSquares(data), [data]);

  const W = 400, H = 280;
  const padL = 40, padR = 20, padT = 40, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Data range: 0-100 for both axes
  const toSvgX = (v: number) => padL + (v / 100) * plotW;
  const toSvgY = (v: number) => padT + plotH - (v / 100) * plotH;

  // Regression line endpoints
  const regY = (x: number) => slope * x + intercept;
  const lineX1 = 0, lineX2 = 100;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Correlation type buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {CORR_TYPES.map((c, i) => (
          <button key={c.id} onClick={() => { setCorrIdx(i); setShowResiduals(false); }}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${i === corrIdx ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Residuals toggle */}
      <div className="flex justify-center mb-2">
        <button onClick={() => setShowResiduals(!showResiduals)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${showResiduals ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
          {showResiduals ? 'Hide residuals' : 'Show residuals'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label={`Scatter plot with ${corr.label} correlation`}>
        <rect width={W} height={H} className="fill-white dark:fill-gray-900" rx="8" />
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          Correlation &amp; Regression
        </text>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={toSvgX(v)} y1={padT} x2={toSvgX(v)} y2={padT + plotH} stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1={padL} y1={toSvgY(v)} x2={padL + plotW} y2={toSvgY(v)} stroke="#e5e7eb" strokeWidth="0.5" />
            <text x={toSvgX(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-gray-500">{v}</text>
            <text x={padL - 5} y={toSvgY(v) + 3} textAnchor="end" fontSize="8" className="fill-gray-400 dark:fill-gray-500">{v}</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth="1" />
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth="1" />

        {/* Regression line */}
        <line x1={toSvgX(lineX1)} y1={toSvgY(regY(lineX1))} x2={toSvgX(lineX2)} y2={toSvgY(regY(lineX2))}
          stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />

        {/* Residuals */}
        {showResiduals && data.map((pt, i) => {
          const predicted = regY(pt.x);
          return (
            <line key={`r${i}`} x1={toSvgX(pt.x)} y1={toSvgY(pt.y)} x2={toSvgX(pt.x)} y2={toSvgY(predicted)}
              stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
          );
        })}

        {/* Data points */}
        {data.map((pt, i) => (
          <circle key={i} cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r="4"
            fill="#3b82f6" stroke="#fff" strokeWidth="1" opacity="0.85" />
        ))}

        {/* r value display */}
        <rect x={W - 105} y={padT + 2} width="98" height="28" rx="5" className="fill-gray-50 dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
        <text x={W - 56} y={padT + 14} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">Correlation</text>
        <text x={W - 56} y={padT + 26} textAnchor="middle" fontSize="14" fontWeight="800"
          className={r > 0.3 ? 'fill-blue-600 dark:fill-blue-400' : r < -0.3 ? 'fill-red-600 dark:fill-red-400' : 'fill-gray-500 dark:fill-gray-400'}>
          r = {r.toFixed(3)}
        </text>

        {/* Axis labels */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">x</text>
        <text x={12} y={padT + plotH / 2} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400"
          transform={`rotate(-90, 12, ${padT + plotH / 2})`}>y</text>

        {/* Legend */}
        <line x1={padL + 5} y1={padT + 6} x2={padL + 18} y2={padT + 6} stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
        <text x={padL + 22} y={padT + 9} fontSize="8" className="fill-gray-500 dark:fill-gray-400">Regression line</text>
        {showResiduals && (
          <>
            <line x1={padL + 5} y1={padT + 18} x2={padL + 18} y2={padT + 18} stroke="#f59e0b" strokeWidth="1.5" />
            <text x={padL + 22} y={padT + 21} fontSize="8" className="fill-gray-500 dark:fill-gray-400">Residuals</text>
          </>
        )}
      </svg>

      <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>r = {r.toFixed(3)}</strong> &mdash; {corr.desc}</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Regression: y = {slope.toFixed(2)}x + {intercept.toFixed(2)}
          {showResiduals && ' — The amber lines show residuals: the vertical distance from each point to the regression line.'}
        </p>
      </div>
    </div>
  );
}
