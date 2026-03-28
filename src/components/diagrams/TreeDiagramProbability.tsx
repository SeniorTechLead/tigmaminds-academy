export default function TreeDiagramProbability() {
  const w = 450, h = 350;

  // Layout: root -> H/T -> each has 1-6
  const rootX = 50, rootY = h / 2;
  const level1X = 160;
  const level2X = 310;

  const coinBranches = [
    { label: 'H', prob: '1/2', y: 100 },
    { label: 'T', prob: '1/2', y: 250 },
  ];

  const diceValues = [1, 2, 3, 4, 5, 6];
  const diceSpacing = 22;

  // Highlighted path: H then 6
  const highlightCoin = 0; // H
  const highlightDice = 5; // 6

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Tree diagram: coin flip then dice roll">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Title */}
        <text x={w / 2} y={22} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">Coin Flip → Dice Roll</text>

        {/* Root node */}
        <circle cx={rootX} cy={rootY} r="8" className="fill-gray-300 dark:fill-gray-600" />
        <text x={rootX} y={rootY - 14} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-400">Start</text>

        {/* Level 1: coin branches */}
        {coinBranches.map((branch, bi) => {
          const isHL = bi === highlightCoin;
          const branchColor = isHL ? 'stroke-blue-500 dark:stroke-blue-400' : 'stroke-gray-400 dark:stroke-gray-500';
          const textColor = isHL ? 'fill-blue-600 dark:fill-blue-400' : 'fill-gray-600 dark:fill-gray-400';
          const nodeColor = isHL ? 'fill-blue-500 dark:fill-blue-400' : 'fill-gray-400 dark:fill-gray-500';

          // Dice branch Y positions centered around branch.y
          const diceStartY = branch.y - ((diceValues.length - 1) * diceSpacing) / 2;

          return (
            <g key={bi}>
              {/* Branch line to coin node */}
              <line x1={rootX + 8} y1={rootY} x2={level1X - 14} y2={branch.y}
                className={branchColor} strokeWidth={isHL ? 2.5 : 1.5} />

              {/* Probability on branch */}
              <text x={(rootX + level1X) / 2 - 5} y={branch.y < rootY ? branch.y + 20 : branch.y - 12}
                fontSize="10" fontWeight="600" className={textColor}>{branch.prob}</text>

              {/* Coin node */}
              <circle cx={level1X} cy={branch.y} r="14" className={`${nodeColor}`} opacity="0.2" />
              <circle cx={level1X} cy={branch.y} r="14" fill="none" className={branchColor} strokeWidth="1.5" />
              <text x={level1X} y={branch.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" className={textColor}>{branch.label}</text>

              {/* Level 2: dice branches */}
              {diceValues.map((dv, di) => {
                const dy = diceStartY + di * diceSpacing;
                const isDHL = isHL && di === highlightDice;
                const dBranchColor = isDHL ? 'stroke-green-500 dark:stroke-green-400' : 'stroke-gray-300 dark:stroke-gray-600';
                const dTextColor = isDHL ? 'fill-green-600 dark:fill-green-400' : 'fill-gray-500 dark:fill-gray-400';

                return (
                  <g key={di}>
                    <line x1={level1X + 14} y1={branch.y} x2={level2X - 10} y2={dy}
                      className={dBranchColor} strokeWidth={isDHL ? 2 : 1} />
                    {/* Dice value */}
                    <circle cx={level2X} cy={dy} r="10" className={isDHL ? 'fill-green-100 dark:fill-green-900/40 stroke-green-500 dark:stroke-green-400' : 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'} strokeWidth="1" />
                    <text x={level2X} y={dy + 4} textAnchor="middle" fontSize="10" fontWeight="600" className={dTextColor}>{dv}</text>
                  </g>
                );
              })}

              {/* Probability label for dice branches */}
              <text x={level2X + 18} y={diceStartY + 4} fontSize="10" className="fill-gray-400 dark:fill-gray-500">1/6 each</text>
            </g>
          );
        })}

        {/* Highlighted path result */}
        <rect x={level2X + 30} y={coinBranches[highlightCoin].y - 28 + highlightDice * diceSpacing - 14} width={100} height={32} rx="6"
          className="fill-green-50 dark:fill-green-900/30 stroke-green-400 dark:stroke-green-600" strokeWidth="1" />
        <text x={level2X + 80} y={coinBranches[highlightCoin].y - 28 + highlightDice * diceSpacing - 2}
          textAnchor="middle" fontSize="10" fontWeight="700" className="fill-green-700 dark:fill-green-300">
          P(H and 6)
        </text>
        <text x={level2X + 80} y={coinBranches[highlightCoin].y - 28 + highlightDice * diceSpacing + 12}
          textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">
          = 1/2 × 1/6 = 1/12
        </text>
      </svg>
    </div>
  );
}
