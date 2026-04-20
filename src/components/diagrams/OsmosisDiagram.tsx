import { useState, useEffect } from 'react';

// ── Osmosis: The Great Migration ─────────────────────────────
// Two chambers separated by a membrane. Left has pure water, right
// has sugar solution. Water molecules drift through the membrane
// toward the sugar side. Sugar molecules are too big to pass.
// Watch the right side's water level rise in real time.
// Switch between hypotonic/isotonic/hypertonic to see a red blood
// cell swell, stay normal, or shrivel.

type Mode = 'hypotonic' | 'isotonic' | 'hypertonic';

interface WaterMol {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  side: 'left' | 'right';
  age: number;
}

let wmId = 0;

export default function OsmosisDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<Mode>('hypotonic');
  const [waterMols, setWaterMols] = useState<WaterMol[]>([]);
  const [crossCount, setCrossCount] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  // Reset on mode change
  useEffect(() => {
    setWaterMols([]);
    setCrossCount(0);
    setTick(0);
    wmId = 0;
  }, [mode]);

  const W = 500, H = 320;
  const membraneX = W / 2;
  const waterTop = 100;
  const waterBottom = 260;

  // Water level differential (right side rises in hypotonic)
  const levelShift = mode === 'hypotonic' ? Math.min(30, crossCount * 0.8) :
                     mode === 'hypertonic' ? -Math.min(20, crossCount * 0.5) : 0;

  // Red blood cell state
  const cellR = mode === 'hypotonic' ? 20 + Math.min(10, crossCount * 0.3) :
                mode === 'hypertonic' ? Math.max(10, 20 - crossCount * 0.3) : 20;
  const cellOpacity = mode === 'hypertonic' ? 0.9 : 0.7;

  // Sugar molecule positions (right side only, too big to cross)
  const sugarMols = mode !== 'isotonic' ? [
    { x: 320, y: 160 }, { x: 370, y: 200 }, { x: 400, y: 150 },
    { x: 350, y: 230 }, { x: 430, y: 180 }, { x: 310, y: 210 },
  ] : [
    { x: 320, y: 180 }, { x: 380, y: 200 },
  ];

  // In hypertonic mode, also add sugar on the LEFT (outside the cell)
  const leftSugar = mode === 'hypertonic' ? [
    { x: 80, y: 160 }, { x: 120, y: 200 }, { x: 150, y: 170 },
    { x: 60, y: 220 }, { x: 170, y: 230 }, { x: 100, y: 190 },
    { x: 140, y: 240 }, { x: 70, y: 180 },
  ] : [];

  useEffect(() => {
    if (paused) return;

    setWaterMols(prev => {
      const next: WaterMol[] = [];

      // Spawn water molecules
      if (tick % 5 === 0) {
        // Left side
        next.push({
          id: wmId++, side: 'left',
          x: 30 + Math.random() * (membraneX - 60),
          y: waterTop + 20 + Math.random() * (waterBottom - waterTop - 40),
          vx: 0.5 + Math.random() * 0.5,
          vy: (Math.random() - 0.5) * 1.5,
          age: 0,
        });
        // Right side
        next.push({
          id: wmId++, side: 'right',
          x: membraneX + 20 + Math.random() * (W - membraneX - 50),
          y: waterTop + 20 + Math.random() * (waterBottom - waterTop - 40),
          vx: -0.3 + (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 1.5,
          age: 0,
        });
      }

      for (const mol of prev) {
        const nm = { ...mol, x: mol.x + mol.vx, y: mol.y + mol.vy, age: mol.age + 1 };

        // Brownian jiggle
        nm.vx += (Math.random() - 0.5) * 0.4;
        nm.vy += (Math.random() - 0.5) * 0.4;

        // Boundary bounce
        if (nm.y < waterTop + 10 || nm.y > waterBottom - 10) nm.vy *= -0.8;
        if (nm.x < 15) nm.vx = Math.abs(nm.vx);
        if (nm.x > W - 15) nm.vx = -Math.abs(nm.vx);

        // Membrane crossing logic
        if (Math.abs(nm.x - membraneX) < 8) {
          const crossingRight = nm.side === 'left' && nm.vx > 0;
          const crossingLeft = nm.side === 'right' && nm.vx < 0;

          // Net flow depends on mode
          const shouldCross = mode === 'hypotonic'
            ? (crossingRight && Math.random() < 0.15) || (crossingLeft && Math.random() < 0.03)
            : mode === 'hypertonic'
            ? (crossingLeft && Math.random() < 0.15) || (crossingRight && Math.random() < 0.03)
            : (crossingRight && Math.random() < 0.05) || (crossingLeft && Math.random() < 0.05);

          if (shouldCross) {
            nm.side = nm.side === 'left' ? 'right' : 'left';
            nm.x = nm.side === 'right' ? membraneX + 12 : membraneX - 12;
            setCrossCount(c => c + 1);
          } else {
            nm.vx *= -0.6; // bounce off
          }
        }

        if (nm.age < 200) {
          next.push(nm);
        }
      }

      return [...prev.filter(m => m.age < 200), ...next].slice(-100);
    });
  }, [tick, paused, mode]);

  const modeConfig: Record<Mode, { label: string; desc: string; cellLabel: string }> = {
    hypotonic: { label: 'Hypotonic', desc: 'More water outside → water rushes IN', cellLabel: 'Cell swells!' },
    isotonic: { label: 'Isotonic', desc: 'Equal concentration → no net flow', cellLabel: 'Cell normal' },
    hypertonic: { label: 'Hypertonic', desc: 'More solute outside → water flows OUT', cellLabel: 'Cell shrivels!' },
  };

  return (
    <div className="bg-gradient-to-b from-blue-950 via-slate-950 to-teal-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">
          Osmosis — Watch Water Move
        </p>
        <div className="flex items-center gap-2">
          {(['hypotonic', 'isotonic', 'hypertonic'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`text-xs px-2 py-0.5 rounded transition ${
                mode === m
                  ? 'bg-teal-500/30 text-teal-300 ring-1 ring-teal-500/50'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}>
              {modeConfig[m].label}
            </button>
          ))}
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 mb-2">{modeConfig[mode].desc}</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label={`Osmosis in ${mode} solution — water molecules crossing a semi-permeable membrane`}>

        {/* Container walls */}
        <rect x="10" y={waterTop - 10} width={W - 20} height={waterBottom - waterTop + 20}
          fill="none" stroke="#334155" strokeWidth="2" rx="6" />

        {/* Water fills */}
        {/* Left side */}
        <rect x="12" y={waterTop - 8 - (mode === 'hypertonic' ? levelShift : mode === 'hypotonic' ? -levelShift * 0.3 : 0)}
          width={membraneX - 14} height={waterBottom - waterTop + 16 + (mode === 'hypertonic' ? levelShift : mode === 'hypotonic' ? -levelShift * 0.3 : 0)}
          fill="#1e3a5f" opacity="0.4" rx="4" />
        {/* Right side */}
        <rect x={membraneX + 2} y={waterTop - 8 + (mode === 'hypotonic' ? -levelShift : mode === 'hypertonic' ? levelShift * 0.3 : 0)}
          width={W - membraneX - 14} height={waterBottom - waterTop + 16 - (mode === 'hypotonic' ? -levelShift : mode === 'hypertonic' ? levelShift * 0.3 : 0)}
          fill={mode === 'hypertonic' ? '#1e3a4f' : '#1e2f5f'} opacity="0.4" rx="4" />

        {/* ── Membrane ── */}
        <line x1={membraneX} y1={waterTop - 10} x2={membraneX} y2={waterBottom + 10}
          stroke="#94a3b8" strokeWidth="3" strokeDasharray="6,4" />
        {/* Membrane pores */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const py = waterTop + 15 + i * 28;
          return (
            <circle key={`pore-${i}`} cx={membraneX} cy={py} r="4"
              fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          );
        })}
        <text x={membraneX} y={waterBottom + 25} textAnchor="middle" fill="#94a3b8" fontSize="8">
          Semi-permeable membrane
        </text>

        {/* ── Red blood cell (right side) ── */}
        <ellipse cx={380} cy={190} rx={cellR} ry={cellR * 0.7}
          fill="#dc2626" opacity={cellOpacity} stroke="#991b1b" strokeWidth="1.5" />
        {/* Biconcave indent */}
        {mode !== 'hypotonic' && (
          <ellipse cx={380} cy={190} rx={cellR * 0.4} ry={cellR * 0.3}
            fill="#7f1d1d" opacity="0.3" />
        )}
        <text x={380} y={190 + cellR + 15} textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="600">
          {modeConfig[mode].cellLabel}
        </text>

        {/* ── Sugar molecules (too big to cross) ── */}
        {sugarMols.map((s, i) => {
          const jiggle = Math.sin(tick * 0.06 + i * 2) * 2;
          return (
            <g key={`sugar-r-${i}`}>
              <circle cx={s.x + jiggle} cy={s.y} r="7" fill="#a855f7" opacity="0.5" />
              <text x={s.x + jiggle} y={s.y + 1} textAnchor="middle" fill="#e9d5ff" fontSize="6"
                fontWeight="bold">S</text>
            </g>
          );
        })}
        {leftSugar.map((s, i) => {
          const jiggle = Math.sin(tick * 0.05 + i * 1.8) * 2;
          return (
            <g key={`sugar-l-${i}`}>
              <circle cx={s.x + jiggle} cy={s.y} r="7" fill="#a855f7" opacity="0.5" />
              <text x={s.x + jiggle} y={s.y + 1} textAnchor="middle" fill="#e9d5ff" fontSize="6"
                fontWeight="bold">S</text>
            </g>
          );
        })}

        {/* ── Water molecules ── */}
        {waterMols.map(mol => (
          <circle key={mol.id} cx={mol.x} cy={mol.y} r="2.5"
            fill="#60a5fa" opacity={0.6 + Math.sin(mol.age * 0.1) * 0.2} />
        ))}

        {/* Side labels */}
        <text x={membraneX / 2} y={waterTop - 15} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="600">
          {mode === 'hypertonic' ? 'High solute' : mode === 'hypotonic' ? 'Pure water' : 'Equal'}
        </text>
        <text x={membraneX + (W - membraneX) / 2} y={waterTop - 15} textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="600">
          {mode === 'hypertonic' ? 'Low solute (cell)' : mode === 'hypotonic' ? 'Sugar solution' : 'Equal'}
        </text>

        {/* Net flow arrow */}
        {mode !== 'isotonic' && (
          <g>
            <path
              d={mode === 'hypotonic'
                ? `M ${membraneX - 50},${waterBottom + 5} L ${membraneX + 50},${waterBottom + 5}`
                : `M ${membraneX + 50},${waterBottom + 5} L ${membraneX - 50},${waterBottom + 5}`}
              fill="none" stroke="#60a5fa" strokeWidth="2"
              markerEnd="url(#osmArrow)" />
            <defs>
              <marker id="osmArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
              </marker>
            </defs>
            <text x={membraneX} y={waterBottom + 20} textAnchor="middle" fill="#60a5fa" fontSize="8">
              net water flow
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400" /> Water (H₂O) — passes through
        </span>
        <span className="flex items-center gap-1 text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" /> Sugar (solute) — too big to cross
        </span>
        <span className="flex items-center gap-1 text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600" /> Red blood cell
        </span>
      </div>
    </div>
  );
}

