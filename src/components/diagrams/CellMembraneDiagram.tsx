import { useState, useEffect } from 'react';

// ── The Cell's Bouncer ───────────────────────────────────────
// Animated phospholipid bilayer with molecules trying to cross.
// Small O₂/CO₂ slip through freely. Water squeezes through aquaporins.
// Glucose needs a carrier protein. Na⁺/K⁺ pump actively works.
// Cholesterol wobbles between phospholipids.

interface Molecule {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'o2' | 'co2' | 'water' | 'glucose' | 'na' | 'k';
  age: number;
  crossed: boolean;
}

let molId = 0;

const MOL_CONFIG: Record<string, { color: string; r: number; label: string }> = {
  o2:      { color: '#67e8f9', r: 3,   label: 'O₂' },
  co2:     { color: '#9ca3af', r: 3.5, label: 'CO₂' },
  water:   { color: '#60a5fa', r: 2.5, label: 'H₂O' },
  glucose: { color: '#fbbf24', r: 5,   label: 'Glucose' },
  na:      { color: '#f472b6', r: 3,   label: 'Na⁺' },
  k:       { color: '#a78bfa', r: 3,   label: 'K⁺' },
};

const MEMBRANE_Y = 145; // center of membrane
const MEMBRANE_HALF = 30; // half-thickness

