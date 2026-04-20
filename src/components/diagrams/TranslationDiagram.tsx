import { useState, useEffect } from 'react';

// ── mRNA → Protein ───────────────────────────────────────────
// Animated translation. Ribosome slides along mRNA, reading
// codons (groups of 3). tRNA with matching anticodon delivers
// the correct amino acid. Amino acids chain up into a growing
// protein emerging from the ribosome.

const CODON_TABLE: Record<string, { aa: string; color: string }> = {
  AUG: { aa: 'Met', color: '#facc15' },
  GCC: { aa: 'Ala', color: '#34d399' },
  UAC: { aa: 'Tyr', color: '#60a5fa' },
  CCA: { aa: 'Pro', color: '#f472b6' },
  GGU: { aa: 'Gly', color: '#a78bfa' },
  UAA: { aa: 'STOP', color: '#ef4444' },
};

const MRNA_CODONS = ['AUG', 'GCC', 'UAC', 'CCA', 'GGU', 'UAA'];

export default function TranslationDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 580, H = 340;
  const cycle = tick % (MRNA_CODONS.length * 80);
  const codonIdx = Math.min(MRNA_CODONS.length - 1, Math.floor(cycle / 80));
  const withinCodon = (cycle % 80) / 80;

  // Ribosome position on mRNA
  const codonWidth = 60;
  const mrnaStartX = 60;
  const ribosomeX = mrnaStartX + codonIdx * codonWidth + codonWidth / 2 + withinCodon * codonWidth * 0.2;
  const ribosomeY = 180;

  // How many amino acids are chained so far
  const proteinLength = Math.min(codonIdx + (withinCodon > 0.5 ? 1 : 0), MRNA_CODONS.length - 1);

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50 dark:from-emerald-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          mRNA → Protein
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
            Codon {codonIdx + 1} / {MRNA_CODONS.length}
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
        aria-label="Animated translation — ribosome reading mRNA codons and building a protein">

        {/* mRNA strand */}
        <line x1={mrnaStartX - 20} y1={220} x2={mrnaStartX + MRNA_CODONS.length * codonWidth + 20} y2={220}
          stroke="#8b5cf6" strokeWidth="3" opacity="0.4" />

        {/* Codons */}
        {MRNA_CODONS.map((codon, i) => {
          const cx = mrnaStartX + i * codonWidth + codonWidth / 2;
          const isCurrent = i === codonIdx;
          const isDone = i < codonIdx;
          return (
            <g key={`c-${i}`}>
              {isCurrent && (
                <rect x={cx - 28} y={205} width={56} height={30} rx={4}
                  fill="#fbbf24" opacity="0.2" />
              )}
              {codon.split('').map((base, j) => (
                <g key={`b-${i}-${j}`}>
                  <circle cx={cx - 15 + j * 15} cy={220} r="7"
                    fill={isDone ? '#a78bfa' : isCurrent ? '#8b5cf6' : '#c4b5fd'}
                    opacity="0.95" />
                  <text x={cx - 15 + j * 15} y={224} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                    {base}
                  </text>
                </g>
              ))}
            </g>
          );
        })}

        {/* Ribosome */}
        <g transform={`translate(${ribosomeX}, ${ribosomeY})`}>
          {/* Large subunit */}
          <ellipse cx={0} cy={-8} rx={55} ry={35}
            fill="#64748b" stroke="#334155" strokeWidth="2" opacity="0.9" />
          {/* Small subunit */}
          <ellipse cx={0} cy={20} rx={50} ry={22}
            fill="#94a3b8" stroke="#475569" strokeWidth="2" opacity="0.9" />
          <text x={0} y={-35} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200" fontSize="9" fontWeight="600">
            Ribosome
          </text>
        </g>

        {/* tRNA delivering current amino acid — shown coming down into the ribosome */}
        {codonIdx < MRNA_CODONS.length && (
          <g transform={`translate(${ribosomeX + 20}, ${ribosomeY - 60 + withinCodon * 30})`}
            opacity={withinCodon > 0.8 ? 2 - withinCodon * 2 : 1}>
            {/* tRNA stem */}
            <line x1={0} y1={25} x2={0} y2={50} stroke="#d97706" strokeWidth="3" />
            {/* tRNA "cloverleaf" simplified as a blob */}
            <path d="M -12,5 Q -15,15 0,20 Q 15,15 12,5 Q 5,-5 0,0 Q -5,-5 -12,5 Z"
              fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* Amino acid attached on top */}
            <circle cx={0} cy={-8} r="10"
              fill={CODON_TABLE[MRNA_CODONS[codonIdx]]?.color || '#fbbf24'}
              stroke="#1e293b" strokeWidth="1.5" />
            <text x={0} y={-5} textAnchor="middle" fill="#1e293b" fontSize="7" fontWeight="bold">
              {CODON_TABLE[MRNA_CODONS[codonIdx]]?.aa || '?'}
            </text>
            <text x={0} y={65} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="7" fontWeight="600">
              tRNA
            </text>
          </g>
        )}

        {/* Growing protein chain (emerging from ribosome top-left) */}
        {Array.from({ length: proteinLength }, (_, i) => {
          const codon = MRNA_CODONS[i];
          const aa = CODON_TABLE[codon];
          if (!aa || aa.aa === 'STOP') return null;
          const x = ribosomeX - 80 - i * 22;
          const y = ribosomeY - 40 - i * 4;
          return (
            <g key={`aa-${i}`}>
              <circle cx={x} cy={y} r="12"
                fill={aa.color} stroke="#1e293b" strokeWidth="1.5" opacity="0.95" />
              <text x={x} y={y + 3} textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="bold">
                {aa.aa}
              </text>
              {/* Peptide bond to previous */}
              {i > 0 && (
                <line x1={x + 12} y1={y} x2={x + 10} y2={y - 4}
                  stroke="#475569" strokeWidth="2" />
              )}
            </g>
          );
        })}

        {/* Label arrows */}
        {codonIdx === 0 && withinCodon < 0.1 && (
          <text x={mrnaStartX + codonWidth / 2} y={260} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="600">
            Start codon (AUG = Met)
          </text>
        )}
        {codonIdx === MRNA_CODONS.length - 1 && (
          <text x={ribosomeX} y={260} textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="9" fontWeight="600">
            Stop codon → release protein
          </text>
        )}

        {/* Caption */}
        <text x={W / 2} y={H - 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">
          Ribosome reads 3 bases at a time (codon) → tRNA delivers matching amino acid → peptide bond forms
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" /> mRNA codons
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-500" /> Ribosome
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> tRNA (delivers amino acid)
        </span>
      </div>
    </div>
  );
}
