import { useState, useEffect, useCallback } from 'react';

// ── Photosynthesis: A Living Leaf ──────────────────────────────
// Animated diagram showing the real-time chemistry inside a leaf.
// Water climbs up, CO₂ drifts in, chloroplasts flash, O₂ bubbles out,
// glucose flows down. Dark background, playful, alive.

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'water' | 'co2' | 'o2' | 'glucose' | 'photon';
  age: number;
  maxAge: number;
}

let nextId = 0;

export default function PhotosynthesisDiagram() {
  const [tick, setTick] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glucoseCount, setGlucoseCount] = useState(0);
  const [paused, setPaused] = useState(false);

  // Spawn particles
  const spawn = useCallback(() => {
    const newP: Particle[] = [];

    // Water molecules climbing up xylem (every 8 ticks)
    if (tick % 8 === 0) {
      newP.push({
        id: nextId++, type: 'water',
        x: 250 + (Math.random() - 0.5) * 6,
        y: 380,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -1.2 - Math.random() * 0.4,
        age: 0, maxAge: 180,
      });
    }

    // CO₂ drifting in from left (every 12 ticks)
    if (tick % 12 === 0) {
      newP.push({
        id: nextId++, type: 'co2',
        x: 30 + Math.random() * 40,
        y: 140 + Math.random() * 40,
        vx: 1.0 + Math.random() * 0.5,
        vy: (Math.random() - 0.5) * 0.4,
        age: 0, maxAge: 140,
      });
    }

    // Photons raining down from sun (every 4 ticks)
    if (tick % 4 === 0) {
      const angle = -0.6 + Math.random() * 0.4;
      newP.push({
        id: nextId++, type: 'photon',
        x: 370 + Math.random() * 80,
        y: 30 + Math.random() * 20,
        vx: Math.cos(angle) * -2.5,
        vy: Math.sin(angle) * 2.5 + 1.5,
        age: 0, maxAge: 70,
      });
    }

    return newP;
  }, [tick]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 33); // ~30fps
    return () => clearInterval(interval);
  }, [paused]);

  // Update particles
  useEffect(() => {
    if (paused) return;
    setParticles(prev => {
      const spawned = spawn();
      const all = [...prev, ...spawned];
      const leafCx = 260, leafCy = 175;
      const leafRx = 110, leafRy = 55;
      const updated: Particle[] = [];
      let newGlucose = 0;

      for (const p of all) {
        const np = { ...p, x: p.x + p.vx, y: p.y + p.vy, age: p.age + 1 };

        // Check if particle reached the leaf (chloroplast zone)
        const inLeaf =
          ((np.x - leafCx) / leafRx) ** 2 + ((np.y - leafCy) / leafRy) ** 2 < 1;

        if (np.type === 'water' && inLeaf && np.age > 40) {
          // Water arrives at leaf → split into O₂ bubble
          updated.push({
            id: nextId++, type: 'o2',
            x: np.x + (Math.random() - 0.5) * 20,
            y: np.y,
            vx: 1.5 + Math.random(),
            vy: -0.8 - Math.random() * 0.5,
            age: 0, maxAge: 120,
          });
          continue; // water consumed
        }

        if (np.type === 'co2' && inLeaf && np.age > 20) {
          // CO₂ arrives at leaf → becomes glucose
          newGlucose++;
          updated.push({
            id: nextId++, type: 'glucose',
            x: np.x,
            y: np.y + 10,
            vx: (Math.random() - 0.5) * 0.3,
            vy: 0.8 + Math.random() * 0.3,
            age: 0, maxAge: 200,
          });
          continue; // CO₂ consumed
        }

        if (np.type === 'photon' && inLeaf) {
          continue; // photon absorbed — flash happens via chloroplast glow
        }

        if (np.age < np.maxAge && np.x > -20 && np.x < 540 && np.y > -20 && np.y < 420) {
          // Add gentle drift to O₂ bubbles
          if (np.type === 'o2') {
            np.vx += (Math.random() - 0.5) * 0.1;
            np.vy -= 0.02; // float up
          }
          // Glucose sinks with slight wiggle
          if (np.type === 'glucose') {
            np.vx = Math.sin(np.age * 0.1) * 0.3;
          }
          updated.push(np);
        }
      }

      if (newGlucose > 0) {
        setGlucoseCount(c => c + newGlucose);
      }

      return updated;
    });
  }, [tick, paused, spawn]);

  // Chloroplast glow intensity — pulses with photon hits
  const chloroplastGlow = 0.3 + Math.sin(tick * 0.15) * 0.3;

  // Stomata opening animation
  const stomataOpen = 2 + Math.sin(tick * 0.03) * 1.5;

  // Sun ray rotation
  const sunAngle = tick * 0.5;

  const particleColor: Record<string, string> = {
    water: '#60a5fa',   // blue
    co2: '#9ca3af',     // gray
    o2: '#67e8f9',      // cyan
    glucose: '#fbbf24', // amber
    photon: '#fde047',  // yellow
  };

  const particleSize: Record<string, number> = {
    water: 3,
    co2: 3.5,
    o2: 4,
    glucose: 4.5,
    photon: 2,
  };

  return (
    <div className="bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 dark:from-sky-950 dark:via-emerald-950 dark:to-amber-950 rounded-xl p-4 my-4 relative overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Inside a Living Leaf
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-mono">
            {glucoseCount} glucose made
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox="0 0 520 440" className="w-full max-w-xl mx-auto" role="img" aria-label="Animated photosynthesis — watch water, CO₂, and light become sugar and oxygen inside a leaf">

        {/* ── Sky background gradient ── */}
        <defs>
          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="chloroGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#4ade80" stopOpacity={chloroplastGlow * 0.6} />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="xylem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="phloem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#92400e" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* ── Sun ── */}
        <circle cx="440" cy="55" r="60" fill="url(#sunGlow)" />
        <circle cx="440" cy="55" r="24" fill="#fde047" opacity="0.9" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
          const a = ((sunAngle + i * 30) * Math.PI) / 180;
          const len = 8 + Math.sin(tick * 0.1 + i) * 3;
          return (
            <line
              key={`ray-${i}`}
              x1={440 + Math.cos(a) * 28}
              y1={55 + Math.sin(a) * 28}
              x2={440 + Math.cos(a) * (28 + len)}
              y2={55 + Math.sin(a) * (28 + len)}
              stroke="#fde047"
              strokeWidth="2"
              strokeLinecap="round"
              opacity={0.5 + Math.sin(tick * 0.08 + i * 0.5) * 0.3}
            />
          );
        })}
        <text x="440" y="59" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="bold">☀</text>

        {/* ── The Leaf ── */}
        {/* Leaf body — a big lush shape */}
        <path
          d="M 140,175 Q 200,110 320,130 Q 380,150 370,185 Q 360,230 300,250 Q 250,260 200,245 Q 150,225 140,175 Z"
          fill="#15803d"
          opacity="0.85"
          stroke="#166534"
          strokeWidth="1.5"
        />
        {/* Central vein */}
        <path d="M 180,175 Q 260,170 350,165" fill="none" stroke="#14532d" strokeWidth="2" opacity="0.5" />
        {/* Side veins */}
        {[0, 1, 2, 3, 4].map(i => {
          const t = 0.2 + i * 0.15;
          const cx = 180 + t * 170;
          const cy = 175 - t * 5;
          const dir = i % 2 === 0 ? -1 : 1;
          return (
            <line
              key={`vein-${i}`}
              x1={cx} y1={cy}
              x2={cx + dir * 25} y2={cy + dir * 30}
              stroke="#14532d" strokeWidth="1" opacity="0.4"
            />
          );
        })}

        {/* Chloroplast glow spots inside leaf */}
        {[
          [220, 170], [260, 160], [300, 165], [240, 195], [280, 190],
          [200, 185], [320, 180], [260, 210], [230, 150], [290, 145],
        ].map(([cx, cy], i) => (
          <circle
            key={`chloro-${i}`}
            cx={cx}
            cy={cy}
            r={6 + Math.sin(tick * 0.12 + i * 1.2) * 2}
            fill="url(#chloroGlow)"
          />
        ))}

        {/* Stomata (tiny pores at leaf bottom) — they open and close */}
        {[210, 250, 290].map((sx, i) => (
          <g key={`stoma-${i}`}>
            <ellipse cx={sx - stomataOpen} cy={242} rx="3" ry="5" fill="#166534" stroke="#14532d" strokeWidth="0.5" />
            <ellipse cx={sx + stomataOpen} cy={242} rx="3" ry="5" fill="#166534" stroke="#14532d" strokeWidth="0.5" />
            {/* The pore gap */}
            <ellipse cx={sx} cy={242} rx={stomataOpen * 0.6} ry="3" fill="#0a2e14" opacity="0.6" />
          </g>
        ))}
        <text x="250" y="268" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-300" fontSize="8" opacity="0.7">stomata (pores open &amp; close)</text>

        {/* ── Stem & Roots ── */}
        {/* Xylem (water up) */}
        <rect x="246" y="255" width="4" height="140" fill="url(#xylem)" rx="2" />
        {/* Phloem (sugar down) */}
        <rect x="254" y="255" width="4" height="140" fill="url(#phloem)" rx="2" />
        {/* Tiny root lines */}
        <path d="M 248,395 Q 230,400 215,410 M 250,395 L 250,415 M 256,395 Q 270,405 285,410"
          stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* ── Labels ── */}
        {/* CO₂ label */}
        <g opacity="0.9">
          <rect x="15" y="130" width="55" height="24" rx="12" fill="#374151" />
          <text x="42" y="146" textAnchor="middle" fill="#d1d5db" fontSize="10" fontWeight="600">CO₂</text>
          <text x="42" y="162" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">from air</text>
        </g>

        {/* H₂O label */}
        <g opacity="0.9">
          <rect x="195" y="380" width="45" height="22" rx="11" fill="#1e3a5f" />
          <text x="218" y="395" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="600">H₂O</text>
        </g>

        {/* O₂ label */}
        <g opacity="0.9">
          <rect x="400" y="130" width="45" height="24" rx="12" fill="#164e63" />
          <text x="422" y="146" textAnchor="middle" fill="#67e8f9" fontSize="10" fontWeight="600">O₂</text>
          <text x="422" y="162" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">released!</text>
        </g>

        {/* Glucose label */}
        <g opacity="0.9">
          <rect x="270" y="330" width="65" height="24" rx="12" fill="#451a03" />
          <text x="302" y="346" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">Glucose ↓</text>
        </g>

        {/* ── All particles ── */}
        {particles.map(p => {
          const opacity = p.type === 'photon'
            ? Math.max(0, 1 - p.age / p.maxAge) * 0.8
            : Math.min(1, p.age / 10) * Math.max(0, 1 - p.age / p.maxAge);

          return (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={particleSize[p.type]}
              fill={particleColor[p.type]}
              opacity={opacity}
            >
              {p.type === 'o2' && (
                <animate attributeName="r" values={`${particleSize.o2};${particleSize.o2 + 1.5};${particleSize.o2}`} dur="1.5s" repeatCount="indefinite" />
              )}
            </circle>
          );
        })}

        {/* ── Equation at bottom ── */}
        <text x="260" y="430" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
        {[
          ['#60a5fa', 'Water (H₂O)'],
          ['#9ca3af', 'Carbon dioxide (CO₂)'],
          ['#fde047', 'Photons (light)'],
          ['#67e8f9', 'Oxygen (O₂)'],
          ['#fbbf24', 'Glucose (sugar)'],
        ].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
