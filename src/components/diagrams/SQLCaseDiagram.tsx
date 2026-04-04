/**
 * Interactive diagram showing how CASE WHEN evaluates each row
 * and assigns a result based on which condition matches.
 */
import { useState } from 'react';

const rows = [
  { name: 'Gaja', weight: 5200 },
  { name: 'Ranga', weight: 4500 },
  { name: 'Tara', weight: 4100 },
  { name: 'Mohini', weight: 3800 },
  { name: 'Bala', weight: 3200 },
];

function classify(w: number): { label: string; color: string; rule: string } {
  if (w > 4500) return { label: 'heavy', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20', rule: 'weight > 4500' };
  if (w > 3500) return { label: 'medium', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20', rule: '3500 < weight ≤ 4500' };
  return { label: 'light', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20', rule: 'weight ≤ 3500' };
}

export default function SQLCaseDiagram() {
  const [highlight, setHighlight] = useState<number | null>(null);

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">CASE WHEN — classify each row by a condition</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click a row to see which CASE branch it matches.</p>
      </div>

      <div className="p-5">
        <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-3 mb-4 whitespace-pre">{`SELECT name, weight,
  CASE
    WHEN weight > 4500 THEN 'heavy'
    WHEN weight > 3500 THEN 'medium'
    ELSE 'light'
  END AS category
FROM elephants;`}</pre>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-3 py-2 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">name</th>
                  <th className="px-3 py-2 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">weight</th>
                  <th className="px-3 py-2 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">category</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const c = classify(r.weight);
                  const isHL = highlight === i;
                  return (
                    <tr key={r.name} onClick={() => setHighlight(isHL ? null : i)}
                      className={`cursor-pointer transition-all ${isHL ? 'ring-2 ring-sky-400' : ''} ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                      <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{r.name}</td>
                      <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{r.weight}</td>
                      <td className={`px-3 py-1.5 font-mono text-xs font-bold rounded ${c.color}`}>{c.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Logic flow for highlighted row */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {highlight !== null ? `How "${rows[highlight].name}" (${rows[highlight].weight}kg) is classified:` : 'Click a row to trace the CASE logic'}
            </p>
            {highlight !== null && (() => {
              const r = rows[highlight];
              const checks = [
                { cond: 'weight > 4500', result: r.weight > 4500, label: 'heavy' },
                { cond: 'weight > 3500', result: r.weight > 3500 && r.weight <= 4500, label: 'medium' },
                { cond: 'ELSE', result: r.weight <= 3500, label: 'light' },
              ];
              return checks.map((ch, ci) => {
                const matched = (ci === 0 && r.weight > 4500) || (ci === 1 && r.weight > 3500 && r.weight <= 4500) || (ci === 2 && r.weight <= 3500);
                const skipped = (ci === 1 && r.weight > 4500) || (ci === 2 && r.weight > 3500);
                return (
                  <div key={ci} className={`px-3 py-2 rounded-lg text-xs font-mono ${
                    matched ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 font-bold'
                    : skipped ? 'opacity-30 bg-gray-50 dark:bg-gray-800/30'
                    : 'bg-gray-50 dark:bg-gray-800/30'
                  }`}>
                    <span className="text-gray-500">WHEN </span>
                    <span className={matched ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}>{ch.cond}</span>
                    {matched && <span className="text-emerald-600 dark:text-emerald-400"> → '{ch.label}' ✓</span>}
                    {skipped && <span className="text-gray-400"> (already matched above)</span>}
                    {!matched && !skipped && <span className="text-red-400"> ({r.weight} fails this check)</span>}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
