'use client';
import { useState } from 'react';

/**
 * Shows why we square errors in regression.
 * Two lines through the same data — one good, one bad.
 * Toggle between "sum of errors" (cancels to ~0 for both) and "sum of squared errors" (clearly different).
 */

const POINTS = [
  { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 5, y: 4 }, { x: 6, y: 7 },
  { x: 8, y: 6 }, { x: 9, y: 8 }, { x: 11, y: 9 },
];

// Good line: y = 0.6x + 1.8 (close to least squares)
const goodLine = (x: number) => 0.6 * x + 1.8;
// Bad line: y = 0.1x + 5.3 (nearly flat, obviously worse)
const badLine = (x: number) => 0.1 * x + 5.3;

type LineChoice = 'good' | 'bad';
type ErrorMode = 'raw' | 'squared';

export default function LeastSquaresDiagram() {
  const [line, setLine] = useState<LineChoice>('good');
  const [mode, setMode] = useState<ErrorMode>('raw');

  const W = 380, H = 240;
  const mx = 35, my = 20, mr = 15, mb = 30;
  const pw = W - mx - mr, ph = H - my - mb;

  const xMin = 0, xMax = 13, yMin = 0, yMax = 11;
  const sx = (v: number) => mx + (v / xMax) * pw;
  const sy = (v: number) => my + ((yMax - v) / yMax) * ph;

  const fn = line === 'good' ? goodLine : badLine;

  const errors = POINTS.map(p => {
    const predicted = fn(p.x);
    const raw = p.y - predicted;
    return { ...p, predicted, raw, squared: raw * raw };
  });

  const sumRaw = errors.reduce((s, e) => s + e.raw, 0);
  const sumSq = errors.reduce((s, e) => s + e.squared, 0);

  const lineColor = line === 'good' ? '#3b82f6' : '#ef4444';
  const lineName = line === 'good' ? 'Good fit' : 'Bad fit';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setLine('good')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${line === 'good' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Good line</button>
        <button onClick={() => setLine('bad')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${line === 'bad' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Bad line</button>
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
        <button onClick={() => setMode('raw')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === 'raw' ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Raw errors</button>
        <button onClick={() => setMode('squared')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === 'squared' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Squared errors</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Grid */}
        {[2, 4, 6, 8, 10, 12].map(v => <line key={`gx${v}`} x1={sx(v)} y1={my} x2={sx(v)} y2={H - mb} stroke="#f1f5f9" strokeWidth="0.5" />)}
        {[2, 4, 6, 8, 10].map(v => <line key={`gy${v}`} x1={mx} y1={sy(v)} x2={W - mr} y2={sy(v)} stroke="#f1f5f9" strokeWidth="0.5" />)}
        {/* Axes */}
        <line x1={mx} y1={H - mb} x2={W - mr} y2={H - mb} stroke="#9ca3af" strokeWidth="1" />
        <line x1={mx} y1={my} x2={mx} y2={H - mb} stroke="#9ca3af" strokeWidth="1" />

        {/* Regression line */}
        <line x1={sx(0)} y1={sy(fn(0))} x2={sx(13)} y2={sy(fn(13))} stroke={lineColor} strokeWidth="2" />

        {/* Error lines (residuals) */}
        {errors.map((e, i) => (
          <g key={i}>
            <line x1={sx(e.x)} y1={sy(e.y)} x2={sx(e.x)} y2={sy(e.predicted)}
              stroke={e.raw >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="1.5" strokeDasharray="3,2" />
            {/* Squared error boxes */}
            {mode === 'squared' && (
              <rect
                x={sx(e.x)} y={Math.min(sy(e.y), sy(e.predicted))}
                width={Math.abs(sy(e.y) - sy(e.predicted)) * 0.3}
                height={Math.abs(sy(e.y) - sy(e.predicted))}
                fill={e.raw >= 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}
                stroke={e.raw >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="0.5"
              />
            )}
          </g>
        ))}

        {/* Data points */}
        {POINTS.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#1e293b" className="dark:fill-white" />
        ))}

        {/* Sum label */}
        <text x={W - mr - 5} y={my + 14} fontSize="10" fill={mode === 'squared' ? '#10b981' : '#f59e0b'} textAnchor="end" fontWeight="700">
          {mode === 'raw' ? `Σ errors = ${sumRaw.toFixed(2)}` : `Σ errors² = ${sumSq.toFixed(1)}`}
        </text>
        <text x={W - mr - 5} y={my + 26} fontSize="9" fill={lineColor} textAnchor="end">{lineName}</text>
      </svg>

      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {mode === 'raw'
          ? `Raw errors sum to ${sumRaw.toFixed(2)} — ${Math.abs(sumRaw) < 1 ? 'nearly zero! Positive and negative errors cancel. Both lines look equally "good" by this measure.' : 'not zero, but misleading because cancellation hides the true error.'}`
          : `Squared errors sum to ${sumSq.toFixed(1)}. ${line === 'good' ? 'The good line has much smaller squared error — it truly fits better.' : 'The bad line has a huge squared error — squaring reveals how poor the fit really is.'}`
        }
        {mode === 'raw' && ' Switch to "Squared errors" to see the real difference.'}
      </div>
    </div>
  );
}
