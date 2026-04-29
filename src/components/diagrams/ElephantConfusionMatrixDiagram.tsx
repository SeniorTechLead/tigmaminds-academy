export default function ElephantConfusionMatrixDiagram() {
  const labels = ['R', 'T', 'Ro', 'B', 'C', 'S'];
  const fullLabels = ['Rumble', 'Trumpet', 'Roar', 'Bark', 'Cry', 'Snort'];
  const colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#f472b6', '#a78bfa'];

  // Simplified confusion matrix values (rows = actual, cols = predicted)
  // Diagonal = correct, off-diagonal = errors
  const matrix = [
    [18, 1, 0, 0, 1, 0], // Rumble
    [0, 15, 3, 0, 0, 0], // Trumpet
    [0, 4, 14, 1, 0, 0], // Roar — confused with trumpet
    [0, 0, 1, 17, 0, 1], // Bark
    [1, 0, 0, 0, 16, 0], // Cry
    [0, 0, 0, 1, 0, 19], // Snort
  ];

  const gridX = 140;
  const gridY = 68;
  const cellSize = 46;

  // Color intensity based on value
  const cellColor = (row: number, col: number, val: number) => {
    if (val === 0) return '#0f172a';
    if (row === col) {
      // Diagonal: green shades
      const alpha = 0.3 + (val / 20) * 0.5;
      return `rgba(34,197,94,${alpha.toFixed(2)})`;
    }
    // Off-diagonal: red shades
    const alpha = 0.2 + (val / 10) * 0.5;
    return `rgba(239,68,68,${alpha.toFixed(2)})`;
  };

  // Roar-Trumpet confusion cell (row=2, col=1) for annotation
  const confRow = 2;
  const confCol = 1;
  const confCellX = gridX + confCol * cellSize;
  const confCellY = gridY + confRow * cellSize;

  return (
    <svg
      viewBox="0 0 630 454"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="6 by 6 confusion matrix showing classifier accuracy across rumble, trumpet, roar, bark, cry, and snort, with annotation highlighting roar confused with trumpet"
    >
      {/* Dark background */}
      <rect width="600" height="420" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Confusion Matrix — 6 Moods
      </text>

      {/* Axis labels */}
      <text x={gridX + (cellSize * 6) / 2} y={gridY - 12} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">
        Predicted
      </text>
      <text
        x={gridX - 30}
        y={gridY + (cellSize * 6) / 2}
        textAnchor="middle"
        className="fill-gray-500 dark:fill-slate-400"
        fontSize="10"
        fontWeight="600"
        transform={`rotate(-90,${gridX - 30},${gridY + (cellSize * 6) / 2})`}
      >
        Actual
      </text>

      {/* Column headers */}
      {labels.map((l, i) => (
        <text
          key={`ch-${i}`}
          x={gridX + i * cellSize + cellSize / 2}
          y={gridY - 2}
          textAnchor="middle"
          fill={colors[i]}
          fontSize="9"
          fontWeight="700"
        >
          {l}
        </text>
      ))}

      {/* Row headers */}
      {labels.map((l, i) => (
        <text
          key={`rh-${i}`}
          x={gridX - 8}
          y={gridY + i * cellSize + cellSize / 2 + 3}
          textAnchor="end"
          fill={colors[i]}
          fontSize="9"
          fontWeight="700"
        >
          {l}
        </text>
      ))}

      {/* Grid cells */}
      {matrix.map((row, r) =>
        row.map((val, c) => {
          const x = gridX + c * cellSize;
          const y = gridY + r * cellSize;
          const isDiag = r === c;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={cellColor(r, c, val)}
                className="stroke-gray-200 dark:stroke-slate-800"
                strokeWidth="1"
              />
              {val > 0 && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 + 4}
                  textAnchor="middle"
                  fill={isDiag ? '#86efac' : val >= 3 ? '#fca5a5' : '#94a3b8'}
                  fontSize={isDiag ? '13' : '11'}
                  fontWeight={isDiag ? '800' : '600'}
                >
                  {val}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Grid outer border */}
      <rect
        x={gridX}
        y={gridY}
        width={cellSize * 6}
        height={cellSize * 6}
        fill="none"
        className="stroke-gray-300 dark:stroke-slate-600"
        strokeWidth="1.5"
        rx="2"
      />

      {/* ── Annotation: Roar confused with Trumpet ── */}
      <circle
        cx={confCellX + cellSize / 2}
        cy={confCellY + cellSize / 2}
        r={cellSize / 2 + 2}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      {/* Annotation line */}
      <line
        x1={confCellX + cellSize / 2 + cellSize / 2 + 4}
        y1={confCellY + cellSize / 2}
        x2={480}
        y2={confCellY + cellSize / 2 - 20}
        stroke="#ef4444"
        strokeWidth="1"
      />
      {/* Annotation box */}
      <rect
        x={420}
        y={confCellY + cellSize / 2 - 40}
        width={160}
        height={36}
        rx="4"
        fill="#450a0a"
        stroke="#ef4444"
        strokeWidth="1"
      />
      <text x={500} y={confCellY + cellSize / 2 - 26} textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="600">
        Roar confused with
      </text>
      <text x={500} y={confCellY + cellSize / 2 - 14} textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">
        Trumpet (4 errors)
      </text>

      {/* Legend: Full names */}
      <g transform={`translate(${gridX}, ${gridY + cellSize * 6 + 16})`}>
        {fullLabels.map((name, i) => (
          <g key={name} transform={`translate(${i * 48}, 0)`}>
            <rect x={0} y={0} width={10} height={10} rx="2" fill={colors[i]} opacity="0.7" />
            <text x={14} y={9} className="fill-gray-500 dark:fill-slate-400" fontSize="7.5">
              {name}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom summaries */}
      <text x="300" y="388" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="600">
        The diagonal = correct predictions
      </text>
      <text x="300" y="404" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="600">
        Off-diagonal = errors to investigate
      </text>
    </svg>
  );
}
