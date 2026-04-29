/**
 * Two-observation triangulation: Tara stands at point A and measures the
 * angle of elevation to a hilltop as 30°. She walks 100 m closer to the hill
 * (Bipin marks her starting spot at A) and measures again from B: now 40°.
 * Two angles + the walked distance let us solve for the hill height.
 *
 * Used in the Heights and Distances intermediate section.
 */
import Tara from './people/Tara';
import Bipin from './people/Bipin';

export default function TwoObservationDiagram() {
  const W = 720, H = 380;

  const groundY = 320;
  const hillBaseX = 600;
  const hillTopX = 580;
  const hillTopY = 100;

  const taraB = { x: 380, y: groundY };  // Tara's second position (closer)
  const bipinA = { x: 200, y: groundY };  // Bipin standing at A

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara measures a hill from two points to find its height">

        <defs>
          <linearGradient id="sky-2obs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fed7aa" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-2obs)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />

        {/* Sun setting */}
        <circle cx="650" cy="80" r="28" fill="#fb923c" opacity="0.9" className="dark:opacity-30" />

        {/* Distant hill silhouettes */}
        <path d="M 0 280 Q 100 250 220 270 Q 350 240 500 268 L 720 280 L 720 320 L 0 320 Z"
          fill="#a3e635" opacity="0.4" className="dark:fill-emerald-900 dark:opacity-50" />

        {/* The hill — bigger, in foreground */}
        <path
          d={`M ${hillBaseX - 130} ${groundY} Q ${hillBaseX - 80} ${groundY - 80} ${hillTopX} ${hillTopY} Q ${hillBaseX + 60} ${groundY - 80} ${hillBaseX + 100} ${groundY} Z`}
          fill="#65a30d" stroke="#3f6212" strokeWidth="2" className="dark:fill-green-800" />
        {/* Hill texture — small grass tufts */}
        <line x1={hillBaseX - 60} y1={groundY - 60} x2={hillBaseX - 58} y2={groundY - 70} stroke="#3f6212" strokeWidth="1" />
        <line x1={hillBaseX - 30} y1={groundY - 100} x2={hillBaseX - 28} y2={groundY - 110} stroke="#3f6212" strokeWidth="1" />
        <line x1={hillBaseX + 30} y1={groundY - 80} x2={hillBaseX + 32} y2={groundY - 90} stroke="#3f6212" strokeWidth="1" />

        {/* Hill summit marker */}
        <circle cx={hillTopX} cy={hillTopY} r="5" fill="#dc2626" stroke="white" strokeWidth="1.5" />
        <line x1={hillTopX} y1={hillTopY} x2={hillTopX} y2={hillTopY - 16} stroke="#dc2626" strokeWidth="1.5" />
        <path d={`M ${hillTopX} ${hillTopY - 16} L ${hillTopX + 12} ${hillTopY - 13} L ${hillTopX} ${hillTopY - 10} Z`} fill="#dc2626" />

        {/* Ground */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#84cc16" opacity="0.7" className="dark:fill-emerald-800" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#65a30d" strokeWidth="1.5" className="dark:stroke-emerald-700" />

        {/* Bipin standing at A (the starting point) */}
        <Bipin x={bipinA.x} y={bipinA.y} scale={1.0} pose="standing" />

        {/* Tara standing at B, looking up at the hill */}
        <Tara x={taraB.x} y={taraB.y} scale={1.0} pose="lookingUp" />

        {/* Sight lines */}
        {/* From A (Bipin) to hilltop — 30° elevation */}
        <line x1={bipinA.x + 6} y1={bipinA.y - 105} x2={hillTopX} y2={hillTopY}
          stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" />
        {/* From B (Tara) to hilltop — 40° elevation */}
        <line x1={taraB.x + 6} y1={taraB.y - 105} x2={hillTopX} y2={hillTopY}
          stroke="#f97316" strokeWidth="2" strokeDasharray="6 4" />

        {/* Horizontal reference at Bipin's eye height */}
        <line x1={bipinA.x + 6} y1={bipinA.y - 105} x2={bipinA.x + 80} y2={bipinA.y - 105}
          stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        {/* Angle 30° at Bipin */}
        <path d={`M ${bipinA.x + 50} ${bipinA.y - 105} A 50 50 0 0 0 ${bipinA.x + 43.3} ${bipinA.y - 130}`}
          fill="none" stroke="#3b82f6" strokeWidth="2" />
        <text x={bipinA.x + 56} y={bipinA.y - 120} fontSize="14" fontWeight="700" fill="#1d4ed8">30°</text>

        {/* Horizontal reference at Tara's eye height */}
        <line x1={taraB.x + 6} y1={taraB.y - 105} x2={taraB.x + 70} y2={taraB.y - 105}
          stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        {/* Angle 60° at Tara */}
        <path d={`M ${taraB.x + 45} ${taraB.y - 105} A 45 45 0 0 0 ${taraB.x + 22.5} ${taraB.y - 144}`}
          fill="none" stroke="#f97316" strokeWidth="2" />
        <text x={taraB.x + 36} y={taraB.y - 120} fontSize="14" fontWeight="700" fill="#ea580c">60°</text>

        {/* Distance label "100 m" between A and B */}
        <line x1={bipinA.x + 18} y1={groundY + 18} x2={taraB.x - 18} y2={groundY + 18}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arR-2obs)" markerStart="url(#arL-2obs)" />
        <defs>
          <marker id="arR-2obs" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arL-2obs" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#475569" />
          </marker>
        </defs>
        <rect x={(bipinA.x + taraB.x) / 2 - 25} y={groundY + 25} width="50" height="20" rx="10"
          fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x={(bipinA.x + taraB.x) / 2} y={groundY + 39} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">
          50 m
        </text>

        {/* Hill height label */}
        <line x1={hillBaseX + 110} y1={groundY} x2={hillBaseX + 110} y2={hillTopY}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arU-2obs)" markerStart="url(#arD-2obs)" />
        <defs>
          <marker id="arU-2obs" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
          <marker id="arD-2obs" markerWidth="6" markerHeight="8" refX="3" refY="7" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#475569" />
          </marker>
        </defs>
        <rect x={hillBaseX + 117} y={(hillTopY + groundY) / 2 - 11} width="50" height="22" rx="11"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" className="dark:fill-amber-900/40 dark:stroke-amber-500" />
        <text x={hillBaseX + 142} y={(hillTopY + groundY) / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          h = ?
        </text>

        {/* Point labels */}
        <text x={bipinA.x} y={groundY + 60} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">A (Bipin)</text>
        <text x={taraB.x} y={groundY + 60} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">B (Tara, after walking)</text>

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two angles, one walked distance, one hill height
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          From A: 30°. Walk 50 m closer to B: now 60°. Solve for h.
        </text>
      </svg>
    </div>
  );
}
