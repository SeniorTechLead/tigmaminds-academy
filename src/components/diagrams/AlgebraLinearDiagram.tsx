/**
 * AlgebraLinearDiagram — Visualising y = mx + b on a coordinate plane.
 * Shows how changing slope (m) and intercept (b) transforms a line.
 */
import { useState } from 'react';

export default function AlgebraLinearDiagram() {
  const [slope, setSlope] = useState(2);
  const [intercept, setIntercept] = useState(1);

  const ox = 180, oy = 180; // origin in SVG coords
  const scale = 25;
  const gridMin = -3, gridMax = 7;

  const toSvg = (gx: number, gy: number) => ({ x: ox + gx * scale, y: oy - gy * scale });

  // Line endpoints within grid
  const x1g = gridMin, x2g = gridMax;
  const y1g = slope * x1g + intercept;
  const y2g = slope * x2g + intercept;
  const p1 = toSvg(x1g, y1g);
  const p2 = toSvg(x2g, y2g);

  // Sample points on the line
  const points = [0, 1, 2, 3].map(gx => ({ gx, gy: slope * gx + intercept }));

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 280" className="w-full" role="img" aria-label="Linear equation y equals mx plus b plotted on a grid">
        <rect width="400" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="20" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">
          y = {slope}x {intercept >= 0 ? '+' : '−'} {Math.abs(intercept)}
        </text>

        {/* Grid lines */}
        {Array.from({ length: gridMax - gridMin + 1 }, (_, i) => gridMin + i).map(v => {
          const gx = toSvg(v, 0);
          const gy = toSvg(0, v);
          return (
            <g key={v}>
              <line x1={gx.x} y1={oy - gridMin * scale} x2={gx.x} y2={oy - gridMax * scale} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="0.5" />
              <line x1={ox + gridMin * scale} y1={gy.y} x2={ox + gridMax * scale} y2={gy.y} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* Axes */}
        <line x1={ox + gridMin * scale} y1={oy} x2={ox + gridMax * scale} y2={oy} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={ox} y1={oy - gridMin * scale} x2={ox} y2={oy - gridMax * scale} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <text x={ox + gridMax * scale + 8} y={oy + 4} className="fill-gray-500 dark:fill-gray-400" fontSize="11">x</text>
        <text x={ox + 6} y={oy - gridMax * scale + 4} className="fill-gray-500 dark:fill-gray-400" fontSize="11">y</text>

        {/* Axis numbers */}
        {[0, 1, 2, 3, 4, 5].map(v => {
          const px = toSvg(v, 0);
          const py = toSvg(0, v);
          return (
            <g key={`n${v}`}>
              {v > 0 && <text x={px.x} y={oy + 14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{v}</text>}
              {v > 0 && <text x={ox - 12} y={py.y + 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{v}</text>}
            </g>
          );
        })}

        {/* Clip the line to the visible area */}
        <defs>
          <clipPath id="algGrid">
            <rect x={ox + gridMin * scale} y={oy - gridMax * scale} width={(gridMax - gridMin) * scale} height={(gridMax - gridMin) * scale} />
          </clipPath>
        </defs>

        {/* The line */}
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3b82f6" strokeWidth="2.5" clipPath="url(#algGrid)" />

        {/* Sample points with labels */}
        {points.map((pt, i) => {
          const s = toSvg(pt.gx, pt.gy);
          if (s.y < oy - gridMax * scale || s.y > oy - gridMin * scale) return null;
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r="4" fill="#3b82f6" />
              <text x={s.x + 8} y={s.y - 6} className="fill-blue-600 dark:fill-blue-400" fontSize="10">({pt.gx},{pt.gy})</text>
            </g>
          );
        })}

        {/* Slope triangle between point 0 and 1 */}
        {(() => {
          const a = toSvg(points[0].gx, points[0].gy);
          const b = toSvg(points[1].gx, points[0].gy);
          const c = toSvg(points[1].gx, points[1].gy);
          if (a.y > oy - gridMin * scale || c.y < oy - gridMax * scale) return null;
          return (
            <g>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1={b.x} y1={b.y} x2={c.x} y2={c.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={(a.x + b.x) / 2} y={a.y + 14} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">run = 1</text>
              <text x={b.x + 14} y={(b.y + c.y) / 2 + 4} className="fill-amber-600 dark:fill-amber-400" fontSize="10">rise = {slope}</text>
            </g>
          );
        })()}

        {/* y-intercept marker */}
        {(() => {
          const pt = toSvg(0, intercept);
          return (
            <g>
              <circle cx={pt.x} cy={pt.y} r="5" fill="none" stroke="#10b981" strokeWidth="2" />
              <text x={pt.x - 10} y={pt.y - 8} textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">b = {intercept}</text>
            </g>
          );
        })()}

        <text x="200" y="270" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Slope (m) = rise ÷ run = {slope}. Intercept (b) = {intercept}.</text>
      </svg>

      <div className="flex justify-center gap-4 mt-2 text-sm">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          Slope:
          <input type="range" min={-2} max={4} step={1} value={slope} onChange={e => setSlope(Number(e.target.value))} className="w-24" />
          <span className="font-mono w-6">{slope}</span>
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          Intercept:
          <input type="range" min={-2} max={4} step={1} value={intercept} onChange={e => setIntercept(Number(e.target.value))} className="w-24" />
          <span className="font-mono w-6">{intercept}</span>
        </label>
      </div>
    </div>
  );
}
