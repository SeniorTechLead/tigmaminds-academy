import { useState, useEffect } from 'react';

// ── 2 Metres in a Tiny Box ───────────────────────────────────
// Animated zoom-in showing how DNA packs into chromosomes:
// DNA double helix → wraps histones (nucleosomes) → coils into
// chromatin fibre → supercoils into a chromosome.
// Step through each level of organization with a "zoom" control.

type Level = 0 | 1 | 2 | 3 | 4;
const LEVELS: { label: string; scale: string; desc: string }[] = [
  { label: 'Chromosome', scale: '1,400 nm', desc: 'The final X-shape you see in a dividing cell. 1 of 46 in humans.' },
  { label: 'Condensed chromatin', scale: '700 nm', desc: 'Loops of 30-nm fibres folded into rosettes, packed tight.' },
  { label: '30-nm fibre', scale: '30 nm', desc: 'Nucleosomes coil together into a thicker "solenoid" fibre.' },
  { label: 'Beads on a string', scale: '11 nm', desc: 'DNA wraps around protein spools called histones — 147 bp per bead.' },
  { label: 'DNA double helix', scale: '2 nm', desc: 'Two sugar-phosphate strands held together by A-T and G-C base pairs.' },
];

export default function ChromosomeDiagram() {
  const [level, setLevel] = useState<Level>(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, []);

  const W = 540, H = 380;
  const cx = W / 2;
  const cy = H / 2 - 10;

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-purple-50 to-rose-50 dark:from-indigo-950 dark:via-purple-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
          2 Metres in a Tiny Box
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLevel(l => Math.max(0, l - 1) as Level)}
            disabled={level === 0}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition disabled:opacity-40"
          >
            ← Zoom out
          </button>
          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-mono px-2">
            Level {level + 1} / 5
          </span>
          <button
            onClick={() => setLevel(l => Math.min(4, l + 1) as Level)}
            disabled={level === 4}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition disabled:opacity-40"
          >
            Zoom in →
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated chromosome structure — zoom in to see how DNA packs into a chromosome">

        {/* Level 0: Full chromosome (X shape) */}
        {level === 0 && (
          <g>
            <g transform={`translate(${cx}, ${cy})`}>
              {/* Left chromatid */}
              <rect x={-30} y={-70} width={20} height={55} rx={8}
                fill="#6366f1" transform="rotate(15)" />
              <rect x={-30} y={15} width={20} height={55} rx={8}
                fill="#6366f1" transform="rotate(-15)" />
              {/* Right chromatid */}
              <rect x={10} y={-70} width={20} height={55} rx={8}
                fill="#8b5cf6" transform="rotate(-15)" />
              <rect x={10} y={15} width={20} height={55} rx={8}
                fill="#8b5cf6" transform="rotate(15)" />
              {/* Centromere */}
              <circle cx={0} cy={0} r={6} fill="#1e293b" />
              {/* Bands */}
              {[-50, -30, 20, 45].map((y, i) => (
                <line key={`b-${i}`}
                  x1={-24} y1={y} x2={24} y2={y}
                  stroke="#312e81" strokeWidth="2" opacity="0.4" />
              ))}
            </g>
            <text x={cx} y={cy + 110} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="10" opacity="0.8">
              Chromosome 1 of 46 in a human cell
            </text>
          </g>
        )}

        {/* Level 1: Condensed chromatin (rosette loops) */}
        {level === 1 && (
          <g>
            <g transform={`translate(${cx}, ${cy})`}>
              {Array.from({ length: 16 }, (_, i) => {
                const angle = (i / 16) * Math.PI * 2;
                const r1 = 50, r2 = 95;
                const midR = 72;
                const midA = angle + 0.2;
                return (
                  <path key={`loop-${i}`}
                    d={`M ${Math.cos(angle) * r1},${Math.sin(angle) * r1}
                       Q ${Math.cos(midA) * midR * 1.5},${Math.sin(midA) * midR * 1.5}
                         ${Math.cos(angle + 0.4) * r1},${Math.sin(angle + 0.4) * r1}`}
                    fill="none" stroke="#6366f1" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
                );
              })}
              <circle cx={0} cy={0} r={18} fill="#4338ca" opacity="0.6" />
            </g>
            <text x={cx} y={cy + 130} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="10" opacity="0.8">
              Looped rosette structure — each loop holds thousands of genes
            </text>
          </g>
        )}

        {/* Level 2: 30-nm fibre */}
        {level === 2 && (
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Solenoid — a coiled spring */}
            {Array.from({ length: 14 }, (_, i) => {
              const y = -90 + i * 13;
              const offset = Math.sin(i * 0.8) * 20;
              return (
                <g key={`coil-${i}`}>
                  <ellipse cx={offset} cy={y} rx={40} ry={8}
                    fill="none" stroke="#8b5cf6" strokeWidth="2.5" opacity="0.7" />
                  {/* Nucleosome beads on the coil */}
                  {[-30, -10, 10, 30].map((bx, j) => (
                    <circle key={`ns-${i}-${j}`}
                      cx={offset + bx} cy={y}
                      r="4" fill="#a855f7" opacity="0.9" />
                  ))}
                </g>
              );
            })}
            <text x={0} y={110} textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" opacity="0.8">
              Solenoid — nucleosomes coiled into a thick fibre
            </text>
          </g>
        )}

        {/* Level 3: Beads on a string (nucleosomes) */}
        {level === 3 && (
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Wavy DNA string with histone beads */}
            <path d={`M -200,20 Q -170,-20 -140,20 Q -110,40 -80,0 Q -50,-40 -20,10 Q 10,40 40,-10 Q 70,-40 100,20 Q 130,40 160,-5 Q 190,-40 200,0`}
              fill="none" stroke="#a78bfa" strokeWidth="3" opacity="0.7" />
            {/* Histone beads (octamer) */}
            {[
              { x: -150, y: 10 }, { x: -80, y: 0 }, { x: -20, y: 10 },
              { x: 40, y: -10 }, { x: 100, y: 20 }, { x: 160, y: -5 },
            ].map((b, i) => (
              <g key={`h-${i}`}>
                {/* Histone core */}
                <circle cx={b.x} cy={b.y} r="13"
                  fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.5" opacity="0.9" />
                {/* DNA wrap hint — arc around it */}
                <ellipse cx={b.x} cy={b.y} rx={18} ry={10}
                  fill="none" stroke="#4338ca" strokeWidth="1.2" opacity="0.5" />
              </g>
            ))}
            <text x={0} y={-80} textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" opacity="0.8">
              DNA wraps around histone proteins (beads)
            </text>
            <text x={0} y={90} textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="9" opacity="0.7">
              Each bead = 147 base pairs of DNA wrapped around 8 histone proteins
            </text>
          </g>
        )}

        {/* Level 4: DNA double helix */}
        {level === 4 && (
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Two strands of the helix with phase shift */}
            {Array.from({ length: 18 }, (_, i) => {
              const y = -130 + i * 15;
              const phase = tick * 0.08;
              const x1 = Math.sin(y * 0.04 + phase) * 40;
              const x2 = -x1;
              return (
                <g key={`h-${i}`}>
                  {/* Base pair */}
                  <line x1={x1} y1={y} x2={x2} y2={y}
                    stroke={i % 2 === 0 ? '#f59e0b' : '#10b981'} strokeWidth="2.5" opacity="0.8" />
                  {/* Base letters */}
                  <text x={x1 + (x1 < 0 ? -8 : 8)} y={y + 3}
                    className="fill-amber-600 dark:fill-amber-300" fontSize="8" fontWeight="bold"
                    textAnchor={x1 < 0 ? 'end' : 'start'}>
                    {i % 4 === 0 ? 'A' : i % 4 === 1 ? 'T' : i % 4 === 2 ? 'G' : 'C'}
                  </text>
                  <text x={x2 + (x2 < 0 ? -8 : 8)} y={y + 3}
                    className="fill-emerald-600 dark:fill-emerald-300" fontSize="8" fontWeight="bold"
                    textAnchor={x2 < 0 ? 'end' : 'start'}>
                    {i % 4 === 0 ? 'T' : i % 4 === 1 ? 'A' : i % 4 === 2 ? 'C' : 'G'}
                  </text>
                </g>
              );
            })}
            {/* Backbones */}
            <path d={Array.from({ length: 40 }, (_, i) => {
              const y = -130 + i * 7;
              const x = Math.sin(y * 0.04 + tick * 0.08) * 40;
              return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ')} fill="none" stroke="#6d28d9" strokeWidth="3" />
            <path d={Array.from({ length: 40 }, (_, i) => {
              const y = -130 + i * 7;
              const x = -Math.sin(y * 0.04 + tick * 0.08) * 40;
              return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="3" />

            <text x={0} y={160} textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" opacity="0.8">
              The double helix — 2 nm wide, ~2m long per cell
            </text>
          </g>
        )}

        {/* Info bar at bottom */}
        <g transform={`translate(0, ${H - 60})`}>
          <rect x={0} y={0} width={W} height={60}
            fill="#f8fafc" className="dark:fill-slate-800" opacity="0.8" />
          <text x={cx} y={20} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="12" fontWeight="bold">
            {LEVELS[level].label} <tspan className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="normal">({LEVELS[level].scale})</tspan>
          </text>
          <text x={cx} y={38} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="9">
            {LEVELS[level].desc}
          </text>
          {/* Level dots */}
          <g transform={`translate(${cx - 36}, 52)`}>
            {[0, 1, 2, 3, 4].map(i => (
              <circle key={`ld-${i}`} cx={i * 18} cy={0} r={3}
                fill={i === level ? '#6366f1' : '#cbd5e1'} className={i !== level ? 'dark:fill-gray-600' : ''} />
            ))}
          </g>
        </g>
      </svg>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        Uncoil the DNA from one of your cells and it would stretch <strong>2 metres</strong> —
        all packed into a space 6 micrometres wide.
      </p>
    </div>
  );
}
