/**
 * bisect on a sorted list: finds where a new value would be inserted to keep the
 * list sorted, in O(log n). Shows the sorted array with an insertion arrow.
 *
 * Used in the "The bisect Module — Binary Search Built In" section.
 */
export default function PyBisectDiagram() {
  const W = 700, H = 250;
  const arr = [2, 5, 8, 12, 16, 23, 38, 56];
  const target = 14; // would insert between 12 (idx 3) and 16 (idx 4)
  const insertIdx = 4;
  const cellW = 64, ox = 60, oy = 110;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="bisect finds the insertion point in a sorted list: the value 14 would slot between 12 and 16 at index 4, keeping the list sorted, in logarithmic time.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">bisect: where does a value belong in a sorted list?</text>

        {arr.map((n, i) => (
          <g key={i}>
            <rect x={ox + i * cellW} y={oy} width={cellW - 6} height="44" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" className="dark:fill-gray-800 dark:stroke-gray-500" />
            <text x={ox + i * cellW + (cellW - 6) / 2} y={oy + 28} textAnchor="middle" fontSize="13" fontWeight="600" fill="#0f172a" className="dark:fill-gray-100">{n}</text>
            <text x={ox + i * cellW + (cellW - 6) / 2} y={oy + 62} textAnchor="middle" fontSize="9" fill="#94a3b8" className="dark:fill-gray-500">{i}</text>
          </g>
        ))}

        {/* insertion marker */}
        <line x1={ox + insertIdx * cellW - 3} y1={oy - 30} x2={ox + insertIdx * cellW - 3} y2={oy + 50} stroke="#f97316" strokeWidth="2.5" strokeDasharray="5 3" />
        <rect x={ox + insertIdx * cellW - 36} y={oy - 56} width="66" height="26" rx="6" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" className="dark:fill-orange-900/30 dark:stroke-orange-400" />
        <text x={ox + insertIdx * cellW - 3} y={oy - 38} textAnchor="middle" fontSize="12" fontWeight="800" fill="#c2410c" className="dark:fill-orange-300">{target}?</text>

        <text x="30" y={oy + 100} fontSize="11" fill="#475569" className="dark:fill-gray-300">
          <tspan fontFamily="monospace" fontWeight="700">bisect_left(arr, {target})</tspan> → {insertIdx}  (slot between 12 and 16, list stays sorted)
        </text>
      </svg>
    </div>
  );
}
