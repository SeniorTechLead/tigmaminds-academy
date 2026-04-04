/**
 * Interactive diagram showing ORDER BY sorting rows, then LIMIT + OFFSET
 * selecting a "page" from the sorted results.
 */
import { useState } from 'react';

const allRows = [
  { name: 'Gaja', weight: 5200 },
  { name: 'Ranga', weight: 4500 },
  { name: 'Tara', weight: 4100 },
  { name: 'Mohini', weight: 3800 },
  { name: 'Bala', weight: 3200 },
];

const unsorted = [
  { name: 'Ranga', weight: 4500 },
  { name: 'Mohini', weight: 3800 },
  { name: 'Gaja', weight: 5200 },
  { name: 'Tara', weight: 4100 },
  { name: 'Bala', weight: 3200 },
];

type Step = 'unsorted' | 'sorted' | 'page1' | 'page2';

const stepInfo: Record<Step, { sql: string; desc: string }> = {
  unsorted: { sql: 'SELECT name, weight FROM elephants;', desc: 'No ORDER BY — rows come in whatever order the database stored them.' },
  sorted: { sql: 'SELECT name, weight FROM elephants\nORDER BY weight DESC;', desc: 'ORDER BY weight DESC — heaviest first. ASC would reverse it (lightest first, the default).' },
  page1: { sql: 'SELECT name, weight FROM elephants\nORDER BY weight DESC\nLIMIT 2 OFFSET 0;', desc: 'Page 1: LIMIT 2 takes the first 2 rows. OFFSET 0 means start from the beginning.' },
  page2: { sql: 'SELECT name, weight FROM elephants\nORDER BY weight DESC\nLIMIT 2 OFFSET 2;', desc: 'Page 2: OFFSET 2 skips the first 2 rows, LIMIT 2 takes the next 2.' },
};

export default function SQLSortPaginationDiagram() {
  const [step, setStep] = useState<Step>('unsorted');
  const info = stepInfo[step];

  const getRows = () => {
    switch (step) {
      case 'unsorted': return unsorted.map((r, i) => ({ ...r, included: true, idx: i }));
      case 'sorted': return allRows.map((r, i) => ({ ...r, included: true, idx: i }));
      case 'page1': return allRows.map((r, i) => ({ ...r, included: i < 2, idx: i }));
      case 'page2': return allRows.map((r, i) => ({ ...r, included: i >= 2 && i < 4, idx: i }));
    }
  };

  const rows = getRows();

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Sorting & Pagination: ORDER BY + LIMIT + OFFSET</p>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {(['unsorted', 'sorted', 'page1', 'page2'] as Step[]).map(s => (
            <button key={s} onClick={() => setStep(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                step === s ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
              {s === 'unsorted' ? 'No Sort' : s === 'sorted' ? 'ORDER BY' : s === 'page1' ? 'Page 1' : 'Page 2'}
            </button>
          ))}
        </div>

        <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-3 mb-3 whitespace-pre">{info.sql}</pre>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">{info.desc}</p>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 w-8">#</th>
                <th className="px-3 py-2 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">name</th>
                <th className="px-3 py-2 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">weight</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.name} className={`transition-all ${
                  !r.included ? 'opacity-20' : ''
                } ${r.included && (step === 'page1' || step === 'page2') ? 'bg-sky-50 dark:bg-sky-900/20' : i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                  <td className="px-3 py-1.5 font-mono text-xs text-gray-400">{r.idx + 1}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{r.name}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{r.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {step === 'page1' || step === 'page2' ? `${rows.filter(r => r.included).length} rows returned (faded rows are skipped)` : `${rows.length} rows`}
        </p>
      </div>
    </div>
  );
}
