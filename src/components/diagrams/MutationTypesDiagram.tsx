import { useState } from 'react';

// ── One Letter Changes Everything ────────────────────────────
// Interactive mutation explorer. Show a DNA sequence. Apply
// different mutation types (substitution, insertion, deletion,
// frameshift) and see how the resulting protein changes. Each
// mutation highlights the altered codon(s).

type MutationType = 'none' | 'substitution' | 'insertion' | 'deletion' | 'silent';

const ORIGINAL_DNA = 'ATG-GCT-TAC-CCA-GGT-TGA';
const ORIGINAL_PROTEIN = ['Met', 'Ala', 'Tyr', 'Pro', 'Gly', 'STOP'];

const MUTATIONS: Record<MutationType, {
  label: string;
  dna: string;
  protein: string[];
  highlight: number[]; // codon indices affected
  effect: string;
}> = {
  none: {
    label: 'Original sequence',
    dna: ORIGINAL_DNA,
    protein: ORIGINAL_PROTEIN,
    highlight: [],
    effect: 'Normal protein: Met-Ala-Tyr-Pro-Gly (then stop).',
  },
  silent: {
    label: 'Silent mutation (synonymous)',
    dna: 'ATG-GCC-TAC-CCA-GGT-TGA',
    protein: ['Met', 'Ala', 'Tyr', 'Pro', 'Gly', 'STOP'],
    highlight: [1],
    effect: 'GCT → GCC. Still codes for Alanine. Protein unchanged — the genetic code is redundant.',
  },
  substitution: {
    label: 'Missense substitution',
    dna: 'ATG-GCT-CAC-CCA-GGT-TGA',
    protein: ['Met', 'Ala', 'His', 'Pro', 'Gly', 'STOP'],
    highlight: [2],
    effect: 'TAC → CAC. Tyrosine becomes Histidine. One amino acid changes. Sickle cell anaemia is this kind of mutation.',
  },
  insertion: {
    label: 'Insertion (frameshift)',
    dna: 'ATG-AGC-TTA-CCC-AGG-TTG-A',
    protein: ['Met', 'Ser', 'Leu', 'Pro', 'Arg', 'Leu'],
    highlight: [1, 2, 3, 4, 5],
    effect: 'One extra base shifts the reading frame. Every downstream codon is different. The protein is completely broken.',
  },
  deletion: {
    label: 'Deletion (frameshift)',
    dna: 'ATG-CTT-ACC-CAG-GTT-GA',
    protein: ['Met', 'Leu', 'Thr', 'Gln', 'Val'],
    highlight: [1, 2, 3, 4],
    effect: 'One base removed shifts the frame. All downstream codons change. Often creates a premature stop, truncating the protein.',
  },
};

export default function MutationTypesDiagram() {
  const [mutation, setMutation] = useState<MutationType>('none');
  const data = MUTATIONS[mutation];
  const codons = data.dna.split('-');

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-rose-50 dark:from-blue-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">
        One Letter Changes Everything
      </p>

      {/* Mutation selector */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
        {(['none', 'silent', 'substitution', 'insertion', 'deletion'] as MutationType[]).map(m => (
          <button key={m}
            onClick={() => setMutation(m)}
            className={`text-xs px-3 py-1 rounded font-medium transition ${
              mutation === m
                ? 'bg-blue-500/30 text-blue-800 dark:text-blue-200 ring-1 ring-blue-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            {MUTATIONS[m].label}
          </button>
        ))}
      </div>

      {/* DNA row */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">DNA (codons)</p>
        <div className="flex flex-wrap gap-2 justify-center font-mono">
          {codons.map((codon, i) => {
            const highlighted = data.highlight.includes(i);
            return (
              <span key={i}
                className={`px-2.5 py-1.5 rounded-md text-sm font-bold ${
                  highlighted
                    ? 'bg-rose-500/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500 animate-pulse'
                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100'
                }`}>
                {codon}
              </span>
            );
          })}
        </div>
      </div>

      {/* Arrow */}
      <div className="text-center text-gray-400 text-xl mb-2">↓</div>

      {/* Protein row */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Resulting protein (amino acids)</p>
        <div className="flex flex-wrap gap-2 justify-center font-mono">
          {data.protein.map((aa, i) => {
            const highlighted = data.highlight.includes(i);
            const isStop = aa === 'STOP';
            return (
              <span key={i}
                className={`px-2.5 py-1.5 rounded-md text-sm font-bold ${
                  isStop
                    ? 'bg-red-600 text-white'
                    : highlighted
                    ? 'bg-rose-500/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500'
                    : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100'
                }`}>
                {aa}
              </span>
            );
          })}
        </div>
      </div>

      {/* Effect */}
      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-white/10">
        <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mb-1 uppercase tracking-wider">Effect</p>
        <p className="text-sm text-gray-800 dark:text-gray-200">{data.effect}</p>
      </div>
    </div>
  );
}
