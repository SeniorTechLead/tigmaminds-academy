export default function MapGPSDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 525 360"
        className="w-full"
        role="img"
        aria-label="How GPS works: three satellites send signals that intersect at your location"
      >
        <rect width="500" height="320" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          How GPS Works
        </text>

        {/* Satellites */}
        {[
          { x: 100, y: 60, label: "Satellite 1", r: 170 },
          { x: 250, y: 45, label: "Satellite 2", r: 185 },
          { x: 400, y: 60, label: "Satellite 3", r: 170 },
        ].map((sat, i) => (
          <g key={i}>
            {/* Satellite body */}
            <rect x={sat.x - 12} y={sat.y - 8} width="24" height="16" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            {/* Solar panels */}
            <rect x={sat.x - 26} y={sat.y - 5} width="12" height="10" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.5" />
            <rect x={sat.x + 14} y={sat.y - 5} width="12" height="10" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.5" />
            {/* Label */}
            <text x={sat.x} y={sat.y - 15} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
              {sat.label}
            </text>

            {/* Signal circle (range) */}
            <circle
              cx={sat.x}
              cy={sat.y}
              r={sat.r}
              fill="none"
              stroke={["#ef4444", "#3b82f6", "#22c55e"][i]}
              strokeWidth="1.2"
              strokeDasharray="6 3"
              opacity="0.5"
            />

            {/* Signal lines going down */}
            <line
              x1={sat.x}
              y1={sat.y + 10}
              x2={250}
              y2={215}
              stroke={["#ef4444", "#3b82f6", "#22c55e"][i]}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Ground */}
        <path d="M0,240 Q100,230 200,235 Q300,240 400,232 Q450,228 500,235 L500,260 L0,260Z" fill="#166534" stroke="#4ade80" strokeWidth="0.8" />

        {/* Your position — intersection point */}
        <circle cx="250" cy="215" r="7" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="250" cy="215" r="12" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />

        {/* Label for position */}
        <line x1="262" y1="210" x2="310" y2="190" stroke="#fbbf24" strokeWidth="0.8" />
        <text x="315" y="188" fontSize="11" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Your Position
        </text>
        <text x="315" y="200" fontSize="9" fill="#fcd34d" fontFamily="sans-serif">
          26.14°N, 91.74°E
        </text>

        {/* Legend */}
        <g>
          <text x="40" y="270" fontSize="9" fill="#ef4444" fontFamily="sans-serif">--- Signal from Sat 1</text>
          <text x="40" y="282" fontSize="9" fill="#3b82f6" fontFamily="sans-serif">--- Signal from Sat 2</text>
          <text x="40" y="294" fontSize="9" fill="#22c55e" fontFamily="sans-serif">--- Signal from Sat 3</text>
        </g>

        {/* Bottom caption */}
        <text x="250" y="310" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          3 satellites = your exact location. A 4th adds altitude.
        </text>
      </svg>
    </div>
  );
}
