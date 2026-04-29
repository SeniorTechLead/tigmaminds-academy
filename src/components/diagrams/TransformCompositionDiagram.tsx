'use client';
import { useState } from 'react';

/**
 * Shows how composing two transformations works visually.
 * Displays a point being transformed step-by-step, and the combined single-step result.
 */

type Scenario = 'uniform' | 'nonuniform';

const SCENARIOS: Record<Scenario, {
  label: string;
  R: [number, number, number, number];
  S: [number, number, number, number];
  rLabel: string;
  sLabel: string;
  desc: string;
}> = {
  uniform: {
    label: 'Uniform scale ×2',
    R: [0, -1, 1, 0],
    S: [2, 0, 0, 2],
    rLabel: 'Rotate 90°',
    sLabel: 'Scale ×2',
    desc: 'Same result either way — uniform scaling commutes with rotation',
  },
  nonuniform: {
    label: 'Non-uniform scale (3×, 1×)',
    R: [0, -1, 1, 0],
    S: [3, 0, 0, 1],
    rLabel: 'Rotate 90°',
    sLabel: 'Scale x×3',
    desc: 'Different results — order matters!',
  },
};

const SHAPE = [[0, 0], [1, 0], [1, 1], [0, 1]] as const;

function applyMat(m: [number, number, number, number], x: number, y: number): [number, number] {
  return [m[0] * x + m[1] * y, m[2] * x + m[3] * y];
}

function mulMat(a: [number, number, number, number], b: [number, number, number, number]): [number, number, number, number] {
  return [
    a[0] * b[0] + a[1] * b[2],
    a[0] * b[1] + a[1] * b[3],
    a[2] * b[0] + a[3] * b[2],
    a[2] * b[1] + a[3] * b[3],
  ];
}

function fmtMat(m: [number, number, number, number]) {
  const f = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(1);
  return `[${f(m[0])} ${f(m[1])}; ${f(m[2])} ${f(m[3])}]`;
}

export default function TransformCompositionDiagram() {
  const [scenario, setScenario] = useState<Scenario>('uniform');
  const [order, setOrder] = useState<'rs' | 'sr'>('sr'); // sr = rotate first then scale

  const s = SCENARIOS[scenario];
  // "sr" means S applied after R: combined = S × R (S is outer)
  // "rs" means R applied after S: combined = R × S (R is outer)
  const first = order === 'sr' ? s.R : s.S;
  const second = order === 'sr' ? s.S : s.R;
  const firstLabel = order === 'sr' ? s.rLabel : s.sLabel;
  const secondLabel = order === 'sr' ? s.sLabel : s.rLabel;
  const combined = mulMat(second, first);

  // Transform the shape at each stage
  const original = SHAPE.map(([x, y]) => [x, y] as [number, number]);
  const afterFirst = original.map(([x, y]) => applyMat(first, x, y));
  const afterBoth = original.map(([x, y]) => applyMat(combined, x, y));

  // Also transform the point (1,0) for annotation
  const pt0: [number, number] = [1, 0];
  const pt1 = applyMat(first, pt0[0], pt0[1]);
  const pt2 = applyMat(combined, pt0[0], pt0[1]);

  // SVG coordinate system
  const scale = 40;
  const cx = 200, cy = 160; // center
  const sx = (v: number) => cx + v * scale;
  const sy = (v: number) => cy - v * scale;
  const pts = (arr: [number, number][]) => arr.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as Scenario[]).map((k) => (
          <button
            key={k}
            onClick={() => setScenario(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              scenario === k
                ? 'bg-violet-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {SCENARIOS[k].label}
          </button>
        ))}
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => setOrder('sr')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            order === 'sr'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Rotate → Scale
        </button>
        <button
          onClick={() => setOrder('rs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            order === 'rs'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Scale → Rotate
        </button>
      </div>

      {/* Diagram */}
      <svg viewBox="0 0 400 320" className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Grid */}
        {[-3, -2, -1, 0, 1, 2, 3, 4].map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1={sy(-2)} x2={sx(v)} y2={sy(4)} stroke={v === 0 ? '#9ca3af' : '#e5e7eb'} strokeWidth={v === 0 ? 1 : 0.5} />
            <line x1={sx(-3)} y1={sy(v)} x2={sx(4)} y2={sy(v)} stroke={v === 0 ? '#9ca3af' : '#e5e7eb'} strokeWidth={v === 0 ? 1 : 0.5} />
          </g>
        ))}

        {/* Original shape — dashed blue */}
        <polygon points={pts(original)} fill="rgba(59,130,246,0.08)" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* After first transform — dashed amber */}
        <polygon points={pts(afterFirst)} fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* After both — solid green */}
        <polygon points={pts(afterBoth)} fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="2" />

        {/* Point trajectory: pt0 → pt1 → pt2 */}
        <defs>
          <marker id="arrowTraj" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4" fill="#6b7280" />
          </marker>
        </defs>

        {/* Arrow from pt0 to pt1 */}
        <line x1={sx(pt0[0])} y1={sy(pt0[1])} x2={sx(pt1[0])} y2={sy(pt1[1])} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowTraj)" strokeDasharray="4,3" />
        {/* Arrow from pt1 to pt2 */}
        <line x1={sx(pt1[0])} y1={sy(pt1[1])} x2={sx(pt2[0])} y2={sy(pt2[1])} stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowTraj)" />

        {/* Point labels */}
        <circle cx={sx(pt0[0])} cy={sy(pt0[1])} r="4" fill="#3b82f6" />
        <text x={sx(pt0[0]) + 6} y={sy(pt0[1]) - 6} fontSize="11" fill="#3b82f6" fontWeight="600">(1, 0)</text>

        <circle cx={sx(pt1[0])} cy={sy(pt1[1])} r="4" fill="#f59e0b" />
        <text x={sx(pt1[0]) + 6} y={sy(pt1[1]) - 6} fontSize="11" fill="#f59e0b" fontWeight="600">({pt1[0]}, {pt1[1]})</text>

        <circle cx={sx(pt2[0])} cy={sy(pt2[1])} r="4" fill="#10b981" />
        <text x={sx(pt2[0]) + 6} y={sy(pt2[1]) - 6} fontSize="11" fill="#10b981" fontWeight="600">({pt2[0]}, {pt2[1]})</text>

        {/* Legend */}
        <rect x="8" y="8" width="12" height="12" fill="rgba(59,130,246,0.15)" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2,2" />
        <text x="24" y="18" fontSize="10" fill="#6b7280">Original</text>

        <rect x="8" y="26" width="12" height="12" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
        <text x="24" y="36" fontSize="10" fill="#6b7280">After {firstLabel}</text>

        <rect x="8" y="44" width="12" height="12" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
        <text x="24" y="54" fontSize="10" fill="#6b7280">After {secondLabel}</text>
      </svg>

      {/* Summary */}
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div><span className="font-semibold">Order:</span> {firstLabel} → {secondLabel}</div>
        <div><span className="font-semibold">Combined matrix:</span> {fmtMat(combined)}</div>
        <div><span className="font-semibold">(1, 0) →</span> ({pt1[0]}, {pt1[1]}) → <span className="font-semibold text-emerald-600 dark:text-emerald-400">({pt2[0]}, {pt2[1]})</span></div>
        <div className="text-gray-500 dark:text-gray-500 italic">{s.desc}</div>
      </div>
    </div>
  );
}
