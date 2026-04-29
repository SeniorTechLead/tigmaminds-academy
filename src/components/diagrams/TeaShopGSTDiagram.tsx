/**
 * Tara at a tea shop counter. The shopkeeper tots up the bill: tea ₹500.
 * GST adds 18%. Total comes to ₹590. Visual breakdown of the percentage.
 *
 * Used in the Percentages section.
 */
import Tara from './people/Tara';

export default function TeaShopGSTDiagram() {
  const W = 720, H = 360;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara buys tea for Rs 500; with 18% GST the total comes to Rs 590">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Counter */}
        <rect x="0" y="280" width={W} height="80" fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1="280" x2={W} y2="280" stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara at the tea shop
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Tea: ₹500. GST: 18%. What's the total?
        </text>

        {/* Tara on left */}
        <Tara x={130} y={280} scale={1.15} pose="thinking" />

        {/* Tea packet on counter */}
        <g transform="translate(310, 240)">
          <rect x="0" y="0" width="60" height="40" rx="4" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
          <rect x="2" y="2" width="56" height="14" fill="#fef9c3" />
          <text x="30" y="13" textAnchor="middle" fontSize="9" fontWeight="700" fill="#14532d">Assam Tea</text>
          <text x="30" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">500g</text>
        </g>

        {/* Receipt on the counter to the right */}
        <g transform="translate(420, 90)">
          {/* Receipt with serrated bottom */}
          <path d="M 0 0 L 200 0 L 200 200 L 195 195 L 188 200 L 180 195 L 172 200 L 164 195 L 156 200 L 148 195 L 140 200 L 132 195 L 124 200 L 116 195 L 108 200 L 100 195 L 92 200 L 84 195 L 76 200 L 68 195 L 60 200 L 52 195 L 44 200 L 36 195 L 28 200 L 20 195 L 12 200 L 4 195 L 0 200 Z"
            fill="white" stroke="#94a3b8" strokeWidth="1.2" className="dark:fill-gray-100" />
          <text x="100" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Tea Stall Receipt</text>
          <line x1="20" y1="32" x2="180" y2="32" stroke="#cbd5e1" strokeWidth="1" />

          {/* Item line */}
          <text x="20" y="56" fontSize="12" fill="#1e293b">Assam Tea, 500g</text>
          <text x="180" y="56" textAnchor="end" fontSize="12" fontWeight="600" fill="#1e293b">₹500.00</text>

          {/* GST line */}
          <text x="20" y="82" fontSize="12" fill="#475569">GST @ 18%</text>
          <text x="180" y="82" textAnchor="end" fontSize="12" fontWeight="600" fill="#dc2626">+ ₹90.00</text>

          {/* Divider */}
          <line x1="20" y1="100" x2="180" y2="100" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

          {/* Total */}
          <text x="20" y="128" fontSize="13" fontWeight="700" fill="#0f172a">Total</text>
          <text x="180" y="128" textAnchor="end" fontSize="15" fontWeight="700" fill="#047857">₹590.00</text>

          {/* Calculation hint */}
          <rect x="14" y="148" width="172" height="36" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
          <text x="100" y="164" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e">
            18% of 500
          </text>
          <text x="100" y="178" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">
            = 500 × 0.18 = 90
          </text>
        </g>

        {/* 100-square grid showing 18 out of 100 = 18% */}
        <g transform="translate(220, 90)">
          <text x="80" y="-8" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
            18% of the bill is GST
          </text>
          {/* 10 × 10 grid */}
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const idx = row * 10 + col;
              const isGst = idx < 18;
              return (
                <rect key={idx}
                  x={col * 12} y={row * 12}
                  width="11" height="11"
                  fill={isGst ? '#dc2626' : '#bae6fd'}
                  stroke="#0f172a" strokeWidth="0.4"
                />
              );
            })
          )}
          <text x="60" y="138" textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="700">
            ▮ 18 squares = GST
          </text>
          <text x="60" y="152" textAnchor="middle" fontSize="10" fill="#0c4a6e" fontWeight="700">
            ▮ 82 squares = price
          </text>
        </g>
      </svg>
    </div>
  );
}
