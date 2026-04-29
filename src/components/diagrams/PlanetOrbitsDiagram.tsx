/**
 * Tara stands beside a poster showing two orbits — Earth's nearly-circular
 * one (e ≈ 0.017) and Halley's Comet's wildly elongated one (e ≈ 0.967).
 * Both are ellipses, with the Sun at one focus. Visual: the Sun in the
 * middle, Earth's orbit a near-circle, Halley's a long thin ellipse.
 *
 * Used to open the Conic Sections section.
 */
import Tara from './people/Tara';

export default function PlanetOrbitsDiagram() {
  const W = 760, H = 380;

  // Sun position
  const sunX = 380, sunY = 200;

  // Earth's orbit — nearly circular (e ≈ 0.017)
  // a = 50 (semi-major axis), b = 49.99 — practically a circle on this scale
  const earthA = 70, earthB = 69.99;

  // Halley's orbit — wildly elongated (e ≈ 0.967)
  // We want the Sun at a focus and the entire ellipse to fit in the viewBox.
  // The far end (apoapsis) of the ellipse must stay above x = 30 or so.
  // Apoapsis sits at sunX − 2c (with c = a·e). Choose a = 170 so the apoapsis
  // is at sunX − 320 ≈ 60 — still inside the viewBox.
  const halleyA = 170, halleyB = 44;
  const halleyC = Math.sqrt(halleyA * halleyA - halleyB * halleyB); // ~164

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Planets and comets orbit the Sun in ellipses; Earth's is nearly circular while Halley's Comet's is highly elongated">

        <defs>
          <radialGradient id="sun-po" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fef08a" />
            <stop offset="0.6" stopColor="#fb923c" />
            <stop offset="1" stopColor="#dc2626" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="#0f172a" />
        {/* Stars */}
        {[
          [60, 50], [120, 80], [180, 30], [240, 100], [320, 40],
          [580, 70], [620, 30], [680, 90], [720, 50],
          [80, 250], [200, 320], [600, 280], [700, 340],
        ].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={i % 3 === 0 ? 1.5 : 1} fill="#fef9c3" opacity={0.8} />
        ))}

        {/* Caption (top-left) */}
        <rect x="20" y="14" width="240" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a">
          Same equation, different shapes
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569">
          Both are ellipses. Eccentricity sets the shape.
        </text>

        {/* Tara on lower left, looking up */}
        <Tara x={130} y={370} scale={0.95} pose="lookingUp" />

        {/* Halley's orbit — long thin ellipse, with Sun at right focus */}
        <ellipse cx={sunX - halleyC} cy={sunY} rx={halleyA} ry={halleyB}
          fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 4" opacity="0.85" />
        {/* Halley's comet — small icon at one apoapsis (far end) */}
        <g transform={`translate(${sunX - 2 * halleyC + 6}, ${sunY})`}>
          <circle cx="0" cy="0" r="4" fill="#06b6d4" stroke="white" strokeWidth="1" />
          {/* Tail trailing right toward sun */}
          <path d={`M 4 -2 L 30 -8 M 4 0 L 38 0 M 4 2 L 32 8`}
            stroke="#67e8f9" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
        </g>
        {/* Halley label */}
        <text x={sunX - 2 * halleyC + 12} y={sunY - 16} fontSize="11" fontWeight="700" fill="#a78bfa">
          Halley's Comet
        </text>
        <text x={sunX - 2 * halleyC + 12} y={sunY - 4} fontSize="10" fill="#c4b5fd">
          e ≈ 0.967
        </text>

        {/* Earth's orbit — nearly circular */}
        <ellipse cx={sunX} cy={sunY} rx={earthA} ry={earthB}
          fill="none" stroke="#3b82f6" strokeWidth="2" />
        {/* Earth */}
        <g transform={`translate(${sunX + earthA}, ${sunY})`}>
          <circle cx="0" cy="0" r="8" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#10b981" opacity="0.6" />
        </g>
        <text x={sunX + earthA + 12} y={sunY + 4} fontSize="11" fontWeight="700" fill="#3b82f6">
          Earth
        </text>
        <text x={sunX + earthA + 12} y={sunY + 16} fontSize="10" fill="#93c5fd">
          e ≈ 0.017 (nearly circle)
        </text>

        {/* Sun at the centre — shared focus */}
        <circle cx={sunX} cy={sunY} r="14" fill="url(#sun-po)" />
        <circle cx={sunX} cy={sunY} r="20" fill="none" stroke="#fbbf24" strokeWidth="0.6" opacity="0.5" />
        <circle cx={sunX} cy={sunY} r="24" fill="none" stroke="#fbbf24" strokeWidth="0.4" opacity="0.3" />
        <text x={sunX} y={sunY + 36} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fef08a">
          Sun (focus)
        </text>

        {/* Eccentricity table */}
        <rect x="540" y="240" width="200" height="120" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" />
        <text x="640" y="258" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          Eccentricity (e)
        </text>
        <line x1="554" y1="266" x2="724" y2="266" stroke="#cbd5e1" strokeWidth="0.6" />
        <text x="554" y="282" fontSize="10" fill="#1e293b">e = 0</text>
        <text x="724" y="282" textAnchor="end" fontSize="10" fill="#1e293b">circle</text>
        <text x="554" y="298" fontSize="10" fill="#1e293b">0 &lt; e &lt; 1</text>
        <text x="724" y="298" textAnchor="end" fontSize="10" fill="#1e293b">ellipse</text>
        <text x="554" y="314" fontSize="10" fill="#1e293b">e = 1</text>
        <text x="724" y="314" textAnchor="end" fontSize="10" fill="#1e293b">parabola</text>
        <text x="554" y="330" fontSize="10" fill="#1e293b">e &gt; 1</text>
        <text x="724" y="330" textAnchor="end" fontSize="10" fill="#1e293b">hyperbola</text>
        <text x="554" y="350" fontSize="10" fill="#3b82f6" fontWeight="700">Earth: 0.017</text>
        <text x="724" y="350" textAnchor="end" fontSize="10" fill="#a78bfa" fontWeight="700">Halley: 0.967</text>
      </svg>
    </div>
  );
}
