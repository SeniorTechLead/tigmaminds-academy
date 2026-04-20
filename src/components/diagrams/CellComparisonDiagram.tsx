import { useState } from 'react';

// ── Plant vs Animal — Spot the Differences ────────────────────
// Toggleable comparison. Select "both", "plant", or "animal" to
// highlight the corresponding cell. Plant-only organelles
// (cell wall, chloroplasts, large vacuole) light up green when
// "plant" is selected. Shared organelles stay neutral.

type Mode = 'both' | 'plant' | 'animal';

export default function CellComparisonDiagram() {
  const [mode, setMode] = useState<Mode>('both');

  const W = 560, H = 340;

  const showPlant = mode === 'both' || mode === 'plant';
  const showAnimal = mode === 'both' || mode === 'animal';

  // Shared vs plant-specific highlighting
  const plantOnlyColor = mode === 'plant' ? '#15803d' : '#94a3b8';
  const plantOnlyStroke = mode === 'plant' ? 3 : 1.5;

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-slate-50 to-rose-50 dark:from-emerald-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Spot the Differences
        </p>
        <div className="flex items-center gap-1">
          {(['both', 'plant', 'animal'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-xs px-2.5 py-0.5 rounded transition ${
                mode === m
                  ? m === 'plant'
                    ? 'bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500/50'
                    : m === 'animal'
                    ? 'bg-rose-500/30 text-rose-800 dark:text-rose-200 ring-1 ring-rose-500/50'
                    : 'bg-slate-500/30 text-slate-800 dark:text-slate-200 ring-1 ring-slate-500/50'
                  : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated comparison of plant and animal cells — toggle to highlight plant-only organelles">

        {/* Plant cell (left) */}
        {showPlant && (
          <g opacity={mode === 'animal' ? 0.3 : 1}>
            <text x={130} y={25} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="14" fontWeight="bold">
              Plant cell
            </text>

            {/* Cell wall (plant only, rigid rectangle) */}
            <rect x={30} y={45} width={200} height={260} rx={12}
              fill="#dcfce7" opacity="0.5"
              stroke={plantOnlyColor} strokeWidth={plantOnlyStroke + 2} />
            <text x={35} y={60} className="fill-emerald-700 dark:fill-emerald-400" fontSize="8" fontWeight="600">
              Cell wall (cellulose)
            </text>

            {/* Cell membrane inside */}
            <rect x={40} y={55} width={180} height={240} rx={8}
              fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" strokeDasharray="3,2" />

            {/* Large central vacuole (plant-specific) */}
            <ellipse cx={130} cy={175} rx={55} ry={60}
              fill="#bfdbfe" opacity="0.7"
              stroke={plantOnlyColor} strokeWidth={plantOnlyStroke} />
            <text x={130} y={175} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="9" fontWeight="600">
              Large
            </text>
            <text x={130} y={188} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="9" fontWeight="600">
              vacuole
            </text>

            {/* Nucleus */}
            <circle cx={80} cy={100} r={18}
              fill="#c4b5fd" stroke="#6d28d9" strokeWidth="1.5" opacity="0.85" />
            <circle cx={78} cy={98} r="4" fill="#7c3aed" opacity="0.7" />

            {/* Chloroplasts (plant-specific) */}
            {[{ x: 180, y: 90 }, { x: 75, y: 260 }, { x: 190, y: 270 }].map((p, i) => (
              <g key={`chl-${i}`}>
                <ellipse cx={p.x} cy={p.y} rx={14} ry={8}
                  fill="#22c55e" stroke={plantOnlyColor} strokeWidth={plantOnlyStroke}
                  opacity="0.9" />
                {/* Thylakoid stacks */}
                {[-3, 0, 3].map((dx, j) => (
                  <line key={`t-${i}-${j}`}
                    x1={p.x + dx} y1={p.y - 4}
                    x2={p.x + dx} y2={p.y + 4}
                    stroke="#15803d" strokeWidth="0.8" opacity="0.7" />
                ))}
              </g>
            ))}
            <text x={190} y={107} className="fill-emerald-700 dark:fill-emerald-400" fontSize="7" fontWeight="600">
              Chloroplast
            </text>

            {/* Mitochondria */}
            {[{ x: 70, y: 220 }, { x: 190, y: 180 }].map((p, i) => (
              <ellipse key={`m-${i}`} cx={p.x} cy={p.y} rx={12} ry={5}
                fill="#fca5a5" stroke="#dc2626" strokeWidth="1" opacity="0.9" />
            ))}
          </g>
        )}

        {/* Animal cell (right) */}
        {showAnimal && (
          <g opacity={mode === 'plant' ? 0.3 : 1}>
            <text x={430} y={25} textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="14" fontWeight="bold">
              Animal cell
            </text>

            {/* Cell membrane only (no wall) */}
            <ellipse cx={430} cy={175} rx={110} ry={130}
              fill="#fef9c3" opacity="0.3"
              stroke="#fbbf24" strokeWidth="3" />
            <text x={430} y={45} textAnchor="middle" className="fill-amber-700 dark:fill-amber-400" fontSize="8" fontWeight="600">
              Cell membrane (no wall)
            </text>

            {/* Nucleus */}
            <circle cx={430} cy={175} r={32}
              fill="#c4b5fd" stroke="#6d28d9" strokeWidth="1.5" opacity="0.85" />
            <circle cx={425} cy={170} r="8" fill="#7c3aed" opacity="0.7" />

            {/* Small vacuoles (multiple, small) */}
            {[{ x: 380, y: 100 }, { x: 475, y: 115 }].map((p, i) => (
              <circle key={`sv-${i}`} cx={p.x} cy={p.y} r="8"
                fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" opacity="0.7" />
            ))}
            <text x={475} y={100} className="fill-blue-700 dark:fill-blue-400" fontSize="7" fontWeight="600">
              Small vacuoles
            </text>

            {/* Mitochondria (lots of them) */}
            {[
              { x: 370, y: 240 }, { x: 480, y: 235 }, { x: 430, y: 265 },
              { x: 395, y: 130 }, { x: 470, y: 160 },
            ].map((p, i) => (
              <g key={`am-${i}`}>
                <ellipse cx={p.x} cy={p.y} rx={12} ry={5}
                  fill="#fca5a5" stroke="#dc2626" strokeWidth="1" opacity="0.9" />
                {[-3, 0, 3].map((dx, j) => (
                  <line key={`ac-${i}-${j}`}
                    x1={p.x + dx} y1={p.y - 3.5}
                    x2={p.x + dx} y2={p.y + 3.5}
                    stroke="#991b1b" strokeWidth="0.8" opacity="0.5" />
                ))}
              </g>
            ))}

            {/* Lysosomes (animal — rare in plants) */}
            <circle cx={360} cy={180} r="6" fill="#14b8a6" stroke="#0f766e" strokeWidth="1" opacity="0.9" />
            <text x={340} y={197} className="fill-teal-700 dark:fill-teal-400" fontSize="7" fontWeight="600">
              Lysosome
            </text>
          </g>
        )}

        {/* Caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9" fontWeight="600">
          {mode === 'plant' && 'Plant-only: cell wall, chloroplasts, large central vacuole'}
          {mode === 'animal' && 'Animal-only: lysosomes, small vacuoles, no cell wall (flexible shape)'}
          {mode === 'both' && 'Both have nucleus, mitochondria, ribosomes, cell membrane. Plants add walls + chloroplasts + vacuole.'}
        </text>
      </svg>
    </div>
  );
}
