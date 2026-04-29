/**
 * Tree-gazing scene: Tara stands a known distance from a tree, tilts her head
 * up, and the angle her gaze makes with the ground is θ. The diagram shows
 * the right triangle formed by (her position, base of tree, top of tree).
 *
 * Used as the OPENING visual of the SOH CAH TOA section — connects the
 * abstract math to a real moment a kid has lived.
 */
import Tara from './people/Tara';

export default function TreeGazeDiagram() {
  // ViewBox sized to fit Tara on left, tree on right, with comfortable margins.
  const W = 600, H = 360;

  // Ground line at y=320. Tara at x=80, tree base at x=420.
  const groundY = 320;
  const taraX = 80;
  const treeBaseX = 420;
  const treeTopX = 420;
  const treeTopY = 70;

  // Tara's eye position (head center is at -86 in her local coords; head tilted -20° rotates eyes)
  // After scale 1.2 and translate (taraX, groundY), her eye sits roughly here:
  const eyeX = taraX + 6;     // shifted slightly forward by head tilt
  const eyeY = groundY - 105; // ~88 * scale 1.2

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara stands 50 paces from a tree and tilts her head up to see the top">

        {/* Sky gradient backdrop */}
        <defs>
          <linearGradient id="sky-tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dbeafe" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
          <radialGradient id="sun-tg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fef08a" />
            <stop offset="1" stopColor="#fde047" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-tg)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />

        {/* Sun */}
        <circle cx="490" cy="60" r="24" fill="url(#sun-tg)" opacity="0.9" className="dark:opacity-30" />

        {/* Distant hills — soft green silhouette */}
        <path d="M 0 280 Q 100 250 200 270 Q 300 240 400 265 Q 500 245 560 270 L 560 320 L 0 320 Z"
          fill="#86efac" opacity="0.5" className="dark:fill-emerald-900 dark:opacity-50" />

        {/* Ground */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#84cc16" className="dark:fill-emerald-800" opacity="0.6" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#65a30d" strokeWidth="1.5" className="dark:stroke-emerald-700" />

        {/* Grass tufts */}
        {[40, 130, 210, 290, 350, 480, 530].map((gx, i) => (
          <path key={i} d={`M ${gx} ${groundY} l -3 -8 M ${gx} ${groundY} l 0 -10 M ${gx} ${groundY} l 3 -8`}
            stroke="#65a30d" strokeWidth="1.2" strokeLinecap="round" className="dark:stroke-emerald-600" />
        ))}

        {/* TREE — trunk + crown */}
        {/* Trunk */}
        <rect x={treeBaseX - 10} y={groundY - 130} width="20" height="130" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
        {/* Trunk texture */}
        <line x1={treeBaseX - 4} y1={groundY - 120} x2={treeBaseX - 4} y2={groundY - 30} stroke="#451a03" strokeWidth="0.8" opacity="0.5" />
        <line x1={treeBaseX + 4} y1={groundY - 100} x2={treeBaseX + 4} y2={groundY - 20} stroke="#451a03" strokeWidth="0.8" opacity="0.5" />
        {/* Crown — three overlapping circles for foliage */}
        <circle cx={treeBaseX} cy={groundY - 170} r="65" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" className="dark:fill-green-700" />
        <circle cx={treeBaseX - 30} cy={groundY - 145} r="50" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" className="dark:fill-green-600" />
        <circle cx={treeBaseX + 32} cy={groundY - 150} r="48" fill="#15803d" stroke="#14532d" strokeWidth="1.5" className="dark:fill-green-800" />
        {/* Leaf details */}
        <ellipse cx={treeBaseX - 20} cy={groundY - 175} rx="4" ry="2" fill="#86efac" opacity="0.7" />
        <ellipse cx={treeBaseX + 15} cy={groundY - 190} rx="4" ry="2" fill="#86efac" opacity="0.7" />
        <ellipse cx={treeBaseX + 5} cy={groundY - 155} rx="4" ry="2" fill="#86efac" opacity="0.7" />

        {/* The "top of the tree" point — where Tara is looking */}
        <circle cx={treeTopX} cy={treeTopY + 30} r="4" fill="#dc2626" stroke="white" strokeWidth="1.5" />

        {/* Tara — looking up at the tree */}
        <Tara x={taraX} y={groundY} scale={1.3} pose="lookingUp" />

        {/* Gaze line — dashed, from Tara's eye to top of tree */}
        <line x1={eyeX} y1={eyeY} x2={treeTopX} y2={treeTopY + 30}
          stroke="#f97316" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />

        {/* Horizontal reference line through Tara's eye — the "looking straight ahead" line */}
        <line x1={eyeX} y1={eyeY} x2={treeBaseX + 60} y2={eyeY}
          stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />

        {/* Angle θ arc — between horizontal and gaze */}
        <path d={`M ${eyeX + 50} ${eyeY} A 50 50 0 0 0 ${eyeX + 47} ${eyeY - 14}`}
          fill="none" stroke="#f97316" strokeWidth="2.5" />
        <text x={eyeX + 62} y={eyeY - 4} fontSize="20" fontWeight="700" fill="#ea580c">θ</text>

        {/* Distance label — "50 paces" along the ground */}
        <line x1={taraX + 18} y1={groundY + 18} x2={treeBaseX - 15} y2={groundY + 18}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arrowR-tg)" markerStart="url(#arrowL-tg)" />
        <defs>
          <marker id="arrowR-tg" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arrowL-tg" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#475569" />
          </marker>
        </defs>
        <rect x={(taraX + treeBaseX) / 2 - 38} y={groundY + 24} width="76" height="20" rx="10"
          fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x={(taraX + treeBaseX) / 2} y={groundY + 38} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">
          50 paces
        </text>

        {/* Tree height label — vertical with "= ?" */}
        <line x1={treeBaseX + 95} y1={groundY} x2={treeBaseX + 95} y2={treeTopY + 30}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arrowU-tg)" markerStart="url(#arrowD-tg)" />
        <defs>
          <marker id="arrowU-tg" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
          <marker id="arrowD-tg" markerWidth="6" markerHeight="8" refX="3" refY="7" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#475569" />
          </marker>
        </defs>
        <rect x={treeBaseX + 102} y={(groundY + treeTopY + 30) / 2 - 11} width="50" height="22" rx="11"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" className="dark:fill-amber-900/40 dark:stroke-amber-500" />
        <text x={treeBaseX + 127} y={(groundY + treeTopY + 30) / 2 + 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          h = ?
        </text>

        {/* Caption above */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.92" stroke="#cbd5e1" strokeWidth="1"
          className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara wants to know how tall this tree is
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          — without climbing it. Just an angle and a distance will do it.
        </text>
      </svg>
    </div>
  );
}
