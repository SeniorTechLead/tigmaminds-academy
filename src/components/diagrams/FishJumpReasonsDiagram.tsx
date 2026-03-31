/* FishJumpReasonsDiagram – Four reasons fish jump: low O₂, parasites, predators, migration */

const reasons = [
  {
    title: 'Low Oxygen',
    color: '#3b82f6',
    bg: '#3b82f615',
    icon: 'O₂↓',
    detail: 'When dissolved O₂ drops below 4 mg/L, fish leap to gulp air directly',
    trigger: 'Warm water, algal blooms, stagnant conditions',
  },
  {
    title: 'Parasite Removal',
    color: '#22c55e',
    bg: '#22c55e15',
    icon: '✖',
    detail: 'Landing hard on the surface dislodges leeches, sea lice, and gill flukes',
    trigger: 'Heavy parasite loads on gills, fins, or scales',
  },
  {
    title: 'Predator Escape',
    color: '#f59e0b',
    bg: '#f59e0b15',
    icon: '!',
    detail: 'Bursting into the air confuses aquatic predators who cannot follow',
    trigger: 'Attack by pike, heron, otter, or larger fish',
  },
  {
    title: 'Migration Barriers',
    color: '#a855f7',
    bg: '#a855f715',
    icon: '↑',
    detail: 'Salmon and mahseer leap waterfalls to reach upstream spawning grounds',
    trigger: 'Spawning season, upstream obstacles, rapids',
  },
];

export default function FishJumpReasonsDiagram() {
  return (
    <svg
      viewBox="0 0 592 370"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="Diagram showing four main reasons fish jump: low oxygen, parasite removal, predator escape, and migration barriers"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        Why Fish Jump
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Four survival reasons behind every leap
      </text>

      {/* Central fish silhouette */}
      <ellipse cx="296" cy="190" rx="45" ry="18" className="fill-gray-100 dark:fill-gray-800" stroke="#6b7280" strokeWidth="1" />
      <path d="M341,190 L360,178 L360,202 Z" className="fill-gray-100 dark:fill-gray-800" stroke="#6b7280" strokeWidth="1" />
      <circle cx="265" cy="186" r="3" className="fill-gray-500 dark:fill-gray-400" />
      <text x="296" y="194" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
        🐟
      </text>

      {/* Reason cards — 2x2 grid */}
      {reasons.map((r, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = col === 0 ? 130 : 462;
        const cy = row === 0 ? 110 : 280;
        const cardW = 220;
        const cardH = 80;
        const x = cx - cardW / 2;
        const y = cy - cardH / 2;

        // Connector to center fish
        const fishX = col === 0 ? 251 : 341;
        const fishY = row === 0 ? 180 : 200;
        const startX = col === 0 ? x + cardW : x;
        const startY = cy;

        return (
          <g key={i}>
            {/* Connector line */}
            <line x1={startX} y1={startY} x2={fishX} y2={fishY} stroke={r.color} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

            {/* Card */}
            <rect x={x} y={y} width={cardW} height={cardH} rx="6" fill={r.bg} stroke={r.color} strokeWidth="1.2" />

            {/* Icon circle */}
            <circle cx={x + 18} cy={y + 18} r="12" fill={r.color} opacity="0.2" />
            <text x={x + 18} y={y + 22} textAnchor="middle" fontSize="11" fontWeight="700" fill={r.color}>
              {r.icon}
            </text>

            {/* Title */}
            <text x={x + 38} y={y + 22} fontSize="11" fontWeight="700" fill={r.color}>
              {r.title}
            </text>

            {/* Detail */}
            <text x={x + 12} y={y + 42} fontSize="8" className="fill-gray-600 dark:fill-gray-300">
              {r.detail}
            </text>

            {/* Trigger */}
            <text x={x + 12} y={y + 58} fontSize="7" fontStyle="italic" className="fill-gray-500 dark:fill-gray-400">
              Trigger: {r.trigger}
            </text>
          </g>
        );
      })}

      {/* Bottom insight */}
      <rect x="100" y="330" width="392" height="30" rx="5" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
      <text x="296" y="350" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
        A jump is never random — it is always a response to a specific environmental pressure
      </text>
    </svg>
  );
}
