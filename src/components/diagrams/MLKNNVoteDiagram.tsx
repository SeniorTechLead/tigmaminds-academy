/**
 * KNN: a new point (?) is classified by majority vote of its K=5 nearest
 * neighbours. A dashed circle encloses the 5 closest; the vote tally decides.
 *
 * Used in the "K-Nearest Neighbors" section.
 */
export default function MLKNNVoteDiagram() {
  const W = 700, H = 340;
  const cx = 250, cy = 180;
  // points: blue class and orange class around the query
  const blue = [[210, 150], [230, 210], [285, 165], [180, 120], [320, 120]];
  const orange = [[300, 230], [340, 200], [150, 220], [120, 160], [360, 260]];
  // nearest 5 to (cx,cy): pick 3 blue + 2 orange that are closest -> blue wins
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="K nearest neighbours: a new point is surrounded by its five closest neighbours — three blue and two orange — so it is classified blue by majority vote.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Classify by the majority of the K=5 nearest</text>

        {/* neighbourhood circle */}
        <circle cx={cx} cy={cy} r="78" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="6 4" className="dark:fill-indigo-900/20 dark:stroke-indigo-400" />

        {blue.map((p, i) => <circle key={'b' + i} cx={p[0]} cy={p[1]} r="8" fill="#3b82f6" />)}
        {orange.map((p, i) => <circle key={'o' + i} cx={p[0]} cy={p[1]} r="8" fill="#f97316" />)}

        {/* query point */}
        <circle cx={cx} cy={cy} r="11" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" className="dark:fill-gray-900 dark:stroke-gray-100" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" className="dark:fill-gray-100">?</text>

        {/* legend / tally on right */}
        <rect x="470" y="80" width="200" height="180" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="570" y="108" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Vote of the 5 nearest</text>
        <circle cx="500" cy="140" r="8" fill="#3b82f6" />
        <text x="518" y="145" fontSize="12" fill="#334155" className="dark:fill-gray-200">Blue ×3</text>
        <circle cx="500" cy="172" r="8" fill="#f97316" />
        <text x="518" y="177" fontSize="12" fill="#334155" className="dark:fill-gray-200">Orange ×2</text>
        <line x1="490" y1="195" x2="650" y2="195" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-gray-600" />
        <text x="570" y="225" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1d4ed8" className="dark:fill-blue-300">→ Blue wins</text>
        <text x="570" y="245" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">3 beats 2</text>
      </svg>
    </div>
  );
}
