import { useState } from 'react';

// ── Count With Me ─────────────────────────────────────────────
// Interactive P(n,r) vs C(n,r). Pick n (items) and r (chosen).
// Toggle between "order matters" (permutations, shows all arrangements)
// and "order doesn't matter" (combinations, shows each group once).
// For small n,r we actually list the outcomes. Large n,r just shows
// the formula evaluated.

type Mode = 'perm' | 'comb';

const COLORS = [
  { fill: '#f87171', text: 'white' }, // red
  { fill: '#34d399', text: 'white' }, // green
  { fill: '#60a5fa', text: 'white' }, // blue
  { fill: '#fbbf24', text: 'white' }, // amber
  { fill: '#a78bfa', text: 'white' }, // violet
  { fill: '#ec4899', text: 'white' }, // pink
  { fill: '#14b8a6', text: 'white' }, // teal
];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function factorial(n: number): number {
  if (n <= 1) return 1;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

function permutations<T>(arr: T[], r: number): T[][] {
  if (r === 0) return [[]];
  if (arr.length < r) return [];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest, r - 1)) {
      out.push([arr[i], ...p]);
    }
  }
  return out;
}

function combinations<T>(arr: T[], r: number): T[][] {
  if (r === 0) return [[]];
  if (arr.length < r) return [];
  if (arr.length === r) return [[...arr]];
  const [head, ...tail] = arr;
  const withHead = combinations(tail, r - 1).map(c => [head, ...c]);
  const withoutHead = combinations(tail, r);
  return [...withHead, ...withoutHead];
}

export default function CombinatoricsGridDiagram() {
  const [n, setN] = useState(4);
  const [r, setR] = useState(2);
  const [mode, setMode] = useState<Mode>('comb');

  const rClamped = Math.min(r, n);
  const items = Array.from({ length: n }, (_, i) => ({
    letter: LETTERS[i],
    ...COLORS[i],
  }));

  const pCount = factorial(n) / factorial(n - rClamped);
  const cCount = pCount / factorial(rClamped);

  // Only show the actual list if it's small enough
  const listables = mode === 'perm' ? pCount : cCount;
  const canList = listables <= 60;

  const actualList = canList
    ? (mode === 'perm' ? permutations(items, rClamped) : combinations(items, rClamped))
    : [];

  const formula = mode === 'perm'
    ? `P(${n},${rClamped}) = ${n}! / (${n}−${rClamped})! = ${n}! / ${n - rClamped}! = ${pCount.toLocaleString()}`
    : `C(${n},${rClamped}) = ${n}! / (${rClamped}! × (${n}−${rClamped})!) = ${cCount.toLocaleString()}`;

  const ratioExplain = rClamped > 0 && pCount >= cCount
    ? `${pCount} permutations ÷ ${factorial(rClamped)} rearrangements per group = ${cCount} combinations`
    : '';

  return (
    <div className="bg-gradient-to-b from-purple-50 via-slate-50 to-teal-50 dark:from-purple-950 dark:via-slate-950 dark:to-teal-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
          Count With Me
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('perm')}
            className={`text-xs font-bold px-3 py-1 rounded transition ${
              mode === 'perm'
                ? 'bg-purple-500 text-white'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            Order matters (P)
          </button>
          <button
            onClick={() => setMode('comb')}
            className={`text-xs font-bold px-3 py-1 rounded transition ${
              mode === 'comb'
                ? 'bg-teal-500 text-white'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            Order doesn&apos;t (C)
          </button>
        </div>
      </div>

      {/* Item pool */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">Pool of {n}:</span>
        {items.map(item => (
          <div key={item.letter}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: item.fill, color: item.text }}>
            {item.letter}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-3">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span>n (pool size)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{n}</span>
          </label>
          <input type="range" min={1} max={7} value={n}
            onChange={e => setN(parseInt(e.target.value))}
            className={`w-full ${mode === 'perm' ? 'accent-purple-500' : 'accent-teal-500'}`} />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span>r (chosen)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{rClamped}</span>
          </label>
          <input type="range" min={0} max={n} value={rClamped}
            onChange={e => setR(parseInt(e.target.value))}
            className={`w-full ${mode === 'perm' ? 'accent-purple-500' : 'accent-teal-500'}`} />
        </div>
      </div>

      {/* Formula */}
      <div className={`rounded-lg p-3 mb-3 ${
        mode === 'perm'
          ? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-300 dark:ring-purple-700'
          : 'bg-teal-100 dark:bg-teal-900/30 ring-1 ring-teal-300 dark:ring-teal-700'
      }`}>
        <div className={`font-mono text-sm font-bold text-center ${
          mode === 'perm' ? 'text-purple-800 dark:text-purple-200' : 'text-teal-800 dark:text-teal-200'
        }`}>
          {formula}
        </div>
        {mode === 'comb' && rClamped > 0 && pCount > cCount && (
          <div className="text-[11px] text-center text-gray-600 dark:text-gray-400 mt-1">
            {ratioExplain}
          </div>
        )}
      </div>

      {/* Actual enumeration (if small) */}
      {canList ? (
        <div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 text-center font-semibold uppercase tracking-wider">
            All {actualList.length} {mode === 'perm' ? 'arrangements' : 'groups'}:
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center max-h-48 overflow-y-auto p-2 bg-white/50 dark:bg-white/5 rounded">
            {actualList.map((combo, i) => (
              <div key={i} className="flex items-center gap-0.5 rounded p-0.5 ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800">
                {combo.map((item, j) => (
                  <div key={j}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: item.fill, color: item.text }}>
                    {item.letter}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 italic p-3 bg-white/50 dark:bg-white/5 rounded">
          Too many to list — try smaller n or r to see them all.
        </div>
      )}

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        Permutation counts every ordering separately. Combination counts each group once. <strong>C = P ÷ r!</strong> — divide by the number of ways each group can be rearranged.
      </p>
    </div>
  );
}
