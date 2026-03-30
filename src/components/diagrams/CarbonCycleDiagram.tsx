export default function CarbonCycleDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 558 434" className="w-full max-w-lg mx-auto" role="img" aria-label="Carbon cycle diagram">
        <defs>
          <marker id="ccArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
          <marker id="ccArrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-emerald-500" />
          </marker>
          <marker id="ccArrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-400" />
          </marker>
          <marker id="ccArrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-500" />
          </marker>
          <marker id="ccArrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-sky-500" />
          </marker>
        </defs>

        {/* Title */}
        <text x="250" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          The Carbon Cycle
        </text>

        {/* ── Nodes ── */}

        {/* Atmosphere (top center) */}
        <rect x="175" y="38" width="150" height="40" rx="20" className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="1.5" />
        <text x="250" y="55" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="11" fontWeight="bold">Atmosphere</text>
        <text x="250" y="69" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400" fontSize="10">(CO&#8322;)</text>

        {/* Plants (left) */}
        <rect x="30" y="150" width="110" height="45" rx="10" className="fill-emerald-100 dark:fill-emerald-900/25 stroke-emerald-500" strokeWidth="1.5" />
        <text x="85" y="170" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">Plants</text>
        <text x="85" y="184" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">(producers)</text>

        {/* Animals (right) */}
        <rect x="360" y="150" width="110" height="45" rx="10" className="fill-orange-100 dark:fill-orange-900/25 stroke-orange-400" strokeWidth="1.5" />
        <text x="415" y="170" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="11" fontWeight="bold">Animals</text>
        <text x="415" y="184" textAnchor="middle" className="fill-orange-600 dark:fill-orange-400" fontSize="10">(consumers)</text>

        {/* Soil / Decomposers (bottom-left) */}
        <rect x="30" y="280" width="130" height="45" rx="10" className="fill-amber-100 dark:fill-amber-900/25 stroke-amber-500" strokeWidth="1.5" />
        <text x="95" y="298" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">Soil / Decomposers</text>
        <text x="95" y="314" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">(bacteria, fungi)</text>

        {/* Fossil Fuels (bottom-right) */}
        <rect x="280" y="280" width="120" height="45" rx="10" className="fill-gray-200 dark:fill-gray-700 stroke-gray-500" strokeWidth="1.5" />
        <text x="340" y="298" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="11" fontWeight="bold">Fossil Fuels</text>
        <text x="340" y="314" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">(coal, oil, gas)</text>

        {/* Ocean (bottom center) */}
        <rect x="175" y="350" width="150" height="40" rx="20" className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-400" strokeWidth="1.5" />
        <text x="250" y="370" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">Ocean</text>
        <text x="250" y="384" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">(dissolved CO&#8322;)</text>

        {/* ── Arrows with process labels ── */}

        {/* Atmosphere → Plants (photosynthesis) — down-left */}
        <path d="M 190,78 Q 140,110 110,150" fill="none" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#ccArrowGreen)" />
        <text x="120" y="108" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600" transform="rotate(-40, 120, 108)">
          Photosynthesis
        </text>

        {/* Plants → Animals (eating / food chain) — right */}
        <path d="M 140,172 L 360,172" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#ccArrow)" />
        <text x="250" y="165" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Eating (food chain)</text>

        {/* Animals → Atmosphere (respiration) — up-right */}
        <path d="M 410,150 Q 380,110 320,78" fill="none" className="stroke-red-400" strokeWidth="2" markerEnd="url(#ccArrowRed)" />
        <text x="390" y="108" className="fill-red-500 dark:fill-red-400" fontSize="10" fontWeight="600" transform="rotate(40, 390, 108)">
          Respiration
        </text>

        {/* Plants → Atmosphere (respiration too) */}
        <path d="M 100,150 Q 140,110 185,78" fill="none" className="stroke-red-400" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#ccArrowRed)" />
        <text x="115" y="125" className="fill-red-400 dark:fill-red-400" fontSize="9">Respiration</text>

        {/* Plants → Soil (dead matter) — down */}
        <path d="M 85,195 L 85,280" fill="none" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#ccArrowAmber)" />
        <text x="72" y="240" className="fill-amber-600 dark:fill-amber-400" fontSize="10" transform="rotate(-90, 72, 240)">Dead matter</text>

        {/* Animals → Soil (dead matter) — down-left */}
        <path d="M 390,195 Q 300,250 160,290" fill="none" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#ccArrowAmber)" />
        <text x="290" y="258" className="fill-amber-600 dark:fill-amber-400" fontSize="9">Dead matter / waste</text>

        {/* Soil → Atmosphere (decomposition) — up-left */}
        <path d="M 50,280 Q 30,180 180,68" fill="none" className="stroke-amber-500" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#ccArrowAmber)" />
        <text x="22" y="210" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600" transform="rotate(-80, 22, 210)">
          Decomposition
        </text>

        {/* Soil → Fossil Fuels (millions of years) */}
        <path d="M 160,302 L 280,302" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#ccArrow)" />
        <text x="220" y="296" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Millions of years</text>

        {/* Fossil Fuels → Atmosphere (combustion) — up */}
        <path d="M 400,280 Q 440,180 320,70" fill="none" className="stroke-red-500" strokeWidth="2" markerEnd="url(#ccArrowRed)" />
        <text x="428" y="210" className="fill-red-500 dark:fill-red-400" fontSize="10" fontWeight="600" transform="rotate(70, 428, 210)">
          Combustion
        </text>

        {/* Atmosphere ↔ Ocean (dissolution) */}
        <path d="M 250,78 L 250,350" fill="none" className="stroke-sky-500" strokeWidth="0" />
        <path d="M 230,78 Q 200,200 210,350" fill="none" className="stroke-sky-500" strokeWidth="1.5" markerEnd="url(#ccArrowBlue)" />
        <path d="M 290,350 Q 300,200 270,78" fill="none" className="stroke-sky-500" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#ccArrowBlue)" />
        <text x="190" y="230" className="fill-sky-600 dark:fill-sky-400" fontSize="10" fontWeight="600" transform="rotate(-85, 190, 230)">
          Dissolution
        </text>
        <text x="310" y="230" className="fill-sky-600 dark:fill-sky-400" fontSize="9" transform="rotate(85, 310, 230)">
          Release
        </text>
      </svg>
    </div>
  );
}
