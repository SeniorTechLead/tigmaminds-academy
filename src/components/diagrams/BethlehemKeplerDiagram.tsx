/**
 * BethlehemKeplerDiagram — Kepler’s first two laws of planetary motion.
 * Shows an elliptical orbit with the Sun at one focus,
 * and the equal-area-in-equal-time rule.
 */
export default function BethlehemKeplerDiagram() {
  const cx = 200;
  const cy = 110;
  const a = 130; // semi-major axis
  const b = 85;  // semi-minor axis
  const c = Math.sqrt(a * a - b * b); // distance from center to focus

  const sunX = cx + c; // Sun at right focus

  // Two planet positions for equal-area sweep
  const angle1 = -0.4;  // near perihelion (close to Sun)
  const angle2 = -0.1;
  const angle3 = Math.PI - 0.3; // near aphelion (far from Sun)
  const angle4 = Math.PI + 0.1;

  function ellipsePoint(theta: number): [number, number] {
    return [cx + a * Math.cos(theta), cy + b * Math.sin(theta)];
  }

  const [p1x, p1y] = ellipsePoint(angle1);
  const [p2x, p2y] = ellipsePoint(angle2);
  const [p3x, p3y] = ellipsePoint(angle3);
  const [p4x, p4y] = ellipsePoint(angle4);

  // Planet positions around the orbit
  const planetAngles = [0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8, 5.4];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 250" className="w-full" role="img" aria-label="Kepler’s laws: elliptical orbits with the Sun at one focus">
        <rect width="400" height="250" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="200" y="18" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">Kepler’s Laws of Planetary Motion</text>

        {/* Elliptical orbit */}
        <ellipse cx={cx} cy={cy} rx={a} ry={b} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Center mark */}
        <circle cx={cx} cy={cy} r="2" className="fill-gray-400 dark:fill-slate-500" opacity="0.4" />

        {/* Sun at focus */}
        <circle cx={sunX} cy={cy} r="10" fill="#fbbf24" />
        <circle cx={sunX} cy={cy} r="14" fill="#fbbf24" opacity="0.15" />
        <text x={sunX} y={cy + 24} textAnchor="middle" fill="#fbbf24" fontSize="10">Sun (focus)</text>

        {/* Empty focus */}
        <circle cx={cx - c} cy={cy} r="2" stroke="#94a3b8" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        <text x={cx - c} y={cy + 14} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="10">empty focus</text>

        {/* Swept area 1 (near perihelion — small, fast) */}
        <path d={`M ${sunX} ${cy} L ${p1x} ${p1y} A ${a} ${b} 0 0 1 ${p2x} ${p2y} Z`} fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />

        {/* Swept area 2 (near aphelion — large, slow) */}
        <path d={`M ${sunX} ${cy} L ${p3x} ${p3y} A ${a} ${b} 0 0 1 ${p4x} ${p4y} Z`} fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1" />

        {/* Planet dots around orbit */}
        {planetAngles.map((theta, i) => {
          const [px, py] = ellipsePoint(theta);
          return <circle key={i} cx={px} cy={py} r="3" fill="#67e8f9" opacity={0.4} />;
        })}

        {/* Current planet (highlighted) */}
        <circle cx={p2x} cy={p2y} r="5" fill="#3b82f6" />
        <text x={p2x + 10} y={p2y - 6} fill="#3b82f6" fontSize="10">Fast here</text>

        <circle cx={p3x} cy={p3y} r="5" fill="#ef4444" />
        <text x={p3x - 10} y={p3y - 8} textAnchor="end" fill="#ef4444" fontSize="10">Slow here</text>

        {/* Labels */}
        <text x={cx + a + 5} y={cy + 3} className="fill-gray-500 dark:fill-slate-400" fontSize="10">perihelion</text>
        <text x={cx - a - 5} y={cy + 3} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="10">aphelion</text>

        {/* Law explanations */}
        <text x="20" y="200" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Law 1: Orbits are ellipses with the Sun at one focus</text>
        <text x="20" y="218" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Law 2: Equal areas swept in equal times</text>
        <text x="20" y="234" className="fill-gray-500 dark:fill-slate-400" fontSize="10">(Blue area = Red area, so planet moves faster when closer to Sun)</text>
      </svg>
    </div>
  );
}
