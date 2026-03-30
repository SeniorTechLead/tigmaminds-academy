export default function MajuliShrinkingDiagram() {
  const years = [
    { year: '1901', area: 880, width: 220, color: '#22c55e' },
    { year: '1950', area: 700, width: 175, color: '#84cc16' },
    { year: '1972', area: 550, width: 137, color: '#eab308' },
    { year: '2001', area: 420, width: 105, color: '#f97316' },
    { year: '2020', area: 352, width: 88, color: '#ef4444' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 580 430" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing Majuli island shrinking from 880 square kilometers in 1901 to 352 square kilometers in 2020">
        <rect width="580" height="430" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="290" y="26" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Majuli Is Shrinking: 120 Years of Erosion</text>

        {/* Island outlines showing shrinkage */}
        <g transform="translate(290, 180)">
          {years.map((d, i) => {
            const h = d.width * 0.35;
            return (
              <g key={d.year}>
                <ellipse cx={0} cy={0} rx={d.width} ry={h}
                  fill="none" stroke={d.color} strokeWidth={i === years.length - 1 ? 2.5 : 1.5}
                  strokeDasharray={i === years.length - 1 ? 'none' : '6,4'}
                  opacity={i === years.length - 1 ? 1 : 0.5} />
                <text x={d.width + 5} y={-h + 6} fill={d.color} fontSize="10" fontWeight={i === years.length - 1 ? 'bold' : 'normal'}>
                  {d.year}
                </text>
              </g>
            );
          })}

          {/* Trees on remaining island */}
          {[-40, -10, 20, 50].map((x, i) => (
            <g key={`tree-${i}`}>
              <line x1={x} y1={0} x2={x} y2={-10} className="stroke-emerald-500" strokeWidth="1.5" />
              <circle cx={x} cy={-13} r={3.5} className="fill-emerald-500" opacity="0.6" />
            </g>
          ))}
        </g>

        {/* Water indication */}
        {[
          [-200, 160], [-180, 190], [180, 170], [200, 195],
          [-160, 210], [160, 215], [-140, 170], [170, 155],
        ].map(([dx, y], i) => (
          <path key={`wave-${i}`} d={`M ${290 + dx - 8},${y} Q ${290 + dx},${y - 3} ${290 + dx + 8},${y}`}
            fill="none" className="stroke-blue-500" strokeWidth="1" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
        ))}

        {/* Bar chart below */}
        <text x="290" y="265" textAnchor="middle" className="fill-slate-400" fontSize="11">Area over time (km\u00B2)</text>

        {years.map((d, i) => {
          const barH = d.area / 880 * 100;
          const x = 100 + i * 100;
          return (
            <g key={`bar-${d.year}`}>
              <rect x={x - 25} y={380 - barH} width="50" height={barH} rx="4"
                fill={d.color} opacity="0.7" />
              <text x={x} y={395} textAnchor="middle" fill={d.color} fontSize="10" fontWeight="bold">{d.year}</text>
              <text x={x} y={375 - barH} textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">{d.area}</text>
              <text x={x} y={387 - barH} textAnchor="middle" className="fill-slate-400" fontSize="9">km\u00B2</text>
            </g>
          );
        })}

        {/* Percentage loss */}
        <rect x="130" y="405" width="320" height="22" rx="6" className="fill-red-900" opacity="0.6" />
        <text x="290" y="420" textAnchor="middle" className="fill-red-300" fontSize="11" fontWeight="bold">
          60% of the island lost in 120 years
        </text>
      </svg>
    </div>
  );
}
