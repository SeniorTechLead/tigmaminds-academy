import { useState, useEffect } from 'react';

// ── Watch It Grow ────────────────────────────────────────────
// Animated bamboo shoot growing upward in real time. New cells
// divide at the apical meristem (glowing tip), elongate below,
// and the stem visibly extends. Growth counter shows cm/hour.

interface Cell {
  id: number;
  y: number;
  height: number;
  age: number;
  dividing: boolean;
}

let cId = 0;

export default function BambooMeristemDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cells, setCells] = useState<Cell[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: cId++, y: 300 - i * 25, height: 22, age: 100 + i * 20, dividing: false,
    }))
  );
  const [totalGrowth, setTotalGrowth] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 340, H = 420;
  const stemX = W / 2;
  const stemWidth = 40;

  useEffect(() => {
    if (paused) return;

    setCells(prev => {
      let updated = prev.map(c => {
        // Young cells elongate (grow taller)
        if (c.age < 60) {
          const growth = 0.15;
          setTotalGrowth(g => g + growth);
          return { ...c, height: c.height + growth, y: c.y - growth, age: c.age + 1 };
        }
        return { ...c, age: c.age + 1 };
      });

      // Top cell divides every ~80 ticks
      if (tick % 80 === 0 && updated.length < 20) {
        const topCell = updated.reduce((a, b) => a.y < b.y ? a : b);
        const newCell: Cell = {
          id: cId++,
          y: topCell.y - 12,
          height: 10,
          age: 0,
          dividing: true,
        };
        updated = [...updated, newCell];
        // Flash the dividing state
        setTimeout(() => {
          setCells(c => c.map(cell => cell.id === newCell.id ? { ...cell, dividing: false } : cell));
        }, 500);
      }

      // Shift everything down slightly to keep the growing tip in view
      if (updated.length > 12) {
        const shift = 0.1;
        updated = updated.map(c => ({ ...c, y: c.y + shift }));
        // Remove cells that go below view
        updated = updated.filter(c => c.y < H - 20);
      }

      return updated;
    });
  }, [tick, paused]);

  // Meristem glow at the tip
  const topY = cells.length > 0 ? Math.min(...cells.map(c => c.y)) : 100;
  const meristemGlow = 0.4 + Math.sin(tick * 0.1) * 0.2;

  // Growth rate display
  const growthCm = (totalGrowth * 0.1).toFixed(1);

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-lime-50 to-stone-50 dark:from-emerald-950 dark:via-lime-950 dark:to-stone-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-lime-700 dark:text-lime-400 uppercase tracking-wider">
          Watch It Grow — Bamboo Meristem
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-lime-700 dark:text-lime-300 font-mono">{growthCm} cm grown</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img"
        aria-label="Animated bamboo shoot growing — cells divide at the meristem and elongate below">

        {/* Bamboo stem background */}
        <rect x={stemX - stemWidth / 2} y={topY - 10} width={stemWidth} height={H - topY}
          fill="#365314" opacity="0.3" rx="6" />

        {/* Individual cells */}
        {cells.map(cell => {
          const youngness = Math.max(0, 1 - cell.age / 80);
          const cellColor = cell.dividing
            ? '#fde047' // flash yellow when dividing
            : `rgb(${34 + youngness * 100}, ${197 - youngness * 50}, ${94 - youngness * 30})`;
          const borderColor = cell.dividing ? '#fbbf24' : '#166534';

          return (
            <g key={cell.id}>
              <rect
                x={stemX - stemWidth / 2 + 3}
                y={cell.y}
                width={stemWidth - 6}
                height={Math.max(2, cell.height - 2)}
                fill={cellColor}
                stroke={borderColor}
                strokeWidth="1"
                rx="3"
                opacity={0.8}
              />
              {/* Nucleus dot */}
              <circle
                cx={stemX}
                cy={cell.y + cell.height / 2}
                r={cell.dividing ? 3 : 2}
                fill={cell.dividing ? '#fde047' : '#0f5132'}
                opacity="0.7"
              />
              {/* Division line when splitting */}
              {cell.dividing && (
                <line x1={stemX - 12} y1={cell.y + cell.height / 2}
                  x2={stemX + 12} y2={cell.y + cell.height / 2}
                  stroke="#fde047" strokeWidth="1.5" strokeDasharray="3,2" />
              )}
            </g>
          );
        })}

        {/* Meristem glow at tip */}
        <circle cx={stemX} cy={topY - 5} r="20"
          fill="#84cc16" opacity={meristemGlow * 0.3} />
        <circle cx={stemX} cy={topY - 5} r="10"
          fill="#a3e635" opacity={meristemGlow * 0.5} />

        {/* Labels */}
        <g opacity="0.7">
          {/* Meristem label */}
          <line x1={stemX + 30} y1={topY - 5} x2={stemX + 70} y2={topY - 20}
            stroke="#84cc16" strokeWidth="1" />
          <text x={stemX + 73} y={topY - 22} fill="#a3e635" fontSize="9" fontWeight="600">
            Apical meristem
          </text>
          <text x={stemX + 73} y={topY - 12} fill="#86efac" fontSize="7">
            (cell division zone)
          </text>

          {/* Elongation zone */}
          <line x1={stemX + 30} y1={topY + 40} x2={stemX + 70} y2={topY + 50}
            stroke="#22c55e" strokeWidth="1" />
          <text x={stemX + 73} y={topY + 48} fill="#22c55e" fontSize="9" fontWeight="600">
            Elongation zone
          </text>
          <text x={stemX + 73} y={topY + 58} fill="#86efac" fontSize="7">
            (cells stretch 10-100×)
          </text>

          {/* Mature zone */}
          <line x1={stemX + 30} y1={topY + 120} x2={stemX + 70} y2={topY + 130}
            stroke="#166534" strokeWidth="1" />
          <text x={stemX + 73} y={topY + 128} fill="#4ade80" fontSize="9" fontWeight="600">
            Mature cells
          </text>
          <text x={stemX + 73} y={topY + 138} fill="#86efac" fontSize="7">
            (fully grown, thickened walls)
          </text>
        </g>

        {/* Growth speed note */}
        <text x={stemX} y={H - 10} textAnchor="middle" fill="#6b7280" fontSize="9">
          Real bamboo grows up to 91 cm/day — the fastest growth of any plant
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-400" /> New cells (dividing)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Elongating
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-900" /> Mature
        </span>
      </div>
    </div>
  );
}
