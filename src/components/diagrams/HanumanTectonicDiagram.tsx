export default function HanumanTectonicDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 380" className="w-full max-w-2xl mx-auto" role="img" aria-label="Tectonic plates converging to form the Himalayas">
        {/* Background — cross-section of Earth's crust */}
        <rect x="0" y="200" width="560" height="180" className="fill-amber-800/30 dark:fill-amber-900/40" />

        {/* Indian Plate (left, moving right) */}
        <rect x="20" y="170" width="230" height="40" rx="4"
          className="fill-orange-400 dark:fill-orange-600" />
        <rect x="20" y="210" width="230" height="80" rx="0"
          className="fill-orange-600 dark:fill-orange-800" />
        {/* Arrow showing movement */}
        <line x1="130" y1="155" x2="200" y2="155" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" markerEnd="url(#arrow-h)" />
        <text x="125" y="148" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">5 cm/year →</text>

        {/* Eurasian Plate (right, mostly stationary) */}
        <rect x="310" y="170" width="230" height="40" rx="4"
          className="fill-blue-400 dark:fill-blue-600" />
        <rect x="310" y="210" width="230" height="80" rx="0"
          className="fill-blue-600 dark:fill-blue-800" />

        {/* Collision / mountain zone */}
        <g>
          {/* Crumpled crust — the Himalayas */}
          <path d="M 240,170 Q 260,80 280,110 Q 290,60 310,170" className="fill-gray-400 dark:fill-gray-500 stroke-gray-600 dark:stroke-gray-400" strokeWidth="1.5" />
          {/* Snow caps */}
          <path d="M 275,80 L 280,65 L 285,80" className="fill-white/80 dark:fill-white/60" />
          <path d="M 262,108 L 265,97 L 270,108" className="fill-white/80 dark:fill-white/60" />
          <path d="M 298,108 L 302,97 L 306,108" className="fill-white/80 dark:fill-white/60" />
        </g>

        {/* Subduction zone — Indian plate dipping under */}
        <path d="M 250,210 Q 270,250 290,310" className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2" strokeDasharray="6 3" fill="none" />
        <text x="260" y="280" className="fill-orange-500 dark:fill-orange-400" fontSize="9" transform="rotate(55 260 280)">Subduction</text>

        {/* Mantle below */}
        <rect x="0" y="290" width="560" height="90" className="fill-red-900/30 dark:fill-red-900/50" />
        <text x="280" y="340" textAnchor="middle" className="fill-red-400 dark:fill-red-500" fontSize="10" fontStyle="italic">Mantle (semi-fluid rock)</text>

        {/* Labels */}
        <text x="120" y="195" textAnchor="middle" className="fill-orange-900 dark:fill-orange-200" fontSize="12" fontWeight="bold">Indian Plate</text>
        <text x="430" y="195" textAnchor="middle" className="fill-blue-900 dark:fill-blue-200" fontSize="12" fontWeight="bold">Eurasian Plate</text>
        <text x="280" y="52" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">Himalayas</text>
        <text x="280" y="64" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Still rising ~1 cm/year</text>

        {/* Title */}
        <text x="280" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Convergent Boundary: How the Himalayas Formed
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrow-h" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
