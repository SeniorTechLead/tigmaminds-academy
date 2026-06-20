/**
 * Mean vs median vs mode on a number line, showing how one big outlier drags the
 * mean away while the median stays put.
 *
 * Used in the "Central Tendency: Mean, Median, Mode" section.
 */
export default function StatsCentralTendencyDiagram() {
  const W = 700, H = 280;
  const data = [2, 3, 3, 4, 5, 20]; // mode 3, median 3.5, mean ~6.2
  const min = 0, max = 22;
  const axisY = 150, ox = 60, axisW = 580;
  const xOf = (v) => ox + ((v - min) / (max - min)) * axisW;
  const mean = 6.17, median = 3.5, mode = 3;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="On a number line, a single large outlier (20) pulls the mean far to the right while the median and mode stay near the cluster of small values.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">One outlier pulls the mean, not the median</text>

        {/* axis */}
        <line x1={ox} y1={axisY} x2={ox + axisW} y2={axisY} stroke="#94a3b8" strokeWidth="2" className="dark:stroke-gray-500" />
        {data.map((v, i) => (
          <circle key={i} cx={xOf(v)} cy={axisY} r="8" fill={v === 20 ? '#dc2626' : '#3b82f6'} opacity="0.85" />
        ))}
        <text x={xOf(20)} y={axisY + 30} textAnchor="middle" fontSize="10" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">outlier</text>

        {/* markers */}
        <g>
          <line x1={xOf(mode)} y1={axisY - 70} x2={xOf(mode)} y2={axisY} stroke="#16a34a" strokeWidth="2" />
          <rect x={xOf(mode) - 26} y={axisY - 92} width="52" height="22" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-green-900/40 dark:stroke-green-400" />
          <text x={xOf(mode)} y={axisY - 77} textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" className="dark:fill-green-300">mode 3</text>
        </g>
        <g>
          <line x1={xOf(median)} y1={axisY - 44} x2={xOf(median)} y2={axisY} stroke="#7c3aed" strokeWidth="2" />
          <rect x={xOf(median) - 30} y={axisY - 66} width="64" height="22" rx="6" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
          <text x={xOf(median) + 2} y={axisY - 51} textAnchor="middle" fontSize="10" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">median 3.5</text>
        </g>
        <g>
          <line x1={xOf(mean)} y1={axisY - 44} x2={xOf(mean)} y2={axisY} stroke="#ea580c" strokeWidth="2" />
          <rect x={xOf(mean) - 28} y={axisY - 66} width="62" height="22" rx="6" fill="#ffedd5" stroke="#ea580c" strokeWidth="1" className="dark:fill-orange-900/40 dark:stroke-orange-400" />
          <text x={xOf(mean) + 2} y={axisY - 51} textAnchor="middle" fontSize="10" fontWeight="700" fill="#c2410c" className="dark:fill-orange-300">mean 6.2</text>
        </g>
        <text x={ox} y={axisY + 80} fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">The median resists outliers; the mean does not.</text>
      </svg>
    </div>
  );
}
