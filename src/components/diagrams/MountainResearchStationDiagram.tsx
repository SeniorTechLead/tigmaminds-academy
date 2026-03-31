export default function MountainResearchStationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 429"
        className="w-full"
        role="img"
        aria-label="High-altitude research station at 4000 metres with solar panels, weather instruments, and satellite dish sending data to a laptop"
      >
        <rect x="0" y="0" width="600" height="400" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          High-Altitude Research Station
        </text>

        {/* Mountain background */}
        <defs>
          <linearGradient id="mtnResGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <polygon
          points="0,340 60,260 140,180 220,120 300,90 360,100 440,150 520,230 580,290 600,340"
          fill="url(#mtnResGrad)"
        />
        <polygon
          points="0,340 60,260 140,180 220,120 300,90 360,100 440,150 520,230 580,290 600,340"
          fill="none"
          className="stroke-gray-500"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Snow cap */}
        <polygon points="220,120 300,90 360,100 330,98 270,110" className="fill-white/25" />

        {/* Snow particles */}
        {[260, 280, 300, 320, 340, 290, 310].map((x, i) => (
          <circle key={i} cx={x} cy={60 + (i * 17) % 30} r="1" className="fill-white/40" />
        ))}

        {/* ── Research Station Building ── */}
        <g transform="translate(250, 170)">
          {/* Building body */}
          <rect x="-40" y="0" width="80" height="45" rx="3" className="fill-gray-600 stroke-gray-400" strokeWidth="1.5" />
          {/* Roof */}
          <polygon points="-45,-8 0,-20 45,-8 45,0 -45,0" className="fill-gray-500 stroke-gray-400" strokeWidth="1" />
          {/* Door */}
          <rect x="-8" y="20" width="16" height="25" rx="2" className="fill-amber-900/60 stroke-amber-700" strokeWidth="0.5" />
          <circle cx="5" cy="33" r="1.5" className="fill-amber-400" />
          {/* Windows */}
          <rect x="-32" y="8" width="14" height="10" rx="1" className="fill-amber-400/40 stroke-gray-400" strokeWidth="0.5" />
          <rect x="18" y="8" width="14" height="10" rx="1" className="fill-amber-400/40 stroke-gray-400" strokeWidth="0.5" />
          {/* Window glow */}
          <rect x="-32" y="8" width="14" height="10" rx="1" className="fill-amber-200/20" />
          <rect x="18" y="8" width="14" height="10" rx="1" className="fill-amber-200/20" />
        </g>

        {/* ── Solar Panels ── */}
        <g transform="translate(180, 155)">
          {/* Panel rack */}
          <line x1="0" y1="15" x2="0" y2="0" className="stroke-gray-400" strokeWidth="2" />
          <rect x="-18" y="-8" width="36" height="12" rx="1" className="fill-blue-600/60 stroke-blue-400" strokeWidth="1" transform="rotate(-20,-18,-8)" />
          {/* Grid lines on panel */}
          <line x1="-14" y1="-4" x2="14" y2="-12" className="stroke-blue-400/40" strokeWidth="0.5" />
          <line x1="-10" y1="2" x2="18" y2="-6" className="stroke-blue-400/40" strokeWidth="0.5" />
          {/* Sun ray to panel */}
          <line x1="-30" y1="-40" x2="-5" y2="-10" className="stroke-amber-300/40" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* ── Weather Instruments ── */}
        <g transform="translate(320, 148)">
          {/* Mast */}
          <line x1="0" y1="22" x2="0" y2="-30" className="stroke-gray-400" strokeWidth="2" />
          {/* Anemometer cups */}
          <g transform="translate(0, -28)">
            <line x1="-10" y1="0" x2="10" y2="0" className="stroke-gray-300" strokeWidth="1.5" />
            <line x1="0" y1="-10" x2="0" y2="10" className="stroke-gray-300" strokeWidth="1.5" />
            <circle cx="-10" cy="0" r="3" className="fill-gray-500 dark:fill-gray-400" />
            <circle cx="10" cy="0" r="3" className="fill-gray-500 dark:fill-gray-400" />
            <circle cx="0" cy="-10" r="3" className="fill-gray-500 dark:fill-gray-400" />
            <circle cx="0" cy="10" r="3" className="fill-gray-500 dark:fill-gray-400" />
          </g>
          {/* Wind vane */}
          <polygon points="8,-12 15,-15 8,-18" className="fill-amber-400/60" />
          {/* Temperature sensor */}
          <rect x="4" y="-5" width="6" height="14" rx="2" className="fill-white/30 stroke-gray-300" strokeWidth="0.5" />
          <text x="20" y="-20" fontSize="7" className="fill-gray-600 dark:fill-gray-300">
            Anemometer
          </text>
          <text x="20" y="-10" fontSize="7" className="fill-gray-600 dark:fill-gray-300">
            Temp sensor
          </text>
        </g>

        {/* ── Satellite Dish ── */}
        <g transform="translate(350, 155)">
          {/* Dish stand */}
          <line x1="0" y1="15" x2="0" y2="-5" className="stroke-gray-400" strokeWidth="2" />
          {/* Dish */}
          <path d="M-12,-5 Q0,-18 12,-5" fill="none" className="stroke-gray-300" strokeWidth="2" />
          <circle cx="0" cy="-8" r="2" className="fill-gray-600 dark:fill-gray-300" />
        </g>

        {/* ── Signal waves to satellite ── */}
        <defs>
          <marker id="satArr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" className="fill-green-400/60" />
          </marker>
        </defs>
        {/* Signal arcs */}
        {[1, 2, 3].map((r, i) => (
          <path
            key={i}
            d={`M${350 + i * 8},${140 - i * 12} Q${360 + i * 15},${120 - i * 20} ${370 + i * 20},${100 - i * 25}`}
            fill="none"
            className="stroke-green-400/40"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {/* Satellite icon */}
        <g transform="translate(440, 45)">
          <rect x="-4" y="-3" width="8" height="6" rx="1" className="fill-gray-500 dark:fill-gray-400" />
          <rect x="-16" y="-2" width="12" height="4" rx="0.5" className="fill-blue-400/50" />
          <rect x="4" y="-2" width="12" height="4" rx="0.5" className="fill-blue-400/50" />
          <text x="0" y="14" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
            Satellite
          </text>
        </g>

        {/* ── Data flow to laptop ── */}
        <path d="M440,55 Q480,80 490,120 Q500,160 490,200" fill="none" className="stroke-green-400/40" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#satArr)" />

        {/* Laptop */}
        <g transform="translate(475, 210)">
          {/* Screen */}
          <rect x="-20" y="-18" width="40" height="28" rx="2" className="fill-gray-700 stroke-gray-500" strokeWidth="1" />
          {/* Screen content — data lines */}
          <line x1="-14" y1="-10" x2="14" y2="-10" className="stroke-green-400/50" strokeWidth="1" />
          <line x1="-14" y1="-4" x2="8" y2="-4" className="stroke-blue-400/50" strokeWidth="1" />
          <line x1="-14" y1="2" x2="12" y2="2" className="stroke-amber-400/50" strokeWidth="1" />
          {/* Base */}
          <path d="M-24,10 L24,10 L20,14 L-20,14 Z" className="fill-gray-600" />
          <text x="0" y="28" textAnchor="middle" fontSize="7" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
            Data analysis
          </text>
        </g>

        {/* Data type labels */}
        <g transform="translate(475, 260)">
          {[
            { label: "Temperature", color: "fill-green-400" },
            { label: "Wind speed", color: "fill-blue-400" },
            { label: "Snowfall", color: "fill-amber-400" },
          ].map((d, i) => (
            <g key={i} transform={`translate(0, ${i * 14})`}>
              <circle cx="-20" cy="0" r="2.5" className={d.color} />
              <text x="-12" y="3" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
                {d.label}
              </text>
            </g>
          ))}
        </g>

        {/* Altitude label */}
        <rect x="140" y="220" width="120" height="20" rx="4" className="fill-amber-900/50" />
        <text x="200" y="234" textAnchor="middle" fontSize="9" className="fill-amber-300" fontWeight="700">
          Station at 4 000 m+
        </text>

        {/* Ground line */}
        <line x1="0" y1="340" x2="600" y2="340" className="stroke-green-800/30" strokeWidth="1" />

        {/* What scientists measure */}
        <rect x="30" y="348" width="540" height="42" rx="5" className="fill-gray-800/50" />
        <text x="300" y="363" textAnchor="middle" fontSize="9" className="fill-gray-200" fontWeight="700">
          What Scientists Monitor
        </text>
        {[
          "Glacier size",
          "Air temperature",
          "Wind patterns",
          "Snowfall depth",
          "Wildlife movement",
        ].map((item, i) => (
          <g key={i}>
            <circle cx={65 + i * 108} cy="379" r="2" className="fill-blue-400" />
            <text x={72 + i * 108} y="382" fontSize="7.5" className="fill-gray-600 dark:fill-gray-300">
              {item}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
