export default function HydroFloodDroughtDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Flood cycle and drought impact showing causes and effects of too much and too little water">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Floods & Droughts — Too Much and Too Little
        </text>

        {/* === FLOOD SIDE (left) === */}
        <rect x="5" y="32" width="250" height="210" rx="8" className="fill-blue-50 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="130" y="52" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">
          💧 FLOOD — Too Much Water
        </text>

        {/* Flood cross-section */}
        {/* River channel */}
        <rect x="90" y="110" width="80" height="30" rx="4" className="fill-blue-300 dark:fill-blue-600" />
        <text x="130" y="130" textAnchor="middle" className="fill-blue-800 dark:fill-blue-100" fontSize="10">River</text>

        {/* Normal banks */}
        <rect x="30" y="105" width="60" height="5" className="fill-green-400 dark:fill-green-600" />
        <rect x="170" y="105" width="60" height="5" className="fill-green-400 dark:fill-green-600" />
        <text x="60" y="102" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="10">Bank</text>
        <text x="200" y="102" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="10">Bank</text>

        {/* Floodwater overtopping */}
        <rect x="20" y="95" width="220" height="20" rx="3" className="fill-blue-400 dark:fill-blue-500" opacity="0.4" />
        <text x="130" y="93" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="bold">
          Floodwater overflows banks
        </text>

        {/* Rain */}
        <text x="50" y="72" className="fill-blue-500" fontSize="11">🌧</text>
        <text x="110" y="68" className="fill-blue-500" fontSize="11">🌧</text>
        <text x="170" y="70" className="fill-blue-500" fontSize="11">🌧</text>

        {/* Flood causes */}
        <text x="15" y="158" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Causes:</text>
        <text x="15" y="172" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Heavy monsoon rainfall</text>
        <text x="15" y="186" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Rivers overflow banks</text>
        <text x="15" y="200" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Rapid snowmelt</text>
        <text x="15" y="214" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Storm surges / dam failure</text>

        {/* Flood speed */}
        <rect x="15" y="222" width="230" height="14" rx="3" className="fill-blue-200 dark:fill-blue-800" />
        <text x="130" y="233" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="10">
          Strikes in HOURS to DAYS — fast onset
        </text>

        {/* === DROUGHT SIDE (right) === */}
        <rect x="265" y="32" width="250" height="210" rx="8" className="fill-amber-50 dark:fill-amber-900/20" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="390" y="52" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">
          🏜 DROUGHT — Too Little Water
        </text>

        {/* Dry river */}
        <rect x="350" y="110" width="80" height="30" rx="4" className="fill-amber-200 dark:fill-amber-700" />
        <text x="390" y="130" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10">Dry bed</text>

        {/* Cracked earth */}
        <path d="M 355,118 L 362,128 L 358,135" fill="none" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 385,115 L 390,125" fill="none" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 410,118 L 415,132" fill="none" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="1" />

        {/* Dry banks */}
        <rect x="290" y="105" width="60" height="5" className="fill-amber-300 dark:fill-amber-600" />
        <rect x="430" y="105" width="60" height="5" className="fill-amber-300 dark:fill-amber-600" />

        {/* Sun */}
        <text x="370" y="78" className="fill-yellow-500" fontSize="16">☀</text>
        <text x="390" y="93" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="bold">
          No rain for weeks/months
        </text>

        {/* Drought causes */}
        <text x="275" y="158" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Effects cascade:</text>
        <text x="275" y="172" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Crops fail → food shortage</text>
        <text x="275" y="186" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Rivers shrink → water scarcity</text>
        <text x="275" y="200" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Groundwater drops → wells dry</text>
        <text x="275" y="214" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Food prices rise → migration</text>

        {/* Drought speed */}
        <rect x="275" y="222" width="230" height="14" rx="3" className="fill-amber-200 dark:fill-amber-800" />
        <text x="390" y="233" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10">
          Builds over WEEKS to YEARS — slow onset
        </text>

        {/* VS divider */}
        <circle cx="260" cy="135" r="14" className="fill-gray-200 dark:fill-gray-700" />
        <text x="260" y="140" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">VS</text>

        {/* Climate change connection */}
        <rect x="20" y="252" width="480" height="68" rx="6" className="fill-red-50 dark:fill-red-900/20" stroke="#ef4444" strokeWidth="1.5" />
        <text x="260" y="270" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">
          Climate Change Makes BOTH Worse
        </text>

        {/* Cycle diagram */}
        <text x="100" y="290" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Warmer air (+1°C)</text>
        <text x="100" y="304" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">holds 7% more water</text>

        <text x="200" y="290" className="fill-gray-500" fontSize="14">→</text>

        <text x="260" y="290" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">Heavier rain</text>
        <text x="260" y="304" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">(worse floods)</text>

        <text x="320" y="290" className="fill-gray-500" fontSize="14">+</text>

        <text x="410" y="290" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="bold">Faster evaporation</text>
        <text x="410" y="304" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">(worse droughts)</text>

        {/* Assam callout */}
        <rect x="20" y="330" width="480" height="60" rx="6" className="fill-blue-50 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1" />
        <text x="260" y="348" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="11" fontWeight="bold">
          Assam: Floods Almost Every Year
        </text>
        <text x="260" y="365" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          The Brahmaputra swells during monsoon, inundating vast areas. In 2022, floods affected 5+ million people.
        </text>
        <text x="260" y="380" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          But flood sediment also makes floodplains the most fertile land — ancient civilizations settled on them deliberately.
        </text>
      </svg>
    </div>
  );
}
