export default function StarMagnitudeScaleDiagram() {
  const stars = [
    { mag: -1, label: 'Sirius', r: 14, fill: '#e0e7ff' },
    { mag: 0, label: 'Vega', r: 11.5, fill: '#f0f4ff' },
    { mag: 1, label: 'Spica', r: 9.5, fill: '#dbeafe' },
    { mag: 2, label: 'Polaris', r: 7.5, fill: '#bfdbfe' },
    { mag: 3, label: '', r: 6, fill: '#93c5fd' },
    { mag: 4, label: '', r: 4.5, fill: '#60a5fa' },
    { mag: 5, label: '', r: 3, fill: '#3b82f6' },
    { mag: 6, label: 'Faintest', r: 1.8, fill: '#2563eb' },
  ];

  return (
    <svg viewBox="0 0 623 300" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Star magnitude scale from -1 (brightest) to 6 (faintest visible)">
      <rect width="520" height="260" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="30" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Star Magnitude Scale</text>
      <text x="260" y="48" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Lower number = brighter star (backwards!)</text>

      {/* Scale line */}
      <line x1="40" y1="140" x2="480" y2="140" stroke="#334155" strokeWidth="2" />
      <polygon points="480,137 490,140 480,143" fill="#334155" />
      <text x="493" y="144" className="fill-gray-400 dark:fill-slate-500" fontSize="9">dim</text>

      {stars.map((s, i) => {
        const x = 60 + i * 57;
        return (
          <g key={s.mag}>
            {/* Glow */}
            <circle cx={x} cy={110} r={s.r + 4} fill={s.fill} opacity={0.15} />
            {/* Star */}
            <circle cx={x} cy={110} r={s.r} fill={s.fill} />
            {/* Tick */}
            <line x1={x} y1={133} x2={x} y2={147} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            {/* Magnitude number */}
            <text x={x} y={163} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="12" fontWeight="600">{s.mag}</text>
            {/* Label */}
            {s.label && (
              <text x={x} y={180} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">{s.label}</text>
            )}
          </g>
        );
      })}

      {/* Bright / Dim labels */}
      <text x="60" y="200" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">BRIGHT</text>
      <text x="459" y="200" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="10" fontWeight="600">DIM</text>

      {/* Arrow annotation */}
      <text x="260" y="235" textAnchor="middle" fill="#fbbf24" fontSize="11">Each step = 2.5× brightness difference</text>
      <text x="260" y="250" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Naked eye limit: magnitude 6</text>
    </svg>
  );
}
