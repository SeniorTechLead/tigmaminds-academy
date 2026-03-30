export default function GeoFossilDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 380" className="w-full max-w-xl mx-auto" role="img" aria-label="Four-step fossilization process from organism death to discovery">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          How Fossils Form — 4 Steps Over Millions of Years
        </text>

        {/* Step 1 */}
        <rect x="10" y="35" width="240" height="140" rx="6" className="fill-blue-50 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1" />
        <text x="130" y="52" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">
          Step 1: Death & Burial
        </text>
        {/* Water surface */}
        <path d="M 20,90 Q 50,85 80,90 Q 110,95 140,90 Q 170,85 200,90 Q 230,95 240,90" fill="none" className="stroke-blue-400" strokeWidth="1.5" />
        {/* Sediment */}
        <rect x="20" y="110" width="220" height="55" rx="3" className="fill-amber-200 dark:fill-amber-800" />
        {/* Fish skeleton */}
        <path d="M 90,128 L 160,128" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" />
        <path d="M 100,120 L 110,128 L 100,136" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <path d="M 120,120 L 125,128 L 120,136" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <path d="M 140,120 L 145,128 L 140,136" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <ellipse cx="165" cy="128" rx="8" ry="6" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <circle cx="167" cy="127" r="1.5" className="fill-gray-600 dark:fill-gray-300" />
        <path d="M 85,125 L 90,128 L 85,131 Z" className="fill-gray-600 dark:fill-gray-300" />
        <text x="130" y="155" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          Organism buried quickly in sediment
        </text>

        {/* Step 2 */}
        <rect x="270" y="35" width="240" height="140" rx="6" className="fill-orange-50 dark:fill-orange-900/20" stroke="#f97316" strokeWidth="1" />
        <text x="390" y="52" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="11" fontWeight="bold">
          Step 2: Soft Parts Decay
        </text>
        {/* More sediment layers */}
        <rect x="280" y="75" width="220" height="20" className="fill-amber-100 dark:fill-amber-900/40" />
        <rect x="280" y="95" width="220" height="20" className="fill-amber-200 dark:fill-amber-800" />
        <rect x="280" y="115" width="220" height="40" className="fill-amber-300 dark:fill-amber-700" />
        {/* Just bones */}
        <path d="M 350,132 L 420,132" className="stroke-gray-100 dark:stroke-gray-300" strokeWidth="2" />
        <path d="M 360,125 L 365,132 L 360,139" fill="none" className="stroke-gray-100 dark:stroke-gray-300" strokeWidth="1" />
        <path d="M 380,125 L 385,132 L 380,139" fill="none" className="stroke-gray-100 dark:stroke-gray-300" strokeWidth="1" />
        <path d="M 400,125 L 405,132 L 400,139" fill="none" className="stroke-gray-100 dark:stroke-gray-300" strokeWidth="1" />
        <ellipse cx="425" cy="132" rx="8" ry="6" fill="none" className="stroke-gray-100 dark:stroke-gray-300" strokeWidth="1" />
        <text x="390" y="165" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="10">
          Only hard parts (bones, shells) remain
        </text>

        {/* Arrow 1→2 */}
        <text x="256" y="108" className="fill-gray-500 dark:fill-gray-400" fontSize="16" fontWeight="bold">→</text>

        {/* Step 3 */}
        <rect x="10" y="195" width="240" height="140" rx="6" className="fill-purple-50 dark:fill-purple-900/20" stroke="#9333ea" strokeWidth="1" />
        <text x="130" y="212" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">
          Step 3: Petrification
        </text>
        {/* Deep rock layers */}
        <rect x="20" y="225" width="220" height="15" className="fill-stone-200 dark:fill-stone-700" />
        <rect x="20" y="240" width="220" height="15" className="fill-stone-300 dark:fill-stone-600" />
        <rect x="20" y="255" width="220" height="30" className="fill-stone-400 dark:fill-stone-500" />
        {/* Mineralized fossil */}
        <path d="M 90,268 L 160,268" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2.5" />
        <path d="M 100,261 L 105,268 L 100,275" fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <path d="M 120,261 L 125,268 L 120,275" fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <path d="M 140,261 L 145,268 L 140,275" fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <ellipse cx="165" cy="268" rx="8" ry="6" fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        {/* Mineral arrows */}
        <text x="55" y="248" className="fill-blue-500" fontSize="10">H₂O + minerals</text>
        <text x="55" y="260" className="fill-blue-500" fontSize="10">↓ replace bone</text>
        <text x="130" y="310" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10">
          Minerals replace bone molecule by molecule
        </text>
        <text x="130" y="323" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">
          (millions of years — turns to stone)
        </text>

        {/* Step 4 */}
        <rect x="270" y="195" width="240" height="140" rx="6" className="fill-emerald-50 dark:fill-emerald-900/20" stroke="#10b981" strokeWidth="1" />
        <text x="390" y="212" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">
          Step 4: Exposure & Discovery
        </text>
        {/* Eroded hillside */}
        <path d="M 280,310 L 350,230 L 500,230 L 500,310 Z" className="fill-amber-200 dark:fill-amber-800" />
        <path d="M 280,310 L 350,250 L 500,250 L 500,310 Z" className="fill-stone-300 dark:fill-stone-600" />
        {/* Fossil visible in rock face */}
        <path d="M 340,275 L 380,275" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2.5" />
        <path d="M 350,270 L 353,275 L 350,280" fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <path d="M 365,270 L 368,275 L 365,280" fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        {/* Sun and rain */}
        <text x="430" y="248" className="fill-yellow-500" fontSize="14">☀</text>
        <text x="460" y="265" className="fill-blue-400" fontSize="11">🌧</text>
        {/* Erosion arrows */}
        <path d="M 440,260 L 400,290" className="stroke-blue-400" strokeWidth="1" strokeDasharray="3 2" />
        <text x="390" y="323" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10">
          Erosion and tectonic uplift bring
        </text>
        <text x="390" y="336" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">
          the fossil back to the surface
        </text>

        {/* Arrow 2→3 (down) */}
        <text x="125" y="188" className="fill-gray-500 dark:fill-gray-400" fontSize="16" fontWeight="bold">↓</text>

        {/* Arrow 3→4 */}
        <text x="256" y="270" className="fill-gray-500 dark:fill-gray-400" fontSize="16" fontWeight="bold">→</text>

        {/* Timeline bar */}
        <rect x="40" y="355" width="440" height="18" rx="9" className="fill-gray-100 dark:fill-gray-800" stroke="#9ca3af" strokeWidth="1" />
        <rect x="40" y="355" width="55" height="18" rx="9" className="fill-blue-300 dark:fill-blue-600" />
        <rect x="95" y="355" width="55" height="18" className="fill-orange-300 dark:fill-orange-600" />
        <rect x="150" y="355" width="275" height="18" className="fill-purple-300 dark:fill-purple-600" />
        <rect x="425" y="355" width="55" height="18" rx="9" className="fill-emerald-300 dark:fill-emerald-600" />
        <text x="68" y="368" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="10">Days</text>
        <text x="123" y="368" textAnchor="middle" className="fill-orange-900 dark:fill-orange-100" fontSize="10">Years</text>
        <text x="288" y="368" textAnchor="middle" className="fill-purple-900 dark:fill-purple-100" fontSize="10">Millions of years</text>
        <text x="453" y="368" textAnchor="middle" className="fill-emerald-900 dark:fill-emerald-100" fontSize="10">Now</text>
      </svg>
    </div>
  );
}
