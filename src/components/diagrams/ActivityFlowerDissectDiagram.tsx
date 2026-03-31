export default function ActivityFlowerDissectDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 380" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing how to dissect a flower and identify its parts: petals, sepals, stamens, pistil, and ovary">
        <rect width="560" height="380" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#f59e0b">Activity: Dissect a Flower</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Open up any flower to find these parts \u2014 use tweezers or your fingers</text>

        {/* Whole flower */}
        <g transform="translate(140, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">Step 1: Pick a flower</text>

          {/* Sepals (green, outer) */}
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={`s${a}`}
              cx={Math.cos(((a + 36) * Math.PI) / 180) * 32}
              cy={50 + Math.sin(((a + 36) * Math.PI) / 180) * 32}
              rx="14" ry="7" fill="#22c55e" opacity="0.5"
              transform={`rotate(${a + 36}, ${Math.cos(((a + 36) * Math.PI) / 180) * 32}, ${50 + Math.sin(((a + 36) * Math.PI) / 180) * 32})`}
            />
          ))}
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={`p${a}`}
              cx={Math.cos((a * Math.PI) / 180) * 24}
              cy={50 + Math.sin((a * Math.PI) / 180) * 24}
              rx="16" ry="9" fill="#e879f9" opacity="0.6"
              transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 24}, ${50 + Math.sin((a * Math.PI) / 180) * 24})`}
            />
          ))}
          {/* Center */}
          <circle cx="0" cy="50" r="8" fill="#fbbf24" opacity="0.8" />

          {/* Stem */}
          <line x1="0" y1="58" x2="0" y2="100" stroke="#22c55e" strokeWidth="3" />
        </g>

        {/* Dissected parts */}
        <g transform="translate(350, 70)">
          <text x="80" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">Step 2: Separate the parts</text>

          {/* Petals */}
          <g transform="translate(0, 20)">
            <ellipse cx="20" cy="15" rx="16" ry="9" fill="#e879f9" opacity="0.6" />
            <text x="50" y="12" fontSize="10" fontWeight="bold" fill="#e879f7">Petals</text>
            <text x="50" y="24" fontSize="8" className="fill-slate-400">Attract pollinators with color</text>
          </g>

          {/* Sepals */}
          <g transform="translate(0, 55)">
            <ellipse cx="20" cy="12" rx="14" ry="7" fill="#22c55e" opacity="0.6" />
            <text x="50" y="10" fontSize="10" fontWeight="bold" fill="#22c55e">Sepals</text>
            <text x="50" y="22" fontSize="8" className="fill-slate-400">Protected the bud before opening</text>
          </g>

          {/* Stamens */}
          <g transform="translate(0, 90)">
            <line x1="15" y1="5" x2="15" y2="20" stroke="#fbbf24" strokeWidth="2" />
            <ellipse cx="15" cy="5" rx="5" ry="3" fill="#f59e0b" />
            <text x="50" y="10" fontSize="10" fontWeight="bold" fill="#f59e0b">Stamen (male)</text>
            <text x="50" y="22" fontSize="8" className="fill-slate-400">Filament + anther = makes pollen</text>
          </g>

          {/* Pistil */}
          <g transform="translate(0, 125)">
            <line x1="15" y1="0" x2="15" y2="22" stroke="#a855f7" strokeWidth="2" />
            <circle cx="15" cy="0" r="4" fill="#a855f7" opacity="0.7" />
            <ellipse cx="15" cy="22" rx="7" ry="5" fill="#c026d3" opacity="0.5" />
            <text x="50" y="8" fontSize="10" fontWeight="bold" fill="#a855f7">Pistil (female)</text>
            <text x="50" y="20" fontSize="8" className="fill-slate-400">Stigma + style + ovary = makes seeds</text>
          </g>
        </g>

        {/* What to record */}
        <g transform="translate(280, 245)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f59e0b">Step 3: Record What You Find</text>

          <g transform="translate(-230, 15)">
            {[
              { q: 'How many petals?', note: 'Monocots have 3s (orchids, lilies). Dicots have 4s or 5s (roses, hibiscus).', color: '#e879f9' },
              { q: 'What color are the petals?', note: 'Predict: purple/blue = bees, red = birds, white = moths, yellow = many insects.', color: '#60a5fa' },
              { q: 'Can you find pollen?', note: 'Tap the anthers over dark paper \u2014 you should see yellow or white dust.', color: '#f59e0b' },
              { q: 'Is there a scent?', note: 'Strong sweet = butterfly/moth. None = bird-pollinated. Foul = fly-pollinated.', color: '#22c55e' },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${i * 27})`}>
                <circle cx="8" cy="6" r="4" fill={item.color} opacity="0.6" />
                <text x="18" y="10" fontSize="10" fill="#e2e8f0">{item.q}</text>
                <text x="240" y="10" fontSize="8" className="fill-slate-400">{item.note}</text>
              </g>
            ))}
          </g>
        </g>

        <text x="280" y="370" textAnchor="middle" fontSize="9" className="fill-slate-500">Any flower works: hibiscus, marigold, rose, jasmine, or a wild orchid if you find one!</text>
      </svg>
    </div>
  );
}
