'use client';
import { useState } from 'react';

/**
 * Interactive box plot diagram.
 * Shows Q1, median, Q3, IQR, whiskers, and outlier detection.
 * Labels placed to avoid overlap — stats shown in table below.
 */

type DatasetKey = 'symmetric' | 'skewed' | 'outlier';

const DATASETS: Record<DatasetKey, { label: string; data: number[]; desc: string }> = {
  symmetric: {
    label: 'Symmetric',
    data: [45, 52, 55, 58, 60, 62, 63, 65, 67, 68, 70, 72, 75, 78, 85],
    desc: 'Evenly spread — the median sits in the middle of the box.',
  },
  skewed: {
    label: 'Right-skewed',
    data: [12, 15, 18, 20, 22, 23, 25, 28, 35, 42, 55, 68, 85],
    desc: 'Long right whisker — data trails off toward high values.',
  },
  outlier: {
    label: 'With outlier',
    data: [11, 12, 13, 13, 14, 14, 15, 100],
    desc: 'The value 100 is far beyond the fence — a clear outlier.',
  },
};

function computeStats(data: number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = sorted.slice(Math.ceil(n / 2));
  const q1 = lowerHalf.length % 2 === 1
    ? lowerHalf[Math.floor(lowerHalf.length / 2)]
    : (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2;
  const q3 = upperHalf.length % 2 === 1
    ? upperHalf[Math.floor(upperHalf.length / 2)]
    : (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2;

  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);
  const inliers = sorted.filter(v => v >= lowerFence && v <= upperFence);
  const whiskerLow = inliers.length > 0 ? inliers[0] : q1;
  const whiskerHigh = inliers.length > 0 ? inliers[inliers.length - 1] : q3;

  return { sorted, median, q1, q3, iqr, lowerFence, upperFence, whiskerLow, whiskerHigh, outliers, min: sorted[0], max: sorted[n - 1] };
}

export default function BoxPlotDiagram() {
  const [dataset, setDataset] = useState<DatasetKey>('outlier');

  const { data, desc } = DATASETS[dataset];
  const stats = computeStats(data);

  const W = 380, H = 130;
  const mx = 30, mr = 30;
  const plotW = W - mx - mr;
  const cy = 50;
  const boxH = 32;

  // Smart axis: focus on the box region with padding, show outliers as break
  const hasDistantOutlier = stats.outliers.some(v =>
    Math.abs(v - stats.median) > (stats.q3 - stats.q1) * 8
  );

  // Use the whisker range (+ some padding) for the main axis
  const rangeLo = stats.whiskerLow - (stats.q3 - stats.q1) * 0.8;
  const rangeHi = stats.whiskerHigh + (stats.q3 - stats.q1) * 0.8;
  // If no distant outlier, just use data range
  const axisLo = hasDistantOutlier ? rangeLo : Math.min(stats.min, stats.lowerFence) - 2;
  const axisHi = hasDistantOutlier ? rangeHi : Math.max(stats.max, stats.upperFence) + 2;

  // Reserve right 60px for outlier display if there's a break
  const mainPlotW = hasDistantOutlier ? plotW - 60 : plotW;
  const sx = (v: number) => mx + ((v - axisLo) / (axisHi - axisLo)) * mainPlotW;

  // Outlier position (in the reserved right zone)
  const outlierX = mx + mainPlotW + 40;

  // Tick marks on the main axis
  const range = axisHi - axisLo;
  const tickStep = range > 50 ? 10 : range > 20 ? 5 : range > 8 ? 2 : 1;
  const ticks: number[] = [];
  for (let t = Math.ceil(axisLo / tickStep) * tickStep; t <= axisHi; t += tickStep) ticks.push(t);

  return (
    <div className="space-y-2">
      {/* Dataset selector */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(DATASETS) as DatasetKey[]).map(k => (
          <button
            key={k}
            onClick={() => setDataset(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              dataset === k
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {DATASETS[k].label}
          </button>
        ))}
      </div>

      {/* Box plot SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Number line + ticks */}
        <line x1={mx} y1={cy + boxH / 2 + 18} x2={mx + mainPlotW} y2={cy + boxH / 2 + 18} stroke="#d1d5db" strokeWidth="1" />
        {ticks.map(t => (
          <g key={t}>
            <line x1={sx(t)} y1={cy + boxH / 2 + 14} x2={sx(t)} y2={cy + boxH / 2 + 22} stroke="#9ca3af" strokeWidth="1" />
            <text x={sx(t)} y={cy + boxH / 2 + 32} fontSize="9" fill="#9ca3af" textAnchor="middle">{t}</text>
          </g>
        ))}

        {/* Axis break indicator */}
        {hasDistantOutlier && (
          <g>
            <text x={mx + mainPlotW + 8} y={cy + boxH / 2 + 22} fontSize="12" fill="#9ca3af">⫽</text>
          </g>
        )}

        {/* Left whisker */}
        <line x1={sx(stats.whiskerLow)} y1={cy} x2={sx(stats.q1)} y2={cy} stroke="#3b82f6" strokeWidth="2" />
        <line x1={sx(stats.whiskerLow)} y1={cy - 8} x2={sx(stats.whiskerLow)} y2={cy + 8} stroke="#3b82f6" strokeWidth="2" />

        {/* Right whisker */}
        <line x1={sx(stats.q3)} y1={cy} x2={sx(stats.whiskerHigh)} y2={cy} stroke="#3b82f6" strokeWidth="2" />
        <line x1={sx(stats.whiskerHigh)} y1={cy - 8} x2={sx(stats.whiskerHigh)} y2={cy + 8} stroke="#3b82f6" strokeWidth="2" />

        {/* Box (Q1 to Q3) */}
        <rect
          x={sx(stats.q1)} y={cy - boxH / 2}
          width={Math.max(sx(stats.q3) - sx(stats.q1), 4)} height={boxH}
          fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2" rx="3"
        />

        {/* Median line */}
        <line x1={sx(stats.median)} y1={cy - boxH / 2} x2={sx(stats.median)} y2={cy + boxH / 2} stroke="#dc2626" strokeWidth="2.5" />

        {/* IQR bracket below box */}
        <line x1={sx(stats.q1)} y1={cy + boxH / 2 + 4} x2={sx(stats.q3)} y2={cy + boxH / 2 + 4} stroke="#10b981" strokeWidth="1.5" />

        {/* Labels above box — only if they won't overlap (box width > 40px) */}
        {sx(stats.q3) - sx(stats.q1) > 60 ? (
          <>
            <text x={sx(stats.q1)} y={cy - boxH / 2 - 5} fontSize="9" fill="#3b82f6" textAnchor="middle" fontWeight="600">Q1</text>
            <text x={sx(stats.median)} y={cy - boxH / 2 - 5} fontSize="9" fill="#dc2626" textAnchor="middle" fontWeight="600">Med</text>
            <text x={sx(stats.q3)} y={cy - boxH / 2 - 5} fontSize="9" fill="#3b82f6" textAnchor="middle" fontWeight="600">Q3</text>
          </>
        ) : (
          /* When box is narrow, put a single label with arrow */
          <text x={sx(stats.median)} y={cy - boxH / 2 - 5} fontSize="9" fill="#dc2626" textAnchor="middle" fontWeight="600">
            Q1–Med–Q3
          </text>
        )}

        {/* Non-distant outliers (within main axis range) */}
        {stats.outliers.filter(v => !hasDistantOutlier || Math.abs(v - stats.median) <= (stats.q3 - stats.q1) * 8).map((v, i) => (
          <g key={`o${i}`}>
            <circle cx={sx(v)} cy={cy} r="5" fill="none" stroke="#ef4444" strokeWidth="2" />
            <text x={sx(v)} y={cy - 12} fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="600">{v}</text>
          </g>
        ))}

        {/* Distant outliers (shown in break zone) */}
        {hasDistantOutlier && stats.outliers.filter(v => Math.abs(v - stats.median) > (stats.q3 - stats.q1) * 8).map((v, i) => (
          <g key={`do${i}`}>
            <circle cx={outlierX} cy={cy} r="5" fill="none" stroke="#ef4444" strokeWidth="2" />
            <text x={outlierX} y={cy - 12} fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="700">{v}</text>
            <text x={outlierX} y={cy + 18} fontSize="7" fill="#ef4444" textAnchor="middle">outlier</text>
          </g>
        ))}
      </svg>

      {/* Stats table — always readable, never overlapping */}
      <div className="grid grid-cols-5 gap-1 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
          <div className="text-[10px] font-semibold text-blue-500 uppercase">Q1</div>
          <div className="text-sm font-bold text-blue-700 dark:text-blue-300">{stats.q1}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
          <div className="text-[10px] font-semibold text-red-500 uppercase">Median</div>
          <div className="text-sm font-bold text-red-700 dark:text-red-300">{stats.median}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
          <div className="text-[10px] font-semibold text-blue-500 uppercase">Q3</div>
          <div className="text-sm font-bold text-blue-700 dark:text-blue-300">{stats.q3}</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2">
          <div className="text-[10px] font-semibold text-emerald-500 uppercase">IQR</div>
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{stats.iqr.toFixed(1)}</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
          <div className="text-[10px] font-semibold text-amber-500 uppercase">Fence</div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300">{stats.upperFence.toFixed(1)}</div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {desc}
        {stats.outliers.length > 0 && (
          <span className="text-red-500 font-semibold"> Outlier{stats.outliers.length > 1 ? 's' : ''}: {stats.outliers.join(', ')} (beyond fence at {stats.upperFence.toFixed(1)})</span>
        )}
      </div>
    </div>
  );
}
