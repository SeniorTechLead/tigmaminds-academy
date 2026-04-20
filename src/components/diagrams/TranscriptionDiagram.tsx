import { useState, useEffect } from 'react';

// ── DNA → RNA ────────────────────────────────────────────────
// Animated transcription. RNA polymerase moves along a DNA
// template strand, peeling it open and extruding a growing
// mRNA molecule behind it. mRNA bases (AUGC) show the correct
// complementary pairing: A-U, T-A, G-C, C-G.

export default function TranscriptionDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 560, H = 320;
  const cycle = tick % 300;
  const progress = cycle / 300;

  // DNA template (bottom strand) — this is what gets read
  const dnaBases = ['A', 'T', 'G', 'C', 'T', 'A', 'C', 'G', 'A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'T', 'A'];
  // mRNA built by complementary pairing (T→A, A→U, G→C, C→G)
  const complement: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };

  const polX = 80 + progress * 360;
  const synthesizedCount = Math.floor(progress * dnaBases.length);

  const dnaBaseSpacing = 22;
  const dnaStartX = 80;

  return (
    <div className="bg-gradient-to-b from-purple-50 via-slate-50 to-blue-50 dark:from-purple-950 dark:via-slate-950 dark:to-blue-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
          DNA → RNA
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-purple-700 dark:text-purple-300 font-mono">
            {synthesizedCount} bases of mRNA
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
        aria-label="Animated transcription — RNA polymerase reading DNA and building mRNA">

        {/* DNA — top strand (non-template, goes along the full length) */}
        {dnaBases.map((b, i) => {
          const x = dnaStartX + i * dnaBaseSpacing;
          return (
            <g key={`top-${i}`}>
              <circle cx={x} cy={80} r="8" fill="#6366f1" opacity="0.6" />
              <text x={x} y={84} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                {complement[b]}
              </text>
            </g>
          );
        })}
        <text x={dnaStartX - 10} y={85} textAnchor="end" className="fill-indigo-700 dark:fill-indigo-300" fontSize="8" fontWeight="600">
          DNA (non-template)
        </text>

        {/* DNA — bottom strand (template — this is being read) */}
        {dnaBases.map((b, i) => {
          const x = dnaStartX + i * dnaBaseSpacing;
          const isPassed = x < polX - 20;
          const isAtPol = Math.abs(x - polX) < 12;
          return (
            <g key={`bot-${i}`}>
              <circle cx={x} cy={200} r="8"
                fill="#8b5cf6"
                opacity={isAtPol ? 1 : 0.9} />
              <text x={x} y={204} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                {b}
              </text>
              {/* Bond between DNA strands — only intact where polymerase hasn't been */}
              {!isPassed && (
                <line x1={x} y1={88} x2={x} y2={192}
                  stroke="#a78bfa" strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />
              )}
            </g>
          );
        })}
        <text x={dnaStartX - 10} y={205} textAnchor="end" className="fill-purple-700 dark:fill-purple-300" fontSize="8" fontWeight="600">
          DNA (template)
        </text>

        {/* mRNA being built (behind polymerase) — comes out above & floats off */}
        {dnaBases.slice(0, synthesizedCount).map((b, i) => {
          const x = dnaStartX + i * dnaBaseSpacing;
          const rnaY = 140 - (synthesizedCount - i) * 1.5; // slight offset
          return (
            <g key={`rna-${i}`}>
              <circle cx={x} cy={rnaY} r="7" fill="#10b981" opacity="0.9" />
              <text x={x} y={rnaY + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                {complement[b]}
              </text>
            </g>
          );
        })}
        {synthesizedCount > 1 && (
          <text x={dnaStartX - 10} y={145} textAnchor="end" className="fill-emerald-700 dark:fill-emerald-300" fontSize="8" fontWeight="600">
            mRNA →
          </text>
        )}
        {/* Backbone line connecting mRNA */}
        {synthesizedCount > 1 && (
          <line x1={dnaStartX} y1={140} x2={dnaStartX + (synthesizedCount - 1) * dnaBaseSpacing} y2={140}
            stroke="#10b981" strokeWidth="2" opacity="0.5" />
        )}

        {/* RNA Polymerase — the machine */}
        <g transform={`translate(${polX}, 150)`}>
          <ellipse cx={0} cy={0} rx={30} ry={50}
            fill="#ef4444" stroke="#991b1b" strokeWidth="2" opacity="0.85" />
          <text x={0} y={-58} textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="9" fontWeight="600">
            RNA polymerase
          </text>
          <text x={0} y={4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
            read→
          </text>
        </g>

        {/* Arrow showing direction */}
        <path d={`M ${polX + 40},170 l 15,-5 l 0,10 z`} fill="#ef4444" opacity="0.8" />
        <line x1={polX + 30} y1={170} x2={polX + 55} y2={170} stroke="#ef4444" strokeWidth="2" />

        {/* Labels */}
        <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">
          Pairing rules: A↔U · T→A · G↔C (in RNA, T is replaced by U)
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" /> DNA template
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> mRNA (new)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> RNA polymerase
        </span>
      </div>
    </div>
  );
}
