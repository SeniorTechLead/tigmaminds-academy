import { useState, useEffect } from 'react';

// ── The Hidden Half ──────────────────────────────────────────
// Animated root system: water dots get absorbed through root hairs,
// travel through the root cortex, and climb up into the stem.
// Mycorrhizal fungal threads pulse and extend the reach.
// Root hairs gently wave. Underground world comes alive.

interface WaterDot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: 'soil' | 'hair' | 'cortex' | 'xylem';
  age: number;
}

let wId = 0;

export default function BanyanRootsDiagram() {
  const [tick, setTick] = useState(0);
  const [dots, setDots] = useState<WaterDot[]>([]);
  const [paused, setPaused] = useState(false);
  const [absorbed, setAbsorbed] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 520, H = 400;
  const soilTop = 120; // ground line
  const stemX = 260;

  // Root structure: main roots branch out underground
  const roots = [
    { x1: stemX, y1: soilTop + 10, x2: stemX - 120, y2: 300, hairs: 6 },
    { x1: stemX, y1: soilTop + 10, x2: stemX + 130, y2: 310, hairs: 6 },
    { x1: stemX, y1: soilTop + 10, x2: stemX - 50, y2: 350, hairs: 4 },
    { x1: stemX, y1: soilTop + 10, x2: stemX + 60, y2: 360, hairs: 4 },
    { x1: stemX, y1: soilTop + 10, x2: stemX, y2: 380, hairs: 3 }, // taproot
  ];

  // Mycorrhizal threads (extend from roots)
  const fungi = [
    { rootIdx: 0, angle: -30, len: 50 },
    { rootIdx: 0, angle: -60, len: 40 },
    { rootIdx: 1, angle: 20, len: 55 },
    { rootIdx: 1, angle: 50, len: 35 },
    { rootIdx: 2, angle: -10, len: 30 },
    { rootIdx: 3, angle: 30, len: 45 },
  ];

  useEffect(() => {
    if (paused) return;

    setDots(prev => {
      const next: WaterDot[] = [];

      // Spawn water in soil (random positions underground)
      if (tick % 8 === 0) {
        next.push({
          id: wId++, phase: 'soil',
          x: 40 + Math.random() * (W - 80),
          y: soilTop + 40 + Math.random() * 250,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          age: 0,
        });
      }

      for (const d of prev) {
        const nd = { ...d, x: d.x + d.vx, y: d.y + d.vy, age: d.age + 1 };

        // Brownian motion in soil
        if (nd.phase === 'soil') {
          nd.vx += (Math.random() - 0.5) * 0.3;
          nd.vy += (Math.random() - 0.5) * 0.3;

          // Check if near a root — get absorbed
          for (const root of roots) {
            const mx = (root.x1 + root.x2) / 2;
            const my = (root.y1 + root.y2) / 2;
            const dist = Math.sqrt((nd.x - mx) ** 2 + (nd.y - my) ** 2);
            if (dist < 35 && nd.age > 15) {
              nd.phase = 'hair';
              nd.vx = (mx - nd.x) * 0.05;
              nd.vy = (my - nd.y) * 0.05;
              setAbsorbed(c => c + 1);
              break;
            }
          }

          // Check if near a fungal thread — also get absorbed (mycorrhizae!)
          for (const f of fungi) {
            const root = roots[f.rootIdx];
            const fx = root.x2 + Math.cos((f.angle * Math.PI) / 180) * f.len * 0.7;
            const fy = root.y2 + Math.sin((f.angle * Math.PI) / 180) * f.len * 0.7;
            const dist = Math.sqrt((nd.x - fx) ** 2 + (nd.y - fy) ** 2);
            if (dist < 20 && nd.age > 20) {
              nd.phase = 'hair';
              nd.vx = (root.x2 - nd.x) * 0.03;
              nd.vy = (root.y2 - nd.y) * 0.03;
              setAbsorbed(c => c + 1);
              break;
            }
          }
        }

        if (nd.phase === 'hair') {
          // Move toward root center, then switch to cortex
          nd.vx *= 0.95;
          nd.vy *= 0.95;
          if (Math.abs(nd.vx) < 0.1 && Math.abs(nd.vy) < 0.1) {
            nd.phase = 'cortex';
            nd.vx = (stemX - nd.x) * 0.02;
            nd.vy = -0.8;
          }
        }

        if (nd.phase === 'cortex') {
          // Travel toward stem base
          nd.vx += (stemX - nd.x) * 0.005;
          nd.vy = -1.0;
          if (nd.y < soilTop + 20) {
            nd.phase = 'xylem';
            nd.vx = 0;
            nd.vy = -1.5;
          }
        }

        if (nd.phase === 'xylem') {
          // Shoot up the stem
          nd.vy = -2.0;
          nd.x += (stemX - nd.x) * 0.1;
        }

        if (nd.age < 300 && nd.y > -10 && nd.x > 10 && nd.x < W - 10) {
          next.push(nd);
        }
      }

      return [...prev.filter(d => d.age < 300 && d.y > -10), ...next].slice(-80);
    });
  }, [tick, paused]);

  // Root hair wave animation
  const hairWave = (i: number) => Math.sin(tick * 0.06 + i * 1.3) * 4;

  // Fungal thread pulse
  const fungiPulse = (i: number) => 0.4 + Math.sin(tick * 0.05 + i * 1.5) * 0.2;

  const dotColor: Record<string, string> = {
    soil: '#60a5fa',
    hair: '#93c5fd',
    cortex: '#38bdf8',
    xylem: '#06b6d4',
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-amber-50 to-stone-50 dark:from-emerald-900 dark:via-amber-950 dark:to-stone-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          The Hidden Half — Life Underground
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-700 dark:text-blue-300 font-mono">{absorbed} water absorbed</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated root system — water molecules absorbed through root hairs and mycorrhizal fungi">

        {/* Sky */}
        <rect x="0" y="0" width={W} height={soilTop} fill="#0f291a" opacity="0.5" />

        {/* Stem above ground */}
        <rect x={stemX - 8} y="20" width="16" height={soilTop - 10} fill="#5c4033" rx="3" />
        {/* Little leaves */}
        <ellipse cx={stemX - 20} cy="35" rx="15" ry="8" fill="#22c55e" opacity="0.7" transform={`rotate(-25, ${stemX - 20}, 35)`} />
        <ellipse cx={stemX + 22} cy="30" rx="14" ry="7" fill="#16a34a" opacity="0.7" transform={`rotate(20, ${stemX + 22}, 30)`} />
        <ellipse cx={stemX - 5} cy="20" rx="12" ry="6" fill="#15803d" opacity="0.8" transform="rotate(-10, 255, 20)" />

        {/* Ground line */}
        <line x1="0" y1={soilTop} x2={W} y2={soilTop} stroke="#78716c" strokeWidth="2" opacity="0.5" />
        <text x="20" y={soilTop - 5} fill="#86efac" fontSize="9" opacity="0.6">surface</text>

        {/* Soil texture — scattered particles */}
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={`soil-${i}`}
            cx={(i * 137.5 + 30) % W}
            cy={soilTop + 20 + ((i * 73.1 + 50) % (H - soilTop - 30))}
            r={1 + (i % 3) * 0.5}
            fill="#78716c" opacity={0.15 + (i % 5) * 0.03} />
        ))}

        {/* ── Roots ── */}
        {roots.map((root, ri) => {
          const mx = (root.x1 + root.x2) / 2;
          const my = (root.y1 + root.y2) / 2;
          return (
            <g key={`root-${ri}`}>
              {/* Root body */}
              <line x1={root.x1} y1={root.y1} x2={root.x2} y2={root.y2}
                stroke="#8B6914" strokeWidth={ri === 4 ? 5 : 3} strokeLinecap="round" opacity="0.8" />

              {/* Root hairs — tiny lines waving */}
              {Array.from({ length: root.hairs }, (_, hi) => {
                const t = (hi + 1) / (root.hairs + 1);
                const hx = root.x1 + (root.x2 - root.x1) * t;
                const hy = root.y1 + (root.y2 - root.y1) * t;
                const wave = hairWave(ri * 10 + hi);
                const side = hi % 2 === 0 ? -1 : 1;
                return (
                  <line key={`hair-${ri}-${hi}`}
                    x1={hx} y1={hy}
                    x2={hx + side * (12 + wave)} y2={hy + wave * 0.5}
                    stroke="#c4a747" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
                );
              })}

              {/* Root tip (meristem glow) */}
              <circle cx={root.x2} cy={root.y2} r="4" fill="#fbbf24" opacity={0.3 + Math.sin(tick * 0.08 + ri) * 0.15} />
            </g>
          );
        })}

        {/* ── Mycorrhizal fungal threads ── */}
        {fungi.map((f, fi) => {
          const root = roots[f.rootIdx];
          const rad = (f.angle * Math.PI) / 180;
          const pulse = fungiPulse(fi);
          const fx = root.x2 + Math.cos(rad) * f.len;
          const fy = root.y2 + Math.sin(rad) * f.len;
          // Branching threads
          return (
            <g key={`fungi-${fi}`} opacity={pulse}>
              <line x1={root.x2} y1={root.y2} x2={fx} y2={fy}
                stroke="#c084fc" strokeWidth="1" strokeDasharray="3,2" />
              {/* Tiny branches at the tip */}
              <line x1={fx} y1={fy} x2={fx + Math.cos(rad - 0.5) * 12} y2={fy + Math.sin(rad - 0.5) * 12}
                stroke="#a855f7" strokeWidth="0.7" />
              <line x1={fx} y1={fy} x2={fx + Math.cos(rad + 0.5) * 10} y2={fy + Math.sin(rad + 0.5) * 10}
                stroke="#a855f7" strokeWidth="0.7" />
              {/* Tiny nutrient dot at tip */}
              <circle cx={fx} cy={fy} r="2" fill="#d8b4fe" opacity={pulse} />
            </g>
          );
        })}

        {/* Labels */}
        <text x="60" y={soilTop + 25} fill="#c4a747" fontSize="9" fontWeight="600" opacity="0.7">Root hairs</text>
        <text x="380" y="350" fill="#c084fc" fontSize="9" fontWeight="600" opacity="0.7">Mycorrhizal fungi</text>
        <text x={stemX + 15} y={soilTop + 50} fill="#06b6d4" fontSize="8" opacity="0.6">Xylem ↑</text>

        {/* Casparian strip indicator */}
        <circle cx={stemX} cy={soilTop + 15} r="8" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.5" />
        <text x={stemX + 15} y={soilTop + 18} fill="#f59e0b" fontSize="7" opacity="0.5">Casparian strip</text>

        {/* ── Water dots ── */}
        {dots.map(d => {
          const color = dotColor[d.phase];
          const r = d.phase === 'xylem' ? 3 : d.phase === 'soil' ? 2 : 2.5;
          const opacity = Math.min(0.8, d.age / 10) * Math.max(0.2, 1 - d.age / 300);
          return (
            <g key={d.id}>
              <circle cx={d.x} cy={d.y} r={r + 2} fill={color} opacity={opacity * 0.2} />
              <circle cx={d.x} cy={d.y} r={r} fill={color} opacity={opacity} />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400" /> Water in soil
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" /> Water in xylem
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400" /> Mycorrhizal fungi
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> Root tips (growing)
        </span>
      </div>
    </div>
  );
}
