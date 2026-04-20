import { useState } from 'react';

// ── Interactive String Slicer ────────────────────────────────
// A word shown as numbered boxes (positive AND negative indices).
// Sliders control start, stop, step — instantly see which chars
// are included in the result. Default word: KAZIRANGA.

const WORD = 'KAZIRANGA';

export default function StringSlicingDiagram() {
  const [start, setStart] = useState(0);
  const [stop, setStop] = useState(WORD.length);
  const [step, setStep] = useState(1);

  // Compute which indices are included in the slice
  const sliced: number[] = [];
  if (step > 0) {
    for (let i = start; i < stop; i += step) {
      if (i >= 0 && i < WORD.length) sliced.push(i);
    }
  } else if (step < 0) {
    for (let i = start; i > stop; i += step) {
      if (i >= 0 && i < WORD.length) sliced.push(i);
    }
  }

  const result = sliced.map(i => WORD[i]).join('');

  return (
    <div className="bg-gradient-to-b from-pink-50 via-slate-50 to-amber-50 dark:from-pink-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <p className="text-xs font-bold text-pink-700 dark:text-pink-400 uppercase tracking-wider mb-3">
        Slice a String — Move the Sliders
      </p>

      {/* Character boxes with both positive and negative indices */}
      <div className="overflow-x-auto mb-4 pb-2">
        <div className="flex gap-1 justify-center min-w-max">
          {WORD.split('').map((ch, i) => {
            const negIdx = i - WORD.length;
            const included = sliced.includes(i);
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                  {i}
                </span>
                <div className={`w-9 h-10 rounded-md border-2 flex items-center justify-center text-lg font-mono font-bold transition-all ${
                  included
                    ? 'border-pink-500 bg-pink-200 dark:bg-pink-900/50 text-pink-900 dark:text-pink-100 scale-110'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {ch}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                  {negIdx}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span>start = <span className="font-mono font-bold text-pink-700 dark:text-pink-300">{start}</span></span>
          </label>
          <input type="range" min={-WORD.length} max={WORD.length} value={start}
            onChange={e => setStart(+e.target.value)}
            className="w-full accent-pink-500" />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span>stop = <span className="font-mono font-bold text-pink-700 dark:text-pink-300">{stop}</span></span>
          </label>
          <input type="range" min={-WORD.length} max={WORD.length} value={stop}
            onChange={e => setStop(+e.target.value)}
            className="w-full accent-pink-500" />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span>step = <span className="font-mono font-bold text-pink-700 dark:text-pink-300">{step}</span></span>
            <span className="text-gray-500">(negative step reverses)</span>
          </label>
          <input type="range" min={-3} max={3} step={1} value={step}
            onChange={e => setStep(+e.target.value)}
            className="w-full accent-pink-500" />
        </div>
      </div>

      {/* Result */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-3 font-mono text-sm">
        <div className="text-gray-400 text-xs mb-1">Python expression:</div>
        <div className="text-amber-300">
          <span className="text-emerald-300">&quot;{WORD}&quot;</span>[{start}:{stop}{step !== 1 ? `:${step}` : ''}]
        </div>
        <div className="text-gray-400 text-xs mt-2 mb-1">Result:</div>
        <div className="text-white text-lg font-bold tracking-wider">
          &quot;{result || '(empty)'}&quot;
          {result && <span className="text-gray-500 text-xs ml-2">{result.length} char{result.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>

      {/* Quick tips */}
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Try:</strong> <code className="bg-white/50 dark:bg-white/10 px-1 rounded">start=0, stop=5, step=1</code> → KAZIR ·
        <code className="bg-white/50 dark:bg-white/10 px-1 rounded ml-2">start=8, stop=-10, step=-1</code> → AGNARIZAK (reversed)</p>
      </div>
    </div>
  );
}
