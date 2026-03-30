export default function BeeForagingModelDiagram() {
  const flowers = [
    { x: 80, y: 100, nectar: 8, dist: 50, label: "A" },
    { x: 200, y: 70, nectar: 3, dist: 200, label: "B" },
    { x: 350, y: 120, nectar: 10, dist: 400, label: "C" },
    { x: 450, y: 80, nectar: 2, dist: 600, label: "D" },
    { x: 280, y: 160, nectar: 6, dist: 300, label: "E" },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee optimal foraging model showing distance versus nectar reward tradeoffs">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Optimal Foraging Theory</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Bees maximize: (Energy gained - Energy spent) / Time</text>

        {/* Landscape view — top section */}
        <g transform="translate(0, 60)">
          {/* Ground line */}
          <line x1="30" y1="140" x2="490" y2="140" stroke="#22c55e" strokeWidth="1" opacity="0.3" />

          {/* Hive */}
          <polygon points="30,120 45,105 60,120 60,140 30,140" fill="#a16207" opacity="0.5" stroke="#d97706" strokeWidth="1" />
          <text x="45" y="152" textAnchor="middle" fontSize="7" fill="#d97706">Hive</text>

          {/* Flowers with nectar indicators */}
          {flowers.map((f) => (
            <g key={f.label}>
              {/* Flower */}
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx={f.x + Math.cos((a * Math.PI) / 180) * 8}
                  cy={f.y + Math.sin((a * Math.PI) / 180) * 8}
                  rx="6" ry="3" fill="#22c55e" opacity="0.5"
                  transform={`rotate(${a}, ${f.x + Math.cos((a * Math.PI) / 180) * 8}, ${f.y + Math.sin((a * Math.PI) / 180) * 8})`}
                />
              ))}
              <circle cx={f.x} cy={f.y} r="5" fill="#fbbf24" opacity="0.7" />
              {/* Nectar bar */}
              <rect x={f.x - 3} y={f.y - 20 - f.nectar * 3} width="6" height={f.nectar * 3} rx="2" fill="#f59e0b" opacity="0.6" />
              <text x={f.x} y={f.y - 24 - f.nectar * 3} textAnchor="middle" fontSize="7" fill="#fbbf24">{f.nectar}J</text>
              {/* Label */}
              <text x={f.x} y={f.y + 22} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fcd34d">{f.label}</text>
              <text x={f.x} y={f.y + 32} textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{f.dist}m</text>
              {/* Stem */}
              <line x1={f.x} y1={f.y + 8} x2={f.x} y2="140" stroke="#22c55e" strokeWidth="1.5" opacity="0.3" />
            </g>
          ))}

          {/* Flight path to optimal flower */}
          <path d="M 55,115 Q 65,80 80,100" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3" />
          {/* Bee */}
          <ellipse cx="68" cy="90" rx="7" ry="4" fill="#eab308" />
          <circle cx="73" cy="88" r="3" className="fill-gray-100 dark:fill-slate-800" />
        </g>

        {/* Cost-benefit chart — bottom */}
        <g transform="translate(260, 310)">
          <text x="0" y="-65" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Net Energy Gain = Nectar - Travel Cost</text>

          {/* Chart axes */}
          <line x1="-190" y1="0" x2="190" y2="0" stroke="#64748b" strokeWidth="1" />
          <line x1="-190" y1="0" x2="-190" y2="-50" stroke="#64748b" strokeWidth="1" />
          <text x="-195" y="-45" textAnchor="end" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Net gain</text>

          {/* Bars for each flower */}
          {[
            { label: "A", net: 7, color: "#22c55e" },
            { label: "B", net: 1, color: "#94a3b8" },
            { label: "C", net: 6, color: "#22c55e" },
            { label: "D", net: -2, color: "#ef4444" },
            { label: "E", net: 3, color: "#fbbf24" },
          ].map((bar, i) => {
            const bx = -150 + i * 75;
            const h = Math.abs(bar.net) * 5;
            const by = bar.net >= 0 ? -h : 0;
            return (
              <g key={i}>
                <rect x={bx - 15} y={by} width="30" height={h} rx="3" fill={bar.color} opacity="0.5" />
                <text x={bx} y={by - 5} textAnchor="middle" fontSize="8" fontWeight="bold" fill={bar.color}>
                  {bar.net > 0 ? `+${bar.net}` : bar.net}J
                </text>
                <text x={bx} y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fcd34d">{bar.label}</text>
                {bar.label === "A" && (
                  <text x={bx} y="26" textAnchor="middle" fontSize="7" fill="#22c55e">Best!</text>
                )}
              </g>
            );
          })}

          {/* Zero line label */}
          <text x="195" y="4" fontSize="7" className="fill-gray-400 dark:fill-slate-500">0</text>
        </g>

        {/* Formula */}
        <g transform="translate(260, 380)">
          <rect x="-200" y="-12" width="400" height="20" rx="4" fill="#f59e0b" opacity="0.1" />
          <text x="0" y="2" textAnchor="middle" fontSize="9" fill="#fcd34d">
            Optimal choice: highest (nectar energy - flight cost) per unit time
          </text>
        </g>
      </svg>
    </div>
  );
}
