import { useState, useEffect } from 'react';

// ── Yeast at Work ─────────────────────────────────────────────
// Animated fermentation jar: yeast cells at the bottom consume
// sugar molecules → produce CO₂ bubbles (rising) and ethanol
// (accumulating). Visceral demo of how bread rises and beer/
// kombucha/apong (rice beer) is made.

interface Sugar {
  id: number;
  x: number;
  y: number;
  consumed: boolean;
  vy: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  vy: number;
  size: number;
}

let sId = 0;
let bId = 0;

const W = 420, H = 380;
const JAR_LEFT = 70, JAR_RIGHT = 350;
const JAR_TOP = 40, JAR_BOTTOM = 330;

export default function FermentationDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sugars, setSugars] = useState<Sugar[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [co2Released, setCo2Released] = useState(0);
  const [ethanolLevel, setEthanolLevel] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  // Yeast cell positions (bottom of jar)
  const yeastCells = [
    { x: 120, y: JAR_BOTTOM - 25 }, { x: 160, y: JAR_BOTTOM - 18 },
    { x: 200, y: JAR_BOTTOM - 30 }, { x: 240, y: JAR_BOTTOM - 22 },
    { x: 280, y: JAR_BOTTOM - 15 }, { x: 320, y: JAR_BOTTOM - 28 },
    { x: 100, y: JAR_BOTTOM - 10 }, { x: 340, y: JAR_BOTTOM - 12 },
  ];

  useEffect(() => {
    if (paused) return;

    // Spawn sugar molecules from top
    if (tick % 8 === 0) {
      setSugars(prev => [
        ...prev,
        {
          id: sId++,
          x: JAR_LEFT + 20 + Math.random() * (JAR_RIGHT - JAR_LEFT - 40),
          y: JAR_TOP + 10,
          consumed: false,
          vy: 0.5 + Math.random() * 0.3,
        },
      ].slice(-40));
    }

    // Update sugars
    setSugars(prev => {
      const next: Sugar[] = [];
      for (const s of prev) {
        if (s.consumed) continue;
        const ns = { ...s, y: s.y + s.vy };

        // Check if reaches a yeast cell
        let consumed = false;
        for (const y of yeastCells) {
          const dx = ns.x - y.x, dy = ns.y - y.y;
          if (dx * dx + dy * dy < 400) {
            consumed = true;
            // Yeast consumed sugar → produce CO₂ bubble + ethanol
            setBubbles(b => [...b, {
              id: bId++,
              x: y.x + (Math.random() - 0.5) * 10,
              y: y.y - 5,
              vy: -0.6 - Math.random() * 0.5,
              size: 3 + Math.random() * 3,
            }].slice(-30));
            setCo2Released(c => c + 1);
            setEthanolLevel(e => Math.min(1, e + 0.003));
            break;
          }
        }

        if (!consumed && ns.y < JAR_BOTTOM - 5) {
          next.push(ns);
        } else if (consumed) {
          // briefly flash consumed?  no — just remove
        }
      }
      return next;
    });

    // Update bubbles
    setBubbles(prev => {
      return prev
        .map(b => ({ ...b, y: b.y + b.vy, vy: b.vy * 0.99 }))
        .filter(b => b.y > JAR_TOP);
    });
  }, [tick, paused]);

  const reset = () => {
    setSugars([]);
    setBubbles([]);
    setCo2Released(0);
    setEthanolLevel(0);
  };

  // Ethanol fill rises over time
  const ethanolY = JAR_BOTTOM - ethanolLevel * (JAR_BOTTOM - JAR_TOP - 30);

  return (
    <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Yeast at Work
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-mono">
            {co2Released} CO₂ • {Math.round(ethanolLevel * 100)}% ethanol
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

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto" role="img"
        aria-label="Animated fermentation — yeast consumes sugar, produces CO₂ and ethanol">

        {/* Jar outline */}
        <path d={`M ${JAR_LEFT - 10},30 L ${JAR_LEFT - 10},${JAR_BOTTOM + 10} Q ${JAR_LEFT - 10},${JAR_BOTTOM + 20} ${JAR_LEFT + 5},${JAR_BOTTOM + 20} L ${JAR_RIGHT - 5},${JAR_BOTTOM + 20} Q ${JAR_RIGHT + 10},${JAR_BOTTOM + 20} ${JAR_RIGHT + 10},${JAR_BOTTOM + 10} L ${JAR_RIGHT + 10},30`}
          fill="none" stroke="#78716c" strokeWidth="3" opacity="0.7" />

        {/* Jar mouth (open top) */}
        <ellipse cx={(JAR_LEFT + JAR_RIGHT) / 2} cy={30} rx={(JAR_RIGHT - JAR_LEFT + 20) / 2} ry={6}
          fill="none" stroke="#78716c" strokeWidth="2" opacity="0.6" />

        {/* Ethanol + water fill (rising over time) */}
        <rect x={JAR_LEFT - 5} y={ethanolY}
          width={JAR_RIGHT - JAR_LEFT + 10}
          height={JAR_BOTTOM + 10 - ethanolY}
          fill="#fde68a" opacity="0.4" />
        {/* Wavy top of liquid */}
        <path d={`M ${JAR_LEFT - 5},${ethanolY} Q ${(JAR_LEFT + JAR_RIGHT) / 2},${ethanolY - 3 + Math.sin(tick * 0.08) * 2} ${JAR_RIGHT + 5},${ethanolY}`}
          fill="#fbbf24" opacity="0.5" />

        {/* CO₂ escaping at top */}
        {tick % 6 < 3 && (
          <g opacity="0.3">
            {[0, 1, 2].map(i => (
              <circle key={`gas-${i}`}
                cx={(JAR_LEFT + JAR_RIGHT) / 2 + (i - 1) * 25}
                cy={15 + Math.sin(tick * 0.1 + i) * 5}
                r="4" fill="#94a3b8" />
            ))}
            <text x={(JAR_LEFT + JAR_RIGHT) / 2} y={10}
              textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">
              CO₂ ↑
            </text>
          </g>
        )}

        {/* Sugar molecules falling */}
        {sugars.map(s => (
          <g key={s.id}>
            {/* Sugar hex shape */}
            <polygon points={`${s.x},${s.y - 5} ${s.x + 4},${s.y - 2} ${s.x + 4},${s.y + 2} ${s.x},${s.y + 5} ${s.x - 4},${s.y + 2} ${s.x - 4},${s.y - 2}`}
              fill="#f59e0b" opacity="0.85" stroke="#b45309" strokeWidth="0.5" />
            <text x={s.x} y={s.y + 2} textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">
              C₆
            </text>
          </g>
        ))}

        {/* Yeast cells */}
        {yeastCells.map((y, i) => (
          <g key={`y-${i}`}>
            {/* Gentle pulse */}
            <circle cx={y.x} cy={y.y} r={8 + Math.sin(tick * 0.1 + i) * 0.5}
              fill="#fbbf24" stroke="#d97706" strokeWidth="1" opacity="0.9" />
            {/* Nucleus */}
            <circle cx={y.x - 2} cy={y.y - 1} r="2.5" fill="#b45309" opacity="0.7" />
            {/* Budding hint */}
            {(tick + i * 20) % 100 < 15 && (
              <circle cx={y.x + 6} cy={y.y + 4} r="3" fill="#fbbf24" opacity="0.7" />
            )}
          </g>
        ))}

        {/* CO₂ bubbles rising */}
        {bubbles.map(b => (
          <g key={b.id}>
            <circle cx={b.x} cy={b.y} r={b.size}
              fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.8" />
            <circle cx={b.x - b.size / 3} cy={b.y - b.size / 3} r={b.size / 3}
              fill="#dbeafe" opacity="0.6" />
          </g>
        ))}

        {/* Annotations */}
        <text x={15} y={JAR_BOTTOM + 5} className="fill-amber-700 dark:fill-amber-300" fontSize="8" fontWeight="600">
          Yeast
        </text>
        <text x={W - 15} y={JAR_TOP + 5} textAnchor="end" className="fill-amber-700 dark:fill-amber-300" fontSize="8" fontWeight="600">
          Sugar ↓
        </text>
        <text x={W - 15} y={ethanolY + 15} textAnchor="end" className="fill-amber-800 dark:fill-amber-300" fontSize="8" fontWeight="600">
          Ethanol
        </text>

        {/* Equation reminder */}
        <text x={(JAR_LEFT + JAR_RIGHT) / 2} y={H - 10} textAnchor="middle"
          className="fill-gray-700 dark:fill-gray-200" fontSize="9" fontWeight="600">
          C₆H₁₂O₆ → 2 CO₂ + 2 C₂H₅OH + energy
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> Yeast cell
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500" /> Sugar (glucose)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-300" /> CO₂ bubble
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-200" /> Ethanol (fills jar)
        </span>
      </div>
    </div>
  );
}
