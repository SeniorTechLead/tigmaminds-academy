/**
 * A 3x3 confusion matrix for the calm/nervous/danger classifier: correct
 * predictions on the diagonal (green), mistakes off-diagonal (red shades).
 *
 * Used in the "Building a Confusion Matrix" and "Evaluating a Model" sections.
 */
export default function MLConfusionMatrixDiagram() {
  const W = 620, H = 420;
  const labels = ['calm', 'nervous', 'danger'];
  // [trueRow][predCol]
  const grid = [
    [42, 5, 1],
    [4, 30, 6],
    [0, 7, 25],
  ];
  const ox = 200, oy = 110, cell = 90;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img" aria-label="A three by three confusion matrix. Correct predictions sit on the green diagonal; off-diagonal red cells show where true classes were mistaken for others.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Diagonal = correct, off-diagonal = confused</text>

        {/* axis titles */}
        <text x={ox + cell * 1.5} y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569" className="dark:fill-gray-300">Predicted →</text>
        <text x="70" y={oy + cell * 1.5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569" transform={`rotate(-90, 70, ${oy + cell * 1.5})`} className="dark:fill-gray-300">True label →</text>

        {/* column headers */}
        {labels.map((l, c) => (
          <text key={'c' + c} x={ox + c * cell + cell / 2} y={oy - 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155" className="dark:fill-gray-200">{l}</text>
        ))}
        {/* row headers */}
        {labels.map((l, r) => (
          <text key={'r' + r} x={ox - 12} y={oy + r * cell + cell / 2 + 4} textAnchor="end" fontSize="12" fontWeight="600" fill="#334155" className="dark:fill-gray-200">{l}</text>
        ))}

        {/* cells */}
        {grid.map((row, r) => row.map((val, c) => {
          const diag = r === c;
          const light = diag ? '#dcfce7' : (val === 0 ? '#f1f5f9' : '#fee2e2');
          const dark = diag ? 'dark:fill-green-900/50' : (val === 0 ? 'dark:fill-gray-800' : 'dark:fill-red-900/40');
          const txt = diag ? '#15803d' : (val === 0 ? '#94a3b8' : '#b91c1c');
          const txtDark = diag ? 'dark:fill-green-300' : (val === 0 ? 'dark:fill-gray-500' : 'dark:fill-red-300');
          return (
            <g key={`${r}-${c}`}>
              <rect x={ox + c * cell} y={oy + r * cell} width={cell - 6} height={cell - 6} rx="8" fill={light} stroke="#cbd5e1" strokeWidth="1" className={`${dark} dark:stroke-gray-600`} />
              <text x={ox + c * cell + (cell - 6) / 2} y={oy + r * cell + (cell - 6) / 2 + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={txt} className={txtDark}>{val}</text>
            </g>
          );
        }))}

        <text x={ox + cell * 1.5} y={oy + cell * 3 + 24} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">Big green numbers = good. Big red numbers = where it gets confused.</text>
      </svg>
    </div>
  );
}
