export default function HydroRiverStagesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 576 380" className="w-full max-w-xl mx-auto" role="img" aria-label="River valley stages showing young V-shaped valley, mature meandering valley, and old wide floodplain">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          River Valley Stages — How Water Carves Landscapes
        </text>

        {/* === YOUNG RIVER (left) === */}
        <rect x="5" y="30" width="165" height="220" rx="6" className="fill-blue-50 dark:fill-blue-900/15" stroke="#3b82f6" strokeWidth="1" />
        <text x="88" y="48" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">
          Young Stage
        </text>

        {/* V-shaped valley cross-section */}
        <path d="M 20,90 L 88,200 L 155,90 Z" className="fill-stone-300 dark:fill-stone-600" />
        {/* River at bottom of V */}
        <path d="M 78,185 Q 88,195 98,185 L 98,195 Q 88,205 78,195 Z" className="fill-blue-400 dark:fill-blue-500" />

        <text x="88" y="80" textAnchor="middle" className="fill-stone-600 dark:fill-stone-300" fontSize="10">V-shaped valley</text>
        <text x="30" y="120" className="fill-stone-700 dark:fill-stone-300" fontSize="10">Steep</text>
        <text x="120" y="120" className="fill-stone-700 dark:fill-stone-300" fontSize="10">Steep</text>

        {/* Characteristics */}
        <text x="88" y="218" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Fast flow, deep erosion</text>
        <text x="88" y="232" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Waterfalls & rapids</text>
        <text x="88" y="246" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Clear mountain water</text>

        {/* === MATURE RIVER (center) === */}
        <rect x="178" y="30" width="165" height="220" rx="6" className="fill-green-50 dark:fill-green-900/15" stroke="#22c55e" strokeWidth="1" />
        <text x="260" y="48" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">
          Mature Stage
        </text>

        {/* Wider valley with meanders */}
        <path d="M 190,130 Q 220,90 260,90 Q 300,90 330,130 L 330,180 Q 300,160 260,160 Q 220,160 190,180 Z"
          className="fill-stone-200 dark:fill-stone-600" />

        {/* Meandering river */}
        <path d="M 220,100 Q 240,85 260,100 Q 280,115 260,130 Q 240,145 260,160"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="6" strokeLinecap="round" />

        {/* Floodplain areas */}
        <rect x="195" y="155" width="55" height="15" className="fill-green-200 dark:fill-green-800" opacity="0.6" />
        <rect x="275" y="155" width="50" height="15" className="fill-green-200 dark:fill-green-800" opacity="0.6" />
        <text x="260" y="178" textAnchor="middle" className="fill-green-600 dark:fill-green-400" fontSize="10">Floodplain</text>

        <text x="260" y="80" textAnchor="middle" className="fill-stone-600 dark:fill-stone-300" fontSize="10">Wider valley</text>

        <text x="260" y="200" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Meanders develop</text>
        <text x="260" y="214" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Lateral erosion widens</text>
        <text x="260" y="228" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Sediment deposited on banks</text>
        <text x="260" y="246" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Muddier water</text>

        {/* === OLD RIVER (right) === */}
        <rect x="350" y="30" width="165" height="220" rx="6" className="fill-amber-50 dark:fill-amber-900/15" stroke="#f59e0b" strokeWidth="1" />
        <text x="433" y="48" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">
          Old Stage
        </text>

        {/* Very wide, flat valley */}
        <rect x="360" y="110" width="145" height="60" className="fill-green-100 dark:fill-green-900/30" />
        <text x="433" y="80" textAnchor="middle" className="fill-stone-600 dark:fill-stone-300" fontSize="10">Wide, flat floodplain</text>

        {/* Heavily meandering river */}
        <path d="M 370,120 Q 390,105 405,125 Q 420,150 440,130 Q 460,110 475,130 Q 490,150 500,135"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="5" strokeLinecap="round" />

        {/* Oxbow lake */}
        <ellipse cx="410" cy="155" rx="15" ry="8" className="fill-blue-300 dark:fill-blue-600" />
        <text x="432" y="158" className="fill-blue-700 dark:fill-blue-200" fontSize="10">Oxbow</text>
        <text x="432" y="170" className="fill-blue-700 dark:fill-blue-200" fontSize="10">lake</text>

        {/* Delta */}
        <path d="M 430,170 L 410,195 L 450,195 Z" className="fill-amber-200 dark:fill-amber-700" />
        <text x="430" y="192" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">Delta</text>

        <text x="433" y="216" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Extreme meanders</text>
        <text x="433" y="230" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Oxbow lakes form</text>
        <text x="433" y="246" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Heavy sediment (brown)</text>

        {/* Arrows between stages */}
        <text x="170" y="140" className="fill-gray-400 dark:fill-gray-500" fontSize="18" fontWeight="bold">→</text>
        <text x="342" y="140" className="fill-gray-400 dark:fill-gray-500" fontSize="18" fontWeight="bold">→</text>

        {/* Process summary */}
        <rect x="10" y="260" width="500" height="35" rx="4" className="fill-blue-100 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1" />
        <text x="260" y="275" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="10" fontWeight="bold">
          Three processes shape rivers: Erosion (picks up material) → Transportation (carries it) → Deposition (drops it)
        </text>
        <text x="260" y="289" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10">
          Fast water erodes more. Slow water deposits more. This is why rivers meander.
        </text>

        {/* Brahmaputra callout */}
        <rect x="20" y="305" width="480" height="65" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="323" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          The Brahmaputra — A Giant Old-Stage River
        </text>
        <text x="260" y="340" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Carries ~800 million tonnes of sediment per year — one of the muddiest rivers on Earth.
        </text>
        <text x="260" y="355" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          The Ganges-Brahmaputra Delta (100,000 km²) is the world's largest — most of Bangladesh sits on river sediment.
        </text>
      </svg>
    </div>
  );
}
