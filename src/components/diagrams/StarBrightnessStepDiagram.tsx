export default function StarBrightnessStepDiagram() {
  const steps = [
    { mag: 6, mult: '1×', y: 210, w: 40 },
    { mag: 5, mult: '2.5×', y: 180, w: 65 },
    { mag: 4, mult: '6.3×', y: 150, w: 95 },
    { mag: 3, mult: '16×', y: 120, w: 130 },
    { mag: 2, mult: '40×', y: 90, w: 170 },
    { mag: 1, mult: '100×', y: 60, w: 215 },
  ];

  return (
    <svg viewBox="0 0 546 320" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Brightness staircase showing 2.5x multiplier per magnitude step">
      <rect width="520" height="280" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Brightness Staircase</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">5 steps × 2.5 each = 100× total</text>

      {/* Y axis label */}
      <text x="22" y="140" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" transform="rotate(-90 22 140)">Brightness →</text>

      {/* Staircase */}
      {steps.map((s, i) => {
        const x = 70 + i * 72;
        const barH = 230 - s.y;
        const opacity = 0.3 + (i * 0.14);
        return (
          <g key={s.mag}>
            {/* Bar */}
            <rect x={x} y={s.y} width="55" height={barH} rx="3" fill="#fbbf24" opacity={opacity} />
            <rect x={x} y={s.y} width="55" height="3" rx="1" fill="#fbbf24" />

            {/* Magnitude label */}
            <text x={x + 27.5} y={s.y - 8} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="11" fontWeight="600">mag {s.mag}</text>

            {/* Multiplier */}
            <text x={x + 27.5} y={s.y + 20} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">{s.mult}</text>

            {/* ×2.5 arrow between bars */}
            {i < steps.length - 1 && (
              <g>
                <line x1={x + 55} y1={s.y + 10} x2={x + 72} y2={steps[i + 1].y + 10} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x={x + 63} y={s.y - 2} textAnchor="middle" fill="#f59e0b" fontSize="8">×2.5</text>
              </g>
            )}
          </g>
        );
      })}

      {/* Bottom label */}
      <text x="260" y="252" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">100× brighter</text>
      <line x1="100" y1="257" x2="200" y2="257" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <line x1="320" y1="257" x2="420" y2="257" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x="105" y="270" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Faintest (mag 6)</text>
      <text x="330" y="270" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Bright (mag 1)</text>
    </svg>
  );
}
