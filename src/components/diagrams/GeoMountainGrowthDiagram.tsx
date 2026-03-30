export default function GeoMountainGrowthDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 420" className="w-full max-w-xl mx-auto" role="img" aria-label="Animated Himalaya plate collision showing Indian plate converging with Eurasian plate, mountain rising, and erosion">
        <defs>
          <style>{`
            @keyframes mg-plateLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-2px); }
            }
            @keyframes mg-plateRight {
              0% { transform: translateX(0); }
              100% { transform: translateX(2px); }
            }
            @keyframes mg-mountainRise {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @keyframes mg-erosionFall {
              0% { transform: translateY(0) translateX(0); opacity: 0.8; }
              100% { transform: translateY(30px) translateX(10px); opacity: 0; }
            }
            @keyframes mg-crumple {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.04); }
            }
            @keyframes mg-convect {
              0% { stroke-dashoffset: 20; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes mg-arrowPulse {
              0%, 100% { transform: translateX(0); opacity: 0.9; }
              50% { transform: translateX(-6px); opacity: 1; }
            }
            @keyframes mg-snowSparkle {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
            @keyframes mg-growArrow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            .mg-eurasian { animation: mg-plateLeft 4s ease-in-out infinite alternate; }
            .mg-indian { animation: mg-plateRight 4s ease-in-out infinite alternate; }
            .mg-mountain { transform-origin: 260px 190px; animation: mg-mountainRise 6s ease-in-out infinite; }
            .mg-erode { animation: mg-erosionFall 2.5s ease-in infinite; }
            .mg-erode2 { animation: mg-erosionFall 2.5s ease-in 0.8s infinite; }
            .mg-erode3 { animation: mg-erosionFall 2.5s ease-in 1.6s infinite; }
            .mg-erode4 { animation: mg-erosionFall 2.5s ease-in 0.4s infinite; }
            .mg-erode5 { animation: mg-erosionFall 2.5s ease-in 1.2s infinite; }
            .mg-erode6 { animation: mg-erosionFall 2.5s ease-in 2s infinite; }
            .mg-crumple { transform-origin: 260px 200px; animation: mg-crumple 6s ease-in-out infinite; }
            .mg-convL { stroke-dasharray: 8 4; animation: mg-convect 1.5s linear infinite; }
            .mg-convR { stroke-dasharray: 8 4; animation: mg-convect 1.5s linear infinite reverse; }
            .mg-indArrow { animation: mg-arrowPulse 2s ease-in-out infinite; }
            .mg-snow { animation: mg-snowSparkle 3s ease-in-out infinite; }
            .mg-snow2 { animation: mg-snowSparkle 3s ease-in-out 1s infinite; }
            .mg-growA { animation: mg-growArrow 1.5s ease-in-out infinite; }
          `}</style>

          <linearGradient id="mg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#bfdbfe] dark:[stop-color:#1e3a5f]" />
            <stop offset="100%" className="[stop-color:#e0f2fe] dark:[stop-color:#172554]" />
          </linearGradient>
          <linearGradient id="mg-mtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#d6d3d1] dark:[stop-color:#a8a29e]" />
            <stop offset="50%" className="[stop-color:#78716c] dark:[stop-color:#57534e]" />
            <stop offset="100%" className="[stop-color:#57534e] dark:[stop-color:#44403c]" />
          </linearGradient>
          <linearGradient id="mg-mantle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#fca5a5] dark:[stop-color:#7f1d1d]" />
            <stop offset="100%" className="[stop-color:#ef4444] dark:[stop-color:#450a0a]" />
          </linearGradient>
          <marker id="mg-arwG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" fill="#22c55e" />
          </marker>
          <marker id="mg-arwO" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8,0 L 0,3 L 8,6 Z" fill="#f97316" />
          </marker>
          <marker id="mg-arwR" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M 0,0 L 6,2.5 L 0,5 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="560" height="190" fill="url(#mg-sky)" />

        {/* Title */}
        <text x="280" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          How the Himalayas Grow — Plate Collision
        </text>

        {/* Mountain range (animated rising) */}
        <g className="mg-mountain">
          {/* Main peaks */}
          <path d="M 120,190 L 175,120 L 210,140 L 235,70 L 260,110 L 285,50 L 320,75 L 355,110 L 385,130 L 430,190 Z"
            fill="url(#mg-mtn)" />
          {/* Shading layer */}
          <path d="M 120,190 L 180,140 L 230,115 L 285,85 L 330,105 L 380,140 L 430,190 Z"
            className="fill-stone-500 dark:fill-stone-600" opacity="0.4" />

          {/* Snow caps */}
          <polygon className="mg-snow" points="220,90 235,70 250,90" fill="#fff" opacity="0.9" />
          <polygon className="mg-snow2" points="270,70 285,50 300,70" fill="#fff" opacity="0.9" />
          <polygon className="mg-snow" points="305,90 320,75 335,90" fill="#fff" opacity="0.85" />

          {/* Erosion particles falling off peaks */}
          <circle className="mg-erode" cx="285" cy="55" r="2" fill="#a8a29e" />
          <circle className="mg-erode2" cx="240" cy="75" r="1.5" fill="#78716c" />
          <circle className="mg-erode3" cx="322" cy="78" r="2" fill="#a8a29e" />
          <circle className="mg-erode4" cx="290" cy="58" r="1.5" fill="#d6d3d1" />
          <circle className="mg-erode5" cx="270" cy="62" r="2" fill="#78716c" />
          <circle className="mg-erode6" cx="310" cy="82" r="1.5" fill="#a8a29e" />
        </g>

        {/* Erosion label */}
        <text x="450" y="100" className="fill-amber-600 dark:fill-amber-400" fontSize="10">\u2193 Erosion wears</text>
        <text x="450" y="112" className="fill-amber-600 dark:fill-amber-400" fontSize="10">  peak down</text>
        <text x="450" y="124" className="fill-amber-500 dark:fill-amber-300" fontSize="10">  ~0.5 cm/yr</text>

        {/* Growth arrow (animated) */}
        <g className="mg-growA">
          <line x1="285" y1="42" x2="285" y2="22" stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#mg-arwG)" />
        </g>
        <text x="305" y="32" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="bold">+1 cm/yr</text>

        {/* Balance annotation */}
        <rect x="410" y="135" width="140" height="42" rx="4" className="fill-emerald-50 dark:fill-emerald-900/30" stroke="#22c55e" strokeWidth="1" />
        <text x="480" y="152" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="bold">Net growth: +0.5 cm/yr</text>
        <text x="480" y="168" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">Growing faster than eroding</text>

        {/* Height annotation */}
        <line x1="490" y1="50" x2="490" y2="190" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="482" y1="50" x2="498" y2="50" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="482" y1="190" x2="498" y2="190" stroke="#ef4444" strokeWidth="1.5" />
        <text x="520" y="115" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">8,849 m</text>
        <text x="520" y="128" className="fill-red-600 dark:fill-red-400" fontSize="10">(Everest)</text>

        {/* Ground surface */}
        <rect x="0" y="190" width="560" height="8" className="fill-green-300 dark:fill-green-700" />

        {/* Collision crumple zone */}
        <g className="mg-crumple">
          <path d="M 230,198 L 245,205 L 260,195 L 275,210 L 290,198 L 305,208 L 315,198"
            fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.6" />
          <path d="M 240,212 L 255,220 L 270,210 L 285,222 L 300,212"
            fill="none" stroke="#dc2626" strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Eurasian plate (left, moving slightly left) */}
        <g className="mg-eurasian">
          <rect x="0" y="198" width="265" height="55" className="fill-amber-200 dark:fill-amber-800" />
          <text x="90" y="232" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="12" fontWeight="bold">
            EURASIAN PLATE
          </text>
        </g>

        {/* Indian plate (right, moving north/left) */}
        <g className="mg-indian">
          <rect x="265" y="198" width="295" height="55" className="fill-orange-200 dark:fill-orange-800" />
          <text x="420" y="232" textAnchor="middle" className="fill-orange-800 dark:fill-orange-200" fontSize="12" fontWeight="bold">
            INDIAN PLATE
          </text>
          {/* India label */}
          <text x="420" y="246" textAnchor="middle" className="fill-orange-600 dark:fill-orange-300" fontSize="10">(India, moving north)</text>
        </g>

        {/* Movement arrow for Indian plate */}
        <g className="mg-indArrow">
          <line x1="380" y1="222" x2="295" y2="222" stroke="#f97316" strokeWidth="3" markerEnd="url(#mg-arwO)" />
        </g>
        <text x="330" y="218" textAnchor="middle" className="fill-orange-600 dark:fill-orange-400" fontSize="10" fontWeight="bold">5 cm/yr \u2190</text>

        {/* Collision zone indicator */}
        <path d="M 245,198 L 265,252 L 285,198 Z" fill="#dc2626" opacity="0.3" />
        <text x="265" y="270" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">Collision zone</text>

        {/* Mantle */}
        <rect x="0" y="253" width="560" height="70" fill="url(#mg-mantle)" opacity="0.4" />
        <text x="280" y="295" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="12" fontWeight="bold">
          MANTLE (slowly flowing rock)
        </text>

        {/* Convection currents (animated) */}
        <path className="mg-convL" d="M 80,315 Q 80,275 140,275 Q 200,275 200,315"
          fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#mg-arwR)" />
        <path className="mg-convR" d="M 360,315 Q 360,275 420,275 Q 480,275 480,315"
          fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#mg-arwR)" />

        {/* Timeline */}
        <rect x="20" y="330" width="520" height="82" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="280" y="348" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="12" fontWeight="bold">
          50 Million Years of Collision
        </text>
        <text x="280" y="366" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          India broke from Africa ~130 Mya, drifted north at 15 cm/yr, slammed into Asia ~50 Mya.
        </text>
        <text x="280" y="382" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          The collision crumpled crust upward — forming the Himalayas, still rising at ~1 cm/year.
        </text>
        <text x="280" y="398" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Erosion removes ~0.5 cm/yr, so net growth is about 0.5 cm/yr — 50 m per 10,000 years.
        </text>
      </svg>
    </div>
  );
}
