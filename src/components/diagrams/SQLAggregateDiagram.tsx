/**
 * Interactive SQL aggregate diagram.
 * Shows a mini table of elephant data and visualizes how
 * GROUP BY + aggregate functions (COUNT, SUM, AVG, MIN, MAX) collapse rows.
 */
import { useState } from 'react';

type AggFn = 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

const data = [
  { name: 'Ranga', weight: 4500, park: 'Kaziranga' },
  { name: 'Gaja', weight: 5200, park: 'Kaziranga' },
  { name: 'Tara', weight: 4100, park: 'Kaziranga' },
  { name: 'Mohini', weight: 3800, park: 'Manas' },
  { name: 'Bala', weight: 3200, park: 'Manas' },
];

const parkColors: Record<string, { bg: string; text: string }> = {
  Kaziranga: {
    bg: 'fill-sky-100 dark:fill-sky-900/30 stroke-sky-300 dark:stroke-sky-700',
    text: 'fill-sky-700 dark:fill-sky-300',
  },
  Manas: {
    bg: 'fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-300 dark:stroke-emerald-700',
    text: 'fill-emerald-700 dark:fill-emerald-300',
  },
};

function computeAgg(fn: AggFn, weights: number[]): string {
  switch (fn) {
    case 'COUNT': return String(weights.length);
    case 'SUM': return String(weights.reduce((a, b) => a + b, 0));
    case 'AVG': return (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(0);
    case 'MIN': return String(Math.min(...weights));
    case 'MAX': return String(Math.max(...weights));
  }
}

export default function SQLAggregateDiagram() {
  const [aggFn, setAggFn] = useState<AggFn>('AVG');

  const groups = Object.entries(
    data.reduce<Record<string, typeof data>>((acc, row) => {
      (acc[row.park] = acc[row.park] || []).push(row);
      return acc;
    }, {})
  );

  const totalW = 500;
  const rowH = 24;
  const srcY = 58;
  const arrowY = srcY + data.length * rowH + 20;
  const groupY = arrowY + 35;
  const totalH = groupY + groups.length * 50 + 35;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Aggregate function selector */}
      <div className="flex justify-center gap-1 mb-3 flex-wrap">
        {(['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'] as AggFn[]).map(fn => (
          <button
            key={fn}
            onClick={() => setAggFn(fn)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors font-mono ${
              aggFn === fn
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {fn}()
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label={`GROUP BY with ${aggFn} aggregate function`}>
        {/* Title */}
        <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
          GROUP BY + {aggFn}()
        </text>
        <text x={totalW / 2} y="34" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontFamily="monospace" fontWeight="600">
          SELECT park, {aggFn}(weight) FROM elephants GROUP BY park
        </text>

        {/* ── Source table ── */}
        <text x="30" y={srcY - 6} className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
          elephants (all rows)
        </text>
        {data.map((row, i) => {
          const y = srcY + i * rowH;
          const pc = parkColors[row.park];
          return (
            <g key={i}>
              <rect x="30" y={y} width="200" height={rowH - 2} rx="4"
                className={pc.bg} strokeWidth="1" />
              <text x="45" y={y + 15} className="fill-gray-700 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
                {row.name}
              </text>
              <text x="115" y={y + 15} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace" fontWeight="600">
                {row.weight}
              </text>
              <text x="175" y={y + 15} textAnchor="middle" className={pc.text} fontSize="9" fontFamily="monospace" fontWeight="700">
                {row.park}
              </text>
            </g>
          );
        })}

        {/* Arrow */}
        <text x={130} y={arrowY} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10" fontWeight="600">
          ↓ GROUP BY park
        </text>

        {/* ── Grouped results ── */}
        {groups.map(([park, rows], gi) => {
          const y = groupY + gi * 50;
          const pc = parkColors[park];
          const weights = rows.map(r => r.weight);
          const result = computeAgg(aggFn, weights);

          return (
            <g key={park}>
              {/* Group label */}
              <rect x="30" y={y} width="80" height="32" rx="6"
                className={pc.bg} strokeWidth="1.5" />
              <text x="70" y={y + 18} textAnchor="middle"
                className={pc.text} fontSize="11" fontWeight="700" fontFamily="monospace">
                {park}
              </text>

              {/* Individual weights (fading in) */}
              {rows.map((r, ri) => (
                <g key={ri}>
                  <rect x={125 + ri * 55} y={y + 2} width="48" height="20" rx="4"
                    className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
                  <text x={125 + ri * 55 + 24} y={y + 16} textAnchor="middle"
                    className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontFamily="monospace">
                    {r.weight}
                  </text>
                </g>
              ))}

              {/* Arrow to result */}
              <text x={125 + rows.length * 55 + 8} y={y + 16} className="fill-amber-500" fontSize="12" fontWeight="700">
                →
              </text>

              {/* Aggregate result */}
              <rect x={125 + rows.length * 55 + 25} y={y} width="100" height="32" rx="8"
                className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400" strokeWidth="2" />
              <text x={125 + rows.length * 55 + 75} y={y + 12} textAnchor="middle"
                className="fill-amber-700 dark:fill-amber-300" fontSize="8" fontWeight="600">
                {aggFn}(weight)
              </text>
              <text x={125 + rows.length * 55 + 75} y={y + 26} textAnchor="middle"
                className="fill-amber-800 dark:fill-amber-200" fontSize="14" fontWeight="800" fontFamily="monospace">
                {result}
              </text>
            </g>
          );
        })}

        {/* Explanation */}
        <text x={totalW / 2} y={totalH - 10} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
          {aggFn === 'COUNT' && 'COUNT(*) counts rows in each group. COUNT(col) skips NULLs.'}
          {aggFn === 'SUM' && 'SUM adds all values in each group. Only works on numbers.'}
          {aggFn === 'AVG' && 'AVG = SUM / COUNT. Watch out: integer division truncates in some databases.'}
          {aggFn === 'MIN' && 'MIN returns the smallest value. Works on numbers, text (alphabetical), and dates.'}
          {aggFn === 'MAX' && 'MAX returns the largest value. Works on numbers, text (alphabetical), and dates.'}
        </text>
      </svg>
    </div>
  );
}
