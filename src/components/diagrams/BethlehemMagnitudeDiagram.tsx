/**
 * BethlehemMagnitudeDiagram — Stellar magnitude scale showing how
 * astronomers measure star brightness (lower number = brighter).
 * Shows the logarithmic magnitude scale with example objects.
 */
export default function BethlehemMagnitudeDiagram() {
  const magnitudes = [
    { mag: -26.7, label: 'Sun', color: '#fbbf24', y: 30 },
    { mag: -12.7, label: 'Full Moon', color: '#e2e8f0', y: 55 },
    { mag: -4.6, label: 'Venus (max)', color: '#c4b5fd', y: 80 },
    { mag: -2.9, label: 'Jupiter-Saturn conjunction', color: '#93c5fd', y: 105 },
    { mag: -1.5, label: 'Sirius (brightest star)', color: '#67e8f9', y: 130 },
    { mag: 0, label: 'Vega (reference star)', color: '#a5b4fc', y: 155 },
    { mag: 2.0, label: 'Polaris (North Star)', color: '#94a3b8', y: 180 },
    { mag: 6.0, label: 'Faintest naked-eye star', color: '#64748b', y: 205 },
  ];

  const scaleLeft = 60;
  const scaleRight = 350;

  function magToX(m: number): number {
    const minMag = -27;
    const maxMag = 7;
    return scaleLeft + ((m - minMag) / (maxMag - minMag)) * (scaleRight - scaleLeft);
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 250" className="w-full" role="img" aria-label="Stellar magnitude scale from Sun to faintest visible stars">
        <rect width="400" height="250" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="200" y="18" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">Stellar Magnitude Scale</text>

        {/* Scale bar */}
        <defs>
          <linearGradient id="magGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="40%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <rect x={scaleLeft} y="225" width={scaleRight - scaleLeft} height="6" rx="3" fill="url(#magGrad)" opacity="0.5" />
        <text x={scaleLeft} y="242" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Brighter</text>
        <text x={scaleRight} y="242" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Dimmer</text>

        {/* Magnitude entries */}
        {magnitudes.map((item, i) => {
          const x = magToX(item.mag);
          const dotR = Math.max(2, 7 - i * 0.6);
          return (
            <g key={i}>
              <circle cx={x} cy={item.y} r={dotR} fill={item.color} opacity="0.9" />
              <line x1={x} y1={item.y + dotR + 1} x2={x} y2="224" stroke={item.color} strokeWidth="0.5" opacity="0.25" strokeDasharray="2 2" />
              <text x={x + dotR + 6} y={item.y + 3} className="fill-gray-700 dark:fill-slate-300" fontSize="10">{item.label}</text>
              <text x={x - dotR - 4} y={item.y + 3} textAnchor="end" fill={item.color} fontSize="10" fontWeight="bold">{item.mag > 0 ? '+' : ''}{item.mag}</text>
            </g>
          );
        })}

        {/* Key insight */}
        <text x="200" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Each step of 1 magnitude = 2.512x brightness difference</text>
      </svg>
    </div>
  );
}
