export default function NEIndiaBiomesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 660 343" className="w-full max-w-xl mx-auto" role="img" aria-label="Northeast India biomes elevation cross-section from Brahmaputra valley to alpine peaks">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="540" height="300" fill="url(#skyGrad)" className="dark:opacity-20" />
        <rect x="0" y="0" width="540" height="300" className="fill-gray-900 dark:block hidden opacity-0 dark:opacity-80" />

        {/* Mountain profile */}
        <path
          d="M 0,260 L 80,255 Q 140,250 180,230 Q 220,210 270,170 Q 320,130 370,90 Q 420,55 460,35 Q 490,25 510,30 L 540,40 L 540,260 Z"
          className="fill-emerald-800 dark:fill-emerald-900" opacity="0.3"
        />

        {/* Elevation bands */}
        {/* Valley floor */}
        <rect x="0" y="240" width="130" height="20" rx="2" className="fill-emerald-600 dark:fill-emerald-700" opacity="0.6" />
        {/* Subtropical hills */}
        <path d="M 120,220 Q 170,210 220,195 L 220,230 Q 170,240 120,245 Z" className="fill-emerald-500 dark:fill-emerald-600" opacity="0.5" />
        {/* Temperate */}
        <path d="M 220,170 Q 280,140 340,110 L 340,190 Q 280,195 220,200 Z" className="fill-teal-400 dark:fill-teal-600" opacity="0.4" />
        {/* Alpine */}
        <path d="M 340,60 Q 400,40 460,30 L 460,110 Q 400,110 340,115 Z" className="fill-sky-300 dark:fill-sky-700" opacity="0.4" />

        {/* Snow cap */}
        <path d="M 440,25 Q 470,18 500,22 Q 510,28 500,35 Q 470,30 440,32 Z" className="fill-white dark:fill-gray-300" opacity="0.8" />

        {/* Vegetation icons - Valley: dense trees */}
        {[20, 45, 70, 95].map(x => (
          <g key={`tree${x}`}>
            <rect x={x - 2} y="232" width="4" height="12" className="fill-amber-800 dark:fill-amber-700" />
            <circle cx={x} cy="226" r="8" className="fill-emerald-500 dark:fill-emerald-400" />
          </g>
        ))}

        {/* Subtropical: medium trees */}
        {[155, 180].map(x => (
          <g key={`stree${x}`}>
            <rect x={x - 2} y="218" width="4" height="10" className="fill-amber-800 dark:fill-amber-700" />
            <polygon points={`${x - 7},220 ${x + 7},220 ${x},206`} className="fill-emerald-400 dark:fill-emerald-500" />
          </g>
        ))}

        {/* Temperate: pine trees */}
        {[260, 290].map(x => (
          <g key={`pine${x}`}>
            <rect x={x - 1.5} y="155" width="3" height="10" className="fill-amber-800 dark:fill-amber-700" />
            <polygon points={`${x - 6},160 ${x + 6},160 ${x},142`} className="fill-teal-500 dark:fill-teal-400" />
          </g>
        ))}

        {/* Alpine: small shrubs */}
        {[370, 395].map(x => (
          <g key={`shrub${x}`}>
            <ellipse cx={x} cy="80" rx="6" ry="4" className="fill-lime-400 dark:fill-lime-600" />
          </g>
        ))}

        {/* Elevation labels */}
        <text x="50" y="270" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="10" fontWeight="bold">Brahmaputra Valley</text>
        <text x="50" y="282" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Tropical Evergreen</text>
        <text x="50" y="293" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">~50-200m</text>

        <text x="175" y="250" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="10" fontWeight="bold">Hills</text>
        <text x="175" y="262" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Subtropical</text>
        <text x="175" y="273" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">200-1500m</text>

        <text x="310" y="195" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="10" fontWeight="bold">Mountains</text>
        <text x="310" y="207" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Temperate</text>
        <text x="310" y="218" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">1500-3500m</text>

        <text x="435" y="120" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="10" fontWeight="bold">Peaks</text>
        <text x="435" y="132" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Alpine</text>
        <text x="435" y="143" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">&gt;3500m</text>

        {/* Elevation arrow */}
        <line x1="520" y1="260" x2="520" y2="30" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#biomeArrow)" />
        <text x="530" y="150" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(90, 530, 150)">Elevation</text>

        <defs>
          <marker id="biomeArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
