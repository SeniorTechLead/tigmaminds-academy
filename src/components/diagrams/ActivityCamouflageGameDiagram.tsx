export default function ActivityCamouflageGameDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 380" className="w-full max-w-xl mx-auto" role="img" aria-label="Camouflage activity: scatter coloured paper squares on the ground and time how fast a friend finds each colour">
        <rect width="560" height="380" rx="12" className="fill-slate-900" />

        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">Try It: Camouflage Test</text>
        <text x="280" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Which colour survives longest against your garden background?</text>

        {/* Step 1: Cut paper squares */}
        <g transform="translate(20, 65)">
          <rect width="160" height="140" rx="8" fill="#1e3a5f" opacity="0.2" />
          <text x="80" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Step 1: Cut</text>

          {/* Scissors */}
          <g transform="translate(55, 35)">
            <line x1="0" y1="0" x2="20" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="50" y1="0" x2="30" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="25" cy="25" r="5" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* Coloured squares */}
          {[
            { x: 20, y: 75, fill: '#ef4444', label: 'Red ×5' },
            { x: 60, y: 75, fill: '#22c55e', label: 'Green ×5' },
            { x: 100, y: 75, fill: '#fbbf24', label: 'Yellow ×5' },
            { x: 20, y: 110, fill: '#78350f', label: 'Brown ×5' },
          ].map((sq, i) => (
            <g key={`sq-${i}`}>
              <rect x={sq.x} y={sq.y} width="20" height="20" rx="2" fill={sq.fill} />
              <text x={sq.x + 30} y={sq.y + 14} fontSize="9" fill="#d1d5db">{sq.label}</text>
            </g>
          ))}
          <text x="80" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">20 squares total</text>
        </g>

        {/* Step 2: Scatter */}
        <g transform="translate(195, 65)">
          <rect width="160" height="140" rx="8" fill="#1e3a5f" opacity="0.2" />
          <text x="80" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Step 2: Scatter</text>

          {/* Ground patch */}
          <rect x="15" y="35" width="130" height="80" rx="6" fill="#365314" opacity="0.4" />
          {/* Grass texture */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`grass-${i}`}
              x1={25 + i * 10} y1={110}
              x2={28 + i * 10} y2={100 + (i % 3) * 3}
              stroke="#4ade80" strokeWidth="1" opacity="0.3" />
          ))}

          {/* Scattered squares (some visible, some hidden) */}
          <rect x="30" y="50" width="8" height="8" fill="#ef4444" />
          <rect x="70" y="65" width="8" height="8" fill="#22c55e" opacity="0.4" />
          <rect x="100" y="45" width="8" height="8" fill="#fbbf24" />
          <rect x="50" y="90" width="8" height="8" fill="#78350f" opacity="0.3" />
          <rect x="120" y="80" width="8" height="8" fill="#ef4444" />
          <rect x="85" y="55" width="8" height="8" fill="#22c55e" opacity="0.4" />

          <text x="80" y="133" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Toss on grass/soil</text>
        </g>

        {/* Step 3: Hunt */}
        <g transform="translate(370, 65)">
          <rect width="170" height="140" rx="8" fill="#1e3a5f" opacity="0.2" />
          <text x="85" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Step 3: Hunt (30s)</text>

          {/* Timer */}
          <circle cx="85" cy="60" r="22" fill="none" stroke="#fbbf24" strokeWidth="2" />
          <text x="85" y="65" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">30s</text>
          <line x1="85" y1="42" x2="85" y2="50" stroke="#fbbf24" strokeWidth="2" />

          {/* Eye icon (searching) */}
          <ellipse cx="85" cy="100" rx="18" ry="10" fill="none" stroke="#86efac" strokeWidth="1.5" />
          <circle cx="85" cy="100" r="5" fill="#86efac" />

          <text x="85" y="128" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Friend picks up all</text>
          <text x="85" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">they can find</text>
        </g>

        {/* Results section */}
        <g transform="translate(20, 220)">
          <rect width="520" height="140" rx="8" fill="#86efac" opacity="0.06" />
          <text x="260" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#86efac">Step 4: Record Results</text>

          {/* Bar chart */}
          {[
            { label: 'Red', found: 5, color: '#ef4444' },
            { label: 'Green', found: 2, color: '#22c55e' },
            { label: 'Yellow', found: 4, color: '#fbbf24' },
            { label: 'Brown', found: 1, color: '#78350f' },
          ].map((bar, i) => {
            const bx = 40 + i * 125;
            const bh = bar.found * 14;
            return (
              <g key={bar.label}>
                <rect x={bx} y={120 - bh} width="40" height={bh} rx="3" fill={bar.color} opacity="0.8" />
                <text x={bx + 20} y={130} textAnchor="middle" fontSize="10" fill="#d1d5db">{bar.label}</text>
                <text x={bx + 20} y={115 - bh} textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">{bar.found}/5</text>
              </g>
            );
          })}

          {/* Insight arrow */}
          <text x="380" y="55" fontSize="10" fill="#86efac" fontWeight="bold">Best camouflaged:</text>
          <text x="380" y="70" fontSize="10" fill="#d1d5db">Fewest found = most</text>
          <text x="380" y="83" fontSize="10" fill="#d1d5db">“fit” for that habitat</text>
          <text x="380" y="100" fontSize="10" fill="#fbbf24">→ This IS natural selection!</text>
        </g>
      </svg>
    </div>
  );
}
