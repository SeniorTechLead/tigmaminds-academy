export default function BeeEcosystemServiceDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 399" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee ecosystem service diagram showing pollination value of 200 to 500 billion dollars">
        <rect width="520" height="380" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Ecosystem Services</text>

        {/* Central value callout */}
        <g transform="translate(260, 85)">
          <rect x="-120" y="-22" width="240" height="44" rx="10" fill="#f59e0b" opacity="0.15" stroke="#fbbf24" strokeWidth="2" />
          <text x="0" y="0" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fbbf24">$200–500 Billion/year</text>
          <text x="0" y="15" textAnchor="middle" fontSize="9" fill="#fcd34d">Global value of bee pollination services</text>
        </g>

        {/* Food crops pollinated — left column */}
        <g transform="translate(110, 195)">
          <text x="0" y="-30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">Crops Pollinated</text>

          {[
            { label: "Almonds", pct: "100%", w: 80 },
            { label: "Apples", pct: "90%", w: 72 },
            { label: "Blueberries", pct: "90%", w: 72 },
            { label: "Cucumbers", pct: "80%", w: 64 },
            { label: "Coffee", pct: "25%", w: 20 },
          ].map((crop, i) => (
            <g key={i}>
              <text x="-65" y={i * 26 + 3} fontSize="9" className="fill-gray-500 dark:fill-slate-400">{crop.label}</text>
              <rect x="0" y={i * 26 - 8} width="80" height="14" rx="3" className="fill-gray-100 dark:fill-slate-800" />
              <rect x="0" y={i * 26 - 8} width={crop.w} height="14" rx="3" fill="#22c55e" opacity="0.5" />
              <text x={crop.w + 5} y={i * 26 + 3} fontSize="8" fontWeight="bold" fill="#22c55e">{crop.pct}</text>
            </g>
          ))}

          <text x="0" y="150" textAnchor="start" fontSize="8" className="fill-gray-500 dark:fill-slate-400">% dependent on bee pollination</text>
        </g>

        {/* Services breakdown — right column */}
        <g transform="translate(380, 195)">
          <text x="0" y="-30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f59e0b">Service Breakdown</text>

          {[
            { label: "Food production", icon: "🌾", value: "35% of global crops", color: "#22c55e" },
            { label: "Biodiversity", icon: "🌿", value: "80% of wild plants", color: "#22c55e" },
            { label: "Honey & wax", icon: "🍯", value: "$7B annually", color: "#f59e0b" },
            { label: "Seed production", icon: "🌱", value: "Forest regeneration", color: "#86efac" },
            { label: "Medicine", icon: "💊", value: "Propolis, venom therapy", color: "#a855f7" },
          ].map((svc, i) => (
            <g key={i}>
              <circle cx="-60" cy={i * 28} r="10" fill={svc.color} opacity="0.15" />
              <text x="-60" y={i * 28 + 4} textAnchor="middle" fontSize="10">{svc.icon}</text>
              <text x="-40" y={i * 28 - 2} fontSize="9" fontWeight="bold" fill={svc.color}>{svc.label}</text>
              <text x="-40" y={i * 28 + 10} fontSize="7" className="fill-gray-500 dark:fill-slate-400">{svc.value}</text>
            </g>
          ))}
        </g>

        {/* Impact chain at bottom */}
        <g transform="translate(260, 345)">
          <rect x="-230" y="-20" width="460" height="40" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />

          {["Healthy bees", "Pollination", "Crop yields", "Food security", "Economy"].map((step, i) => (
            <g key={i}>
              <text x={-180 + i * 95} y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill={i === 0 ? "#eab308" : "#94a3b8"}>{step}</text>
              {i < 4 && (
                <text x={-135 + i * 95} y="2" textAnchor="middle" fontSize="12" fill="#f59e0b">→</text>
              )}
            </g>
          ))}
        </g>

        {/* 1 in 3 bites callout */}
        <g transform="translate(260, 290)">
          <rect x="-110" y="-14" width="220" height="28" rx="6" fill="#f59e0b" opacity="0.1" stroke="#fbbf24" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
            Every 3rd bite of food depends on bee pollination
          </text>
        </g>
      </svg>
    </div>
  );
}
