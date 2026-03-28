export default function TranscriptionDiagram() {
  const dnaTemplate = ['T', 'A', 'C', 'G', 'A', 'T', 'T', 'C', 'G', 'A', 'T', 'A'];
  const dnaCoding  = ['A', 'T', 'G', 'C', 'T', 'A', 'A', 'G', 'C', 'T', 'A', 'T'];
  const mRNA       = ['A', 'U', 'G', 'C', 'U', 'A', 'A', 'G', 'C', 'U', 'A', 'U'];

  const baseColor = (b: string) => {
    switch (b) {
      case 'A': return 'fill-red-400 dark:fill-red-500';
      case 'T': return 'fill-blue-400 dark:fill-blue-500';
      case 'U': return 'fill-amber-400 dark:fill-amber-500';
      case 'G': return 'fill-emerald-400 dark:fill-emerald-500';
      case 'C': return 'fill-purple-400 dark:fill-purple-500';
      default: return 'fill-gray-400';
    }
  };

  const sx = 60, bw = 32, bh = 22, gap = 2;

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 200" className="w-full max-w-lg mx-auto" role="img" aria-label="Transcription diagram showing RNA polymerase reading DNA template strand and building mRNA">
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Transcription: DNA → mRNA</text>

        {/* Direction arrow */}
        <line x1="60" y1="30" x2="450" y2="30" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" markerEnd="url(#txArrow)" />
        <text x="255" y="28" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">5' → 3' (mRNA direction)</text>

        {/* Coding strand (top) */}
        <text x="20" y="52" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">5'</text>
        {dnaCoding.map((b, i) => (
          <g key={`c${i}`}>
            <rect x={sx + i * (bw + gap)} y={40} width={bw} height={bh} rx="3" className={baseColor(b)} opacity="0.5" />
            <text x={sx + i * (bw + gap) + bw / 2} y={55} textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">{b}</text>
          </g>
        ))}
        <text x={sx + 12 * (bw + gap) + 8} y="52" className="fill-gray-500 dark:fill-gray-400" fontSize="10">3'</text>
        <text x={sx - 25} y="52" className="fill-gray-400 dark:fill-gray-500" fontSize="10">coding</text>

        {/* Template strand (middle) */}
        <text x="20" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">3'</text>
        {dnaTemplate.map((b, i) => (
          <g key={`t${i}`}>
            <rect x={sx + i * (bw + gap)} y={68} width={bw} height={bh} rx="3" className={baseColor(b)} />
            <text x={sx + i * (bw + gap) + bw / 2} y={83} textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">{b}</text>
          </g>
        ))}
        <text x={sx + 12 * (bw + gap) + 8} y="80" className="fill-gray-500 dark:fill-gray-400" fontSize="10">5'</text>
        <text x={sx - 25} y="80" className="fill-gray-400 dark:fill-gray-500" fontSize="10">template</text>

        {/* Hydrogen bonds between strands */}
        {dnaTemplate.map((_, i) => (
          <line key={`hb${i}`} x1={sx + i * (bw + gap) + bw / 2} y1={62} x2={sx + i * (bw + gap) + bw / 2} y2={68} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        ))}

        {/* RNA polymerase bubble */}
        <ellipse cx={sx + 5 * (bw + gap) + bw / 2} cy={105} rx="55" ry="18" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400" strokeWidth="1.5" />
        <text x={sx + 5 * (bw + gap) + bw / 2} y={109} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">RNA Polymerase</text>

        {/* Arrows from template to mRNA */}
        {[3, 4, 5, 6, 7].map(i => (
          <line key={`ra${i}`} x1={sx + i * (bw + gap) + bw / 2} y1={90} x2={sx + i * (bw + gap) + bw / 2} y2={130}
            className="stroke-amber-300 dark:stroke-amber-500" strokeWidth="0.8" strokeDasharray="2,2" />
        ))}

        {/* mRNA strand (growing) */}
        <text x="20" y="148" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">5'</text>
        {mRNA.slice(0, 8).map((b, i) => (
          <g key={`m${i}`}>
            <rect x={sx + i * (bw + gap)} y={136} width={bw} height={bh} rx="3" className={baseColor(b)} opacity={i >= 6 ? 0.4 : 0.8} />
            <text x={sx + i * (bw + gap) + bw / 2} y={151} textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">{b}</text>
          </g>
        ))}
        <text x={sx - 25} y="148" className="fill-amber-500 dark:fill-amber-400" fontSize="10" fontWeight="bold">mRNA</text>

        {/* Complementary base pairing note */}
        <text x="250" y="178" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Template bases pair: A→U, T→A, G→C, C→G (note: U replaces T in RNA)
        </text>

        {/* Legend */}
        {[['A', 'Adenine'], ['U', 'Uracil'], ['G', 'Guanine'], ['C', 'Cytosine'], ['T', 'Thymine']].map(([b, name], i) => (
          <g key={`leg${i}`}>
            <rect x={60 + i * 85} y={188} width={14} height={10} rx="2" className={baseColor(b)} />
            <text x={78 + i * 85} y={197} className="fill-gray-500 dark:fill-gray-400" fontSize="10">{b} = {name}</text>
          </g>
        ))}

        <defs>
          <marker id="txArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-gray-300 dark:fill-gray-600" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
