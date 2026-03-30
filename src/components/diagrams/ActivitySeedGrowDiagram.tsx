export default function ActivitySeedGrowDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full h-auto"
        role="img"
        aria-label="Seed vs cutting experiment: grow tulsi from seeds and cuttings side by side and compare results"
      >
        <rect width="600" height="400" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34d399">Try This: Seed vs. Cutting Experiment</text>
        <text x="300" y="45" textAnchor="middle" fontSize="10" fill="#94a3b8">Grow tulsi two ways and compare. Takes 2-3 weeks.</text>

        {/* LEFT: Seed method */}
        <rect x="20" y="60" width="270" height="200" rx="8" fill="#3b82f6" opacity="0.06" />
        <text x="155" y="80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Method A: Seeds</text>

        {/* Pot with soil */}
        <g transform="translate(155, 175)">
          {/* Pot */}
          <path d="M -50,0 L -40,50 L 40,50 L 50,0 Z" fill="#78350f" opacity="0.6" />
          <rect x="-52" y="-5" width="104" height="10" rx="3" fill="#92400e" />
          {/* Soil surface */}
          <path d="M -45,5 Q 0,-5 45,5 L 40,10 L -40,10 Z" fill="#451a03" />
          {/* Seeds on surface */}
          {[[-20, 3], [-5, 6], [10, 2], [25, 5]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3" ry="2" fill="#a16207" stroke="#ca8a04" strokeWidth="0.5" />
          ))}
          {/* Water drops */}
          {[[-15, -15], [5, -20], [20, -12]].map(([x, y], i) => (
            <g key={`d${i}`}>
              <path d={`M ${x},${y} Q ${x - 2},${y + 5} ${x},${y + 7} Q ${x + 2},${y + 5} ${x},${y}`} fill="#60a5fa" opacity="0.5" />
            </g>
          ))}
        </g>
        <text x="155" y="240" textAnchor="middle" fontSize="10" fill="#93c5fd">Scatter seeds on moist soil</text>
        <text x="155" y="252" textAnchor="middle" fontSize="10" fill="#93c5fd">Cover with thin layer of soil</text>

        {/* RIGHT: Cutting method */}
        <rect x="310" y="60" width="270" height="200" rx="8" fill="#22c55e" opacity="0.06" />
        <text x="445" y="80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#34d399">Method B: Cutting</text>

        {/* Glass of water with cutting */}
        <g transform="translate(445, 175)">
          {/* Glass */}
          <path d="M -30,-40 L -25,30 Q 0,40 25,30 L 30,-40 Z" fill="#60a5fa" opacity="0.1" stroke="#60a5fa" strokeWidth="1" />
          {/* Water level */}
          <path d="M -28,-10 L -25,30 Q 0,40 25,30 L 28,-10 Z" fill="#60a5fa" opacity="0.15" />
          {/* Stem cutting */}
          <line x1="0" y1="-55" x2="0" y2="10" stroke="#22c55e" strokeWidth="3" />
          {/* Leaves */}
          <ellipse cx="-12" cy="-40" rx="8" ry="5" fill="#22c55e" opacity="0.8" transform="rotate(-30,-12,-40)" />
          <ellipse cx="12" cy="-48" rx="8" ry="5" fill="#22c55e" opacity="0.8" transform="rotate(30,12,-48)" />
          <ellipse cx="-10" cy="-25" rx="7" ry="4" fill="#22c55e" opacity="0.7" transform="rotate(-25,-10,-25)" />
          {/* Roots forming */}
          <line x1="0" y1="10" x2="-8" y2="22" stroke="#a16207" strokeWidth="1" />
          <line x1="0" y1="10" x2="6" y2="20" stroke="#a16207" strokeWidth="1" />
          <line x1="0" y1="10" x2="0" y2="24" stroke="#a16207" strokeWidth="1" />
          {/* Root label */}
          <text x="20" y="24" fontSize="8" fill="#ca8a04">new roots!</text>
        </g>
        <text x="445" y="240" textAnchor="middle" fontSize="10" fill="#86efac">Cut 10cm stem below a node</text>
        <text x="445" y="252" textAnchor="middle" fontSize="10" fill="#86efac">Place in clean water</text>

        {/* Steps at bottom */}
        <rect x="20" y="270" width="560" height="120" rx="8" fill="#1e293b" />
        <text x="300" y="292" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">What to record daily:</text>

        {[
          { x: 60, icon: '1', label: 'Measure height', desc: '(cm from soil to tip)', color: '#60a5fa' },
          { x: 180, icon: '2', label: 'Count leaves', desc: '(new ones each day)', color: '#34d399' },
          { x: 300, icon: '3', label: 'Note root growth', desc: '(cutting only, visible)', color: '#fbbf24' },
          { x: 420, icon: '4', label: 'Draw or photo', desc: '(track shape changes)', color: '#f472b6' },
          { x: 540, icon: '5', label: 'Compare!', desc: '(which grows faster?)', color: '#c084fc' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.x === 540 ? 325 : 325} r="12" fill={s.color} opacity="0.2" />
            <text x={s.x} y={s.x === 540 ? 329 : 329} textAnchor="middle" fontSize="11" fontWeight="bold" fill={s.color}>{s.icon}</text>
            <text x={s.x} y={345} textAnchor="middle" fontSize="10" fontWeight="bold" fill={s.color}>{s.label}</text>
            <text x={s.x} y={358} textAnchor="middle" fontSize="8" fill="#94a3b8">{s.desc}</text>
          </g>
        ))}

        {/* Prediction prompt */}
        <rect x="100" y="372" width="400" height="20" rx="4" fill="#fbbf24" opacity="0.1" />
        <text x="300" y="386" textAnchor="middle" fontSize="10" fill="#fbbf24">Predict: will the cutting or the seeds grow taller in 2 weeks? Why?</text>
      </svg>
    </div>
  );
}
