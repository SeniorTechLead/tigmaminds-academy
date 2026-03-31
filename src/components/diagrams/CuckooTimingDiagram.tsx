export default function CuckooTimingDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Dawn chorus timeline showing when different birds start singing relative to sunrise">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">The Dawn Chorus: Each Bird Has Its Own Alarm Clock</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Birds start singing at predictable times before sunrise — their clocks are that precise</text>

        {/* Time axis */}
        <line x1="100" y1="350" x2="720" y2="350" stroke="#94a3b8" strokeWidth="2" />
        {/* Time labels */}
        {[
          { t: '4:30', x: 130 }, { t: '5:00', x: 234 },
          { t: '5:30', x: 338 }, { t: '6:00', x: 442 },
          { t: '6:30', x: 546 }, { t: '7:00', x: 650 },
        ].map((tick, i) => (
          <g key={i}>
            <line x1={tick.x} y1="345" x2={tick.x} y2="355" stroke="#94a3b8" strokeWidth="1.5" />
            <text x={tick.x} y="370" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">{tick.t} AM</text>
          </g>
        ))}

        {/* Sunrise marker */}
        <line x1="442" y1="80" x2="442" y2="350" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
        <text x="442" y="75" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">☀️ Sunrise</text>

        {/* Dawn gradient background */}
        <defs>
          <linearGradient id="dawn-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect x="100" y="85" width="620" height="255" fill="url(#dawn-grad)" />

        {/* Bird timings */}
        {[
          { bird: 'Robin', emoji: '🐦', start: 160, color: '#ef4444', offset: '-80 min' },
          { bird: 'Blackbird', emoji: '🐦‍⬛', start: 210, color: '#6b7280', offset: '-60 min' },
          { bird: 'Cuckoo', emoji: '🐤', start: 290, color: '#f59e0b', offset: '-30 min' },
          { bird: 'Sparrow', emoji: '🐥', start: 390, color: '#92400e', offset: '-10 min' },
          { bird: 'Crow', emoji: '🖤', start: 470, color: '#1e293b', offset: '+5 min' },
        ].map((b, i) => (
          <g key={i} transform={`translate(0, ${100 + i * 48})`}>
            <text x="60" y="15" textAnchor="middle" fontSize="18">{b.emoji}</text>
            <text x="60" y="32" textAnchor="middle" fontSize="10" fontWeight="600" fill={b.color}>{b.bird}</text>

            {/* Singing bar */}
            <rect x={b.start} y="2" width={680 - b.start} height="24" rx="4" fill={b.color} opacity="0.2" />
            <rect x={b.start} y="2" width="4" height="24" rx="2" fill={b.color} />

            {/* Offset label */}
            <text x={b.start + 10} y="18" fontSize="10" fontWeight="600" fill={b.color}>{b.offset}</text>

            {/* Sound waves */}
            {[0, 1, 2].map(w => (
              <text key={w} x={b.start + 80 + w * 40} y="18" fontSize="10" fill={b.color} opacity={0.6 - w * 0.15}>♪</text>
            ))}
          </g>
        ))}

        {/* Key insight */}
        <rect x="100" y="385" width="580" height="24" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="401" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          The cuckoo calls ~30 minutes before sunrise — its circadian clock triggers singing at a specific light level
        </text>
      </svg>
    </div>
  );
}
