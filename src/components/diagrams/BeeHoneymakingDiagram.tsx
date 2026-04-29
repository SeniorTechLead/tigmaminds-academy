export default function BeeHoneymakingDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 400" className="w-full max-w-2xl mx-auto" role="img" aria-label="Honey-making process diagram from nectar collection to honey storage">
        <rect width="560" height="400" rx="12" className="fill-slate-900" />

        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">From Nectar to Honey</text>

        <defs>
          <marker id="bhm-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Step 1: Nectar collection */}
        <g transform="translate(75, 100)">
          <rect x="-55" y="-30" width="110" height="85" rx="8" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1" />
          {/* Flower */}
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={Math.cos((a * Math.PI) / 180) * 15}
              cy={Math.sin((a * Math.PI) / 180) * 15}
              rx="10" ry="5"
              fill="#22c55e" opacity="0.6"
              transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 15}, ${Math.sin((a * Math.PI) / 180) * 15})`}
            />
          ))}
          <circle cx="0" cy="0" r="7" fill="#fbbf24" />
          {/* Nectar drop */}
          <path d="M 0,20 Q -4,28 0,32 Q 4,28 0,20" fill="#93c5fd" opacity="0.6" />
          <text x="0" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">1. Collect</text>
          <text x="0" y="76" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Nectar (~80% water)</text>
        </g>

        {/* Arrow 1→2 */}
        <line x1="135" y1="100" x2="165" y2="100" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#bhm-arrow)" />

        {/* Step 2: Enzyme addition (honey stomach) */}
        <g transform="translate(220, 100)">
          <rect x="-50" y="-30" width="100" height="95" rx="8" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1" />
          {/* Bee body outline */}
          <ellipse cx="0" cy="-5" rx="22" ry="14" fill="#eab308" opacity="0.7" />
          <line x1="-8" y1="-5" x2="8" y2="-5" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" />
          {/* Honey stomach highlight */}
          <ellipse cx="0" cy="2" rx="10" ry="6" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,1" />
          <text x="0" y="18" textAnchor="middle" fontSize="10" fill="#fcd34d">invertase</text>
          <text x="0" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f59e0b">2. Enzymes</text>
          <text x="0" y="76" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Sucrose → glucose</text>
          <text x="0" y="89" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">+ fructose</text>
        </g>

        {/* Arrow 2→3 */}
        <line x1="275" y1="100" x2="305" y2="100" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#bhm-arrow)" />

        {/* Step 3: Mouth-to-mouth transfer */}
        <g transform="translate(360, 100)">
          <rect x="-45" y="-30" width="90" height="95" rx="8" fill="#eab308" opacity="0.15" stroke="#eab308" strokeWidth="1" />
          {/* Two bees facing each other */}
          <ellipse cx="-12" cy="0" rx="14" ry="9" fill="#eab308" opacity="0.7" />
          <ellipse cx="12" cy="0" rx="14" ry="9" fill="#eab308" opacity="0.7" />
          {/* Transfer droplet */}
          <circle cx="0" cy="0" r="4" fill="#f59e0b" />
          <text x="0" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#eab308">3. Transfer</text>
          <text x="0" y="76" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Mouth-to-mouth</text>
          <text x="0" y="89" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">between workers</text>
        </g>

        {/* Arrow 3→4 */}
        <line x1="410" y1="100" x2="440" y2="100" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#bhm-arrow)" />

        {/* Step 4: Evaporation (fanning) */}
        <g transform="translate(490, 100)">
          <rect x="-45" y="-30" width="90" height="95" rx="8" fill="#60a5fa" opacity="0.15" stroke="#60a5fa" strokeWidth="1" />
          {/* Comb cell */}
          <rect x="-15" y="-15" width="30" height="25" rx="2" fill="#f59e0b" opacity="0.3" stroke="#d97706" strokeWidth="1" />
          {/* Water vapor arrows going up */}
          {[-8, 0, 8].map((xOff) => (
            <g key={xOff}>
              <path d={`M ${xOff},12 Q ${xOff - 3},20 ${xOff},28`} fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.6" />
              <circle cx={xOff} cy="28" r="1.5" fill="#93c5fd" opacity="0.4" />
            </g>
          ))}
          <text x="0" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">4. Evaporate</text>
          <text x="0" y="76" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Fan wings to</text>
          <text x="0" y="89" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">remove water</text>
        </g>

        {/* Bottom section: Final honey + capping */}
        <g transform="translate(280, 280)">
          <rect x="-200" y="-35" width="400" height="90" rx="8" fill="#78350f" opacity="0.2" stroke="#d97706" strokeWidth="1" />

          {/* Honeycomb cells */}
          {[-110, -66, -22, 22, 66, 110].map((xOff, i) => (
            <g key={i}>
              <polygon
                points={`${xOff},0 ${xOff + 14},-8 ${xOff + 14},-24 ${xOff},-32 ${xOff - 14},-24 ${xOff - 14},-8`}
                fill={i < 4 ? "#f59e0b" : "#fbbf24"}
                opacity={i < 4 ? 0.6 : 0.3}
                stroke="#d97706"
                strokeWidth="1"
              />
              {i >= 4 && (
                <line x1={xOff - 10} y1={-8} x2={xOff + 10} y2={-8} stroke="#eab308" strokeWidth="1.5" />
              )}
            </g>
          ))}

          <text x="0" y="32" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">5. Sealed with beeswax cap</text>
          <text x="0" y="48" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Final honey: ~18% water &bull; pH 3.9 &bull; natural preservative</text>
        </g>

        {/* Water content bar */}
        <g transform="translate(280, 220)">
          <text x="-130" y="0" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Water content:</text>
          <rect x="-40" y="-8" width="200" height="12" rx="3" className="fill-gray-100 dark:fill-slate-800" />
          {/* 80% fill for nectar */}
          <rect x="-40" y="-8" width="160" height="12" rx="3" fill="#93c5fd" opacity="0.4" />
          {/* 18% fill for honey */}
          <rect x="-40" y="-8" width="36" height="12" rx="3" fill="#f59e0b" opacity="0.6" />
          <text x="-22" y="2" fontSize="10" fill="#fbbf24" fontWeight="bold">18%</text>
          <text x="80" y="2" fontSize="10" fill="#93c5fd">80%</text>
          <text x="-40" y="18" fontSize="10" fill="#f59e0b">honey</text>
          <text x="100" y="18" fontSize="10" fill="#93c5fd">nectar</text>
        </g>
      </svg>
    </div>
  );
}
