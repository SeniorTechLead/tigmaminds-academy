export default function MonsoonDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <svg
        viewBox="0 0 540 280"
        className="w-full"
        role="img"
        aria-label="Cross-section diagram showing summer monsoon mechanics: sun heats land, moist ocean air rushes in, hits mountains, rises and produces rain"
      >
        {/* Background sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:theme(colors.blue.200)] dark:[stop-color:theme(colors.blue.900)]" />
            <stop offset="100%" className="[stop-color:theme(colors.blue.50)] dark:[stop-color:theme(colors.gray.800)]" />
          </linearGradient>
          {/* Arrow marker */}
          <marker id="mArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="1.2" />
          </marker>
          <marker id="mArrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.2" />
          </marker>
          <marker id="mArrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.2" />
          </marker>
        </defs>

        <rect x="0" y="0" width="540" height="280" rx="6" fill="url(#skyGrad)" />

        {/* Title */}
        <text x="270" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-gray-100" fontFamily="sans-serif">
          Summer Monsoon
        </text>

        {/* ── Sun ── */}
        <circle cx="440" cy="48" r="22" className="fill-yellow-300 dark:fill-yellow-500" />
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={440 + Math.cos(rad) * 26}
              y1={48 + Math.sin(rad) * 26}
              x2={440 + Math.cos(rad) * 34}
              y2={48 + Math.sin(rad) * 34}
              className="stroke-yellow-500 dark:stroke-yellow-400"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        <text x="440" y="52" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-yellow-800 dark:fill-yellow-200" fontFamily="sans-serif">
          Sun
        </text>

        {/* ── Ocean (left side) ── */}
        <rect x="0" y="210" width="200" height="70" className="fill-blue-400 dark:fill-blue-700" />
        <text x="100" y="250" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-900 dark:fill-blue-200" fontFamily="sans-serif">
          Bay of Bengal
        </text>
        <text x="100" y="265" textAnchor="middle" fontSize="10" className="fill-blue-800 dark:fill-blue-300" fontFamily="sans-serif">
          (cooler)
        </text>
        {/* Waves */}
        <path d="M10,215 Q25,208 40,215 Q55,222 70,215 Q85,208 100,215 Q115,222 130,215 Q145,208 160,215 Q175,222 190,215" fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* ── Land (right side) ── */}
        <rect x="200" y="210" width="340" height="70" className="fill-amber-200 dark:fill-amber-800" />
        <text x="370" y="250" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-900 dark:fill-amber-200" fontFamily="sans-serif">
          Land (Assam plains)
        </text>
        <text x="370" y="265" textAnchor="middle" fontSize="10" className="fill-amber-800 dark:fill-amber-300" fontFamily="sans-serif">
          (heated by sun)
        </text>

        {/* ── Heat shimmer lines over land ── */}
        {[320, 370, 420].map((x) => (
          <path
            key={x}
            d={`M${x},205 Q${x + 5},195 ${x},185 Q${x - 5},175 ${x},165`}
            fill="none"
            className="stroke-red-400 dark:stroke-red-500"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        ))}
        <text x="430" y="172" fontSize="10" className="fill-red-600 dark:fill-red-400" fontFamily="sans-serif">
          Hot air rises
        </text>

        {/* Rising hot air arrow */}
        <line x1="370" y1="200" x2="370" y2="110" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#mArrowRed)" />

        {/* ── Moist ocean air arrows (horizontal, moving from ocean to land) ── */}
        <line x1="50" y1="195" x2="180" y2="195" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2.5" markerEnd="url(#mArrowBlue)" />
        <line x1="80" y1="180" x2="210" y2="155" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#mArrowBlue)" />
        <text x="90" y="174" fontSize="10" fontWeight="600" className="fill-blue-700 dark:fill-blue-300" fontFamily="sans-serif">
          Moist air rushes in
        </text>

        {/* ── Mountains (Meghalaya hills) ── */}
        <polygon
          points="230,210 260,140 275,125 290,118 305,130 320,145 340,210"
          className="fill-green-600 dark:fill-green-700 stroke-green-800 dark:stroke-green-500"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <text x="285" y="195" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-white dark:fill-green-100" fontFamily="sans-serif">
          Meghalaya
        </text>
        <text x="285" y="207" textAnchor="middle" fontSize="10" className="fill-green-100 dark:fill-green-200" fontFamily="sans-serif">
          Hills
        </text>

        {/* ── Air forced upward along mountain ── */}
        <path
          d="M225,185 Q250,140 275,110"
          fill="none"
          className="stroke-blue-600 dark:stroke-blue-400"
          strokeWidth="2"
          markerEnd="url(#mArrowBlue)"
        />
        <text x="220" y="130" fontSize="10" className="fill-blue-700 dark:fill-blue-300" fontFamily="sans-serif">
          Forced up
        </text>

        {/* ── Cloud and rain ── */}
        {/* Cloud shape */}
        <ellipse cx="280" cy="88" rx="40" ry="16" className="fill-gray-300 dark:fill-gray-500" />
        <ellipse cx="265" cy="82" rx="22" ry="14" className="fill-gray-200 dark:fill-gray-400" />
        <ellipse cx="295" cy="80" rx="24" ry="15" className="fill-gray-300 dark:fill-gray-500" />
        <ellipse cx="280" cy="76" rx="20" ry="12" className="fill-gray-200 dark:fill-gray-400" />
        <text x="280" y="82" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-200" fontFamily="sans-serif">
          Cools
        </text>

        {/* Rain drops */}
        {[260, 272, 284, 296].map((rx, i) => (
          <g key={i}>
            <line x1={rx} y1={100} x2={rx - 3} y2={115} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" strokeLinecap="round" />
            <line x1={rx + 6} y1={106} x2={rx + 3} y2={121} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}
        <text x="320" y="115" fontSize="11" fontWeight="700" className="fill-blue-700 dark:fill-blue-300" fontFamily="sans-serif">
          Rain!
        </text>

        {/* ── Step labels at bottom ── */}
        <rect x="5" y="35" width="185" height="60" rx="4" className="fill-white/70 dark:fill-gray-700/70" />
        <text x="12" y="50" fontSize="10" className="fill-gray-700 dark:fill-gray-200" fontFamily="sans-serif" fontWeight="600">How the monsoon works:</text>
        <text x="12" y="63" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontFamily="sans-serif">1. Sun heats land more than ocean</text>
        <text x="12" y="75" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontFamily="sans-serif">2. Hot air rises over land</text>
        <text x="12" y="87" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontFamily="sans-serif">3. Moist ocean air rushes in</text>

        {/* Low pressure label */}
        <text x="370" y="105" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400" fontFamily="sans-serif" fontWeight="600">
          Low pressure
        </text>
      </svg>
    </div>
  );
}
