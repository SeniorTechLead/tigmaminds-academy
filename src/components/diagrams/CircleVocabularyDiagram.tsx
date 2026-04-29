/**
 * A round pond. Tara stands on the bank pointing to its features. Diagram
 * labels: centre, radius, diameter, chord, tangent, arc, sector. Each
 * coloured differently so a glance reads the vocabulary.
 *
 * Used to open the Circles section.
 */
import Tara from './people/Tara';

export default function CircleVocabularyDiagram() {
  const W = 760, H = 380;

  // Pond
  const pcx = 430, pcy = 200;
  const r = 130;

  // Useful points on the circle
  const pt = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: pcx + r * Math.cos(rad), y: pcy - r * Math.sin(rad) };
  };
  const A = pt(40);    // chord endpoint 1
  const B = pt(160);   // chord endpoint 2
  const T = pt(290);   // tangent point
  // tangent line at T is perpendicular to radius
  const tangentDir = (290 + 90) * (Math.PI / 180);
  const T1 = { x: T.x + 80 * Math.cos(tangentDir), y: T.y - 80 * Math.sin(tangentDir) };
  const T2 = { x: T.x - 80 * Math.cos(tangentDir), y: T.y + 80 * Math.sin(tangentDir) };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A round pond labelled with the parts of a circle: centre, radius, diameter, chord, tangent">

        <rect x="0" y="0" width={W} height={H} fill="#84cc16" opacity="0.4" className="dark:fill-emerald-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Parts of a circle
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Tara names the features of a round pond.
        </text>

        {/* Tara on lower left */}
        <Tara x={120} y={350} scale={0.95} pose="pointing" />

        {/* Pond — water circle */}
        <circle cx={pcx} cy={pcy} r={r + 6} fill="#3b82f6" opacity="0.85" />
        <circle cx={pcx} cy={pcy} r={r} fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" />
        {/* Water ripples */}
        {[r - 12, r - 38, r - 70].map((rr, i) => (
          <circle key={i} cx={pcx} cy={pcy} r={rr} fill="none" stroke="#bfdbfe" strokeWidth="1" opacity={0.5 - i * 0.1} />
        ))}

        {/* Diameter — horizontal line through centre */}
        <line x1={pcx - r} y1={pcy} x2={pcx + r} y2={pcy}
          stroke="#dc2626" strokeWidth="2.5" />
        <circle cx={pcx - r} cy={pcy} r="3.5" fill="#dc2626" />
        <circle cx={pcx + r} cy={pcy} r="3.5" fill="#dc2626" />

        {/* Radius — from centre going up */}
        <line x1={pcx} y1={pcy} x2={pcx} y2={pcy - r}
          stroke="#16a34a" strokeWidth="2.5" />
        <circle cx={pcx} cy={pcy - r} r="3.5" fill="#16a34a" />

        {/* Chord — between two non-diameter points */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
          stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 4" />
        <circle cx={A.x} cy={A.y} r="3.5" fill="#a855f7" />
        <circle cx={B.x} cy={B.y} r="3.5" fill="#a855f7" />

        {/* Tangent — at point T, perpendicular to radius OT */}
        <line x1={T1.x} y1={T1.y} x2={T2.x} y2={T2.y}
          stroke="#f97316" strokeWidth="2.5" />
        {/* Radius to tangent point — show that they're perpendicular */}
        <line x1={pcx} y1={pcy} x2={T.x} y2={T.y}
          stroke="#fb923c" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
        <circle cx={T.x} cy={T.y} r="3.5" fill="#f97316" />

        {/* Centre point */}
        <circle cx={pcx} cy={pcy} r="5" fill="#1e293b" stroke="white" strokeWidth="1.5" />

        {/* Labels — each pointing with a thin line */}
        {/* Centre */}
        <line x1={pcx + 8} y1={pcy} x2={pcx + 50} y2={pcy + 30} stroke="#1e293b" strokeWidth="0.8" />
        <rect x={pcx + 50} y={pcy + 22} width="56" height="20" rx="10" fill="white" stroke="#1e293b" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-400" />
        <text x={pcx + 78} y={pcy + 36} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">centre</text>

        {/* Radius */}
        <rect x={pcx - 56} y={pcy - r/2 - 10} width="56" height="20" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
        <text x={pcx - 28} y={pcy - r/2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-emerald-200">radius</text>

        {/* Diameter */}
        <rect x={pcx - r - 80} y={pcy - 10} width="74" height="20" rx="10" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" className="dark:fill-red-900/40 dark:stroke-red-400" />
        <text x={pcx - r - 43} y={pcy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-200">diameter</text>

        {/* Chord */}
        <rect x={(A.x + B.x) / 2 - 28} y={(A.y + B.y) / 2 - 28} width="56" height="20" rx="10" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
        <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#7e22ce" className="dark:fill-purple-200">chord</text>

        {/* Tangent */}
        <rect x={T1.x - 36} y={T1.y - 30} width="72" height="20" rx="10" fill="#ffedd5" stroke="#f97316" strokeWidth="1" className="dark:fill-orange-900/40 dark:stroke-orange-400" />
        <text x={T1.x} y={T1.y - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#c2410c" className="dark:fill-orange-200">tangent</text>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 30} width="480" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A circle: every point on its edge is the same distance from the centre.
        </text>
      </svg>
    </div>
  );
}
