export default function StarSkyQualityDiagram() {
  const readings = [
    { label: 'Ziro Valley', sqm: 21.5, color: '#22c55e', stars: 12, skyFill: '#020617' },
    { label: 'Rural Assam', sqm: 20.5, color: '#84cc16', stars: 8, skyFill: '#0c1220' },
    { label: 'Small town', sqm: 19.5, color: '#eab308', stars: 5, skyFill: '#1a1c2e' },
    { label: 'Guwahati suburb', sqm: 18.5, color: '#f59e0b', stars: 3, skyFill: '#2d2520' },
    { label: 'Guwahati center', sqm: 17.0, color: '#f87171', stars: 1, skyFill: '#422006' },
  ];

  const barMaxW = 200;
  const minSqm = 16;
  const maxSqm = 22;

  return (
    <svg viewBox="0 0 546 346" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Sky quality meter readings comparing Ziro Valley to Guwahati">
      <rect width="520" height="310" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Sky Quality Measurement</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">SQM readings in mag/arcsec² — higher = darker = better</text>

      {/* SQM Meter illustration */}
      <rect x="20" y="65" width="90" height="50" rx="8" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
      <text x="65" y="82" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="700" fontFamily="monospace">21.5</text>
      <text x="65" y="95" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">mag/arcsec²</text>
      <text x="65" y="107" textAnchor="middle" fill="#60a5fa" fontSize="8">SQM Meter</text>
      <circle cx="30" cy="75" r="4" fill="#475569" />

      {/* Readings as horizontal bars */}
      {readings.map((r, i) => {
        const y = 75 + i * 42;
        const barW = ((r.sqm - minSqm) / (maxSqm - minSqm)) * barMaxW;

        return (
          <g key={r.label}>
            {/* Label */}
            <text x="135" y={y + 4} textAnchor="end" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">{r.label}</text>

            {/* Bar */}
            <rect x="145" y={y - 10} width={barW} height="20" rx="3" fill={r.color} opacity={0.3} />
            <rect x="145" y={y - 10} width={barW} height="20" rx="3" fill="none" stroke={r.color} strokeWidth="1" />

            {/* Value */}
            <text x={150 + barW} y={y + 4} fill={r.color} fontSize="11" fontWeight="700">{r.sqm.toFixed(1)}</text>

            {/* Mini sky preview */}
            <circle cx={barMaxW + 205} cy={y} r="14" fill={r.skyFill} stroke="#334155" strokeWidth="0.5" />
            {Array.from({ length: r.stars }).map((_, si) => {
              const a = (si / r.stars) * Math.PI * 2 + 0.5;
              const rad = 5 + (si % 2) * 5;
              return (
                <circle key={si} cx={barMaxW + 205 + Math.cos(a) * rad} cy={y + Math.sin(a) * rad} r="1" fill="#fef3c7" opacity={0.7} />
              );
            })}

            {/* Quality label */}
            <text x={barMaxW + 235} y={y + 4} className="fill-gray-500 dark:fill-slate-400" fontSize="8">
              {r.sqm >= 21 ? 'Excellent' : r.sqm >= 20 ? 'Good' : r.sqm >= 19 ? 'Fair' : r.sqm >= 18 ? 'Poor' : 'Bad'}
            </text>
          </g>
        );
      })}

      {/* Scale reference */}
      <rect x="60" y="280" width="400" height="24" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="296" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">
        Each 1.0 mag/arcsec² = sky is ~2.5× darker (same log scale as star magnitudes!)
      </text>
    </svg>
  );
}
