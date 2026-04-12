'use client';

import { useState } from 'react';

const CLASSES = ['Calm', 'Nervous', 'Danger'];

const RAW_COUNTS = [
  [42, 3, 0],
  [5, 28, 8],
  [0, 4, 18],
];

const EXPLANATIONS: Record<string, string> = {
  '0-0': '42 calm rumbles correctly identified as calm — low-frequency, steady patterns are easy to recognize.',
  '0-1': '3 calm rumbles were predicted as nervous — slight pitch variations in some calm calls can mimic early nervousness.',
  '0-2': '0 calm rumbles were predicted as danger — calm and danger signals are very distinct in frequency.',
  '1-0': '5 nervous rumbles were predicted as calm — some nervous elephants produce subdued rumbles that resemble calm ones.',
  '1-1': '28 nervous rumbles correctly identified as nervous — moderate frequency shifts and irregular patterns detected.',
  '1-2': '8 nervous rumbles were predicted as danger — these sounds are similar because frequency ranges overlap.',
  '2-0': '0 danger rumbles were predicted as calm — danger signals are too intense to be mistaken for calm.',
  '2-1': '4 danger rumbles were predicted as nervous — some early-stage danger rumbles share nervous frequency bands.',
  '2-2': '18 danger rumbles correctly identified as danger — high amplitude, rapid infrasonic bursts are distinctive.',
};

const CLASS_ACCURACY = ['93%', '68%', '82%'];

export default function ConfusionMatrixDiagram() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showPct, setShowPct] = useState(false);

  const rowTotals = RAW_COUNTS.map((r) => r.reduce((a, b) => a + b, 0));
  const totalCorrect = RAW_COUNTS[0][0] + RAW_COUNTS[1][1] + RAW_COUNTS[2][2];
  const totalAll = rowTotals.reduce((a, b) => a + b, 0);
  const overallAcc = ((totalCorrect / totalAll) * 100).toFixed(1);

  const maxVal = Math.max(...RAW_COUNTS.flat());

  const cellX = (col: number) => 110 + col * 80;
  const cellY = (row: number) => 60 + row * 58;
  const cellW = 76;
  const cellH = 54;

  const getCellColor = (row: number, col: number) => {
    const val = RAW_COUNTS[row][col];
    const intensity = val / maxVal;
    if (row === col) {
      return `rgba(34,197,94,${0.15 + intensity * 0.7})`;
    }
    if (val === 0) return 'rgba(200,200,200,0.15)';
    return `rgba(239,68,68,${0.1 + intensity * 0.6})`;
  };

  const getCellValue = (row: number, col: number) => {
    if (!showPct) return RAW_COUNTS[row][col].toString();
    const pct = ((RAW_COUNTS[row][col] / rowTotals[row]) * 100).toFixed(0);
    return `${pct}%`;
  };

  const key = (r: number, c: number) => `${r}-${c}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 460 280" className="w-full max-w-lg" role="img">
        <title>Confusion Matrix — Elephant Rumble Classification</title>

        {/* Title */}
        <text x="230" y="18" textAnchor="middle" className="fill-current" fontSize="12" fontWeight="bold">
          Where the Model Gets Confused
        </text>

        {/* Column header */}
        <text x="230" y="38" textAnchor="middle" className="fill-current opacity-60" fontSize="10">
          Predicted
        </text>
        {CLASSES.map((c, i) => (
          <text key={`ch-${i}`} x={cellX(i) + cellW / 2} y="55" textAnchor="middle" className="fill-current" fontSize="9" fontWeight="600">
            {c}
          </text>
        ))}

        {/* Row header */}
        <text x="16" y="130" textAnchor="middle" className="fill-current opacity-60" fontSize="10" transform="rotate(-90,16,130)">
          Actual
        </text>
        {CLASSES.map((c, i) => (
          <text key={`rh-${i}`} x="100" y={cellY(i) + cellH / 2 + 4} textAnchor="end" className="fill-current" fontSize="9" fontWeight="600">
            {c}
          </text>
        ))}

        {/* Grid cells */}
        {RAW_COUNTS.map((row, ri) =>
          row.map((_, ci) => {
            const k = key(ri, ci);
            const isSelected = selected === k;
            return (
              <g key={k} onClick={() => setSelected(isSelected ? null : k)} className="cursor-pointer">
                <rect
                  x={cellX(ci)}
                  y={cellY(ri)}
                  width={cellW}
                  height={cellH}
                  rx="4"
                  fill={getCellColor(ri, ci)}
                  stroke={isSelected ? '#facc15' : 'rgba(128,128,128,0.3)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                />
                <text
                  x={cellX(ci) + cellW / 2}
                  y={cellY(ri) + cellH / 2 + 5}
                  textAnchor="middle"
                  className="fill-current"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {getCellValue(ri, ci)}
                </text>
              </g>
            );
          })
        )}

        {/* Per-class accuracy on right */}
        <text x="365" y="55" textAnchor="middle" className="fill-current opacity-60" fontSize="9">
          Accuracy
        </text>
        {CLASS_ACCURACY.map((a, i) => (
          <g key={`acc-${i}`}>
            <rect x="345" y={cellY(i) + 8} width="40" height="28" rx="4" fill="rgba(99,102,241,0.15)" />
            <text x="365" y={cellY(i) + 27} textAnchor="middle" className="fill-current" fontSize="11" fontWeight="bold">
              {a}
            </text>
          </g>
        ))}

        {/* Overall accuracy */}
        <text x="230" y="248" textAnchor="middle" className="fill-current" fontSize="10">
          Overall Accuracy:{' '}
          <tspan fontWeight="bold" fill="#22c55e">{overallAcc}%</tspan>
          <tspan className="fill-current opacity-50"> ({totalCorrect}/{totalAll} correct)</tspan>
        </text>

        {/* Legend */}
        <rect x="110" y="260" width="10" height="10" rx="2" fill="rgba(34,197,94,0.6)" />
        <text x="124" y="269" className="fill-current opacity-60" fontSize="8">Correct</text>
        <rect x="170" y="260" width="10" height="10" rx="2" fill="rgba(239,68,68,0.4)" />
        <text x="184" y="269" className="fill-current opacity-60" fontSize="8">Error</text>
        <text x="230" y="269" className="fill-current opacity-40" fontSize="8">Click a cell for details</text>
      </svg>

      {/* Toggle */}
      <button
        onClick={() => setShowPct((v) => !v)}
        className="text-xs px-3 py-1 rounded-full border border-gray-400/40 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {showPct ? 'Show Raw Counts' : 'Show Percentages (row-normalized)'}
      </button>

      {/* Explanation for selected cell */}
      {selected && (
        <div className="w-full max-w-lg text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg px-3 py-2">
          <span className="font-semibold">
            {CLASSES[parseInt(selected[0])]} → {CLASSES[parseInt(selected[2])]}:
          </span>{' '}
          {EXPLANATIONS[selected]}
        </div>
      )}

      {/* What to fix insight */}
      <div className="w-full max-w-lg text-xs bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-300 dark:border-indigo-700 rounded-lg px-3 py-2">
        <span className="font-semibold">What to fix?</span> The model struggles most with Nervous→Danger confusion (8 errors). Adding &quot;rumble duration&quot; as a feature might help — nervous rumbles tend to be shorter.
      </div>
    </div>
  );
}
