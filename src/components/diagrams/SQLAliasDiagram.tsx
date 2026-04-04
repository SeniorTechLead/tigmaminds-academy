/**
 * Visual showing why column aliases don't work in WHERE.
 * Side-by-side: the failing query vs the working query,
 * with the execution order highlighted to show the timing problem.
 */
import { useState } from 'react';

type View = 'fails' | 'works';

export default function SQLAliasDiagram() {
  const [view, setView] = useState<View>('fails');

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Why column aliases don't work in WHERE</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">AS avg_w</code> gives a column a nickname — but WHERE runs before that nickname is created.
        </p>
      </div>

      <div className="p-5">
        {/* Toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setView('fails')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              view === 'fails' ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            This fails
          </button>
          <button
            onClick={() => setView('works')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              view === 'works' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            This works
          </button>
        </div>

        {view === 'fails' ? <FailsView /> : <WorksView />}
      </div>
    </div>
  );
}

function FailsView() {
  const steps = [
    { num: 1, clause: 'FROM', desc: 'elephants', status: 'done' as const },
    { num: 2, clause: 'WHERE', desc: 'avg_w > 4000', status: 'error' as const },
    { num: 5, clause: 'SELECT', desc: 'AVG(weight) AS avg_w', status: 'notyet' as const },
  ];

  return (
    <div>
      <pre className="text-xs font-mono bg-red-950 text-red-200 rounded-lg p-3 mb-4 whitespace-pre border border-red-800">
{`SELECT park, AVG(weight) AS avg_w
FROM elephants
WHERE avg_w > 4000;

-- Error: no such column: avg_w`}</pre>

      <div className="space-y-2 mb-4">
        {steps.map(s => (
          <div key={s.num} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            s.status === 'done' ? 'bg-gray-100 dark:bg-gray-700/50' :
            s.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800' :
            'bg-gray-50 dark:bg-gray-800/30 opacity-40'
          }`}>
            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
              s.status === 'done' ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300' :
              s.status === 'error' ? 'bg-red-500 text-white' :
              'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}>{s.num}</span>
            <span className={`font-mono text-xs font-bold ${
              s.status === 'error' ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'
            }`}>{s.clause}</span>
            <span className={`font-mono text-xs ${
              s.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            }`}>{s.desc}</span>
            {s.status === 'error' && (
              <span className="text-xs text-red-500 font-bold ml-auto">avg_w doesn't exist yet!</span>
            )}
            {s.status === 'notyet' && (
              <span className="text-xs text-gray-400 ml-auto">hasn't run yet — this is where avg_w gets created</span>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-red-700 dark:text-red-300 font-semibold">
        Step 2 (WHERE) tries to use <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">avg_w</code>, but that name is created in step 5 (SELECT). The database hasn't gotten there yet.
      </p>
    </div>
  );
}

function WorksView() {
  const steps = [
    { num: 1, clause: 'FROM', desc: 'elephants', status: 'done' as const },
    { num: 3, clause: 'GROUP BY', desc: 'park', status: 'done' as const },
    { num: 4, clause: 'HAVING', desc: 'AVG(weight) > 4000', status: 'success' as const },
  ];

  return (
    <div>
      <pre className="text-xs font-mono bg-emerald-950 text-emerald-200 rounded-lg p-3 mb-4 whitespace-pre border border-emerald-800">
{`SELECT park, AVG(weight) AS avg_w
FROM elephants
GROUP BY park
HAVING AVG(weight) > 4000;

-- Works! HAVING runs after GROUP BY`}</pre>

      <div className="space-y-2 mb-4">
        {steps.map(s => (
          <div key={s.num} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            s.status === 'done' ? 'bg-gray-100 dark:bg-gray-700/50' :
            'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800'
          }`}>
            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
              s.status === 'done' ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300' :
              'bg-emerald-500 text-white'
            }`}>{s.num}</span>
            <span className={`font-mono text-xs font-bold ${
              s.status === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'
            }`}>{s.clause}</span>
            <span className={`font-mono text-xs ${
              s.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
            }`}>{s.desc}</span>
            {s.status === 'success' && (
              <span className="text-xs text-emerald-500 font-bold ml-auto">groups are formed — AVG can be computed</span>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
        Instead of using the alias in WHERE, write the full expression <code className="bg-emerald-100 dark:bg-emerald-900/30 px-1 rounded">AVG(weight) &gt; 4000</code> in HAVING. HAVING runs after GROUP BY, so aggregate values are available.
      </p>
    </div>
  );
}
