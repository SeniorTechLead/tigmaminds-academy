import { useState, useEffect } from 'react';

// ── The 9-Metre Journey ──────────────────────────────────────
// Animated food bolus traveling through the digestive tract:
// mouth → esophagus (peristalsis) → stomach (churning + acid) →
// small intestine (nutrient absorption) → large intestine (water)
// → exit. Particles shrink as nutrients get absorbed.

interface Bolus {
  id: number;
  progress: number; // 0 (mouth) to 1 (exit)
  size: number;
  nutrientsAbsorbed: number;
}

let bId = 0;

const PATH_POINTS: [number, number][] = [
  [200, 50],   // mouth
  [200, 130],  // esophagus top
  [200, 200],  // esophagus bottom / stomach entry
  [165, 220],  // stomach top
  [130, 245],  // stomach bottom-left
  [170, 275],  // stomach bottom
  [210, 265],  // stomach right
  [230, 290],  // small intestine start
  [150, 320],  // SI loop 1
  [230, 335],  // SI loop 2
  [150, 355],  // SI loop 3
  [240, 370],  // SI end / LI start
  [260, 335],  // LI right
  [130, 335],  // LI top (ascending)
  [130, 390],  // LI down (descending)
  [200, 410],  // exit
];

function getPathPoint(t: number): [number, number, number] {
  const segIdx = Math.min(Math.floor(t * (PATH_POINTS.length - 1)), PATH_POINTS.length - 2);
  const segT = (t * (PATH_POINTS.length - 1)) - segIdx;
  const [x1, y1] = PATH_POINTS[segIdx];
  const [x2, y2] = PATH_POINTS[segIdx + 1];
  return [x1 + (x2 - x1) * segT, y1 + (y2 - y1) * segT, segIdx];
}

function getPhaseLabel(t: number): string {
  if (t < 0.05) return 'Mouth — chewing, saliva (amylase starts breaking starch)';
  if (t < 0.2) return 'Esophagus — peristalsis pushes food down';
  if (t < 0.4) return 'Stomach — HCl (pH 1.5) + pepsin churn for 4 hours';
  if (t < 0.75) return 'Small intestine — nutrients absorbed (22 feet, 90% of absorption)';
  if (t < 0.95) return 'Large intestine — water reclaimed, microbiome active';
  return 'Exit';
}

