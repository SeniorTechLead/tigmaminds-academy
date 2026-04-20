import { useState, useEffect } from 'react';

// ── Seeds on the Move ────────────────────────────────────────
// Multiple seed dispersal methods animated simultaneously:
// - Dandelion seeds floating on wind (parachutes)
// - Maple seeds helicoptering down (samaras)
// - An exploding pod (touch-me-not)
// - A berry being carried by a bird

interface Seed {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'dandelion' | 'maple' | 'explosion' | 'berry';
  rotation: number;
  age: number;
}

let sId = 0;

export default function SeedWindDispersalDiagram() {
  const [tick, setTick] = useState(0);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [paused, setPaused] = useState(false);
  const [dispersed, setDispersed] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 520, H = 380;
  const groundY = 340;

  // Wind gusts
  const windForce = Math.sin(tick * 0.02) * 0.5 + 0.3;

  useEffect(() => {
    if (paused) return;

    setSeeds(prev => {
      const next: Seed[] = [];

      // Spawn dandelion seeds (from left plant)
      if (tick % 40 === 0) {
        for (let i = 0; i < 3; i++) {
          next.push({
            id: sId++, type: 'dandelion',
            x: 70 + Math.random() * 10,
            y: groundY - 120 - Math.random() * 20,
            vx: 0.8 + Math.random() * 0.5,
            vy: -0.5 - Math.random() * 0.3,
            rotation: Math.random() * 360,
            age: 0,
          });
        }
      }

      // Spawn maple samara (from center tree)
      if (tick % 60 === 0) {
        next.push({
          id: sId++, type: 'maple',
          x: 250 + Math.random() * 20,
          y: groundY - 180,
          vx: 0.3 + Math.random() * 0.5,
          vy: 0.5,
          rotation: 0,
          age: 0,
        });
      }

      // Spawn explosion seeds (from right plant, burst)
      if (tick % 120 === 0) {
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
          next.push({
            id: sId++, type: 'explosion',
            x: 420,
            y: groundY - 80,
            vx: Math.cos(angle) * (2 + Math.random()),
            vy: Math.sin(angle) * (2 + Math.random()) - 1,
            rotation: Math.random() * 360,
            age: 0,
          });
        }
        setDispersed(d => d + 6);
      }

      for (const s of prev) {
        const ns = { ...s, age: s.age + 1 };

        switch (ns.type) {
          case 'dandelion':
            // Float on wind — very slow descent, pushed sideways
            ns.vx = windForce * 1.5 + Math.sin(ns.age * 0.05 + ns.id) * 0.3;
            ns.vy = 0.15 + Math.sin(ns.age * 0.08) * 0.15; // barely sinking
            ns.x += ns.vx;
            ns.y += ns.vy;
            ns.rotation += 0.5;
            if (ns.y > groundY) { setDispersed(d => d + 1); continue; }
            break;

          case 'maple':
            // Helicopter spin — spinning descent
            ns.vx += windForce * 0.3;
            ns.vy = 0.8 + Math.sin(ns.age * 0.15) * 0.2; // oscillating descent
            ns.x += ns.vx + Math.sin(ns.rotation * 0.05) * 0.5;
            ns.y += ns.vy;
            ns.rotation += 8; // fast spin
            if (ns.y > groundY) { setDispersed(d => d + 1); continue; }
            break;

          case 'explosion':
            // Ballistic — gravity and air resistance
            ns.vy += 0.08; // gravity
            ns.vx *= 0.98; // drag
            ns.x += ns.vx;
            ns.y += ns.vy;
            ns.rotation += ns.vx * 3;
            if (ns.y > groundY) continue; // landed
            break;

          case 'berry':
            ns.x += ns.vx;
            ns.y += ns.vy;
            break;
        }

        if (ns.age < 400 && ns.x > -20 && ns.x < W + 50) {
          next.push(ns);
        }
      }

      return [...prev.filter(s => s.age < 400 && s.y < groundY + 5 && s.x > -20), ...next].slice(-50);
    });
  }, [tick, paused, windForce]);

  // Bird animation (carries berry)
  const birdCycle = (tick * 0.5) % W;
  const birdY = groundY - 200 + Math.sin(tick * 0.04) * 20;
  const hasBerry = birdCycle > 100 && birdCycle < 350;

  return (
    <div className="bg-gradient-to-b from-sky-50 via-sky-50 to-emerald-50 dark:from-sky-900 dark:via-sky-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          Seeds on the Move
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">{dispersed} seeds dispersed</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated seed dispersal — wind, helicopter spin, explosion, and bird-carried methods">

        {/* Wind indicator */}
        {[0, 1, 2].map(i => (
          <line key={`wind-${i}`}
            x1={20 + i * 15} y1={30 + i * 5}
            x2={50 + i * 15 + windForce * 30} y2={30 + i * 5}
            stroke="#93c5fd" strokeWidth="1" opacity={0.3 + windForce * 0.3}
            strokeLinecap="round" />
        ))}
        <text x="20" y="20" fill="#93c5fd" fontSize="8" opacity="0.5">Wind →</text>

        {/* Ground */}
        <rect x="0" y={groundY} width={W} height={H - groundY}
          fill="#365314" opacity="0.4" />

        {/* ── Dandelion plant (left) ── */}
        <line x1="70" y1={groundY} x2="70" y2={groundY - 100} stroke="#78716c" strokeWidth="2" />
        <circle cx="70" cy={groundY - 110} r="12" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
          const a = (i * 45) * Math.PI / 180;
          return (
            <line key={`df-${i}`}
              x1={70 + Math.cos(a) * 5} y1={groundY - 110 + Math.sin(a) * 5}
              x2={70 + Math.cos(a) * 12} y2={groundY - 110 + Math.sin(a) * 12}
              stroke="#e5e7eb" strokeWidth="0.5" opacity="0.6" />
          );
        })}
        <text x="70" y={groundY + 15} textAnchor="middle" fill="#a3e635" fontSize="8">Wind</text>

        {/* ── Tree (center) ── */}
        <line x1="260" y1={groundY} x2="260" y2={groundY - 160} stroke="#5c4033" strokeWidth="6" />
        <circle cx="260" cy={groundY - 180} r="30" fill="#166534" opacity="0.7" />
        <circle cx="240" cy={groundY - 165} r="20" fill="#15803d" opacity="0.6" />
        <circle cx="280" cy={groundY - 170} r="22" fill="#14532d" opacity="0.7" />
        <text x="260" y={groundY + 15} textAnchor="middle" fill="#a3e635" fontSize="8">Helicopter</text>

        {/* ── Touch-me-not pod (right) ── */}
        <line x1="420" y1={groundY} x2="420" y2={groundY - 60} stroke="#78716c" strokeWidth="2" />
        <ellipse cx="420" cy={groundY - 75} rx="10" ry="6" fill="#65a30d"
          stroke="#4d7c0f" strokeWidth="1" />
        {/* Burst lines when exploding */}
        {tick % 120 < 10 && (
          <g>
            {[0, 1, 2, 3, 4, 5].map(i => {
              const a = (i * 60) * Math.PI / 180;
              return (
                <line key={`burst-${i}`}
                  x1={420 + Math.cos(a) * 12} y1={groundY - 75 + Math.sin(a) * 12}
                  x2={420 + Math.cos(a) * 25} y2={groundY - 75 + Math.sin(a) * 25}
                  stroke="#fde047" strokeWidth="2" opacity="0.8" />
              );
            })}
          </g>
        )}
        <text x="420" y={groundY + 15} textAnchor="middle" fill="#a3e635" fontSize="8">Explosion</text>

        {/* ── Bird ── */}
        <g transform={`translate(${birdCycle}, ${birdY})`}>
          {/* Body */}
          <ellipse cx="0" cy="0" rx="10" ry="5" fill="#64748b" />
          {/* Wing */}
          <ellipse cx="-3" cy="-5" rx="12" ry="4" fill="#94a3b8" opacity="0.7"
            transform={`rotate(${Math.sin(tick * 0.5) * 20}, -3, -5)`} />
          {/* Head */}
          <circle cx="10" cy="-2" r="4" fill="#475569" />
          {/* Beak */}
          <polygon points="14,-2 18,-3 14,-4" fill="#f59e0b" />
          {/* Berry in beak */}
          {hasBerry && (
            <circle cx="16" cy="0" r="3" fill="#dc2626" />
          )}
        </g>
        {birdCycle > 200 && birdCycle < 220 && (
          <text x={birdCycle} y={birdY + 20} textAnchor="middle" fill="#94a3b8" fontSize="7">
            Bird drops seed far away!
          </text>
        )}

        {/* ── Seeds ── */}
        {seeds.map(s => {
          switch (s.type) {
            case 'dandelion':
              return (
                <g key={s.id} transform={`translate(${s.x}, ${s.y}) rotate(${s.rotation})`}
                  opacity={Math.min(0.8, s.age / 10)}>
                  <circle cx="0" cy="0" r="1.5" fill="#fef9c3" />
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={`dp-${i}`}
                      x1="0" y1="0"
                      x2={Math.cos(i * 60 * Math.PI / 180) * 6}
                      y2={Math.sin(i * 60 * Math.PI / 180) * 6}
                      stroke="white" strokeWidth="0.3" opacity="0.6" />
                  ))}
                </g>
              );
            case 'maple':
              return (
                <g key={s.id} transform={`translate(${s.x}, ${s.y}) rotate(${s.rotation})`}
                  opacity={Math.min(0.9, s.age / 5)}>
                  <ellipse cx="0" cy="0" rx="2" ry="1.5" fill="#854d0e" />
                  <path d="M 0,0 L 12,-3 L 10,0 L 12,3 Z" fill="#a16207" opacity="0.8" />
                </g>
              );
            case 'explosion':
              return (
                <circle key={s.id} cx={s.x} cy={s.y} r="2.5" fill="#65a30d"
                  opacity={Math.max(0.2, 1 - s.age / 100)} />
              );
            default:
              return null;
          }
        })}

        {/* Method labels at bottom */}
        <text x={W / 2} y={H - 5} textAnchor="middle" fill="#6b7280" fontSize="8">
          Plants can&apos;t walk — so they launch, float, spin, or hitch rides to travel
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-100" /> Dandelion (wind parachute)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-700" /> Maple (helicopter samara)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-600" /> Touch-me-not (explosion)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600" /> Berry (animal-carried)
        </span>
      </div>
    </div>
  );
}
