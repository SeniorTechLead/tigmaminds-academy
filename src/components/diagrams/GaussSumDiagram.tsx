/**
 * Young Gauss's trick: pairing 1+100, 2+99, 3+98, ... each pair sums to 101,
 * and there are 50 pairs, so 1+2+...+100 = 50 × 101 = 5050.
 *
 * Tara plays the role of young Gauss with a chalkboard, while Bipin
 * watches in disbelief at how fast she got the answer.
 *
 * Used in the Sequences section to show pattern-finding intuition.
 */
import Tara from './people/Tara';
import Bipin from './people/Bipin';

export default function GaussSumDiagram() {
  const W = 720, H = 380;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara uses Gauss's pairing trick to add 1 + 2 + ... + 100">

        <rect x="0" y="0" width={W} height={H} fill="#fef3c7" className="dark:fill-gray-900" />

        {/* Classroom floor */}
        <rect x="0" y="320" width={W} height="60" fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          1 + 2 + 3 + ... + 100 = ?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          The teacher expected an hour. Tara took 30 seconds.
        </text>

        {/* Chalkboard */}
        <rect x="180" y="80" width="380" height="220" rx="6" fill="#14532d" stroke="#052e16" strokeWidth="3" />
        <rect x="180" y="80" width="380" height="220" rx="6" fill="none" stroke="#84cc16" strokeWidth="1" opacity="0.3" />

        {/* Pairing visualization on the chalkboard */}
        {/* Top row: 1 + 2 + 3 + ... + 100 */}
        <text x="370" y="115" textAnchor="middle" fontSize="16" fontWeight="700" fill="white">
          1 + 2 + 3 + ... + 98 + 99 + 100
        </text>

        {/* Pairing arcs */}
        {/* 1 + 100 */}
        <path d="M 270 132 Q 370 105 470 132" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
        <text x="370" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">1 + 100 = 101</text>

        {/* 2 + 99 */}
        <path d="M 290 138 Q 370 145 450 138" fill="none" stroke="#facc15" strokeWidth="1.8" />
        <text x="370" y="155" textAnchor="middle" fontSize="11" fontWeight="700" fill="#facc15">2 + 99 = 101</text>

        {/* 3 + 98 */}
        <path d="M 305 145 Q 370 175 435 145" fill="none" stroke="#eab308" strokeWidth="1.8" />
        <text x="370" y="180" textAnchor="middle" fontSize="11" fontWeight="700" fill="#eab308">3 + 98 = 101</text>

        <text x="370" y="208" textAnchor="middle" fontSize="14" fill="#fef9c3" fontStyle="italic">
          ...and so on. Every pair makes 101.
        </text>

        {/* Final answer */}
        <rect x="220" y="225" width="300" height="60" rx="6" fill="#047857" stroke="#fbbf24" strokeWidth="2" />
        <text x="370" y="246" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fef9c3">
          50 pairs × 101 each
        </text>
        <text x="370" y="272" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fef08a">
          = 5,050
        </text>

        {/* Tara at left in front of the board, with chalk */}
        <Tara x={100} y={320} scale={1.1} pose="pointing" />

        {/* Bipin on the right, mouth open in surprise */}
        <Bipin x={620} y={320} scale={1.0} pose="standing" flip={true} />

        {/* Bipin's exclamation bubble */}
        <path d={`M 600 220 L 590 215 L 600 210 Z`} fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <rect x="540" y="200" width="60" height="22" rx="11" fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x="570" y="215" textAnchor="middle" fontSize="12" fontWeight="700" fill="#dc2626">Whaaat?!</text>
      </svg>
    </div>
  );
}
