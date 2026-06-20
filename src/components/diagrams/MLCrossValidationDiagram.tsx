/**
 * 5-fold cross-validation: the dataset is split into 5 folds; across 5 rounds
 * each fold takes a turn as the test set (orange) while the rest train (blue).
 *
 * Used in the "Cross-Validation" section.
 */
export default function MLCrossValidationDiagram() {
  const W = 700, H = 320;
  const folds = 5;
  const cellW = 88, cellH = 34, ox = 150, oy = 80, gapY = 44;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Five-fold cross-validation: across five rounds, each of the five data folds takes a turn as the orange test fold while the remaining blue folds are used for training.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Every fold gets a turn as the test set</text>

        {/* column header */}
        <text x={ox + cellW * 2.5} y="64" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">5 folds of the data →</text>

        {Array.from({ length: folds }, (_, round) => (
          <g key={round}>
            <text x={ox - 14} y={oy + round * gapY + cellH / 2 + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#334155" className="dark:fill-gray-200">Round {round + 1}</text>
            {Array.from({ length: folds }, (_, col) => {
              const isTest = col === round;
              return (
                <g key={col}>
                  <rect x={ox + col * cellW} y={oy + round * gapY} width={cellW - 6} height={cellH} rx="6"
                    fill={isTest ? '#ffedd5' : '#dbeafe'} stroke={isTest ? '#f97316' : '#3b82f6'} strokeWidth="1.5"
                    className={isTest ? 'dark:fill-orange-900/40 dark:stroke-orange-400' : 'dark:fill-blue-900/40 dark:stroke-blue-400'} />
                  <text x={ox + col * cellW + (cellW - 6) / 2} y={oy + round * gapY + cellH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="700"
                    fill={isTest ? '#c2410c' : '#1d4ed8'} className={isTest ? 'dark:fill-orange-300' : 'dark:fill-blue-300'}>{isTest ? 'test' : 'train'}</text>
                </g>
              );
            })}
          </g>
        ))}

        {/* legend */}
        <rect x={ox} y={oy + folds * gapY + 10} width="14" height="14" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x={ox + 22} y={oy + folds * gapY + 22} fontSize="10" fill="#475569" className="dark:fill-gray-300">train</text>
        <rect x={ox + 90} y={oy + folds * gapY + 10} width="14" height="14" rx="3" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" className="dark:fill-orange-900/40 dark:stroke-orange-400" />
        <text x={ox + 112} y={oy + folds * gapY + 22} fontSize="10" fill="#475569" className="dark:fill-gray-300">test — average the 5 scores</text>
      </svg>
    </div>
  );
}
