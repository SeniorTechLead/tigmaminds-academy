import { useState } from 'react';

// ── Click the Plane ───────────────────────────────────────────
// Interactive coordinate plane: click anywhere to plot a point,
// or drag the demo point around. Live readout shows which
// quadrant it's in.

export default function CoordinatePlaneDiagram() {
  const w = 400, h = 400;
  const cx = w / 2, cy = h / 2;
  const scale = 35;
  const gridRange = 5;

  const [point, setPoint] = useState<{ gx: number; gy: number }>({ gx: 3, gy: 2 });
  const [clickedPoints, setClickedPoints] = useState<{ gx: number; gy: number }[]>([]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * w;
    const svgY = ((e.clientY - rect.top) / rect.height) * h;
    const gx = Math.round((svgX - cx) / scale);
    const gy = Math.round(-(svgY - cy) / scale);
    if (Math.abs(gx) > gridRange || Math.abs(gy) > gridRange) return;
    setPoint({ gx, gy });
    setClickedPoints(pts => [...pts, { gx, gy }].slice(-5));
  };

  const s = { x: cx + point.gx * scale, y: cy - point.gy * scale };

  const quadrant = point.gx === 0 && point.gy === 0
    ? 'origin'
    : point.gx === 0
    ? 'y-axis'
    : point.gy === 0
    ? 'x-axis'
    : point.gx > 0 && point.gy > 0
    ? 'Quadrant I'
    : point.gx < 0 && point.gy > 0
    ? 'Quadrant II'
    : point.gx < 0 && point.gy < 0
    ? 'Quadrant III'
    : 'Quadrant IV';

  const quadrants = [
    { label: 'I', x: cx + 60, y: cy - 60 },
    { label: 'II', x: cx - 60, y: cy - 60 },
    { label: 'III', x: cx - 60, y: cy + 70 },
    { label: 'IV', x: cx + 60, y: cy + 70 },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-purple-50 dark:from-blue-950 dark:via-slate-950 dark:to-purple-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          Click to Plot
        </p>
        <div className="text-xs">
          <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
            ({point.gx}, {point.gy})
          </span>
          <span className="text-gray-600 dark:text-gray-400 ml-2">→ {quadrant}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md mx-auto cursor-crosshair" role="img"
        onClick={handleClick}
        aria-label="Interactive coordinate plane — click to plot a point">
        <rect width={w} height={h} className="fill-white dark:fill-slate-900" rx="8" />

        {/* Grid */}
        {Array.from({ length: 2 * gridRange + 1 }, (_, i) => i - gridRange).map(i => (
          <g key={`g-${i}`}>
            <line x1={cx + i * scale} y1={cy - gridRange * scale} x2={cx + i * scale} y2={cy + gridRange * scale} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <line x1={cx - gridRange * scale} y1={cy + i * scale} x2={cx + gridRange * scale} y2={cy + i * scale} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={cx} y1={cy - gridRange * scale - 10} x2={cx} y2={cy + gridRange * scale + 10} className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1={cx - gridRange * scale - 10} y1={cy} x2={cx + gridRange * scale + 10} y2={cy} className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-gray-600 dark:fill-gray-300" />
          </marker>
        </defs>

        {/* Axis labels */}
        <text x={w - 10} y={cy - 10} fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200" textAnchor="end">x</text>
        <text x={cx + 12} y={18} fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">y</text>

        {/* Ticks */}
        {Array.from({ length: 2 * gridRange + 1 }, (_, i) => i - gridRange).filter(n => n !== 0).map(n => (
          <g key={`t-${n}`}>
            <line x1={cx + n * scale} y1={cy - 3} x2={cx + n * scale} y2={cy + 3} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
            <text x={cx + n * scale} y={cy + 16} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{n}</text>
            <line x1={cx - 3} y1={cy - n * scale} x2={cx + 3} y2={cy - n * scale} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
            <text x={cx - 12} y={cy - n * scale + 4} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{n}</text>
          </g>
        ))}

        {/* Quadrant labels */}
        {quadrants.map((q, i) => (
          <text key={i} x={q.x} y={q.y} fontSize="18" fontWeight="700" className="fill-gray-300 dark:fill-gray-600" textAnchor="middle">{q.label}</text>
        ))}

        {/* Reference lines to current point */}
        <line x1={cx} y1={s.y} x2={s.x} y2={s.y} className="stroke-blue-400" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1={s.x} y1={cy} x2={s.x} y2={s.y} className="stroke-blue-400" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Previously-clicked trail */}
        {clickedPoints.slice(0, -1).map((p, i) => {
          const sp = { x: cx + p.gx * scale, y: cy - p.gy * scale };
          return (
            <circle key={`p-${i}`} cx={sp.x} cy={sp.y} r="4" fill="#94a3b8" opacity={0.3} />
          );
        })}

        {/* Current point */}
        <circle cx={s.x} cy={s.y} r="12" fill="#3b82f6" opacity="0.25" />
        <circle cx={s.x} cy={s.y} r="7" fill="#3b82f6" stroke="white" strokeWidth="2" />
        <text x={s.x + 12} y={s.y - 10} fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
          ({point.gx}, {point.gy})
        </text>
      </svg>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        Click anywhere to plot a point. Every location in the plane has a unique (x, y) address.
      </p>
    </div>
  );
}
