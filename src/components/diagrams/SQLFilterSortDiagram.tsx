/**
 * Interactive diagram showing how WHERE filters rows, ORDER BY sorts them,
 * and LIMIT takes the top N. Students toggle each clause on/off to see the effect.
 */
import { useState } from 'react';

const allRows = [
  { name: 'Ranga', weight: 4500, park: 'Kaziranga' },
  { name: 'Mohini', weight: 3800, park: 'Manas' },
  { name: 'Gaja', weight: 5200, park: 'Kaziranga' },
  { name: 'Tara', weight: 4100, park: 'Kaziranga' },
  { name: 'Bala', weight: 3200, park: 'Manas' },
];

export default function SQLFilterSortDiagram() {
  const [useWhere, setUseWhere] = useState(false);
  const [useOrderBy, setUseOrderBy] = useState(false);
  const [useLimit, setUseLimit] = useState(false);

  let rows = [...allRows];
  const steps: { label: string; rows: typeof allRows; active: boolean }[] = [];

  // Step 1: FROM (always)
  steps.push({ label: 'FROM elephants', rows: [...rows], active: true });

  // Step 2: WHERE
  if (useWhere) {
    rows = rows.filter(r => r.weight > 4000);
  }
  steps.push({ label: 'WHERE weight > 4000', rows: [...rows], active: useWhere });

  // Step 3: ORDER BY
  if (useOrderBy) {
    rows = rows.sort((a, b) => b.weight - a.weight);
  }
  steps.push({ label: 'ORDER BY weight DESC', rows: [...rows], active: useOrderBy });

  // Step 4: LIMIT
  if (useLimit) {
    rows = rows.slice(0, 2);
  }
  steps.push({ label: 'LIMIT 2', rows: [...rows], active: useLimit });

  const query = `SELECT name, weight FROM elephants${useWhere ? '\nWHERE weight > 4000' : ''}${useOrderBy ? '\nORDER BY weight DESC' : ''}${useLimit ? '\nLIMIT 2' : ''};`;

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Toggle each clause to see what it does to the data</p>
      </div>

      <div className="p-5">
        {/* Toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: 'WHERE weight > 4000', on: useWhere, set: setUseWhere, color: 'emerald' },
            { label: 'ORDER BY weight DESC', on: useOrderBy, set: setUseOrderBy, color: 'sky' },
            { label: 'LIMIT 2', on: useLimit, set: setUseLimit, color: 'amber' },
          ].map(({ label, on, set, color }) => (
            <button
              key={label}
              onClick={() => set(!on)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                on
                  ? color === 'emerald' ? 'bg-emerald-500 text-white'
                    : color === 'sky' ? 'bg-sky-500 text-white'
                    : 'bg-amber-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {on ? '✓ ' : '  '}{label}
            </button>
          ))}
        </div>

        {/* Query preview */}
        <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-3 mb-4 whitespace-pre">{query}</pre>

        {/* Result table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">name</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">weight</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">park</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-400 italic text-xs">No rows match</td></tr>
              ) : rows.map((r, i) => {
                const filtered = useWhere && r.weight <= 4000;
                return (
                  <tr key={r.name} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{r.name}</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{r.weight}</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">{r.park}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{rows.length} row{rows.length !== 1 ? 's' : ''} returned</p>
      </div>
    </div>
  );
}
