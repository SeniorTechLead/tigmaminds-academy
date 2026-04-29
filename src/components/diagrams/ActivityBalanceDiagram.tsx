/**
 * ActivityBalanceDiagram — Offline activity: build a physical balance scale
 * to solve equations with coins and bags.
 */
export default function ActivityBalanceDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 411 240" className="w-full" role="img" aria-label="DIY balance scale activity using a ruler, pencil, and coins">
        <rect width="400" height="240" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="20" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Build a Balance Scale Equation Solver</text>

        {/* Table surface */}
        <rect x="20" y="180" width="360" height="8" rx="2" className="fill-gray-300 dark:fill-gray-600" />

        {/* Pencil (fulcrum) */}
        <rect x="185" y="160" width="30" height="20" rx="2" className="fill-amber-400 dark:fill-amber-600" />
        <text x="200" y="175" textAnchor="middle" className="fill-amber-900 dark:fill-amber-100" fontSize="10">pencil</text>

        {/* Ruler (beam) */}
        <rect x="50" y="140" width="300" height="10" rx="2" className="fill-yellow-200 dark:fill-yellow-800" stroke="#ca8a04" strokeWidth="1" />
        {/* Ruler marks */}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={75 + i * 20} y1={140} x2={75 + i * 20} y2={145} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="0.5" />
        ))}

        {/* Left pan area */}
        <rect x="60" y="120" width="80" height="20" rx="3" className="fill-gray-200 dark:fill-gray-700" stroke="#6b7280" strokeWidth="1" />
        {/* Mystery bag (x) */}
        <path d="M 80 115 Q 90 95 100 115 Z" className="fill-blue-300 dark:fill-blue-600" stroke="#3b82f6" strokeWidth="1" />
        <text x="90" y="112" textAnchor="middle" className="fill-blue-800 dark:fill-blue-100" fontSize="11" fontWeight="bold">x</text>
        <text x="90" y="90" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">mystery bag</text>
        {/* Two coins */}
        <circle cx="115" cy="112" r="7" className="fill-amber-300 dark:fill-amber-500" stroke="#ca8a04" strokeWidth="1" />
        <text x="115" y="116" textAnchor="middle" className="fill-amber-900 dark:fill-amber-100" fontSize="10">1</text>
        <circle cx="130" cy="112" r="7" className="fill-amber-300 dark:fill-amber-500" stroke="#ca8a04" strokeWidth="1" />
        <text x="130" y="116" textAnchor="middle" className="fill-amber-900 dark:fill-amber-100" fontSize="10">1</text>

        {/* Right pan area */}
        <rect x="260" y="120" width="80" height="20" rx="3" className="fill-gray-200 dark:fill-gray-700" stroke="#6b7280" strokeWidth="1" />
        {/* Seven coins */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <circle key={i} cx={270 + (i % 4) * 18} cy={112 - Math.floor(i / 4) * 16} r="7" className="fill-amber-300 dark:fill-amber-500" stroke="#ca8a04" strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <text key={`t${i}`} x={270 + (i % 4) * 18} y={116 - Math.floor(i / 4) * 16} textAnchor="middle" className="fill-amber-900 dark:fill-amber-100" fontSize="10">1</text>
        ))}

        {/* Equation */}
        <text x="200" y="55" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">x + 2 = 7</text>
        <text x="200" y="72" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11">Remove 2 coins from each side → x = 5</text>

        {/* Instructions */}
        <text x="200" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Ruler on a pencil fulcrum. Coins = known numbers. Small bag of coins = x.</text>
        <text x="200" y="224" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Balance both sides, then remove equal amounts to find x.</text>
      </svg>
    </div>
  );
}
