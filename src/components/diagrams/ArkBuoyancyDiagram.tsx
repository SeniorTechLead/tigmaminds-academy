export default function ArkBuoyancyDiagram() {
  return (
    <svg viewBox="0 0 500 320" className="w-full max-w-2xl mx-auto">
      {/* Water */}
      <rect x="0" y="160" width="500" height="160" fill="#1e3a5f" opacity="0.5" />
      <text x="460" y="250" textAnchor="end" fill="#60a5fa" fontSize="11" fontStyle="italic">Water</text>

      {/* Solid steel block — sinks */}
      <g>
        <rect x="50" y="190" width="40" height="40" className="fill-gray-500 dark:fill-gray-500" stroke="#9ca3af" strokeWidth="1.5" rx="2" />
        <text x="70" y="215" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="9" fontWeight="bold">Steel</text>
        <line x1="70" y1="240" x2="70" y2="280" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arkArrowRed)" />
        <text x="70" y="295" textAnchor="middle" fill="#ef4444" fontSize="10">Sinks</text>
        <text x="70" y="145" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="10">Solid cube</text>
        <text x="70" y="158" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">7.8 g/cm³</text>
      </g>

      {/* Hollow hull — floats */}
      <g>
        <path d="M 200 150 L 190 190 Q 190 200 200 200 L 300 200 Q 310 200 310 190 L 300 150 Z" fill="#4b5563" stroke="#9ca3af" strokeWidth="1.5" />
        <line x1="200" y1="155" x2="300" y2="155" stroke="#6b7280" strokeWidth="0.5" strokeDasharray="3" />
        <text x="250" y="180" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="10" fontWeight="bold">Hollow hull</text>
        <line x1="250" y1="205" x2="250" y2="230" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arkArrowGreen)" />
        <text x="250" y="245" textAnchor="middle" fill="#22c55e" fontSize="10">Buoyant force</text>
        {/* Waterline indicator */}
        <line x1="185" y1="160" x2="315" y2="160" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 2" />
        <text x="320" y="163" fill="#60a5fa" fontSize="9">waterline</text>
        <text x="250" y="135" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="10">Same steel, hollow shape</text>
      </g>

      {/* Ark silhouette — floats */}
      <g>
        <path d="M 360 120 L 350 155 Q 350 165 360 165 L 460 165 Q 470 165 470 155 L 460 120 Z" fill="#92400e" stroke="#b45309" strokeWidth="1.5" />
        {/* Cabin */}
        <rect x="385" y="100" width="50" height="20" fill="#78350f" stroke="#b45309" strokeWidth="1" rx="2" />
        <line x1="410" y1="100" x2="410" y2="90" stroke="#b45309" strokeWidth="1" />
        <text x="410" y="145" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="9" fontWeight="bold">Noah's Ark</text>
        <text x="410" y="85" textAnchor="middle" fill="#fbbf24" fontSize="9">~21,000 tonnes</text>
        {/* Displaced water arrows */}
        <line x1="410" y1="170" x2="410" y2="195" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arkArrowGreen)" />
        <text x="410" y="210" textAnchor="middle" fill="#22c55e" fontSize="9">Displaces enough</text>
        <text x="410" y="222" textAnchor="middle" fill="#22c55e" fontSize="9">water to float</text>
      </g>

      {/* Formula */}
      <text x="250" y="30" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Archimedes' Principle</text>
      <text x="250" y="50" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="11">Buoyant force = Weight of displaced water</text>

      <defs>
        <marker id="arkArrowRed" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
        </marker>
        <marker id="arkArrowGreen" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
        </marker>
      </defs>
    </svg>
  );
}
