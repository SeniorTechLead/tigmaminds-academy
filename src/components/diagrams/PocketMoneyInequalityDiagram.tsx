/**
 * Tara at the village shop with ₹100 in her hand. The shopkeeper has tea
 * (₹40), notebook (₹25), pencil (₹10), candy (₹5). She must pick a basket
 * costing ≤ ₹100 — the inequality x ≤ 100 in the wild.
 *
 * Used to open the Inequalities section.
 */
import Tara from './people/Tara';

export default function PocketMoneyInequalityDiagram() {
  const W = 760, H = 380;
  const groundY = 330;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara at the shop with 100 rupees: which combinations of items satisfy total ≤ 100">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara has ₹100. What can she buy?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Total cost must be ≤ 100. Many answers, not one.
        </text>

        {/* Tara on left, holding money */}
        <Tara x={120} y={groundY} scale={1.0} pose="pointing" />

        {/* Money note next to Tara */}
        <g transform="translate(150, 235)">
          <rect x="0" y="0" width="50" height="28" rx="2" fill="#86efac" stroke="#14532d" strokeWidth="1.2" />
          <rect x="2" y="2" width="46" height="24" rx="1" fill="none" stroke="#14532d" strokeWidth="0.6" strokeDasharray="2 2" />
          <text x="25" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14532d">₹100</text>
        </g>

        {/* Shop counter — items on display */}
        <rect x="280" y="120" width="430" height="200" rx="6" fill="#fef3c7" stroke="#92400e" strokeWidth="2" className="dark:fill-amber-900/40 dark:stroke-amber-700" />
        <rect x="280" y="120" width="430" height="22" rx="6" fill="#92400e" />
        <text x="495" y="136" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fef9c3">VILLAGE SHOP</text>

        {/* Items grid: 4 items, each with name + price */}
        {[
          { name: 'Tea', emoji: '🫖', price: 40, x: 320 },
          { name: 'Notebook', emoji: '📓', price: 25, x: 420 },
          { name: 'Pencil', emoji: '✏️', price: 10, x: 520 },
          { name: 'Candy', emoji: '🍬', price: 5, x: 620 },
        ].map((item, i) => (
          <g key={i}>
            {/* Shelf */}
            <rect x={item.x - 40} y="160" width="80" height="100" rx="4" fill="white" stroke="#92400e" strokeWidth="1.2" className="dark:fill-gray-800" />
            {/* Emoji icon (rendered at large size) */}
            <text x={item.x} y="200" textAnchor="middle" fontSize="36">{item.emoji}</text>
            {/* Name */}
            <text x={item.x} y="230" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{item.name}</text>
            {/* Price */}
            <rect x={item.x - 24} y="240" width="48" height="18" rx="9" fill="#dcfce7" stroke="#15803d" strokeWidth="1" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
            <text x={item.x} y="253" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-emerald-300">₹{item.price}</text>
          </g>
        ))}

        {/* The inequality */}
        <rect x={W / 2 - 120} y="278" width="240" height="32" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={W / 2} y="298" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          total cost ≤ ₹100
        </text>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          ✓ Tea + Notebook + 2 candies = ₹75. ✓ 2 notebooks + tea = ₹90. ✗ 3 teas = ₹120 — too much!
        </text>
      </svg>
    </div>
  );
}
