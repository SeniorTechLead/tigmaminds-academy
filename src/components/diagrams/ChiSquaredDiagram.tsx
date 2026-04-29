'use client';
import { useState } from 'react';

const DF_VALUES = [1, 2, 3, 5, 10];

// Stirling-based log-gamma for positive values
function logGamma(z: number): number {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function chiSquaredPDF(x: number, k: number): number {
  if (x <= 0) return 0;
  const halfK = k / 2;
  const logP = (halfK - 1) * Math.log(x) - x / 2 - halfK * Math.log(2) - logGamma(halfK);
  return Math.exp(logP);
}

// Approximate upper-tail p-value via numerical integration (trapezoidal)
function chiSquaredPValue(x: number, k: number): number {
  if (x <= 0) return 1;
  const steps = 500;
  const upper = Math.max(x + 40, 60);
  const dx = (upper - x) / steps;
  let sum = 0;
  for (let i = 0; i <= steps; i++) {
    const xi = x + i * dx;
    const w = i === 0 || i === steps ? 0.5 : 1;
    sum += w * chiSquaredPDF(xi, k);
  }
  return Math.min(1, Math.max(0, sum * dx));
}

// Critical values at alpha=0.05 (precomputed)
const CRITICAL_05: Record<number, number> = {
  1: 3.841,
  2: 5.991,
  3: 7.815,
  5: 11.070,
  10: 18.307,
};

export default function ChiSquaredDiagram() {
  const [df, setDf] = useState(3);
  const [testStat, setTestStat] = useState(5.0);

  const svgW = 400;
  const svgH = 270;
  const margin = { top: 48, bottom: 50, left: 44, right: 16 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;

  const critical = CRITICAL_05[df] ?? 7.815;
  const xMax = Math.max(critical + 10, df + 20, testStat + 5);
  const numPoints = 200;

  // Compute yMax from curve
  const curvePoints = Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = (i / numPoints) * xMax;
    return { x, y: chiSquaredPDF(x, df) };
  });
  const yMax = Math.max(...curvePoints.map((p) => p.y)) * 1.15;

  const toSvgX = (x: number) => margin.left + (x / xMax) * plotW;
  const toSvgY = (y: number) => margin.top + plotH - (y / yMax) * plotH;

  const curvePath = curvePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
    .join(' ');

  // Rejection region shading (x >= critical)
  const rejectionPoints = curvePoints.filter((p) => p.x >= critical);
  const rejectionPath =
    rejectionPoints.length > 1
      ? rejectionPoints
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
          .join(' ') +
        ` L${toSvgX(rejectionPoints[rejectionPoints.length - 1].x).toFixed(1)},${toSvgY(0).toFixed(1)} L${toSvgX(critical).toFixed(1)},${toSvgY(0).toFixed(1)} Z`
      : '';

  const pValue = chiSquaredPValue(testStat, df);
  const inRejection = testStat >= critical;

  // Drag / click handler
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * svgW;
    const dataX = ((svgX - margin.left) / plotW) * xMax;
    if (dataX >= 0.1 && dataX <= xMax) {
      setTestStat(Math.round(dataX * 10) / 10);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* DF selector */}
      <div className="flex justify-center gap-2 mb-2 flex-wrap">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 self-center">df =</span>
        {DF_VALUES.map((d) => (
          <button
            key={d}
            onClick={() => setDf(d)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              d === df
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-xl mx-auto cursor-crosshair"
        role="img"
        aria-label={`Chi-squared distribution with ${df} degrees of freedom`}
        onClick={handleSvgClick}
      >
        <rect width={svgW} height={svgH} className="fill-white dark:fill-slate-950" rx="8" />
        <text x={svgW / 2} y={18} textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">
          Chi-Squared & Hypothesis Testing
        </text>
        <text x={svgW / 2} y={34} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          df = {df}, α = 0.05, critical value = {critical.toFixed(2)}
        </text>

        {/* Axes */}
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Rejection region shading */}
        {rejectionPath && (
          <path d={rejectionPath} className="fill-red-300/50 dark:fill-red-500/30" />
        )}

        {/* Curve */}
        <path d={curvePath} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Critical value line */}
        <line x1={toSvgX(critical)} y1={margin.top} x2={toSvgX(critical)} y2={margin.top + plotH} className="stroke-red-500" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x={toSvgX(critical)} y={margin.top + plotH + 26} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="8" fontWeight="bold">
          χ²₀.₀₅ = {critical.toFixed(1)}
        </text>

        {/* Test statistic point */}
        <line x1={toSvgX(testStat)} y1={margin.top + 10} x2={toSvgX(testStat)} y2={margin.top + plotH} stroke={inRejection ? '#ef4444' : '#22c55e'} strokeWidth="2" />
        <circle cx={toSvgX(testStat)} cy={toSvgY(chiSquaredPDF(testStat, df))} r="5" fill={inRejection ? '#ef4444' : '#22c55e'} />

        {/* Decision label */}
        <rect
          x={svgW - 150}
          y={margin.top + 4}
          width={138}
          height={44}
          rx="5"
          className={inRejection ? 'fill-red-50 dark:fill-red-900/40 stroke-red-400' : 'fill-green-50 dark:fill-green-900/40 stroke-green-400'}
          strokeWidth="1"
        />
        <text
          x={svgW - 81}
          y={margin.top + 22}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          className={inRejection ? 'fill-red-700 dark:fill-red-300' : 'fill-green-700 dark:fill-green-300'}
        >
          {inRejection ? 'Reject H₀' : 'Fail to reject H₀'}
        </text>
        <text x={svgW - 81} y={margin.top + 36} textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-400">
          χ² = {testStat.toFixed(1)}, p ≈ {pValue < 0.001 ? '<0.001' : pValue.toFixed(3)}
        </text>

        {/* X-axis ticks */}
        {Array.from({ length: Math.floor(xMax / 5) + 1 }, (_, i) => {
          const val = i * 5;
          return (
            <g key={i}>
              <line x1={toSvgX(val)} y1={margin.top + plotH} x2={toSvgX(val)} y2={margin.top + plotH + 4} className="stroke-gray-400" strokeWidth="1" />
              <text x={toSvgX(val)} y={margin.top + plotH + 14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{val}</text>
            </g>
          );
        })}

        {/* Axis label */}
        <text x={margin.left + plotW / 2} y={svgH - 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          χ² test statistic
        </text>
      </svg>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">Click on the chart to move the test statistic</p>

      {/* Description */}
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center">
        <p>
          If your test statistic falls in the <span className="text-red-600 dark:text-red-400 font-semibold">red zone</span>, the observed pattern is unlikely to be due to chance.
        </p>
      </div>
    </div>
  );
}
