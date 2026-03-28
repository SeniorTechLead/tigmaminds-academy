export default function MutationTypesDiagram() {
  const baseColors: Record<string, string> = {
    A: 'fill-red-400 dark:fill-red-500',
    T: 'fill-blue-400 dark:fill-blue-500',
    C: 'fill-green-400 dark:fill-green-500',
    G: 'fill-yellow-400 dark:fill-yellow-500',
    X: 'fill-purple-400 dark:fill-purple-500',
  };

  const baseTextColors: Record<string, string> = {
    A: 'fill-red-900',
    T: 'fill-blue-900',
    C: 'fill-green-900',
    G: 'fill-yellow-900',
    X: 'fill-purple-900',
  };

  const renderBase = (base: string, x: number, y: number, highlight: boolean = false) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="30" height="28" rx="4"
        className={baseColors[base] || 'fill-gray-300'}
        stroke={highlight ? '#ef4444' : 'none'} strokeWidth={highlight ? 2.5 : 0} />
      <text x={x + 15} y={y + 18} textAnchor="middle"
        className={baseTextColors[base] || 'fill-gray-800'}
        fontSize="13" fontWeight="bold">{base}</text>
    </g>
  );

  const renderSequence = (bases: string[], y: number, highlights: number[] = []) => (
    <g>
      {bases.map((base, i) => renderBase(base, 140 + i * 36, y, highlights.includes(i)))}
    </g>
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 220" className="w-full max-w-lg mx-auto" role="img" aria-label="DNA mutation types diagram">
        {/* Title */}
        <text x="250" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Types of DNA Mutations</text>

        {/* Row 1: Normal */}
        <text x="10" y="52" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Normal:</text>
        {renderSequence(['A', 'T', 'C', 'G', 'A', 'T', 'C', 'G'], 35)}
        <text x="435" y="52" className="fill-green-600 dark:fill-green-400" fontSize="10">Original</text>

        {/* Row 2: Point Mutation */}
        <text x="10" y="100" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Point</text>
        <text x="10" y="112" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Mutation:</text>
        {renderSequence(['A', 'T', 'C', 'A', 'A', 'T', 'C', 'G'], 83, [3])}
        <text x="435" y="95" className="fill-red-600 dark:fill-red-400" fontSize="10">G → A</text>
        <text x="435" y="108" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(substitution)</text>

        {/* Row 3: Insertion */}
        <text x="10" y="150" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Insertion:</text>
        {(() => {
          const bases = ['A', 'T', 'C', 'X', 'G', 'A', 'T', 'C', 'G'];
          return bases.map((base, i) => renderBase(base, 130 + i * 34, 133, i === 3));
        })()}
        <text x="456" y="145" className="fill-red-600 dark:fill-red-400" fontSize="10">Extra X</text>
        <text x="456" y="158" className="fill-gray-500 dark:fill-gray-400" fontSize="10">inserted</text>

        {/* Row 4: Deletion */}
        <text x="10" y="198" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Deletion:</text>
        {(() => {
          const bases = ['A', 'T', 'C', 'A', 'T', 'C', 'G'];
          return bases.map((base, i) => renderBase(base, 140 + i * 36, 181, false));
        })()}
        {/* Gap indicator */}
        <rect x={140 + 3 * 36} y={181} width="30" height="28" rx="4" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
        <text x={140 + 3 * 36 + 15} y={199} textAnchor="middle" className="fill-red-400" fontSize="10">G</text>
        <text x="435" y="193" className="fill-red-600 dark:fill-red-400" fontSize="10">G removed</text>
        <text x="435" y="206" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(shifted)</text>
      </svg>
    </div>
  );
}
