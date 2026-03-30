export default function ElephantCrossValDiagram() {
  const folds = 5;
  const barX = 60;
  const barY = 62;
  const barW = 300;
  const barH = 28;
  const gap = 10;
  const segW = barW / folds;

  const accuracies = [0.84, 0.88, 0.82, 0.86, 0.90];
  const mean = accuracies.reduce((a, b) => a + b, 0) / folds;
  const std = Math.sqrt(accuracies.reduce((a, v) => a + (v - mean) ** 2, 0) / folds);

  return (
    <svg
      viewBox="0 0 630 346"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="5-fold cross-validation diagram showing how data is split into train and test sets across 5 folds, with accuracy for each fold and mean plus standard deviation"
    >
      {/* Dark background */}
      <rect width="600" height="320" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        5-Fold Cross-Validation
      </text>

      {/* Column headers */}
      {Array.from({ length: folds }, (_, i) => (
        <text
          key={`seg-${i}`}
          x={barX + i * segW + segW / 2}
          y={barY - 6}
          textAnchor="middle"
          className="fill-gray-400 dark:fill-slate-500"
          fontSize="8"
        >
          Fold {i + 1}
        </text>
      ))}

      {/* 5 rows */}
      {Array.from({ length: folds }, (_, row) => {
        const y = barY + row * (barH + gap);
        return (
          <g key={`row-${row}`}>
            {/* Row label */}
            <text x={barX - 8} y={y + barH / 2 + 3} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
              Run {row + 1}
            </text>

            {/* Segments */}
            {Array.from({ length: folds }, (_, col) => {
              const isTest = col === row;
              return (
                <rect
                  key={`cell-${row}-${col}`}
                  x={barX + col * segW}
                  y={y}
                  width={segW - 2}
                  height={barH}
                  rx="3"
                  fill={isTest ? '#1e40af' : '#166534'}
                  stroke={isTest ? '#3b82f6' : '#22c55e'}
                  strokeWidth="1"
                  opacity={isTest ? 1 : 0.7}
                />
              );
            })}

            {/* Test label inside blue segment */}
            <text
              x={barX + row * segW + segW / 2 - 1}
              y={y + barH / 2 + 3}
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="8"
              fontWeight="700"
            >
              TEST
            </text>

            {/* Accuracy on right */}
            <text x={barX + barW + 14} y={y + barH / 2 + 3} fill="#fde68a" fontSize="10" fontWeight="700">
              {(accuracies[row] * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${barX}, ${barY + folds * (barH + gap) + 10})`}>
        <rect x={0} y={0} width={14} height={10} rx="2" fill="#166534" stroke="#22c55e" strokeWidth="1" />
        <text x={20} y={9} fill="#86efac" fontSize="9" fontWeight="600">
          Train
        </text>
        <rect x={70} y={0} width={14} height={10} rx="2" fill="#1e40af" stroke="#3b82f6" strokeWidth="1" />
        <text x={90} y={9} fill="#93c5fd" fontSize="9" fontWeight="600">
          Test
        </text>
      </g>

      {/* ── Mean ± Std summary box ── */}
      <rect
        x={barX + barW + 50}
        y={barY + 30}
        width={130}
        height={100}
        rx="6"
        className="fill-gray-100 dark:fill-slate-800"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <text x={barX + barW + 115} y={barY + 52} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700">
        Summary
      </text>
      <line
        x1={barX + barW + 60}
        y1={barY + 58}
        x2={barX + barW + 170}
        y2={barY + 58}
        stroke="#334155"
        strokeWidth="0.5"
      />
      <text x={barX + barW + 115} y={barY + 78} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="12" fontWeight="800">
        Mean
      </text>
      <text x={barX + barW + 115} y={barY + 96} textAnchor="middle" fill="#86efac" fontSize="16" fontWeight="800">
        {(mean * 100).toFixed(1)}%
      </text>
      <text x={barX + barW + 115} y={barY + 116} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">
        ± {(std * 100).toFixed(1)}%
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="296" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        Every data point gets tested exactly once
      </text>
    </svg>
  );
}
