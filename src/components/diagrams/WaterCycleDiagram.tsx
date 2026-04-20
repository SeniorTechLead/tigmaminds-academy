import { useState, useEffect } from 'react';

// ── The Endless Journey of Water ─────────────────────────────
// Animated water cycle: droplets evaporate from a river, rise as
// vapor, form clouds, fall as rain, run off mountains, seep into
// groundwater, and flow back to the river. Continuous loop.

interface Drop {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: 'river' | 'vapor' | 'cloud' | 'rain' | 'runoff' | 'ground';
  age: number;
  size: number;
}

let dropId = 0;

export default function WaterCycleDiagram() {
  const [tick, setTick] = useState(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [paused, setPaused] = useState(false);
  const [evapCount, setEvapCount] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 600, H = 400;
  const sunX = 520, sunY = 60;
  const mountainPeakX = 200, mountainPeakY = 150;
  const riverY = 330;
  const cloudX = 250, cloudY = 80;

  useEffect(() => {
    if (paused) return;

    setDrops(prev => {
      const next: Drop[] = [];

      // Spawn: evaporation from river surface (every 6 ticks)
      if (tick % 6 === 0) {
        const sx = 350 + Math.random() * 200;
        next.push({
          id: dropId++, phase: 'vapor',
          x: sx, y: riverY - 5,
          vx: -0.5 - Math.random() * 0.3,
          vy: -1.0 - Math.random() * 0.5,
          age: 0, size: 2,
        });
        setEvapCount(c => c + 1);
      }

      for (const d of prev) {
        const nd = { ...d, x: d.x + d.vx, y: d.y + d.vy, age: d.age + 1 };

        switch (nd.phase) {
          case 'vapor':
            // Rise and drift left toward clouds, slow down near cloud height
            nd.vy = Math.max(-0.3, nd.vy + 0.005);
            nd.vx = -0.4;
            nd.size = 1.5 + Math.sin(nd.age * 0.1) * 0.5;
            if (nd.y < cloudY + 20 && nd.x < cloudX + 60) {
              nd.phase = 'cloud';
              nd.vx = 0;
              nd.vy = 0;
            }
            if (nd.age > 200) continue; // expired
            break;

          case 'cloud':
            // Sit in cloud briefly, then become rain
            nd.x = cloudX + (Math.random() - 0.5) * 80;
            nd.y = cloudY + Math.random() * 20;
            if (nd.age > 40) {
              nd.phase = 'rain';
              nd.vy = 2.5 + Math.random();
              nd.vx = 0.2;
              nd.size = 2.5;
            }
            break;

          case 'rain':
            // Fall fast
            nd.vy += 0.05; // accelerate
            nd.size = 2.5;
            // Hit mountain slope or ground
            const mountainSlope = mountainPeakY + ((nd.x - mountainPeakX) / 250) * (riverY - mountainPeakY);
            if (nd.y > mountainSlope && nd.x < 400) {
              nd.phase = Math.random() > 0.4 ? 'runoff' : 'ground';
              nd.vy = nd.phase === 'runoff' ? 0.8 : 0.3;
              nd.vx = nd.phase === 'runoff' ? 1.2 : 0;
            }
            if (nd.y > riverY) {
              nd.phase = 'river' as const;
              nd.y = riverY;
              nd.vy = 0;
              nd.vx = 0.5;
            }
            break;

          case 'runoff':
            // Flow down mountainside to river
            nd.vx = 1.0 + Math.random() * 0.3;
            nd.vy = 0.6;
            nd.size = 2;
            if (nd.y > riverY - 5) {
              nd.phase = 'river';
              nd.y = riverY;
              nd.vy = 0;
            }
            break;

          case 'ground':
            // Seep slowly downward and rightward (groundwater)
            nd.vx = 0.3;
            nd.vy = 0.15;
            nd.size = 1.5;
            if (nd.y > riverY + 30 || nd.x > 550) continue; // absorbed
            break;

          case 'river':
            // Drift right in river, eventually re-evaporate
            nd.vx = 0.3;
            nd.vy = 0;
            if (nd.age > 30) continue; // cycles back via next evaporation
            break;
        }

        if (nd.age < 300 && nd.x > -10 && nd.x < W + 10 && nd.y < H + 10) {
          next.push(nd);
        }
      }

      return [...prev.filter(d => d.age < 300 && d.x > -10 && d.x < W + 10 && d.y < H + 10).map(d => {
        // simplified re-update (same logic)
        return d;
      }), ...next].slice(-120);
    });
  }, [tick, paused]);

  // Sun ray animation
  const sunAngle = tick * 0.4;

  // Cloud puffiness
  const cloudPuff = Math.sin(tick * 0.04) * 3;

  const phaseColor: Record<string, string> = {
    vapor: '#a5b4fc',   // light purple (steam)
    cloud: '#e2e8f0',   // white-gray
    rain: '#60a5fa',    // blue
    runoff: '#38bdf8',  // light blue
    ground: '#6366f1',  // indigo (underground)
    river: '#3b82f6',   // blue
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 via-sky-50 to-emerald-50 dark:from-sky-900 dark:via-sky-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          The Endless Journey of Water
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-700 dark:text-blue-300 font-mono">{evapCount} molecules evaporated</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Animated water cycle showing evaporation, cloud formation, rain, runoff, and groundwater">

        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="60%" stopColor="#164e63" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#365314" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
        </defs>

        {/* Sky background */}
        <rect x="0" y="0" width={W} height={riverY - 20} fill="url(#skyGrad)" opacity="0.3" />

        {/* ── Sun ── */}
        <circle cx={sunX} cy={sunY} r="30" fill="#fde047" opacity="0.8" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = ((sunAngle + i * 36) * Math.PI) / 180;
          const len = 8 + Math.sin(tick * 0.08 + i) * 3;
          return (
            <line key={`sr-${i}`}
              x1={sunX + Math.cos(a) * 33} y1={sunY + Math.sin(a) * 33}
              x2={sunX + Math.cos(a) * (33 + len)} y2={sunY + Math.sin(a) * (33 + len)}
              stroke="#fde047" strokeWidth="2" strokeLinecap="round"
              opacity={0.5 + Math.sin(tick * 0.06 + i) * 0.3} />
          );
        })}

        {/* Heat waves from sun to river (evaporation driver) */}
        {[0, 1, 2].map(i => (
          <line key={`heat-${i}`}
            x1={sunX - 20 - i * 30} y1={sunY + 30 + i * 15}
            x2={400 + i * 30} y2={riverY - 20}
            stroke="#fde047" strokeWidth="1" opacity="0.1"
            strokeDasharray="8,12">
            <animate attributeName="stroke-dashoffset" from="40" to="0" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* ── Mountain ── */}
        <path d={`M 50,${riverY} L ${mountainPeakX},${mountainPeakY} L 350,${riverY} Z`}
          fill="#1e3a22" stroke="#365314" strokeWidth="1" />
        {/* Snow cap */}
        <path d={`M ${mountainPeakX - 20},${mountainPeakY + 20} L ${mountainPeakX},${mountainPeakY} L ${mountainPeakX + 25},${mountainPeakY + 25}`}
          fill="white" opacity="0.6" />
        {/* Trees on mountain */}
        {[100, 140, 280, 310].map((tx, i) => {
          const ty = mountainPeakY + ((tx - mountainPeakX) / 250) * (riverY - mountainPeakY) - 8;
          return (
            <g key={`tree-${i}`}>
              <line x1={tx} y1={ty} x2={tx} y2={ty + 12} stroke="#4a3728" strokeWidth="2" />
              <circle cx={tx} cy={ty - 3} r="6" fill="#166534" opacity="0.8" />
            </g>
          );
        })}

        {/* ── Cloud ── */}
        <g>
          <circle cx={cloudX - 25} cy={cloudY + 5 + cloudPuff * 0.5} r="20" fill="#cbd5e1" opacity="0.7" />
          <circle cx={cloudX} cy={cloudY - 5 + cloudPuff} r="28" fill="#e2e8f0" opacity="0.8" />
          <circle cx={cloudX + 30} cy={cloudY + 3 + cloudPuff * 0.3} r="22" fill="#cbd5e1" opacity="0.75" />
          <circle cx={cloudX + 55} cy={cloudY + 8} r="16" fill="#94a3b8" opacity="0.6" />
          {/* Dark underside */}
          <ellipse cx={cloudX + 10} cy={cloudY + 20} rx="50" ry="8" fill="#64748b" opacity="0.4" />
        </g>

        {/* ── River / Lake ── */}
        <path d={`M 0,${riverY} Q 150,${riverY - 8} 300,${riverY} Q 450,${riverY + 8} ${W},${riverY} L ${W},${H} L 0,${H} Z`}
          fill="#1e3a5f" opacity="0.7" />
        {/* River surface shimmer */}
        {[0, 1, 2, 3, 4].map(i => {
          const wx = 100 + i * 110 + Math.sin(tick * 0.04 + i) * 15;
          return (
            <line key={`wave-${i}`}
              x1={wx} y1={riverY + 2} x2={wx + 30} y2={riverY + 2}
              stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          );
        })}

        {/* Ground layer (underground) */}
        <rect x="0" y={riverY + 15} width={W} height={H - riverY - 15} fill="url(#groundGrad)" opacity="0.5" />
        {/* Groundwater flow arrows */}
        <path d={`M 200,${riverY + 35} Q 300,${riverY + 50} 450,${riverY + 30}`}
          fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.3" strokeDasharray="4,6">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
        </path>
        <text x="320" y={riverY + 55} textAnchor="middle" fill="#818cf8" fontSize="8" opacity="0.5">
          groundwater flow
        </text>

        {/* ── Process labels ── */}
        <g opacity="0.7">
          {/* Evaporation */}
          <text x="450" y={riverY - 30} textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="600">
            Evaporation ↑
          </text>
          {/* Condensation */}
          <text x={cloudX + 80} y={cloudY - 20} fill="#94a3b8" fontSize="10" fontWeight="600">
            Condensation
          </text>
          {/* Precipitation */}
          <text x={cloudX - 40} y={cloudY + 50} fill="#60a5fa" fontSize="10" fontWeight="600">
            Rain ↓
          </text>
          {/* Runoff */}
          <text x="130" y={riverY - 50} fill="#38bdf8" fontSize="9" fontWeight="600">
            Runoff →
          </text>
          {/* Infiltration */}
          <text x="280" y={riverY + 28} fill="#818cf8" fontSize="9" fontWeight="600">
            Infiltration ↓
          </text>
        </g>

        {/* ── Water droplets ── */}
        {drops.map(d => {
          const color = phaseColor[d.phase];
          const opacity = Math.min(1, d.age / 5) * (d.phase === 'ground' ? 0.5 : 0.8);
          return (
            <circle key={d.id} cx={d.x} cy={d.y} r={d.size} fill={color} opacity={opacity} />
          );
        })}

        {/* Evaporation steam wisps (rising squiggles near river) */}
        {[380, 430, 480, 530].map((sx, i) => {
          const offset = Math.sin(tick * 0.05 + i * 1.5) * 8;
          const yOff = (tick * 0.3 + i * 20) % 40;
          return (
            <path key={`steam-${i}`}
              d={`M ${sx + offset},${riverY - 5 - yOff} Q ${sx + 5 + offset},${riverY - 15 - yOff} ${sx + offset},${riverY - 25 - yOff}`}
              fill="none" stroke="#a5b4fc" strokeWidth="1" opacity={0.15 - yOff * 0.003}
              strokeLinecap="round" />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        {[
          ['#a5b4fc', 'Water vapor (rising)'],
          ['#e2e8f0', 'Cloud (condensed)'],
          ['#60a5fa', 'Rain (falling)'],
          ['#38bdf8', 'Surface runoff'],
          ['#6366f1', 'Groundwater'],
        ].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
