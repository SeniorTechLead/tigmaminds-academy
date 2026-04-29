export default function BatteryCrossSectionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 373 390" className="w-full max-w-xl mx-auto" role="img" aria-label="Battery cross-section diagram">
        <defs>
          <marker id="batArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-yellow-500" />
          </marker>
          <marker id="batLabel" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="150" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Inside a Battery
        </text>

        {/* Battery outer casing */}
        <rect x="80" y="40" width="140" height="260" rx="8"
          className="fill-gray-300 dark:fill-gray-600 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        {/* Positive terminal (top nub) */}
        <rect x="135" y="30" width="30" height="15" rx="3" className="fill-gray-500 dark:fill-gray-400" />
        <text x="150" y="28" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="14" fontWeight="bold">+</text>

        {/* Negative terminal label */}
        <text x="150" y="315" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="14" fontWeight="bold">−</text>

        {/* Cathode (carbon rod, center) */}
        <rect x="142" y="45" width="16" height="240" rx="2"
          className="fill-gray-700 dark:fill-gray-800" />

        {/* Electrolyte paste (main fill) */}
        <rect x="90" y="50" width="120" height="240" rx="4"
          className="fill-amber-200 dark:fill-amber-800/40" opacity="0.7" />

        {/* Separator */}
        <rect x="115" y="50" width="3" height="240"
          className="fill-white dark:fill-gray-300" opacity="0.8" />
        <rect x="182" y="50" width="3" height="240"
          className="fill-white dark:fill-gray-300" opacity="0.8" />

        {/* Anode (zinc casing, inner walls) */}
        <rect x="90" y="50" width="25" height="240" rx="2"
          className="fill-blue-300 dark:fill-blue-700/50" opacity="0.7" />
        <rect x="185" y="50" width="25" height="240" rx="2"
          className="fill-blue-300 dark:fill-blue-700/50" opacity="0.7" />

        {/* Cathode rod overlay */}
        <rect x="142" y="45" width="16" height="240" rx="2"
          className="fill-gray-700 dark:fill-gray-800" />

        {/* Electron flow arrows (outside battery, from - to + through external circuit) */}
        <path d="M 70,290 Q 40,170 70,55" fill="none" className="stroke-yellow-500" strokeWidth="2" markerEnd="url(#batArrow)" />
        <text x="28" y="170" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="600"
          transform="rotate(-90, 28, 170)">e⁻ flow</text>

        {/* Labels */}
        {/* Anode */}
        <line x1="240" y1="90" x2="215" y2="100" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#batLabel)" />
        <text x="243" y="85" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600">Anode</text>
        <text x="243" y="97" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(zinc)</text>

        {/* Separator */}
        <line x1="240" y1="140" x2="188" y2="140" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#batLabel)" />
        <text x="243" y="136" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Separator</text>

        {/* Electrolyte */}
        <line x1="240" y1="190" x2="185" y2="185" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#batLabel)" />
        <text x="243" y="186" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">Electrolyte</text>
        <text x="243" y="198" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(paste)</text>

        {/* Cathode */}
        <line x1="240" y1="240" x2="162" y2="230" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#batLabel)" />
        <text x="243" y="236" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Cathode</text>
        <text x="243" y="248" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(carbon)</text>

        {/* Bottom note */}
        <text x="150" y="340" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Chemical energy → Electrical energy
        </text>
      </svg>
    </div>
  );
}
