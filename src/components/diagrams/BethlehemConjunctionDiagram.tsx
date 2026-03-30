/**
 * BethlehemConjunctionDiagram — Planetary conjunction showing Jupiter
 * and Saturn appearing close together in the sky, as seen from Earth.
 * Illustrates the 7 BCE triple conjunction hypothesis.
 */
export default function BethlehemConjunctionDiagram() {
  const cx = 200;
  const cy = 120;

  // Orbital paths (simplified top-down view)
  const earthR = 50;
  const jupiterR = 100;
  const saturnR = 135;

  // Planet positions — angles in radians showing conjunction alignment
  const earthAngle = -Math.PI / 2;
  const jupiterAngle = -Math.PI / 2 + 0.15;
  const saturnAngle = -Math.PI / 2 + 0.08;

  const earthX = cx + earthR * Math.cos(earthAngle);
  const earthY = cy + earthR * Math.sin(earthAngle);
  const jupiterX = cx + jupiterR * Math.cos(jupiterAngle);
  const jupiterY = cy + jupiterR * Math.sin(jupiterAngle);
  const saturnX = cx + saturnR * Math.cos(saturnAngle);
  const saturnY = cy + saturnR * Math.sin(saturnAngle);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Jupiter-Saturn conjunction as seen from Earth, candidate for the Star of Bethlehem">
        <rect width="400" height="260" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="200" y="18" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">Great Conjunction: Jupiter Meets Saturn</text>
        <text x="200" y="34" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Top-down view of the solar system</text>

        {/* Orbital paths */}
        <circle cx={cx} cy={cy} r={earthR} fill="none" stroke="#64748b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        <circle cx={cx} cy={cy} r={jupiterR} fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        <circle cx={cx} cy={cy} r={saturnR} fill="none" stroke="#c4b5fd" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

        {/* Sun */}
        <circle cx={cx} cy={cy} r="8" fill="#fbbf24" />
        <text x={cx} y={cy + 18} textAnchor="middle" fill="#fbbf24" fontSize="10">Sun</text>

        {/* Earth */}
        <circle cx={earthX} cy={earthY} r="5" fill="#3b82f6" />
        <text x={earthX - 12} y={earthY - 8} textAnchor="middle" fill="#3b82f6" fontSize="10">Earth</text>

        {/* Jupiter */}
        <circle cx={jupiterX} cy={jupiterY} r="7" fill="#f59e0b" />
        <text x={jupiterX + 16} y={jupiterY - 3} fill="#f59e0b" fontSize="10">Jupiter</text>

        {/* Saturn */}
        <circle cx={saturnX} cy={saturnY} r="6" fill="#a78bfa" />
        <ellipse cx={saturnX} cy={saturnY} rx="11" ry="3" fill="none" stroke="#a78bfa" strokeWidth="1" />
        <text x={saturnX + 20} y={saturnY - 6} fill="#a78bfa" fontSize="10">Saturn</text>

        {/* Sight line from Earth through Jupiter and Saturn */}
        <line x1={earthX} y1={earthY} x2={saturnX + 40} y2={saturnY - 10} stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />

        {/* Lower panel: what it looks like from Earth */}
        <rect x="30" y="190" width="340" height="55" rx="6" className="fill-gray-100 dark:fill-slate-800" opacity="0.6" />
        <text x="200" y="205" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="bold">View from Earth (night sky)</text>

        {/* Stars scattered in lower panel */}
        {[55, 95, 140, 260, 305, 340].map((sx, i) => (
          <circle key={i} cx={sx} cy={215 + (i % 3) * 7} r="1" className="fill-gray-400 dark:fill-slate-500" />
        ))}

        {/* Jupiter and Saturn appearing close */}
        <circle cx="190" cy="222" r="4" fill="#f59e0b" />
        <circle cx="198" cy="220" r="3" fill="#a78bfa" />
        <text x="194" y="238" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">They look like one bright star!</text>
      </svg>
    </div>
  );
}
