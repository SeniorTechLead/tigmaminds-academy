export default function WoodpeckerDrumPatternDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Woodpecker drumming pattern showing 20 strikes per second as a timeline"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
          @keyframes beat { 0%,10%{r:6} 5%{r:9} }
        `}</style>

        <rect width="630" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="315" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Drumming Pattern: 20 Strikes Per Second
        </text>

        {/* 1-second timeline */}
        <g transform="translate(50, 55)">
          <text x="260" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">One Second of Drumming</text>

          {/* Timeline axis */}
          <line x1="0" y1="40" x2="520" y2="40" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

          {/* Time markers */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((t, i) => (
            <g key={i}>
              <line x1={i * 130} y1="35" x2={i * 130} y2="45" stroke="#64748b" strokeWidth="1.5" />
              <text x={i * 130} y="60" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">{t}s</text>
            </g>
          ))}

          {/* 20 strike markers */}
          {Array.from({ length: 20 }, (_, i) => {
            const x = i * (520 / 20) + 13;
            return (
              <g key={i}>
                <line x1={x} y1="15" x2={x} y2="40" stroke="#dc2626" strokeWidth="2.5" />
                <circle cx={x} cy="12" r="4" fill="#dc2626" opacity="0.8">
                  <animate attributeName="r" values="4;7;4" dur="1s" begin={`${i * 0.05}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {/* Strike count */}
          <text x="260" y="82" textAnchor="middle" className="val" fill="#ef4444">20 impacts in 1 second</text>
          <text x="260" y="98" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">50 milliseconds between each strike</text>
        </g>

        {/* Burst pattern */}
        <g transform="translate(50, 175)">
          <text x="260" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">Typical Drumming Bout (burst pattern)</text>

          <line x1="0" y1="30" x2="520" y2="30" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          {/* Burst 1 */}
          <rect x="10" y="15" width="80" height="30" rx="4" fill="#dc2626" opacity="0.2" stroke="#dc2626" strokeWidth="1" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`b1-${i}`} x1={15 + i * 10} y1="20" x2={15 + i * 10} y2="40" stroke="#dc2626" strokeWidth="2" />
          ))}
          <text x="50" y="60" textAnchor="middle" className="sm" fill="#fca5a5">Burst 1</text>

          {/* Pause */}
          <text x="130" y="34" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">pause</text>

          {/* Burst 2 */}
          <rect x="160" y="15" width="80" height="30" rx="4" fill="#dc2626" opacity="0.2" stroke="#dc2626" strokeWidth="1" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`b2-${i}`} x1={165 + i * 10} y1="20" x2={165 + i * 10} y2="40" stroke="#dc2626" strokeWidth="2" />
          ))}
          <text x="200" y="60" textAnchor="middle" className="sm" fill="#fca5a5">Burst 2</text>

          {/* Pause */}
          <text x="280" y="34" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">pause</text>

          {/* Burst 3 */}
          <rect x="310" y="15" width="80" height="30" rx="4" fill="#dc2626" opacity="0.2" stroke="#dc2626" strokeWidth="1" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`b3-${i}`} x1={315 + i * 10} y1="20" x2={315 + i * 10} y2="40" stroke="#dc2626" strokeWidth="2" />
          ))}
          <text x="350" y="60" textAnchor="middle" className="sm" fill="#fca5a5">Burst 3</text>

          <text x="430" y="34" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">. . .</text>
        </g>

        {/* Daily stats */}
        <g transform="translate(40, 268)">
          <text x="275" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">Daily Drumming Stats</text>

          {[
            { label: 'Strikes per second', value: '~20', color: '#ef4444' },
            { label: 'Bouts per day', value: '~600', color: '#f59e0b' },
            { label: 'Total strikes/day', value: '~12,000', color: '#22c55e' },
            { label: 'Speed per strike', value: '~7 m/s', color: '#38bdf8' },
          ].map((stat, i) => (
            <g key={i} transform={`translate(${i * 138}, 15)`}>
              <rect x="0" y="0" width="130" height="65" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke={stat.color} strokeWidth="1" />
              <text x="65" y="26" textAnchor="middle" className="val" fill={stat.color} style={{ fontSize: '15px' }}>{stat.value}</text>
              <text x="65" y="45" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">{stat.label}</text>
            </g>
          ))}
        </g>

        {/* Purpose */}
        <g transform="translate(50, 365)">
          <text x="265" y="0" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
            Purpose: territory defense, attracting mates, and locating insects by sound
          </text>
        </g>
      </svg>
    </div>
  );
}
