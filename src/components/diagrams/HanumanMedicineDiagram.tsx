export default function HanumanMedicineDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 340" className="w-full max-w-2xl mx-auto" role="img" aria-label="Pipeline from plant to medicine: collection, extraction, purification, testing, drug">
        {/* Title */}
        <text x="280" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          From Plant to Medicine
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrow-med" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Step 1: Plant Collection */}
        <g transform="translate(20, 55)">
          <rect x="0" y="0" width="90" height="80" rx="10" className="fill-green-100 dark:fill-green-900/40 stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
          {/* Simple plant icon */}
          <line x1="45" y1="60" x2="45" y2="30" className="stroke-green-600 dark:stroke-green-400" strokeWidth="2" />
          <ellipse cx="38" cy="25" rx="10" ry="6" className="fill-green-400 dark:fill-green-500" transform="rotate(-30 38 25)" />
          <ellipse cx="52" cy="25" rx="10" ry="6" className="fill-green-400 dark:fill-green-500" transform="rotate(30 52 25)" />
          <ellipse cx="45" cy="18" rx="8" ry="5" className="fill-green-300 dark:fill-green-400" />
          <text x="45" y="75" textAnchor="middle" className="fill-green-800 dark:fill-green-200" fontSize="9" fontWeight="bold">Collect</text>
        </g>

        {/* Arrow 1→2 */}
        <line x1="115" y1="95" x2="140" y2="95" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#arrow-med)" />

        {/* Step 2: Extraction */}
        <g transform="translate(145, 55)">
          <rect x="0" y="0" width="90" height="80" rx="10" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          {/* Beaker icon */}
          <path d="M 35,20 L 35,50 Q 35,60 45,60 Q 55,60 55,50 L 55,20 Z" className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
          <rect x="35" y="40" width="20" height="15" className="fill-amber-400 dark:fill-amber-500" opacity="0.6" />
          <text x="45" y="75" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="9" fontWeight="bold">Extract</text>
        </g>

        {/* Arrow 2→3 */}
        <line x1="240" y1="95" x2="265" y2="95" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#arrow-med)" />

        {/* Step 3: Purify */}
        <g transform="translate(270, 55)">
          <rect x="0" y="0" width="90" height="80" rx="10" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
          {/* Column icon */}
          <rect x="38" y="15" width="14" height="45" rx="3" className="fill-blue-200 dark:fill-blue-700 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" />
          <rect x="38" y="15" width="14" height="12" className="fill-blue-400 dark:fill-blue-500" opacity="0.6" rx="2" />
          <rect x="38" y="30" width="14" height="10" className="fill-blue-300 dark:fill-blue-400" opacity="0.5" />
          <text x="45" y="75" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="9" fontWeight="bold">Purify</text>
        </g>

        {/* Arrow 3→4 */}
        <line x1="365" y1="95" x2="390" y2="95" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#arrow-med)" />

        {/* Step 4: Test */}
        <g transform="translate(395, 55)">
          <rect x="0" y="0" width="90" height="80" rx="10" className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.5" />
          {/* Microscope/test icon */}
          <circle cx="45" cy="30" r="12" className="fill-purple-200 dark:fill-purple-700 stroke-purple-400 dark:stroke-purple-500" strokeWidth="1" />
          <text x="45" y="34" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10">🧪</text>
          <text x="45" y="75" textAnchor="middle" className="fill-purple-800 dark:fill-purple-200" fontSize="9" fontWeight="bold">Test</text>
        </g>

        {/* Descriptions below */}
        <text x="65" y="160" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">Identify species,</text>
        <text x="65" y="170" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">harvest sustainably</text>

        <text x="190" y="160" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">Crush, dissolve in</text>
        <text x="190" y="170" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">solvent, filter</text>

        <text x="315" y="160" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">Chromatography</text>
        <text x="315" y="170" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">isolates one compound</text>

        <text x="440" y="160" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">Lab → animal → human</text>
        <text x="440" y="170" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">clinical trials</text>

        {/* Final result box */}
        <rect x="170" y="200" width="220" height="55" rx="12"
          className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="280" y="222" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200" fontSize="12" fontWeight="bold">Medicine</text>
        <text x="280" y="238" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="9">Aspirin: from willow bark (Salix)</text>
        <text x="280" y="250" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="9">Artemisinin: from sweet wormwood</text>

        {/* Examples */}
        <text x="280" y="285" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">
          ~25% of modern drugs come from plant compounds
        </text>

        {/* Timeline */}
        <rect x="60" y="305" width="440" height="25" rx="6"
          className="fill-gray-100 dark:fill-gray-800/60 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="280" y="322" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Traditional knowledge (millennia) → Lab science (decades) → Approved drug (10–15 years)
        </text>
      </svg>
    </div>
  );
}
