import { useState, useEffect, useRef } from 'react';

// ── The Underground Web ──────────────────────────────────────
// Animated fungal hyphae growing outward from a central spore,
// branching and searching. Occasionally spore-bearing mushrooms
// emerge. Shows the largest organism on Earth is a fungus.
// Spore counter — millions released per fruiting body.

interface HyphaTip {
  id: number;
  x: number;
  y: number;
  angle: number;
  parentX: number;
  parentY: number;
  age: number;
  depth: number; // branching depth from root
}

interface HyphaSegment {
  x1: number; y1: number;
  x2: number; y2: number;
  depth: number;
  age: number;
}

let tipId = 0;

export default function FungiDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tips, setTips] = useState<HyphaTip[]>([]);
  const [segments, setSegments] = useState<HyphaSegment[]>([]);
  const [mushrooms, setMushrooms] = useState<{ x: number; y: number; age: number }[]>([]);
  const [spores, setSpores] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 540, H = 360;
  const cx = W / 2;
  const cy = H / 2 + 30;

  // Initialize with starter tips radiating from center
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initial: HyphaTip[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
      initial.push({
        id: tipId++,
        x: cx, y: cy,
        parentX: cx, parentY: cy,
        angle, age: 0, depth: 0,
      });
    }
    setTips(initial);
  }, []);

  // Growth step
  useEffect(() => {
    if (paused) return;
    if (!initialized.current) return;

    setTips(prev => {
      const next: HyphaTip[] = [];
      const newSegments: HyphaSegment[] = [];

      for (const t of prev) {
        // Stop if going off-screen
        if (t.x < 10 || t.x > W - 10 || t.y < 10 || t.y > H - 10) continue;
        if (t.age > 200) continue; // old tips retire

        // Wander (random turn each step)
        const wander = (Math.random() - 0.5) * 0.2;
        const newAngle = t.angle + wander;
        const step = 3;
        const newX = t.x + Math.cos(newAngle) * step;
        const newY = t.y + Math.sin(newAngle) * step;

        newSegments.push({
          x1: t.x, y1: t.y, x2: newX, y2: newY,
          depth: t.depth, age: 0,
        });

        next.push({
          ...t, x: newX, y: newY, angle: newAngle, age: t.age + 1,
          parentX: t.x, parentY: t.y,
        });

        // Branch occasionally (more often at first, rarer later)
        if (Math.random() < 0.04 && t.depth < 6 && prev.length < 40) {
          const branchAngle = newAngle + (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.4);
          next.push({
            id: tipId++,
            x: newX, y: newY,
            parentX: newX, parentY: newY,
            angle: branchAngle,
            age: 0,
            depth: t.depth + 1,
          });
        }
      }

      return next;
    });

    setSegments(prev => {
      const aged = prev.map(s => ({ ...s, age: s.age + 1 }));
      return aged.slice(-800); // cap for performance
    });

    // Periodically sprout mushrooms (fruiting bodies) in the explored area
    if (tick % 120 === 0 && tick > 60 && segments.length > 50 && mushrooms.length < 4) {
      // Pick a random segment point and place a mushroom there
      const s = segments[Math.floor(Math.random() * segments.length)];
      if (s) {
        setMushrooms(m => [...m, { x: s.x2, y: s.y2, age: 0 }]);
      }
    }

    // Age mushrooms — when mature, release spores
    setMushrooms(prev => prev
      .map(m => {
        const aged = { ...m, age: m.age + 1 };
        if (aged.age === 80) {
          // Burst of spores!
          setSpores(s => s + 1_000_000);
        }
        return aged;
      })
      .filter(m => m.age < 150)
    );
  }, [tick, paused]);

  // Then append new segments from tips
  useEffect(() => {
    if (paused) return;
    if (tips.length === 0) return;
    setSegments(prev => {
      const fresh = tips.map(t => ({
        x1: t.parentX, y1: t.parentY,
        x2: t.x, y2: t.y,
        depth: t.depth, age: 0,
      }));
      return [...prev, ...fresh].slice(-800);
    });
  }, [tips.length, paused]);

  const reset = () => {
    setSegments([]);
    setMushrooms([]);
    setSpores(0);
    const initial: HyphaTip[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
      initial.push({
        id: tipId++,
        x: cx, y: cy,
        parentX: cx, parentY: cy,
        angle, age: 0, depth: 0,
      });
    }
    setTips(initial);
  };

  return (
    <div className="bg-gradient-to-b from-stone-50 via-amber-50 to-emerald-50 dark:from-stone-950 dark:via-amber-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          The Underground Web
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
            {spores.toLocaleString()} spores released
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

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated fungal mycelium — hyphae branching outward from center, mushrooms sprouting and releasing spores">

        {/* Soil layer */}
        <rect x={0} y={80} width={W} height={H - 80}
          fill="#78350f" opacity="0.12" />
        <line x1={0} y1={80} x2={W} y2={80} stroke="#92400e" strokeWidth="1" opacity="0.3" />
        <text x={10} y={75} className="fill-gray-500 dark:fill-gray-400" fontSize="8" opacity="0.6">surface</text>

        {/* Mycelium network — draw all segments */}
        {segments.map((s, i) => (
          <line key={`s-${i}`}
            x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="#fef3c7" className="dark:stroke-amber-100"
            strokeWidth={Math.max(0.5, 1.5 - s.depth * 0.2)}
            strokeLinecap="round"
            opacity={Math.min(0.6, 0.3 + (50 - Math.min(50, s.age)) / 100)} />
        ))}

        {/* Growing tips (glowing) */}
        {tips.map(t => (
          <g key={`tip-${t.id}`}>
            <circle cx={t.x} cy={t.y} r="3" fill="#fbbf24" opacity="0.4" />
            <circle cx={t.x} cy={t.y} r="1.5" fill="#fde047" opacity="0.9" />
          </g>
        ))}

        {/* Central "spore that started it all" */}
        <circle cx={cx} cy={cy} r="5" fill="#b45309" opacity="0.7" />

        {/* Mushrooms */}
        {mushrooms.map((m, i) => {
          const growth = Math.min(1, m.age / 60);
          const dispersing = m.age > 80;
          const opacity = m.age > 120 ? 1 - (m.age - 120) / 30 : 1;
          return (
            <g key={`m-${i}`} opacity={opacity}>
              {/* Stem */}
              <rect x={m.x - 2} y={m.y - 20 * growth}
                width="4" height={20 * growth}
                fill="#fef3c7" stroke="#d97706" strokeWidth="0.5" />
              {/* Cap */}
              <ellipse cx={m.x} cy={m.y - 20 * growth}
                rx={10 * growth} ry={5 * growth}
                fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
              {/* Gills hint */}
              <ellipse cx={m.x} cy={m.y - 18 * growth}
                rx={8 * growth} ry={3 * growth}
                fill="#fed7aa" opacity="0.7" />

              {/* Spore cloud when mature */}
              {dispersing && (
                Array.from({ length: 12 }, (_, j) => {
                  const t = (m.age - 80) / 70;
                  const angle = (j / 12) * Math.PI * 2;
                  const r = t * 40;
                  return (
                    <circle key={`sp-${j}`}
                      cx={m.x + Math.cos(angle) * r}
                      cy={m.y - 20 * growth + Math.sin(angle) * r - 5}
                      r="1" fill="#fbbf24" opacity={1 - t} />
                  );
                })
              )}
            </g>
          );
        })}

        {/* Comparison label */}
        {spores >= 10_000_000 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="600">
            The Oregon honey fungus covers 9.6 km² — one organism, 2,400 years old
          </text>
        )}
        {spores < 10_000_000 && segments.length > 100 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">
            Each tip explores independently — no brain, but collectively it solves mazes
          </text>
        )}
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-100 border border-amber-600" /> Hyphae (mycelium)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> Growing tips
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-700" /> Mushroom (fruiting body)
        </span>
      </div>
    </div>
  );
}
