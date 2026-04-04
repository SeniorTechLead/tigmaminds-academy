/**
 * Interactive diagram showing SQL string functions applied to a value.
 * Student picks a function and sees the transformation.
 */
import { useState } from 'react';

type Func = 'UPPER' | 'LOWER' | 'LENGTH' | 'SUBSTR' | 'REPLACE' | '||';

const funcs: Record<Func, { sql: string; input: string; output: string; desc: string }> = {
  UPPER: { sql: "SELECT UPPER('Ranga')", input: 'Ranga', output: 'RANGA', desc: 'Converts all characters to uppercase.' },
  LOWER: { sql: "SELECT LOWER('Kaziranga')", input: 'Kaziranga', output: 'kaziranga', desc: 'Converts all characters to lowercase.' },
  LENGTH: { sql: "SELECT LENGTH('Ranga')", input: 'Ranga', output: '5', desc: 'Returns the number of characters.' },
  SUBSTR: { sql: "SELECT SUBSTR('Kaziranga', 1, 5)", input: 'Kaziranga', output: 'Kazir', desc: 'Extracts characters: SUBSTR(string, start, length). Position starts at 1.' },
  REPLACE: { sql: "SELECT REPLACE('Kaziranga NP', 'NP', 'National Park')", input: 'Kaziranga NP', output: 'Kaziranga National Park', desc: 'Replaces all occurrences of a substring.' },
  '||': { sql: "SELECT 'Ka' || '-' || '001'", input: "'Ka' || '-' || '001'", output: 'Ka-001', desc: 'Concatenates (joins) strings together. || is the SQL concat operator.' },
};

export default function SQLStringFuncDiagram() {
  const [fn, setFn] = useState<Func>('UPPER');
  const f = funcs[fn];

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">SQL String Functions</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click a function to see what it does.</p>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(funcs) as Func[]).map(k => (
            <button key={k} onClick={() => setFn(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                fn === k ? 'bg-violet-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>{k}</button>
          ))}
        </div>

        <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-3 mb-4 whitespace-pre">{f.sql}</pre>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-1">Input</p>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200">{f.input}</div>
          </div>
          <div className="text-2xl text-violet-400 font-bold">→</div>
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-1">Output</p>
            <div className="px-3 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg font-mono text-sm text-violet-700 dark:text-violet-300 font-bold border border-violet-200 dark:border-violet-800">{f.output}</div>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300">{f.desc}</p>
      </div>
    </div>
  );
}
