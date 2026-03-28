export default function PeriodicTableOverviewDiagram() {
  // Color map for element categories
  const colors: Record<string, { fill: string; label: string }> = {
    alkali:     { fill: 'fill-red-400 dark:fill-red-500',       label: 'Alkali metals' },
    alkaline:   { fill: 'fill-orange-400 dark:fill-orange-500', label: 'Alkaline earth' },
    transition: { fill: 'fill-yellow-400 dark:fill-yellow-500', label: 'Transition metals' },
    nonmetal:   { fill: 'fill-green-400 dark:fill-green-500',   label: 'Nonmetals' },
    halogen:    { fill: 'fill-cyan-400 dark:fill-cyan-500',     label: 'Halogens' },
    noble:      { fill: 'fill-purple-400 dark:fill-purple-500', label: 'Noble gases' },
    metalloid:  { fill: 'fill-pink-400 dark:fill-pink-500',     label: 'Metalloids' },
    postTrans:  { fill: 'fill-blue-300 dark:fill-blue-500',     label: 'Post-transition' },
    lanthanide: { fill: 'fill-teal-400 dark:fill-teal-500',     label: 'Lanthanides' },
    actinide:   { fill: 'fill-lime-400 dark:fill-lime-500',     label: 'Actinides' },
  };

  const cellW = 28, cellH = 22, offsetX = 24, offsetY = 30;

  // Simplified grid: [period (1-indexed), group (1-indexed), category]
  // Only key positions to show the shape of the table
  type Cell = [number, number, string];
  const cells: Cell[] = [
    // Period 1
    [1,1,'nonmetal'], [1,18,'noble'],
    // Period 2
    [2,1,'alkali'], [2,2,'alkaline'],
    [2,13,'metalloid'], [2,14,'nonmetal'], [2,15,'nonmetal'], [2,16,'nonmetal'], [2,17,'halogen'], [2,18,'noble'],
    // Period 3
    [3,1,'alkali'], [3,2,'alkaline'],
    [3,13,'postTrans'], [3,14,'metalloid'], [3,15,'nonmetal'], [3,16,'nonmetal'], [3,17,'halogen'], [3,18,'noble'],
    // Period 4
    [4,1,'alkali'], [4,2,'alkaline'],
    ...(Array.from({ length: 10 }, (_, i) => [4, 3 + i, 'transition'] as Cell)),
    [4,13,'postTrans'], [4,14,'metalloid'], [4,15,'metalloid'], [4,16,'nonmetal'], [4,17,'halogen'], [4,18,'noble'],
    // Period 5
    [5,1,'alkali'], [5,2,'alkaline'],
    ...(Array.from({ length: 10 }, (_, i) => [5, 3 + i, 'transition'] as Cell)),
    [5,13,'postTrans'], [5,14,'postTrans'], [5,15,'metalloid'], [5,16,'metalloid'], [5,17,'halogen'], [5,18,'noble'],
    // Period 6
    [6,1,'alkali'], [6,2,'alkaline'],
    ...(Array.from({ length: 10 }, (_, i) => [6, 3 + i, 'transition'] as Cell)),
    [6,13,'postTrans'], [6,14,'postTrans'], [6,15,'postTrans'], [6,16,'postTrans'], [6,17,'halogen'], [6,18,'noble'],
    // Period 7
    [7,1,'alkali'], [7,2,'alkaline'],
    ...(Array.from({ length: 10 }, (_, i) => [7, 3 + i, 'transition'] as Cell)),
    [7,13,'postTrans'], [7,14,'postTrans'], [7,15,'postTrans'], [7,16,'postTrans'], [7,17,'halogen'], [7,18,'noble'],
  ];

  const legendItems = ['alkali', 'alkaline', 'transition', 'nonmetal', 'metalloid', 'postTrans', 'halogen', 'noble'];

  return (
    <div className="my-4">
      <svg viewBox="0 0 560 320" className="w-full max-w-2xl mx-auto" role="img" aria-label="Mini periodic table overview">
        {/* Title */}
        <text x="280" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">Periodic Table Overview</text>

        {/* Group numbers */}
        {Array.from({ length: 18 }, (_, i) => (
          <text key={`g${i}`} x={offsetX + i * cellW + cellW / 2} y={offsetY - 4}
            textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{i + 1}</text>
        ))}

        {/* Period numbers */}
        {Array.from({ length: 7 }, (_, i) => (
          <text key={`p${i}`} x={offsetX - 10} y={offsetY + i * cellH + cellH / 2 + 3}
            textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{i + 1}</text>
        ))}

        {/* Element cells */}
        {cells.map(([period, group, cat], i) => {
          const x = offsetX + (group - 1) * cellW;
          const y = offsetY + (period - 1) * cellH;
          return (
            <rect key={i} x={x} y={y} width={cellW - 2} height={cellH - 2} rx="2"
              className={colors[cat].fill} opacity={0.85} />
          );
        })}

        {/* Legend */}
        {legendItems.map((cat, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const lx = 40 + col * 135;
          const ly = 250 + row * 22;
          return (
            <g key={cat}>
              <rect x={lx} y={ly} width={14} height={14} rx="2" className={colors[cat].fill} opacity={0.85} />
              <text x={lx + 20} y={ly + 11} className="fill-gray-600 dark:fill-gray-300" fontSize="10">{colors[cat].label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
