export default function CellMembraneDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 525 284" className="w-full max-w-lg mx-auto" role="img" aria-label="Cell membrane phospholipid bilayer diagram">
        <defs>
          <marker id="cm-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Cell Membrane — Phospholipid Bilayer</text>

        {/* Extracellular label */}
        <text x="250" y="40" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="11">Extracellular (outside)</text>

        {/* Upper leaflet — hydrophilic heads + tails */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((x, i) => (
          <g key={`upper-${i}`}>
            {/* Hydrophilic head */}
            <circle cx={x} cy={62} r="8" className="fill-blue-400 dark:fill-blue-500" stroke="#1e40af" strokeWidth="1" />
            {/* Hydrophobic tails */}
            <line x1={x - 3} y1={70} x2={x - 3} y2={100} className="stroke-yellow-500" strokeWidth="2" />
            <line x1={x + 3} y1={70} x2={x + 3} y2={100} className="stroke-yellow-500" strokeWidth="2" />
          </g>
        ))}

        {/* Lower leaflet — tails + hydrophilic heads */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((x, i) => (
          <g key={`lower-${i}`}>
            {/* Hydrophobic tails */}
            <line x1={x - 3} y1={110} x2={x - 3} y2={140} className="stroke-yellow-500" strokeWidth="2" />
            <line x1={x + 3} y1={110} x2={x + 3} y2={140} className="stroke-yellow-500" strokeWidth="2" />
            {/* Hydrophilic head */}
            <circle cx={x} cy={148} r="8" className="fill-blue-400 dark:fill-blue-500" stroke="#1e40af" strokeWidth="1" />
          </g>
        ))}

        {/* Transport channel protein (between positions 200 and 240) */}
        <rect x="205" y="55" width="50" height="100" rx="10" className="fill-purple-400 dark:fill-purple-600" opacity="0.85" />
        <rect x="218" y="55" width="24" height="100" rx="4" className="fill-purple-200 dark:fill-purple-300" opacity="0.6" />
        <text x="230" y="112" textAnchor="middle" className="fill-purple-900 dark:fill-purple-100" fontSize="10" fontWeight="600">Channel</text>
        {/* Arrow through channel */}
        <line x1="230" y1="48" x2="230" y2="75" className="stroke-green-500" strokeWidth="1.5" markerEnd="url(#cm-arrow)" />
        <circle cx="230" cy="44" r="4" className="fill-green-400" />
        <text x="230" y="42" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="9">●</text>

        {/* Integral protein (between positions 360 and 400) */}
        <ellipse cx="380" cy="105" rx="22" ry="50" className="fill-rose-400 dark:fill-rose-500" opacity="0.8" />
        <text x="380" y="108" textAnchor="middle" className="fill-rose-900 dark:fill-rose-100" fontSize="10" fontWeight="600">Protein</text>

        {/* Intracellular label */}
        <text x="250" y="178" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontSize="11">Intracellular (inside)</text>

        {/* Legend */}
        <circle cx="30" cy="200" r="7" className="fill-blue-400 dark:fill-blue-500" stroke="#1e40af" strokeWidth="1" />
        <text x="42" y="204" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Hydrophilic head (polar)</text>

        <line x1="23" y1="220" x2="37" y2="220" className="stroke-yellow-500" strokeWidth="3" />
        <text x="42" y="224" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Hydrophobic tails (nonpolar)</text>

        <rect x="23" y="234" width="14" height="10" rx="3" className="fill-purple-400 dark:fill-purple-600" />
        <text x="42" y="243" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Transport channel protein</text>

        <ellipse cx="30" cy="208" rx="0" ry="0" />
        <rect x="270" y="194" width="14" height="10" rx="3" className="fill-rose-400 dark:fill-rose-500" />
        <text x="289" y="203" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Integral protein</text>
      </svg>
    </div>
  );
}
