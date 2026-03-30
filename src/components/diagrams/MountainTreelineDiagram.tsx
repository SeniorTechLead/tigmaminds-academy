export default function MountainTreelineDiagram() {
  const bottom = 350;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 420"
        className="w-full"
        role="img"
        aria-label="Diagram showing why trees stop growing at the treeline due to temperature, wind, and a short growing season"
      >
        <rect x="0" y="0" width="600" height="400" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Why Trees Stop — The Treeline
        </text>

        {/* Mountain slope */}
        <defs>
          <linearGradient id="slopeGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#6b7280" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polygon
          points={`40,${bottom} 100,280 180,200 280,120 350,80 420,110 480,180 560,280 580,${bottom}`}
          fill="url(#slopeGrad)"
        />
        <polygon
          points={`40,${bottom} 100,280 180,200 280,120 350,80 420,110 480,180 560,280 580,${bottom}`}
          fill="none"
          className="stroke-gray-400"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Snow cap */}
        <polygon points="280,120 350,80 420,110 380,108 320,115" className="fill-white/30" />

        {/* Treeline marker */}
        <line x1="60" y1="210" x2="520" y2="210" className="stroke-amber-400" strokeWidth="1.5" strokeDasharray="6 4" />
        <rect x="225" y="197" width="150" height="18" rx="4" className="fill-amber-900/60" />
        <text x="300" y="210" textAnchor="middle" fontSize="10" className="fill-amber-300" fontWeight="800">
          TREELINE ~3 500 m
        </text>

        {/* BELOW TREELINE — normal trees */}
        {[
          { x: 80, y: 300, h: 35 },
          { x: 120, y: 285, h: 40 },
          { x: 170, y: 270, h: 38 },
          { x: 220, y: 258, h: 36 },
          { x: 280, y: 252, h: 32 },
          { x: 350, y: 260, h: 36 },
          { x: 410, y: 270, h: 38 },
          { x: 460, y: 280, h: 35 },
          { x: 500, y: 290, h: 30 },
        ].map((t, i) => (
          <g key={`tree-${i}`} transform={`translate(${t.x}, ${t.y})`}>
            <line x1="0" y1="0" x2="0" y2="12" className="stroke-amber-800" strokeWidth="2.5" />
            <polygon points={`0,${-t.h / 3} -10,8 10,8`} className="fill-green-600/60" />
            <polygon points={`0,${-t.h / 3 - 10} -8,${-t.h / 3 + 4} 8,${-t.h / 3 + 4}`} className="fill-green-500/50" />
          </g>
        ))}
        <text x="100" y={bottom - 8} fontSize="9" className="fill-green-300" fontWeight="600">
          Healthy forest below treeline
        </text>

        {/* AT TREELINE — krummholz (stunted) */}
        {[
          { x: 160, y: 225 },
          { x: 230, y: 222 },
          { x: 310, y: 223 },
          { x: 380, y: 225 },
          { x: 440, y: 228 },
        ].map((t, i) => (
          <g key={`krumm-${i}`} transform={`translate(${t.x}, ${t.y})`}>
            <line x1="0" y1="0" x2={i % 2 === 0 ? -3 : 3} y2="6" className="stroke-amber-700" strokeWidth="2" />
            <ellipse cx={i % 2 === 0 ? -4 : 4} cy="-2" rx="7" ry="5" className="fill-green-700/40" />
          </g>
        ))}
        <text x="475" y="232" fontSize="7" className="fill-green-400/80" fontStyle="italic">
          Krummholz
        </text>
        <text x="475" y="242" fontSize="7" className="fill-gray-400">
          (stunted, wind-bent)
        </text>

        {/* ABOVE TREELINE — bare */}
        <text x="380" y="165" fontSize="8" className="fill-gray-400" fontWeight="600">
          No trees above
        </text>

        {/* Wind arrows */}
        <defs>
          <marker id="windArrowTL" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <path d="M0,0 L7,2.5 L0,5" className="fill-blue-300" />
          </marker>
        </defs>
        {[130, 155, 180].map((y, i) => (
          <line key={i} x1={30 + i * 5} y1={y} x2={80 + i * 8} y2={y - 5} className="stroke-blue-300" strokeWidth="1.5" markerEnd="url(#windArrowTL)" />
        ))}
        <text x="30" y="125" fontSize="8" className="fill-blue-300" fontWeight="600">
          Strong wind
        </text>

        {/* Snow particles above treeline */}
        {[320, 340, 355, 370, 290, 400, 310].map((x, i) => (
          <circle key={i} cx={x} cy={100 + (i * 17) % 50} r="1.5" className="fill-white/40" />
        ))}
        <text x="350" y="90" fontSize="7" className="fill-white/60">
          Snow &amp; ice
        </text>

        {/* Reason boxes */}
        <g transform="translate(40, 360)">
          {[
            { icon: "🌡", text: "Too cold: avg <10°C in summer", color: "fill-blue-300" },
            { icon: "💨", text: "Fierce wind damages growth", color: "fill-blue-200" },
            { icon: "📅", text: "Growing season too short (<3 months)", color: "fill-amber-300" },
          ].map((r, i) => (
            <g key={i} transform={`translate(${i * 180}, 0)`}>
              <rect x="0" y="0" width="165" height="18" rx="3" className="fill-slate-800" />
              <text x="8" y="13" fontSize="8" className={r.color} fontWeight="600">
                {r.text}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
