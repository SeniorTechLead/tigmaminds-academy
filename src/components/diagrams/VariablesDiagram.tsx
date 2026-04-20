import { useState, useEffect } from 'react';

// ── Labeled Boxes, Actually Running ──────────────────────────
// Walk through a small script line by line. Each line flashes,
// the variables update in their "boxes," and you see the state
// evolve. Step forward/back or let it auto-play.
// Shows: x = 5, y = x + 3, x = y * 2, print(x, y)

const LINES = [
  { code: 'x = 5', narrate: 'Put 5 in the box labeled x.' },
  { code: 'y = x + 3', narrate: 'Look up x (5), add 3, put 8 in y.' },
  { code: 'x = y * 2', narrate: 'Look up y (8), multiply by 2, put 16 in x. y is unchanged.' },
  { code: 'print(x, y)', narrate: 'Output: 16 8' },
];

interface State {
  x?: number;
  y?: number;
}

function stateAtLine(i: number): State {
  const s: State = {};
  if (i >= 1) s.x = 5;
  if (i >= 2) s.y = 8;
  if (i >= 3) s.x = 16;
  return s;
}

export default function VariablesDiagram() {
  const [line, setLine] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!auto || paused) return;
    const interval = setInterval(() => {
      setLine(l => (l + 1) % (LINES.length + 1));
    }, 1600);
    return () => clearInterval(interval);
  }, [auto, paused]);

  const state = stateAtLine(line);

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50 dark:from-blue-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          Watch Variables in Action
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAuto(false); setLine(l => Math.max(0, l - 1)); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            ← Prev
          </button>
          <button
            onClick={() => setAuto(!auto)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              auto
                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            {auto ? 'Auto ●' : 'Manual'}
          </button>
          <button
            onClick={() => { setAuto(false); setLine(l => Math.min(LINES.length, l + 1)); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Next →
          </button>
          {auto && (
            <button
              onClick={() => setPaused(!paused)}
              className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
            >
              {paused ? '▶' : '⏸'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Code block */}
        <div className="flex-1 bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm">
          {LINES.map((l, i) => (
            <div key={i}
              className={`py-1 px-2 rounded transition-colors ${
                i === line - 1
                  ? 'bg-yellow-500/30 text-yellow-100 ring-1 ring-yellow-500'
                  : i < line - 1
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}>
              <span className="text-gray-500 select-none mr-2">{i + 1}</span>
              {l.code}
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
            {line === 0 ? 'Ready to run →' : line > LINES.length - 1 ? 'Program finished.' : LINES[line - 1].narrate}
          </div>
        </div>

        {/* Boxes (variables) */}
        <div className="flex-1 bg-white/50 dark:bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
            Variables (labeled boxes)
          </p>
          <div className="flex gap-4 justify-center items-end">
            {/* x box */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-lg border-4 flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                state.x !== undefined
                  ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600'
              }`}>
                {state.x ?? '—'}
              </div>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300 mt-2 font-bold">x</span>
            </div>

            {/* y box */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-lg border-4 flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                state.y !== undefined
                  ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600'
              }`}>
                {state.y ?? '—'}
              </div>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300 mt-2 font-bold">y</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
            {line === 3 && (
              <span className="text-amber-700 dark:text-amber-300 font-semibold">
                💡 x was reassigned. But y didn&apos;t change — y was set from x&apos;s <em>old</em> value on line 2.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
