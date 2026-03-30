export default function ReactionTypesDiagram() {
  const pw = 250;
  const ph = 130;

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 546 294"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Four types of chemical reactions: synthesis, decomposition, single replacement, double replacement"
      >
        <defs>
          <marker id="rxnArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Panel 1: Synthesis */}
        <g transform="translate(5, 5)">
          <rect width={pw} height={ph} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={pw / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Synthesis
          </text>
          <text x={pw / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            A + B → AB
          </text>
          {/* Reactants */}
          <circle cx="50" cy="80" r="16" className="fill-red-400" />
          <text x="50" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">A</text>
          <text x="80" y="85" fontSize="16" className="fill-gray-500 dark:fill-gray-400">+</text>
          <circle cx="108" cy="80" r="16" className="fill-blue-400" />
          <text x="108" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">B</text>
          {/* Arrow */}
          <line x1="132" y1="80" x2="168" y2="80"
            className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#rxnArrow)" />
          {/* Product */}
          <circle cx="195" cy="80" r="16" className="fill-red-400" />
          <text x="195" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">A</text>
          <circle cx="225" cy="80" r="16" className="fill-blue-400" />
          <text x="225" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">B</text>
          <line x1="211" y1="74" x2="211" y2="86" className="stroke-white" strokeWidth="1.5" opacity="0.5" />
        </g>

        {/* Panel 2: Decomposition */}
        <g transform={`translate(${pw + 15}, 5)`}>
          <rect width={pw} height={ph} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={pw / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Decomposition
          </text>
          <text x={pw / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            AB → A + B
          </text>
          {/* Reactant */}
          <circle cx="50" cy="80" r="16" className="fill-red-400" />
          <text x="50" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">A</text>
          <circle cx="80" cy="80" r="16" className="fill-blue-400" />
          <text x="80" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">B</text>
          {/* Arrow */}
          <line x1="104" y1="80" x2="140" y2="80"
            className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#rxnArrow)" />
          {/* Products */}
          <circle cx="170" cy="80" r="16" className="fill-red-400" />
          <text x="170" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">A</text>
          <text x="200" y="85" fontSize="16" className="fill-gray-500 dark:fill-gray-400">+</text>
          <circle cx="226" cy="80" r="16" className="fill-blue-400" />
          <text x="226" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">B</text>
        </g>

        {/* Panel 3: Single Replacement */}
        <g transform="translate(5, 145)">
          <rect width={pw} height={ph} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={pw / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Single Replacement
          </text>
          <text x={pw / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            A + BC → AC + B
          </text>
          {/* Reactants */}
          <circle cx="30" cy="80" r="14" className="fill-green-400" />
          <text x="30" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">A</text>
          <text x="52" y="85" fontSize="14" className="fill-gray-500 dark:fill-gray-400">+</text>
          <circle cx="70" cy="80" r="14" className="fill-blue-400" />
          <text x="70" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">B</text>
          <circle cx="96" cy="80" r="14" className="fill-amber-400" />
          <text x="96" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">C</text>
          {/* Arrow */}
          <line x1="116" y1="80" x2="148" y2="80"
            className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#rxnArrow)" />
          {/* Products */}
          <circle cx="172" cy="80" r="14" className="fill-green-400" />
          <text x="172" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">A</text>
          <circle cx="198" cy="80" r="14" className="fill-amber-400" />
          <text x="198" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">C</text>
          <text x="220" y="85" fontSize="14" className="fill-gray-500 dark:fill-gray-400">+</text>
          <circle cx="238" cy="80" r="14" className="fill-blue-400" />
          <text x="238" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">B</text>
        </g>

        {/* Panel 4: Double Replacement */}
        <g transform={`translate(${pw + 15}, 145)`}>
          <rect width={pw} height={ph} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={pw / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Double Replacement
          </text>
          <text x={pw / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            AB + CD → AD + CB
          </text>
          {/* Reactants */}
          <circle cx="24" cy="80" r="13" className="fill-red-400" />
          <text x="24" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">A</text>
          <circle cx="48" cy="80" r="13" className="fill-blue-400" />
          <text x="48" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">B</text>
          <text x="68" y="85" fontSize="14" className="fill-gray-500 dark:fill-gray-400">+</text>
          <circle cx="86" cy="80" r="13" className="fill-amber-400" />
          <text x="86" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">C</text>
          <circle cx="110" cy="80" r="13" className="fill-green-400" />
          <text x="110" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">D</text>
          {/* Arrow */}
          <line x1="128" y1="80" x2="152" y2="80"
            className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#rxnArrow)" />
          {/* Products */}
          <circle cx="172" cy="80" r="13" className="fill-red-400" />
          <text x="172" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">A</text>
          <circle cx="196" cy="80" r="13" className="fill-green-400" />
          <text x="196" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">D</text>
          <text x="214" y="85" fontSize="14" className="fill-gray-500 dark:fill-gray-400">+</text>
          <circle cx="232" cy="80" r="13" className="fill-amber-400" />
          <text x="232" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">C</text>
          <circle cx="232" cy="56" r="13" className="fill-blue-400" />
          <text x="232" y="60" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">B</text>
        </g>
      </svg>
    </div>
  );
}
