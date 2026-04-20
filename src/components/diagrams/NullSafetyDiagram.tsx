import { useState } from 'react';

// ── Null-Safety Operators ────────────────────────────────────
// Toggle between: el (a valid object) and el (null). See how
// unsafe access crashes, but ?. and ?? handle it gracefully.

export default function NullSafetyDiagram() {
  const [hasValue, setHasValue] = useState(true);

  const el = hasValue ? { name: 'Ranga', park: { name: 'Kaziranga' } } : null;

  // Simulate the runtime behaviors
  const unsafeResult = hasValue ? 'RANGA' : 'CRASH 💥 "Cannot read properties of null"';
  const optionalChainResult = hasValue ? 'RANGA' : 'undefined';
  const nullishResult = hasValue ? 'RANGA' : '"Unknown"';

  return (
    <div className="bg-gradient-to-b from-rose-50 via-slate-50 to-emerald-50 dark:from-rose-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          Null-Safety Operators
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">el is:</span>
          <button onClick={() => setHasValue(true)}
            className={`text-xs font-mono font-bold px-3 py-1 rounded transition ${
              hasValue ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300'
            }`}>
            {'{name: "Ranga", ...}'}
          </button>
          <button onClick={() => setHasValue(false)}
            className={`text-xs font-mono font-bold px-3 py-1 rounded transition ${
              !hasValue ? 'bg-rose-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300'
            }`}>
            null
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {/* Unsafe access */}
        <div className={`rounded-lg p-3 ${!hasValue ? 'bg-rose-100 dark:bg-rose-900/30 ring-2 ring-rose-400' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{hasValue ? '✓' : '💥'}</span>
            <div className="flex-1">
              <code className="text-sm font-mono text-slate-900 dark:text-slate-100 font-bold">
                el.name.toUpperCase()
              </code>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unsafe — TS won&apos;t let you write this if el could be null</div>
            </div>
            <div className="text-right">
              <span className={`font-mono text-sm font-bold ${hasValue ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                {unsafeResult}
              </span>
            </div>
          </div>
        </div>

        {/* Optional chaining */}
        <div className={`rounded-lg p-3 ${!hasValue ? 'bg-amber-50 dark:bg-amber-900/30 ring-2 ring-amber-400' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{hasValue ? '✓' : '⚠'}</span>
            <div className="flex-1">
              <code className="text-sm font-mono text-slate-900 dark:text-slate-100 font-bold">
                el?.name.toUpperCase()
              </code>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Optional chaining · returns <code>undefined</code> if el is null</div>
            </div>
            <div className="text-right">
              <span className={`font-mono text-sm font-bold ${hasValue ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                {optionalChainResult}
              </span>
            </div>
          </div>
        </div>

        {/* Nullish coalescing */}
        <div className={`rounded-lg p-3 ${!hasValue ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-400' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">✓</span>
            <div className="flex-1">
              <code className="text-sm font-mono text-slate-900 dark:text-slate-100 font-bold">
                el?.name.toUpperCase() ?? &quot;Unknown&quot;
              </code>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nullish coalescing · provides a fallback when null/undefined</div>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {nullishResult}
              </span>
            </div>
          </div>
        </div>

        {/* Deep chain example */}
        <div className="rounded-lg p-3 bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <div className="flex-1">
              <code className="text-sm font-mono text-slate-900 dark:text-slate-100 font-bold">
                el?.park?.name
              </code>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chains safely through any number of levels</div>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                {hasValue ? '"Kaziranga"' : 'undefined'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        <strong>Before TypeScript:</strong> &quot;Cannot read property of null&quot; was the most common JS bug.
        <strong> After TypeScript:</strong> the compiler forces you to handle null first.
      </p>
    </div>
  );
}
