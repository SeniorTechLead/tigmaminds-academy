export default function RedoxDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 472 262" className="w-full max-w-lg mx-auto" role="img" aria-label="Redox diagram showing oxidation and reduction with electron transfer and OIL RIG mnemonic">
        <text x="225" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Oxidation &amp; Reduction (Redox)</text>

        {/* Atom A - loses electron (oxidation) */}
        <circle cx="110" cy="100" r="40" className="fill-red-100 dark:fill-red-900/40 stroke-red-400" strokeWidth="2" />
        <text x="110" y="95" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="16" fontWeight="bold">Na</text>
        <text x="110" y="112" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="11">loses e⁻</text>

        {/* Electron on atom A */}
        <circle cx="145" cy="72" r="8" className="fill-yellow-400 dark:fill-yellow-500 stroke-yellow-600" strokeWidth="1">
          <animate attributeName="cx" values="145;300;300" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cy" values="72;72;128" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="145" y="76" textAnchor="middle" className="fill-yellow-800" fontSize="10" fontWeight="bold">
          e⁻
          <animate attributeName="x" values="145;300;300" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y" values="76;76;132" dur="3s" repeatCount="indefinite" />
        </text>

        {/* Electron transfer arrow */}
        <path d="M 155,65 Q 225,30 300,65" fill="none" className="stroke-yellow-500 dark:stroke-yellow-400" strokeWidth="2.5" markerEnd="url(#redoxArrow)" />
        <text x="225" y="42" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="11" fontWeight="bold">electron transfer</text>

        {/* Atom B - gains electron (reduction) */}
        <circle cx="340" cy="100" r="40" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400" strokeWidth="2" />
        <text x="340" y="95" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="16" fontWeight="bold">Cl</text>
        <text x="340" y="112" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="11">gains e⁻</text>

        {/* Labels */}
        <text x="110" y="155" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="bold">OXIDATION</text>
        <text x="110" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Na → Na⁺ + e⁻</text>

        <text x="340" y="155" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="12" fontWeight="bold">REDUCTION</text>
        <text x="340" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Cl + e⁻ → Cl⁻</text>

        {/* OIL RIG mnemonic */}
        <rect x="145" y="185" width="160" height="30" rx="8" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400" strokeWidth="1.5" />
        <text x="225" y="200" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">
          OIL RIG
        </text>
        <text x="225" y="212" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">
          Oxidation Is Loss — Reduction Is Gain
        </text>

        <defs>
          <marker id="redoxArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-yellow-500 dark:fill-yellow-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
