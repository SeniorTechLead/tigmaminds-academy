export default function HeatTransferDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three modes of heat transfer: conduction, convection, and radiation">
        <defs>
          {/* Conduction: red-to-blue gradient along spoon */}
          <linearGradient id="ht-spoon-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          {/* Tea gradient */}
          <linearGradient id="ht-tea-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          {/* Convection: pot water gradient red bottom blue top */}
          <linearGradient id="ht-water-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          {/* Sun radial gradient */}
          <radialGradient id="ht-sun-grad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </radialGradient>
          {/* Arrow marker */}
          <marker id="ht-arrow-red" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4 Z" fill="#ef4444" />
          </marker>
          <marker id="ht-arrow-conv" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4 Z" fill="#f97316" />
          </marker>
        </defs>

        {/* ==================== Panel 1: Conduction ==================== */}
        <g transform="translate(0,0)">
          {/* Panel background */}
          <rect x="4" y="4" width="168" height="212" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />

          {/* Title */}
          <text x="90" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor">Conduction</text>

          {/* Cup body */}
          <path d="M50,70 L55,140 Q55,150 65,150 L115,150 Q125,150 125,140 L130,70 Z" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1.2" />
          {/* Tea inside cup */}
          <path d="M54,75 L57,138 Q57,146 67,146 L113,146 Q123,146 123,138 L126,75 Z" fill="url(#ht-tea-grad)" />
          {/* Steam wisps */}
          <path d="M75,68 Q73,58 78,50" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />
          <path d="M90,66 Q88,54 93,46" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />
          <path d="M105,68 Q103,58 108,50" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />
          {/* Cup handle */}
          <path d="M130,85 Q148,85 148,105 Q148,125 130,125" fill="none" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" />

          {/* Spoon — angled, dipping into tea */}
          <line x1="68" y1="120" x2="42" y2="42" stroke="url(#ht-spoon-grad)" strokeWidth="5" strokeLinecap="round" />
          {/* Spoon bowl */}
          <ellipse cx="70" cy="124" rx="7" ry="4" fill="#ef4444" opacity="0.8" />

          {/* Heat flow arrow along spoon */}
          <line x1="66" y1="108" x2="48" y2="56" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#ht-arrow-red)" />

          {/* Labels */}
          <text x="30" y="38" fontSize="10" fill="#3b82f6" fontWeight="600">Cool</text>
          <text x="62" y="142" fontSize="10" fill="#ef4444" fontWeight="600">Hot</text>

          {/* Subtitle */}
          <text x="90" y="172" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">Heat moves through</text>
          <text x="90" y="184" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">material</text>
        </g>

        {/* ==================== Panel 2: Convection ==================== */}
        <g transform="translate(184,0)">
          <rect x="4" y="4" width="168" height="212" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />

          {/* Title */}
          <text x="90" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor">Convection</text>

          {/* Stove burner */}
          <rect x="45" y="142" width="82" height="10" rx="3" fill="#78716c" />
          {/* Flame shapes */}
          <path d="M60,142 Q62,134 58,130 Q64,132 66,142" fill="#ef4444" />
          <path d="M78,142 Q80,132 76,128 Q82,130 84,142" fill="#f97316" />
          <path d="M96,142 Q98,134 94,130 Q100,132 102,142" fill="#ef4444" />
          <path d="M112,142 Q114,134 110,130 Q116,132 118,142" fill="#f97316" />

          {/* Pot body */}
          <rect x="48" y="70" width="76" height="72" rx="4" fill="#a1a1aa" stroke="#78716c" strokeWidth="1.2" />
          {/* Pot handles */}
          <rect x="40" y="74" width="10" height="6" rx="2" fill="#78716c" />
          <rect x="122" y="74" width="10" height="6" rx="2" fill="#78716c" />
          {/* Water inside */}
          <rect x="52" y="74" width="68" height="64" rx="2" fill="url(#ht-water-grad)" />

          {/* Convection current — left side going up */}
          <path d="M68,130 Q62,110 68,90" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#ht-arrow-conv)" />
          {/* Top across */}
          <path d="M70,88 Q86,80 102,88" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right side going down */}
          <path d="M104,90 Q110,110 104,130" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#ht-arrow-conv)" />
          {/* Bottom across */}
          <path d="M102,132 Q86,138 70,132" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />

          {/* Temperature labels */}
          <text x="134" y="86" fontSize="10" fill="#3b82f6" fontWeight="600">Cool</text>
          <text x="134" y="140" fontSize="10" fill="#ef4444" fontWeight="600">Hot</text>

          {/* Steam */}
          <path d="M72,68 Q70,60 74,54" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />
          <path d="M86,66 Q84,56 88,48" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />
          <path d="M100,68 Q98,60 102,54" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />

          {/* Subtitle */}
          <text x="90" y="172" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">Hot fluid rises,</text>
          <text x="90" y="184" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">cool fluid sinks</text>
        </g>

        {/* ==================== Panel 3: Radiation ==================== */}
        <g transform="translate(368,0)">
          <rect x="4" y="4" width="168" height="212" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />

          {/* Title */}
          <text x="86" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor">Radiation</text>

          {/* Sun */}
          <circle cx="44" cy="58" r="20" fill="url(#ht-sun-grad)" />
          {/* Sun rays */}
          <line x1="44" y1="34" x2="44" y2="28" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="42" x2="64" y2="37" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="42" x2="24" y2="37" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="58" x2="14" y2="58" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="74" x2="24" y2="79" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <text x="44" y="62" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400e">Sun</text>

          {/* Earth */}
          <circle cx="132" cy="130" r="18" fill="#3b82f6" />
          {/* Continents */}
          <path d="M124,122 Q128,118 134,120 Q138,124 136,128 Q130,126 124,122" fill="#22c55e" />
          <path d="M128,134 Q132,130 138,134 Q136,140 130,138" fill="#22c55e" />
          <text x="132" y="156" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">Earth</text>

          {/* Wavy radiation lines from sun to earth */}
          <path d="M66,64 Q74,58 82,64 Q90,70 98,64 Q106,58 114,64" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M62,76 Q70,70 78,76 Q86,82 94,76 Q102,70 110,76 Q118,82 122,80" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M58,88 Q66,82 74,88 Q82,94 90,88 Q98,82 106,88 Q114,94 118,92" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />

          {/* Arrow tips at end of waves */}
          <polygon points="114,64 118,60 118,68" fill="#f59e0b" />
          <polygon points="122,80 126,76 126,84" fill="#f97316" />
          <polygon points="118,92 122,88 122,96" fill="#ef4444" />

          {/* "No medium needed" label */}
          <text x="86" y="108" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5" fontStyle="italic">no medium needed</text>

          {/* Subtitle */}
          <text x="86" y="172" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">Energy travels</text>
          <text x="86" y="184" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">as waves</text>
        </g>
      </svg>
    </div>
  );
}
