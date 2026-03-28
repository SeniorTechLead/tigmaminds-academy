export default function ProbabilityScaleDiagram() {
  const w = 500, h = 150;
  const lineY = 65;
  const left = 50, right = 450;
  const scaleW = right - left;

  const toX = (p: number) => left + p * scaleW;

  const events: { label: string; p: number; y: number }[] = [
    { label: 'Impossible', p: 0, y: -28 },
    { label: 'Rain tomorrow', p: 0.3, y: -28 },
    { label: 'Coin flip', p: 0.5, y: -28 },
    { label: 'Sun rises', p: 0.99, y: -28 },
  ];

  // Color stops for gradient: red → yellow → green
  const gradientId = 'prob-gradient';

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Probability scale from 0 (impossible) to 1 (certain)">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Gradient bar */}
        <rect x={left} y={lineY - 8} width={scaleW} height={16} rx="8" fill={`url(#${gradientId})`} opacity="0.7" />

        {/* Scale outline */}
        <rect x={left} y={lineY - 8} width={scaleW} height={16} rx="8" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Tick marks at 0, 0.25, 0.5, 0.75, 1.0 */}
        {[0, 0.25, 0.5, 0.75, 1.0].map(p => (
          <g key={p}>
            <line x1={toX(p)} y1={lineY + 10} x2={toX(p)} y2={lineY + 18} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
            <text x={toX(p)} y={lineY + 30} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">{p}</text>
          </g>
        ))}

        {/* Labels */}
        <text x={left} y={lineY + 45} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Unlikely</text>
        <text x={right} y={lineY + 45} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">Likely</text>

        {/* Events */}
        {events.map((e, i) => {
          const x = toX(e.p);
          return (
            <g key={i}>
              {/* Connector line */}
              <line x1={x} y1={lineY - 10} x2={x} y2={lineY + e.y + 14} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="2 2" />
              {/* Dot on scale */}
              <circle cx={x} cy={lineY} r="5" className="fill-white dark:fill-gray-900 stroke-gray-700 dark:stroke-gray-200" strokeWidth="2" />
              {/* Label */}
              <rect x={x - 40} y={lineY + e.y - 10} width={80} height={18} rx="4" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
              <text x={x} y={lineY + e.y + 3} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-200">{e.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
