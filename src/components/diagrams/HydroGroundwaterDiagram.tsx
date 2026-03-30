export default function HydroGroundwaterDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Underground water zones showing soil, unsaturated zone, water table, and saturated zone">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Groundwater — The Invisible Ocean Below
        </text>

        {/* Sky */}
        <rect x="0" y="28" width="520" height="42" className="fill-sky-100 dark:fill-sky-900/30" />
        {/* Rain */}
        <text x="60" y="48" className="fill-blue-500" fontSize="11">🌧</text>
        <text x="200" y="42" className="fill-blue-500" fontSize="11">🌧</text>
        <text x="400" y="45" className="fill-blue-500" fontSize="11">🌧</text>

        {/* Surface with trees */}
        <path d="M 0,70 Q 80,55 160,68 Q 240,78 320,62 Q 400,50 520,65 L 520,70 Z"
          className="fill-green-300 dark:fill-green-700" />
        {/* Trees */}
        <line x1="100" y1="70" x2="100" y2="55" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="2" />
        <circle cx="100" cy="50" r="8" className="fill-green-500 dark:fill-green-600" />
        <line x1="350" y1="62" x2="350" y2="47" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="2" />
        <circle cx="350" cy="42" r="8" className="fill-green-500 dark:fill-green-600" />

        {/* Infiltration arrows */}
        <text x="150" y="88" className="fill-blue-500 dark:fill-blue-400" fontSize="12">↓</text>
        <text x="250" y="88" className="fill-blue-500 dark:fill-blue-400" fontSize="12">↓</text>
        <text x="380" y="85" className="fill-blue-500 dark:fill-blue-400" fontSize="12">↓</text>
        <text x="260" y="82" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Infiltration</text>

        {/* Soil layer */}
        <rect x="0" y="70" width="520" height="30" className="fill-amber-300 dark:fill-amber-800" />
        <text x="470" y="90" textAnchor="end" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">Soil</text>

        {/* Unsaturated zone */}
        <rect x="0" y="100" width="520" height="70" className="fill-amber-100 dark:fill-amber-900/50" />
        {/* Grains with air gaps */}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={`u${i}`}>
            <circle cx={40 + (i % 6) * 80} cy={115 + Math.floor(i / 6) * 30} r="7"
              className="fill-amber-300 dark:fill-amber-700" opacity="0.6" />
          </g>
        ))}
        <text x="15" y="120" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Unsaturated</text>
        <text x="15" y="132" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Zone</text>
        <text x="15" y="148" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(air + some water</text>
        <text x="15" y="160" className="fill-gray-500 dark:fill-gray-400" fontSize="10">between grains)</text>

        {/* Water table — dashed line */}
        <line x1="0" y1="170" x2="520" y2="170" className="stroke-blue-500" strokeWidth="2.5" strokeDasharray="8 4" />
        <rect x="180" y="160" width="160" height="16" rx="3" className="fill-blue-500 dark:fill-blue-400" />
        <text x="260" y="172" textAnchor="middle" className="fill-white dark:fill-white" fontSize="11" fontWeight="bold">
          WATER TABLE
        </text>

        {/* Saturated zone */}
        <rect x="0" y="170" width="520" height="100" className="fill-blue-100 dark:fill-blue-900/40" />
        {/* Grains filled with water */}
        {Array.from({ length: 18 }, (_, i) => (
          <g key={`s${i}`}>
            <circle cx={35 + (i % 6) * 82} cy={190 + Math.floor(i / 6) * 25} r="7"
              className="fill-amber-300 dark:fill-amber-700" opacity="0.5" />
            <circle cx={35 + (i % 6) * 82} cy={190 + Math.floor(i / 6) * 25} r="3"
              className="fill-blue-400 dark:fill-blue-500" opacity="0.7" />
          </g>
        ))}
        <text x="15" y="195" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="bold">Saturated</text>
        <text x="15" y="207" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="bold">Zone</text>
        <text x="15" y="223" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(every space filled</text>
        <text x="15" y="235" className="fill-gray-500 dark:fill-gray-400" fontSize="10">with water)</text>

        {/* Impermeable rock */}
        <rect x="0" y="270" width="520" height="30" className="fill-gray-400 dark:fill-gray-600" />
        <text x="260" y="290" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">
          Impermeable rock (clay/granite) — water stops here
        </text>

        {/* Stats box */}
        <rect x="20" y="310" width="480" height="80" rx="6" className="fill-blue-50 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1" />
        <text x="260" y="328" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="11" fontWeight="bold">
          Groundwater by the Numbers
        </text>

        {/* Bar chart of freshwater distribution */}
        {/* Ice caps */}
        <rect x="50" y="340" width="200" height="14" rx="2" className="fill-cyan-300 dark:fill-cyan-600" />
        <text x="55" y="351" className="fill-cyan-900 dark:fill-cyan-100" fontSize="10">Ice caps & glaciers — 69%</text>
        {/* Groundwater */}
        <rect x="50" y="358" width="130" height="14" rx="2" className="fill-blue-400 dark:fill-blue-500" />
        <text x="55" y="369" className="fill-blue-900 dark:fill-blue-100" fontSize="10" fontWeight="bold">Groundwater — 30%</text>
        {/* Surface water */}
        <rect x="50" y="376" width="10" height="10" rx="2" className="fill-blue-600 dark:fill-blue-700" />
        <text x="65" y="385" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Rivers & lakes — &lt;1%</text>

        {/* 2 billion people callout */}
        <rect x="310" y="340" width="175" height="45" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="398" y="356" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">2 billion people</text>
        <text x="398" y="370" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">depend on groundwater</text>
        <text x="398" y="382" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">for drinking water</text>
      </svg>
    </div>
  );
}
