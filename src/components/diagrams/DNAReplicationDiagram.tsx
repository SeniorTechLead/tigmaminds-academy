import { useState, useEffect } from 'react';

// ── DNA Unzipping and Copying ────────────────────────────────
// Animated semi-conservative replication. Helicase unwinds the
// double helix into two strands. Polymerase attaches new bases
// complementary to each template strand. Result: two identical
// daughter helices from one parent. Track progress of synthesis.

export default function DNAReplicationDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 560, H = 340;
  const cycle = tick % 300;
  const progress = cycle / 300; // 0 to 1

  // Progress of the replication fork (moves right)
  const forkX = 120 + progress * 300;

  // Base pairs
  const basePairs = Array.from({ length: 20 }, (_, i) => {
    const x = 120 + i * 20;
    const basePair = ['A-T', 'T-A', 'G-C', 'C-G'][i % 4];
    const [top, bot] = basePair.split('-');
    const separated = x < forkX;
    return { x, top, bot, separated };
  });

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-slate-50 to-purple-50 dark:from-indigo-950 dark:via-slate-950 dark:to-purple-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
          Unzip and Copy
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">
            {Math.round(progress * 100)}% replicated
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated DNA replication — double helix unzipping and new strands being synthesized">

        {/* Original helix — ahead of fork */}
        {basePairs.map((bp, i) => (
          <g key={`bp-${i}`}>
            {!bp.separated ? (
              <>
                {/* Top strand */}
                <circle cx={bp.x} cy={130} r="8" fill="#6366f1" opacity="0.85" />
                <text x={bp.x} y={134} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{bp.top}</text>
                {/* Bottom strand */}
                <circle cx={bp.x} cy={210} r="8" fill="#8b5cf6" opacity="0.85" />
                <text x={bp.x} y={214} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{bp.bot}</text>
                {/* Connector */}
                <line x1={bp.x} y1={138} x2={bp.x} y2={202}
                  stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" strokeDasharray="2,2" />
              </>
            ) : (
              <>
                {/* Top strand (original) + newly added base */}
                <circle cx={bp.x} cy={100} r="8" fill="#6366f1" opacity="0.85" />
                <text x={bp.x} y={104} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{bp.top}</text>
                <circle cx={bp.x} cy={140} r="8" fill="#10b981" opacity="0.85" />
                <text x={bp.x} y={144} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{bp.bot}</text>
                <line x1={bp.x} y1={108} x2={bp.x} y2={132}
                  stroke="#10b981" strokeWidth="1.5" opacity="0.6" />

                {/* Bottom strand (original) + newly added base */}
                <circle cx={bp.x} cy={240} r="8" fill="#8b5cf6" opacity="0.85" />
                <text x={bp.x} y={244} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{bp.bot}</text>
                <circle cx={bp.x} cy={200} r="8" fill="#10b981" opacity="0.85" />
                <text x={bp.x} y={204} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{bp.top}</text>
                <line x1={bp.x} y1={208} x2={bp.x} y2={232}
                  stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
              </>
            )}
          </g>
        ))}

        {/* Backbone sugar-phosphate strands */}
        <line x1={120} y1={100} x2={forkX} y2={100} stroke="#4338ca" strokeWidth="2.5" />
        <line x1={forkX} y1={100} x2={forkX} y2={130} stroke="#4338ca" strokeWidth="2.5" />
        <line x1={forkX} y1={130} x2={520} y2={130} stroke="#4338ca" strokeWidth="2.5" />

        <line x1={120} y1={140} x2={forkX} y2={140} stroke="#10b981" strokeWidth="2.5" />
        <line x1={120} y1={200} x2={forkX} y2={200} stroke="#10b981" strokeWidth="2.5" />

        <line x1={120} y1={240} x2={forkX} y2={240} stroke="#6d28d9" strokeWidth="2.5" />
        <line x1={forkX} y1={240} x2={forkX} y2={210} stroke="#6d28d9" strokeWidth="2.5" />
        <line x1={forkX} y1={210} x2={520} y2={210} stroke="#6d28d9" strokeWidth="2.5" />

        {/* Helicase (unzipping enzyme) at the fork */}
        <g transform={`translate(${forkX}, 170)`}>
          <ellipse cx={0} cy={0} rx={14} ry={22}
            fill="#fbbf24" stroke="#d97706" strokeWidth="2" opacity="0.9" />
          <text x={0} y={-30} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">
            Helicase
          </text>
          <text x={0} y={3} textAnchor="middle" fill="#7c2d12" fontSize="9" fontWeight="bold">
            ⊗
          </text>
        </g>

        {/* DNA polymerase (copying enzyme) — two of them, one per strand */}
        <g transform={`translate(${forkX - 25}, 115)`}>
          <rect x={-12} y={-10} width={24} height={20} rx={4}
            fill="#ef4444" opacity="0.85" />
          <text x={0} y={-15} textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="8" fontWeight="600">
            DNA pol
          </text>
        </g>
        <g transform={`translate(${forkX - 25}, 225)`}>
          <rect x={-12} y={-10} width={24} height={20} rx={4}
            fill="#ef4444" opacity="0.85" />
        </g>

        {/* Labels */}
        <text x={80} y={110} className="fill-indigo-700 dark:fill-indigo-300" fontSize="9" fontWeight="600">
          Parent strand 1
        </text>
        <text x={80} y={205} className="fill-purple-700 dark:fill-purple-300" fontSize="9" fontWeight="600">
          Parent strand 2
        </text>
        <text x={80} y={150} className="fill-emerald-700 dark:fill-emerald-300" fontSize="9" fontWeight="600">
          New daughter
        </text>
        <text x={80} y={258} className="fill-emerald-700 dark:fill-emerald-300" fontSize="9" fontWeight="600">
          New daughter
        </text>

        {/* Key insight */}
        <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">
          Each new helix = 1 original strand + 1 newly synthesized strand (semi-conservative)
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" /> Original template
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Newly synthesized
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" /> Helicase (unzips)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> DNA polymerase (copies)
        </span>
      </div>
    </div>
  );
}
