import { useState } from 'react';

// ── Approach Without Arriving ─────────────────────────────────
// Interactive limit visualiser for f(x) = (x² - 1)/(x - 1).
// Drag x toward 1 from either side — watch f(x) → 2 even though
// the function is undefined AT x = 1. The hole in the graph is
// the whole story.

export default function LimitDiagram() {
  const [x, setX] = useState(1.5);

  // The function: f(x) = (x² - 1)/(x - 1)
  // Undefined at x = 1, equals x + 1 everywhere else.
  const isAtHole = Math.abs(x - 1) < 0.0005;
  const fx = isAtHole ? null : (x * x - 1) / (x - 1);

  const W = 520, H = 320;
  const PAD_L = 50, PAD_R = 40, PAD_T = 30, PAD_B = 50;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // Visible range
  const xMin = -0.5, xMax = 3;
  const yMin = -0.5, yMax = 4.5;

  const sx = (gx: number) => PAD_L + ((gx - xMin) / (xMax - xMin)) * plotW;
  const sy = (gy: number) => PAD_T + plotH - ((gy - yMin) / (yMax - yMin)) * plotH;

  // The line y = x + 1 (since f(x) simplifies to this everywhere except x = 1)
  const lineStart = { x: xMin, y: xMin + 1 };
  const lineEnd = { x: xMax, y: xMax + 1 };

  // Distance from x=1 for display
  const distanceFromOne = Math.abs(x - 1);
  const side = x < 1 ? 'from the left' : x > 1 ? 'from the right' : 'at';

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 dark:from-sky-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          Approach Without Arriving
        </p>
        <div className="text-xs font-mono">
          <span className="text-gray-500 dark:text-gray-400">x =</span>{' '}
          <span className="text-sky-700 dark:text-sky-300 font-bold">{x.toFixed(4)}</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-gray-500 dark:text-gray-400">f(x) =</span>{' '}
          <span className={isAtHole ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-700 dark:text-emerald-300 font-bold'}>
            {fx === null ? 'undefined (0/0)' : fx.toFixed(4)}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Interactive limit diagram: watch f(x) approach 2 as x approaches 1, even though f(1) is undefined">

        {/* Grid */}
        {[0, 1, 2, 3].map(v => (
          <line key={`vg-${v}`} x1={sx(v)} y1={PAD_T} x2={sx(v)} y2={PAD_T + plotH}
            stroke="#e5e7eb" className="dark:stroke-gray-700" strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3, 4].map(v => (
          <line key={`hg-${v}`} x1={PAD_L} y1={sy(v)} x2={PAD_L + plotW} y2={sy(v)}
            stroke="#e5e7eb" className="dark:stroke-gray-700" strokeWidth="0.5" />
        ))}

        {/* Axes */}
        <line x1={PAD_L} y1={sy(0)} x2={PAD_L + plotW} y2={sy(0)}
          stroke="#64748b" strokeWidth="1.5" />
        <line x1={sx(0)} y1={PAD_T} x2={sx(0)} y2={PAD_T + plotH}
          stroke="#64748b" strokeWidth="1.5" />

        {/* Axis labels */}
        {[1, 2, 3].map(v => (
          <text key={`xt-${v}`} x={sx(v)} y={sy(0) + 14} textAnchor="middle"
            className="fill-gray-600 dark:fill-gray-300" fontSize="10">{v}</text>
        ))}
        {[1, 2, 3, 4].map(v => (
          <text key={`yt-${v}`} x={sx(0) - 8} y={sy(v) + 3} textAnchor="end"
            className="fill-gray-600 dark:fill-gray-300" fontSize="10">{v}</text>
        ))}
        <text x={PAD_L + plotW - 5} y={sy(0) - 6} className="fill-gray-500 dark:fill-gray-400" fontSize="10">x</text>
        <text x={sx(0) + 8} y={PAD_T + 10} className="fill-gray-500 dark:fill-gray-400" fontSize="10">y</text>

        {/* The line y = x + 1 — drawn in TWO segments, with a gap at x=1 */}
        {/* Left of 1 */}
        <line
          x1={sx(lineStart.x)} y1={sy(lineStart.y)}
          x2={sx(0.985)} y2={sy(1.985)}
          stroke="#3b82f6" strokeWidth="2.5" />
        {/* Right of 1 */}
        <line
          x1={sx(1.015)} y1={sy(2.015)}
          x2={sx(lineEnd.x)} y2={sy(lineEnd.y)}
          stroke="#3b82f6" strokeWidth="2.5" />

        {/* The HOLE at (1, 2) — open circle */}
        <circle cx={sx(1)} cy={sy(2)} r="5"
          fill="white" className="dark:fill-slate-900"
          stroke="#3b82f6" strokeWidth="2" />

        {/* Target value L = 2 — horizontal dashed line + label */}
        <line x1={PAD_L} y1={sy(2)} x2={sx(1)} y2={sy(2)}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <text x={PAD_L - 15} y={sy(2) + 4} textAnchor="end"
          className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">
          L = 2
        </text>

        {/* Target x = 1 — vertical dashed line */}
        <line x1={sx(1)} y1={sy(0)} x2={sx(1)} y2={sy(2)}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <text x={sx(1)} y={sy(0) + 14} textAnchor="middle"
          className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">
          a = 1
        </text>

        {/* CURRENT x position — vertical line + moving point */}
        {!isAtHole && fx !== null && (
          <>
            <line x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(fx)}
              stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <line x1={PAD_L} y1={sy(fx)} x2={sx(x)} y2={sy(fx)}
              stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

            {/* Current point on the curve */}
            <circle cx={sx(x)} cy={sy(fx)} r="10"
              fill="#06b6d4" opacity="0.25" />
            <circle cx={sx(x)} cy={sy(fx)} r="6"
              fill="#06b6d4" stroke="white" strokeWidth="2" />
            <text x={sx(x) + 10} y={sy(fx) - 10}
              className="fill-cyan-700 dark:fill-cyan-300" fontSize="10" fontWeight="bold">
              ({x.toFixed(2)}, {fx.toFixed(2)})
            </text>
          </>
        )}

        {/* Title / equation */}
        <text x={PAD_L + plotW / 2} y={18} textAnchor="middle"
          className="fill-slate-800 dark:fill-slate-100" fontSize="12" fontWeight="bold">
          f(x) = (x² − 1) / (x − 1)
        </text>
        <text x={PAD_L + plotW / 2} y={H - 10} textAnchor="middle"
          className="fill-gray-600 dark:fill-gray-400" fontSize="10">
          x is {distanceFromOne.toFixed(4)} {side} of 1 · f(x) is {fx === null ? '—' : Math.abs(fx - 2).toFixed(4)} from 2
        </text>
      </svg>

      {/* Slider */}
      <div className="max-w-md mx-auto mt-2">
        <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between mb-1">
          <span>Drag x toward 1 (from either side)</span>
        </label>
        <input type="range" min={-0.5} max={3} step={0.001} value={x}
          onChange={e => setX(+e.target.value)}
          className="w-full accent-sky-500" />
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
          <span>x = −0.5</span>
          <span className="text-amber-700 dark:text-amber-300 font-bold">x = 1 (hole)</span>
          <span>x = 3</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        The function is <strong className="text-rose-700 dark:text-rose-300">undefined at x = 1</strong> — but as x gets closer and closer, f(x) gets closer and closer to <strong className="text-amber-700 dark:text-amber-300">2</strong>. That&apos;s the limit.
      </p>
    </div>
  );
}
