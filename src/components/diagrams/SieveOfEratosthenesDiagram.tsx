import { useState } from 'react';

const PRIMES_TO_SIEVE = [2, 3, 5, 7] as const;
const SIEVE_COLORS: Record<number, string> = {
  2: '#ef4444', // red
  3: '#3b82f6', // blue
  5: '#22c55e', // green
  7: '#f97316', // orange
};

export default function SieveOfEratosthenesDiagram() {
  // Steps: 0 = initial, 1 = cross out 2s, 2 = cross out 3s, 3 = cross out 5s, 4 = cross out 7s, 5 = done (highlight primes)
  const [step, setStep] = useState(0);

  const w = 450, h = 450;
  const gridLeft = 25, gridTop = 50;
  const cellSize = 40;

  // Build sieve state
  const crossed = new Map<number, string>(); // number -> color
  for (let s = 0; s < Math.min(step, 4); s++) {
    const p = PRIMES_TO_SIEVE[s];
    for (let n = p * 2; n <= 100; n += p) {
      if (!crossed.has(n)) {
        crossed.set(n, SIEVE_COLORS[p]);
      }
    }
  }

  const isPrime = (n: number) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const done = step >= 5;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const reset = () => setStep(0);

  const stepLabels = [
    'Start: numbers 1–100',
    'Cross out multiples of 2',
    'Cross out multiples of 3',
    'Cross out multiples of 5',
    'Cross out multiples of 7',
    'Primes revealed!',
  ];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Sieve of Eratosthenes: finding primes 1 to 100">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Title */}
        <text x={w / 2} y={24} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          Sieve of Eratosthenes
        </text>

        {/* Step label */}
        <text x={w / 2} y={42} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">
          {stepLabels[step]}
        </text>

        {/* 10x10 grid */}
        {Array.from({ length: 100 }, (_, i) => {
          const n = i + 1;
          const row = Math.floor(i / 10);
          const col = i % 10;
          const x = gridLeft + col * cellSize;
          const y = gridTop + row * cellSize;

          const isCrossed = crossed.has(n);
          const crossColor = crossed.get(n);
          const isP = isPrime(n);
          const highlight = done && isP;
          const isOne = n === 1;

          let bgClass = 'fill-gray-50 dark:fill-gray-800';
          let textClass = 'fill-gray-700 dark:fill-gray-200';
          let strokeClass = 'stroke-gray-300 dark:stroke-gray-600';

          if (isCrossed) {
            bgClass = 'fill-gray-100 dark:fill-gray-800';
            textClass = 'fill-gray-400 dark:fill-gray-600';
          }
          if (highlight) {
            bgClass = '';
            textClass = 'fill-white dark:fill-white';
            strokeClass = '';
          }
          if (isOne) {
            textClass = 'fill-gray-400 dark:fill-gray-600';
          }

          return (
            <g key={n}>
              <rect
                x={x} y={y} width={cellSize - 1} height={cellSize - 1} rx="4"
                className={highlight ? strokeClass : `${bgClass} ${strokeClass}`}
                fill={highlight ? '#8b5cf6' : undefined}
                stroke={highlight ? '#7c3aed' : undefined}
                strokeWidth="1"
              />
              <text
                x={x + cellSize / 2 - 0.5}
                y={y + cellSize / 2 + 4}
                textAnchor="middle"
                fontSize={n >= 100 ? 10 : 12}
                fontWeight={highlight ? 700 : isCrossed ? 400 : 600}
                className={highlight ? '' : textClass}
                fill={highlight ? 'white' : undefined}
              >
                {n}
              </text>
              {/* Cross-out X */}
              {isCrossed && (
                <>
                  <line x1={x + 4} y1={y + 4} x2={x + cellSize - 5} y2={y + cellSize - 5} stroke={crossColor} strokeWidth="1.5" opacity="0.6" />
                  <line x1={x + cellSize - 5} y1={y + 4} x2={x + 4} y2={y + cellSize - 5} stroke={crossColor} strokeWidth="1.5" opacity="0.6" />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Controls */}
      <div className="mt-2 flex justify-center gap-3">
        <button
          onClick={nextStep}
          disabled={step >= 5}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step >= 5 ? 'Done' : 'Next step'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Legend */}
      {step > 0 && step <= 4 && (
        <div className="mt-2 flex justify-center gap-4 text-xs">
          {PRIMES_TO_SIEVE.slice(0, step).map(p => (
            <span key={p} className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: SIEVE_COLORS[p] }} />
              <span className="text-gray-600 dark:text-gray-400">×{p}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
