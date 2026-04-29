export default function HydroAquiferDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 534 380" className="w-full max-w-xl mx-auto" role="img" aria-label="Cross-section showing aquifer, water table, and well">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Aquifers — Underground Sponges That Store Water
        </text>

        {/* Sky */}
        <rect x="0" y="28" width="520" height="42" className="fill-sky-100 dark:fill-sky-900/30" />

        {/* Surface with hills */}
        <path d="M 0,70 Q 60,50 120,65 Q 200,80 260,60 Q 320,45 380,62 Q 440,75 520,55 L 520,70 Z"
          className="fill-green-300 dark:fill-green-700" />

        {/* Rain drops */}
        <text x="80" y="48" className="fill-blue-500 dark:fill-blue-400" fontSize="11">🌧</text>
        <text x="200" y="42" className="fill-blue-500 dark:fill-blue-400" fontSize="11">🌧</text>
        <text x="400" y="45" className="fill-blue-500 dark:fill-blue-400" fontSize="11">🌧</text>

        {/* Soil layer */}
        <rect x="0" y="70" width="520" height="35" className="fill-amber-200 dark:fill-amber-800" />
        <text x="10" y="90" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Soil</text>

        {/* Unsaturated zone */}
        <rect x="0" y="105" width="520" height="55" className="fill-amber-100 dark:fill-amber-900/50" />
        <text x="10" y="128" className="fill-amber-600 dark:fill-amber-300" fontSize="10">Unsaturated zone</text>
        <text x="10" y="140" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(air + some water)</text>

        {/* Water table line */}
        <line x1="0" y1="160" x2="520" y2="160" className="stroke-blue-500" strokeWidth="2" strokeDasharray="6 3" />
        <text x="420" y="155" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="bold">↓ Water Table</text>

        {/* Aquifer (permeable rock, saturated) */}
        <rect x="0" y="160" width="520" height="90" className="fill-blue-100 dark:fill-blue-900/40" />
        {/* Dots to show porous rock */}
        {Array.from({ length: 18 }, (_, i) => (
          <g key={i}>
            <circle cx={30 + (i % 6) * 85} cy={180 + Math.floor(i / 6) * 25} r="8"
              className="fill-amber-300 dark:fill-amber-700" opacity="0.5" />
            <circle cx={30 + (i % 6) * 85} cy={180 + Math.floor(i / 6) * 25} r="3"
              className="fill-blue-400 dark:fill-blue-500" opacity="0.7" />
          </g>
        ))}
        <text x="260" y="235" textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="11" fontWeight="bold">
          AQUIFER (saturated permeable rock)
        </text>

        {/* Impermeable layer below */}
        <rect x="0" y="250" width="520" height="40" className="fill-gray-400 dark:fill-gray-600" />
        <text x="260" y="275" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">
          Impermeable rock (clay / granite) — water cannot pass
        </text>

        {/* Well */}
        <rect x="305" y="60" width="10" height="135" className="fill-gray-500 dark:fill-gray-400" />
        <rect x="300" y="55" width="20" height="10" rx="2" className="fill-gray-600 dark:fill-gray-300" />
        <text x="335" y="72" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">Well</text>

        {/* Water level in well matches water table */}
        <rect x="307" y="160" width="6" height="30" className="fill-blue-400 dark:fill-blue-500" opacity="0.8" />

        {/* Arrows showing water percolation */}
        <text x="150" y="120" className="fill-blue-500" fontSize="14">↓</text>
        <text x="350" y="120" className="fill-blue-500" fontSize="14">↓</text>

        {/* Bottom explanation */}
        <rect x="30" y="300" width="460" height="65" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="318" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">
          An aquifer is rock or gravel with tiny spaces that hold water — like a giant underground sponge.
        </text>
        <text x="260" y="334" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          Rain soaks down through soil until it hits the water table.
        </text>
        <text x="260" y="350" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          A well is simply a hole drilled down to where the rock is already full of water.
        </text>
      </svg>
    </div>
  );
}
