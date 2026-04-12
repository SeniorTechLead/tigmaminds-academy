'use client';
import { useState } from 'react';

/** Gaussian PDF (unnormalized) */
function gaussPDF(z: number): number {
  return Math.exp(-0.5 * z * z);
}

const MU = 70, SIGMA = 10;

const RULES = [
  { id: 1, label: '68% (1σ)', pct: '68%', sigmas: 1, color: '#3b82f6', darkColor: '#60a5fa', bgOpacity: 0.4 },
  { id: 2, label: '95% (2σ)', pct: '95%', sigmas: 2, color: '#8b5cf6', darkColor: '#a78bfa', bgOpacity: 0.3 },
  { id: 3, label: '99.7% (3σ)', pct: '99.7%', sigmas: 3, color: '#10b981', darkColor: '#34d399', bgOpacity: 0.25 },
];

export default function StdDevBellCurveDiagram() {
  const [active, setActive] = useState<number>(1);
  const rule = RULES.find(r => r.id === active)!;

  const W = 400, H = 260;
  const padL = 35, padR = 20, padT = 35, padB = 60;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const zMin = -4, zMax = 4;
  const zToX = (z: number) => padL + ((z - zMin) / (zMax - zMin)) * plotW;
  const yBase = padT + plotH;
  const yScale = plotH * 0.92;

  // Bell curve path
  const curvePoints: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const z = zMin + (i / 120) * (zMax - zMin);
    curvePoints.push([zToX(z), yBase - gaussPDF(z) * yScale]);
  }
  const curvePath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  // Shaded region path
  const shadedPath = (() => {
    const lo = -rule.sigmas, hi = rule.sigmas;
    const pts: string[] = [`M${zToX(lo).toFixed(1)},${yBase}`];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const z = lo + (i / steps) * (hi - lo);
      pts.push(`L${zToX(z).toFixed(1)},${(yBase - gaussPDF(z) * yScale).toFixed(1)}`);
    }
    pts.push(`L${zToX(hi).toFixed(1)},${yBase}`);
    pts.push('Z');
    return pts.join(' ');
  })();

  const lo = MU - rule.sigmas * SIGMA;
  const hi = MU + rule.sigmas * SIGMA;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Toggle buttons */}
      <div className="flex justify-center gap-2 mb-2">
        {RULES.map(r => (
          <button key={r.id} onClick={() => setActive(r.id)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${r.id === active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" role="img"
        aria-label={`Bell curve showing the ${rule.pct} rule`}>
        <rect width={W} height={H} className="fill-white dark:fill-gray-900" rx="8" />
        <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          The 68-95-99.7 Rule
        </text>

        {/* Shaded area */}
        <path d={shadedPath} fill={rule.color} opacity={rule.bgOpacity} />

        {/* Bell curve outline */}
        <path d={curvePath} fill="none" stroke="#6b7280" strokeWidth="1.5" />

        {/* X-axis */}
        <line x1={padL} y1={yBase} x2={padL + plotW} y2={yBase} stroke="#9ca3af" strokeWidth="1" />

        {/* Sigma tick marks */}
        {[-3, -2, -1, 0, 1, 2, 3].map(s => {
          const x = zToX(s);
          const val = MU + s * SIGMA;
          const isActive = Math.abs(s) <= rule.sigmas && s !== 0;
          return (
            <g key={s}>
              <line x1={x} y1={yBase} x2={x} y2={yBase + 5} stroke="#6b7280" strokeWidth="1" />
              <text x={x} y={yBase + 16} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">
                {s === 0 ? 'μ' : `${s > 0 ? '+' : ''}${s}σ`}
              </text>
              <text x={x} y={yBase + 28} textAnchor="middle" fontSize="8"
                className={isActive || s === 0 ? 'fill-gray-700 dark:fill-gray-200 font-semibold' : 'fill-gray-400 dark:fill-gray-500'}>
                {val}
              </text>
            </g>
          );
        })}

        {/* Boundary lines */}
        {[-rule.sigmas, rule.sigmas].map(s => {
          const x = zToX(s);
          return (
            <line key={s} x1={x} y1={yBase - gaussPDF(s) * yScale} x2={x} y2={yBase}
              stroke={rule.color} strokeWidth="2" strokeDasharray="4 2" />
          );
        })}

        {/* Mean line */}
        <line x1={zToX(0)} y1={padT + 5} x2={zToX(0)} y2={yBase} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Percentage label in center */}
        <text x={zToX(0)} y={yBase - plotH * 0.35} textAnchor="middle" fontSize="20" fontWeight="800" fill={rule.color}>
          {rule.pct}
        </text>

        {/* Range bracket */}
        <line x1={zToX(-rule.sigmas)} y1={yBase + 38} x2={zToX(rule.sigmas)} y2={yBase + 38}
          stroke={rule.color} strokeWidth="1.5" />
        <line x1={zToX(-rule.sigmas)} y1={yBase + 34} x2={zToX(-rule.sigmas)} y2={yBase + 42}
          stroke={rule.color} strokeWidth="1.5" />
        <line x1={zToX(rule.sigmas)} y1={yBase + 34} x2={zToX(rule.sigmas)} y2={yBase + 42}
          stroke={rule.color} strokeWidth="1.5" />
        <text x={zToX(0)} y={yBase + 52} textAnchor="middle" fontSize="9" fontWeight="600" fill={rule.color}>
          {lo} to {hi}
        </text>
      </svg>

      <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
        <strong>{rule.pct}</strong> of test scores fall between <strong>{lo}</strong> and <strong>{hi}</strong> (within {rule.sigmas} standard deviation{rule.sigmas > 1 ? 's' : ''} of the mean).
        {rule.sigmas === 1 && ' This is the most commonly referenced range — roughly two-thirds of all data.'}
        {rule.sigmas === 2 && ' Almost all typical values fall in this range — only 5% are outside it.'}
        {rule.sigmas === 3 && ' Nearly everything is here — values outside 3σ are extremely rare (0.3%).'}
      </div>
    </div>
  );
}
