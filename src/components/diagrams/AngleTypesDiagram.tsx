export default function AngleTypesDiagram() {
  const angles = [
    { label: 'Acute', degrees: 45, color: 'fill-emerald-500 dark:fill-emerald-400', arcColor: 'stroke-emerald-400' },
    { label: 'Right', degrees: 90, color: 'fill-blue-500 dark:fill-blue-400', arcColor: 'stroke-blue-400' },
    { label: 'Obtuse', degrees: 120, color: 'fill-amber-500 dark:fill-amber-400', arcColor: 'stroke-amber-400' },
    { label: 'Straight', degrees: 180, color: 'fill-purple-500 dark:fill-purple-400', arcColor: 'stroke-purple-400' },
    { label: 'Reflex', degrees: 270, color: 'fill-red-500 dark:fill-red-400', arcColor: 'stroke-red-400' },
  ];

  const cx = 50; // local center x for each angle
  const cy = 100; // local center y
  const armLen = 45;
  const arcR = 25;

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 200" className="w-full max-w-xl mx-auto" role="img" aria-label="Types of angles diagram">
        {angles.map((a, i) => {
          const ox = 15 + i * 108;
          const rad = (a.degrees * Math.PI) / 180;
          // Base arm goes right
          const ax1 = cx + armLen;
          const ay1 = cy;
          // Second arm at the angle (measured counter-clockwise from positive x)
          const ax2 = cx + armLen * Math.cos(-rad);
          const ay2 = cy + armLen * Math.sin(-rad);
          // Arc: draw from 0 to -degrees
          const arcEndX = cx + arcR * Math.cos(-rad);
          const arcEndY = cy + arcR * Math.sin(-rad);
          const largeArc = a.degrees > 180 ? 1 : 0;

          return (
            <g key={a.label} transform={`translate(${ox}, 0)`}>
              {/* Base arm */}
              <line x1={cx} y1={cy} x2={ax1} y2={ay1}
                className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
              {/* Angled arm */}
              <line x1={cx} y1={cy} x2={ax2} y2={ay2}
                className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
              {/* Arc */}
              <path
                d={`M ${cx + arcR},${cy} A ${arcR},${arcR} 0 ${largeArc} 0 ${arcEndX},${arcEndY}`}
                fill="none" className={a.arcColor} strokeWidth="2" />
              {/* Right angle square for 90° */}
              {a.degrees === 90 && (
                <rect x={cx + 8} y={cy - 16} width="8" height="8"
                  fill="none" className="stroke-blue-400" strokeWidth="1.5" />
              )}
              {/* Vertex dot */}
              <circle cx={cx} cy={cy} r="3" className={a.color} />
              {/* Degree label inside arc */}
              {(() => {
                const midAngle = (-a.degrees / 2) * Math.PI / 180;
                const labelR = a.degrees === 270 ? 18 : arcR + 12;
                const lx = cx + labelR * Math.cos(midAngle);
                const ly = cy + labelR * Math.sin(midAngle);
                return (
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                    className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">
                    {a.degrees}°
                  </text>
                );
              })()}
              {/* Type label */}
              <text x={cx} y={165} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
                {a.label}
              </text>
              <text x={cx} y="180" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
                {a.degrees === 45 ? '< 90°' : a.degrees === 90 ? '= 90°' : a.degrees === 120 ? '> 90°, < 180°' : a.degrees === 180 ? '= 180°' : '> 180°'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
