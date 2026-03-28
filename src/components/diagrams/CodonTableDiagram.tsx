export default function CodonTableDiagram() {
  // Simplified codon table: show key codons grouped by amino acid property
  const codons: { codon: string; aa: string; type: 'start' | 'stop' | 'nonpolar' | 'polar' | 'charged' }[] = [
    { codon: 'AUG', aa: 'Met', type: 'start' },
    { codon: 'UUU', aa: 'Phe', type: 'nonpolar' },
    { codon: 'UUA', aa: 'Leu', type: 'nonpolar' },
    { codon: 'GUU', aa: 'Val', type: 'nonpolar' },
    { codon: 'GCU', aa: 'Ala', type: 'nonpolar' },
    { codon: 'AUU', aa: 'Ile', type: 'nonpolar' },
    { codon: 'UCU', aa: 'Ser', type: 'polar' },
    { codon: 'ACU', aa: 'Thr', type: 'polar' },
    { codon: 'UAU', aa: 'Tyr', type: 'polar' },
    { codon: 'AAU', aa: 'Asn', type: 'polar' },
    { codon: 'CAA', aa: 'Gln', type: 'polar' },
    { codon: 'UGU', aa: 'Cys', type: 'polar' },
    { codon: 'GAU', aa: 'Asp', type: 'charged' },
    { codon: 'GAA', aa: 'Glu', type: 'charged' },
    { codon: 'AAA', aa: 'Lys', type: 'charged' },
    { codon: 'CGU', aa: 'Arg', type: 'charged' },
    { codon: 'CAU', aa: 'His', type: 'charged' },
    { codon: 'UGG', aa: 'Trp', type: 'nonpolar' },
    { codon: 'GGU', aa: 'Gly', type: 'nonpolar' },
    { codon: 'CCU', aa: 'Pro', type: 'nonpolar' },
    { codon: 'UAA', aa: 'Stop', type: 'stop' },
    { codon: 'UAG', aa: 'Stop', type: 'stop' },
    { codon: 'UGA', aa: 'Stop', type: 'stop' },
  ];

  const colorMap = {
    start: { bg: 'fill-emerald-200 dark:fill-emerald-800', text: 'fill-emerald-800 dark:fill-emerald-200' },
    stop: { bg: 'fill-red-200 dark:fill-red-800', text: 'fill-red-800 dark:fill-red-200' },
    nonpolar: { bg: 'fill-amber-100 dark:fill-amber-900/40', text: 'fill-amber-800 dark:fill-amber-300' },
    polar: { bg: 'fill-blue-100 dark:fill-blue-900/40', text: 'fill-blue-800 dark:fill-blue-300' },
    charged: { bg: 'fill-purple-100 dark:fill-purple-900/40', text: 'fill-purple-800 dark:fill-purple-300' },
  };

  const cols = 5;
  const cellW = 90;
  const cellH = 36;
  const startX = 25;
  const startY = 55;

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Simplified codon table">
        {/* Title */}
        <text x="250" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Genetic Code: Codons → Amino Acids
        </text>

        {/* Column headers */}
        <text x={startX + cellW / 2} y={startY - 5} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontWeight="bold">Codon</text>
        <text x={startX + cellW / 2} y={startY + 5} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">→ AA</text>
        {[1, 2, 3, 4].map(c => (
          <g key={c}>
            <text x={startX + c * (cellW + 5) + cellW / 2} y={startY - 5} textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontWeight="bold">Codon</text>
            <text x={startX + c * (cellW + 5) + cellW / 2} y={startY + 5} textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400" fontSize="10">→ AA</text>
          </g>
        ))}

        {/* Codon grid */}
        {codons.map((c, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * (cellW + 5);
          const y = startY + 15 + row * (cellH + 4);
          const colors = colorMap[c.type];

          return (
            <g key={c.codon + i}>
              <rect x={x} y={y} width={cellW} height={cellH} rx="5" className={colors.bg}
                stroke="currentColor" strokeWidth="0.5" opacity="0.9" />
              <text x={x + 30} y={y + 15} textAnchor="middle" className={colors.text} fontSize="12" fontWeight="bold" fontFamily="monospace">
                {c.codon}
              </text>
              <text x={x + 30} y={y + 29} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
                → {c.aa}
              </text>
              {c.type === 'start' && (
                <text x={x + 70} y={y + 22} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">START</text>
              )}
              {c.type === 'stop' && (
                <text x={x + 70} y={y + 22} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">STOP</text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(25, 360)">
          {[
            { label: 'Start', color: 'fill-emerald-300 dark:fill-emerald-700' },
            { label: 'Stop', color: 'fill-red-300 dark:fill-red-700' },
            { label: 'Nonpolar', color: 'fill-amber-200 dark:fill-amber-800' },
            { label: 'Polar', color: 'fill-blue-200 dark:fill-blue-800' },
            { label: 'Charged', color: 'fill-purple-200 dark:fill-purple-800' },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 95}, 0)`}>
              <rect x="0" y="0" width="14" height="14" rx="3" className={item.color} />
              <text x="18" y="12" className="fill-gray-600 dark:fill-gray-300" fontSize="10">{item.label}</text>
            </g>
          ))}
        </g>

        {/* Note */}
        <text x="250" y="395" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">
          Each codon = 3 mRNA bases. 64 codons encode 20 amino acids + Stop.
        </text>
      </svg>
    </div>
  );
}
