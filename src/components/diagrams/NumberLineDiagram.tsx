import { useState } from 'react';

type Inequality = {
  label: string;
  value: number;
  open: boolean;
  direction: 'left' | 'right';
};

const inequalities: Inequality[] = [
  { label: 'x > 3', value: 3, open: true, direction: 'right' },
  { label: 'x ≤ -2', value: -2, open: false, direction: 'left' },
  { label: 'x ≥ 0', value: 0, open: false, direction: 'right' },
  { label: 'x < 5', value: 5, open: true, direction: 'left' },
];

export default function NumberLineDiagram() {
  const [idx, setIdx] = useState(0);
  const ineq = inequalities[idx];

  const w = 500, h = 150;
  const lineY = 70;
  const left = 40, right = 460;
  const rangeMin = -10, rangeMax = 10;
  const totalRange = rangeMax - rangeMin;

  const toX = (n: number) => left + ((n - rangeMin) / totalRange) * (right - left);

  const arrowEndX = ineq.direction === 'right' ? right + 5 : left - 5;
  const pointX = toX(ineq.value);

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl mx-auto" role="img" aria-label={`Number line showing inequality ${ineq.label}`}>
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Number line */}
        <line x1={left - 10} y1={lineY} x2={right + 10} y2={lineY} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        {/* Arrowheads at ends */}
        <polygon points={`${left - 12},${lineY} ${left - 4},${lineY - 4} ${left - 4},${lineY + 4}`} className="fill-gray-500 dark:fill-gray-400" />
        <polygon points={`${right + 12},${lineY} ${right + 4},${lineY - 4} ${right + 4},${lineY + 4}`} className="fill-gray-500 dark:fill-gray-400" />

        {/* Tick marks and labels */}
        {Array.from({ length: totalRange + 1 }, (_, i) => i + rangeMin).map(n => {
          const x = toX(n);
          return (
            <g key={n}>
              <line x1={x} y1={lineY - 6} x2={x} y2={lineY + 6} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth={n === 0 ? 2 : 1} />
              <text x={x} y={lineY + 20} fontSize="10" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">{n}</text>
            </g>
          );
        })}

        {/* Shaded region */}
        <line
          x1={pointX} y1={lineY}
          x2={arrowEndX} y2={lineY}
          stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" opacity="0.6"
        />

        {/* Arrow on the shaded region */}
        {ineq.direction === 'right' ? (
          <polygon points={`${right + 8},${lineY} ${right},${lineY - 5} ${right},${lineY + 5}`} fill="#3b82f6" />
        ) : (
          <polygon points={`${left - 8},${lineY} ${left},${lineY - 5} ${left},${lineY + 5}`} fill="#3b82f6" />
        )}

        {/* Circle at the value (open or closed) */}
        <circle cx={pointX} cy={lineY} r="6"
          fill={ineq.open ? 'white' : '#3b82f6'}
          stroke="#3b82f6" strokeWidth="2.5"
          className={ineq.open ? 'fill-white dark:fill-gray-900' : ''}
        />

        {/* Inequality label */}
        <rect x={185} y={10} width={130} height={30} rx="6" className="fill-blue-50 dark:fill-blue-900/40 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x={250} y={31} textAnchor="middle" fontSize="14" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">{ineq.label}</text>

        {/* Legend: open vs closed */}
        <circle cx={60} cy={130} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" className="fill-white dark:fill-gray-900" />
        <text x={70} y={134} fontSize="10" className="fill-gray-500 dark:fill-gray-400">= not included</text>
        <circle cx={200} cy={130} r="4" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
        <text x={210} y={134} fontSize="10" className="fill-gray-500 dark:fill-gray-400">= included</text>
      </svg>

      {/* Toggle button */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => setIdx((idx + 1) % inequalities.length)}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
        >
          Next inequality
        </button>
      </div>
    </div>
  );
}
