export default function SlingCircularMotionDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Top-down view of a sling being swung in a circle showing velocity, centripetal force, and release point"
      >
        <defs>
          <marker id="scm-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="scm-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="scm-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="scm-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="30" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Circular Motion of David's Sling
        </text>

        {/* Center point - David's hand */}
        <circle cx="200" cy="210" r="8" className="fill-amber-400 dark:fill-amber-500" />
        <text x="200" y="240" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-amber-600 dark:fill-amber-300">Hand (pivot)</text>

        {/* Circular path - dashed */}
        <circle cx="200" cy="210" r="100" fill="none"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="8,5" />

        {/* Radius label */}
        <line x1="200" y1="210" x2="200" y2="115" className="stroke-slate-400 dark:stroke-slate-500"
          strokeWidth="1" strokeDasharray="3,3" />
        <text x="208" y="165" fontFamily="system-ui, sans-serif" fontSize="11"
          fontStyle="italic" className="fill-slate-500 dark:fill-slate-400">r</text>

        {/* Sling cord - to stone on the path (at ~45° from right) */}
        <line x1="200" y1="210" x2="271" y2="139"
          className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />

        {/* Stone on circular path */}
        <circle cx="271" cy="139" r="7" className="fill-stone-500 dark:fill-stone-400" />

        {/* Velocity vector - tangent to circle at stone position (perpendicular to radius, pointing up-right) */}
        <line x1="271" y1="139" x2="335" y2="75"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5"
          markerEnd="url(#scm-arrow-blue)" />
        <text x="340" y="72" fontFamily="system-ui, sans-serif" fontSize="11"
          fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">v (velocity)</text>

        {/* Centripetal force arrow - pointing from stone toward center */}
        <line x1="271" y1="139" x2="228" y2="182"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5"
          markerEnd="url(#scm-arrow-red)" />
        <text x="220" y="175" textAnchor="end" fontFamily="system-ui, sans-serif" fontSize="11"
          fontWeight="bold" className="fill-red-500 dark:fill-red-400">F (centripetal)</text>

        {/* Rotation arrow (curved) */}
        <path d="M 250,110 A 100,100 0 0,1 300,170" fill="none"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5"
          markerEnd="url(#scm-arrow-amber)" />

        {/* Release point - stone at top of circle */}
        <circle cx="300" cy="210" r="5" className="fill-green-500 dark:fill-green-400" />
        <text x="315" y="207" fontFamily="system-ui, sans-serif" fontSize="11"
          fontWeight="bold" className="fill-green-500 dark:fill-green-400">Release!</text>

        {/* Tangential path after release */}
        <line x1="300" y1="210" x2="440" y2="210"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="2"
          strokeDasharray="6,4" markerEnd="url(#scm-arrow-green)" />

        {/* Released stone flying */}
        <circle cx="430" cy="210" r="6" className="fill-green-600 dark:fill-green-400" />
        <text x="430" y="230" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-green-600 dark:fill-green-300">Stone flies</text>
        <text x="430" y="242" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-green-600 dark:fill-green-300">tangentially</text>

        {/* Formula box */}
        <rect x="30" y="290" width="200" height="70" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="130" y="313" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Centripetal Force
        </text>
        <text x="130" y="337" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="16" fontWeight="bold" className="fill-slate-800 dark:fill-slate-100">
          F = mv² / r
        </text>
        <text x="130" y="353" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Tension in the sling cord
        </text>

        {/* Key insight box */}
        <rect x="260" y="290" width="210" height="70" rx="8"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1.5" />
        <text x="365" y="313" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">
          Why tangent?
        </text>
        <text x="365" y="332" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          When the cord releases, no force
        </text>
        <text x="365" y="346" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          pulls inward — the stone continues
        </text>
        <text x="365" y="360" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          in its current direction of motion.
        </text>

        {/* Legend */}
        <line x1="30" y1="55" x2="55" y2="55" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="60" y="59" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Velocity (tangent)</text>
        <line x1="30" y1="72" x2="55" y2="72" stroke="#ef4444" strokeWidth="2.5" />
        <text x="60" y="76" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Centripetal force (inward)</text>
        <line x1="30" y1="89" x2="55" y2="89" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6,4" />
        <text x="60" y="93" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Path after release</text>
      </svg>
    </div>
  );
}
