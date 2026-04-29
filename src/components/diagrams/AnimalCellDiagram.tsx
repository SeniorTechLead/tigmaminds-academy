import { useState, useEffect } from 'react';

type OrganelleKey = 'nucleus' | 'mitochondria' | 'er' | 'golgi' | 'ribosome' | 'lysosome' | 'membrane' | null;

const INFO: Record<string, { title: string; desc: string; color: string }> = {
  nucleus: {
    title: 'Nucleus',
    desc: 'The command centre. Contains your DNA — 2 metres of it coiled into a compartment about 6 μm wide. Every protein your cell ever makes starts from instructions read out of here.',
    color: '#8b5cf6',
  },
  mitochondria: {
    title: 'Mitochondria',
    desc: 'Power plants. Burn glucose with O₂ to generate ATP (energy currency). A muscle cell can have 2,000+ mitochondria. They have their own DNA — evidence they were once free-living bacteria, absorbed billions of years ago.',
    color: '#ef4444',
  },
  er: {
    title: 'Endoplasmic Reticulum (ER)',
    desc: 'Folded membrane network. Rough ER (studded with ribosomes) makes proteins destined for secretion or the membrane. Smooth ER makes lipids and detoxifies chemicals.',
    color: '#f59e0b',
  },
  golgi: {
    title: 'Golgi Apparatus',
    desc: 'Post office. Receives proteins from the ER, modifies them (adds tags, sugars), packages them into vesicles, and ships them to their destinations.',
    color: '#06b6d4',
  },
  ribosome: {
    title: 'Ribosomes',
    desc: 'Protein factories. Each one reads mRNA and assembles amino acids into proteins at ~20 per second. A single cell has millions.',
    color: '#be185d',
  },
  lysosome: {
    title: 'Lysosomes',
    desc: 'Recycling centres. Contain 60+ digestive enzymes at pH 4.5. Break down old organelles, engulfed bacteria, and cellular debris. Failure → lysosomal storage diseases.',
    color: '#14b8a6',
  },
  membrane: {
    title: 'Cell Membrane',
    desc: 'A phospholipid bilayer with embedded proteins. Controls what enters and exits. 7 nm thick but infinitely important — every cell needs this boundary to exist.',
    color: '#fbbf24',
  },
};

