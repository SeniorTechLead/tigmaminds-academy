import { useState } from 'react';

export default function LinearGraphDiagram() {
  const [m, setM] = useState(1);
  const [b, setB] = useState(0);

  const w = 400, h = 400;
  const cx = w / 2, cy = h / 2;
  const scale = 30; // pixels per unit
  const gridRange = 6;

  // Convert graph coords to SVG coords
  const toSvg = (gx: number, gy: number) => ({
    x: cx + gx * scale,
    y: cy - gy * scale,
  });

  // Line endpoints: find where y = mx + b intersects the visible area
  const xMin = -gridRange, xMax = gridRange;
  const p1 = toSvg(xMin, m * xMin + b);
  const p2 = toSvg(xMax, m * xMax + b);

  // Grid lines
  const gridLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = -gridRange; i <= gridRange; i++) {
    // Vertical
    gridLines.push({ x1: cx + i * scale, y1: cy - gridRange * scale, x2: cx + i * scale, y2: cy + gridRange * scale });
    // Horizontal
    gridLines.push({ x1: cx - gridRange * scale, y1: cy + i * scale, x2: cx + gridRange * scale, y2: cy + i * scale });
  }

  // Y-intercept point
  const intercept = toSvg(0, b);

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Interactive linear graph y = mx + b">
        {/* Background */}
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Grid */}
        {gridLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
        ))}

        {/* Axes */}
        <line x1={cx} y1={cy - gridRange * scale} x2={cx} y2={cy + gridRange * scale} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={cx - gridRange * scale} y1={cy} x2={cx + gridRange * scale} y2={cy} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Axis labels */}
        <text x={w - 15} y={cy - 8} fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-gray-300" textAnchor="middle">x</text>
        <text x={cx + 10} y={20} fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-gray-300" textAnchor="start">y</text>

        {/* Tick labels on axes */}
        {[-6, -4, -2, 2, 4, 6].map(n => (
          <g key={`tx-${n}`}>
            <text x={cx + n * scale} y={cy + 15} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{n}</text>
            <text x={cx - 14} y={cy - n * scale + 4} fontSize="10" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{n}</text>
          </g>
        ))}

        {/* The line y = mx + b */}
        <line
          x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Y-intercept point */}
        <circle cx={intercept.x} cy={intercept.y} r="5" className="fill-red-500 dark:fill-red-400" />
        <text x={intercept.x + 10} y={intercept.y - 8} fontSize="11" fontWeight="600" className="fill-red-600 dark:fill-red-400">
          (0, {b})
        </text>

        {/* Equation display */}
        <rect x={10} y={10} width={160} height={36} rx="6" className="fill-blue-50 dark:fill-blue-900/40 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x={90} y={34} textAnchor="middle" fontSize="14" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
          y = {m}x {b >= 0 ? '+' : '−'} {Math.abs(b)}
        </text>

        {/* Slope label */}
        <text x={10} y={h - 60} fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
          Slope (m): {m}
        </text>

        {/* Intercept label */}
        <text x={10} y={h - 40} fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
          Y-intercept (b): {b}
        </text>
      </svg>

      {/* Sliders below the SVG */}
      <div className="mt-3 space-y-2 max-w-lg mx-auto px-2">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="w-28">Slope (m): {m}</span>
          <input
            type="range" min="-3" max="3" step="0.5" value={m}
            onChange={e => setM(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500"
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="w-28">Intercept (b): {b}</span>
          <input
            type="range" min="-5" max="5" step="1" value={b}
            onChange={e => setB(parseFloat(e.target.value))}
            className="flex-1 accent-red-500"
          />
        </label>
      </div>
    </div>
  );
}
