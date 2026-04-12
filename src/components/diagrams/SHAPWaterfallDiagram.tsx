'use client';

import { useState } from 'react';

interface Prediction {
  label: string;
  base: number;
  features: { name: string; value: string; contribution: number; explanation: string }[];
  final: number;
}

const predictions: Prediction[] = [
  {
    label: 'Danger rumble',
    base: 33,
    features: [
      { name: 'Frequency', value: '45 Hz', contribution: 25, explanation: 'Low frequency (45 Hz) is typical of distress rumbles — pushes prediction toward danger.' },
      { name: 'Pulse rate', value: '3.8', contribution: 22, explanation: 'High pulse rate (3.8) indicates agitation — strong danger signal.' },
      { name: 'Amplitude', value: '1.2', contribution: 12, explanation: 'High amplitude (1.2) means a loud, forceful call — associated with danger.' },
    ],
    final: 92,
  },
  {
    label: 'Calm rumble',
    base: 33,
    features: [
      { name: 'Frequency', value: '120 Hz', contribution: -12, explanation: 'High frequency (120 Hz) is typical of relaxed contact calls — pushes toward calm.' },
      { name: 'Pulse rate', value: '1.2', contribution: -8, explanation: 'Low pulse rate (1.2) indicates a steady, relaxed call — calm signal.' },
      { name: 'Amplitude', value: '0.4', contribution: -5, explanation: 'Low amplitude (0.4) means a quiet, gentle sound — associated with calm.' },
    ],
    final: 8,
  },
  {
    label: 'Nervous rumble',
    base: 33,
    features: [
      { name: 'Frequency', value: '70 Hz', contribution: 10, explanation: 'Mid-low frequency (70 Hz) is ambiguous but leans toward danger.' },
      { name: 'Pulse rate', value: '2.5', contribution: 8, explanation: 'Moderate pulse rate (2.5) — somewhat elevated, mild danger signal.' },
      { name: 'Amplitude', value: '0.8', contribution: 4, explanation: 'Moderate amplitude (0.8) — neither loud nor quiet, slight danger push.' },
    ],
    final: 55,
  },
];

