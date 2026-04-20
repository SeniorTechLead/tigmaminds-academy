import { useState, useEffect } from 'react';

// ── One Becomes Two, Forever ──────────────────────────────────
// Live bacterial division. Start with 1 cell, it splits every
// "generation" (compressed to ~2s in the demo). Live counter
// shows real-world-time equivalent (20 min per division).
// Visceral demo of exponential growth. Reset to start over.

interface Cell {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number; // ticks since birth
  size: number; // grows until division
  parentId: number | null;
}

let cellId = 0;

const GENERATION_TICKS = 70; // ticks between divisions (demo speed)
const W = 520, H = 340;
const CELL_RADIUS_MIN = 4;
const CELL_RADIUS_MAX = 7;

export default function BacteriaStructureDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cells, setCells] = useState<Cell[]>([
    { id: cellId++, x: W / 2, y: H / 2, vx: 0, vy: 0, age: 0, size: CELL_RADIUS_MIN, parentId: null },
  ]);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  // Division tick
  useEffect(() => {
    if (paused) return;
    if (cells.length >= 1024) return; // cap for performance

    setCells(prev => {
      const next: Cell[] = [];
      let divided = false;

      for (const c of prev) {
        // Grow each cell
        const growth = (CELL_RADIUS_MAX - CELL_RADIUS_MIN) / GENERATION_TICKS;
        const newSize = Math.min(CELL_RADIUS_MAX, c.size + growth);

        // Gentle drift — slight Brownian motion
        const newVx = c.vx * 0.95 + (Math.random() - 0.5) * 0.3;
        const newVy = c.vy * 0.95 + (Math.random() - 0.5) * 0.3;
        let newX = c.x + newVx;
        let newY = c.y + newVy;

        // Bounce off edges
        if (newX < 15 || newX > W - 15) newX = Math.max(15, Math.min(W - 15, newX));
        if (newY < 15 || newY > H - 15) newY = Math.max(15, Math.min(H - 15, newY));

        const updated: Cell = { ...c, x: newX, y: newY, vx: newVx, vy: newVy, age: c.age + 1, size: newSize };

        // Divide?
        if (c.age > 0 && c.age % GENERATION_TICKS === 0) {
          divided = true;
          // Parent halves in size
          updated.size = CELL_RADIUS_MIN;
          // Offspring pops out in a random direction
          const angle = Math.random() * Math.PI * 2;
          const daughter: Cell = {
            id: cellId++,
            x: c.x + Math.cos(angle) * 8,
            y: c.y + Math.sin(angle) * 8,
            vx: Math.cos(angle) * 0.8,
            vy: Math.sin(angle) * 0.8,
            age: 1,
            size: CELL_RADIUS_MIN,
            parentId: c.id,
          };
          next.push(updated, daughter);
        } else {
          next.push(updated);
        }
      }

      if (divided) setGeneration(g => g + 1);
      return next;
    });
  }, [tick, paused]);

  const reset = () => {
    setCells([{ id: cellId++, x: W / 2, y: H / 2, vx: 0, vy: 0, age: 0, size: CELL_RADIUS_MIN, parentId: null }]);
    setGeneration(0);
  };

  // Real-world time at 20 min/generation
  const realMinutes = generation * 20;
  const realTime = realMinutes < 60
    ? `${realMinutes} min`
    : realMinutes < 1440
    ? `${Math.floor(realMinutes / 60)}h ${realMinutes % 60}m`
    : `${(realMinutes / 1440).toFixed(1)} days`;

  // Comparison benchmarks
  const benchmark = cells.length >= 8_000_000_000
    ? '= more than Earth\'s human population'
    : cells.length >= 1_000_000
    ? '= thousands are now a visible colony'
    : cells.length >= 1000
    ? '= visible as a speck under microscope'
    : cells.length >= 100
    ? '= a microcolony'
    : '';

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-slate-50 to-teal-50 dark:from-emerald-950 dark:via-slate-950 dark:to-teal-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          One Becomes Two, Forever
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
            {cells.length.toLocaleString()} cells • {realTime}
          </span>
          <button
            onClick={reset}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated bacterial cell division — watch a single cell become thousands">

        {/* Petri dish edge */}
        <rect x={5} y={5} width={W - 10} height={H - 10} rx={12}
          fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.4" />

        {/* Cells */}
        {cells.map(c => (
          <g key={c.id}>
            {/* Glow */}
            <circle cx={c.x} cy={c.y} r={c.size + 3} fill="#34d399" opacity="0.15" />
            {/* Body — elongated capsule shape (bacteria are rod-shaped) */}
            <ellipse cx={c.x} cy={c.y} rx={c.size * 1.4} ry={c.size}
              fill="#10b981" stroke="#047857" strokeWidth="1" opacity="0.85" />
            {/* "DNA" — nucleoid dot */}
            <circle cx={c.x} cy={c.y} r={c.size * 0.3}
              fill="#064e3b" opacity="0.7" />
            {/* Division hint — light line across center when about to divide */}
            {c.age > GENERATION_TICKS - 10 && c.age % GENERATION_TICKS !== 0 && (
              <line x1={c.x} y1={c.y - c.size + 1} x2={c.x} y2={c.y + c.size - 1}
                stroke="#fbbf24" strokeWidth="1" opacity="0.8" />
            )}
          </g>
        ))}

        {/* Overlay: generation counter */}
        <text x={20} y={30} className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">
          Generation {generation}
        </text>
        <text x={20} y={46} className="fill-gray-600 dark:fill-gray-400" fontSize="9">
          (1 generation = ~20 min in real life)
        </text>

        {benchmark && (
          <text x={W - 20} y={30} textAnchor="end" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="600">
            {benchmark}
          </text>
        )}

        {cells.length >= 1024 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="10" fontWeight="bold">
            Capped at 1024 cells — in reality, this keeps going
          </text>
        )}
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Bacterial cell
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-900" /> Nucleoid (DNA)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> About to divide
        </span>
      </div>
    </div>
  );
}
