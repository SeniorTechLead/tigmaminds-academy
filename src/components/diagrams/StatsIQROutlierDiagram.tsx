/**
 * IQR outlier detection: a box plot with Q1, median, Q3, the 1.5×IQR whiskers,
 * and a point beyond the fence flagged as an outlier.
 *
 * Used in the "Detecting Outliers with IQR" section.
 */
export default function StatsIQROutlierDiagram() {
  const W = 700, H = 250;
  const ox = 70, axisW = 560, axisY = 130;
  const min = 0, max = 100;
  const xOf = (v) => ox + ((v - min) / (max - min)) * axisW;
  const q1 = 30, med = 45, q3 = 60, loFence = 15, hiFence = 75, outlier = 92;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A box plot showing Q1, median, Q3, the interquartile range box, whiskers at 1.5 times IQR, and a point beyond the upper fence flagged as an outlier.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">IQR flags points far from the middle 50%</text>

        {/* axis */}
        <line x1={ox} y1={axisY + 50} x2={ox + axisW} y2={axisY + 50} stroke="#94a3b8" strokeWidth="1.2" className="dark:stroke-gray-500" />

        {/* whiskers */}
        <line x1={xOf(loFence)} y1={axisY} x2={xOf(q1)} y2={axisY} stroke="#475569" strokeWidth="2" className="dark:stroke-gray-300" />
        <line x1={xOf(q3)} y1={axisY} x2={xOf(hiFence)} y2={axisY} stroke="#475569" strokeWidth="2" className="dark:stroke-gray-300" />
        <line x1={xOf(loFence)} y1={axisY - 14} x2={xOf(loFence)} y2={axisY + 14} stroke="#475569" strokeWidth="2" className="dark:stroke-gray-300" />
        <line x1={xOf(hiFence)} y1={axisY - 14} x2={xOf(hiFence)} y2={axisY + 14} stroke="#475569" strokeWidth="2" className="dark:stroke-gray-300" />

        {/* box (IQR) */}
        <rect x={xOf(q1)} y={axisY - 28} width={xOf(q3) - xOf(q1)} height="56" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <line x1={xOf(med)} y1={axisY - 28} x2={xOf(med)} y2={axisY + 28} stroke="#1d4ed8" strokeWidth="2.5" className="dark:stroke-blue-300" />

        {/* labels */}
        <text x={xOf(q1)} y={axisY + 48} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">Q1</text>
        <text x={xOf(med)} y={axisY - 36} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">median</text>
        <text x={xOf(q3)} y={axisY + 48} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">Q3</text>
        <text x={(xOf(q1) + xOf(q3)) / 2} y={axisY - 38} textAnchor="middle" fontSize="10" fontWeight="700" fill="#3b82f6" className="dark:fill-blue-300">IQR</text>

        {/* outlier */}
        <circle cx={xOf(outlier)} cy={axisY} r="7" fill="#dc2626" />
        <line x1={xOf(hiFence)} y1={axisY} x2={xOf(outlier) - 8} y2={axisY} stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
        <text x={xOf(outlier)} y={axisY - 20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">outlier</text>
        <text x={xOf(hiFence)} y={axisY + 70} textAnchor="middle" fontSize="9" fill="#64748b" className="dark:fill-gray-400">Q3 + 1.5×IQR fence</text>
      </svg>
    </div>
  );
}
