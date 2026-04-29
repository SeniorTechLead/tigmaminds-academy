/**
 * AlgebraQuadraticDiagram — Completing the square visually.
 * Shows x² + 6x = 7 as geometric areas, then completes the square.
 */
import { useState } from 'react';

const STAGES = [
  { id: 0, label: 'x² + 6x = 7', desc: 'We have a square (x²) and a rectangle (6x)' },
  { id: 1, label: 'Split 6x into two 3x strips', desc: 'Put 3x on the right, 3x on the bottom' },
  { id: 2, label: 'Complete the square: add 9', desc: 'Fill the corner gap (3×3 = 9) on both sides' },
  { id: 3, label: '(x+3)² = 16 → x = 1', desc: 'Take the square root: x + 3 = 4, so x = 1' },
] as const;

export default function AlgebraQuadraticDiagram() {
  const [stage, setStage] = useState(0);

  const sq = 70; // side length for x
  const strip = 30; // width of the 3-unit strip
  const ox = 50, oy = 40;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 400 280" className="w-full" role="img" aria-label="Completing the square: geometric proof that x squared plus 6x equals 7 becomes x plus 3 squared equals 16">
        <rect width="400" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Completing the Square</text>

        {/* Stage 0 & 1: the x² square */}
        <rect x={ox} y={oy} width={sq} height={sq} className="fill-blue-200 dark:fill-blue-700" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={ox + sq / 2} y={oy + sq / 2 + 5} textAnchor="middle" className="fill-blue-800 dark:fill-blue-100" fontSize="13" fontWeight="bold">x²</text>

        {stage === 0 && (
          <>
            {/* Single 6x rectangle to the right */}
            <rect x={ox + sq} y={oy} width={strip * 2} height={sq} className="fill-amber-200 dark:fill-amber-700" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={ox + sq + strip} y={oy + sq / 2 + 5} textAnchor="middle" className="fill-amber-800 dark:fill-amber-100" fontSize="12" fontWeight="bold">6x</text>
            {/* Labels */}
            <text x={ox + sq / 2} y={oy - 6} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">x</text>
            <text x={ox + sq + strip} y={oy - 6} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">6</text>
            <text x={ox - 10} y={oy + sq / 2 + 4} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="10">x</text>
          </>
        )}

        {stage >= 1 && (
          <>
            {/* Right strip: 3x */}
            <rect x={ox + sq} y={oy} width={strip} height={sq} className="fill-amber-200 dark:fill-amber-700" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={ox + sq + strip / 2} y={oy + sq / 2 + 5} textAnchor="middle" className="fill-amber-800 dark:fill-amber-100" fontSize="11" fontWeight="bold">3x</text>
            {/* Bottom strip: 3x */}
            <rect x={ox} y={oy + sq} width={sq} height={strip} className="fill-amber-200 dark:fill-amber-700" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={ox + sq / 2} y={oy + sq + strip / 2 + 4} textAnchor="middle" className="fill-amber-800 dark:fill-amber-100" fontSize="11" fontWeight="bold">3x</text>
            {/* Labels */}
            <text x={ox + sq / 2} y={oy - 6} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">x</text>
            <text x={ox + sq + strip / 2} y={oy - 6} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">3</text>
            <text x={ox - 10} y={oy + sq / 2 + 4} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="10">x</text>
            <text x={ox - 10} y={oy + sq + strip / 2 + 4} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="10">3</text>
          </>
        )}

        {stage >= 2 && (
          <>
            {/* Corner square: 3×3 = 9 */}
            <rect x={ox + sq} y={oy + sq} width={strip} height={strip} className="fill-emerald-200 dark:fill-emerald-700" stroke="#10b981" strokeWidth="1.5" />
            <text x={ox + sq + strip / 2} y={oy + sq + strip / 2 + 5} textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-100" fontSize="11" fontWeight="bold">9</text>
            {/* Big square outline */}
            <rect x={ox} y={oy} width={sq + strip} height={sq + strip} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x={ox + (sq + strip) / 2} y={oy + sq + strip + 18} textAnchor="middle" className="fill-indigo-600 dark:fill-indigo-400" fontSize="11" fontWeight="bold">(x + 3)² = 7 + 9 = 16</text>
          </>
        )}

        {stage === 3 && (
          <>
            {/* Solution callout */}
            <rect x={230} y={60} width={150} height={80} rx="6" className="fill-indigo-50 dark:fill-indigo-900/40" stroke="#6366f1" strokeWidth="1" />
            <text x={305} y={82} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="12" fontWeight="bold">√(x+3)² = √16</text>
            <text x={305} y={100} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="12">x + 3 = 4</text>
            <text x={305} y={120} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="14" fontWeight="bold">x = 1 ✓</text>
            <text x={305} y={135} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Check: 1² + 6(1) = 1 + 6 = 7 ✓</text>
          </>
        )}

        {/* Right-side explanation */}
        <text x={230} y={200} className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">{STAGES[stage].desc}</text>

        {/* Equation at bottom */}
        <text x="200" y="260" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12">{STAGES[stage].label}</text>
      </svg>

      <div className="flex justify-center gap-2 mt-2">
        {STAGES.map((s) => (
          <button key={s.id} onClick={() => setStage(s.id)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${s.id === stage ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {s.id + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
