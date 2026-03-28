export default function TrigGraphsDiagram() {
  const w = 500, h = 350;
  const padL = 45, padR = 15, padT = 25, padB = 30;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  // X range: 0 to 2π, Y range: -3 to 3 (for tan clipping)
  const xMin = 0, xMax = 2 * Math.PI;
  const yMin = -3, yMax = 3;

  const toSvgX = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => padT + ((yMax - y) / (yMax - yMin)) * plotH;

  const steps = 200;
  const dx = (xMax - xMin) / steps;

  // Generate path string
  const makePath = (fn: (x: number) => number, clipY = 10) => {
    const segments: string[] = [];
    let inSegment = false;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = fn(x);
      if (Math.abs(y) > clipY) {
        inSegment = false;
        continue;
      }
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      if (!inSegment) {
        segments.push(`M${sx.toFixed(1)},${sy.toFixed(1)}`);
        inSegment = true;
      } else {
        segments.push(`L${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
    }
    return segments.join(' ');
  };

  const sinPath = makePath(Math.sin);
  const cosPath = makePath(Math.cos);
  const tanPath = makePath(Math.tan, 2.8);

  // Asymptotes for tan at π/2 and 3π/2
  const asymptotes = [Math.PI / 2, (3 * Math.PI) / 2];

  // X-axis labels in radians
  const xLabels: { val: number; label: string }[] = [
    { val: 0, label: '0' },
    { val: Math.PI / 2, label: 'π/2' },
    { val: Math.PI, label: 'π' },
    { val: (3 * Math.PI) / 2, label: '3π/2' },
    { val: 2 * Math.PI, label: '2π' },
  ];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Trigonometric graphs: sin, cos, and tan">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Y grid lines */}
        {[-2, -1, 0, 1, 2].map(y => (
          <g key={`yg-${y}`}>
            <line x1={padL} y1={toSvgY(y)} x2={w - padR} y2={toSvgY(y)}
              className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <text x={padL - 8} y={toSvgY(y) + 4} fontSize="10" textAnchor="end" className="fill-gray-500 dark:fill-gray-400">{y}</text>
          </g>
        ))}

        {/* X grid lines */}
        {xLabels.map(({ val, label }) => (
          <g key={`xg-${label}`}>
            <line x1={toSvgX(val)} y1={padT} x2={toSvgX(val)} y2={h - padB}
              className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <text x={toSvgX(val)} y={h - padB + 16} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{label}</text>
          </g>
        ))}

        {/* X axis */}
        <line x1={padL} y1={toSvgY(0)} x2={w - padR} y2={toSvgY(0)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Asymptotes */}
        {asymptotes.map((a, i) => (
          <line key={i} x1={toSvgX(a)} y1={padT} x2={toSvgX(a)} y2={h - padB}
            stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        ))}

        {/* sin curve */}
        <path d={sinPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

        {/* cos curve */}
        <path d={cosPath} fill="none" stroke="#22c55e" strokeWidth="2.5" />

        {/* tan curve */}
        <path d={tanPath} fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Legend */}
        <rect x={padL + 8} y={padT + 4} width={120} height={60} rx="6" className="fill-white/80 dark:fill-gray-800/80 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        {[
          { color: '#3b82f6', label: 'sin(x)' },
          { color: '#22c55e', label: 'cos(x)' },
          { color: '#ef4444', label: 'tan(x)' },
        ].map((item, i) => (
          <g key={i}>
            <line x1={padL + 16} y1={padT + 20 + i * 17} x2={padL + 36} y2={padT + 20 + i * 17}
              stroke={item.color} strokeWidth="2.5" />
            <text x={padL + 42} y={padT + 24 + i * 17} fontSize="11" fontWeight="600" fill={item.color}>{item.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
