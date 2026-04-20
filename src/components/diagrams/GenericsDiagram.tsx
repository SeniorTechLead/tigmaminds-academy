import { useState } from 'react';

// ── Generics — Types as Parameters ───────────────────────────
// Show a generic function `first<T>(arr: T[]): T`. Pick an input
// type (number[], string[], or Elephant[]) and see how T resolves
// and the return type changes accordingly.

type Sample = 'numbers' | 'strings' | 'elephants';

const SAMPLES: Record<Sample, { label: string; value: string; elementType: string; firstValue: string }> = {
  numbers: {
    label: 'number[]',
    value: '[4500, 3800, 5200]',
    elementType: 'number',
    firstValue: '4500',
  },
  strings: {
    label: 'string[]',
    value: '["Ranga", "Tara", "Bali"]',
    elementType: 'string',
    firstValue: '"Ranga"',
  },
  elephants: {
    label: 'Elephant[]',
    value: '[{name: "Ranga"}, {name: "Tara"}]',
    elementType: 'Elephant',
    firstValue: '{name: "Ranga"}',
  },
};

export default function GenericsDiagram() {
  const [sample, setSample] = useState<Sample>('numbers');
  const s = SAMPLES[sample];

  return (
    <div className="bg-gradient-to-b from-violet-50 via-slate-50 to-emerald-50 dark:from-violet-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider mb-3">
        Generics — Types as Parameters
      </p>

      {/* Function definition with highlighted T */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm mb-3">
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Function definition</div>
        <div>
          <span className="text-purple-400">function</span>
          <span className="text-yellow-300"> first</span>
          <span className="text-gray-200">&lt;</span>
          <span className="bg-violet-500/30 text-violet-300 px-1 rounded font-bold">T</span>
          <span className="text-gray-200">&gt;(arr: </span>
          <span className="bg-violet-500/30 text-violet-300 px-1 rounded font-bold">T</span>
          <span className="text-gray-200">[]): </span>
          <span className="bg-violet-500/30 text-violet-300 px-1 rounded font-bold">T</span>
          <span className="text-gray-200"> | </span>
          <span className="text-emerald-300">undefined</span>
          <span className="text-gray-200"> &#123;</span>
        </div>
        <div className="ml-4">
          <span className="text-purple-400">return</span>
          <span className="text-gray-200"> arr[0];</span>
        </div>
        <div>
          <span className="text-gray-200">&#125;</span>
        </div>
        <p className="text-[11px] text-violet-300 mt-3 font-sans">
          <strong>T</strong> is a type parameter. It&apos;s a placeholder — whoever calls the function fills in the real type.
        </p>
      </div>

      {/* Sample picker */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xs text-gray-600 dark:text-gray-400">Call first() with:</span>
        {(['numbers', 'strings', 'elephants'] as Sample[]).map(k => (
          <button key={k}
            onClick={() => setSample(k)}
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded transition ${
              sample === k
                ? 'bg-violet-500 text-white'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            {SAMPLES[k].label}
          </button>
        ))}
      </div>

      {/* Type resolution */}
      <div className="grid md:grid-cols-3 gap-3 items-center">
        {/* Input */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Input</div>
          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all">
            {s.value}
          </div>
          <div className="mt-2 text-[11px]">
            <span className="text-gray-500">Type: </span>
            <span className="bg-violet-500/20 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {s.elementType}[]
            </span>
          </div>
        </div>

        {/* Arrow showing T being bound */}
        <div className="text-center">
          <div className="text-2xl mb-2">→</div>
          <div className="bg-violet-100 dark:bg-violet-900/30 rounded-lg p-2 border border-violet-300 dark:border-violet-700">
            <div className="text-[10px] uppercase tracking-wider text-violet-700 dark:text-violet-300 mb-1">
              TS infers
            </div>
            <div className="font-mono text-sm font-bold">
              <span className="bg-violet-500/30 text-violet-800 dark:text-violet-200 px-1.5 py-0.5 rounded">T</span>
              <span className="text-violet-700 dark:text-violet-300"> = </span>
              <span className="bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded">
                {s.elementType}
              </span>
            </div>
          </div>
          <div className="text-2xl mt-2">→</div>
        </div>

        {/* Output */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Output</div>
          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all">
            {s.firstValue}
          </div>
          <div className="mt-2 text-[11px]">
            <span className="text-gray-500">Type: </span>
            <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {s.elementType} | undefined
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-700 dark:text-gray-300 mt-3 text-center">
        One function, typed for every possible element type. <strong>No need to write `firstNumber`, `firstString`, `firstElephant`.</strong>
      </p>
    </div>
  );
}
