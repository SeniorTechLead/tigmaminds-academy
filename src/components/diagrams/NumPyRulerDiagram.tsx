export default function NumPyRulerDiagram() {
  const fewPoints = [0, 0.33, 0.67, 1.0, 1.33, 1.67, 2.0, 2.33, 2.67, 3.0];
  const manyPoints = Array.from({ length: 31 }, (_, i) => i * 0.1);

  return (
    <svg viewBox="0 0 600 200" className="w-full max-w-xl mx-auto my-6" role="img" aria-label="Two rulers comparing 10 points vs 30 points on a 0-3 scale">
      {/* Title area */}
      <text x="300" y="18" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">
        np.linspace(0, 3, count) — more points = finer detail
      </text>

      {/* Ruler 1: 10 points (coarse) */}
      <g transform="translate(40, 40)">
        <text x="0" y="0" className="fill-amber-600 dark:fill-amber-400" fontSize="12" fontWeight="700">10 points</text>
        {/* Rail */}
        <line x1="0" y1="25" x2="520" y2="25" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        {/* Ticks */}
        {fewPoints.map((val, i) => {
          const x = (val / 3) * 520;
          return (
            <g key={i}>
              <line x1={x} y1="15" x2={x} y2="35" className="stroke-amber-500" strokeWidth="3" strokeLinecap="round" />
              <circle cx={x} cy="25" r="5" className="fill-amber-500" />
              {i % 3 === 0 && (
                <text x={x} y="52" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace">{val.toFixed(1)}</text>
              )}
            </g>
          );
        })}
        <text x="540" y="30" className="fill-gray-400" fontSize="10">sec</text>
      </g>

      {/* Ruler 2: 30 points (fine) */}
      <g transform="translate(40, 110)">
        <text x="0" y="0" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="700">30 points</text>
        {/* Rail */}
        <line x1="0" y1="25" x2="520" y2="25" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        {/* Ticks */}
        {manyPoints.map((val, i) => {
          const x = (val / 3) * 520;
          return (
            <g key={i}>
              <line x1={x} y1="18" x2={x} y2="32" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />
              <circle cx={x} cy="25" r="3" className="fill-emerald-500" />
              {i % 10 === 0 && (
                <text x={x} y="50" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace">{val.toFixed(1)}</text>
              )}
            </g>
          );
        })}
        <text x="540" y="30" className="fill-gray-400" fontSize="10">sec</text>
      </g>

      {/* Gap labels */}
      <g transform="translate(40, 75)">
        <line x1="0" y1="0" x2={520 / 3 / 3} y2="0" className="stroke-amber-400" strokeWidth="1" strokeDasharray="3,3" />
        <text x={520 / 3 / 6} y="13" textAnchor="middle" className="fill-amber-500" fontSize="9">gap: 0.33s</text>
      </g>
      <g transform="translate(40, 155)">
        <line x1="0" y1="0" x2={520 / 30} y2="0" className="stroke-emerald-400" strokeWidth="1" strokeDasharray="3,3" />
        <text x={520 / 30 / 2 + 30} y="13" textAnchor="start" className="fill-emerald-500" fontSize="9">gap: 0.10s</text>
      </g>
    </svg>
  );
}
