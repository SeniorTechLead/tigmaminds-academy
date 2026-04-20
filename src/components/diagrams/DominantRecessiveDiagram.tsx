import { useState } from 'react';

// ── Pick Two Parents ──────────────────────────────────────────
// Interactive: choose genotypes for two parents (BB, Bb, bb)
// and see the possible offspring with trait ratios. Flowers
// turn purple or white based on the inherited genotype.

type Genotype = 'BB' | 'Bb' | 'bb';

function phenotype(g: Genotype): 'purple' | 'white' {
  return g === 'bb' ? 'white' : 'purple';
}

function offspring(p1: Genotype, p2: Genotype): { BB: number; Bb: number; bb: number } {
  const alleles1 = p1.split('');
  const alleles2 = p2.split('');
  const counts = { BB: 0, Bb: 0, bb: 0 };
  for (const a1 of alleles1) {
    for (const a2 of alleles2) {
      const combo = [a1, a2].sort((a, b) => (a === 'B' ? -1 : 1)).join('') as Genotype;
      // Normalize: BB, Bb, bB→Bb, bb
      const normalized = combo === 'bB' ? 'Bb' : combo;
      counts[normalized as Genotype]++;
    }
  }
  return counts;
}

function Flower({ gen, size = 40 }: { gen: Genotype; size?: number }) {
  const ph = phenotype(gen);
  const color = ph === 'purple' ? '#9333ea' : '#f1f5f9';
  const stroke = ph === 'purple' ? '#6b21a8' : '#94a3b8';

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Petals */}
      {[0, 72, 144, 216, 288].map(rot => (
        <ellipse key={rot} cx={20} cy={12} rx={6} ry={10}
          fill={color} stroke={stroke} strokeWidth="1"
          transform={`rotate(${rot} 20 20)`} opacity="0.9" />
      ))}
      {/* Center */}
      <circle cx={20} cy={20} r="4" fill="#fbbf24" />
      {/* Stem */}
      <line x1={20} y1={24} x2={20} y2={38} stroke="#15803d" strokeWidth="2" />
    </svg>
  );
}

export default function DominantRecessiveDiagram() {
  const [p1, setP1] = useState<Genotype>('Bb');
  const [p2, setP2] = useState<Genotype>('Bb');

  const counts = offspring(p1, p2);
  const total = counts.BB + counts.Bb + counts.bb;
  const purpleCount = counts.BB + counts.Bb;
  const whiteCount = counts.bb;

  // Produce actual offspring flower list (4 total)
  const offspringList: Genotype[] = [];
  for (const g of ['BB', 'Bb', 'bb'] as Genotype[]) {
    for (let i = 0; i < counts[g]; i++) offspringList.push(g);
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 via-slate-50 to-amber-50 dark:from-purple-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3">
        Pick Two Parents — See the Offspring
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        {/* Parent 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Flower gen={p1} size={56} />
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 font-mono font-bold">
            Parent 1: {p1}
          </div>
          <div className="flex gap-1">
            {(['BB', 'Bb', 'bb'] as Genotype[]).map(g => (
              <button key={g}
                onClick={() => setP1(g)}
                className={`text-xs px-2 py-0.5 rounded font-mono transition ${
                  p1 === g
                    ? 'bg-purple-500/30 text-purple-800 dark:text-purple-200 ring-1 ring-purple-500/50'
                    : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <span className="text-3xl text-gray-400">×</span>

        {/* Parent 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Flower gen={p2} size={56} />
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 font-mono font-bold">
            Parent 2: {p2}
          </div>
          <div className="flex gap-1">
            {(['BB', 'Bb', 'bb'] as Genotype[]).map(g => (
              <button key={g}
                onClick={() => setP2(g)}
                className={`text-xs px-2 py-0.5 rounded font-mono transition ${
                  p2 === g
                    ? 'bg-purple-500/30 text-purple-800 dark:text-purple-200 ring-1 ring-purple-500/50'
                    : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offspring grid */}
      <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 border border-white/10">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 text-center">
          Possible offspring (each combination equally likely):
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {offspringList.map((g, i) => (
            <div key={i} className="flex flex-col items-center">
              <Flower gen={g} size={48} />
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300 mt-1">{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phenotype ratio */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          <span className="font-semibold">Phenotype ratio:</span>{' '}
          <span className="text-purple-700 dark:text-purple-300 font-bold">{purpleCount}</span> purple :{' '}
          <span className="text-gray-600 dark:text-gray-400 font-bold">{whiteCount}</span> white
          {' '}<span className="text-xs text-gray-500">(out of {total})</span>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span className="font-bold">B</span> = dominant (purple allele). <span className="font-bold">b</span> = recessive (white).
          A flower needs <span className="font-mono">bb</span> to show the white trait.
        </p>
      </div>
    </div>
  );
}
