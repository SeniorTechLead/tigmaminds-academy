export default function LimitDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 515 345" className="w-full max-w-lg mx-auto" role="img" aria-label="Limit concept diagram showing f(x) approaching L as x approaches a">
        {/* Axes */}
        <line x1="50" y1="260" x2="380" y2="260" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <line x1="50" y1="260" x2="50" y2="20" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="385" y="265" className="fill-gray-500 dark:fill-gray-400" fontSize="12">x</text>
        <text x="42" y="15" className="fill-gray-500 dark:fill-gray-400" fontSize="12">y</text>

        {/* Curve approaching the limit point */}
        <path
          d="M 70,230 Q 120,200 160,160 Q 200,120 230,95 Q 250,82 265,76"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />
        {/* Curve continuing after the gap */}
        <path
          d="M 285,68 Q 300,62 330,50 Q 360,40 380,35"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />

        {/* Open circle at the limit point (function may not be defined there) */}
        <circle cx="275" cy="72" r="5" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Dashed line from x=a up to the curve */}
        <line x1="275" y1="260" x2="275" y2="82" className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" strokeDasharray="5,4" />
        {/* Dashed line from y=L to the curve */}
        <line x1="50" y1="72" x2="270" y2="72" className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" strokeDasharray="5,4" />

        {/* Labels for a and L */}
        <text x="275" y="278" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="600">a</text>
        <text x="38" y="76" textAnchor="end" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="600">L</text>

        {/* Zoom-in magnification circle */}
        <circle cx="275" cy="72" r="35" fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="316" y="58" className="fill-amber-600 dark:fill-amber-400" fontSize="10">zoom in</text>

        {/* Approaching arrows from left */}
        <line x1="200" y1="105" x2="255" y2="78" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#limitArrow)" />
        {/* Approaching arrows from right */}
        <line x1="340" y1="45" x2="295" y2="66" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#limitArrow)" />

        {/* f(x) label on curve */}
        <text x="130" y="145" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="600">f(x)</text>

        {/* Main formula */}
        <text x="200" y="295" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          As x → a, f(x) → L
        </text>

        <defs>
          <marker id="limitArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
