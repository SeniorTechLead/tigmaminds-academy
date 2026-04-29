import { useState, useEffect } from 'react';

// ── Breathe In, Breathe Out ──────────────────────────────────
// Animated respiration: diaphragm contracts → lungs expand →
// air flows in. O₂ diffuses from alveoli into blood; CO₂ goes
// the other way. Diaphragm relaxes → air flows out. Adjustable
// breathing rate. Oxygen saturation counter.

export default function LungsDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [breathingRate, setBreathingRate] = useState(1); // 1x normal

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 520, H = 400;

  // Breathing cycle — phase 0 to 2π. A full breath takes ~120 ticks at 1x rate
  const phase = (tick * 0.05 * breathingRate) % (Math.PI * 2);
  const inhaling = phase < Math.PI;
  // Volume fraction: 0.3 (exhaled) to 1.0 (fully inhaled)
  const volume = 0.65 + Math.sin(phase - Math.PI / 2) * 0.35;

  // Diaphragm position: higher (up) when exhaling, lower (down) when inhaling
  const diaphragmY = 290 - volume * 30;

  // Lung dimensions
  const lungScale = 0.7 + volume * 0.3;

  // Air particles — flow direction depends on breath phase
  const airParticles = Array.from({ length: 8 }, (_, i) => {
    const t = ((tick * 2 * breathingRate + i * 25) % 200) / 200;
    if (inhaling) {
      return {
        x: 260 + Math.sin(tick * 0.2 + i) * 3,
        y: 30 + t * 140,
        opacity: t > 0.1 && t < 0.9 ? 0.7 : 0,
      };
    } else {
      return {
        x: 260 + Math.sin(tick * 0.2 + i) * 3,
        y: 170 - t * 140,
        opacity: t > 0.1 && t < 0.9 ? 0.7 : 0,
      };
    }
  });

  // Gas exchange particles in the alveoli (always happening)
  const gasExchange = Array.from({ length: 6 }, (_, i) => {
    const leftLung = i < 3;
    const baseX = leftLung ? 180 : 340;
    const orbitX = baseX + Math.cos((tick * 0.08 + i * 2) % (Math.PI * 2)) * 30;
    const orbitY = 230 + Math.sin((tick * 0.08 + i * 2) % (Math.PI * 2)) * 20;
    return {
      x: orbitX, y: orbitY,
      type: i % 2 === 0 ? 'o2' : 'co2' as 'o2' | 'co2',
    };
  });

  const oxygenPercent = 95 + Math.sin(phase) * 3;

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-rose-50 dark:from-sky-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          Breathe In, Breathe Out
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-rose-700 dark:text-rose-300 font-mono">
            O₂ sat: {oxygenPercent.toFixed(1)}%
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Animated respiration — diaphragm contracts, lungs expand, oxygen diffuses into blood">

        <text x={W / 2} y={20} textAnchor="middle"
          className={inhaling ? 'fill-sky-700 dark:fill-sky-300' : 'fill-rose-700 dark:fill-rose-300'}
          fontSize="12" fontWeight="bold">
          {inhaling ? '↓ INHALING' : '↑ EXHALING'}
        </text>

        {/* Trachea */}
        <rect x={253} y={30} width={14} height={140} rx={5}
          fill="#94a3b8" opacity="0.6" />
        <text x={275} y={50} className="fill-gray-500 dark:fill-gray-400" fontSize="9">Trachea</text>

        {/* Bronchi */}
        <line x1={260} y1={170} x2={180} y2={210} stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
        <line x1={260} y1={170} x2={340} y2={210} stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

        {/* Left lung */}
        <g transform={`translate(180, 230) scale(${lungScale})`}>
          <ellipse cx={0} cy={0} rx={75} ry={85}
            fill="#fda4af" stroke="#fb7185" strokeWidth="2" opacity="0.75" />
          {[-30, 0, 30].map((dx, i) => (
            <g key={`la-${i}`}>
              {[-20, 0, 20].map((dy, j) => (
                <circle key={`a-${i}-${j}`}
                  cx={dx} cy={dy} r="6"
                  fill="#fecaca" stroke="#f87171" strokeWidth="0.5" opacity="0.7" />
              ))}
            </g>
          ))}
        </g>

        {/* Right lung */}
        <g transform={`translate(340, 230) scale(${lungScale})`}>
          <ellipse cx={0} cy={0} rx={75} ry={85}
            fill="#fda4af" stroke="#fb7185" strokeWidth="2" opacity="0.75" />
          {[-30, 0, 30].map((dx, i) => (
            <g key={`ra-${i}`}>
              {[-20, 0, 20].map((dy, j) => (
                <circle key={`a-${i}-${j}`}
                  cx={dx} cy={dy} r="6"
                  fill="#fecaca" stroke="#f87171" strokeWidth="0.5" opacity="0.7" />
              ))}
            </g>
          ))}
        </g>

        {/* Air particles */}
        {airParticles.map((p, i) => (
          <g key={`air-${i}`} opacity={p.opacity}>
            <circle cx={p.x} cy={p.y} r="3" fill={inhaling ? '#67e8f9' : '#fca5a5'} />
            <text x={p.x} y={p.y + 1} textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">
              {inhaling ? 'O₂' : 'CO₂'}
            </text>
          </g>
        ))}

        {/* Gas exchange */}
        {gasExchange.map((p, i) => (
          <circle key={`gx-${i}`} cx={p.x} cy={p.y} r="2.5"
            fill={p.type === 'o2' ? '#67e8f9' : '#9ca3af'} opacity="0.8" />
        ))}

        {/* Ribcage */}
        {[0, 1, 2, 3].map(i => (
          <path key={`rib-${i}`}
            d={`M 100,${180 + i * 25} Q 260,${170 + i * 25 - volume * 5} 420,${180 + i * 25}`}
            fill="none" stroke="#cbd5e1" strokeWidth="2" opacity="0.4" />
        ))}

        {/* Diaphragm */}
        <path d={`M 100,${diaphragmY + 20} Q 260,${diaphragmY} 420,${diaphragmY + 20}`}
          fill="#7c2d12" stroke="#991b1b" strokeWidth="2" opacity="0.6" />
        <text x={W / 2} y={diaphragmY + 15} textAnchor="middle"
          className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">
          Diaphragm {inhaling ? '(contracting ↓)' : '(relaxing ↑)'}
        </text>

        <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          You have ~300 million alveoli — surface area of a tennis court
        </text>
      </svg>

      <div className="flex items-center justify-center gap-3 mt-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">Breathing rate:</span>
        {[0.5, 1, 2].map(r => (
          <button
            key={r}
            onClick={() => setBreathingRate(r)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              breathingRate === r
                ? 'bg-sky-500/30 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            {r === 0.5 ? 'Slow' : r === 1 ? 'Normal' : 'Exercise'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" /> O₂ (in)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" /> CO₂ (out)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-300" /> Lung tissue
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-700" /> Diaphragm
        </span>
      </div>
    </div>
  );
}
