export default function CombinatoricsGridDiagram() {
  // 3 colored balls: R, G, B
  // Permutations: all 6 orderings
  const perms = [
    ['R', 'G', 'B'],
    ['R', 'B', 'G'],
    ['G', 'R', 'B'],
    ['G', 'B', 'R'],
    ['B', 'R', 'G'],
    ['B', 'G', 'R'],
  ];

  const ballColor: Record<string, { fill: string; text: string }> = {
    R: { fill: 'fill-red-400 dark:fill-red-500', text: 'fill-white' },
    G: { fill: 'fill-emerald-400 dark:fill-emerald-500', text: 'fill-white' },
    B: { fill: 'fill-blue-400 dark:fill-blue-500', text: 'fill-white' },
  };

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 295" className="w-full max-w-lg mx-auto" role="img" aria-label="Permutations vs Combinations diagram">
        {/* Title */}
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Permutations vs Combinations
        </text>

        {/* Permutations side */}
        <g transform="translate(10, 30)">
          <text x="110" y="15" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="12" fontWeight="bold">
            Permutations
          </text>
          <text x="110" y="30" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
            Order matters → 3! = 6 arrangements
          </text>

          {perms.map((perm, row) => (
            <g key={row} transform={`translate(30, ${40 + row * 30})`}>
              {perm.map((color, col) => (
                <g key={col}>
                  <circle cx={20 + col * 40} cy="10" r="11" className={ballColor[color].fill} />
                  <text x={20 + col * 40} y="14" textAnchor="middle" className={ballColor[color].text} fontSize="10" fontWeight="bold">
                    {color}
                  </text>
                </g>
              ))}
              {/* Separator between balls */}
              <text x={145} y="14" className="fill-gray-400" fontSize="10">#{row + 1}</text>
            </g>
          ))}
        </g>

        {/* Divider */}
        <line x1="245" y1="35" x2="245" y2="235" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="245" y="245" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">vs</text>

        {/* Combinations side */}
        <g transform="translate(260, 30)">
          <text x="110" y="15" textAnchor="middle" className="fill-teal-600 dark:fill-teal-400" fontSize="12" fontWeight="bold">
            Combinations
          </text>
          <text x="110" y="30" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
            Order doesn&apos;t matter → just 1 group
          </text>

          {/* Single group of 3 balls */}
          <g transform="translate(30, 70)">
            {/* Enclosing bracket */}
            <rect x="0" y="-20" width="160" height="55" rx="12"
              className="fill-teal-50 dark:fill-teal-900/20 stroke-teal-400 dark:stroke-teal-500" strokeWidth="1.5" strokeDasharray="5,3" />
            {['R', 'G', 'B'].map((color, col) => (
              <g key={col}>
                <circle cx={30 + col * 50} cy="8" r="14" className={ballColor[color].fill} />
                <text x={30 + col * 50} y="12" textAnchor="middle" className={ballColor[color].text} fontSize="11" fontWeight="bold">
                  {color}
                </text>
              </g>
            ))}
          </g>

          {/* Explanation */}
          <text x="110" y="130" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
            {'{'}R, G, B{'}'} is the same group
          </text>
          <text x="110" y="145" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
            regardless of order
          </text>

          {/* Formula */}
          <rect x="25" y="158" width="170" height="28" rx="6"
            className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
          <text x="110" y="177" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">
            C(n,r) = n! / (r! × (n−r)!)
          </text>
        </g>

        {/* Permutation formula */}
        <rect x="35" y="225" width="170" height="22" rx="6"
          className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="120" y="240" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">
          P(n,r) = n! / (n−r)!
        </text>
      </svg>
    </div>
  );
}
