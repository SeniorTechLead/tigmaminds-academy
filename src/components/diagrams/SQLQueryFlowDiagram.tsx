/**
 * Visual diagram showing the SQL execution order (not the writing order).
 * Highlights that FROM runs first, SELECT runs near-last.
 * Toggle between "write order" and "execution order" views.
 */
import { useState } from 'react';

const writeOrder = [
  { clause: 'SELECT', example: 'park, COUNT(*), AVG(weight)', color: 'violet' },
  { clause: 'FROM', example: 'elephants', color: 'sky' },
  { clause: 'WHERE', example: 'weight > 3000', color: 'emerald' },
  { clause: 'GROUP BY', example: 'park', color: 'amber' },
  { clause: 'HAVING', example: 'COUNT(*) > 1', color: 'orange' },
  { clause: 'ORDER BY', example: 'AVG(weight) DESC', color: 'rose' },
  { clause: 'LIMIT', example: '5', color: 'gray' },
];

const execOrder = [
  { clause: 'FROM', example: 'Load the elephants table', color: 'sky', num: 1 },
  { clause: 'WHERE', example: 'Filter: weight > 3000', color: 'emerald', num: 2 },
  { clause: 'GROUP BY', example: 'Group rows by park', color: 'amber', num: 3 },
  { clause: 'HAVING', example: 'Keep groups with COUNT(*) > 1', color: 'orange', num: 4 },
  { clause: 'SELECT', example: 'Pick columns + compute aggregates', color: 'violet', num: 5 },
  { clause: 'ORDER BY', example: 'Sort by AVG(weight) DESC', color: 'rose', num: 6 },
  { clause: 'LIMIT', example: 'Return top 5 rows', color: 'gray', num: 7 },
];

type View = 'write' | 'exec';

export default function SQLQueryFlowDiagram() {
  const [view, setView] = useState<View>('exec');
  const steps = view === 'write' ? writeOrder : execOrder;

  const totalW = 480;
  const stepH = 34;
  const gap = 6;
  const padT = 56;
  const totalH = padT + steps.length * (stepH + gap) + 30;

  const fills: Record<string, { box: string; text: string }> = {
    violet: { box: 'fill-violet-100 dark:fill-violet-900/30 stroke-violet-400', text: 'fill-violet-700 dark:fill-violet-300' },
    sky: { box: 'fill-sky-100 dark:fill-sky-900/30 stroke-sky-400', text: 'fill-sky-700 dark:fill-sky-300' },
    emerald: { box: 'fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400', text: 'fill-emerald-700 dark:fill-emerald-300' },
    amber: { box: 'fill-amber-100 dark:fill-amber-900/30 stroke-amber-400', text: 'fill-amber-700 dark:fill-amber-300' },
    orange: { box: 'fill-orange-100 dark:fill-orange-900/30 stroke-orange-400', text: 'fill-orange-700 dark:fill-orange-300' },
    rose: { box: 'fill-rose-100 dark:fill-rose-900/30 stroke-rose-400', text: 'fill-rose-700 dark:fill-rose-300' },
    gray: { box: 'fill-gray-100 dark:fill-gray-800/30 stroke-gray-400', text: 'fill-gray-700 dark:fill-gray-300' },
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setView('write')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            view === 'write' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Write Order
        </button>
        <button
          onClick={() => setView('exec')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            view === 'exec' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Execution Order
        </button>
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label={`SQL ${view === 'write' ? 'writing' : 'execution'} order`}>
        {/* Title */}
        <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
          {view === 'write' ? 'How You Write SQL' : 'How SQL Actually Runs'}
        </text>
        <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          {view === 'write'
            ? 'SELECT comes first when writing, but runs 5th!'
            : 'The database processes clauses in this order — not left to right'}
        </text>

        {steps.map((step, i) => {
          const y = padT + i * (stepH + gap);
          const f = fills[step.color];
          const isExec = view === 'exec';
          return (
            <g key={i}>
              {/* Connecting arrow */}
              {i > 0 && (
                <line x1={totalW / 2} y1={y - gap + 1} x2={totalW / 2} y2={y}
                  className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
              )}

              {/* Step number (exec view only) */}
              {isExec && (
                <g>
                  <circle cx="32" cy={y + stepH / 2} r="12"
                    className={`${f.box}`} strokeWidth="1.5" />
                  <text x="32" y={y + stepH / 2 + 1} textAnchor="middle" dominantBaseline="central"
                    className={f.text} fontSize="11" fontWeight="800">
                    {(step as typeof execOrder[number]).num}
                  </text>
                </g>
              )}

              {/* Clause box */}
              <rect x="52" y={y} width="95" height={stepH} rx="6"
                className={f.box} strokeWidth="1.5" />
              <text x="100" y={y + stepH / 2 + 1} textAnchor="middle" dominantBaseline="central"
                className={f.text} fontSize="12" fontWeight="800" fontFamily="monospace">
                {step.clause}
              </text>

              {/* Description */}
              <text x="160" y={y + stepH / 2 + 1} dominantBaseline="central"
                className="fill-gray-600 dark:fill-gray-300" fontSize="10">
                {step.example}
              </text>
            </g>
          );
        })}

        {/* Key insight */}
        <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
          {view === 'write'
            ? 'You write SELECT first, but the database reads FROM first.'
            : 'Column aliases (AS avg_w) are created in step 5 — so WHERE (step 2) can\'t see them yet.'}
        </text>
      </svg>
    </div>
  );
}
