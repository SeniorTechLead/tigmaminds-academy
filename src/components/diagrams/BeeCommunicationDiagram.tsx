export default function BeeCommunicationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 430" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee communication diagram showing pheromones, dance, and vibrations">
        <rect width="570" height="430" rx="12" className="fill-slate-900" />

        <text x="285" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Communication</text>
        <text x="285" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Chemical, visual, and vibrational signals</text>

        {/* Channel 1: Pheromones */}
        <g transform="translate(105, 165)">
          <rect x="-80" y="-60" width="160" height="200" rx="8" fill="#a855f7" opacity="0.08" stroke="#a855f7" strokeWidth="1" />
          <text x="0" y="-40" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a855f7">Pheromones</text>
          <text x="0" y="-26" textAnchor="middle" fontSize="10" fill="#c4b5fd">Chemical signals</text>

          {/* Queen bee releasing pheromone cloud */}
          <ellipse cx="0" cy="10" rx="18" ry="11" fill="#eab308" opacity="0.7" />
          <line x1="-7" y1="10" x2="7" y2="10" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" />
          {/* Crown */}
          <polygon points="-6,0 -3,5 0,-2 3,5 6,0" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

          {/* Pheromone cloud */}
          {[
            { x: -25, y: -5, r: 8 },
            { x: 25, y: 0, r: 7 },
            { x: -30, y: 15, r: 6 },
            { x: 30, y: 20, r: 6 },
            { x: 0, y: -15, r: 9 },
            { x: -15, y: 25, r: 5 },
            { x: 15, y: 28, r: 5 },
          ].map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={c.r} fill="#a855f7" opacity="0.12" />
          ))}

          {/* Types */}
          {[
            { y: 52, label: "Queen mandibular", sub: "Colony unity" },
            { y: 76, label: "Alarm pheromone", sub: "Defense alert" },
            { y: 100, label: "Nasanov gland", sub: "\"Come here!\"" },
            { y: 124, label: "Brood pheromone", sub: "Feed larvae" },
          ].map((p, i) => (
            <g key={i}>
              <circle cx="-60" cy={p.y} r="3" fill="#a855f7" opacity="0.6" />
              <text x="-50" y={p.y + 4} fontSize="10" fontWeight="bold" fill="#c4b5fd">{p.label}</text>
              <text x="-50" y={p.y + 17} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{p.sub}</text>
            </g>
          ))}
        </g>

        {/* Channel 2: Dance Language */}
        <g transform="translate(290, 165)">
          <rect x="-90" y="-60" width="180" height="200" rx="8" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="-40" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">Dance Language</text>
          <text x="0" y="-26" textAnchor="middle" fontSize="10" fill="#fcd34d">Visual movement signals</text>

          {/* Waggle dance figure-8 */}
          <g transform="translate(-40, 30)">
            <ellipse cx="0" cy="-18" rx="18" ry="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.4" />
            <ellipse cx="0" cy="18" rx="18" ry="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.4" />
            <line x1="0" y1="-6" x2="0" y2="6" stroke="#fbbf24" strokeWidth="3" />
            <ellipse cx="0" cy="0" rx="6" ry="4" fill="#eab308" />
            <text x="0" y="44" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Waggle</text>
            <text x="0" y="57" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Direction + distance</text>
          </g>

          {/* Round dance */}
          <g transform="translate(45, 30)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.4" />
            <ellipse cx="8" cy="0" rx="6" ry="4" fill="#eab308" />
            {/* Arrow around circle */}
            <path d="M 12,-12 A 18 18 0 1 1 14,6" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="0" y="44" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Round</text>
            <text x="0" y="57" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Food is nearby</text>
          </g>

          {/* Tremble dance */}
          <g transform="translate(0, 95)">
            <path d="M -20,0 L -12,-5 L -4,5 L 4,-5 L 12,5 L 20,0" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="6" ry="4" fill="#eab308" />
            <text x="0" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Tremble</text>
            <text x="0" y="33" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">&quot;Need more receivers!&quot;</text>
          </g>
        </g>

        {/* Channel 3: Vibrations */}
        <g transform="translate(475, 165)">
          <rect x="-70" y="-60" width="140" height="200" rx="8" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="1" />
          <text x="0" y="-40" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22c55e">Vibrations</text>
          <text x="0" y="-26" textAnchor="middle" fontSize="10" fill="#86efac">Substrate signals</text>

          {/* Piping */}
          <g transform="translate(0, 15)">
            {/* Vibration waves */}
            {[-15, -8, 0, 8, 15].map((xOff, i) => (
              <path
                key={i}
                d={`M ${xOff - 3},-8 Q ${xOff},${-12 - i * 2} ${xOff + 3},-8`}
                fill="none" stroke="#22c55e" strokeWidth="1.5" opacity={0.3 + i * 0.1}
              />
            ))}
            {/* Comb surface */}
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#a16207" strokeWidth="2" />
            {/* Bee on comb */}
            <ellipse cx="0" cy="-5" rx="10" ry="6" fill="#eab308" opacity="0.7" />
            <text x="0" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22c55e">Piping</text>
            <text x="0" y="33" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Queen signals</text>
          </g>

          {/* Tooting & quacking */}
          <g transform="translate(0, 70)">
            <path d="M -20,0 Q -10,-8 0,0 Q 10,8 20,0" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
            <text x="0" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22c55e">Tooting</text>
            <text x="0" y="33" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Virgin queen: &quot;I&apos;m here!&quot;</text>
          </g>

          {/* Stop signal */}
          <g transform="translate(0, 110)">
            <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="-6" y1="-6" x2="6" y2="6" stroke="#ef4444" strokeWidth="1.5" />
            <text x="0" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22c55e">Stop signal</text>
            <text x="0" y="33" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Head-butt: &quot;Danger!&quot;</text>
          </g>
        </g>

        {/* Bottom summary */}
        <text x="285" y="410" textAnchor="middle" fontSize="10" fill="#fcd34d">
          A single hive uses 15+ distinct chemical and behavioral signals simultaneously
        </text>
      </svg>
    </div>
  );
}
