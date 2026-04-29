export default function BeeColonyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 412" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee colony diagram showing queen, worker, and drone roles">
        <rect width="520" height="380" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Colony Roles</text>

        {/* Hive background */}
        <ellipse cx="260" cy="210" rx="220" ry="150" fill="#78350f" opacity="0.15" />

        {/* Queen — center */}
        <g>
          <ellipse cx="260" cy="140" rx="50" ry="30" fill="#f59e0b" opacity="0.9" />
          <ellipse cx="260" cy="140" rx="50" ry="30" fill="none" stroke="#fbbf24" strokeWidth="2" />
          {/* Crown */}
          <polygon points="240,110 245,120 250,108 255,120 260,106 265,120 270,108 275,120 280,110" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <text x="260" y="138" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-gray-100 dark:fill-slate-800">QUEEN</text>
          <text x="260" y="150" textAnchor="middle" fontSize="8" className="fill-gray-100 dark:fill-slate-800">1 per colony</text>
        </g>

        {/* Queen role box */}
        <rect x="140" y="68" width="240" height="22" rx="4" fill="#fbbf24" opacity="0.15" />
        <text x="260" y="83" textAnchor="middle" fontSize="9" fill="#fcd34d">Lays up to 2,000 eggs/day &bull; releases pheromones to unify colony</text>

        {/* Workers — left cluster */}
        {[
          { x: 100, y: 210 },
          { x: 130, y: 240 },
          { x: 80, y: 250 },
          { x: 110, y: 280 },
          { x: 150, y: 270 },
        ].map((pos, i) => (
          <g key={`w${i}`}>
            <ellipse cx={pos.x} cy={pos.y} rx="22" ry="13" fill="#eab308" opacity="0.8" />
            <line x1={pos.x - 12} y1={pos.y - 12} x2={pos.x - 8} y2={pos.y - 18} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
            <line x1={pos.x + 12} y1={pos.y - 12} x2={pos.x + 8} y2={pos.y - 18} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
            {/* Stripes */}
            <line x1={pos.x - 8} y1={pos.y} x2={pos.x + 8} y2={pos.y} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" opacity="0.6" />
          </g>
        ))}
        <text x="115" y="310" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#eab308">WORKERS</text>
        <text x="115" y="324" textAnchor="middle" fontSize="9" fill="#fcd34d">All female</text>
        <text x="115" y="338" textAnchor="middle" fontSize="9" fill="#fcd34d">~60,000 per colony</text>

        {/* Worker tasks */}
        <rect x="20" y="345" width="200" height="26" rx="4" fill="#eab308" opacity="0.12" />
        <text x="120" y="362" textAnchor="middle" fontSize="8" fill="#fcd34d">Foraging &bull; Nursing &bull; Building &bull; Guarding &bull; Cleaning</text>

        {/* Drones — right cluster */}
        {[
          { x: 400, y: 220 },
          { x: 430, y: 250 },
          { x: 380, y: 260 },
        ].map((pos, i) => (
          <g key={`d${i}`}>
            <ellipse cx={pos.x} cy={pos.y} rx="26" ry="15" fill="#a16207" opacity="0.7" />
            {/* Big eyes */}
            <circle cx={pos.x - 10} cy={pos.y - 8} r="5" className="fill-gray-100 dark:fill-slate-800" opacity="0.6" />
            <circle cx={pos.x + 10} cy={pos.y - 8} r="5" className="fill-gray-100 dark:fill-slate-800" opacity="0.6" />
            {/* Stripes */}
            <line x1={pos.x - 10} y1={pos.y + 2} x2={pos.x + 10} y2={pos.y + 2} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" opacity="0.5" />
          </g>
        ))}
        <text x="405" y="300" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a16207">DRONES</text>
        <text x="405" y="314" textAnchor="middle" fontSize="9" fill="#d97706">All male</text>
        <text x="405" y="328" textAnchor="middle" fontSize="9" fill="#d97706">~1,000 per colony</text>

        {/* Drone tasks */}
        <rect x="310" y="340" width="190" height="26" rx="4" fill="#a16207" opacity="0.12" />
        <text x="405" y="357" textAnchor="middle" fontSize="8" fill="#d97706">Sole purpose: mate with queen &bull; No stinger</text>

        {/* Connecting lines */}
        <line x1="230" y1="155" x2="130" y2="200" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />
        <line x1="290" y1="155" x2="390" y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />
      </svg>
    </div>
  );
}
