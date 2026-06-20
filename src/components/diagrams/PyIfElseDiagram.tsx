/**
 * An if/else as a fork in the trail: a condition diamond branches to two paths,
 * only one of which runs.
 *
 * Used in the "Making Decisions (If / Else)" section.
 */
export default function PyIfElseDiagram() {
  const W = 700, H = 330;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="An if/else decision: the condition temperature greater than 35 branches True to a heat alert and False to temperature is fine; only one branch runs.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">A condition picks exactly one branch</text>

        {/* edges */}
        <line x1="280" y1="130" x2="170" y2="210" stroke="#94a3b8" strokeWidth="2" />
        <line x1="420" y1="130" x2="530" y2="210" stroke="#94a3b8" strokeWidth="2" />
        <text x="205" y="178" fontSize="11" fontWeight="700" fill="#16a34a" className="dark:fill-green-400">True</text>
        <text x="470" y="178" fontSize="11" fontWeight="700" fill="#dc2626" className="dark:fill-red-400">False</text>

        {/* condition diamond */}
        <polygon points="350,70 460,115 350,160 240,115" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x="350" y="112" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">temperature</text>
        <text x="350" y="130" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">&gt; 35 ?</text>

        {/* True branch */}
        <rect x="60" y="210" width="220" height="64" rx="10" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" className="dark:fill-red-900/40 dark:stroke-red-400" />
        <text x="170" y="238" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">Heat alert —</text>
        <text x="170" y="256" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">stay hydrated</text>

        {/* False branch */}
        <rect x="420" y="210" width="220" height="64" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x="530" y="246" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Temperature is fine</text>

        <text x="350" y="305" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">The other branch is skipped entirely.</text>
      </svg>
    </div>
  );
}
