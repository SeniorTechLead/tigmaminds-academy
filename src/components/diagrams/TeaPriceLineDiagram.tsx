/**
 * Bipin runs a tea stall. Each cup costs ₹15. Total cost to buy n cups
 * is plotted as a straight line: y = 15x. Watch the line slope upward,
 * one rupee at a time. Real-world introduction to y = mx (no b).
 *
 * Used to open the Linear Equations and Graphs section.
 */
import Bipin from './people/Bipin';

export default function TeaPriceLineDiagram() {
  const W = 720, H = 380;

  // Graph area
  const gx0 = 240, gx1 = 660, gy0 = 80, gy1 = 320;
  const xMax = 8, yMax = 120;
  const X = (x: number) => gx0 + (x / xMax) * (gx1 - gx0);
  const Y = (y: number) => gy1 - (y / yMax) * (gy1 - gy0);

  // Sample data points (cups, cost) along y = 15x
  const points = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(c => ({ cups: c, cost: 15 * c }));

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Bipin's tea stall: total cost rises in a straight line as the number of cups increases">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Bipin's tea stall — ₹15 per cup
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Buy cups, watch the cost rise in a straight line.
        </text>

        {/* Bipin on lower left */}
        <Bipin x={120} y={350} scale={0.85} pose="standing" />

        {/* Cup of tea next to Bipin */}
        <g transform="translate(170, 280)">
          <path d="M 0 0 L 4 25 L 26 25 L 30 0 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="1.2" />
          <ellipse cx="15" cy="0" rx="15" ry="3.5" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          <ellipse cx="15" cy="0" rx="11" ry="2.5" fill="#fbbf24" />
          {/* Steam */}
          <path d="M 8 -6 q 2 -8 4 0 M 15 -8 q 2 -8 4 0 M 22 -6 q 2 -8 4 0" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.7" />
          {/* Handle */}
          <path d="M 30 6 q 8 4 0 14" fill="none" stroke="#451a03" strokeWidth="2" />
        </g>

        {/* Graph background */}
        <rect x={gx0 - 30} y={gy0 - 18} width={gx1 - gx0 + 50} height={gy1 - gy0 + 36}
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" rx="4" className="dark:fill-gray-800 dark:stroke-gray-600" />

        {/* Grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`gv-${i}`} x1={X(i)} y1={gy0} x2={X(i)} y2={gy1} stroke="#e5e7eb" strokeWidth="0.6" className="dark:stroke-gray-700" />
        ))}
        {[0, 30, 60, 90, 120].map(d => (
          <line key={`gh-${d}`} x1={gx0} y1={Y(d)} x2={gx1} y2={Y(d)} stroke="#e5e7eb" strokeWidth="0.6" className="dark:stroke-gray-700" />
        ))}

        {/* Axes */}
        <line x1={gx0} y1={gy1} x2={gx1 + 14} y2={gy1} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arX-tp)" />
        <line x1={gx0} y1={gy1} x2={gx0} y2={gy0 - 14} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arY-tp)" />
        <defs>
          <marker id="arX-tp" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arY-tp" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
        </defs>

        {/* Axis labels */}
        <text x={gx1 + 16} y={gy1 + 4} fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">cups (x)</text>
        <text x={gx0 - 6} y={gy0 - 18} fontSize="11" fontWeight="700" fill="#475569" textAnchor="end" className="dark:fill-gray-300">cost (₹)</text>

        {/* Tick labels */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(c => (
          <text key={`xl-${c}`} x={X(c)} y={gy1 + 16} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">{c}</text>
        ))}
        {[0, 30, 60, 90, 120].map(d => (
          <text key={`yl-${d}`} x={gx0 - 6} y={Y(d) + 4} textAnchor="end" fontSize="10" fill="#475569" className="dark:fill-gray-400">{d}</text>
        ))}

        {/* The line itself */}
        <line x1={X(0)} y1={Y(0)} x2={X(8)} y2={Y(120)}
          stroke="#16a34a" strokeWidth="3" />

        {/* Sample dots and labels */}
        {points.filter(p => p.cups % 2 === 0 && p.cups > 0).map((p, i) => (
          <g key={i}>
            <circle cx={X(p.cups)} cy={Y(p.cost)} r="6" fill="#facc15" stroke="#854d0e" strokeWidth="1.5" />
            <text x={X(p.cups) + 8} y={Y(p.cost) - 4} fontSize="10" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
              ({p.cups}, ₹{p.cost})
            </text>
          </g>
        ))}

        {/* Equation label */}
        <rect x={X(5) - 50} y={Y(75) - 30} width="120" height="22" rx="11"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={X(5) + 10} y={Y(75) - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          y = 15 x
        </text>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 28} width="480" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The slope (15) is the price per cup. The line passes through (0, 0): zero cups, zero cost.
        </text>
      </svg>
    </div>
  );
}
