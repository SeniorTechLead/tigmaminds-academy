/**
 * The power rule shown in three concrete cases. Tara at a chalkboard
 * pointing to a table of derivative rules: x², x³, x⁵.
 *
 * Used in the Rules of Differentiation section.
 */
import Tara from './people/Tara';

export default function PowerRuleScene() {
  const W = 760, H = 380;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="The power rule: derivative of x to the n is n times x to the n minus 1">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Floor */}
        <rect x="0" y="320" width={W} height="60" fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The power rule
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          One pattern, every polynomial.
        </text>

        {/* Tara at left, by chalkboard */}
        <Tara x={100} y={320} scale={1.0} pose="pointing" />

        {/* Chalkboard */}
        <rect x="220" y="80" width="500" height="220" rx="6" fill="#14532d" stroke="#052e16" strokeWidth="3" />
        <rect x="220" y="80" width="500" height="220" rx="6" fill="none" stroke="#84cc16" strokeWidth="1" opacity="0.3" />

        {/* Rule at top */}
        <text x="470" y="120" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fef08a">
          d/dx (xⁿ) = n · xⁿ⁻¹
        </text>
        <line x1="270" y1="134" x2="670" y2="134" stroke="#84cc16" strokeWidth="0.8" opacity="0.6" />

        {/* Three examples */}
        {[
          { fn: 'x²', deriv: '2x', n: 2 },
          { fn: 'x³', deriv: '3x²', n: 3 },
          { fn: 'x⁵', deriv: '5x⁴', n: 5 },
        ].map((ex, i) => {
          const ey = 168 + i * 40;
          return (
            <g key={i}>
              <text x="280" y={ey} fontSize="14" fontWeight="700" fill="#fef08a">
                f(x) = {ex.fn}
              </text>
              <text x="450" y={ey} fontSize="14" fontWeight="700" fill="#84cc16">
                →
              </text>
              <text x="510" y={ey} fontSize="14" fontWeight="700" fill="#fbbf24">
                f&apos;(x) = {ex.deriv}
              </text>
            </g>
          );
        })}

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Bring the exponent down as a coefficient, then subtract 1 from it.
        </text>
      </svg>
    </div>
  );
}
