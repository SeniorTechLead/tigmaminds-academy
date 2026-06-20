/**
 * Inflation erodes purchasing power: the same ₹100 note buys a shrinking basket
 * of goods over 10 years at 6% inflation. Bars show real value falling.
 *
 * Used in the "Money, Inflation, and Purchasing Power" section.
 */
export default function InflationPurchasingPowerDiagram() {
  const W = 720, H = 320;
  // What ₹100 can still buy (real value) at 6% inflation, by year
  const years = [0, 2, 4, 6, 8, 10];
  const realValue = years.map(y => 100 / Math.pow(1.06, y)); // ₹100 / (1.06^y)
  const maxBar = 100;
  const ox = 70, baseY = 250, barGap = 100, barW = 54;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img"
        aria-label="At 6 percent inflation, the real value of 100 rupees falls year by year — to about 56 rupees of buying power after ten years.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">What ₹100 can still buy (6% inflation)</text>

        {/* baseline */}
        <line x1={ox - 20} y1={baseY} x2={W - 30} y2={baseY} stroke="#94a3b8" strokeWidth="1.5" className="dark:stroke-gray-500" />

        {years.map((yr, i) => {
          const v = realValue[i];
          const h = (v / maxBar) * 180;
          const x = ox + i * barGap;
          // color fades from green (full value) to red (eroded)
          const frac = v / 100;
          const light = frac > 0.8 ? '#16a34a' : frac > 0.65 ? '#d97706' : '#dc2626';
          return (
            <g key={yr}>
              <rect x={x} y={baseY - h} width={barW} height={h} rx="4" fill={light} opacity="0.85" />
              <text x={x + barW / 2} y={baseY - h - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">₹{v.toFixed(0)}</text>
              <text x={x + barW / 2} y={baseY + 18} textAnchor="middle" fontSize="11" fill="#64748b" className="dark:fill-gray-400">Year {yr}</text>
            </g>
          );
        })}

        {/* annotation */}
        <text x={W / 2} y={H - 16} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#b91c1c" className="dark:fill-red-300">
          Same ₹100 note — but after 10 years it buys only ~₹56 worth of goods.
        </text>
      </svg>
    </div>
  );
}
