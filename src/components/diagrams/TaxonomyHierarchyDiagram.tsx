export default function TaxonomyHierarchyDiagram() {
  const levels = [
    { rank: 'Domain', example: 'Eukarya', color: 'fill-red-100 dark:fill-red-900/40 stroke-red-400', text: 'fill-red-700 dark:fill-red-300' },
    { rank: 'Kingdom', example: 'Animalia', color: 'fill-orange-100 dark:fill-orange-900/40 stroke-orange-400', text: 'fill-orange-700 dark:fill-orange-300' },
    { rank: 'Phylum', example: 'Chordata', color: 'fill-amber-100 dark:fill-amber-900/40 stroke-amber-400', text: 'fill-amber-700 dark:fill-amber-300' },
    { rank: 'Class', example: 'Mammalia', color: 'fill-yellow-100 dark:fill-yellow-900/40 stroke-yellow-400', text: 'fill-yellow-700 dark:fill-yellow-300' },
    { rank: 'Order', example: 'Carnivora', color: 'fill-lime-100 dark:fill-lime-900/40 stroke-lime-400', text: 'fill-lime-700 dark:fill-lime-300' },
    { rank: 'Family', example: 'Felidae', color: 'fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400', text: 'fill-emerald-700 dark:fill-emerald-300' },
    { rank: 'Genus', example: 'Panthera', color: 'fill-cyan-100 dark:fill-cyan-900/40 stroke-cyan-400', text: 'fill-cyan-700 dark:fill-cyan-300' },
    { rank: 'Species', example: 'P. tigris', color: 'fill-blue-100 dark:fill-blue-900/40 stroke-blue-400', text: 'fill-blue-700 dark:fill-blue-300' },
  ];

  const totalLevels = levels.length;
  const baseX = 250, startY = 18, boxH = 28, vGap = 6;
  const maxW = 460, minW = 120;

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 342" className="w-full max-w-lg mx-auto" role="img" aria-label="Taxonomy hierarchy from Domain to Species using tiger classification as example">
        {levels.map((level, i) => {
          const w = maxW - (i / (totalLevels - 1)) * (maxW - minW);
          const x = baseX - w / 2;
          const y = startY + i * (boxH + vGap);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={boxH} rx="6" className={level.color} strokeWidth="1.5" />
              <text x={baseX - 30} y={y + boxH / 2 + 4} textAnchor="end" className={level.text} fontSize="11" fontWeight="bold">{level.rank}</text>
              <text x={baseX + 30} y={y + boxH / 2 + 4} textAnchor="start" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontStyle="italic">{level.example}</text>
            </g>
          );
        })}

        {/* Arrow showing most → least inclusive */}
        <line x1="20" y1="30" x2="20" y2="270" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#taxArrow)" />
        <text x="12" y="70" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(-90, 12, 70)">Most inclusive</text>
        <text x="12" y="250" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(-90, 12, 250)">Most specific</text>

        {/* Mnemonic */}
        <text x="250" y="292" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Dear King Philip Came Over For Good Spaghetti
        </text>

        <defs>
          <marker id="taxArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
