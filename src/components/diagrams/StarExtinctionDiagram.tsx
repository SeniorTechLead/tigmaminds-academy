export default function StarExtinctionDiagram() {
  /* Plot points: airmass vs observed magnitude */
  const points = [
    { x: 1.0, y: 5.0 },
    { x: 1.15, y: 5.04 },
    { x: 1.3, y: 5.08 },
    { x: 1.5, y: 5.13 },
    { x: 1.7, y: 5.18 },
    { x: 2.0, y: 5.25 },
    { x: 2.5, y: 5.38 },
    { x: 3.0, y: 5.50 },
  ];

  const plotX = (v: number) => 80 + (v - 0.8) * 150;
  const plotY = (v: number) => 70 + (v - 4.9) * 250;

  return (
    <svg viewBox="0 0 600 334" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Atmospheric extinction plot showing magnitude increase with airmass">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Atmospheric Extinction</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Brightness decreases as light passes through more air</text>

      {/* Plot area */}
      <rect x="75" y="60" width="350" height="175" className="fill-gray-100 dark:fill-slate-800" rx="4" />

      {/* Axes */}
      <line x1="75" y1="235" x2="425" y2="235" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
      <line x1="75" y1="60" x2="75" y2="235" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

      {/* X axis label */}
      <text x="250" y="258" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Airmass (X)</text>
      {[1.0, 1.5, 2.0, 2.5, 3.0].map((v) => (
        <g key={v}>
          <line x1={plotX(v)} y1="235" x2={plotX(v)} y2="240" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x={plotX(v)} y="250" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">{v.toFixed(1)}</text>
        </g>
      ))}

      {/* Y axis label */}
      <text x="30" y="155" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" transform="rotate(-90 30 155)">Observed Magnitude</text>
      {[5.0, 5.1, 5.2, 5.3, 5.4, 5.5].map((v) => (
        <g key={v}>
          <line x1="70" y1={plotY(v)} x2="75" y2={plotY(v)} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="65" y={plotY(v) + 3} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">{v.toFixed(1)}</text>
          <line x1="76" y1={plotY(v)} x2="425" y2={plotY(v)} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
        </g>
      ))}
      <text x="55" y="72" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="7">bright</text>
      <text x="55" y="232" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="7">dim</text>

      {/* Data points and line */}
      <polyline
        points={points.map(p => `${plotX(p.x)},${plotY(p.y)}`).join(' ')}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2"
      />
      {points.map((p, i) => (
        <circle key={i} cx={plotX(p.x)} cy={plotY(p.y)} r="3.5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
      ))}

      {/* Best fit line extension */}
      <line x1={plotX(0.8)} y1={plotY(4.95)} x2={plotX(3.2)} y2={plotY(5.55)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" opacity={0.5} />

      {/* Slope annotation */}
      <line x1={plotX(2.0)} y1={plotY(5.25)} x2="460" y2="130" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
      <rect x="430" y="100" width="80" height="42" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="470" y="115" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">Slope = k</text>
      <text x="470" y="128" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">extinction</text>
      <text x="470" y="138" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">coefficient</text>

      {/* True magnitude annotation */}
      <line x1={plotX(1.0)} y1={plotY(5.0)} x2="430" y2="70" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="465" y="72" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">Extrapolate</text>
      <text x="465" y="84" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">to X=0 for</text>
      <text x="465" y="95" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">true brightness</text>

      {/* Formula */}
      <rect x="100" y="268" width="320" height="24" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="284" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">m_observed = m_true + k × X</text>
    </svg>
  );
}