export default function SHAPWaterfallDiagram() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const pred = predictions[selected];

  // Layout constants
  const chartLeft = 130;
  const chartRight = 430;
  const chartWidth = chartRight - chartLeft;
  const barHeight = 28;
  const rowGap = 8;
  const startY = 60;

  // Scale: 0% to 100% maps to chartLeft..chartRight
  const scale = (pct: number) => chartLeft + (pct / 100) * chartWidth;

  // Build waterfall rows
  const rows: { label: string; valueLabel: string; startPct: number; endPct: number; contribution: number; explanation: string }[] = [];
  let running = pred.base;

  // Base row
  rows.push({
    label: 'Base value',
    valueLabel: `Avg: ${pred.base}%`,
    startPct: 0,
    endPct: pred.base,
    contribution: 0,
    explanation: 'The average prediction across all samples before considering this specific input\'s features.',
  });

  for (const f of pred.features) {
    const prev = running;
    running += f.contribution;
    rows.push({
      label: f.name,
      valueLabel: `${f.value} → ${f.contribution > 0 ? '+' : ''}${f.contribution}%`,
      startPct: prev,
      endPct: running,
      contribution: f.contribution,
      explanation: f.explanation,
    });
  }

  // Final row
  rows.push({
    label: 'Final prediction',
    valueLabel: `${pred.final}%`,
    startPct: 0,
    endPct: pred.final,
    contribution: 0,
    explanation: `The model's final prediction after all features are accounted for: ${pred.final}% danger.`,
  });

  const totalHeight = startY + rows.length * (barHeight + rowGap) + 90;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {predictions.map((p, i) => (
          <button
            key={p.label}
            onClick={() => { setSelected(i); setHovered(null); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selected === i
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 460 ${totalHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="SHAP waterfall chart showing feature contributions to a prediction"
      >
        <rect width="460" height={totalHeight} rx="10" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="230" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Why Did the Model Predict &quot;{pred.label}&quot;?
        </text>
        <text x="230" y="38" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          SHAP waterfall — each bar shows one feature&apos;s push
        </text>

        {/* Axis line at top */}
        <line x1={chartLeft} y1={startY - 6} x2={chartRight} y2={startY - 6} stroke="#94a3b8" strokeWidth="0.5" />
        {[0, 25, 50, 75, 100].map(tick => (
          <g key={tick}>
            <line x1={scale(tick)} y1={startY - 10} x2={scale(tick)} y2={startY - 4} stroke="#94a3b8" strokeWidth="0.7" />
            <text x={scale(tick)} y={startY - 14} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">{tick}%</text>
          </g>
        ))}

        {rows.map((row, i) => {
          const y = startY + i * (barHeight + rowGap);
          const isBase = i === 0;
          const isFinal = i === rows.length - 1;
          const isFeature = !isBase && !isFinal;

          const x1 = scale(Math.min(row.startPct, row.endPct));
          const x2 = scale(Math.max(row.startPct, row.endPct));
          const w = Math.max(x2 - x1, 2);

          let fill: string;
          if (isBase) fill = '#94a3b8';
          else if (isFinal) fill = pred.final > 60 ? '#dc2626' : pred.final < 40 ? '#2563eb' : '#f59e0b';
          else fill = row.contribution > 0 ? '#dc2626' : '#2563eb';

          const isHovered = hovered === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(isHovered ? null : i)}
              className="cursor-pointer"
            >
              {/* Row label */}
              <text
                x={chartLeft - 6}
                y={y + barHeight / 2 + 4}
                textAnchor="end"
                fontSize="10"
                fontWeight={isFinal ? '700' : '500'}
                className="fill-gray-700 dark:fill-slate-300"
              >
                {row.label}
              </text>

              {/* Bar */}
              <rect
                x={x1}
                y={y}
                width={w}
                height={barHeight}
                rx="4"
                fill={fill}
                opacity={isHovered ? 1 : 0.8}
                stroke={isHovered ? '#fbbf24' : 'none'}
                strokeWidth={isHovered ? 2 : 0}
              />

              {/* Value label on bar */}
              <text
                x={x2 + 4}
                y={y + barHeight / 2 + 4}
                fontSize="9"
                fontWeight="600"
                className="fill-gray-600 dark:fill-slate-300"
              >
                {row.valueLabel}
              </text>

              {/* Connector line from previous bar (waterfall) */}
              {isFeature && (
                <line
                  x1={scale(row.startPct)}
                  y1={y - rowGap}
                  x2={scale(row.startPct)}
                  y2={y}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
              )}

              {/* Arrow showing push direction */}
              {isFeature && (
                <g>
                  {row.contribution > 0 ? (
                    <polygon
                      points={`${x2 - 1},${y + barHeight / 2 - 5} ${x2 + 6},${y + barHeight / 2} ${x2 - 1},${y + barHeight / 2 + 5}`}
                      fill={fill}
                      opacity="0.9"
                    />
                  ) : (
                    <polygon
                      points={`${x1 + 1},${y + barHeight / 2 - 5} ${x1 - 6},${y + barHeight / 2} ${x1 + 1},${y + barHeight / 2 + 5}`}
                      fill={fill}
                      opacity="0.9"
                    />
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Hover explanation box */}
        {hovered !== null && (
          <g>
            <rect
              x="20"
              y={startY + rows.length * (barHeight + rowGap) + 4}
              width="420"
              height="36"
              rx="6"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="1"
              className="dark:fill-yellow-900/40 dark:stroke-yellow-600"
            />
            <text
              x="230"
              y={startY + rows.length * (barHeight + rowGap) + 26}
              textAnchor="middle"
              fontSize="9"
              className="fill-gray-800 dark:fill-slate-200"
            >
              {rows[hovered].explanation}
            </text>
          </g>
        )}

        {/* Description */}
        <text
          x="230"
          y={totalHeight - 14}
          textAnchor="middle"
          fontSize="8.5"
          className="fill-gray-500 dark:fill-slate-400"
        >
          SHAP shows WHICH features drove THIS specific prediction, not just the overall model.
        </text>
        <text
          x="230"
          y={totalHeight - 3}
          textAnchor="middle"
          fontSize="8.5"
          className="fill-gray-500 dark:fill-slate-400"
        >
          Every prediction can be explained.
        </text>
      </svg>
    </div>
  );
}
