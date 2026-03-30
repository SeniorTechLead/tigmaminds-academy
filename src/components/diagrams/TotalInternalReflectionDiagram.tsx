export default function TotalInternalReflectionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 583 295" className="w-full max-w-lg mx-auto" role="img" aria-label="Total internal reflection showing three cases: below, at, and above the critical angle">
        <text x="250" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Total Internal Reflection</text>

        {/* Case 1: Below critical angle */}
        <g>
          <text x="83" y="40" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Below critical angle</text>

          {/* Glass medium (bottom) */}
          <rect x="15" y="120" width="136" height="100" rx="2" className="fill-sky-100 dark:fill-sky-900/40" opacity="0.6" />
          <text x="83" y="215" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontSize="10">glass (dense)</text>
          {/* Air medium (top) */}
          <text x="83" y="60" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">air</text>

          {/* Boundary line */}
          <line x1="15" y1="120" x2="151" y2="120" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

          {/* Normal */}
          <line x1="83" y1="70" x2="83" y2="190" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4,3" />

          {/* Incident ray (from inside glass going up) */}
          <line x1="45" y1="185" x2="83" y2="120" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" markerEnd="url(#tirArrowA)" />

          {/* Refracted ray (exits into air, bends away from normal) */}
          <line x1="83" y1="120" x2="130" y2="68" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#tirArrowB)" />

          {/* Weak reflected ray */}
          <line x1="83" y1="120" x2="121" y2="185" className="stroke-amber-300 dark:stroke-amber-500" strokeWidth="1" strokeDasharray="3,2" />

          <text x="55" y="155" className="fill-amber-600 dark:fill-amber-400" fontSize="10">θ</text>
          <text x="100" y="95" className="fill-blue-600 dark:fill-blue-400" fontSize="10">refracted</text>
        </g>

        {/* Case 2: At critical angle */}
        <g>
          <text x="250" y="40" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">At critical angle</text>

          <rect x="182" y="120" width="136" height="100" rx="2" className="fill-sky-100 dark:fill-sky-900/40" opacity="0.6" />
          <line x1="182" y1="120" x2="318" y2="120" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          <line x1="250" y1="70" x2="250" y2="190" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4,3" />

          {/* Incident ray */}
          <line x1="205" y1="185" x2="250" y2="120" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" markerEnd="url(#tirArrowA)" />

          {/* Refracted ray along surface */}
          <line x1="250" y1="120" x2="315" y2="120" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#tirArrowB)" />

          {/* Reflected ray */}
          <line x1="250" y1="120" x2="295" y2="185" className="stroke-amber-300 dark:stroke-amber-500" strokeWidth="1.5" strokeDasharray="3,2" />

          <text x="220" y="155" className="fill-amber-600 dark:fill-amber-400" fontSize="10">θc</text>
          <text x="285" y="112" className="fill-blue-600 dark:fill-blue-400" fontSize="10">along surface</text>
        </g>

        {/* Case 3: Above critical angle (TIR) */}
        <g>
          <text x="417" y="40" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Above critical angle</text>

          <rect x="349" y="120" width="136" height="100" rx="2" className="fill-sky-100 dark:fill-sky-900/40" opacity="0.6" />
          <line x1="349" y1="120" x2="485" y2="120" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          <line x1="417" y1="70" x2="417" y2="190" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4,3" />

          {/* Incident ray (more angled) */}
          <line x1="360" y1="175" x2="417" y2="120" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" markerEnd="url(#tirArrowA)" />

          {/* Total internal reflection (no refracted ray) */}
          <line x1="417" y1="120" x2="474" y2="175" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" markerEnd="url(#tirArrowR)" />

          <text x="385" y="150" className="fill-amber-600 dark:fill-amber-400" fontSize="10">θ&gt;θc</text>
          <text x="453" y="150" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">TIR!</text>

          {/* No light escapes */}
          <text x="435" y="85" textAnchor="middle" className="fill-red-400 dark:fill-red-300" fontSize="10">no light exits</text>
        </g>

        <text x="250" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Used in optical fibers, diamonds, and prisms</text>

        <defs>
          <marker id="tirArrowA" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-amber-500 dark:fill-amber-400" />
          </marker>
          <marker id="tirArrowB" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="tirArrowR" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
