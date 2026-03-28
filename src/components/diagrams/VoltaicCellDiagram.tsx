export default function VoltaicCellDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 300" className="w-full max-w-lg mx-auto" role="img" aria-label="Voltaic cell diagram with zinc anode, copper cathode, salt bridge, and electron flow">
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Voltaic (Galvanic) Cell</text>

        {/* Left beaker (Anode) */}
        <rect x="40" y="120" width="160" height="130" rx="4" className="fill-blue-50 dark:fill-blue-900/20 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="120" y="265" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">ZnSO₄ solution</text>

        {/* Zinc electrode */}
        <rect x="100" y="100" width="20" height="140" rx="2" className="fill-gray-300 dark:fill-gray-500 stroke-gray-500" strokeWidth="1.5" />
        <text x="110" y="190" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold" transform="rotate(-90, 110, 190)">Zn electrode</text>

        {/* Zn dissolving (particles leaving) */}
        <circle cx="125" cy="170" r="3" className="fill-gray-400" opacity="0.6">
          <animate attributeName="cx" values="125;145;160" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="148" y="158" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Zn²⁺</text>
        <text x="120" y="280" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="bold">ANODE (−)</text>
        <text x="120" y="293" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Oxidation: Zn → Zn²⁺ + 2e⁻</text>

        {/* Right beaker (Cathode) */}
        <rect x="300" y="120" width="160" height="130" rx="4" className="fill-sky-50 dark:fill-sky-900/20 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="380" y="265" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400" fontSize="10">CuSO₄ solution</text>

        {/* Copper electrode */}
        <rect x="370" y="100" width="20" height="140" rx="2" className="fill-amber-600 dark:fill-amber-500 stroke-amber-700" strokeWidth="1.5" />
        <text x="380" y="190" textAnchor="middle" className="fill-amber-900 dark:fill-amber-200" fontSize="11" fontWeight="bold" transform="rotate(-90, 380, 190)">Cu electrode</text>

        {/* Cu depositing (particles arriving) */}
        <circle cx="360" cy="180" r="3" className="fill-amber-500" opacity="0.6">
          <animate attributeName="cx" values="340;355;368" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="340" y="168" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Cu²⁺</text>
        <text x="380" y="280" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="bold">CATHODE (+)</text>
        <text x="380" y="293" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Reduction: Cu²⁺ + 2e⁻ → Cu</text>

        {/* Wire connecting electrodes */}
        <path d="M 110,100 L 110,60 L 380,60 L 380,100" fill="none" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />

        {/* Electron flow arrow on wire */}
        <line x1="160" y1="55" x2="310" y2="55" className="stroke-yellow-500 dark:stroke-yellow-400" strokeWidth="2" markerEnd="url(#vcArrow)" />
        <text x="235" y="48" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="bold">e⁻ flow →</text>

        {/* Voltmeter */}
        <circle cx="250" cy="60" r="16" className="fill-gray-100 dark:fill-gray-800 stroke-gray-500" strokeWidth="1.5" />
        <text x="250" y="58" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">V</text>
        <text x="250" y="70" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">1.1V</text>

        {/* Salt bridge */}
        <path d="M 190,135 Q 250,110 310,135" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="6" strokeLinecap="round" />
        <path d="M 190,135 Q 250,110 310,135" fill="none" className="stroke-emerald-200 dark:stroke-emerald-700" strokeWidth="3" strokeLinecap="round" />
        <text x="250" y="118" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="bold">Salt Bridge</text>
        <text x="250" y="130" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(ions balance charge)</text>

        <defs>
          <marker id="vcArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-yellow-500 dark:fill-yellow-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
