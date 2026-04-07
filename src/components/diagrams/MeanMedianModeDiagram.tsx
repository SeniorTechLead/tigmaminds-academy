import { useState, useMemo } from 'react';

const NORMAL_DATA = [45, 55, 60, 60, 60, 65, 70, 72, 95];
const OUTLIER_DATA = [5, 45, 55, 60, 60, 60, 65, 70, 72, 95];

function calcMean(data: number[]) {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

function calcMedian(data: number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calcMode(data: number[]) {
  const freq: Record<number, number> = {};
  for (const v of data) freq[v] = (freq[v] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  return Number(Object.keys(freq).find((k) => freq[Number(k)] === maxFreq));
}

export default function MeanMedianModeDiagram() {
  const [withOutlier, setWithOutlier] = useState(false);

  const data = withOutlier ? OUTLIER_DATA : NORMAL_DATA;

  const { mean, median, mode } = useMemo(
    () => ({
      mean: calcMean(data),
      median: calcMedian(data),
      mode: calcMode(data),
    }),
    [data],
  );

  // Layout constants
  const padL = 30;
  const padR = 30;
  const lineY = 160; // number-line y
  const lineW = 460; // usable width for 0-100
  const xOf = (v: number) => padL + (v / 100) * lineW;

  // Build stacked dot positions
  const dotPositions: { x: number; y: number; value: number }[] = [];
  const freq: Record<number, number> = {};
  for (const v of [...data].sort((a, b) => a - b)) {
    freq[v] = (freq[v] || 0) + 1;
    const stack = freq[v];
    dotPositions.push({
      x: xOf(v),
      y: lineY - 18 - (stack - 1) * 16,
      value: v,
    });
  }

  const indicatorTop = 55;
  const indicatorBot = lineY + 14;

  const indicators = [
    {
      label: 'Mean',
      value: mean,
      color: '#3b82f6',
      dash: '5,4',
    },
    {
      label: 'Median',
      value: median,
      color: '#22c55e',
      dash: '',
    },
    {
      label: 'Mode',
      value: mode,
      color: '#f97316',
      dash: '',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Toggle button */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setWithOutlier((p) => !p)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            withOutlier
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          }`}
        >
          {withOutlier ? 'With outlier (5)' : 'Normal data'}
        </button>
      </div>

      <svg
        viewBox="0 0 546 260"
        className="w-full"
        role="img"
        aria-label="Mean, Median, and Mode diagram"
      >
        {/* Number line */}
        <line
          x1={padL}
          y1={lineY}
          x2={padL + lineW}
          y2={lineY}
          stroke="#94a3b8"
          strokeWidth={1.5}
        />

        {/* Tick marks every 10 */}
        {Array.from({ length: 11 }, (_, i) => i * 10).map((v) => (
          <g key={v}>
            <line
              x1={xOf(v)}
              y1={lineY - 4}
              x2={xOf(v)}
              y2={lineY + 4}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <text
              x={xOf(v)}
              y={lineY + 18}
              textAnchor="middle"
              fontSize={10}
              className="fill-gray-500 dark:fill-slate-400"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Data dots */}
        {dotPositions.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={6}
            fill="#60a5fa"
            stroke="#1e3a5f"
            strokeWidth={1}
          >
            <title>{d.value}</title>
          </circle>
        ))}

        {/* Indicator lines + labels — stack labels when values are close */}
        {indicators.map((ind, idx) => {
          const x = xOf(ind.value);
          // Count how many prior indicators are within 8 units
          let overlapCount = 0;
          for (let j = 0; j < idx; j++) {
            if (Math.abs(ind.value - indicators[j].value) < 8) overlapCount++;
          }
          const labelY = indicatorTop - 6 - overlapCount * 14;
          return (
            <g key={ind.label}>
              <line
                x1={x}
                y1={indicatorTop}
                x2={x}
                y2={indicatorBot}
                stroke={ind.color}
                strokeWidth={2}
                strokeDasharray={ind.dash || undefined}
              />
              <text
                x={x}
                y={labelY}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={ind.color}
              >
                {ind.label} = {Math.round(ind.value * 10) / 10}
              </text>
            </g>
          );
        })}

        {/* Caption */}
        <text
          x={260}
          y={210}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-600 dark:fill-slate-300"
        >
          {withOutlier
            ? 'The outlier (5) drags the mean left — median barely moves!'
            : 'Mean, median, and mode are close when data is balanced.'}
        </text>
      </svg>
    </div>
  );
}
