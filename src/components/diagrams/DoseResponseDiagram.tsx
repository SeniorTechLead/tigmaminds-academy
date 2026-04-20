import { useState, useEffect } from 'react';

// ── The Evolution Trap ───────────────────────────────────────
// Interactive antibiotic resistance demo. Bacteria with varying
// resistance levels (colored by resistance). Apply antibiotic —
// sensitive ones die, resistant ones survive and multiply.
// Over rounds, the population shifts fully resistant.
// Visceral demo of why "finish your antibiotics" matters.

interface Bug {
  id: number;
  x: number;
  y: number;
  resistance: number; // 0 (sensitive) to 1 (resistant)
  alive: boolean;
  deathAge: number;
}

let bugId = 0;

const W = 520, H = 300;
const POP_SIZE = 60;

function makeInitialPop(): Bug[] {
  const pop: Bug[] = [];
  for (let i = 0; i < POP_SIZE; i++) {
    // Starting population: mostly sensitive, a few resistant (normal distribution)
    const r = Math.max(0, Math.min(1, 0.2 + (Math.random() - 0.5) * 0.4));
    pop.push({
      id: bugId++,
      x: 20 + Math.random() * (W - 40),
      y: 30 + Math.random() * (H - 60),
      resistance: r,
      alive: true,
      deathAge: 0,
    });
  }
  return pop;
}

export default function DoseResponseDiagram() {
  const [pop, setPop] = useState<Bug[]>(() => makeInitialPop());
  const [round, setRound] = useState(0);
  const [tick, setTick] = useState(0);
  const [applyingAntibiotic, setApplyingAntibiotic] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, []);

  // Gentle drift motion
  useEffect(() => {
    setPop(prev => prev.map(b => {
      if (!b.alive) return { ...b, deathAge: b.deathAge + 1 };
      const vx = Math.sin(tick * 0.05 + b.id) * 0.8;
      const vy = Math.cos(tick * 0.06 + b.id * 0.7) * 0.6;
      let nx = b.x + vx;
      let ny = b.y + vy;
      if (nx < 15) nx = 15; if (nx > W - 15) nx = W - 15;
      if (ny < 20) ny = 20; if (ny > H - 25) ny = H - 25;
      return { ...b, x: nx, y: ny };
    }));
  }, [tick]);

  const aliveCount = pop.filter(b => b.alive).length;
  const avgResistance = aliveCount > 0
    ? pop.filter(b => b.alive).reduce((s, b) => s + b.resistance, 0) / aliveCount
    : 0;
  const resistantPct = Math.round(avgResistance * 100);

  const applyAntibiotic = () => {
    setApplyingAntibiotic(true);
    setTimeout(() => setApplyingAntibiotic(false), 1500);

    setTimeout(() => {
      setPop(prev => {
        const survivors = prev.map(b => {
          if (!b.alive) return b;
          // Kill probability based on resistance — high resistance survives
          const killChance = 1 - b.resistance;
          if (Math.random() < killChance * 0.95) {
            return { ...b, alive: false, deathAge: 0 };
          }
          return b;
        });
        return survivors;
      });
    }, 800);

    // Then repopulate from survivors (survivors reproduce)
    setTimeout(() => {
      setPop(prev => {
        const survivors = prev.filter(b => b.alive);
        if (survivors.length === 0) return prev;
        const nextGen: Bug[] = [...prev];
        // Each surviving bug produces offspring with slight variation
        while (nextGen.filter(b => b.alive).length < POP_SIZE) {
          const parent = survivors[Math.floor(Math.random() * survivors.length)];
          const mutation = (Math.random() - 0.3) * 0.15; // slight bias toward more resistant
          const newR = Math.max(0, Math.min(1, parent.resistance + mutation));
          nextGen.push({
            id: bugId++,
            x: parent.x + (Math.random() - 0.5) * 20,
            y: parent.y + (Math.random() - 0.5) * 20,
            resistance: newR,
            alive: true,
            deathAge: 0,
          });
        }
        return nextGen.filter(b => b.alive || b.deathAge < 30);
      });
      setRound(r => r + 1);
    }, 2500);
  };

  const reset = () => {
    setPop(makeInitialPop());
    setRound(0);
  };

  // Color for resistance level: green (sensitive) → yellow → red (resistant)
  const resistanceColor = (r: number) => {
    if (r < 0.33) return '#10b981'; // green — sensitive
    if (r < 0.66) return '#eab308'; // yellow — intermediate
    return '#ef4444'; // red — resistant
  };

  return (
    <div className="bg-gradient-to-b from-rose-50 via-slate-50 to-emerald-50 dark:from-rose-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          The Evolution Trap
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-rose-700 dark:text-rose-300 font-mono">
            Round {round} • {resistantPct}% resistant
          </span>
          <button
            onClick={reset}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated antibiotic resistance — applying antibiotic kills sensitive bacteria, resistant ones survive and repopulate">

        {/* Petri dish boundary */}
        <rect x={5} y={5} width={W - 10} height={H - 10} rx={12}
          fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.4" />

        {/* Antibiotic wash effect */}
        {applyingAntibiotic && (
          <rect x={5} y={5} width={W - 10} height={H - 10} rx={12}
            fill="#60a5fa" opacity="0.15">
            <animate attributeName="opacity" values="0;0.25;0" dur="1.5s" />
          </rect>
        )}

        {/* Bacteria */}
        {pop.map(b => {
          if (!b.alive && b.deathAge > 30) return null;
          const color = resistanceColor(b.resistance);
          const opacity = b.alive ? 0.9 : Math.max(0, 1 - b.deathAge / 30);
          const scale = b.alive ? 1 : 1.5 + b.deathAge / 15;
          return (
            <g key={b.id} opacity={opacity}>
              <ellipse cx={b.x} cy={b.y} rx={6 * scale} ry={4 * scale}
                fill={color} stroke={b.alive ? '#1e293b' : '#7f1d1d'} strokeWidth="0.5" />
              {!b.alive && (
                <>
                  <line x1={b.x - 4} y1={b.y - 4} x2={b.x + 4} y2={b.y + 4}
                    stroke="#991b1b" strokeWidth="1" opacity="0.8" />
                  <line x1={b.x - 4} y1={b.y + 4} x2={b.x + 4} y2={b.y - 4}
                    stroke="#991b1b" strokeWidth="1" opacity="0.8" />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Controls and legend */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          onClick={applyAntibiotic}
          disabled={applyingAntibiotic}
          className="text-sm px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold shadow transition"
        >
          💊 Apply antibiotic
        </button>

        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Sensitive (dies)
          </span>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" /> Intermediate
          </span>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Resistant (survives)
          </span>
        </div>

        {round >= 3 && resistantPct > 70 && (
          <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold mt-1">
            ⚠ This is how superbugs evolve — in hospitals, in livestock, in undertreated infections.
          </p>
        )}
      </div>
    </div>
  );
}
