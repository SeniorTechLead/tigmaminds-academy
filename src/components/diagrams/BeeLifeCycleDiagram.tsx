export default function BeeLifeCycleDiagram() {
  const stages = [
    { angle: -90, label: "Egg", sub: "Day 1-3", color: "#fefce8", detail: "Tiny, rice-shaped" },
    { angle: 0, label: "Larva", sub: "Day 4-9", color: "#fcd34d", detail: "Fed royal jelly, then pollen" },
    { angle: 90, label: "Pupa", sub: "Day 10-20", color: "#d97706", detail: "Sealed cell, metamorphosis" },
    { angle: 180, label: "Adult", sub: "Day 21+", color: "#eab308", detail: "Emerges, chews cap off" },
  ];

  const cx = 260;
  const cy = 185;
  const radius = 95;

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 399" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee life cycle diagram from egg through larva and pupa to adult">
        <rect width="520" height="380" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Life Cycle</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Complete metamorphosis: ~21 days (worker bee)</text>

        <defs>
          <marker id="blc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Circular path */}
        <circle cx={cx} cy={cy} r={radius + 15} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6,4" opacity="0.25" />

        {/* Curved arrows between stages */}
        {stages.map((_, i) => {
          const a1 = (stages[i].angle * Math.PI) / 180;
          const a2 = (stages[(i + 1) % 4].angle * Math.PI) / 180;
          const midAngle = a1 + ((a2 - a1 + 2 * Math.PI) % (2 * Math.PI)) / 2;
          const mx = cx + Math.cos(midAngle) * (radius + 15);
          const my = cy + Math.sin(midAngle) * (radius + 15);
          const x1 = cx + Math.cos(a1 + 0.3) * (radius + 15);
          const y1 = cy + Math.sin(a1 + 0.3) * (radius + 15);
          const x2 = cx + Math.cos(a2 - 0.3) * (radius + 15);
          const y2 = cy + Math.sin(a2 - 0.3) * (radius + 15);
          return (
            <path
              key={`arr${i}`}
              d={`M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              markerEnd="url(#blc-arrow)"
              opacity="0.5"
            />
          );
        })}

        {/* Stage nodes */}
        {stages.map((stage, i) => {
          const rad = (stage.angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * radius;
          const y = cy + Math.sin(rad) * radius;
          return (
            <g key={i}>
              {/* Outer glow */}
              <circle cx={x} cy={y} r="38" fill={stage.color} opacity="0.08" />
              {/* Main circle */}
              <circle cx={x} cy={y} r="30" className="fill-gray-100 dark:fill-slate-800" stroke={stage.color} strokeWidth="2.5" />

              {/* Stage-specific illustrations */}
              {i === 0 && (
                /* Egg — small oval */
                <ellipse cx={x} cy={y} rx="5" ry="10" fill="#fefce8" opacity="0.8" />
              )}
              {i === 1 && (
                /* Larva — C-shaped */
                <path d={`M ${x - 8},${y - 8} Q ${x + 10},${y - 5} ${x + 8},${y + 5} Q ${x},${y + 10} ${x - 8},${y + 5}`} fill="#fcd34d" opacity="0.8" stroke="#d97706" strokeWidth="1" />
              )}
              {i === 2 && (
                /* Pupa — enclosed shape */
                <g>
                  <ellipse cx={x} cy={y} rx="14" ry="18" fill="#d97706" opacity="0.6" />
                  <ellipse cx={x} cy={y - 5} rx="8" ry="5" fill="#eab308" opacity="0.4" />
                  <line x1={x - 5} y1={y + 3} x2={x + 5} y2={y + 3} stroke="#78350f" strokeWidth="1" opacity="0.5" />
                  <line x1={x - 4} y1={y + 8} x2={x + 4} y2={y + 8} stroke="#78350f" strokeWidth="1" opacity="0.5" />
                </g>
              )}
              {i === 3 && (
                /* Adult bee */
                <g>
                  <ellipse cx={x} cy={y + 2} rx="14" ry="9" fill="#eab308" />
                  <line x1={x - 6} y1={y + 2} x2={x + 6} y2={y + 2} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" />
                  <line x1={x - 5} y1={y + 6} x2={x + 5} y2={y + 6} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" />
                  <circle cx={x + 14} cy={y - 1} r="5" className="fill-gray-100 dark:fill-slate-800" />
                  {/* Wings */}
                  <ellipse cx={x - 5} cy={y - 10} rx="10" ry="5" fill="#bfdbfe" opacity="0.3" transform={`rotate(-15, ${x - 5}, ${y - 10})`} />
                </g>
              )}

              {/* Labels */}
              <text x={x} y={y + 45} textAnchor="middle" fontSize="12" fontWeight="bold" fill={stage.color}>{stage.label}</text>
              <text x={x} y={y + 58} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{stage.sub}</text>
            </g>
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Complete</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Metamorphosis</text>

        {/* Detail boxes at bottom */}
        <g transform="translate(260, 340)">
          {stages.map((stage, i) => (
            <g key={i}>
              <text x={-180 + i * 120} y="0" textAnchor="middle" fontSize="8" fontWeight="bold" fill={stage.color}>{stage.label}</text>
              <text x={-180 + i * 120} y="12" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{stage.detail}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
