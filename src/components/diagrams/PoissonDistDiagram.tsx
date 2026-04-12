'use client';
import { useState } from 'react';

const LAMBDA_VALUES = [1, 2, 3, 5, 8, 10];
const MAX_K = 16;

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPMF(k: number, lam: number): number {
  return Math.pow(lam, k) * Math.exp(-lam) / factorial(k);
}

const CONTEXTS: Record<number, string> = {
  1: 'e.g. ~1 typo per page',
  2: 'e.g. ~2 emails per hour',
  3: 'e.g. ~3 calls to a helpdesk per hour',
  5: 'e.g. ~5 customers arriving per minute',
  8: 'e.g. ~8 defects per batch',
  10: 'e.g. ~10 requests per second to a server',
};

export default function PoissonDistDiagram() {
  const [lambda, setLambda] = useState(3);

  const probs = Array.from({ length: MAX_K }, (_, k) => poissonPMF(k, lambda));
  const maxProb = Math.max(...probs);
  const mode = lambda >= 1 ? Math.floor(lambda) : 0;

  const svgW = 400;
  const svgH = 280;
  const margin = { top: 50, bottom: 50, left: 40, right: 10 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;
  const barW = plotW / MAX_K - 2;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Lambda selector */}
      <div className="flex justify-center gap-2 mb-2 flex-wrap">
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
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md mx-auto" role="img" aria-label={`Poisson distribution bar chart with lambda ${lambda}`}>
        <rect width={svgW} height={svgH} className="fill-white dark:fill-slate-950" rx="8" />
        <text x={svgW / 2} y={20} textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">
          The Poisson Distribution
        </text>
        {/* Formula */}
        <text x={svgW / 2} y={36} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          P(X=k) = (λ^k · e^(-λ)) / k!
        </text>

        {/* Axes */}
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Bars */}
        {probs.map((p, k) => {
          const barH = maxProb > 0 ? (p / maxProb) * plotH * 0.9 : 0;
          const x = margin.left + k * (plotW / MAX_K) + 1;
          const y = margin.top + plotH - barH;
          const isMode = k === mode;
          const fillClass = isMode
            ? 'fill-amber-400 dark:fill-amber-500'
            : 'fill-blue-400 dark:fill-blue-500';

          return (
            <g key={k}>
              <rect x={x} y={y} width={barW} height={barH} className={fillClass} rx="1" opacity={0.85} />
              {/* k label on x-axis */}
              <text x={x + barW / 2} y={margin.top + plotH + 12} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="8">
                {k}
              </text>
              {/* Probability on top of bar if significant */}
              {p > 0.01 && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">
                  {p.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        {/* Mean marker */}
        {(() => {
          const meanX = margin.left + lambda * (plotW / MAX_K) + barW / 2 + 1;
          return (
            <>
              <line x1={meanX} y1={margin.top} x2={meanX} y2={margin.top + plotH} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x={meanX + 3} y={margin.top + 10} className="fill-red-600 dark:fill-red-400" fontSize="8" fontWeight="bold">
                E(X)=λ={lambda}
              </text>
            </>
          );
        })()}

        {/* Axis labels */}
        <text x={margin.left + plotW / 2} y={svgH - 8} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          k (number of events)
        </text>
        <text x={12} y={margin.top + plotH / 2} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" transform={`rotate(-90, 12, ${margin.top + plotH / 2})`}>
          P(X=k)
        </text>

        {/* Var annotation */}
        <text x={svgW - 10} y={margin.top + 10} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Var(X) = λ = {lambda}
        </text>
      </svg>

      {/* Description */}
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center space-y-1">
        <p>
          <span className="font-semibold">λ = {lambda}:</span> On average {lambda} events per interval. The peak is at k = {mode}.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{CONTEXTS[lambda]}</p>
      </div>
    </div>
  );
}
