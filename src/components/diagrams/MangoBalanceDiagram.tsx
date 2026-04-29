/**
 * Bipin at a balance scale. Left pan: a bag of unknown weight (x kg)
 * plus 3 mangoes (each 1 kg). Right pan: 11 mangoes. Scale balances:
 * x + 3 = 11. Visual approach to solving an equation.
 *
 * Used in the Solving Linear Equations section.
 */
import Bipin from './people/Bipin';

export default function MangoBalanceDiagram() {
  const W = 760, H = 380;
  const groundY = 340;

  // Balance scale: pivot at top centre, two arms going down to pans
  const pivotX = 430, pivotY = 120;
  const armHalfLen = 140;
  const leftPanX = pivotX - armHalfLen;
  const rightPanX = pivotX + armHalfLen;
  const panY = 220;

  // Mango drawing helper (small)
  const Mango = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      <ellipse cx={cx} cy={cy} rx="11" ry="9" fill="#facc15" stroke="#92400e" strokeWidth="1" />
      <ellipse cx={cx - 3} cy={cy - 2} rx="3" ry="2" fill="#fef9c3" opacity="0.7" />
      <line x1={cx} y1={cy - 9} x2={cx} y2={cy - 13} stroke="#16a34a" strokeWidth="1.5" />
      <ellipse cx={cx} cy={cy - 14} rx="3" ry="1.5" fill="#16a34a" />
    </g>
  );

  // 3 mangoes on left pan, 11 on right pan
  const leftMangoes = [
    [-18, -8], [0, -10], [18, -8],
  ];
  const rightMangoes = [
    // 4 + 4 + 3 stacked
    [-30, -8], [-10, -8], [10, -8], [30, -8],
    [-22, -22], [-2, -22], [18, -22], [38, -22],
    [-15, -36], [5, -36], [25, -36],
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Bipin uses a balance scale to solve x + 3 = 11">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Solve x + 3 = 11
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          A balance scale never lies.
        </text>

        {/* Bipin on the left */}
        <Bipin x={120} y={groundY} scale={1.05} pose="pointing" />

        {/* Vertical post */}
        <rect x={pivotX - 5} y={pivotY} width="10" height={groundY - pivotY} fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
        {/* Base */}
        <ellipse cx={pivotX} cy={groundY - 4} rx="40" ry="6" fill="#1e293b" />

        {/* Beam (horizontal arm — both pans equal so flat) */}
        <line x1={leftPanX} y1={pivotY} x2={rightPanX} y2={pivotY} stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        {/* Pivot triangle */}
        <polygon points={`${pivotX - 8},${pivotY - 2} ${pivotX + 8},${pivotY - 2} ${pivotX},${pivotY - 14}`} fill="#fbbf24" stroke="#854d0e" strokeWidth="1" />

        {/* Left chain */}
        <line x1={leftPanX} y1={pivotY} x2={leftPanX} y2={panY} stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
        {/* Right chain */}
        <line x1={rightPanX} y1={pivotY} x2={rightPanX} y2={panY} stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />

        {/* Left pan */}
        <ellipse cx={leftPanX} cy={panY} rx="60" ry="8" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <path d={`M ${leftPanX - 60} ${panY} Q ${leftPanX} ${panY + 24} ${leftPanX + 60} ${panY} Z`}
          fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

        {/* Bag (the variable x) on left pan */}
        <g transform={`translate(${leftPanX - 30}, ${panY - 24})`}>
          <path d="M 0 0 Q 0 -16 18 -18 Q 36 -16 36 0 L 36 24 Q 36 30 30 30 L 6 30 Q 0 30 0 24 Z"
            fill="#7c2d12" stroke="#451a03" strokeWidth="1.5" />
          <text x="18" y="14" textAnchor="middle" fontSize="22" fontWeight="700" fontStyle="italic" fill="#fef9c3">x</text>
        </g>

        {/* 3 mangoes on left pan */}
        {leftMangoes.map(([dx, dy], i) => (
          <Mango key={i} cx={leftPanX + 18 + dx} cy={panY + dy} />
        ))}

        {/* Right pan */}
        <ellipse cx={rightPanX} cy={panY} rx="60" ry="8" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <path d={`M ${rightPanX - 60} ${panY} Q ${rightPanX} ${panY + 24} ${rightPanX + 60} ${panY} Z`}
          fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

        {/* 11 mangoes on right pan, stacked */}
        {rightMangoes.map(([dx, dy], i) => (
          <Mango key={i} cx={rightPanX + dx} cy={panY + dy} />
        ))}

        {/* Equation strip */}
        <rect x={W / 2 - 130} y="80" width="260" height="32" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={W / 2} y="100" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          x + 3 = 11
        </text>

        {/* "Subtract 3 from both sides" hint */}
        <rect x={W / 2 - 170} y="280" width="340" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y="296" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
          Take 3 mangoes from each side. The scale stays balanced.
        </text>

        {/* Footer */}
        <rect x={W / 2 - 200} y={H - 28} width="400" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Result: x = 8. The bag weighs 8 mangoes.
        </text>
      </svg>
    </div>
  );
}
