'use client';
import { useState } from 'react';

const LAMBDA_VALUES = [0.5, 1, 2, 5];

function expPDF(x: number, lam: number): number {
  return lam * Math.exp(-lam * x);
}

function expCDF(x: number, lam: number): number {
  return 1 - Math.exp(-lam * x);
}

export default function ExponentialDistDiagram() {
  const [lambda, setLambda] = useState(1);
  const [showCDF, setShowCDF] = useState(false);
  const [x0, setX0] = useState(1.0);

  const svgW = 400;
  const svgH = 260;
  const margin = { top: 44, bottom: 44, left: 44, right: 16 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;

  // x range: 0 to xMax
  const xMax = Math.max(5, 3 / lambda);
  const numPoints = 120;

  const toSvgX = (x: number) => margin.left + (x / xMax) * plotW;
  const toSvgY = (y: number, maxY: number) => margin.top + plotH - (y / maxY) * plotH;

  const pdfMax = lambda; // PDF peak is at x=0: lambda * e^0 = lambda
  const yMax = showCDF ? 1.1 : Math.max(pdfMax * 1.15, 0.5);
  const fn = showCDF ? expCDF : expPDF;

  // Build curve path
  const points = Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = (i / numPoints) * xMax;
    const y = fn(x, lambda);
    return { x, y };
  });

  const curvePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y, yMax).toFixed(1)}`)
    .join(' ');

  // Shaded area path (PDF only, up to x0)
  const shadedPoints = points.filter((p) => p.x <= x0);
  const shadedPath =
    !showCDF && shadedPoints.length > 1
      ? shadedPoints
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y, yMax).toFixed(1)}`)
          .join(' ') +
        ` L${toSvgX(x0).toFixed(1)},${toSvgY(0, yMax).toFixed(1)} L${toSvgX(0).toFixed(1)},${toSvgY(0, yMax).toFixed(1)} Z`
      : '';

  const meanX = 1 / lambda;
  const probAtX0 = expCDF(x0, lambda);

  // Click handler on SVG to set x0
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * svgW;
    const dataX = ((svgX - margin.left) / plotW) * xMax;
    if (dataX >= 0 && dataX <= xMax) {
      setX0(Math.round(dataX * 20) / 20);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Controls */}
      <div className="flex justify-center gap-2 mb-1 flex-wrap">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 self-center">λ =</span>
        {LAMBDA_VALUES.map((l) => (
          <button
            key={l}
            onClick={() => setLambda(l)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              l === lambda
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {l}
          </button>
        ))}
        <span className="mx-1" />
        <button
          onClick={() => setShowCDF(!showCDF)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            showCDF
              ? 'bg-amber-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {showCDF ? 'CDF' : 'PDF'}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-xl mx-auto cursor-crosshair"
        role="img"
        aria-label={`Exponential distribution ${showCDF ? 'CDF' : 'PDF'} with lambda ${lambda}`}
        onClick={handleSvgClick}
      >
        <rect width={svgW} height={svgH} className="fill-white dark:fill-slate-950" rx="8" />
        <text x={svgW / 2} y={18} textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">
          The Exponential Distribution
        </text>
        <text x={svgW / 2} y={32} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          {showCDF ? 'F(x) = 1 - e^(-λx)' : 'f(x) = λe^(-λx)'}
        </text>

        {/* Axes */}
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Shaded area under PDF up to x0 */}
        {shadedPath && (
          <path d={shadedPath} className="fill-blue-300/40 dark:fill-blue-500/30" />
        )}

        {/* Curve */}
        <path d={curvePath} fill="none" className={showCDF ? 'stroke-amber-500' : 'stroke-blue-500'} strokeWidth="2" />

        {/* Mean marker on x-axis */}
        {meanX <= xMax && (
          <>
            <line x1={toSvgX(meanX)} y1={margin.top + plotH - 4} x2={toSvgX(meanX)} y2={margin.top + plotH + 4} className="stroke-red-500" strokeWidth="2" />
            <text x={toSvgX(meanX)} y={margin.top + plotH + 16} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="8" fontWeight="bold">
              1/λ = {(1 / lambda).toFixed(1)}
            </text>
          </>
        )}

        {/* x0 marker */}
        <line x1={toSvgX(x0)} y1={margin.top} x2={toSvgX(x0)} y2={margin.top + plotH} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
        <circle cx={toSvgX(x0)} cy={toSvgY(fn(x0, lambda), yMax)} r="4" className="fill-indigo-500" />
        <text x={toSvgX(x0) + 4} y={margin.top + 12} className="fill-indigo-600 dark:fill-indigo-400" fontSize="8" fontWeight="bold">
          x₀ = {x0.toFixed(1)}
        </text>

        {/* P(X <= x0) box */}
        <rect x={svgW - 140} y={margin.top + 2} width={128} height={28} rx="4" className="fill-indigo-50 dark:fill-indigo-900/40 stroke-indigo-300 dark:stroke-indigo-600" strokeWidth="1" />
        <text x={svgW - 76} y={margin.top + 20} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="9" fontWeight="bold">
          P(X ≤ {x0.toFixed(1)}) = {probAtX0.toFixed(3)}
        </text>

        {/* X-axis ticks */}
        {Array.from({ length: Math.min(Math.floor(xMax) + 1, 12) }, (_, i) => (
          <g key={i}>
            <line x1={toSvgX(i)} y1={margin.top + plotH} x2={toSvgX(i)} y2={margin.top + plotH + 4} className="stroke-gray-400" strokeWidth="1" />
            <text x={toSvgX(i)} y={margin.top + plotH + 14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{i}</text>
          </g>
        ))}

        {/* Axis labels */}
        <text x={margin.left + plotW / 2} y={svgH - 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          x (time/distance)
        </text>
      </svg>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">Click on the chart to move x₀</p>

      {/* Description */}
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center space-y-1">
        <p>
          <span className="font-semibold">Average wait time = 1/λ = {(1 / lambda).toFixed(1)}</span> minutes between bus arrivals
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Memoryless property: P(X {'>'} s+t | X {'>'} s) = P(X {'>'} t) — past waiting doesn't help predict future
        </p>
      </div>
    </div>
  );
}
