export default function MountainWatershedDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 460"
        className="w-full"
        role="img"
        aria-label="Mountain water cycle showing snow and glacier at the top flowing as meltwater through streams to a river at the bottom, with seasonal flow chart"
      >
        <rect x="0" y="0" width="600" height="420" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Mountain Watershed — Water Cycle
        </text>

        {/* Mountain */}
        <defs>
          <linearGradient id="mtnWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#94a3b8" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <polygon
          points="60,280 120,200 200,120 280,65 330,55 370,70 420,120 480,200 540,270 560,280"
          fill="url(#mtnWaterGrad)"
        />
        <polygon
          points="60,280 120,200 200,120 280,65 330,55 370,70 420,120 480,200 540,270 560,280"
          fill="none"
          className="stroke-gray-400"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Snow/glacier at top */}
        <polygon points="260,80 330,55 390,80 360,76 300,75" className="fill-white/40" />
        <text x="330" y="50" textAnchor="middle" fontSize="8" className="fill-white/80" fontWeight="700">
          Snow / Glacier
        </text>

        {/* Meltwater streams */}
        <path d="M310,75 Q300,100 290,130 Q280,160 265,190 Q250,215 240,240" fill="none" className="stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
        <path d="M350,78 Q360,110 370,140 Q375,170 365,200 Q355,230 340,255" fill="none" className="stroke-blue-400" strokeWidth="2" strokeLinecap="round" />

        {/* Streams merging */}
        <path d="M240,240 Q270,260 300,270" fill="none" className="stroke-blue-400" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M340,255 Q320,265 300,270" fill="none" className="stroke-blue-400" strokeWidth="2.5" strokeLinecap="round" />

        {/* River at bottom */}
        <path d="M300,270 Q280,278 260,280 Q230,282 200,280 Q160,278 120,280 Q80,282 50,285" fill="none" className="stroke-blue-400" strokeWidth="4" strokeLinecap="round" />
        <path d="M300,270 Q330,278 370,280 Q420,282 470,280 Q520,278 560,280" fill="none" className="stroke-blue-400" strokeWidth="4" strokeLinecap="round" />

        {/* Water flow arrows */}
        <defs>
          <marker id="waterArr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" className="fill-blue-300" />
          </marker>
        </defs>
        {/* Down the streams */}
        <line x1="290" y1="130" x2="275" y2="165" className="stroke-blue-300/60" strokeWidth="1" markerEnd="url(#waterArr)" />
        <line x1="365" y1="130" x2="370" y2="165" className="stroke-blue-300/60" strokeWidth="1" markerEnd="url(#waterArr)" />

        {/* Labels */}
        <text x="245" y="160" fontSize="7" className="fill-blue-200" fontWeight="600" transform="rotate(-70,245,160)">
          Meltwater
        </text>
        <text x="400" y="155" fontSize="7" className="fill-blue-200" fontWeight="600" transform="rotate(70,400,155)">
          Stream
        </text>
        <text x="300" y="263" textAnchor="middle" fontSize="8" className="fill-blue-300" fontWeight="700">
          Streams merge
        </text>
        <text x="160" y="275" textAnchor="middle" fontSize="9" className="fill-blue-300" fontWeight="700">
          River
        </text>

        {/* Ground level */}
        <line x1="40" y1="290" x2="570" y2="290" className="stroke-green-700/40" strokeWidth="1" />

        {/* Seasonal flow chart — bottom section */}
        <rect x="40" y="305" width="520" height="90" rx="6" className="fill-gray-800/50" />
        <text x="300" y="322" textAnchor="middle" fontSize="10" className="fill-gray-200" fontWeight="700">
          Seasonal Water Flow
        </text>

        {/* Season bars */}
        {[
          { season: "Winter", months: "Dec-Feb", flow: "Low", width: 40, color: "fill-blue-200/30", textColor: "fill-blue-200", desc: "Frozen — water stored as snow" },
          { season: "Spring", months: "Mar-May", flow: "Flood", width: 120, color: "fill-blue-400/40", textColor: "fill-blue-300", desc: "Snow melts — peak flow!" },
          { season: "Summer", months: "Jun-Aug", flow: "Moderate", width: 80, color: "fill-blue-300/30", textColor: "fill-blue-300", desc: "Glacier melt sustains flow" },
          { season: "Autumn", months: "Sep-Nov", flow: "Low", width: 50, color: "fill-blue-200/20", textColor: "fill-blue-200", desc: "Cooling — flow decreases" },
        ].map((s, i) => {
          const barX = 65 + i * 128;
          return (
            <g key={i}>
              <rect x={barX} y="338" width={s.width} height="12" rx="3" className={s.color} />
              <text x={barX} y="335" fontSize="8" className={s.textColor} fontWeight="700">
                {s.season}
              </text>
              <text x={barX} y="363" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
                {s.months}
              </text>
              <text x={barX} y="375" fontSize="6.5" className="fill-gray-500">
                {s.desc}
              </text>
            </g>
          );
        })}

        {/* Flow level label */}
        <text x="52" y="347" fontSize="7" className="fill-gray-500" fontWeight="600">
          Flow:
        </text>

        {/* Insight */}
        <rect x="40" y="398" width="520" height="18" rx="3" className="fill-gray-100 dark:fill-slate-800" />
        <text x="300" y="410" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Mountains are water towers — billions of people depend on glacier-fed rivers
        </text>
      </svg>
    </div>
  );
}
