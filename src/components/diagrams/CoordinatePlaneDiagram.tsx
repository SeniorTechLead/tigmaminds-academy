export default function CoordinatePlaneDiagram() {
  const w = 400, h = 400;
  const cx = w / 2, cy = h / 2;
  const scale = 35;
  const gridRange = 5;

  const toSvg = (gx: number, gy: number) => ({
    x: cx + gx * scale,
    y: cy - gy * scale,
  });

  const points: { gx: number; gy: number; color: string; darkColor: string }[] = [
    { gx: 3, gy: 2, color: 'fill-blue-600', darkColor: 'dark:fill-blue-400' },
    { gx: -2, gy: 4, color: 'fill-green-600', darkColor: 'dark:fill-green-400' },
    { gx: -3, gy: -1, color: 'fill-red-600', darkColor: 'dark:fill-red-400' },
    { gx: 4, gy: -3, color: 'fill-purple-600', darkColor: 'dark:fill-purple-400' },
  ];

  const quadrants: { label: string; x: number; y: number }[] = [
    { label: 'I', x: cx + 60, y: cy - 60 },
    { label: 'II', x: cx - 60, y: cy - 60 },
    { label: 'III', x: cx - 60, y: cy + 70 },
    { label: 'IV', x: cx + 60, y: cy + 70 },
  ];

  // Grid lines
  const gridLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = -gridRange; i <= gridRange; i++) {
    gridLines.push({ x1: cx + i * scale, y1: cy - gridRange * scale, x2: cx + i * scale, y2: cy + gridRange * scale });
    gridLines.push({ x1: cx - gridRange * scale, y1: cy + i * scale, x2: cx + gridRange * scale, y2: cy + i * scale });
  }

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Coordinate plane with four quadrants and plotted points">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Grid */}
        {gridLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
        ))}

        {/* Axes */}
        <line x1={cx} y1={cy - gridRange * scale - 10} x2={cx} y2={cy + gridRange * scale + 10} className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1={cx - gridRange * scale - 10} y1={cy} x2={cx + gridRange * scale + 10} y2={cy} className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* Arrowhead marker */}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-gray-600 dark:fill-gray-300" />
          </marker>
        </defs>

        {/* Axis labels */}
        <text x={w - 10} y={cy - 10} fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200" textAnchor="end">x</text>
        <text x={cx + 12} y={18} fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">y</text>

        {/* Tick labels */}
        {Array.from({ length: 2 * gridRange + 1 }, (_, i) => i - gridRange).filter(n => n !== 0).map(n => (
          <g key={`tick-${n}`}>
            <line x1={cx + n * scale} y1={cy - 3} x2={cx + n * scale} y2={cy + 3} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
            <text x={cx + n * scale} y={cy + 16} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{n}</text>
            <line x1={cx - 3} y1={cy - n * scale} x2={cx + 3} y2={cy - n * scale} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
            <text x={cx - 12} y={cy - n * scale + 4} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{n}</text>
          </g>
        ))}

        {/* Origin label */}
        <text x={cx - 12} y={cy + 16} fontSize="10" className="fill-gray-500 dark:fill-gray-400" textAnchor="middle">0</text>

        {/* Quadrant labels */}
        {quadrants.map((q, i) => (
          <text key={i} x={q.x} y={q.y} fontSize="18" fontWeight="700" className="fill-gray-300 dark:fill-gray-600" textAnchor="middle">{q.label}</text>
        ))}

        {/* Plotted points */}
        {points.map((p, i) => {
          const s = toSvg(p.gx, p.gy);
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r="6" className={`${p.color} ${p.darkColor}`} />
              <text x={s.x + 10} y={s.y - 8} fontSize="11" fontWeight="600" className={`${p.color} ${p.darkColor}`}>
                ({p.gx}, {p.gy})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
