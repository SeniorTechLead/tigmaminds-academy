export default function LeopardGPSDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        className="w-full"
        role="img"
        aria-label="GPS trilateration diagram showing three satellites sending signals to a GPS collar on a clouded leopard, with overlapping circles pinpointing location"
      >
        <rect x="0" y="0" width="600" height="440" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="13" className="fill-gray-200" fontWeight="700">
          GPS Trilateration — Finding an Animal from Space
        </text>

        {/* Space region */}
        <rect x="10" y="38" width="580" height="120" rx="6" className="fill-slate-800/60" />
        <text x="20" y="56" fontSize="10" className="fill-gray-500">SPACE (~20,200 km altitude)</text>

        {/* Satellites */}
        {[
          { x: 120, y: 90, label: 'Satellite A', color: '#f59e0b' },
          { x: 300, y: 75, label: 'Satellite B', color: '#3b82f6' },
          { x: 480, y: 95, label: 'Satellite C', color: '#10b981' },
        ].map((sat, i) => (
          <g key={i}>
            {/* Satellite body */}
            <rect x={sat.x - 12} y={sat.y - 8} width="24" height="16" rx="3" fill={sat.color} opacity="0.9" />
            {/* Solar panels */}
            <rect x={sat.x - 28} y={sat.y - 5} width="14" height="10" rx="1" fill={sat.color} opacity="0.5" />
            <rect x={sat.x + 14} y={sat.y - 5} width="14" height="10" rx="1" fill={sat.color} opacity="0.5" />
            <text x={sat.x} y={sat.y + 28} textAnchor="middle" fontSize="10" fill={sat.color} fontWeight="600">
              {sat.label}
            </text>
            {/* Signal lines to ground */}
            <line x1={sat.x} y1={sat.y + 10} x2="300" y2="310" stroke={sat.color} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
          </g>
        ))}

        {/* Signal annotation */}
        <text x="535" y="145" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          Radio signals
        </text>
        <text x="535" y="155" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          at speed of light
        </text>

        {/* Ground region */}
        <rect x="10" y="168" width="580" height="262" rx="6" className="fill-emerald-950/30" />
        <text x="20" y="186" fontSize="10" className="fill-gray-500">GROUND — Nagaland forest</text>

        {/* Trilateration circles */}
        <circle cx="200" cy="290" r="130" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4" />
        <circle cx="380" cy="280" r="120" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4" />
        <circle cx="290" cy="360" r="100" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4" />

        {/* Overlap region highlight */}
        <circle cx="300" cy="310" r="14" className="fill-yellow-400/20" stroke="#fbbf24" strokeWidth="2" />

        {/* Leopard icon at intersection */}
        <g transform="translate(300, 310)">
          <circle r="6" className="fill-amber-400" />
          <text x="0" y="3" textAnchor="middle" fontSize="10">🐆</text>
        </g>

        {/* GPS collar label */}
        <line x1="314" y1="305" x2="380" y2="265" stroke="#fbbf24" strokeWidth="1" />
        <rect x="380" y="252" width="100" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#fbbf24" strokeWidth="1" />
        <text x="430" y="265" textAnchor="middle" fontSize="10" className="fill-yellow-300" fontWeight="600">GPS Collar</text>
        <text x="430" y="276" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">records lat/long</text>

        {/* Distance labels */}
        <text x="230" y="230" fontSize="10" className="fill-amber-400/80">d₁ = 21,400 km</text>
        <text x="370" y="225" fontSize="10" className="fill-blue-400/80">d₂ = 20,800 km</text>
        <text x="220" y="380" fontSize="10" className="fill-emerald-400/80">d₃ = 21,100 km</text>

        {/* How it works callout */}
        <rect x="20" y="395" width="560" height="35" rx="4" className="fill-slate-800/80" />
        <text x="300" y="410" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300">
          Each satellite measures distance by timing how long its signal takes to arrive.
        </text>
        <text x="300" y="423" textAnchor="middle" fontSize="10" className="fill-amber-300">
          3 distances = 3 circles. The one point where all 3 overlap = the animal’s exact location.
        </text>
      </svg>
    </div>
  );
}