export default function CellMembraneDiagram() {
  const [tick, setTick] = useState(0);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [paused, setPaused] = useState(false);
  const [pumpCycle, setPumpCycle] = useState(0); // 0-100 for Na/K pump animation

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setPumpCycle(p => (p + 1) % 120);
    }, 33);
    return () => clearInterval(interval);
  }, [paused]);

  // Phospholipid positions (upper and lower leaflet)
  const phospholipidX = Array.from({ length: 16 }, (_, i) => 30 + i * 30);

  // Channel protein position
  const channelX = 240;
  // Carrier protein position
  const carrierX = 360;
  // Na/K pump position
  const pumpX = 150;
  // Aquaporin position
  const aquaporinX = 90;

  // Wobble for phospholipid tails
  const tailWobble = (x: number, i: number) =>
    Math.sin(tick * 0.08 + i * 0.7 + x * 0.01) * 2;

  useEffect(() => {
    if (paused) return;

    setMolecules(prev => {
      const next: Molecule[] = [];

      // Spawn molecules above membrane (extracellular)
      if (tick % 15 === 0) {
        const types: Molecule['type'][] = ['o2', 'co2', 'water', 'glucose', 'na'];
        const type = types[Math.floor(Math.random() * types.length)];
        next.push({
          id: molId++, type,
          x: 50 + Math.random() * 400,
          y: 30 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 2,
          vy: 0.5 + Math.random() * 0.5,
          age: 0, crossed: false,
        });
      }

      // Spawn K⁺ below membrane (intracellular) for pump
      if (tick % 40 === 0) {
        next.push({
          id: molId++, type: 'k',
          x: pumpX + (Math.random() - 0.5) * 30,
          y: 230 + Math.random() * 30,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -0.3 - Math.random() * 0.3,
          age: 0, crossed: false,
        });
      }

      for (const mol of prev) {
        const nm = { ...mol, x: mol.x + mol.vx, y: mol.y + mol.vy, age: mol.age + 1 };

        // Brownian jiggle
        nm.vx += (Math.random() - 0.5) * 0.3;
        nm.vy += (Math.random() - 0.5) * 0.15;

        // Boundary bounce
        if (nm.x < 10 || nm.x > 490) nm.vx *= -1;

        const atMembrane = Math.abs(nm.y - MEMBRANE_Y) < MEMBRANE_HALF;

        if (atMembrane && !nm.crossed) {
          if (nm.type === 'o2' || nm.type === 'co2') {
            // Small nonpolar → slip through freely (slight slowdown)
            nm.vy *= 0.85;
            if (nm.y > MEMBRANE_Y + 5) nm.crossed = true;
          } else if (nm.type === 'water' && Math.abs(nm.x - aquaporinX) < 15) {
            // Water through aquaporin channel
            nm.x += (aquaporinX - nm.x) * 0.1;
            nm.vy = 0.8;
            if (nm.y > MEMBRANE_Y + 10) nm.crossed = true;
          } else if (nm.type === 'glucose' && Math.abs(nm.x - carrierX) < 20) {
            // Glucose through carrier protein (facilitated diffusion)
            nm.x += (carrierX - nm.x) * 0.05;
            nm.vy = 0.4;
            if (nm.y > MEMBRANE_Y + 15) nm.crossed = true;
          } else if (nm.type === 'na' && Math.abs(nm.x - pumpX) < 20 && pumpCycle > 60) {
            // Na⁺ pumped OUT (active transport) — during pump cycle
            nm.vy = -1.2;
            nm.x += (pumpX - nm.x) * 0.1;
            if (nm.y < MEMBRANE_Y - 15) nm.crossed = true;
          } else if (nm.type === 'k' && Math.abs(nm.x - pumpX) < 20 && pumpCycle < 60) {
            // K⁺ pumped IN
            nm.vy = 1.0;
            nm.x += (pumpX - nm.x) * 0.1;
            if (nm.y > MEMBRANE_Y + 15) nm.crossed = true;
          } else {
            // Blocked — bounce off
            nm.vy *= -0.8;
            nm.y = nm.y < MEMBRANE_Y ? MEMBRANE_Y - MEMBRANE_HALF - 2 : MEMBRANE_Y + MEMBRANE_HALF + 2;
          }
        }

        if (nm.age < 300 && nm.y > -10 && nm.y < 300) {
          next.push(nm);
        }
      }

      return [...prev.filter(m => m.age < 300 && m.y > -10 && m.y < 300).map(m => {
        const nm = { ...m, x: m.x + m.vx, y: m.y + m.vy, age: m.age + 1 };
        nm.vx += (Math.random() - 0.5) * 0.3;
        nm.vy += (Math.random() - 0.5) * 0.15;
        if (nm.x < 10 || nm.x > 490) nm.vx *= -1;
        return nm;
      }), ...next].slice(-60);
    });
  }, [tick, paused, pumpCycle]);

  // Na/K pump visual state
  const pumpPhase = pumpCycle < 60 ? 'K⁺ in' : 'Na⁺ out';
  const pumpGlow = Math.sin(pumpCycle * 0.05 * Math.PI) * 0.3 + 0.4;

  return (
    <div className="bg-gradient-to-b from-blue-950 via-slate-950 to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          The Cell&apos;s Bouncer — Who Gets In?
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-300 font-mono">
            Pump: {pumpPhase}
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox="0 0 500 290" className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated cell membrane showing molecules crossing through different transport mechanisms">

        {/* Zone labels */}
        <text x="250" y="18" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600" opacity="0.7">
          OUTSIDE the cell (extracellular)
        </text>
        <text x="250" y="278" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600" opacity="0.7">
          INSIDE the cell (intracellular)
        </text>

        {/* ── Phospholipid bilayer ── */}
        {phospholipidX.map((x, i) => {
          const wobble = tailWobble(x, i);
          // Skip positions where proteins are
          if (Math.abs(x - channelX) < 20) return null;
          if (Math.abs(x - carrierX) < 20) return null;
          if (Math.abs(x - pumpX) < 22) return null;
          if (Math.abs(x - aquaporinX) < 15) return null;

          return (
            <g key={`pl-${i}`}>
              {/* Upper leaflet */}
              <circle cx={x} cy={MEMBRANE_Y - 22} r="5" fill="#60a5fa" opacity="0.8" />
              <line x1={x - 2 + wobble} y1={MEMBRANE_Y - 17} x2={x - 3 + wobble * 0.5} y2={MEMBRANE_Y - 3}
                stroke="#eab308" strokeWidth="1.5" opacity="0.7" />
              <line x1={x + 2 + wobble} y1={MEMBRANE_Y - 17} x2={x + 3 + wobble * 0.5} y2={MEMBRANE_Y - 3}
                stroke="#eab308" strokeWidth="1.5" opacity="0.7" />

              {/* Lower leaflet */}
              <circle cx={x} cy={MEMBRANE_Y + 22} r="5" fill="#60a5fa" opacity="0.8" />
              <line x1={x - 2 - wobble} y1={MEMBRANE_Y + 17} x2={x - 3 - wobble * 0.5} y2={MEMBRANE_Y + 3}
                stroke="#eab308" strokeWidth="1.5" opacity="0.7" />
              <line x1={x + 2 - wobble} y1={MEMBRANE_Y + 17} x2={x + 3 - wobble * 0.5} y2={MEMBRANE_Y + 3}
                stroke="#eab308" strokeWidth="1.5" opacity="0.7" />

              {/* Occasional cholesterol */}
              {i % 4 === 1 && (
                <ellipse cx={x + 10} cy={MEMBRANE_Y} rx="4" ry="8" fill="#f97316" opacity="0.5"
                  transform={`rotate(${wobble * 3}, ${x + 10}, ${MEMBRANE_Y})`} />
              )}
            </g>
          );
        })}

        {/* ── Aquaporin channel (water only) ── */}
        <rect x={aquaporinX - 8} y={MEMBRANE_Y - 28} width="16" height="56" rx="5"
          fill="#0e7490" opacity="0.8" stroke="#06b6d4" strokeWidth="1" />
        <rect x={aquaporinX - 4} y={MEMBRANE_Y - 28} width="8" height="56" rx="3"
          fill="#164e63" opacity="0.6" />
        <text x={aquaporinX} y={MEMBRANE_Y - 32} textAnchor="middle" fill="#67e8f9" fontSize="7" fontWeight="600">
          Aquaporin
        </text>
        <text x={aquaporinX} y={MEMBRANE_Y + 42} textAnchor="middle" fill="#67e8f9" fontSize="6">
          (water only)
        </text>

        {/* ── Na⁺/K⁺ pump (active transport) ── */}
        <rect x={pumpX - 15} y={MEMBRANE_Y - 28} width="30" height="56" rx="6"
          fill={`rgba(236, 72, 153, ${pumpGlow})`} stroke="#ec4899" strokeWidth="1.5" />
        <text x={pumpX} y={MEMBRANE_Y - 2} textAnchor="middle" fill="#fce7f3" fontSize="7" fontWeight="bold">
          Na⁺/K⁺
        </text>
        <text x={pumpX} y={MEMBRANE_Y + 8} textAnchor="middle" fill="#fce7f3" fontSize="6">
          pump
        </text>
        {/* ATP indicator */}
        <text x={pumpX + 22} y={MEMBRANE_Y + 25} fill="#f472b6" fontSize="7" fontWeight="bold" opacity={pumpGlow}>
          ATP→
        </text>

        {/* ── Channel protein (ions) ── */}
        <rect x={channelX - 12} y={MEMBRANE_Y - 28} width="24" height="56" rx="8"
          fill="#7c3aed" opacity="0.7" stroke="#a78bfa" strokeWidth="1" />
        <rect x={channelX - 5} y={MEMBRANE_Y - 28} width="10" height="56" rx="4"
          fill="#4c1d95" opacity="0.5" />
        <text x={channelX} y={MEMBRANE_Y - 32} textAnchor="middle" fill="#c4b5fd" fontSize="7" fontWeight="600">
          Ion channel
        </text>

        {/* ── Carrier protein (glucose) ── */}
        <rect x={carrierX - 15} y={MEMBRANE_Y - 28} width="30" height="56" rx="8"
          fill="#b45309" opacity="0.7" stroke="#f59e0b" strokeWidth="1" />
        <text x={carrierX} y={MEMBRANE_Y - 32} textAnchor="middle" fill="#fcd34d" fontSize="7" fontWeight="600">
          Carrier
        </text>
        <text x={carrierX} y={MEMBRANE_Y + 42} textAnchor="middle" fill="#fcd34d" fontSize="6">
          (glucose)
        </text>

        {/* ── Molecules ── */}
        {molecules.map(mol => {
          const cfg = MOL_CONFIG[mol.type];
          const opacity = Math.min(1, mol.age / 8) * Math.max(0.2, 1 - mol.age / 300);
          return (
            <g key={mol.id}>
              <circle cx={mol.x} cy={mol.y} r={cfg.r + 2} fill={cfg.color} opacity={opacity * 0.2} />
              <circle cx={mol.x} cy={mol.y} r={cfg.r} fill={cfg.color} opacity={opacity * 0.9} />
            </g>
          );
        })}

        {/* ── Transport type labels (bottom) ── */}
        <g opacity="0.6">
          <text x={aquaporinX} y={MEMBRANE_Y + 55} textAnchor="middle" fill="#67e8f9" fontSize="7">Osmosis</text>
          <text x={pumpX} y={MEMBRANE_Y + 55} textAnchor="middle" fill="#f472b6" fontSize="7">Active</text>
          <text x={channelX} y={MEMBRANE_Y + 55} textAnchor="middle" fill="#c4b5fd" fontSize="7">Passive</text>
          <text x={carrierX} y={MEMBRANE_Y + 55} textAnchor="middle" fill="#fcd34d" fontSize="7">Facilitated</text>
          <text x={430} y={MEMBRANE_Y + 55} textAnchor="middle" fill="#67e8f9" fontSize="7">Simple diffusion</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        {Object.entries(MOL_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1 text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </span>
        ))}
      </div>
    </div>
  );
}
