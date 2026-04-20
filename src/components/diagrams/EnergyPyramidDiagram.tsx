import { useState, useEffect } from 'react';

// ── Where Does the Energy Go? ────────────────────────────────
// Animated energy pyramid. Energy particles flow up from the sun
// through producers → herbivores → carnivores → apex. At each
// level, 90% of particles scatter away as heat (red), only 10%
// make it to the next level. Visceral demonstration of the 10% rule.

interface EnergyDot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  level: number; // 0=sun, 1=producer, 2=herbivore, 3=carnivore, 4=apex
  isHeat: boolean; // true = lost as metabolic heat
  age: number;
}

let dotId = 0;

const LEVELS = [
  { label: 'Sun', color: '#fde047', y: 340, height: 0 },
  { label: 'Producers', sublabel: '10,000 kcal', color: '#22c55e', emoji: '🌿', y: 260, width: 320 },
  { label: 'Herbivores', sublabel: '1,000 kcal', color: '#60a5fa', emoji: '🦌', y: 195, width: 220 },
  { label: 'Carnivores', sublabel: '100 kcal', color: '#f97316', emoji: '🐅', y: 140, width: 140 },
  { label: 'Apex', sublabel: '10 kcal', color: '#ef4444', emoji: '🦅', y: 95, width: 80 },
];

export default function EnergyPyramidDiagram() {
  const [tick, setTick] = useState(0);
  const [dots, setDots] = useState<EnergyDot[]>([]);
  const [paused, setPaused] = useState(false);
  const [heatLost, setHeatLost] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 500, H = 400;
  const centerX = W / 2;

  useEffect(() => {
    if (paused) return;

    setDots(prev => {
      const next: EnergyDot[] = [];

      // Spawn energy from sun (every 3 ticks — lots of energy at the base)
      if (tick % 3 === 0) {
        next.push({
          id: dotId++, level: 0, isHeat: false,
          x: centerX + (Math.random() - 0.5) * 300,
          y: LEVELS[0].y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1.5 - Math.random() * 0.5,
          age: 0,
        });
      }

      let newHeat = 0;

      for (const d of prev) {
        const nd = { ...d, x: d.x + d.vx, y: d.y + d.vy, age: d.age + 1 };

        if (nd.isHeat) {
          // Heat particles drift outward and fade
          nd.vx *= 1.02;
          nd.vy = -0.3 - Math.random() * 0.2;
          if (nd.age > 60 || nd.x < -20 || nd.x > W + 20) continue;
          next.push(nd);
          continue;
        }

        // Check if dot reached the next level boundary
        for (let lvl = 1; lvl < LEVELS.length; lvl++) {
          const levelY = LEVELS[lvl].y + 30; // bottom of this level
          if (nd.level === lvl - 1 && nd.y < levelY) {
            // Decide: 10% pass through, 90% become heat
            if (Math.random() < 0.1) {
              // Passes to next level!
              nd.level = lvl;
              nd.vy = -0.8 - Math.random() * 0.3;
              // Funnel toward center
              nd.vx = (centerX - nd.x) * 0.02;
            } else {
              // Lost as heat — scatter sideways
              nd.isHeat = true;
              nd.vx = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random());
              nd.vy = -0.5;
              newHeat++;
            }
            break;
          }
        }

        // Keep moving upward
        if (!nd.isHeat) {
          nd.vy = Math.max(-2, nd.vy + 0.002); // slow down slightly
          nd.vx += (centerX - nd.x) * 0.001; // gentle centering
        }

        if (nd.age < 200 && nd.y > 30) {
          next.push(nd);
        }
      }

      if (newHeat > 0) setHeatLost(c => c + newHeat);

      return [...prev.filter(d => d.age < 200 && d.y > 30 && d.x > -30 && d.x < W + 30), ...next].slice(-150);
    });
  }, [tick, paused]);

  return (
    <div className="bg-gradient-to-b from-amber-50 via-slate-50 to-slate-50 dark:from-amber-950 dark:via-slate-950 dark:to-slate-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Where Does the Energy Go?
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-red-400 font-mono">{heatLost} lost as heat</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img"
        aria-label="Animated energy pyramid — watch 90% of energy lost as heat at each trophic level">

        {/* Pyramid levels (bottom to top) */}
        {LEVELS.slice(1).map((level, i) => {
          const halfW = level.width / 2;
          const nextLevel = LEVELS[i + 2];
          const topHalfW = nextLevel ? nextLevel.width / 2 : 30;
          const topY = nextLevel ? nextLevel.y + 30 : level.y - 25;

          return (
            <g key={`level-${i}`}>
              {/* Trapezoid shape */}
              <path
                d={`M ${centerX - halfW},${level.y + 30} L ${centerX + halfW},${level.y + 30} L ${centerX + topHalfW},${topY} L ${centerX - topHalfW},${topY} Z`}
                fill={level.color}
                opacity="0.15"
                stroke={level.color}
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              {/* Level label */}
              <text x={centerX} y={level.y + 18} textAnchor="middle" fill={level.color}
                fontSize="11" fontWeight="bold">
                {level.emoji} {level.label}
              </text>
              <text x={centerX} y={level.y + 30} textAnchor="middle" fill={level.color}
                fontSize="9" opacity="0.7">
                {level.sublabel}
              </text>
              {/* Percentage labels on sides */}
              {i < 3 && (
                <>
                  <text x={centerX + halfW + 15} y={level.y + 20} fill="#ef4444"
                    fontSize="9" fontWeight="600" opacity="0.6">
                    90% → heat
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Sun at bottom */}
        <circle cx={centerX} cy={LEVELS[0].y + 15} r="18" fill="#fde047" opacity="0.7" />
        <text x={centerX} y={LEVELS[0].y + 19} textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="bold">
          ☀ Sun
        </text>
        <text x={centerX} y={LEVELS[0].y + 38} textAnchor="middle" fill="#fde047" fontSize="8" opacity="0.5">
          1,000,000 kcal of sunlight
        </text>

        {/* 10% arrow on the left */}
        <g opacity="0.5">
          <path d={`M ${centerX - 180},${LEVELS[1].y + 30} L ${centerX - 180},${LEVELS[4].y}`}
            fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" />
          <text x={centerX - 195} y={(LEVELS[1].y + LEVELS[4].y) / 2} fill="#22c55e"
            fontSize="9" fontWeight="600" textAnchor="end"
            transform={`rotate(-90, ${centerX - 195}, ${(LEVELS[1].y + LEVELS[4].y) / 2})`}>
            Only 10% passes up →
          </text>
        </g>

        {/* ── Energy dots ── */}
        {dots.map(d => {
          const color = d.isHeat
            ? '#ef4444'
            : d.level < LEVELS.length ? LEVELS[d.level].color : '#fde047';
          const opacity = d.isHeat
            ? Math.max(0, 0.6 - d.age * 0.01)
            : Math.min(0.8, d.age * 0.05);
          const size = d.isHeat ? 1.5 : 2.5;

          return (
            <circle key={d.id} cx={d.x} cy={d.y} r={size} fill={color} opacity={opacity} />
          );
        })}

        {/* "Heat lost" indicators on sides */}
        {['←', '→'].map((arrow, si) => {
          const side = si === 0 ? -1 : 1;
          return (
            <text key={`heat-${si}`}
              x={centerX + side * 200} y={200}
              textAnchor="middle" fill="#ef4444" fontSize="10" opacity="0.4">
              {arrow} heat
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-300" /> Solar energy
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Stored in biomass
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Lost as heat (metabolism)
        </span>
      </div>
    </div>
  );
}
