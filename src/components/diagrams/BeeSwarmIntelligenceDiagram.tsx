export default function BeeSwarmIntelligenceDiagram() {
  const sites = [
    { x: 100, y: 120, label: "Site A", quality: 3, votes: 2, color: "#94a3b8" },
    { x: 260, y: 80, label: "Site B", quality: 9, votes: 8, color: "#22c55e" },
    { x: 420, y: 130, label: "Site C", quality: 5, votes: 3, color: "#f59e0b" },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee swarm intelligence diagram showing collective nest site voting">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Swarm Intelligence: Nest Site Voting</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">How 10,000+ bees make a democratic decision</text>

        {/* Swarm cluster — center top */}
        <g transform="translate(260, 100)">
          <ellipse cx="0" cy="0" rx="30" ry="22" fill="#a16207" opacity="0.3" stroke="#d97706" strokeWidth="1" />
          {/* Individual bees in cluster */}
          {[[-10, -8], [5, -5], [-5, 5], [8, 8], [-12, 2], [12, -3], [0, -12], [-3, 12]].map(([bx, by], i) => (
            <ellipse key={i} cx={bx} cy={by} rx="5" ry="3" fill="#eab308" opacity="0.6" />
          ))}
          <text x="0" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#d97706">Swarm Cluster</text>
        </g>

        {/* Scout bees flying to candidate sites */}
        {sites.map((site, i) => (
          <g key={i}>
            {/* Flight path from swarm */}
            <path
              d={`M ${260 + (site.x - 260) * 0.15},${100 + (site.y - 100) * 0.15} Q ${(260 + site.x) / 2},${(100 + site.y) / 2 - 20} ${site.x},${site.y}`}
              fill="none" stroke={site.color} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.4"
            />

            {/* Nest site */}
            <rect x={site.x - 30} y={site.y - 20} width="60" height="40" rx="6" fill={site.color} opacity="0.1" stroke={site.color} strokeWidth="1.5" />
            {/* Cavity entrance */}
            <ellipse cx={site.x} cy={site.y} rx="8" ry="12" className="fill-gray-100 dark:fill-slate-800" stroke={site.color} strokeWidth="1" />
            <text x={site.x} y={site.y + 30} textAnchor="middle" fontSize="10" fontWeight="bold" fill={site.color}>{site.label}</text>
            <text x={site.x} y={site.y + 42} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Quality: {site.quality}/10</text>
          </g>
        ))}

        {/* Voting process — middle section */}
        <g transform="translate(260, 210)">
          <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Democratic Voting Process</text>

          {/* Steps */}
          {[
            { x: -180, step: "1", label: "Scout", sub: "~300 scouts explore", color: "#fbbf24" },
            { x: -90, step: "2", label: "Report", sub: "Dance for best sites", color: "#f59e0b" },
            { x: 0, step: "3", label: "Recruit", sub: "Convince others", color: "#eab308" },
            { x: 90, step: "4", label: "Quorum", sub: "~80% agree on one", color: "#22c55e" },
            { x: 180, step: "5", label: "Move!", sub: "Swarm flies together", color: "#22c55e" },
          ].map((s) => (
            <g key={s.step}>
              <circle cx={s.x} cy="30" r="14" fill={s.color} opacity="0.15" stroke={s.color} strokeWidth="1" />
              <text x={s.x} y="34" textAnchor="middle" fontSize="10" fontWeight="bold" fill={s.color}>{s.step}</text>
              <text x={s.x} y="52" textAnchor="middle" fontSize="8" fontWeight="bold" fill={s.color}>{s.label}</text>
              <text x={s.x} y="63" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{s.sub}</text>
            </g>
          ))}

          {/* Arrows between steps */}
          {[-135, -45, 45, 135].map((x) => (
            <line key={x} x1={x - 10} y1="30" x2={x + 10} y2="30" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
          ))}
        </g>

        {/* Vote count visualization — bottom */}
        <g transform="translate(260, 310)">
          <text x="0" y="-10" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Vote Accumulation Over Time</text>

          {sites.map((site, i) => {
            const bx = -130 + i * 130;
            return (
              <g key={i}>
                <text x={bx} y="10" textAnchor="middle" fontSize="9" fontWeight="bold" fill={site.color}>{site.label}</text>
                {/* Vote bar */}
                <rect x={bx - 20} y="18" width="40" height="12" rx="3" className="fill-gray-100 dark:fill-slate-800" />
                <rect x={bx - 20} y="18" width={site.votes * 4.5} height="12" rx="3" fill={site.color} opacity="0.5" />
                {/* Dancing bees count */}
                {Array.from({ length: Math.min(site.votes, 8) }).map((_, j) => (
                  <ellipse key={j} cx={bx - 16 + j * 5} cy="42" rx="2" ry="1.5" fill={site.color} opacity="0.6" />
                ))}
                <text x={bx} y="55" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{site.votes} dancers</text>
                {site.quality === 9 && (
                  <text x={bx} y="68" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#22c55e">WINNER</text>
                )}
              </g>
            );
          })}
        </g>

        {/* Key insight */}
        <g transform="translate(260, 385)">
          <text x="0" y="0" textAnchor="middle" fontSize="9" fill="#fcd34d">
            Cross-inhibition: scouts for losing sites gradually stop dancing — best site wins by quorum
          </text>
        </g>
      </svg>
    </div>
  );
}
