export default function ElephantKNNVoteDiagram() {
  const moods = [
    { key: 'rumble', color: '#22c55e', count: 3 },
    { key: 'trumpet', color: '#3b82f6', count: 2 },
    { key: 'bark', color: '#f59e0b', count: 1 },
    { key: 'cry', color: '#f472b6', count: 1 },
  ];

  // 7 neighbor positions around center (hand-placed for clarity)
  const neighbors = [
    { x: -38, y: -28, mood: 'rumble' },
    { x: 18, y: -40, mood: 'rumble' },
    { x: -48, y: 14, mood: 'rumble' },
    { x: 40, y: -10, mood: 'trumpet' },
    { x: 32, y: 30, mood: 'trumpet' },
    { x: -20, y: 38, mood: 'bark' },
    { x: -42, y: -4, mood: 'cry' },
  ];

  const colorMap: Record<string, string> = {
    rumble: '#22c55e',
    trumpet: '#3b82f6',
    bark: '#f59e0b',
    cry: '#f472b6',
  };

  const cx = 150;
  const cy = 145;

  return (
    <svg
      viewBox="0 0 630 346"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="k-NN voting diagram: a query point surrounded by 7 nearest neighbors voting across 6 mood classes, rumble wins with 3 votes"
    >
      {/* Dark background */}
      <rect width="600" height="310" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        k-NN Voting (k = 7)
      </text>

      {/* ── Scatter area ── */}
      <rect x={60} y={50} width={190} height={190} rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />

      {/* Dashed circle showing neighborhood */}
      <circle cx={cx} cy={cy} r="60" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 3" />

      {/* Neighbor dots */}
      {neighbors.map((n, i) => (
        <g key={i}>
          {/* Line from center to neighbor */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + n.x}
            y2={cy + n.y}
            stroke={colorMap[n.mood]}
            strokeWidth="0.7"
            opacity="0.4"
          />
          {/* Dot */}
          <circle cx={cx + n.x} cy={cy + n.y} r="7" fill={colorMap[n.mood]} opacity="0.8" />
          <circle cx={cx + n.x} cy={cy + n.y} r="3.5" fill={colorMap[n.mood]} />
        </g>
      ))}

      {/* Query point (center) */}
      <circle cx={cx} cy={cy} r="10" className="fill-white dark:fill-slate-950" stroke="#e2e8f0" strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="12" fontWeight="800">
        ?
      </text>

      {/* Label */}
      <text x={cx} y={252} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
        Feature space (2D view)
      </text>

      {/* ── Arrow to tally ── */}
      <line x1={260} y1={cy} x2={310} y2={cy} stroke="#64748b" strokeWidth="1.5" />
      <polygon points="310,141 318,145 310,149" className="fill-gray-400 dark:fill-slate-500" />

      {/* ── Tally box ── */}
      <rect x={320} y={60} width={170} height={130} rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x={405} y={82} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="700">
        Vote Tally
      </text>
      <line x1={330} y1={88} x2={480} y2={88} stroke="#334155" strokeWidth="0.5" />

      {moods.map((m, i) => {
        const y = 106 + i * 24;
        const barW = m.count * 28;
        return (
          <g key={m.key}>
            <text x={336} y={y} fill={m.color} fontSize="9" fontWeight="600">
              {m.key}
            </text>
            {/* Bar */}
            <rect x={390} y={y - 10} width={barW} height={14} rx="2" fill={m.color} opacity="0.3" />
            <rect x={390} y={y - 10} width={barW} height={14} rx="2" fill={m.color} opacity="0.6" />
            <text x={396 + barW} y={y} fill={m.color} fontSize="9" fontWeight="700">
              {m.count}
            </text>
          </g>
        );
      })}

      {/* ── Arrow to result ── */}
      <line x1={405} y1={194} x2={405} y2={222} stroke="#64748b" strokeWidth="1.5" />
      <polygon points="401,222 405,230 409,222" className="fill-gray-400 dark:fill-slate-500" />

      {/* ── Result box ── */}
      <rect x={340} y={232} width={130} height={40} rx="6" fill="#052e16" stroke="#22c55e" strokeWidth="1.5" />
      {/* Elephant silhouette */}
      <g transform="translate(350, 238) scale(0.6)">
        <path
          d="M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z"
          fill="#22c55e"
          opacity="0.9"
        />
      </g>
      <text x={418} y={249} fill="#86efac" fontSize="11" fontWeight="800">
        RUMBLE
      </text>
      <text x={418} y={262} className="fill-gray-500 dark:fill-slate-400" fontSize="8">
        wins with 3 / 7 votes
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="296" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">
        Each neighbor votes for its class — majority wins
      </text>
    </svg>
  );
}
