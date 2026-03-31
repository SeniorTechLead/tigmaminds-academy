const TrainMountainRouteDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 560"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing mountain railway engineering: switchbacks, loops, tunnels, and real Indian railways"
      >
        <style>{`
          .tm-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .tm-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .tm-section { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .tm-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tm-tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          @keyframes trainMove {
            0% { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }
        `}</style>

        <defs>
          <marker id="tm-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-600 dark:fill-gray-400" />
          </marker>
          <linearGradient id="tm-mountain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#94a3b8] dark:[stop-color:#475569]" />
            <stop offset="100%" className="[stop-color:#22c55e] dark:[stop-color:#166534]" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="620" height="560" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="310" y="26" textAnchor="middle" className="tm-title fill-gray-800 dark:fill-slate-100">
          Engineering a Mountain Railway
        </text>

        {/* === TOP LEFT: Switchback (zigzag) === */}
        <text x="155" y="52" textAnchor="middle" className="tm-section fill-amber-600 dark:fill-amber-400">
          Switchback (Zigzag Reverse)
        </text>

        {/* Mountain slope */}
        <polygon points="30,230 155,60 280,230"
          fill="url(#tm-mountain)" opacity="0.3" />

        {/* Zigzag track */}
        <polyline points="40,220 140,170 60,130 160,80"
          fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Direction arrows */}
        <text x="100" y="205" textAnchor="middle" className="tm-tiny fill-red-500 dark:fill-red-400">↗ Forward</text>
        <text x="90" y="155" textAnchor="middle" className="tm-tiny fill-red-500 dark:fill-red-400">↙ Reverse</text>
        <text x="120" y="108" textAnchor="middle" className="tm-tiny fill-red-500 dark:fill-red-400">↗ Forward</text>

        {/* Explanation */}
        <rect x="30" y="238" width="250" height="45" rx="4"
          className="fill-amber-50 dark:fill-amber-900/15 stroke-amber-300 dark:stroke-amber-800" strokeWidth="1" />
        <text x="155" y="254" textAnchor="middle" className="tm-small fill-amber-700 dark:fill-amber-300">
          Train reverses direction at each switchback.
        </text>
        <text x="155" y="268" textAnchor="middle" className="tm-tiny fill-amber-600 dark:fill-amber-400">
          Each leg is gentle (2-3%) but gains elevation with each reverse.
        </text>

        {/* === TOP RIGHT: Loop (spiral) === */}
        <text x="465" y="52" textAnchor="middle" className="tm-section fill-blue-600 dark:fill-blue-400">
          Loop (Spiral)
        </text>

        {/* Spiral track */}
        <path d="M 360,210 C 360,140 430,80 480,80 C 530,80 570,120 570,160 C 570,200 530,220 490,210 C 450,200 430,170 440,140 C 450,120 480,110 500,120"
          fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

        {/* Bridge where track crosses over itself */}
        <rect x="435" y="188" width="40" height="6" rx="2" fill="#60a5fa" opacity="0.5" />
        <line x1="435" y1="194" x2="435" y2="210" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <line x1="475" y1="194" x2="475" y2="210" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        <text x="455" y="230" textAnchor="middle" className="tm-tiny fill-blue-500 dark:fill-blue-400">
          Track crosses over itself
        </text>

        {/* Elevation labels */}
        <text x="360" y="218" className="tm-tiny fill-gray-500 dark:fill-gray-400">Start: 1800 m</text>
        <text x="488" y="115" className="tm-tiny fill-gray-500 dark:fill-gray-400">End: 1860 m</text>

        {/* Explanation */}
        <rect x="340" y="238" width="260" height="45" rx="4"
          className="fill-blue-50 dark:fill-blue-900/15 stroke-blue-300 dark:stroke-blue-800" strokeWidth="1" />
        <text x="470" y="254" textAnchor="middle" className="tm-small fill-blue-700 dark:fill-blue-300">
          Track spirals upward in a continuous loop.
        </text>
        <text x="470" y="268" textAnchor="middle" className="tm-tiny fill-blue-600 dark:fill-blue-400">
          Batasia Loop (Darjeeling): 360° turn gains 42 m elevation in 1 km.
        </text>

        {/* Divider */}
        <line x1="20" y1="298" x2="600" y2="298" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === MIDDLE: Tunnel cross-section === */}
        <text x="155" y="322" textAnchor="middle" className="tm-section fill-gray-700 dark:fill-gray-300">
          Tunnel: Cutting Through the Mountain
        </text>

        {/* Mountain with tunnel */}
        <polygon points="30,430 155,330 280,430"
          className="fill-gray-200 dark:fill-gray-700" />
        {/* Tunnel opening */}
        <ellipse cx="90" cy="420" rx="22" ry="28"
          className="fill-gray-800 dark:fill-gray-900" />
        <ellipse cx="220" cy="420" rx="22" ry="28"
          className="fill-gray-800 dark:fill-gray-900" />
        {/* Track through */}
        <line x1="68" y1="430" x2="242" y2="430" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />

        <text x="155" y="450" textAnchor="middle" className="tm-tiny fill-gray-600 dark:fill-gray-400">
          Tunnel 102 on Darjeeling line: carved through
        </text>
        <text x="155" y="462" textAnchor="middle" className="tm-tiny fill-gray-600 dark:fill-gray-400">
          solid rock, barely wider than the train
        </text>

        {/* === RIGHT: Elevation profile === */}
        <text x="465" y="322" textAnchor="middle" className="tm-section fill-emerald-600 dark:fill-emerald-400">
          Darjeeling Himalayan Railway
        </text>

        {/* Simplified elevation profile */}
        <polyline
          points="340,430 370,420 400,400 430,385 460,365 490,345 520,340 550,338 580,336"
          fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        {/* Fill under */}
        <polygon
          points="340,430 370,420 400,400 430,385 460,365 490,345 520,340 550,338 580,336 580,430 340,430"
          fill="#22c55e" opacity="0.1" />

        {/* Station dots */}
        {[
          { x: 340, y: 430, name: 'New Jalpaiguri', elev: '100 m' },
          { x: 430, y: 385, name: 'Kurseong', elev: '1483 m' },
          { x: 490, y: 345, name: 'Ghum', elev: '2258 m' },
          { x: 580, y: 336, name: 'Darjeeling', elev: '2076 m' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="4" fill="#22c55e" />
            <text x={s.x} y={s.y - 10} textAnchor="middle" className="tm-tiny fill-emerald-600 dark:fill-emerald-400" fontWeight="600">
              {s.name}
            </text>
            <text x={s.x} y={s.y + 14} textAnchor="middle" className="tm-tiny fill-gray-500 dark:fill-gray-400">
              {s.elev}
            </text>
          </g>
        ))}

        {/* Stats */}
        <text x="460" y="456" textAnchor="middle" className="tm-tiny fill-gray-600 dark:fill-gray-400">
          88 km • 5 switchbacks • 6 loops • 102+ tunnels • UNESCO World Heritage
        </text>

        {/* Divider */}
        <line x1="20" y1="476" x2="600" y2="476" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === BOTTOM: Two Indian railways comparison === */}
        {[
          { x: 30, name: 'Darjeeling Himalayan Railway', gauge: '610 mm (2 ft)', built: '1881', climb: '100 m → 2,258 m', length: '88 km', method: 'Loops + switchbacks', color: '#22c55e' },
          { x: 320, name: 'Nilgiri Mountain Railway', gauge: '1,000 mm (metre)', built: '1908', climb: '326 m → 2,203 m', length: '46 km', method: 'Rack-and-pinion', color: '#a855f7' },
        ].map((rly, i) => (
          <g key={i}>
            <rect x={rly.x} y="486" width="270" height="62" rx="6"
              className="fill-gray-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
            <text x={rly.x + 135} y="502" textAnchor="middle" className="tm-small" fill={rly.color} fontWeight="600">
              {rly.name}
            </text>
            <text x={rly.x + 10} y="518" className="tm-tiny fill-gray-600 dark:fill-gray-400">
              Gauge: {rly.gauge} • Built: {rly.built}
            </text>
            <text x={rly.x + 10} y="530" className="tm-tiny fill-gray-600 dark:fill-gray-400">
              Climb: {rly.climb} • {rly.length}
            </text>
            <text x={rly.x + 10} y="542" className="tm-tiny" fill={rly.color}>
              Method: {rly.method}
            </text>
          </g>
        ))}

      </svg>
    </div>
  );
};

export default TrainMountainRouteDiagram;
