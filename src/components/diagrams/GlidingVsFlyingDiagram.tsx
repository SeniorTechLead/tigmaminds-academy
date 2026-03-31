export default function GlidingVsFlyingDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of gliding (controlled descent, no energy input) vs powered flight (flapping adds energy)"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-sky-600 dark:fill-sky-400">
          Gliding vs Powered Flight
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          A glider always descends. A flier can climb.
        </text>

        {/* Gliding side */}
        <g transform="translate(0, 80)">
          <text x="200" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
            Gliding (Flying Squirrel)
          </text>

          {/* Tree */}
          <rect x="60" y="30" width="20" height="180" fill="#78350f" opacity="0.5" rx="3" />
          <circle cx="70" cy="25" r="25" fill="#22c55e" opacity="0.3" />

          {/* Glide path */}
          <line x1="80" y1="60" x2="350" y2="200" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="8 5" />

          {/* Squirrel silhouette */}
          <ellipse cx="200" cy="122" rx="30" ry="8" fill="#06b6d4" opacity="0.4" transform="rotate(-22, 200, 122)" />
          <circle cx="185" cy="115" r="5" fill="#06b6d4" opacity="0.5" />

          {/* Force arrows */}
          {/* Gravity */}
          <line x1="200" y1="130" x2="200" y2="170" stroke="#ef4444" strokeWidth="2" markerEnd="url(#glide-arr-r)" />
          <text x="215" y="160" fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="600">Gravity</text>

          {/* Lift */}
          <line x1="200" y1="115" x2="200" y2="85" stroke="#22c55e" strokeWidth="2" markerEnd="url(#glide-arr-g)" />
          <text x="215" y="88" fontSize="10" className="fill-green-500 dark:fill-green-400" fontWeight="600">Lift</text>

          {/* Drag */}
          <line x1="220" y1="122" x2="250" y2="135" stroke="#f97316" strokeWidth="2" markerEnd="url(#glide-arr-o)" />
          <text x="255" y="140" fontSize="10" className="fill-orange-500 dark:fill-orange-400" fontWeight="600">Drag</text>

          <text x="200" y="230" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
            Always loses altitude
          </text>
          <text x="200" y="248" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
            No energy input after launch
          </text>
          <text x="200" y="266" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-cyan-600 dark:fill-cyan-400">
            Gravity is the engine
          </text>
        </g>

        {/* Powered flight side */}
        <g transform="translate(380, 80)">
          <text x="200" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-violet-600 dark:fill-violet-400">
            Powered Flight (Bird)
          </text>

          {/* Flight path - can go up */}
          <path d="M 60 200 Q 150 150 200 100 Q 250 70 340 60" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="8 5" />

          {/* Bird silhouette */}
          <g transform="translate(200, 100)">
            <path d="M 0 0 L -20 -12 L -8 0 L -20 12 Z" fill="#8b5cf6" opacity="0.4" />
            <circle cx="5" cy="0" r="4" fill="#8b5cf6" opacity="0.5" />
          </g>

          {/* Force arrows */}
          <line x1="205" y1="108" x2="205" y2="140" stroke="#ef4444" strokeWidth="2" markerEnd="url(#glide-arr-r)" />
          <text x="220" y="135" fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="600">Gravity</text>

          <line x1="205" y1="95" x2="205" y2="65" stroke="#22c55e" strokeWidth="2" markerEnd="url(#glide-arr-g)" />
          <text x="220" y="70" fontSize="10" className="fill-green-500 dark:fill-green-400" fontWeight="600">Lift</text>

          {/* Thrust */}
          <line x1="210" y1="100" x2="240" y2="90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#glide-arr-b)" />
          <text x="245" y="88" fontSize="10" className="fill-blue-500 dark:fill-blue-400" fontWeight="600">Thrust</text>

          <text x="200" y="230" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
            Can gain altitude
          </text>
          <text x="200" y="248" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
            Flapping adds energy continuously
          </text>
          <text x="200" y="266" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">
            Muscles are the engine
          </text>
        </g>

        <defs>
          <marker id="glide-arr-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#ef4444" />
          </marker>
          <marker id="glide-arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#22c55e" />
          </marker>
          <marker id="glide-arr-o" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f97316" />
          </marker>
          <marker id="glide-arr-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Summary */}
        <rect x="100" y="380" width="580" height="60" rx="10" className="fill-sky-50 dark:fill-sky-950" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="390" y="402" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-sky-700 dark:fill-sky-300">
          Flying squirrels convert gravitational potential energy into horizontal distance.
        </text>
        <text x="390" y="420" textAnchor="middle" fontSize="11" className="fill-sky-600 dark:fill-sky-400">
          Birds convert metabolic (food) energy into both altitude and distance. Gliding is cheaper but one-way.
        </text>
      </svg>
    </div>
  );
}
