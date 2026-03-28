export default function EnergyPyramidDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 320" className="w-full max-w-lg mx-auto" role="img" aria-label="Energy pyramid diagram showing trophic levels">
        <defs>
          <marker id="ep-arrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
          <marker id="ep-heat-arrow" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#f97316" />
          </marker>
        </defs>

        {/* Title */}
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Energy Pyramid</text>

        {/* Trophic level 1 — Producers (bottom, widest) */}
        <polygon points="80,280 420,280 380,220 120,220" className="fill-green-500 dark:fill-green-600" opacity="0.85" />
        <text x="250" y="248" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Producers</text>
        <text x="250" y="264" textAnchor="middle" fill="white" fontSize="10">Plants: 10,000 kJ</text>

        {/* Trophic level 2 — Primary Consumers */}
        <polygon points="120,215 380,215 345,155 155,155" className="fill-lime-400 dark:fill-lime-600" opacity="0.85" />
        <text x="250" y="183" textAnchor="middle" className="fill-green-900 dark:fill-green-100" fontSize="12" fontWeight="bold">Primary Consumers</text>
        <text x="250" y="199" textAnchor="middle" className="fill-green-900 dark:fill-green-100" fontSize="10">Herbivores: 1,000 kJ</text>

        {/* Trophic level 3 — Secondary Consumers */}
        <polygon points="155,150 345,150 315,90 185,90" className="fill-orange-400 dark:fill-orange-600" opacity="0.85" />
        <text x="250" y="118" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Secondary Consumers</text>
        <text x="250" y="134" textAnchor="middle" fill="white" fontSize="10">Carnivores: 100 kJ</text>

        {/* Trophic level 4 — Tertiary Consumers (top, narrowest) */}
        <polygon points="185,85 315,85 285,40 215,40" className="fill-red-500 dark:fill-red-600" opacity="0.85" />
        <text x="250" y="58" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Tertiary Consumers</text>
        <text x="250" y="73" textAnchor="middle" fill="white" fontSize="10">Top predators: 10 kJ</text>

        {/* ---- Energy decrease arrow (left side) ---- */}
        <line x1="55" y1="270" x2="55" y2="50" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#ep-arrow)" />
        <text x="48" y="160" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600"
          transform="rotate(-90, 48, 160)">Energy decreases</text>

        {/* 10% transferred label */}
        <text x="27" y="252" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(-90, 27, 252)">10% transferred to next level</text>

        {/* ---- Heat loss arrows (right side, one per level) ---- */}

        {/* Heat from Producers */}
        <line x1="422" y1="250" x2="460" y2="250" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#ep-heat-arrow)" />
        <text x="465" y="254" className="fill-orange-600 dark:fill-orange-400" fontSize="10">90% heat</text>

        {/* Heat from Primary Consumers */}
        <line x1="382" y1="185" x2="420" y2="185" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#ep-heat-arrow)" />
        <text x="425" y="189" className="fill-orange-600 dark:fill-orange-400" fontSize="10">90% heat</text>

        {/* Heat from Secondary Consumers */}
        <line x1="347" y1="120" x2="385" y2="120" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#ep-heat-arrow)" />
        <text x="390" y="124" className="fill-orange-600 dark:fill-orange-400" fontSize="10">90% heat</text>

        {/* Heat from Tertiary Consumers */}
        <line x1="317" y1="62" x2="355" y2="62" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#ep-heat-arrow)" />
        <text x="360" y="66" className="fill-orange-600 dark:fill-orange-400" fontSize="10">90% heat</text>

        {/* Bottom note */}
        <text x="250" y="305" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Only ~10% of energy is passed to the next trophic level
        </text>
      </svg>
    </div>
  );
}