export default function DigestiveSystemDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [boluses, setBoluses] = useState<Bolus[]>([{ id: bId++, progress: 0, size: 1, nutrientsAbsorbed: 0 }]);
  const [absorbed, setAbsorbed] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (paused) return;

    setBoluses(prev => {
      const next: Bolus[] = [];

      for (const b of prev) {
        // Speed varies by segment: slow in stomach (churning), fast in intestine
        let speed = 0.005;
        if (b.progress > 0.2 && b.progress < 0.4) speed = 0.0015; // stomach — slow churn
        if (b.progress > 0.4 && b.progress < 0.75) speed = 0.004; // small intestine
        if (b.progress > 0.75) speed = 0.002; // large intestine

        const nb = { ...b, progress: b.progress + speed };

        // Nutrients absorbed in the small intestine
        if (nb.progress > 0.4 && nb.progress < 0.75) {
          nb.nutrientsAbsorbed += speed * 100 * 1.8;
          nb.size *= 0.993;
          setAbsorbed(a => a + speed * 100 * 1.8);
        }

        if (nb.progress < 1.0) next.push(nb);
      }

      // Spawn new meal every ~400 ticks
      if (tick % 400 === 0 && next.length < 3) {
        next.push({ id: bId++, progress: 0, size: 1, nutrientsAbsorbed: 0 });
      }

      return next;
    });
  }, [tick, paused]);

  const W = 400, H = 440;

  // Organ pulsation
  const stomachPulse = 1 + Math.sin(tick * 0.08) * 0.03;

  // Current phase label from the leading bolus
  const leadingBolus = boluses.reduce((acc, b) => b.progress > acc.progress ? b : acc, { progress: 0 } as Bolus);
  const phaseLabel = getPhaseLabel(leadingBolus.progress);

  return (
    <div className="bg-gradient-to-b from-amber-50 via-rose-50 to-orange-50 dark:from-amber-950 dark:via-rose-950 dark:to-orange-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
          The 9-Metre Journey
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-mono">
            {absorbed.toFixed(0)} nutrients absorbed
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
        aria-label="Animated digestive tract — food traveling from mouth to exit, nutrients absorbed in small intestine">

        {/* Mouth */}
        <ellipse cx={200} cy={50} rx={25} ry={12} fill="#fda4af" stroke="#fb7185" strokeWidth="1.5" opacity="0.8" />
        <text x={235} y={54} className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontWeight="600">Mouth</text>

        {/* Esophagus */}
        <rect x={193} y={62} width={14} height={135} rx={7} fill="#fca5a5" stroke="#f87171" strokeWidth="1" opacity="0.7" />
        <text x={215} y={130} className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontWeight="600">Esophagus</text>

        {/* Stomach */}
        <g transform={`translate(170, 250) scale(${stomachPulse})`}>
          <path d="M -40,-35 Q -50,0 -30,30 Q 0,40 35,20 Q 45,0 30,-30 Q 0,-40 -40,-35 Z"
            fill="#fecaca" stroke="#ef4444" strokeWidth="2" opacity="0.85" />
          {/* Acid drops inside */}
          {[0, 1, 2].map(i => (
            <circle key={`acid-${i}`}
              cx={-20 + Math.sin(tick * 0.15 + i * 2) * 15}
              cy={Math.cos(tick * 0.12 + i) * 15}
              r="2" fill="#84cc16" opacity="0.7" />
          ))}
        </g>
        <text x={40} y={230} className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontWeight="600">Stomach</text>
        <text x={40} y={243} className="fill-gray-500 dark:fill-gray-400" fontSize="7">pH 1.5</text>

        {/* Small intestine (coiled loops) */}
        <path d="M 230,290 Q 170,295 150,320 Q 140,330 170,335 Q 220,335 230,335 Q 150,340 150,355 Q 170,365 210,360 Q 240,360 240,370"
          fill="none" stroke="#fbbf24" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        <path d="M 230,290 Q 170,295 150,320 Q 140,330 170,335 Q 220,335 230,335 Q 150,340 150,355 Q 170,365 210,360 Q 240,360 240,370"
          fill="none" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <text x={275} y={325} className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">Small</text>
        <text x={275} y={337} className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">intestine</text>
        <text x={275} y={349} className="fill-gray-500 dark:fill-gray-400" fontSize="7">7m</text>

        {/* Large intestine (frame) */}
        <path d="M 240,370 L 260,335 L 130,335 L 130,400"
          fill="none" stroke="#92400e" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
        <path d="M 240,370 L 260,335 L 130,335 L 130,400"
          fill="none" stroke="#b45309" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
        <text x={60} y={370} className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">Large</text>
        <text x={60} y={382} className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">intestine</text>
        <text x={60} y={394} className="fill-gray-500 dark:fill-gray-400" fontSize="7">1.5m</text>

        {/* Exit */}
        <circle cx={200} cy={415} r={6} fill="#78716c" opacity="0.6" />

        {/* Nutrient absorption sparkles (small intestine) */}
        {leadingBolus.progress > 0.4 && leadingBolus.progress < 0.75 && (
          Array.from({ length: 5 }, (_, i) => {
            const spark = (tick * 0.3 + i * 20) % 60;
            const alpha = 1 - spark / 60;
            return (
              <circle key={`spark-${i}`}
                cx={180 + Math.sin(i * 2 + tick * 0.1) * 60}
                cy={320 + (i * 10) % 40}
                r={1.5 + alpha * 2}
                fill="#84cc16" opacity={alpha * 0.7} />
            );
          })
        )}

        {/* Food bolus — the traveler */}
        {boluses.map(b => {
          const [x, y] = getPathPoint(b.progress);
          const r = 6 * b.size;
          return (
            <g key={b.id}>
              <circle cx={x} cy={y} r={r + 3} fill="#f97316" opacity="0.3" />
              <circle cx={x} cy={y} r={r} fill="#c2410c" opacity="0.9" />
              {b.progress > 0.05 && b.progress < 0.3 && (
                <text x={x + r + 3} y={y + 3} className="fill-rose-600 dark:fill-rose-400" fontSize="7">
                  ↓ peristalsis
                </text>
              )}
            </g>
          );
        })}

        {/* Current phase caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="9" fontWeight="600">
          {phaseLabel}
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-600" /> Food bolus
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-500" /> Acid / nutrients
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-300" /> Stomach / esophagus
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> Small intestine
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-700" /> Large intestine
        </span>
      </div>
    </div>
  );
}
