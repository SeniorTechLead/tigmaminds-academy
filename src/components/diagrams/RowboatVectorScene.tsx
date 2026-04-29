/**
 * Tara rows across a river. She paddles 4 m/s straight north. The river
 * current pushes her 3 m/s east. Her actual motion is the *vector sum*
 * of these two — 5 m/s diagonally. Vectors as displacements you can add.
 *
 * Used to open the Matrices and Vectors section.
 */
import Tara from './people/Tara';

export default function RowboatVectorScene() {
  const W = 760, H = 380;

  // Origin
  const ox = 240, oy = 280;
  // Vector arrows
  // Paddle: 4 m/s north (up). 1 m/s = 30 px.
  const u = 30;
  const paddle = { dx: 0, dy: -4 * u };
  const current = { dx: 3 * u, dy: 0 };
  // Resultant
  const resultant = { dx: paddle.dx + current.dx, dy: paddle.dy + current.dy };
  const resMag = Math.sqrt((paddle.dx + current.dx) ** 2 + (paddle.dy + current.dy) ** 2) / u;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara rows north while a river current pushes east; her actual motion is the vector sum of the two">

        {/* River background */}
        <rect x="0" y="0" width={W} height="60" fill="#84cc16" opacity="0.5" className="dark:fill-emerald-900" />
        <rect x="0" y="60" width={W} height={H - 60} fill="#60a5fa" className="dark:fill-blue-900" />
        {/* Water ripples — flowing east */}
        {[100, 250, 400, 550, 680].map((wx, i) => (
          <path key={i} d={`M ${wx} ${100 + (i % 2) * 60} q 12 -4 24 0 q 12 4 24 0`}
            fill="none" stroke="#1e40af" strokeWidth="1.2" opacity="0.5" />
        ))}
        {[150, 300, 480, 600].map((wx, i) => (
          <path key={`w2-${i}`} d={`M ${wx} ${180 + (i % 2) * 50} q 12 -4 24 0 q 12 4 24 0`}
            fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.5" />
        ))}
        {/* Far bank */}
        <rect x="0" y="0" width={W} height="60" fill="#84cc16" opacity="0.6" className="dark:fill-emerald-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara crosses the river
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Paddle + current = actual motion. Vector sum.
        </text>

        {/* Boat at origin */}
        <g transform={`translate(${ox}, ${oy})`}>
          <ellipse cx="0" cy="0" rx="36" ry="10" fill="#7c2d12" stroke="#451a03" strokeWidth="1.5" />
          <ellipse cx="0" cy="-2" rx="32" ry="7" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          {/* Tara seated in the boat */}
          <ellipse cx="0" cy="-12" rx="6" ry="8" fill="#d9a273" stroke="#1f2937" strokeWidth="1" />
          <rect x="-7" y="-6" width="14" height="8" fill="#f97316" stroke="#1f2937" strokeWidth="1" />
        </g>

        {/* Paddle vector — north (up) — green */}
        <line x1={ox} y1={oy} x2={ox + paddle.dx} y2={oy + paddle.dy}
          stroke="#16a34a" strokeWidth="3" markerEnd="url(#arGreen-rv)" />
        <defs>
          <marker id="arGreen-rv" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#16a34a" />
          </marker>
        </defs>
        <rect x={ox - 90} y={oy + paddle.dy / 2 - 11} width="80" height="22" rx="11"
          fill="#dcfce7" stroke="#16a34a" strokeWidth="1.2" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
        <text x={ox - 50} y={oy + paddle.dy / 2 + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-emerald-200">
          paddle (4 N)
        </text>

        {/* Current vector — east (right) — blue */}
        <line x1={ox} y1={oy} x2={ox + current.dx} y2={oy + current.dy}
          stroke="#2563eb" strokeWidth="3" markerEnd="url(#arBlue-rv)" />
        <defs>
          <marker id="arBlue-rv" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#2563eb" />
          </marker>
        </defs>
        <rect x={ox + current.dx / 2 - 50} y={oy + 16} width="100" height="22" rx="11"
          fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x={ox + current.dx / 2} y={oy + 30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-200">
          current (3 E)
        </text>

        {/* Parallelogram lines — dashed completion */}
        <line x1={ox + paddle.dx} y1={oy + paddle.dy} x2={ox + resultant.dx} y2={oy + resultant.dy}
          stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1={ox + current.dx} y1={oy + current.dy} x2={ox + resultant.dx} y2={oy + resultant.dy}
          stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />

        {/* Resultant vector — diagonal — orange */}
        <line x1={ox} y1={oy} x2={ox + resultant.dx} y2={oy + resultant.dy}
          stroke="#f97316" strokeWidth="3.5" markerEnd="url(#arOrange-rv)" />
        <defs>
          <marker id="arOrange-rv" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#f97316" />
          </marker>
        </defs>
        <rect x={ox + resultant.dx + 8} y={oy + resultant.dy / 2 - 18} width="120" height="36" rx="12"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={ox + resultant.dx + 68} y={oy + resultant.dy / 2 - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          actual motion
        </text>
        <text x={ox + resultant.dx + 68} y={oy + resultant.dy / 2 + 10} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          {resMag.toFixed(0)} m/s diagonal
        </text>

        {/* Compass on top right */}
        <g transform="translate(700, 90)">
          <circle cx="0" cy="0" r="22" fill="white" stroke="#475569" strokeWidth="1.2" />
          <text x="0" y="-12" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">N</text>
          <text x="14" y="3" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">E</text>
          <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">S</text>
          <text x="-14" y="3" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">W</text>
          <line x1="0" y1="-12" x2="0" y2="6" stroke="#dc2626" strokeWidth="1.5" />
        </g>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 26} width="480" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A vector has direction AND magnitude. Tail-to-head addition gives the resultant.
        </text>
      </svg>
    </div>
  );
}
