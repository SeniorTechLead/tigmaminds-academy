export default function HydroDesalinationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Reverse osmosis desalination diagram showing seawater being forced through semipermeable membrane to produce fresh water">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Reverse Osmosis — Turning Seawater into Drinking Water
        </text>

        {/* Main RO chamber */}
        <rect x="40" y="50" width="440" height="180" rx="8" className="fill-gray-100 dark:fill-gray-800" stroke="#6b7280" strokeWidth="2" />

        {/* Seawater input side (left) */}
        <rect x="50" y="60" width="180" height="160" rx="4" className="fill-blue-200 dark:fill-blue-800" />
        <text x="140" y="82" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="11" fontWeight="bold">
          SEAWATER
        </text>
        <text x="140" y="96" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10">
          (35 g salt/litre)
        </text>

        {/* Salt ions (Na+ and Cl-) */}
        {[
          [80, 120], [120, 140], [160, 115], [90, 160], [150, 170],
          [100, 185], [170, 150], [130, 110], [70, 145], [180, 130],
        ].map(([cx, cy], i) => (
          <g key={`salt${i}`}>
            <circle cx={cx} cy={cy} r="5" className={i % 2 === 0 ? 'fill-red-400 dark:fill-red-500' : 'fill-green-400 dark:fill-green-500'} opacity="0.8" />
            <text x={cx} y={Number(cy) + 3} textAnchor="middle" className="fill-white" fontSize="7">
              {i % 2 === 0 ? 'Na' : 'Cl'}
            </text>
          </g>
        ))}

        {/* Water molecules on left */}
        {[[110, 130], [80, 170], [160, 160], [130, 195]].map(([cx, cy], i) => (
          <circle key={`wl${i}`} cx={cx} cy={cy} r="3" className="fill-blue-500 dark:fill-blue-400" />
        ))}

        {/* Pressure arrow */}
        <rect x="55" y="200" width="160" height="16" rx="3" className="fill-orange-200 dark:fill-orange-800" />
        <text x="135" y="212" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="10" fontWeight="bold">
          HIGH PRESSURE →  50-80 atm
        </text>

        {/* Membrane (center barrier) */}
        <rect x="235" y="55" width="12" height="170" rx="2" className="fill-purple-300 dark:fill-purple-600" />
        {/* Membrane pores */}
        {[80, 110, 140, 170, 200].map((y) => (
          <circle key={`pore${y}`} cx="241" cy={y} r="2.5" className="fill-purple-100 dark:fill-purple-400" />
        ))}
        <text x="241" y="48" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="bold">
          Semipermeable
        </text>
        <text x="241" y="236" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="bold">
          Membrane
        </text>

        {/* Water passing through arrows */}
        <text x="252" y="95" className="fill-blue-500" fontSize="10">→</text>
        <text x="252" y="125" className="fill-blue-500" fontSize="10">→</text>
        <text x="252" y="155" className="fill-blue-500" fontSize="10">→</text>
        <text x="252" y="185" className="fill-blue-500" fontSize="10">→</text>

        {/* Salt blocked */}
        <text x="222" y="105" className="fill-red-500" fontSize="10">✕</text>
        <text x="222" y="145" className="fill-red-500" fontSize="10">✕</text>
        <text x="222" y="175" className="fill-red-500" fontSize="10">✕</text>

        {/* Fresh water output side (right) */}
        <rect x="252" y="60" width="220" height="160" rx="4" className="fill-sky-100 dark:fill-sky-900/40" />
        <text x="362" y="82" textAnchor="middle" className="fill-sky-700 dark:fill-sky-200" fontSize="11" fontWeight="bold">
          FRESH WATER
        </text>
        <text x="362" y="96" textAnchor="middle" className="fill-sky-600 dark:fill-sky-300" fontSize="10">
          (salt removed)
        </text>

        {/* Only water molecules on right */}
        {[
          [300, 120], [340, 140], [380, 115], [310, 160], [370, 170],
          [320, 185], [400, 135], [350, 195], [290, 145], [430, 155],
        ].map(([cx, cy], i) => (
          <circle key={`wr${i}`} cx={cx} cy={cy} r="3.5" className="fill-blue-400 dark:fill-blue-500" />
        ))}

        {/* Output label */}
        <rect x="290" y="200" width="160" height="16" rx="3" className="fill-sky-200 dark:fill-sky-800" />
        <text x="370" y="212" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="10" fontWeight="bold">
          Clean drinking water
        </text>

        {/* Brine output */}
        <path d="M 140,220 L 140,250 L 80,250" fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2" markerEnd="url(#desalArrow)" />
        <text x="40" y="248" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">Brine</text>
        <text x="40" y="260" className="fill-red-500 dark:fill-red-400" fontSize="10">(super-salty)</text>

        <defs>
          <marker id="desalArrow" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8,0 L 0,3 L 8,6 Z" className="fill-red-400" />
          </marker>
        </defs>

        {/* How it works explanation */}
        <rect x="20" y="272" width="480" height="55" rx="6" className="fill-purple-50 dark:fill-purple-900/20" stroke="#9333ea" strokeWidth="1" />
        <text x="260" y="290" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">
          How Reverse Osmosis Works
        </text>
        <text x="260" y="306" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          The membrane has pores so tiny (0.1 nm) that water molecules (0.28 nm) squeeze through,
        </text>
        <text x="260" y="320" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          but hydrated salt ions (0.7 nm) are too large to pass. High pressure forces water through "backwards."
        </text>

        {/* Energy comparison */}
        <rect x="20" y="335" width="480" height="55" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="353" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          Energy Cost Comparison
        </text>
        {/* RO bar */}
        <rect x="50" y="360" width="80" height="12" rx="2" className="fill-green-400 dark:fill-green-600" />
        <text x="140" y="371" className="fill-gray-600 dark:fill-gray-300" fontSize="10">RO: 3-5 kWh/m³</text>
        {/* Distillation bar */}
        <rect x="50" y="376" width="250" height="12" rx="2" className="fill-red-400 dark:fill-red-600" />
        <text x="310" y="387" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Distillation: 25+ kWh/m³ (6× more!)</text>
      </svg>
    </div>
  );
}
