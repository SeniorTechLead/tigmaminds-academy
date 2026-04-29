'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * Animated Huber M-estimator diagram.
 * Shows data points on a number line, an estimate (vertical line) that
 * iteratively converges toward the robust centre, with weights shown
 * per data point. Points beyond 1.345σ get down-weighted.
 */

const DATA = [11, 12, 13, 13, 14, 14, 15, 100];
const K = 1.345; // Huber's threshold

function huberWeight(residual: number, scale: number): number {
  const z = Math.abs(residual) / Math.max(scale, 0.01);
  return z <= K ? 1.0 : K / z;
}

function mad(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const med = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const devs = sorted.map(v => Math.abs(v - med)).sort((a, b) => a - b);
  const medDev = devs.length % 2 === 1 ? devs[Math.floor(devs.length / 2)] : (devs[devs.length / 2 - 1] + devs[devs.length / 2]) / 2;
  return medDev * 1.4826;
}

function runIteration(data: number[], currentEstimate: number, scale: number): { estimate: number; weights: number[] } {
  const weights = data.map(v => huberWeight(v - currentEstimate, scale));
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const estimate = data.reduce((s, v, i) => s + weights[i] * v, 0) / totalWeight;
  return { estimate, weights };
}

export default function HuberEstimatorDiagram() {
  const [iteration, setIteration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState<{ estimate: number; weights: number[] }[]>([]);

  // Compute all iterations up front
  useEffect(() => {
    const scale = mad(DATA);
    const iters: { estimate: number; weights: number[] }[] = [];
    // Start from the mean
    let est = DATA.reduce((s, v) => s + v, 0) / DATA.length; // 24.0
    iters.push({ estimate: est, weights: DATA.map(() => 1) });

    for (let i = 0; i < 8; i++) {
      const result = runIteration(DATA, est, scale);
      iters.push(result);
      if (Math.abs(result.estimate - est) < 0.001) break;
      est = result.estimate;
    }
    setHistory(iters);
  }, []);

  // Animation
  useEffect(() => {
    if (!playing || iteration >= history.length - 1) {
      if (playing && iteration >= history.length - 1) setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setIteration(i => i + 1), 800);
    return () => clearTimeout(timer);
  }, [playing, iteration, history.length]);

  const step = history[iteration] || { estimate: 24, weights: DATA.map(() => 1) };
  const finalStep = history[history.length - 1];

  const W = 460, H = 190;
  const mx = 30, mr = 25;
  const plotW = W - mx - mr;
  const cy = 100;

  const dMin = 5, dMax = 105;
  const sx = (v: number) => mx + ((v - dMin) / (dMax - dMin)) * plotW;

  const reset = () => { setIteration(0); setPlaying(false); };
  const stepForward = () => { if (iteration < history.length - 1) setIteration(i => i + 1); };

  return (
    <div className="space-y-2">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={() => { reset(); setPlaying(true); }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          {playing ? 'Restart' : 'Animate'}
        </button>
        <button onClick={stepForward} disabled={iteration >= history.length - 1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors">
          Step
        </button>
        <button onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Reset
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          Iteration {iteration}/{history.length - 1}
        </span>
      </div>

      {/* SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Number line */}
        <line x1={mx} y1={cy + 30} x2={W - mr} y2={cy + 30} stroke="#d1d5db" strokeWidth="1" />
        {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(t => (
          <g key={t}>
            <line x1={sx(t)} y1={cy + 26} x2={sx(t)} y2={cy + 34} stroke="#9ca3af" strokeWidth="1" />
            <text x={sx(t)} y={cy + 44} fontSize="8" fill="#9ca3af" textAnchor="middle">{t}</text>
          </g>
        ))}

        {/* Huber threshold zone */}
        {(() => {
          const scale = mad(DATA);
          const lo = step.estimate - K * scale;
          const hi = step.estimate + K * scale;
          return (
            <rect
              x={sx(Math.max(lo, dMin))} y={cy - 25}
              width={sx(Math.min(hi, dMax)) - sx(Math.max(lo, dMin))} height={50}
              fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,3" rx="4"
            />
          );
        })()}

        {/* Data points with weight-based sizing */}
        {DATA.map((v, i) => {
          const w = step.weights[i];
          const r = 3 + w * 5; // full weight = 8px, zero weight ≈ 3px
          const color = w >= 0.99 ? '#3b82f6' : w > 0.1 ? '#f59e0b' : '#ef4444';
          return (
            <g key={i}>
              <circle cx={sx(v)} cy={cy} r={r} fill={color} fillOpacity={0.3 + w * 0.7} stroke={color} strokeWidth="1.5" />
              <text x={sx(v)} y={cy + 20} fontSize="8" fill={color} textAnchor="middle" fontWeight="600">
                {w.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Current estimate line */}
        <line x1={sx(step.estimate)} y1={cy - 30} x2={sx(step.estimate)} y2={cy + 25} stroke="#dc2626" strokeWidth="2.5" />
        <text x={sx(step.estimate)} y={cy - 34} fontSize="10" fill="#dc2626" textAnchor="middle" fontWeight="700">
          {step.estimate.toFixed(2)}
        </text>

        {/* Mean line (initial) for reference */}
        {iteration === 0 && (
          <text x={sx(24)} y={18} fontSize="9" fill="#dc2626" textAnchor="middle">← starts at mean (24.0)</text>
        )}

        {/* Final convergence label */}
        {iteration === history.length - 1 && finalStep && (
          <text x={sx(finalStep.estimate)} y={18} fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="600">
            Converged at {finalStep.estimate.toFixed(2)}
          </text>
        )}

      </svg>

      {/* Legend — outside SVG to avoid clutter */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Full weight</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Down-weighted</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-50 inline-block" /> Near-zero</span>
      </div>

      {/* Explanation */}
      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {iteration === 0 && 'Starting from the mean (24.0) — heavily pulled by the outlier at 100.'}
        {iteration > 0 && iteration < history.length - 1 && `Iteration ${iteration}: estimate = ${step.estimate.toFixed(2)}. The outlier at 100 has weight ${step.weights[7].toFixed(3)} — it's being ignored.`}
        {iteration === history.length - 1 && finalStep && `Converged at ${finalStep.estimate.toFixed(2)} after ${history.length - 1} iterations. The outlier's weight dropped to ${finalStep.weights[7].toFixed(4)} — effectively zero influence.`}
      </div>
    </div>
  );
}
