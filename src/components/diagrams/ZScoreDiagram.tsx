'use client';
import { useState, useCallback } from 'react';

const DATASETS = [
  { label: 'Test scores (μ=70, σ=10)', mu: 70, sigma: 10, unit: '' },
  { label: 'Heights (μ=170cm, σ=7)', mu: 170, sigma: 7, unit: 'cm' },
  { label: 'Temperatures (μ=25°C, σ=5)', mu: 25, sigma: 5, unit: '°C' },
];

/** Standard normal CDF approximation (Abramowitz & Stegun) */
function normalCDF(z: number): number {
  if (z < -6) return 0;
  if (z > 6) return 1;
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

/** Gaussian PDF (unnormalized for drawing) */
function gaussPDF(z: number): number {
  return Math.exp(-0.5 * z * z);
}

const BAND_COLORS = [
  { range: [-3, -2], fill: '#93c5fd', dark: '#1e40af' },  // blue-300 / blue-800
  { range: [-2, -1], fill: '#60a5fa', dark: '#2563eb' },  // blue-400 / blue-600
  { range: [-1, 1], fill: '#3b82f6', dark: '#3b82f6' },   // blue-500
  { range: [1, 2], fill: '#60a5fa', dark: '#2563eb' },
  { range: [2, 3], fill: '#93c5fd', dark: '#1e40af' },
];

export default function ZScoreDiagram() {
  const [dsIdx, setDsIdx] = useState(0);
  const [zValue, setZValue] = useState(0);
  const ds = DATASETS[dsIdx];

  const W = 400, H = 260;
  const padL = 40, padR = 20, padT = 35, padB = 55;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const zMin = -3.5, zMax = 3.5;
  const zToX = (z: number) => padL + ((z - zMin) / (zMax - zMin)) * plotW;
  const yBase = padT + plotH;
  const yScale = plotH * 0.92;

  // Build bell curve path
  const curvePoints: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const z = zMin + (i / 120) * (zMax - zMin);
    curvePoints.push([zToX(z), yBase - gaussPDF(z) * yScale]);
  }
  const curvePath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  // Build shaded band paths
  const bandPaths = BAND_COLORS.map(({ range }) => {
    const pts: string[] = [];
    const steps = 40;
    const lo = Math.max(range[0], zMin), hi = Math.min(range[1], zMax);
    pts.push(`M${zToX(lo).toFixed(1)},${yBase}`);
    for (let i = 0; i <= steps; i++) {
      const z = lo + (i / steps) * (hi - lo);
      pts.push(`L${zToX(z).toFixed(1)},${(yBase - gaussPDF(z) * yScale).toFixed(1)}`);
    }
    pts.push(`L${zToX(hi).toFixed(1)},${yBase}`);
    pts.push('Z');
    return pts.join(' ');
  });

  const xVal = ds.mu + zValue * ds.sigma;
  const pctBelow = (normalCDF(zValue) * 100).toFixed(1);
  const markerX = zToX(zValue);
  const markerY = yBase - gaussPDF(zValue) * yScale;

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const z = zMin + ((svgX - padL) / plotW) * (zMax - zMin);
    setZValue(Math.max(-3.5, Math.min(3.5, Math.round(z * 20) / 20)));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Dataset buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {DATASETS.map((d, i) => (
          <button key={i} onClick={() => { setDsIdx(i); setZValue(0); }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${i === dsIdx ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {d.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto cursor-pointer" role="img"
        aria-label="Z-score interactive bell curve diagram" onClick={handleSvgClick}>
        <rect width={W} height={H} className="fill-white dark:fill-gray-900" rx="8" />
        <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          Z-Score: How Many Standard Deviations from the Mean?
        </text>

        {/* Colored bands */}
        {bandPaths.map((d, i) => (
          <path key={i} d={d} fill={BAND_COLORS[i].fill} opacity="0.35" />
        ))}

        {/* Bell curve outline */}
        <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* X-axis */}
        <line x1={padL} y1={yBase} x2={padL + plotW} y2={yBase} stroke="#9ca3af" strokeWidth="1" />

        {/* Sigma tick marks and labels */}
        {[-3, -2, -1, 0, 1, 2, 3].map(s => {
          const x = zToX(s);
          const rawVal = ds.mu + s * ds.sigma;
          return (
            <g key={s}>
              <line x1={x} y1={yBase} x2={x} y2={yBase + 5} stroke="#6b7280" strokeWidth="1" />
              <text x={x} y={yBase + 16} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">
                {s === 0 ? 'μ' : `${s > 0 ? '+' : ''}${s}σ`}
              </text>
              <text x={x} y={yBase + 27} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-gray-500">
                {rawVal}{ds.unit}
              </text>
            </g>
          );
        })}

        {/* Mean vertical line */}
        <line x1={zToX(0)} y1={padT + 8} x2={zToX(0)} y2={yBase} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x={zToX(0) + 4} y={padT + 16} fontSize="9" fontWeight="600" className="fill-red-500 dark:fill-red-400">μ={ds.mu}</text>

        {/* Draggable marker */}
        <line x1={markerX} y1={markerY} x2={markerX} y2={yBase} stroke="#f59e0b" strokeWidth="2" />
        <circle cx={markerX} cy={markerY} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
        <circle cx={markerX} cy={yBase} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" />

        {/* Z-score readout */}
        <rect x={W - 155} y={padT + 2} width="148" height="52" rx="5" className="fill-gray-50 dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
        <text x={W - 81} y={padT + 18} textAnchor="middle" fontSize="10" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          x = {xVal.toFixed(1)}{ds.unit}
        </text>
        <text x={W - 81} y={padT + 32} textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          z = ({xVal.toFixed(1)} − {ds.mu}) / {ds.sigma} = {zValue.toFixed(2)}
        </text>
        <text x={W - 81} y={padT + 46} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
          {pctBelow}% of data below
        </text>
      </svg>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Click anywhere on the curve to move the marker</p>

      <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
        {Math.abs(zValue) < 0.1
          ? `The marker is at the mean (μ = ${ds.mu}${ds.unit}). A z-score of 0 means the value is exactly average.`
          : zValue > 0
            ? `This value is ${Math.abs(zValue).toFixed(2)} standard deviations above the mean. About ${pctBelow}% of all values fall below ${xVal.toFixed(1)}${ds.unit}.`
            : `This value is ${Math.abs(zValue).toFixed(2)} standard deviations below the mean. Only ${pctBelow}% of all values fall below ${xVal.toFixed(1)}${ds.unit}.`
        }
      </div>
    </div>
  );
}
