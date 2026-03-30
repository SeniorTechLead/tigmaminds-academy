export default function TranslationDiagram() {
  const codons = [
    { mRNA: ['A', 'U', 'G'], aa: 'Met', tRNA: ['U', 'A', 'C'] },
    { mRNA: ['G', 'C', 'U'], aa: 'Ala', tRNA: ['C', 'G', 'A'] },
    { mRNA: ['A', 'A', 'G'], aa: 'Lys', tRNA: ['U', 'U', 'C'] },
    { mRNA: ['U', 'U', 'U'], aa: 'Phe', tRNA: ['A', 'A', 'A'] },
    { mRNA: ['G', 'A', 'C'], aa: 'Asp', tRNA: ['C', 'U', 'G'] },
  ];

  const sx = 30, bw = 16, codonW = bw * 3 + 4, gap = 6;

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 295" className="w-full max-w-lg mx-auto" role="img" aria-label="Translation diagram showing ribosome on mRNA with tRNA bringing amino acids to build a polypeptide chain">
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Translation: mRNA → Protein</text>

        {/* mRNA strand */}
        <rect x={sx - 5} y={155} width={codons.length * (codonW + gap) + 10} height={24} rx="4" className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400" strokeWidth="1" />
        <text x={sx - 12} y={170} className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="bold">5'</text>
        {codons.map((codon, ci) => (
          <g key={`c${ci}`}>
            {codon.mRNA.map((base, bi) => (
              <text key={`mb${ci}${bi}`}
                x={sx + ci * (codonW + gap) + bi * (bw) + bw / 2}
                y={171}
                textAnchor="middle"
                className="fill-amber-700 dark:fill-amber-300"
                fontSize="11"
                fontWeight="bold"
              >
                {base}
              </text>
            ))}
          </g>
        ))}
        <text x={sx + codons.length * (codonW + gap) + 2} y={170} className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="bold">3'</text>
        <text x={sx + codons.length * (codonW + gap) / 2} y={190} textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="10">mRNA</text>

        {/* Ribosome (large oval around current codons being read) */}
        <ellipse cx={sx + 2 * (codonW + gap) + codonW / 2} cy={140} rx="55" ry="45" className="fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" opacity="0.5" />
        <text x={sx + 2 * (codonW + gap) + codonW / 2} y={108} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Ribosome</text>

        {/* tRNA molecules bringing amino acids (showing 2 in the ribosome) */}
        {[1, 2].map(idx => {
          const codon = codons[idx];
          const cx = sx + idx * (codonW + gap) + codonW / 2;
          return (
            <g key={`trna${idx}`}>
              {/* tRNA body (inverted T shape) */}
              <path d={`M ${cx},${155} L ${cx},${130} L ${cx - 12},${118} M ${cx},${130} L ${cx + 12},${118}`}
                fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
              {/* Anticodon */}
              <text x={cx} y={148} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="bold">
                {codon.tRNA.join('')}
              </text>
              <text x={cx} y={140} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">anticodon</text>
            </g>
          );
        })}

        {/* Amino acids on tRNAs */}
        {[1, 2].map(idx => {
          const codon = codons[idx];
          const cx = sx + idx * (codonW + gap) + codonW / 2;
          return (
            <g key={`aa${idx}`}>
              <circle cx={cx} cy={112} r="12" className="fill-blue-300 dark:fill-blue-600 stroke-blue-500" strokeWidth="1" />
              <text x={cx} y={116} textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="10" fontWeight="bold">{codon.aa}</text>
            </g>
          );
        })}

        {/* Growing polypeptide chain */}
        <text x="40" y="55" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Polypeptide chain:</text>
        {codons.slice(0, 3).map((codon, i) => {
          const px = 60 + i * 45;
          return (
            <g key={`poly${i}`}>
              <rect x={px} y={60} width={38} height={22} rx="11" className="fill-blue-200 dark:fill-blue-700 stroke-blue-400" strokeWidth="1" />
              <text x={px + 19} y={75} textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="bold">{codon.aa}</text>
              {i < 2 && (
                <line x1={px + 38} y1={71} x2={px + 45} y2={71} className="stroke-blue-400" strokeWidth="1.5" />
              )}
            </g>
          );
        })}
        <text x="200" y="75" className="fill-gray-500 dark:fill-gray-400" fontSize="10">...</text>

        {/* Codon-anticodon matching label */}
        <rect x="300" y="42" width="180" height="55" rx="6" className="fill-gray-100 dark:fill-gray-800" />
        <text x="390" y="58" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Codon–Anticodon Match</text>
        <text x="390" y="72" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">mRNA codon: GCU</text>
        <text x="390" y="86" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">tRNA anticodon: CGA</text>

        {/* Direction arrow */}
        <line x1="30" y1="210" x2="280" y2="210" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" markerEnd="url(#tlArrow)" />
        <text x="155" y="225" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Ribosome moves along mRNA →</text>

        <text x="250" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Each codon (3 bases) codes for one amino acid</text>

        <defs>
          <marker id="tlArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-gray-300 dark:fill-gray-600" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
