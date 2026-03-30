export default function ElephantConfusionDiagram() {
  // Elephant silhouette
  const elephant =
    'M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z';

  // Simple bird silhouette
  const bird =
    'M8,18 Q12,10 20,12 Q26,10 28,14 L32,10 Q30,16 28,18 Q30,22 28,26 Q24,28 20,26 Q16,28 12,26 Q10,22 12,18 Z';

  // Grid layout
  const gridX = 100;
  const gridY = 70;
  const cellW = 190;
  const cellH = 80;

  const cells = [
    {
      row: 0, col: 0,
      bg: '#052e16', border: '#22c55e',
      title: 'True Positive',
      desc: 'Correctly found elephant',
      icon: 'elephant',
      iconColor: '#22c55e',
    },
    {
      row: 0, col: 1,
      bg: '#450a0a', border: '#ef4444',
      title: 'False Positive',
      desc: 'False alarm (bird → elephant)',
      icon: 'warning',
      iconColor: '#ef4444',
    },
    {
      row: 1, col: 0,
      bg: '#450a0a', border: '#ef4444',
      title: 'False Negative',
      desc: 'Missed elephant!',
      icon: 'warning',
      iconColor: '#ef4444',
    },
    {
      row: 1, col: 1,
      bg: '#052e16', border: '#22c55e',
      title: 'True Negative',
      desc: 'Correctly ignored bird',
      icon: 'bird',
      iconColor: '#22c55e',
    },
  ];

  return (
    <svg
      viewBox="0 0 630 424"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Confusion matrix showing true positives, false positives, false negatives, and true negatives with precision and recall formulas"
    >
      {/* Dark background */}
      <rect width="600" height="400" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Confusion Matrix
      </text>

      {/* Column headers */}
      <text x={gridX + cellW / 2} y={gridY - 18} textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="600">
        Actually Elephant
      </text>
      <text x={gridX + cellW + cellW / 2} y={gridY - 18} textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="600">
        Actually Bird
      </text>

      {/* Row headers */}
      <text
        x={gridX - 14}
        y={gridY + cellH / 2}
        textAnchor="middle"
        fill="#86efac"
        fontSize="9"
        fontWeight="600"
        transform={`rotate(-90,${gridX - 14},${gridY + cellH / 2})`}
      >
        Predicted Elephant
      </text>
      <text
        x={gridX - 14}
        y={gridY + cellH + cellH / 2}
        textAnchor="middle"
        fill="#fde68a"
        fontSize="9"
        fontWeight="600"
        transform={`rotate(-90,${gridX - 14},${gridY + cellH + cellH / 2})`}
      >
        Predicted Bird
      </text>

      {/* Grid cells */}
      {cells.map((cell) => {
        const cx = gridX + cell.col * cellW;
        const cy = gridY + cell.row * cellH;
        return (
          <g key={`${cell.row}-${cell.col}`}>
            <rect
              x={cx}
              y={cy}
              width={cellW}
              height={cellH}
              rx="4"
              fill={cell.bg}
              stroke={cell.border}
              strokeWidth="1.5"
            />

            {/* Icon */}
            {cell.icon === 'elephant' && (
              <g transform={`translate(${cx + 12}, ${cy + 14}) scale(0.9)`}>
                <path d={elephant} fill={cell.iconColor} opacity="0.7" />
              </g>
            )}
            {cell.icon === 'bird' && (
              <g transform={`translate(${cx + 12}, ${cy + 18}) scale(1.0)`}>
                <path d={bird} fill={cell.iconColor} opacity="0.7" />
              </g>
            )}
            {cell.icon === 'warning' && (
              <g transform={`translate(${cx + 16}, ${cy + 16})`}>
                <polygon points="12,0 24,22 0,22" fill="none" stroke={cell.iconColor} strokeWidth="1.5" />
                <text x="12" y="18" textAnchor="middle" fill={cell.iconColor} fontSize="12" fontWeight="800">
                  !
                </text>
              </g>
            )}

            {/* Title */}
            <text x={cx + 56} y={cy + 28} fill={cell.border} fontSize="11" fontWeight="700">
              {cell.title}
            </text>

            {/* Description */}
            <text x={cx + 56} y={cy + 46} className="fill-gray-500 dark:fill-slate-400" fontSize="9">
              {cell.desc}
            </text>

            {/* Abbreviation */}
            <text x={cx + cellW - 14} y={cy + 18} textAnchor="end" className="fill-gray-400 dark:fill-slate-500" fontSize="10" fontWeight="700">
              {cell.row === 0 && cell.col === 0 ? 'TP' : cell.row === 0 && cell.col === 1 ? 'FP' : cell.row === 1 && cell.col === 0 ? 'FN' : 'TN'}
            </text>
          </g>
        );
      })}

      {/* ── Formulas below grid ── */}
      <g transform={`translate(${gridX}, ${gridY + 2 * cellH + 20})`}>
        {/* Precision */}
        <rect x="0" y="0" width="180" height="30" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
        <text x="90" y="12" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="700">
          Precision
        </text>
        <text x="90" y="24" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">
          = TP / (TP + FP)
        </text>

        {/* Recall */}
        <rect x="200" y="0" width="180" height="30" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
        <text x="290" y="12" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="700">
          Recall
        </text>
        <text x="290" y="24" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">
          = TP / (TP + FN)
        </text>
      </g>

      {/* ── Annotation: recall matters most ── */}
      <rect x="100" y="310" width="400" height="32" rx="5" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
      <text x="300" y="330" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="700">
        For poaching detection: high recall matters most — don't miss any!
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="374" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        The confusion matrix shows exactly where the model gets it right — and wrong
      </text>
    </svg>
  );
}
