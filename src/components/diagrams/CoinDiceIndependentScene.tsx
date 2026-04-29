/**
 * Tara flips a coin AND rolls a die. The two outcomes don't influence each
 * other — they are *independent*. P(heads AND a 6) = (1/2) × (1/6) = 1/12.
 * Visual: tree of joint outcomes.
 *
 * Used in the Independent vs Dependent Events section.
 */
import Tara from './people/Tara';

export default function CoinDiceIndependentScene() {
  const W = 760, H = 380;

  // Branches
  const rootX = 180, rootY = 200;
  const headsY = 130, tailsY = 270;
  const dieX = 480;
  const dieFaces = [1, 2, 3, 4, 5, 6];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Coin flip and die roll are independent: P(heads and 6) = 1/2 × 1/6 = 1/12">

        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two events that don&apos;t talk to each other
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Coin flip + die roll = independent.
        </text>

        {/* Tara on lower-left */}
        <Tara x={70} y={350} scale={0.85} pose="thinking" />

        {/* Coin (root) */}
        <g transform={`translate(${rootX}, ${rootY})`}>
          <circle cx="0" cy="0" r="22" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">flip</text>
        </g>

        {/* Branches from coin to H/T */}
        <line x1={rootX + 22} y1={rootY} x2={rootX + 100} y2={headsY} stroke="#0f172a" strokeWidth="1.5" />
        <line x1={rootX + 22} y1={rootY} x2={rootX + 100} y2={tailsY} stroke="#0f172a" strokeWidth="1.5" />
        {/* Heads */}
        <circle cx={rootX + 120} cy={headsY} r="22" fill="#fef9c3" stroke="#854d0e" strokeWidth="2" />
        <text x={rootX + 120} y={headsY + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#854d0e">H</text>
        <text x={rootX + 70} y={headsY - 12} fontSize="10" fontWeight="600" fill="#475569" className="dark:fill-gray-400">P=1/2</text>
        {/* Tails */}
        <circle cx={rootX + 120} cy={tailsY} r="22" fill="#fef9c3" stroke="#854d0e" strokeWidth="2" />
        <text x={rootX + 120} y={tailsY + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#854d0e">T</text>
        <text x={rootX + 70} y={tailsY + 16} fontSize="10" fontWeight="600" fill="#475569" className="dark:fill-gray-400">P=1/2</text>

        {/* Die outcomes — 6 small dice in a column from each H/T */}
        {/* Show only from H for clarity */}
        {dieFaces.map((face, i) => {
          const dy = headsY - 70 + i * 28;
          return (
            <g key={`H-${face}`}>
              <line x1={rootX + 142} y1={headsY} x2={dieX - 12} y2={dy} stroke="#475569" strokeWidth="0.8" opacity="0.5" />
              <rect x={dieX - 12} y={dy - 12} width="24" height="24" rx="3" fill="white" stroke="#0f172a" strokeWidth="1.2" />
              <text x={dieX} y={dy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">{face}</text>
              {/* Combined probability label */}
              <rect x={dieX + 18} y={dy - 9} width="56" height="18" rx="9"
                fill={face === 6 ? '#fef3c7' : 'white'} stroke="#94a3b8" strokeWidth="0.8" className={face === 6 ? 'dark:fill-amber-900/40' : 'dark:fill-gray-800'} />
              <text x={dieX + 46} y={dy + 4} textAnchor="middle" fontSize="9" fontWeight="700"
                fill={face === 6 ? '#92400e' : '#475569'}>
                1/2 × 1/6
              </text>
            </g>
          );
        })}

        {/* Highlight on the H + 6 outcome */}
        <circle cx={dieX} cy={headsY - 70 + 5 * 28} r="18" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
        {/* Pointer from highlighted outcome */}
        <line x1={dieX + 22} y1={headsY - 70 + 5 * 28} x2={dieX + 90} y2={290} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 3" />

        {/* Combined-result panel */}
        <rect x={dieX + 90} y={270} width="180" height="56" rx="10" fill="#fef3c7" stroke="#dc2626" strokeWidth="2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={dieX + 180} y={290} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          P(H AND 6)
        </text>
        <text x={dieX + 180} y={308} textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">
          = 1/2 × 1/6
        </text>
        <text x={dieX + 180} y={324} textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">
          = 1/12
        </text>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Independent events: P(A and B) = P(A) × P(B). Multiply, don&apos;t add.
        </text>
      </svg>
    </div>
  );
}
