import { useState, useEffect } from 'react';

// ── The Silent War ────────────────────────────────────────────
// Animated immune response. White blood cells (phagocytes)
// patrol the bloodstream, chase down bacterial invaders, engulf
// and destroy them. Antibodies (Y-shaped) tag pathogens first.
// Click anywhere to spawn an invader.

interface Cell {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'wbc' | 'pathogen' | 'antibody';
  target: number | null;
  age: number;
  engulfed: boolean;
  tagged: boolean;
  deathAge: number;
}

let cellId = 0;

const W = 540, H = 320;

function makeWBC(x: number, y: number): Cell {
  return {
    id: cellId++, type: 'wbc', x, y,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    target: null, age: 0, engulfed: false, tagged: false, deathAge: 0,
  };
}

function makePathogen(x: number, y: number): Cell {
  return {
    id: cellId++, type: 'pathogen', x, y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    target: null, age: 0, engulfed: false, tagged: false, deathAge: 0,
  };
}

export default function ImmuneSystemDiagram() {
  const [cells, setCells] = useState<Cell[]>(() => [
    makeWBC(100, 100), makeWBC(200, 200), makeWBC(400, 150), makeWBC(300, 250),
    makePathogen(450, 50), makePathogen(50, 250), makePathogen(500, 270),
  ]);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [kills, setKills] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (paused) return;

    setCells(prev => {
      const wbcs = prev.filter(c => c.type === 'wbc' && !c.engulfed);
      const pathogens = prev.filter(c => c.type === 'pathogen' && !c.engulfed);

      const next: Cell[] = prev.map(c => {
        if (c.engulfed) return { ...c, deathAge: c.deathAge + 1 };

        let nvx = c.vx, nvy = c.vy;

        if (c.type === 'wbc' && pathogens.length > 0) {
          // Find nearest pathogen and chase
          let nearest = pathogens[0];
          let nearestDist = Infinity;
          for (const p of pathogens) {
            const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
            if (d < nearestDist) { nearestDist = d; nearest = p; }
          }
          const dx = nearest.x - c.x;
          const dy = nearest.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            nvx = c.vx * 0.9 + (dx / dist) * 1.5 * 0.2;
            nvy = c.vy * 0.9 + (dy / dist) * 1.5 * 0.2;
          }

          // Engulf if close enough
          if (dist < 18) {
            nearest.engulfed = true;
            setKills(k => k + 1);
          }
        } else if (c.type === 'pathogen') {
          // Random drift
          nvx = c.vx + (Math.random() - 0.5) * 0.2;
          nvy = c.vy + (Math.random() - 0.5) * 0.2;
          // Bound speed
          const sp = Math.sqrt(nvx * nvx + nvy * nvy);
          if (sp > 2.5) { nvx = nvx / sp * 2.5; nvy = nvy / sp * 2.5; }
        }

        let nx = c.x + nvx;
        let ny = c.y + nvy;

        // Bounce off edges
        if (nx < 15) { nx = 15; nvx = Math.abs(nvx); }
        if (nx > W - 15) { nx = W - 15; nvx = -Math.abs(nvx); }
        if (ny < 15) { ny = 15; nvy = Math.abs(nvy); }
        if (ny > H - 15) { ny = H - 15; nvy = -Math.abs(nvy); }

        return { ...c, x: nx, y: ny, vx: nvx, vy: nvy, age: c.age + 1 };
      });

      // Remove old engulfed
      return next.filter(c => !c.engulfed || c.deathAge < 20);
    });

    // Spawn new pathogens occasionally
    if (tick % 180 === 0 && tick > 0) {
      setCells(prev => {
        if (prev.filter(c => c.type === 'pathogen' && !c.engulfed).length >= 6) return prev;
        return [...prev, makePathogen(
          Math.random() > 0.5 ? 20 : W - 20,
          20 + Math.random() * (H - 40),
        )];
      });
    }
  }, [tick, paused]);

  const spawnPathogen = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setCells(prev => [...prev, makePathogen(x, y)]);
  };

  const activePathogens = cells.filter(c => c.type === 'pathogen' && !c.engulfed).length;

  return (
    <div className="bg-gradient-to-b from-rose-50 via-slate-50 to-blue-50 dark:from-rose-950 dark:via-slate-950 dark:to-blue-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          The Silent War
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-rose-700 dark:text-rose-300 font-mono">
            {kills} engulfed • {activePathogens} active threats
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto cursor-crosshair" role="img"
        onClick={spawnPathogen}
        aria-label="Animated immune response — white blood cells chase and engulf bacterial invaders">

        {/* Bloodstream background */}
        <rect x={0} y={0} width={W} height={H} fill="#fee2e2" opacity="0.15" className="dark:fill-rose-900 dark:opacity-20" />

        {/* Red blood cells drifting in background */}
        {Array.from({ length: 10 }, (_, i) => {
          const x = ((i * 83 + tick * 0.5) % W);
          const y = 40 + (i * 37) % (H - 80);
          return (
            <ellipse key={`rbc-${i}`} cx={x} cy={y} rx="8" ry="5"
              fill="#fca5a5" opacity="0.3" />
          );
        })}

        {/* Cells */}
        {cells.map(c => {
          if (c.type === 'wbc') {
            // Phagocyte — irregular blob
            return (
              <g key={c.id}>
                <circle cx={c.x} cy={c.y} r="14" fill="#e0e7ff" opacity="0.3" />
                <circle cx={c.x} cy={c.y} r="11"
                  fill="#c7d2fe" stroke="#6366f1" strokeWidth="1.5" opacity="0.95" />
                {/* Nucleus — multi-lobed */}
                <circle cx={c.x - 3} cy={c.y - 2} r="3" fill="#4338ca" opacity="0.6" />
                <circle cx={c.x + 2} cy={c.y + 3} r="2.5" fill="#4338ca" opacity="0.6" />
                {/* Pseudopod reaching toward target */}
                <ellipse cx={c.x + c.vx * 3} cy={c.y + c.vy * 3} rx="4" ry="3"
                  fill="#c7d2fe" opacity="0.7"
                  transform={`rotate(${Math.atan2(c.vy, c.vx) * 180 / Math.PI}, ${c.x + c.vx * 3}, ${c.y + c.vy * 3})`} />
              </g>
            );
          }
          if (c.type === 'pathogen') {
            if (c.engulfed) {
              // Dissolving effect
              return (
                <circle key={c.id} cx={c.x} cy={c.y} r={6 - c.deathAge / 4}
                  fill="#ef4444" opacity={1 - c.deathAge / 20} />
              );
            }
            // Bacteria
            return (
              <g key={c.id}>
                <ellipse cx={c.x} cy={c.y} rx="7" ry="5"
                  fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" opacity="0.9" />
                {/* Flagella */}
                <line x1={c.x - 7} y1={c.y} x2={c.x - 12 + Math.sin(tick * 0.5) * 2} y2={c.y + Math.cos(tick * 0.5) * 2}
                  stroke="#7f1d1d" strokeWidth="1" opacity="0.6" />
              </g>
            );
          }
          return null;
        })}

        {/* Instructions */}
        <text x={W / 2} y={H - 10} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">
          Click anywhere to introduce a pathogen — watch the white blood cells hunt it down
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-300" /> Phagocyte (white blood cell)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Bacterial pathogen
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-300" /> Red blood cells (background)
        </span>
      </div>
    </div>
  );
}
