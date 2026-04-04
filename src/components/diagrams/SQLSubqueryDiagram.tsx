/**
 * Visual diagram showing how a subquery executes:
 * 1. Show the FULL query with the inner part highlighted
 * 2. Show the inner query running first → producing a result
 * 3. Show the substituted query with the result plugged in
 * 4. Show the final output
 */
import { useState } from 'react';

type Pattern = 'scalar' | 'list' | 'exists';

const patterns: Record<Pattern, {
  label: string;
  fullSql: string;
  innerHighlight: [number, number]; // char offsets in fullSql to highlight
  innerSql: string;
  innerResult: string;
  substitutedSql: string;
  finalResult: string[][];
  finalColumns: string[];
  explanation: string;
}> = {
  scalar: {
    label: 'Scalar (one value)',
    fullSql: `SELECT name, weight FROM elephants
WHERE weight > (SELECT AVG(weight) FROM elephants);`,
    innerHighlight: [48, 84],
    innerSql: 'SELECT AVG(weight) FROM elephants',
    innerResult: '4160.0',
    substitutedSql: `SELECT name, weight FROM elephants
WHERE weight > 4160.0;`,
    finalResult: [
      ['Ranga', '4500'],
      ['Gaja', '5200'],
    ],
    finalColumns: ['name', 'weight'],
    explanation: 'The database runs the inner query first, gets 4160.0, then plugs that number into the outer query.',
  },
  list: {
    label: 'List (IN)',
    fullSql: `SELECT name FROM elephants
WHERE id IN (SELECT elephant_id FROM sightings
             WHERE location = 'Kaziranga East');`,
    innerHighlight: [40, 106],
    innerSql: "SELECT elephant_id FROM sightings\nWHERE location = 'Kaziranga East'",
    innerResult: '1, 3',
    substitutedSql: `SELECT name FROM elephants
WHERE id IN (1, 3);`,
    finalResult: [
      ['Ranga'],
      ['Gaja'],
    ],
    finalColumns: ['name'],
    explanation: 'The inner query returns a list of IDs. The outer query checks if each elephant\'s ID is in that list.',
  },
  exists: {
    label: 'EXISTS',
    fullSql: `SELECT name FROM elephants e
WHERE EXISTS (SELECT 1 FROM sightings s
              WHERE s.elephant_id = e.id);`,
    innerHighlight: [41, 103],
    innerSql: 'SELECT 1 FROM sightings s\nWHERE s.elephant_id = e.id',
    innerResult: 'runs once per elephant row',
    substitutedSql: `-- For Ranga (id=1): EXISTS finds sightings → TRUE ✓
-- For Tara (id=4):  EXISTS finds nothing  → FALSE ✗
SELECT name FROM elephants e
WHERE EXISTS (...per-row check...);`,
    finalResult: [
      ['Ranga'],
      ['Mohini'],
      ['Gaja'],
      ['Bala'],
    ],
    finalColumns: ['name'],
    explanation: 'EXISTS is different — it runs the inner query once for EACH row of the outer query, checking if any match exists. Tara has no sightings, so EXISTS returns FALSE for her.',
  },
};

export default function SQLSubqueryDiagram() {
  const [pattern, setPattern] = useState<Pattern>('scalar');
  const p = patterns[pattern];

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Subquery: a query inside a query</p>
      </div>

      <div className="p-5">
        {/* Pattern selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(Object.keys(patterns) as Pattern[]).map(key => (
            <button
              key={key}
              onClick={() => setPattern(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pattern === key
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {patterns[key].label}
            </button>
          ))}
        </div>

        {/* Step 1: The full query — inner part highlighted */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">The full query you write</span>
          </div>
          <pre className="text-xs font-mono bg-gray-900 text-gray-300 rounded-lg p-3 whitespace-pre overflow-x-auto">
            {p.fullSql.substring(0, p.innerHighlight[0])}
            <span className="bg-violet-800 text-violet-200 rounded px-0.5">{p.fullSql.substring(p.innerHighlight[0], p.innerHighlight[1])}</span>
            {p.fullSql.substring(p.innerHighlight[1])}
          </pre>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            The <span className="bg-violet-800 text-violet-200 rounded px-1 text-[10px] font-mono">highlighted part</span> is the inner query — it runs first.
          </p>
        </div>

        {/* Step 2: Inner query runs */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
            <span className="text-sm font-bold text-violet-700 dark:text-violet-300">Inner query runs first</span>
          </div>
          <pre className="text-xs font-mono bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-200 rounded-lg p-3 border border-violet-200 dark:border-violet-800 whitespace-pre">{p.innerSql}</pre>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Result:</span>
            <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded font-mono text-xs font-bold">{p.innerResult}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-3">
          <div className="text-violet-400 text-sm font-bold">↓ result plugged in ↓</div>
        </div>

        {/* Step 3: Substituted query */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
            <span className="text-sm font-bold text-sky-700 dark:text-sky-300">Query becomes</span>
          </div>
          <pre className="text-xs font-mono bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-200 rounded-lg p-3 border border-sky-200 dark:border-sky-800 whitespace-pre">{p.substitutedSql}</pre>
        </div>

        {/* Step 4: Final result */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Final result</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {p.finalColumns.map(col => (
                    <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.finalResult.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300">{p.explanation}</p>
      </div>
    </div>
  );
}