export default function AnimalCellDiagram() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<OrganelleKey>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, []);

  const W = 520, H = 420;
  const cx = 260, cy = 210;

  const opacity = (key: OrganelleKey) =>
    selected === null ? 0.9 : selected === key ? 1 : 0.3;
  const isActive = (key: OrganelleKey) => selected === key;

  const mitos = [
    { x: 140, y: 150 }, { x: 370, y: 140 }, { x: 150, y: 290 },
    { x: 380, y: 280 }, { x: 250, y: 340 },
  ];

  const ribosomePositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const r = 110 + (i % 3) * 8;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.85 };
  });

  const cytoDots = Array.from({ length: 25 }, (_, i) => {
    const t = (tick * 0.03 + i * 0.9) % 100;
    const ai = i * 47;
    return {
      x: cx + Math.cos(ai) * 140 + Math.sin(t + i) * 8,
      y: cy + Math.sin(ai) * 120 + Math.cos(t + i) * 8,
      size: 0.8 + (i % 3) * 0.3,
    };
  });

  return (
    <div className="bg-gradient-to-b from-purple-50 via-slate-50 to-rose-50 dark:from-purple-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
          Click Inside a Cell
        </p>
        {selected && (
          <button
            onClick={() => setSelected(null)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
          aria-label="Animated animal cell — click organelles to learn their functions">

          <g onClick={() => setSelected(selected === 'membrane' ? null : 'membrane')}
            className="cursor-pointer" opacity={opacity('membrane')}>
            <ellipse cx={cx} cy={cy} rx={220} ry={180}
              fill="#fef9c3" stroke="#fbbf24" strokeWidth={isActive('membrane') ? 6 : 4}
              opacity="0.4"
              style={{ filter: isActive('membrane') ? 'drop-shadow(0 0 10px #fbbf24)' : 'none' }} />
            <ellipse cx={cx} cy={cy} rx={215} ry={175}
              fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,3" opacity="0.5" />
          </g>

          {cytoDots.map((d, i) => (
            <circle key={`cd-${i}`} cx={d.x} cy={d.y} r={d.size}
              fill="#94a3b8" opacity="0.3" />
          ))}

          <g onClick={() => setSelected(selected === 'er' ? null : 'er')}
            className="cursor-pointer" opacity={opacity('er')}>
            <path d={`M ${cx - 80},${cy - 60} Q ${cx - 30},${cy - 100} ${cx + 60},${cy - 70} Q ${cx + 130},${cy - 30} ${cx + 100},${cy + 30} Q ${cx + 50},${cy + 80} ${cx - 30},${cy + 70}`}
              fill="none" stroke="#f59e0b" strokeWidth={isActive('er') ? 10 : 7}
              strokeLinecap="round" opacity="0.7"
              style={{ filter: isActive('er') ? 'drop-shadow(0 0 6px #fbbf24)' : 'none' }} />
            <path d={`M ${cx + 40},${cy + 50} Q ${cx + 10},${cy + 90} ${cx - 60},${cy + 70}`}
              fill="none" stroke="#f59e0b" strokeWidth={isActive('er') ? 10 : 7}
              strokeLinecap="round" opacity="0.7" />
          </g>

          <g onClick={() => setSelected(selected === 'ribosome' ? null : 'ribosome')}
            className="cursor-pointer" opacity={opacity('ribosome')}>
            {ribosomePositions.map((p, i) => (
              <circle key={`r-${i}`} cx={p.x} cy={p.y} r={isActive('ribosome') ? 4 : 3}
                fill="#be185d"
                style={{ filter: isActive('ribosome') ? 'drop-shadow(0 0 4px #ec4899)' : 'none' }} />
            ))}
          </g>

          <g onClick={() => setSelected(selected === 'golgi' ? null : 'golgi')}
            className="cursor-pointer" opacity={opacity('golgi')}>
            {[0, 1, 2, 3].map(i => (
              <ellipse key={`g-${i}`}
                cx={cx - 120} cy={cy + 80 + i * 8}
                rx={30 - i * 2} ry={4}
                fill="#06b6d4" opacity="0.8"
                stroke={isActive('golgi') ? '#06b6d4' : 'none'}
                strokeWidth={isActive('golgi') ? 2 : 0}
                style={{ filter: isActive('golgi') ? 'drop-shadow(0 0 6px #22d3ee)' : 'none' }} />
            ))}
          </g>

          <g onClick={() => setSelected(selected === 'lysosome' ? null : 'lysosome')}
            className="cursor-pointer" opacity={opacity('lysosome')}>
            {[{ x: 90, y: 220 }, { x: 420, y: 200 }, { x: 310, y: 80 }].map((p, i) => (
              <circle key={`ls-${i}`}
                cx={p.x + Math.sin(tick * 0.05 + i * 2) * 3}
                cy={p.y + Math.cos(tick * 0.06 + i * 2) * 3}
                r={isActive('lysosome') ? 9 : 7}
                fill="#14b8a6" stroke="#0f766e" strokeWidth="1.5" opacity="0.9"
                style={{ filter: isActive('lysosome') ? 'drop-shadow(0 0 6px #2dd4bf)' : 'none' }} />
            ))}
          </g>

          <g onClick={() => setSelected(selected === 'mitochondria' ? null : 'mitochondria')}
            className="cursor-pointer" opacity={opacity('mitochondria')}>
            {mitos.map((m, i) => {
              const drift = Math.sin(tick * 0.03 + i) * 4;
              return (
                <g key={`m-${i}`}>
                  <ellipse cx={m.x + drift} cy={m.y} rx={22} ry={10}
                    fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" opacity="0.9"
                    style={{ filter: isActive('mitochondria') ? 'drop-shadow(0 0 6px #ef4444)' : 'none' }} />
                  {[-10, -4, 2, 8].map((cx2, j) => (
                    <line key={`c-${i}-${j}`}
                      x1={m.x + drift + cx2} y1={m.y - 7}
                      x2={m.x + drift + cx2} y2={m.y + 7}
                      stroke="#991b1b" strokeWidth="1" opacity="0.5" />
                  ))}
                </g>
              );
            })}
          </g>

          <g onClick={() => setSelected(selected === 'nucleus' ? null : 'nucleus')}
            className="cursor-pointer" opacity={opacity('nucleus')}>
            <circle cx={cx} cy={cy} r={55 + Math.sin(tick * 0.05) * 1.5}
              fill="#c4b5fd" stroke="#6d28d9" strokeWidth={isActive('nucleus') ? 3 : 2}
              opacity="0.8"
              style={{ filter: isActive('nucleus') ? 'drop-shadow(0 0 10px #a78bfa)' : 'none' }} />
            <circle cx={cx - 8} cy={cy - 5} r="12"
              fill="#7c3aed" opacity="0.7" />
            <path d={`M ${cx - 30},${cy + 15} Q ${cx - 10},${cy + 5} ${cx + 15},${cy + 20} Q ${cx + 35},${cy + 30} ${cx + 20},${cy - 10}`}
              fill="none" stroke="#5b21b6" strokeWidth="1.5" opacity="0.5" />
            <path d={`M ${cx - 25},${cy - 20} Q ${cx},${cy - 30} ${cx + 25},${cy - 15}`}
              fill="none" stroke="#5b21b6" strokeWidth="1.5" opacity="0.5" />
          </g>

          {!selected && (
            <text x={cx} y={25} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
              ↑ Click any organelle to explore
            </text>
          )}
        </svg>

        <div className="flex-1 min-w-[200px] max-w-sm">
          {selected ? (
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-4 border border-white/10 h-full">
              <h3 className="text-lg font-bold mb-2" style={{ color: INFO[selected].color }}>
                {INFO[selected].title}
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {INFO[selected].desc}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8 h-full flex items-center justify-center">
              Click a part of the cell to explore its function
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
