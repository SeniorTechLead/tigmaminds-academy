import { useState } from 'react';

// ── Decode a Codon ────────────────────────────────────────────
// Interactive codon lookup. Type or click 3 DNA/RNA bases, see
// which amino acid they code for. Color-coded by amino acid
// class. Highlights start/stop codons.

const CODON_MAP: Record<string, string> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  UGU: 'Cys', UGC: 'Cys', UGA: 'STOP', UGG: 'Trp',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};

const AA_COLOR: Record<string, string> = {
  Phe: '#fb923c', Leu: '#fb923c', Ile: '#fb923c', Val: '#fb923c',
  Met: '#facc15', Ala: '#fb923c', Trp: '#fb923c',
  Ser: '#60a5fa', Thr: '#60a5fa', Asn: '#60a5fa', Gln: '#60a5fa', Cys: '#60a5fa', Tyr: '#60a5fa',
  Gly: '#4ade80', Pro: '#4ade80',
  Asp: '#f87171', Glu: '#f87171',
  Lys: '#a78bfa', Arg: '#a78bfa', His: '#a78bfa',
  STOP: '#ef4444',
};

const BASES = ['U', 'C', 'A', 'G'] as const;

export default function CodonTableDiagram() {
  const [codon, setCodon] = useState(['A', 'U', 'G']);
  const codonStr = codon.join('');
  const aa = CODON_MAP[codonStr] || '?';
  const aaColor = AA_COLOR[aa] || '#94a3b8';

  const setBase = (idx: number, base: string) => {
    const next = [...codon];
    next[idx] = base;
    setCodon(next);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">
        Decode a Codon
      </p>

      {/* The codon picker */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map(idx => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'}
              </span>
              <div className="flex flex-col gap-0.5">
                {BASES.map(b => (
                  <button key={b}
                    onClick={() => setBase(idx, b)}
                    className={`w-9 h-9 rounded font-mono font-bold text-sm transition ${
                      codon[idx] === b
                        ? 'bg-purple-500 text-white shadow'
                        : 'bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                    }`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current codon big */}
        <div className="text-3xl font-mono font-bold text-purple-700 dark:text-purple-300 tracking-wider">
          {codonStr}
        </div>

        {/* Arrow */}
        <div className="text-2xl text-gray-400">↓</div>

        {/* Amino acid result */}
        <div
          className="px-6 py-4 rounded-xl shadow-lg text-white font-bold text-2xl"
          style={{ backgroundColor: aaColor }}
        >
          {aa}
        </div>

        {/* Context hint */}
        {aa === 'Met' && codonStr === 'AUG' && (
          <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
            ⭐ AUG is the START codon — always the first codon of every protein.
          </p>
        )}
        {aa === 'STOP' && (
          <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold">
            ⛔ STOP codon — tells the ribosome to release the finished protein.
          </p>
        )}
      </div>

      {/* Facts */}
      <div className="mt-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-semibold text-blue-700 dark:text-blue-300">64 possible codons</span> code for just{' '}
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">20 amino acids</span> (plus stop signals) — so
          most amino acids have multiple codons. This <strong>redundancy</strong> protects against some mutations:
          if a single base changes but the codon still codes for the same amino acid, the protein is unaffected.
          This is called a <strong>silent mutation</strong>.
        </p>
      </div>
    </div>
  );
}
