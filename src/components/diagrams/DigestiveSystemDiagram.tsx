export default function DigestiveSystemDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 250 450" className="w-full max-w-xs mx-auto" role="img" aria-label="Digestive system diagram">
        {/* Title */}
        <text x="125" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Digestive System</text>

        {/* Mouth */}
        <ellipse cx="100" cy="48" rx="20" ry="12" className="fill-red-200 dark:fill-red-900" stroke="#ef4444" strokeWidth="1.5" />
        <text x="100" y="52" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="10" fontWeight="600">Mouth</text>
        <text x="175" y="48" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Chewing &amp;</text>
        <text x="175" y="60" className="fill-gray-500 dark:fill-gray-400" fontSize="10">saliva enzymes</text>

        {/* Esophagus */}
        <rect x="94" y="62" width="12" height="50" rx="4" className="fill-orange-200 dark:fill-orange-900" stroke="#f97316" strokeWidth="1.5" />
        <text x="100" y="90" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="10" fontWeight="600" transform="rotate(-90, 100, 90)">Esophagus</text>
        <text x="175" y="90" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Pushes food</text>
        <text x="175" y="102" className="fill-gray-500 dark:fill-gray-400" fontSize="10">down (peristalsis)</text>

        {/* Arrow down */}
        <line x1="100" y1="70" x2="100" y2="80" className="stroke-gray-400" strokeWidth="1" />

        {/* Stomach */}
        <path d="M 70,115 Q 60,140 65,170 Q 75,195 105,195 Q 130,190 135,165 Q 140,140 125,115 Q 110,108 70,115 Z"
          className="fill-yellow-200 dark:fill-yellow-900" stroke="#eab308" strokeWidth="1.5" />
        <text x="100" y="155" textAnchor="middle" className="fill-yellow-700 dark:fill-yellow-300" fontSize="11" fontWeight="600">Stomach</text>
        <text x="175" y="145" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Acid breaks</text>
        <text x="175" y="157" className="fill-gray-500 dark:fill-gray-400" fontSize="10">down food</text>
        <text x="175" y="169" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(pH ~2)</text>

        {/* Connection to small intestine */}
        <path d="M 120,192 Q 125,200 120,210" className="stroke-yellow-500" strokeWidth="3" fill="none" />

        {/* Small Intestine */}
        <path d="M 50,215 Q 40,225 50,235 Q 60,240 70,235 Q 80,225 90,235 Q 100,245 110,235 Q 120,225 130,235 Q 140,245 150,235 Q 155,225 145,215 Q 135,210 125,215 Q 115,225 105,215 Q 95,210 85,215 Q 75,225 65,215 Q 55,210 50,215 Z"
          className="fill-green-200 dark:fill-green-900" stroke="#22c55e" strokeWidth="1.5" />
        {/* More loops */}
        <path d="M 55,250 Q 45,260 55,270 Q 65,275 75,270 Q 85,260 95,270 Q 105,280 115,270 Q 125,260 135,270 Q 145,280 150,270 Q 155,260 145,250 Q 135,245 125,250 Q 115,260 105,250 Q 95,245 85,250 Q 75,260 65,250 Q 55,245 55,250 Z"
          className="fill-green-200 dark:fill-green-900" stroke="#22c55e" strokeWidth="1.5" />
        <text x="100" y="228" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="10" fontWeight="600">Small</text>
        <text x="100" y="265" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="10" fontWeight="600">Intestine</text>
        <text x="175" y="240" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Absorbs nutrients</text>
        <text x="175" y="252" className="fill-gray-500 dark:fill-gray-400" fontSize="10">into blood (~6m</text>
        <text x="175" y="264" className="fill-gray-500 dark:fill-gray-400" fontSize="10">long!)</text>

        {/* Connection */}
        <path d="M 100,285 Q 100,295 90,300" className="stroke-green-400" strokeWidth="2" fill="none" />

        {/* Large Intestine */}
        <path d="M 35,305 Q 30,335 40,360 Q 55,380 80,385 Q 120,390 145,380 Q 160,365 165,335 Q 165,310 155,300 Q 145,295 135,305 Q 130,320 130,340 Q 125,360 105,365 Q 80,368 65,355 Q 55,340 55,320 Q 58,310 65,305"
          className="fill-amber-200 dark:fill-amber-900" stroke="#d97706" strokeWidth="2" fill="none" />
        <text x="100" y="345" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="600">Large</text>
        <text x="100" y="358" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="600">Intestine</text>
        <text x="190" y="335" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Absorbs water</text>
        <text x="190" y="347" className="fill-gray-500 dark:fill-gray-400" fontSize="10">&amp; forms waste</text>

        {/* Food journey arrow along left side */}
        <line x1="25" y1="48" x2="25" y2="380" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,4" />
        <text x="18" y="210" className="fill-gray-400 dark:fill-gray-500" fontSize="10" transform="rotate(-90, 18, 210)">Food journey ↓</text>

        {/* Bottom summary */}
        <text x="125" y="430" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Food is broken down mechanically and chemically</text>
        <text x="125" y="443" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">as it moves through the digestive tract</text>
      </svg>
    </div>
  );
}
