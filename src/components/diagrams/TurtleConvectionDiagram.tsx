export default function TurtleConvectionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Convection currents in Earth's mantle: hot rock rises near core, spreads sideways pushing plates, cools and sinks back down in a continuous cycle"
      >
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Convection Currents: The Engine of Plate Tectonics
        </text>

        {/* Cross-section of mantle */}
        <g transform="translate(50, 55)">
          <rect width="600" height="280" rx="8" className="fill-red-50 dark:fill-red-950/20" stroke="#ef4444" strokeWidth="1" />

          {/* Crust at top */}
          <rect x="0" y="0" width="600" height="24" rx="8" fill="#78350f" opacity="0.4" />
          <text x="300" y="16" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-amber-900 dark:fill-amber-200">CRUST (Tectonic Plates)</text>

          {/* Plates with gap */}
          <rect x="10" y="0" width="270" height="24" rx="4" fill="#92400e" opacity="0.3" />
          <rect x="320" y="0" width="270" height="24" rx="4" fill="#92400e" opacity="0.3" />
          <text x="295" y="16" textAnchor="middle" fontSize="18" className="fill-red-600 dark:fill-red-400">\u2195</text>

          {/* Plate movement arrows at top */}
          <line x1="250" y1="12" x2="180" y2="12" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-conv-y)" />
          <line x1="350" y1="12" x2="420" y2="12" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-conv-y)" />

          {/* Mantle label */}
          <text x="300" y="50" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-red-700 dark:fill-red-300">MANTLE</text>

          {/* Left convection cell */}
          <g>
            {/* Rising hot (red) */}
            <path d="M300,230 Q300,130 300,50" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arr-conv-r)" />
            <text x="315" y="140" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Hot rock rises</text>

            {/* Spreading left */}
            <path d="M280,55 Q200,45 100,55" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arr-conv-o)" />
            <text x="190" y="42" fontSize="10" className="fill-orange-600 dark:fill-orange-400">Spreads sideways</text>

            {/* Sinking cold (blue) on left */}
            <path d="M80,60 Q80,140 80,230" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arr-conv-bl)" />
            <text x="55" y="140" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400" transform="rotate(-90, 55, 140)">Cool rock sinks</text>

            {/* Bottom return */}
            <path d="M100,240 Q200,250 280,240" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" markerEnd="url(#arr-conv-p)" />
          </g>

          {/* Right convection cell (mirror) */}
          <g>
            <path d="M320,55 Q400,45 500,55" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arr-conv-o)" />
            <text x="410" y="42" fontSize="10" className="fill-orange-600 dark:fill-orange-400">Spreads sideways</text>

            <path d="M520,60 Q520,140 520,230" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arr-conv-bl)" />
            <text x="545" y="140" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400" transform="rotate(90, 545, 140)">Cool rock sinks</text>

            <path d="M500,240 Q400,250 320,240" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" markerEnd="url(#arr-conv-p)" />
          </g>

          {/* Core at bottom */}
          <rect x="150" y="255" width="300" height="22" rx="6" fill="#fbbf24" opacity="0.4" />
          <text x="300" y="270" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">CORE (5,200\u00b0C \u2014 heats mantle from below)</text>
        </g>

        {/* Key insight */}
        <rect x="50" y="350" width="600" height="40" rx="6" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="368" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-800 dark:fill-amber-200">
          Convection moves plates 2\u201315 cm/year \u2014 about as fast as your fingernails grow
        </text>
        <text x="350" y="383" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Over millions of years, this slow motion builds mountains, opens oceans, and causes earthquakes
        </text>

        <defs>
          <marker id="arr-conv-r" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
            <path d="M0,8 L4,0 L8,8" fill="#ef4444" />
          </marker>
          <marker id="arr-conv-y" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f59e0b" />
          </marker>
          <marker id="arr-conv-o" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f97316" />
          </marker>
          <marker id="arr-conv-bl" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M0,0 L4,8 L8,0" fill="#3b82f6" />
          </marker>
          <marker id="arr-conv-p" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
