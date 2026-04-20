import { useState, useEffect } from 'react';

// ── Run the Game ──────────────────────────────────────────────
// Simulate playing a dice game many times. Live counter tracks
// the running average; it converges to the expected value as
// trials grow — the Law of Large Numbers in action. Editable
// payouts so the user can change the game and see the EV shift.

interface Outcome {
  faces: number[];
  payout: number;
  color: string;
}

export default function ExpectedValueDiagram() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { faces: [1, 2], payout: 0, color: '#ef4444' },
    { faces: [3, 4, 5], payout: 1, color: '#f59e0b' },
    { faces: [6], payout: 5, color: '#10b981' },
  ]);

  const [rolls, setRolls] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [history, setHistory] = useState<number[]>([]); // running averages at each checkpoint
  const [running, setRunning] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  // Expected value — computed from current outcomes
  const ev = outcomes.reduce((s, o) => s + (o.faces.length / 6) * o.payout, 0);
  const average = rolls > 0 ? totalPayout / rolls : 0;

  const payoutForFace = (face: number) => {
    for (const o of outcomes) if (o.faces.includes(face)) return o.payout;
    return 0;
  };

  const rollOnce = () => {
    const face = 1 + Math.floor(Math.random() * 6);
    const p = payoutForFace(face);
    setRolls(r => r + 1);
    setTotalPayout(t => t + p);
    setLastRoll(face);
  };

  const rollMany = (n: number) => {
    let addedPayout = 0;
    for (let i = 0; i < n; i++) {
      const face = 1 + Math.floor(Math.random() * 6);
      addedPayout += payoutForFace(face);
    }
    setRolls(r => r + n);
    setTotalPayout(t => t + addedPayout);
  };

  const reset = () => {
    setRolls(0);
    setTotalPayout(0);
    setHistory([]);
    setLastRoll(null);
    setRunning(false);
  };

  // Auto-run
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => rollOnce(), 40);
    return () => clearInterval(id);
  }, [running, outcomes]);

  // Record history for the running-average chart
  useEffect(() => {
    if (rolls > 0 && rolls % 5 === 0) {
      setHistory(h => [...h, average].slice(-100));
    }
  }, [rolls]);

  const updatePayout = (idx: number, newPayout: number) => {
    setOutcomes(os => os.map((o, i) => i === idx ? { ...o, payout: newPayout } : o));
    reset();
  };

  const W = 560, H = 180;
  const chartH = 100;

  return (
    <div className="bg-gradient-to-b from-amber-50 via-slate-50 to-emerald-50 dark:from-amber-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Run the Game — Watch EV Emerge
        </p>
        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
          {rolls.toLocaleString()} rolls
        </span>
      </div>

      {/* Payout rules — editable */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {outcomes.map((o, i) => (
          <div key={i} className="rounded-lg p-2 text-center text-xs" style={{ background: o.color + '20', border: `1px solid ${o.color}` }}>
            <div className="font-semibold mb-1" style={{ color: o.color }}>
              Roll {o.faces.join(', ')}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400">
              probability {o.faces.length}/6
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-gray-600 dark:text-gray-300">Win:</span>
              <input type="number"
                value={o.payout}
                onChange={e => updatePayout(i, parseFloat(e.target.value) || 0)}
                className="w-16 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-mono font-bold"
                style={{ color: o.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* EV vs running average */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 text-center border-2 border-dashed border-amber-400">
          <div className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-300 font-semibold">
            Expected Value (theory)
          </div>
          <div className="text-2xl font-mono font-bold text-amber-700 dark:text-amber-300 mt-1">
            {ev.toFixed(3)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            {outcomes.map((o, i) => `${o.faces.length}/6 × ${o.payout}`).join(' + ')}
          </div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 text-center border-2 border-emerald-400">
          <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-semibold">
            Running Average (live)
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {rolls === 0 ? '—' : average.toFixed(3)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            diff from EV: {rolls === 0 ? '—' : (average - ev).toFixed(3)}
          </div>
        </div>
      </div>

      {/* Running-average chart */}
      <svg viewBox={`0 0 ${W} ${chartH + 30}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Running average converging to expected value">
        <rect x={0} y={0} width={W} height={chartH} fill="#f8fafc" className="dark:fill-slate-800" />

        {/* EV reference line */}
        {(() => {
          const maxY = Math.max(ev, ...history, 1) * 1.3;
          const minY = 0;
          const yAt = (v: number) => chartH - ((v - minY) / (maxY - minY)) * chartH;
          return (
            <>
              <line x1={0} y1={yAt(ev)} x2={W} y2={yAt(ev)}
                stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              <text x={W - 5} y={yAt(ev) - 4} textAnchor="end" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">
                EV = {ev.toFixed(3)}
              </text>

              {/* History polyline */}
              {history.length > 1 && (
                <polyline
                  points={history.map((v, i) => `${(i / (history.length - 1)) * W},${yAt(v)}`).join(' ')}
                  fill="none" stroke="#10b981" strokeWidth="2" />
              )}
            </>
          );
        })()}
        <text x={5} y={chartH + 14} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Last: roll {lastRoll ?? '—'} · history: {history.length} samples
        </text>
      </svg>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
        <button onClick={() => rollOnce()}
          className="text-xs px-3 py-1 rounded bg-slate-700 text-white font-semibold hover:bg-slate-800 transition">
          🎲 Roll 1
        </button>
        <button onClick={() => rollMany(10)}
          className="text-xs px-3 py-1 rounded bg-slate-700 text-white font-semibold hover:bg-slate-800 transition">
          Roll 10
        </button>
        <button onClick={() => rollMany(100)}
          className="text-xs px-3 py-1 rounded bg-slate-700 text-white font-semibold hover:bg-slate-800 transition">
          Roll 100
        </button>
        <button onClick={() => rollMany(1000)}
          className="text-xs px-3 py-1 rounded bg-slate-700 text-white font-semibold hover:bg-slate-800 transition">
          Roll 1000
        </button>
        <button onClick={() => setRunning(r => !r)}
          className={`text-xs px-3 py-1 rounded font-semibold transition ${
            running ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}>
          {running ? '⏹ Stop' : '▶ Auto-roll'}
        </button>
        <button onClick={reset}
          className="text-xs px-3 py-1 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition">
          Reset
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        The dashed line is the <strong>theoretical expected value</strong>. The green line is the <strong>actual running average</strong>.
        Roll enough times and they <strong>must</strong> meet — that&apos;s the Law of Large Numbers.
      </p>
    </div>
  );
}
