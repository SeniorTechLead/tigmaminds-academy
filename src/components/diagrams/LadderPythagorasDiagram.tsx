/**
 * Bipin props a 5 m ladder against a wall, foot 3 m out. The ladder, the
 * wall, and the ground form a 3-4-5 right triangle. Pythagoras gives the
 * height as 4 m without anyone having to climb up to measure.
 *
 * Used in the Triangles and Pythagoras section.
 */
import Bipin from './people/Bipin';

export default function LadderPythagorasDiagram() {
  const W = 720, H = 420;
  const groundY = 320;

  // The triangle: foot at (200, groundY), top at (440, groundY - 200)
  // 3 m ground = 200 px, 4 m wall = 200 px (so let's use 1 m = 60 px)
  const m = 50; // 1 m on screen
  const footX = 240, footY = groundY;
  const topX = footX + 3 * m, topY = groundY;        // bottom-right corner of right triangle (where wall meets ground)
  const wallTopX = footX + 3 * m, wallTopY = groundY - 4 * m; // top of ladder

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Bipin's ladder against a wall: a 3-4-5 right triangle with the height found by Pythagoras">

        {/* Sky */}
        <defs>
          <linearGradient id="sky-lp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-lp)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />

        {/* Ground */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          How tall is the wall?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          5 m ladder, 3 m base — Pythagoras gives the height.
        </text>

        {/* Wall — brick texture */}
        <rect x={wallTopX} y={groundY - 6 * m} width="40" height={6 * m} fill="#a16207" stroke="#451a03" strokeWidth="1.5" />
        {/* Brick lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={wallTopX} y1={groundY - i * 25} x2={wallTopX + 40} y2={groundY - i * 25} stroke="#451a03" strokeWidth="0.8" opacity="0.7" />
        ))}

        {/* The Ladder (hypotenuse) */}
        <line x1={footX} y1={footY - 6} x2={wallTopX} y2={wallTopY}
          stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
        <line x1={footX + 6} y1={footY - 6} x2={wallTopX + 6} y2={wallTopY}
          stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
        {/* Ladder rungs */}
        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, i) => {
          const x1 = footX + t * (wallTopX - footX);
          const y1 = footY - 6 + t * (wallTopY - (footY - 6));
          const dx = (wallTopX - footX) / 5; // perpendicular offset
          const dy = (wallTopY - (footY - 6)) / 5;
          // perpendicular direction
          const len = Math.sqrt(dx * dx + dy * dy);
          const px = -dy / len * 6;
          const py = dx / len * 6;
          return (
            <line key={i} x1={x1 - px} y1={y1 - py} x2={x1 + px} y2={y1 + py}
              stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          );
        })}

        {/* Right-angle marker at corner where wall meets ground */}
        <polyline points={`${topX - 14} ${topY} ${topX - 14} ${topY - 14} ${topX} ${topY - 14}`}
          fill="none" stroke="#dc2626" strokeWidth="1.8" />

        {/* Distance labels */}
        {/* Base — 3 m */}
        <line x1={footX} y1={groundY + 16} x2={topX} y2={groundY + 16}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arR-lp)" markerStart="url(#arL-lp)" />
        <defs>
          <marker id="arR-lp" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arL-lp" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#475569" />
          </marker>
        </defs>
        <rect x={(footX + topX) / 2 - 24} y={groundY + 22} width="48" height="20" rx="10"
          fill="#cffafe" stroke="#06b6d4" strokeWidth="1" className="dark:fill-cyan-900/40 dark:stroke-cyan-400" />
        <text x={(footX + topX) / 2} y={groundY + 36} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0e7490" className="dark:fill-cyan-200">
          3 m
        </text>

        {/* Wall — 4 m (height) */}
        <line x1={wallTopX + 56} y1={groundY} x2={wallTopX + 56} y2={wallTopY}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arU-lp)" markerStart="url(#arD-lp)" />
        <defs>
          <marker id="arU-lp" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
          <marker id="arD-lp" markerWidth="6" markerHeight="8" refX="3" refY="7" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#475569" />
          </marker>
        </defs>
        <rect x={wallTopX + 64} y={(groundY + wallTopY) / 2 - 11} width="80" height="22" rx="11"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={wallTopX + 104} y={(groundY + wallTopY) / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          h = 4 m
        </text>

        {/* Ladder length label — angled along the ladder */}
        <g transform={`translate(${(footX + wallTopX) / 2}, ${(footY + wallTopY) / 2})`}>
          <rect x={-30} y={-50} width="60" height="22" rx="11"
            fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
          <text x="0" y={-36} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-200">
            5 m
          </text>
        </g>

        {/* Bipin at the foot of the ladder */}
        <Bipin x={140} y={groundY} scale={0.95} pose="pointing" />

        {/* Math box bottom */}
        <rect x={W / 2 - 200} y={H - 40} width="400" height="32" rx="8"
          fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 22} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          h = √(5² − 3²) = √16 = <tspan fill="#16a34a">4 m</tspan>
        </text>
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">
          The 3-4-5 right triangle
        </text>
      </svg>
    </div>
  );
}
