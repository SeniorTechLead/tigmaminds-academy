export default function SoilHorizonDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 407 420" className="w-full max-w-xl mx-auto" role="img" aria-label="Soil horizons cross-section showing O, A, B, C horizons and bedrock">
        {/* Title */}
        <text x="175" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Soil Horizons (Layers)
        </text>

        {/* Surface decorations: grass and a small tree */}
        {/* Grass tufts */}
        {[60, 80, 110, 140, 160, 190, 210].map(x => (
          <g key={`grass-${x}`}>
            <line x1={x} y1={45} x2={x - 3} y2={35} className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
            <line x1={x} y1={45} x2={x + 3} y2={33} className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
          </g>
        ))}
        {/* Small tree */}
        <line x1="250" y1="45" x2="250" y2="20" className="stroke-amber-700 dark:stroke-amber-600" strokeWidth="3" />
        <circle cx="250" cy="16" r="12" className="fill-green-500 dark:fill-green-600" />

        {/* --- Soil layers --- */}
        {/* O Horizon — Organic / Leaf litter */}
        <rect x="40" y="45" width="200" height="25" className="fill-amber-900 dark:fill-amber-950" />
        {/* Leaf litter texture */}
        {[55, 80, 110, 140, 170, 200].map(x => (
          <ellipse key={`leaf-${x}`} cx={x} cy={57} rx="6" ry="2" className="fill-amber-700 dark:fill-amber-800" transform={`rotate(${(x * 3) % 30 - 15}, ${x}, 57)`} />
        ))}

        {/* A Horizon — Topsoil (dark) */}
        <rect x="40" y="70" width="200" height="60" className="fill-stone-800 dark:fill-stone-900" />
        {/* Root lines */}
        <path d="M 100,70 Q 95,90 105,110 Q 110,120 108,130" fill="none" className="stroke-amber-600 dark:stroke-amber-700" strokeWidth="1" />
        <path d="M 160,70 Q 155,85 165,100 Q 170,115 163,130" fill="none" className="stroke-amber-600 dark:stroke-amber-700" strokeWidth="1" />

        {/* B Horizon — Subsoil (clay, lighter brown) */}
        <rect x="40" y="130" width="200" height="75" className="fill-orange-800 dark:fill-orange-900" />
        {/* Clay texture dots */}
        {[60, 90, 120, 150, 180, 210].map(x => (
          <g key={`clay-${x}`}>
            <circle cx={x} cy={155} r="2" className="fill-orange-600 dark:fill-orange-700" opacity="0.5" />
            <circle cx={x + 15} cy={175} r="2" className="fill-orange-600 dark:fill-orange-700" opacity="0.5" />
          </g>
        ))}

        {/* C Horizon — Weathered rock */}
        <rect x="40" y="205" width="200" height="75" className="fill-stone-500 dark:fill-stone-600" />
        {/* Rock fragment shapes */}
        <polygon points="60,220 80,215 85,230 65,235" className="fill-stone-400 dark:fill-stone-500" />
        <polygon points="120,240 145,235 150,250 125,255" className="fill-stone-400 dark:fill-stone-500" />
        <polygon points="170,215 195,220 190,235 175,230" className="fill-stone-400 dark:fill-stone-500" />
        <polygon points="80,250 100,245 105,260 85,265" className="fill-stone-400 dark:fill-stone-500" />
        <polygon points="155,255 175,250 180,265 160,270" className="fill-stone-400 dark:fill-stone-500" />

        {/* R — Bedrock */}
        <rect x="40" y="280" width="200" height="70" className="fill-gray-600 dark:fill-gray-700" />
        {/* Bedrock crack lines */}
        <line x1="40" y1="295" x2="100" y2="300" className="stroke-gray-500 dark:stroke-gray-600" strokeWidth="1" />
        <line x1="100" y1="300" x2="140" y2="290" className="stroke-gray-500 dark:stroke-gray-600" strokeWidth="1" />
        <line x1="140" y1="310" x2="200" y2="315" className="stroke-gray-500 dark:stroke-gray-600" strokeWidth="1" />
        <line x1="60" y1="320" x2="120" y2="330" className="stroke-gray-500 dark:stroke-gray-600" strokeWidth="1" />
        <line x1="160" y1="325" x2="230" y2="335" className="stroke-gray-500 dark:stroke-gray-600" strokeWidth="1" />

        {/* Border */}
        <rect x="40" y="45" width="200" height="305" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* --- Labels (right side) --- */}
        {/* O Horizon */}
        <line x1="240" y1="57" x2="260" y2="57" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="265" y="53" className="fill-amber-700 dark:fill-amber-400" fontSize="11" fontWeight="bold">O Horizon</text>
        <text x="265" y="65" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Organic / Leaf litter</text>

        {/* A Horizon */}
        <line x1="240" y1="100" x2="260" y2="100" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="265" y="96" className="fill-stone-600 dark:fill-stone-300" fontSize="11" fontWeight="bold">A Horizon</text>
        <text x="265" y="108" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Topsoil (dark, humus)</text>

        {/* B Horizon */}
        <line x1="240" y1="168" x2="260" y2="168" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="265" y="164" className="fill-orange-600 dark:fill-orange-400" fontSize="11" fontWeight="bold">B Horizon</text>
        <text x="265" y="176" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Subsoil (clay, minerals)</text>

        {/* C Horizon */}
        <line x1="240" y1="242" x2="260" y2="242" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="265" y="238" className="fill-stone-400 dark:fill-stone-300" fontSize="11" fontWeight="bold">C Horizon</text>
        <text x="265" y="250" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Weathered rock</text>

        {/* R Bedrock */}
        <line x1="240" y1="315" x2="260" y2="315" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="265" y="311" className="fill-gray-500 dark:fill-gray-300" fontSize="11" fontWeight="bold">R (Bedrock)</text>
        <text x="265" y="323" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Solid, unweathered</text>

        {/* Depth scale (left side) */}
        <text x="30" y="58" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="9">0 cm</text>
        <text x="30" y="73" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="9">~5</text>
        <text x="30" y="133" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="9">~30</text>
        <text x="30" y="208" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="9">~80</text>
        <text x="30" y="283" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="9">~150+</text>

        {/* Depth label */}
        <text x="12" y="200" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(-90, 12, 200)">Depth (approx.)</text>
      </svg>
    </div>
  );
}
