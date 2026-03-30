export default function ClimateZonesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 567 315" className="w-full max-w-2xl mx-auto" role="img" aria-label="World climate zones with NE India marked as humid subtropical">
        {/* Climate zone bands (simplified horizontal strips) */}
        {/* Polar North */}
        <rect x="20" y="15" width="400" height="30" className="fill-gray-100 dark:fill-gray-700" />
        {/* Continental/Subarctic North */}
        <rect x="20" y="45" width="400" height="35" className="fill-sky-200 dark:fill-sky-800" />
        {/* Temperate North */}
        <rect x="20" y="80" width="400" height="35" className="fill-green-300 dark:fill-green-700" />
        {/* Arid/Subtropical */}
        <rect x="20" y="115" width="400" height="30" className="fill-yellow-200 dark:fill-yellow-800" />
        {/* Tropical */}
        <rect x="20" y="145" width="400" height="40" className="fill-red-200 dark:fill-red-900" />
        {/* Arid/Subtropical South */}
        <rect x="20" y="185" width="400" height="30" className="fill-yellow-200 dark:fill-yellow-800" />
        {/* Temperate South */}
        <rect x="20" y="215" width="400" height="30" className="fill-green-300 dark:fill-green-700" />
        {/* Polar South */}
        <rect x="20" y="245" width="400" height="30" className="fill-gray-100 dark:fill-gray-700" />

        {/* Map outline border */}
        <rect x="20" y="15" width="400" height="260" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" rx="2" />

        {/* Latitude reference lines */}
        <line x1="20" y1="30" x2="420" y2="30" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" strokeDasharray="3,3" />
        <text x="425" y="34" className="fill-gray-500 dark:fill-gray-400" fontSize="9">66.5°N Arctic</text>

        <line x1="20" y1="95" x2="420" y2="95" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" strokeDasharray="3,3" />
        <text x="425" y="99" className="fill-gray-500 dark:fill-gray-400" fontSize="9">40°N</text>

        <line x1="20" y1="130" x2="420" y2="130" className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="0.8" strokeDasharray="4,3" />
        <text x="425" y="134" className="fill-orange-600 dark:fill-orange-400" fontSize="9">23.5°N Tropic</text>

        <line x1="20" y1="165" x2="420" y2="165" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
        <text x="425" y="169" className="fill-red-600 dark:fill-red-400" fontSize="9">0° Equator</text>

        <line x1="20" y1="200" x2="420" y2="200" className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="0.8" strokeDasharray="4,3" />
        <text x="425" y="204" className="fill-orange-600 dark:fill-orange-400" fontSize="9">23.5°S Tropic</text>

        <line x1="20" y1="260" x2="420" y2="260" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" strokeDasharray="3,3" />
        <text x="425" y="264" className="fill-gray-500 dark:fill-gray-400" fontSize="9">66.5°S Antarctic</text>

        {/* Zone labels (left side) */}
        <text x="25" y="33" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Polar</text>
        <text x="25" y="66" className="fill-sky-700 dark:fill-sky-300" fontSize="10" fontWeight="600">Continental</text>
        <text x="25" y="101" className="fill-green-700 dark:fill-green-300" fontSize="10" fontWeight="600">Temperate</text>
        <text x="25" y="133" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10" fontWeight="600">Arid / Subtropical</text>
        <text x="25" y="168" className="fill-red-700 dark:fill-red-300" fontSize="10" fontWeight="600">Tropical</text>
        <text x="25" y="203" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10" fontWeight="600">Arid / Subtropical</text>
        <text x="25" y="233" className="fill-green-700 dark:fill-green-300" fontSize="10" fontWeight="600">Temperate</text>
        <text x="25" y="258" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Polar</text>

        {/* NE India marker — in humid subtropical zone (between tropical and temperate, ~26°N) */}
        {/* Position: roughly at India's longitude in the arid/subtropical band */}
        <circle cx="305" cy="125" r="6" className="fill-emerald-500 dark:fill-emerald-400" opacity="0.9">
          <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="305" cy="125" r="2.5" className="fill-white" />

        {/* NE India callout */}
        <line x1="305" y1="118" x2="305" y2="40" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="240" y="20" width="130" height="22" rx="4" className="fill-emerald-100 dark:fill-emerald-900" stroke="#34d399" strokeWidth="1" />
        <text x="305" y="35" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="bold">
          NE India (Humid Subtropical)
        </text>

        {/* Legend */}
        <g transform="translate(20, 285)">
          <rect x="0" y="0" width="12" height="10" className="fill-gray-100 dark:fill-gray-700" stroke="#9ca3af" strokeWidth="0.5" />
          <text x="16" y="9" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Polar</text>

          <rect x="60" y="0" width="12" height="10" className="fill-sky-200 dark:fill-sky-800" stroke="#9ca3af" strokeWidth="0.5" />
          <text x="76" y="9" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Continental</text>

          <rect x="150" y="0" width="12" height="10" className="fill-green-300 dark:fill-green-700" stroke="#9ca3af" strokeWidth="0.5" />
          <text x="166" y="9" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Temperate</text>

          <rect x="240" y="0" width="12" height="10" className="fill-yellow-200 dark:fill-yellow-800" stroke="#9ca3af" strokeWidth="0.5" />
          <text x="256" y="9" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Arid</text>

          <rect x="300" y="0" width="12" height="10" className="fill-red-200 dark:fill-red-900" stroke="#9ca3af" strokeWidth="0.5" />
          <text x="316" y="9" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Tropical</text>
        </g>
      </svg>
    </div>
  );
}
