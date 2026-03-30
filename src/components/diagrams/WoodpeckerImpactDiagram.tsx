export default function WoodpeckerImpactDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="G-force comparison: woodpecker at 1200g vs human concussion at 80g"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .val { font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
          .warn { animation: pulse 1.5s ease-in-out infinite; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="32" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          G-Force Comparison: Impact Tolerance
        </text>

        {/* Axis */}
        <line x1="80" y1="60" x2="80" y2="340" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="80" y1="340" x2="540" y2="340" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="40" y="200" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" transform="rotate(-90,40,200)">
          G-force
        </text>

        {/* Y-axis labels */}
        {[0, 200, 400, 600, 800, 1000, 1200].map((v, i) => (
          <g key={v}>
            <text x="72" y={340 - i * 40 + 4} textAnchor="end" className="label fill-gray-500 dark:fill-slate-400">{v}</text>
            <line x1="78" y1={340 - i * 40} x2="540" y2={340 - i * 40} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1" />
          </g>
        ))}

        {/* Human concussion threshold - 80g */}
        <rect x="130" y={340 - (80 / 1200) * 280} width="80" height={(80 / 1200) * 280} rx="4" fill="#f59e0b" opacity="0.85" />
        <text x="170" y={340 - (80 / 1200) * 280 - 8} textAnchor="middle" className="val" fill="#f59e0b">80g</text>
        <text x="170" y="365" textAnchor="middle" className="label" fill="#fbbf24">Human</text>
        <text x="170" y="378" textAnchor="middle" className="label" fill="#fbbf24">Concussion</text>

        {/* Roller coaster ~5g */}
        <rect x="250" y={340 - (5 / 1200) * 280} width="80" height={(5 / 1200) * 280} rx="4" fill="#38bdf8" opacity="0.85" />
        <text x="290" y={340 - (5 / 1200) * 280 - 8} textAnchor="middle" className="label" fill="#38bdf8">5g</text>
        <text x="290" y="365" textAnchor="middle" className="label" fill="#7dd3fc">Roller</text>
        <text x="290" y="378" textAnchor="middle" className="label" fill="#7dd3fc">Coaster</text>

        {/* Football hit ~100g */}
        <rect x="370" y={340 - (100 / 1200) * 280} width="80" height={(100 / 1200) * 280} rx="4" fill="#fb923c" opacity="0.85" />
        <text x="410" y={340 - (100 / 1200) * 280 - 8} textAnchor="middle" className="val" fill="#fb923c">100g</text>
        <text x="410" y="365" textAnchor="middle" className="label" fill="#fdba74">Football</text>
        <text x="410" y="378" textAnchor="middle" className="label" fill="#fdba74">Hit</text>

        {/* Woodpecker - 1200g — wider bar */}
        <rect x="480" y={340 - 280} width="60" height="280" rx="4" fill="#dc2626" opacity="0.9" />

        {/* Woodpecker icon on top of bar */}
        <g transform="translate(498, 38)">
          <ellipse cx="12" cy="12" rx="8" ry="10" fill="#16a34a" />
          <ellipse cx="12" cy="3" rx="5" ry="4" fill="#dc2626" />
          <polygon points="20,10 30,9 20,12" fill="#d97706" />
          <circle cx="15" cy="8" r="1.5" fill="#fef9c3" />
        </g>

        {/* 1200g label — above the icon, not overlapping */}
        <text x="510" y="30" textAnchor="middle" className="val" fill="#ef4444">1,200g</text>

        <text x="510" y="365" textAnchor="middle" className="label" fill="#fca5a5">Woodpecker</text>

        {/* Danger line at 80g */}
        <line x1="80" y1={340 - (80 / 1200) * 280} x2="470" y2={340 - (80 / 1200) * 280}
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" className="warn" />
        {/* Label in open space between axis labels and bars */}
        <text x="300" y="290" textAnchor="middle" className="label" fill="#ef4444">
          ▲ Human danger zone (80g)
        </text>

        {/* Annotation */}
        <text x="300" y="398" textAnchor="middle" className="label fill-gray-400 dark:fill-slate-500">
          Woodpecker survives 15× the force that causes human concussion
        </text>
      </svg>
    </div>
  );
}
