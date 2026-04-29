import { useState, useEffect } from 'react';

// ── The Twisting Ladder ──────────────────────────────────────
// A rotating DNA double helix. Base pairs are color-coded:
// A-T (red-blue) and G-C (green-yellow). The helix slowly unzips
// at one end to show replication — new complementary strands form.

const BASES = ['A', 'T', 'G', 'C', 'A', 'G', 'T', 'C', 'A', 'T',
               'G', 'C', 'T', 'A', 'G', 'C', 'A', 'T', 'G', 'A'] as const;
const COMPLEMENT: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
const BASE_COLOR: Record<string, string> = {
  A: '#ef4444', // red
  T: '#3b82f6', // blue
  G: '#22c55e', // green
  C: '#eab308', // yellow
};

export default function DNADoubleHelixDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showReplication, setShowReplication] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 460, H = 420;
  const centerX = showReplication ? 180 : W / 2;
  const helixR = 45;
  const vertSpacing = 18;
  const rotSpeed = 0.025;

  // Unzip progress (0 to 1) — top bases unzip first
  const unzipProgress = showReplication ? Math.min(1, tick * 0.003) : 0;

  return (
    <div className="bg-gradient-to-b from-indigo-950 via-slate-950 to-purple-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          The Twisting Ladder
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowReplication(!showReplication); setTick(0); }}
            className={`text-xs px-2 py-0.5 rounded transition ${
              showReplication
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {showReplication ? '🧬 Replicating...' : 'Watch it replicate →'}
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Animated rotating DNA double helix with base pairs">

        {/* Sugar-phosphate backbone curves (behind bases) */}
        {BASES.slice(0, -1).map((_, i) => {
          const y1 = 30 + i * vertSpacing;
          const y2 = 30 + (i + 1) * vertSpacing;
          const a1 = tick * rotSpeed + i * 0.6;
          const a2 = tick * rotSpeed + (i + 1) * 0.6;
          const lx1 = centerX + Math.cos(a1) * helixR;
          const lx2 = centerX + Math.cos(a2) * helixR;
          const rx1 = centerX - Math.cos(a1) * helixR;
          const rx2 = centerX - Math.cos(a2) * helixR;
          const d1 = (Math.sin(a1) + 1) / 2;

          const unzipLine = (1 - unzipProgress) * BASES.length;
          if (showReplication && i < unzipLine - 1) return null;

          return (
            <g key={`bb-${i}`} opacity={0.3 + d1 * 0.5}>
              <line x1={lx1} y1={y1} x2={lx2} y2={y2}
                stroke="#818cf8" strokeWidth="1.5" opacity="0.4" />
              <line x1={rx1} y1={y1} x2={rx2} y2={y2}
                stroke="#f472b6" strokeWidth="1.5" opacity="0.4" />
            </g>
          );
        })}

        {/* Base pairs and rungs */}
        {BASES.map((base, i) => {
          const y = 30 + i * vertSpacing;
          const angle = tick * rotSpeed + i * 0.6;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const depth = (sin + 1) / 2;

          const lx = centerX + cos * helixR;
          const rx = centerX - cos * helixR;

          const comp = COMPLEMENT[base];
          const leftColor = BASE_COLOR[base];
          const rightColor = BASE_COLOR[comp];

          const unzipLine = (1 - unzipProgress) * BASES.length;
          const isUnzipped = showReplication && i < unzipLine;
          const sep = isUnzipped ? 30 + (unzipLine - i) * 4 : 0;
          const newStrandOpacity = isUnzipped ? Math.min(1, (unzipLine - i) * 0.3) : 0;

          return (
            <g key={i} opacity={0.3 + depth * 0.7}>
              {!isUnzipped ? (
                <>
                  <line x1={lx} y1={y} x2={rx} y2={y}
                    stroke="#475569" strokeWidth={1 + depth} opacity={0.5} />
                  <circle cx={lx} cy={y} r={3 + depth * 2} fill={leftColor} opacity={0.9} />
                  {depth > 0.5 && (
                    <text x={lx} y={y + 1} textAnchor="middle" fill="white" fontSize="7"
                      fontWeight="bold">{base}</text>
                  )}
                  <circle cx={rx} cy={y} r={3 + depth * 2} fill={rightColor} opacity={0.9} />
                  {depth > 0.5 && (
                    <text x={rx} y={y + 1} textAnchor="middle" fill="white" fontSize="7"
                      fontWeight="bold">{comp}</text>
                  )}
                </>
              ) : (
                <>
                  {/* Left original + new complement */}
                  <circle cx={lx - sep} cy={y} r={3 + depth * 2} fill={leftColor} opacity={0.9} />
                  <text x={lx - sep} y={y + 1} textAnchor="middle" fill="white"
                    fontSize="7" fontWeight="bold">{base}</text>
                  <circle cx={lx - sep + 15} cy={y} r={3 + depth * 1.5}
                    fill={rightColor} opacity={newStrandOpacity * 0.7} />
                  <line x1={lx - sep} y1={y} x2={lx - sep + 15} y2={y}
                    stroke="#475569" strokeWidth="1" opacity={newStrandOpacity * 0.4} />

                  {/* Right original + new complement */}
                  <circle cx={rx + sep} cy={y} r={3 + depth * 2} fill={rightColor} opacity={0.9} />
                  <text x={rx + sep} y={y + 1} textAnchor="middle" fill="white"
                    fontSize="7" fontWeight="bold">{comp}</text>
                  <circle cx={rx + sep - 15} cy={y} r={3 + depth * 1.5}
                    fill={leftColor} opacity={newStrandOpacity * 0.7} />
                  <line x1={rx + sep} y1={y} x2={rx + sep - 15} y2={y}
                    stroke="#475569" strokeWidth="1" opacity={newStrandOpacity * 0.4} />

                  {/* Replication fork glow */}
                  {Math.abs(i - unzipLine) < 1.5 && (
                    <circle cx={centerX} cy={y} r="12"
                      fill="#818cf8" opacity={0.15 + Math.sin(tick * 0.1) * 0.1} />
                  )}
                </>
              )}
            </g>
          );
        })}

        {/* Replication labels */}
        {showReplication && unzipProgress > 0.1 && (
          <g>
            <text x={centerX} y={30 + (1 - unzipProgress) * BASES.length * vertSpacing - 15}
              textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="600" opacity="0.8">
              ← Helicase unzips →
            </text>
            <text x={centerX - 60} y={20} textAnchor="middle" fill="#c4b5fd" fontSize="8">
              Original + New
            </text>
            <text x={centerX + 60} y={20} textAnchor="middle" fill="#c4b5fd" fontSize="8">
              Original + New
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
        {[
          ['#ef4444', 'Adenine (A)'],
          ['#3b82f6', 'Thymine (T)'],
          ['#22c55e', 'Guanine (G)'],
          ['#eab308', 'Cytosine (C)'],
        ].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5 text-gray-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
        <span className="text-gray-500 ml-2">A pairs with T · G pairs with C</span>
      </div>
    </div>
  );
}
