import { useState } from 'react';

// ── Narrowing a Union ────────────────────────────────────────
// Start with a variable of type `number | string`. Walk through
// a typeof check — show which branch the type narrows to on
// each side. Visual: the type badge changes as you step through.

type Step = 0 | 1 | 2 | 3;

export default function UnionNarrowingDiagram() {
  const [value, setValue] = useState<number | string>(42);
  const [step, setStep] = useState<Step>(0);

  const isNumber = typeof value === 'number';

  const types = ['number', 'string'];
  const inferredType = isNumber ? 'number' : 'string';

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-violet-50 dark:from-sky-950 dark:via-slate-950 dark:to-violet-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-3">
        Narrowing a Union Type
      </p>

      {/* Value picker */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xs text-gray-600 dark:text-gray-400">Set id to:</span>
        <button onClick={() => setValue(42)}
          className={`text-xs font-mono font-bold px-3 py-1 rounded transition ${
            typeof value === 'number' ? 'bg-blue-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300'
          }`}>
          42
        </button>
        <button onClick={() => setValue('E-042')}
          className={`text-xs font-mono font-bold px-3 py-1 rounded transition ${
            typeof value === 'string' ? 'bg-purple-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300'
          }`}>
          &quot;E-042&quot;
        </button>
      </div>

      {/* Code walkthrough */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm">
        {/* Line 1: declaration */}
        <div className="mb-1">
          <span className="text-purple-400">let</span>
          <span className="text-gray-200"> id: </span>
          <span className="text-yellow-300">number | string</span>
          <span className="text-gray-200"> = </span>
          <span className={typeof value === 'number' ? 'text-blue-400' : 'text-pink-400'}>
            {typeof value === 'string' ? `"${value}"` : value}
          </span>
          <span className="text-gray-200">;</span>
          <span className="ml-3 text-[11px] bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded ring-1 ring-yellow-600">
            TS knows: number | string
          </span>
        </div>

        {/* Line 2: typeof check */}
        <div className="mt-3 mb-1">
          <span className="text-purple-400">if</span>
          <span className="text-gray-200"> (</span>
          <span className="text-blue-300">typeof</span>
          <span className="text-gray-200"> id === </span>
          <span className="text-emerald-300">&quot;number&quot;</span>
          <span className="text-gray-200">) &#123;</span>
        </div>

        {/* Inside if — narrowed to number */}
        <div className="ml-4 my-1 p-2 bg-blue-900/30 rounded border-l-2 border-blue-500">
          <div className="text-[11px] text-blue-300 mb-1 font-sans">
            Inside this branch, TS narrows to:
            <span className="ml-2 bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono">
              number
            </span>
          </div>
          <div className="text-gray-200">
            <span className="text-gray-400">// </span>
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300"> id.toFixed(2) — works, because number has .toFixed()</span>
          </div>
          <div className="text-gray-200">
            <span className="text-gray-400">// </span>
            <span className="text-red-400">✗</span>
            <span className="text-gray-300"> id.toUpperCase() — ERROR: number has no .toUpperCase()</span>
          </div>
        </div>

        <div className="mt-1">
          <span className="text-gray-200">&#125; </span>
          <span className="text-purple-400">else</span>
          <span className="text-gray-200"> &#123;</span>
        </div>

        {/* Inside else — narrowed to string */}
        <div className="ml-4 my-1 p-2 bg-purple-900/30 rounded border-l-2 border-purple-500">
          <div className="text-[11px] text-purple-300 mb-1 font-sans">
            In the else branch, TS narrows to:
            <span className="ml-2 bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded font-mono">
              string
            </span>
          </div>
          <div className="text-gray-200">
            <span className="text-gray-400">// </span>
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300"> id.toUpperCase() — works, strings have .toUpperCase()</span>
          </div>
          <div className="text-gray-200">
            <span className="text-gray-400">// </span>
            <span className="text-red-400">✗</span>
            <span className="text-gray-300"> id.toFixed(2) — ERROR: string has no .toFixed()</span>
          </div>
        </div>

        <div className="mt-1">
          <span className="text-gray-200">&#125;</span>
        </div>

        {/* Live indicator of which branch this value hits */}
        <div className="mt-4 border-t border-slate-700 pt-3 text-xs">
          <span className="text-gray-400">With current value </span>
          <span className={isNumber ? 'text-blue-300' : 'text-purple-300'}>
            ({typeof value === 'string' ? `"${value}"` : value})
          </span>
          <span className="text-gray-400">, TypeScript narrows to </span>
          <span className={`font-bold ${isNumber ? 'text-blue-300' : 'text-purple-300'}`}>
            {inferredType}
          </span>
          <span className="text-gray-400"> inside the </span>
          <span className={isNumber ? 'text-blue-300 font-bold' : 'text-purple-300 font-bold'}>
            {isNumber ? 'if' : 'else'}
          </span>
          <span className="text-gray-400"> branch.</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        <strong>Type narrowing</strong> means TypeScript tracks runtime checks and tightens the type for you.
      </p>
    </div>
  );
}
