import { useState, useEffect } from 'react';

// ── Two Highways, One Stem ───────────────────────────────────
// Cross-section of a stem showing xylem (water up, blue) and
// phloem (sugar down, amber) running side by side. Particles
// flow in opposite directions. Transpiration pull at the top
// (evaporating water from leaves) drives the whole system.

interface Particle {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: 'water' | 'sugar';
  age: number;
}

let pId = 0;

export default function CapillaryActionDiagram() {
  const [tick, setTick] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 400, H = 440;
  const stemLeft = 140, stemRight = 260;
  const stemTop = 40, stemBottom = 380;
  const xylemX = 175; // center of xylem channel
  const phloemX = 225; // center of phloem channel
  const dividerX = 200;

  // Transpiration — water vapor escaping from leaf at top
  const evapRate = Math.sin(tick * 0.06) * 0.3 + 0.7;

  useEffect(() => {
    if (paused) return;

    setParticles(prev => {
      const next: Particle[] = [];

      // Spawn water at bottom of xylem (coming from roots)
      if (tick % 5 === 0) {
        next.push({
          id: pId++, type: 'water',
          x: xylemX + (Math.random() - 0.5) * 20,
          y: stemBottom - 5,
          vy: -1.8 - Math.random() * 0.5,
          age: 0,
        });
      }

      // Spawn sugar at top of phloem (made in leaves)
      if (tick % 7 === 0) {
        next.push({
          id: pId++, type: 'sugar',
          x: phloemX + (Math.random() - 0.5) * 20,
          y: stemTop + 15,
          vy: 1.2 + Math.random() * 0.4,
          age: 0,
        });
      }

      for (const p of prev) {
        const np = { ...p, y: p.y + p.vy, age: p.age + 1 };

        // Slight horizontal wobble
        np.x += Math.sin(np.age * 0.15 + np.id) * 0.3;

        // Keep in their lane
        if (np.type === 'water') {
          np.x += (xylemX - np.x) * 0.05;
        } else {
          np.x += (phloemX - np.x) * 0.05;
        }

        // Remove when they exit
        if (np.type === 'water' && np.y < stemTop) continue; // evaporated!
        if (np.type === 'sugar' && np.y > stemBottom) continue; // delivered to roots!

        if (np.age < 250) {
          next.push(np);
        }
      }

      return [...prev.filter(p => p.age < 250 && p.y > stemTop - 5 && p.y < stemBottom + 5), ...next].slice(-60);
    });
  }, [tick, paused]);

  // Water cohesion chain visualization — lines connecting nearby water particles
  const waterParticles = particles.filter(p => p.type === 'water');

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-stone-50 to-amber-50 dark:from-emerald-950 dark:via-stone-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Two Highways, One Stem
        </p>
        <button
          onClick={() => setPaused(!paused)}
          className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
        >
          {paused ? '▶ Play' : '⏸ Pause'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated stem cross-section: water rises through xylem, sugar descends through phloem">

        {/* Leaf at top (transpiration source) */}
        <ellipse cx={200} cy={25} rx="60" ry="18" fill="#15803d" opacity="0.7" />
        <ellipse cx={200} cy={25} rx="45" ry="12" fill="#22c55e" opacity="0.5" />
        <text x={200} y={29} textAnchor="middle" fill="#dcfce7" fontSize="9" fontWeight="600">Leaf</text>

        {/* Transpiration — vapor wisps */}
        {[0, 1, 2].map(i => {
          const wx = 170 + i * 30;
          const waveY = Math.sin(tick * 0.05 + i * 2) * 5;
          const opacity = evapRate * 0.3;
          return (
            <g key={`vapor-${i}`} opacity={opacity}>
              <path d={`M ${wx},${10 + waveY} Q ${wx + 5},${5 + waveY} ${wx},${0 + waveY}`}
                fill="none" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" />
              <circle cx={wx} cy={3 + waveY} r="1.5" fill="#93c5fd" opacity="0.5" />
            </g>
          );
        })}
        <text x={280} y={12} fill="#93c5fd" fontSize="7" opacity="0.6">water vapor escaping (transpiration)</text>

        {/* Stem wall */}
        <rect x={stemLeft} y={stemTop} width={stemRight - stemLeft} height={stemBottom - stemTop}
          fill="#3d2b1f" opacity="0.6" rx="8" stroke="#5c4033" strokeWidth="2" />

        {/* Xylem channel (left side — blue) */}
        <rect x={stemLeft + 10} y={stemTop + 5} width={dividerX - stemLeft - 15} height={stemBottom - stemTop - 10}
          fill="#0c2d48" opacity="0.7" rx="4" />

        {/* Phloem channel (right side — amber) */}
        <rect x={dividerX + 5} y={stemTop + 5} width={stemRight - dividerX - 15} height={stemBottom - stemTop - 10}
          fill="#451a03" opacity="0.7" rx="4" />

        {/* Divider between xylem and phloem */}
        <line x1={dividerX} y1={stemTop + 5} x2={dividerX} y2={stemBottom - 5}
          stroke="#78716c" strokeWidth="2" />

        {/* Channel labels */}
        <text x={xylemX} y={stemBottom - 15} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">
          XYLEM
        </text>
        <text x={xylemX} y={stemBottom - 4} textAnchor="middle" fill="#60a5fa" fontSize="7">
          water ↑
        </text>
        <text x={phloemX} y={stemBottom - 15} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
          PHLOEM
        </text>
        <text x={phloemX} y={stemBottom - 4} textAnchor="middle" fill="#fbbf24" fontSize="7">
          sugar ↓
        </text>

        {/* Direction arrows */}
        <path d={`M ${xylemX},${stemBottom - 30} L ${xylemX},${stemTop + 20}`}
          fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.3"
          strokeDasharray="4,4" markerEnd="url(#xyArrow)" />
        <path d={`M ${phloemX},${stemTop + 30} L ${phloemX},${stemBottom - 30}`}
          fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3"
          strokeDasharray="4,4" markerEnd="url(#phArrow)" />
        <defs>
          <marker id="xyArrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#60a5fa" />
          </marker>
          <marker id="phArrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Cohesion lines between nearby water particles */}
        {waterParticles.slice(0, -1).map((p, i) => {
          const next = waterParticles[i + 1];
          if (!next) return null;
          const dist = Math.abs(p.y - next.y);
          if (dist > 25) return null;
          return (
            <line key={`coh-${i}`} x1={p.x} y1={p.y} x2={next.x} y2={next.y}
              stroke="#60a5fa" strokeWidth="0.5" opacity={0.2} />
          );
        })}

        {/* Particles */}
        {particles.map(p => {
          const color = p.type === 'water' ? '#60a5fa' : '#fbbf24';
          const glow = p.type === 'water' ? 'rgba(96,165,250,0.2)' : 'rgba(251,191,36,0.2)';
          const opacity = Math.min(0.9, p.age / 8);
          return (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="5" fill={glow} />
              <circle cx={p.x} cy={p.y} r="3" fill={color} opacity={opacity} />
            </g>
          );
        })}

        {/* Root zone at bottom */}
        <rect x={stemLeft - 20} y={stemBottom} width={stemRight - stemLeft + 40} height="20"
          fill="#78716c" opacity="0.3" rx="4" />
        <text x={200} y={stemBottom + 14} textAnchor="middle" fill="#a8a29e" fontSize="8">Roots</text>

        {/* Side annotations */}
        <g opacity="0.6">
          <text x={stemLeft - 5} y={200} textAnchor="end" fill="#60a5fa" fontSize="8">
            Pulled by
          </text>
          <text x={stemLeft - 5} y={212} textAnchor="end" fill="#60a5fa" fontSize="8">
            transpiration
          </text>
          <text x={stemRight + 5} y={200} fill="#fbbf24" fontSize="8">
            Pushed by
          </text>
          <text x={stemRight + 5} y={212} fill="#fbbf24" fontSize="8">
            pressure flow
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400" /> Water (H₂O) — up through xylem
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" /> Sugar (glucose) — down through phloem
        </span>
      </div>
    </div>
  );
}
