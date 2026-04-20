import { useState, useEffect } from 'react';

// ── The Leaf's Breathing Pores ───────────────────────────────
// Animated stomata: guard cells swell with water → pore opens →
// CO₂ drifts in, O₂ and water vapor drift out. Toggle day/night
// to see stomata open (day) and close (night, saving water).
// Close-up view of the leaf underside.

export default function JasmineStomataClockDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 460, H = 360;

  // Stomata opening: 0 (closed) to 1 (fully open)
  const targetOpen = isDay ? 1 : 0;
  const openAmount = targetOpen + Math.sin(tick * 0.02) * 0.05; // slight flutter
  const smoothOpen = Math.max(0, Math.min(1, openAmount));

  // Guard cell turgidity drives opening
  const guardCellWidth = 8 + smoothOpen * 6; // swells when turgid
  const poreGap = smoothOpen * 12;

  // Particle positions for gas exchange
  const co2Particles = isDay ? Array.from({ length: 4 }, (_, i) => ({
    x: 180 + Math.sin(tick * 0.04 + i * 1.5) * 20 + i * 5,
    y: 30 + i * 15 + Math.sin(tick * 0.06 + i) * 5 + (tick * 0.3 + i * 20) % 80,
    opacity: smoothOpen * 0.7,
  })) : [];

  const o2Particles = isDay ? Array.from({ length: 3 }, (_, i) => ({
    x: 260 + Math.sin(tick * 0.05 + i * 2) * 15,
    y: 120 - (tick * 0.4 + i * 25) % 90,
    opacity: smoothOpen * 0.6,
  })) : [];

  const h2oVapor = Array.from({ length: 4 }, (_, i) => ({
    x: 220 + Math.cos(tick * 0.03 + i * 1.8) * 30,
    y: 50 - (tick * 0.25 + i * 20) % 70,
    opacity: smoothOpen * 0.4,
  }));

  // Epidermal cells (the leaf surface cells around the stomata)
  const epidermis = Array.from({ length: 6 }, (_, i) => ({
    x: 80 + i * 65,
    y: 160 + Math.sin(i * 1.2) * 8,
  }));

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-green-50 to-slate-50 dark:from-emerald-950 dark:via-green-950 dark:to-slate-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          The Leaf&apos;s Breathing Pores
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDay(!isDay)}
            className={`text-xs px-3 py-0.5 rounded transition ${
              isDay
                ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/50'
                : 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50'
            }`}
          >
            {isDay ? '☀ Day — stomata open' : '🌙 Night — stomata closed'}
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img"
        aria-label="Animated stomata — guard cells swell to open pore during day, close at night">

        {/* Background: leaf surface (epidermal cells) */}
        {epidermis.map((cell, i) => (
          <g key={`epi-${i}`}>
            <rect x={cell.x - 28} y={cell.y - 20} width="56" height="40" rx="8"
              fill="#166534" opacity="0.4" stroke="#15803d" strokeWidth="1" />
          </g>
        ))}

        {/* Central stoma — the main attraction */}
        <g transform={`translate(${W / 2}, 180)`}>
          {/* Guard cell left */}
          <ellipse cx={-poreGap - 2} cy="0" rx={guardCellWidth} ry="28"
            fill="#22c55e" stroke="#166534" strokeWidth="2"
            transform={`rotate(-8, ${-poreGap - 2}, 0)`} />
          {/* Chloroplasts in guard cell (they have chloroplasts!) */}
          {[0, 1, 2, 3].map(j => (
            <circle key={`chl-l-${j}`}
              cx={-poreGap - 5 + (j % 2) * 6}
              cy={-10 + j * 7}
              r="2.5" fill="#15803d" opacity="0.7" />
          ))}

          {/* Guard cell right */}
          <ellipse cx={poreGap + 2} cy="0" rx={guardCellWidth} ry="28"
            fill="#22c55e" stroke="#166534" strokeWidth="2"
            transform={`rotate(8, ${poreGap + 2}, 0)`} />
          {[0, 1, 2, 3].map(j => (
            <circle key={`chl-r-${j}`}
              cx={poreGap + 5 - (j % 2) * 6}
              cy={-10 + j * 7}
              r="2.5" fill="#15803d" opacity="0.7" />
          ))}

          {/* The pore itself */}
          <ellipse cx="0" cy="0" rx={poreGap * 0.7} ry={poreGap > 2 ? 18 : 2}
            fill="#0a1f0a" opacity={smoothOpen * 0.8} />

          {/* Guard cell labels */}
          <text x={-poreGap - guardCellWidth - 10} y="4" textAnchor="end"
            fill="#86efac" fontSize="8" fontWeight="600">Guard cell</text>
          <text x={poreGap + guardCellWidth + 10} y="4"
            fill="#86efac" fontSize="8" fontWeight="600">Guard cell</text>

          {smoothOpen > 0.3 && (
            <text x="0" y="4" textAnchor="middle" fill="#4ade80" fontSize="7" fontWeight="bold">
              PORE
            </text>
          )}
        </g>

        {/* Gas exchange particles */}
        {/* CO₂ coming IN (from above, into the pore) */}
        {co2Particles.map((p, i) => (
          <g key={`co2-${i}`} opacity={p.opacity}>
            <circle cx={p.x} cy={p.y} r="4" fill="#9ca3af" />
            <text x={p.x} y={p.y + 1} textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">CO₂</text>
          </g>
        ))}

        {/* O₂ going OUT (from pore upward) */}
        {o2Particles.map((p, i) => (
          <g key={`o2-${i}`} opacity={p.opacity}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#67e8f9" />
            <text x={p.x} y={p.y + 1} textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">O₂</text>
          </g>
        ))}

        {/* Water vapor going OUT */}
        {h2oVapor.map((p, i) => (
          <g key={`h2o-${i}`} opacity={p.opacity}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="#a5b4fc" />
          </g>
        ))}

        {/* Flow arrows when open */}
        {smoothOpen > 0.3 && (
          <g opacity={smoothOpen * 0.5}>
            {/* CO₂ in arrow */}
            <text x={150} y={80} fill="#9ca3af" fontSize="9" fontWeight="600">CO₂ →</text>
            {/* O₂ out arrow */}
            <text x={280} y={80} fill="#67e8f9" fontSize="9" fontWeight="600">← O₂</text>
            {/* H₂O out */}
            <text x={W / 2} y={45} textAnchor="middle" fill="#a5b4fc" fontSize="8">↑ H₂O vapor (transpiration)</text>
          </g>
        )}

        {/* State explanation */}
        <text x={W / 2} y={260} textAnchor="middle" fill={isDay ? '#fde047' : '#818cf8'} fontSize="10" fontWeight="600">
          {isDay
            ? 'Guard cells absorb water → swell → pore opens → gas exchange happens'
            : 'Guard cells lose water → shrink → pore closes → water conserved'}
        </text>

        {/* Cross-section label */}
        <text x={W / 2} y={280} textAnchor="middle" fill="#6b7280" fontSize="8">
          View: underside of a leaf, magnified ~400×
        </text>

        {/* Turgor pressure indicator */}
        <g transform={`translate(50, 300)`}>
          <text x="0" y="0" fill="#86efac" fontSize="9" fontWeight="600">Guard cell turgor:</text>
          <rect x="110" y="-10" width="100" height="12" rx="6" fill="#1a2e1a" stroke="#166534" strokeWidth="1" />
          <rect x="111" y="-9" width={smoothOpen * 98} height="10" rx="5" fill="#22c55e" opacity="0.8" />
          <text x={111 + smoothOpen * 98 + 5} y="0" fill="#86efac" fontSize="8">{Math.round(smoothOpen * 100)}%</text>
        </g>

        {/* K⁺ ions driving osmosis */}
        {isDay && smoothOpen > 0.3 && (
          <g opacity="0.5">
            <text x={W / 2} y={320} textAnchor="middle" fill="#c084fc" fontSize="8">
              K⁺ ions pump into guard cells → water follows by osmosis → cells swell
            </text>
          </g>
        )}

        {/* Night: ABA hormone note */}
        {!isDay && (
          <g opacity="0.5">
            <text x={W / 2} y={320} textAnchor="middle" fill="#818cf8" fontSize="8">
              Abscisic acid (ABA) signals: close stomata, save water during drought or darkness
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" /> CO₂ (in)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" /> O₂ (out)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-300" /> H₂O vapor (out)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Guard cells
        </span>
      </div>
    </div>
  );
}
