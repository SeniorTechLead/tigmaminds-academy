/**
 * Visual diagram showing how a subquery executes:
 * inner query runs first → produces a value → outer query uses it.
 * Interactive: toggle between different subquery patterns.
 */
import { useState } from 'react';

type Pattern = 'scalar' | 'list' | 'exists';

const patterns: Record<Pattern, {
  label: string;
  innerSql: string;
  innerResult: string;
  outerSql: string;
  outerResult: string[][];
  explanation: string;
}> = {
  scalar: {
    label: 'Scalar (one value)',
    innerSql: 'SELECT AVG(weight) FROM elephants',
    innerResult: '4160.0',
    outerSql: 'SELECT name, weight FROM elephants\nWHERE weight > ( ⬆ inner result )',
    outerResult: [
      ['Ranga', '4500'],
      ['Gaja', '5200'],
    ],
    explanation: 'The inner query computes one number (average = 4160). The outer query uses that number to filter.',
  },
  list: {
    label: 'List (multiple values)',
    innerSql: "SELECT elephant_id FROM sightings\nWHERE location = 'Kaziranga East'",
    innerResult: '1, 3',
    outerSql: 'SELECT name FROM elephants\nWHERE id IN ( ⬆ inner result )',
    outerResult: [
      ['Ranga'],
      ['Gaja'],
    ],
    explanation: 'The inner query finds IDs of elephants sighted at Kaziranga East (1 and 3). The outer query looks up their names.',
  },
  exists: {
    label: 'EXISTS (yes/no check)',
    innerSql: 'SELECT 1 FROM sightings s\nWHERE s.elephant_id = e.id',
    innerResult: 'any rows? → TRUE or FALSE',
    outerSql: 'SELECT name FROM elephants e\nWHERE EXISTS ( ⬆ inner check )',
    outerResult: [
      ['Ranga'],
      ['Mohini'],
      ['Gaja'],
      ['Bala'],
    ],
    explanation: 'For each elephant, EXISTS checks if they have any sightings. Tara has none, so she is excluded.',
  },
};

export default function SQLSubqueryDiagram() {
  const [pattern, setPattern] = useState<Pattern>('scalar');
  const p = patterns[pattern];

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Subquery: a query inside a query</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The inner query runs first. Its result feeds into the outer query.</p>
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

        {/* Step 1: Inner query */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
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
          <div className="text-violet-400 text-lg">↓ feeds into ↓</div>
        </div>

        {/* Step 2: Outer query */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
            <span className="text-sm font-bold text-sky-700 dark:text-sky-300">Outer query uses the result</span>
          </div>
          <pre className="text-xs font-mono bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-200 rounded-lg p-3 border border-sky-200 dark:border-sky-800 whitespace-pre">{p.outerSql}</pre>
        </div>

        {/* Final result table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600 mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                {p.outerResult[0].length === 1
                  ? <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">name</th>
                  : <>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">name</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">weight</th>
                    </>
                }
              </tr>
            </thead>
            <tbody>
              {p.outerResult.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300">{p.explanation}</p>
      </div>
    </div>
  );
}
