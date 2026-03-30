import { useState, useEffect } from 'react';

export default function HalfLifeDiagram() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Chart dimensions
  const chartL = 80, chartR = 420, chartT = 40, chartB = 240;
  const chartW = chartR - chartL, chartH = chartB - chartT;

  // Decay curve points: y = 100 * (0.5)^(x/1)
  const curvePoints: [number, number][] = [];
  for (let i = 0; i <= 50; i++) {
    const t = (i / 50) * 5; // 0 to 5 half-lives
    const pct = 100 * Math.pow(0.5, t);
    const px = chartL + (t / 5) * chartW;
    const py = chartB - (pct / 100) * chartH;
    curvePoints.push([px, py]);
  }
  const curvePath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ');

  // Key points
  const keyPoints = [
    { halfLives: 0, pct: 100 },
    { halfLives: 1, pct: 50 },
    { halfLives: 2, pct: 25 },
    { halfLives: 3, pct: 12.5 },
    { halfLives: 4, pct: 6.25 },
  ];

  // Animated dot position
  const animT = (progress / 100) * 5;
  const animPct = 100 * Math.pow(0.5, animT);
  const dotX = chartL + (animT / 5) * chartW;
  const dotY = chartB - (animPct / 100) * chartH;

  return (
    <div className="my-4">
      <svg viewBox="0 0 472 315" className="w-full max-w-lg mx-auto" role="img" aria-label="Half-life exponential decay curve">
        {/* Title */}
        <text x="250" y="25" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          Radioactive Decay (Half-Life)
        </text>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map(t => {
          const x = chartL + (t / 5) * chartW;
          return <line key={`gx-${t}`} x1={x} y1={chartT} x2={x} y2={chartB} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />;
        })}
        {[0, 25, 50, 75, 100].map(pct => {
          const y = chartB - (pct / 100) * chartH;
          return <line key={`gy-${pct}`} x1={chartL} y1={y} x2={chartR} y2={y} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />;
        })}

        {/* Axes */}
        <line x1={chartL} y1={chartB} x2={chartR} y2={chartB} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={chartL} y1={chartT} x2={chartL} y2={chartB} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* X-axis labels */}
        {[0, 1, 2, 3, 4, 5].map(t => (
          <text key={`xl-${t}`} x={chartL + (t / 5) * chartW} y={chartB + 16} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{t}</text>
        ))}
        <text x={(chartL + chartR) / 2} y={chartB + 30} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11">Half-lives</text>

        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map(pct => (
          <text key={`yl-${pct}`} x={chartL - 8} y={chartB - (pct / 100) * chartH + 4} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{pct}%</text>
        ))}
        <text x={30} y={(chartT + chartB) / 2} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11"
          transform={`rotate(-90, 30, ${(chartT + chartB) / 2})`}>Remaining</text>

        {/* Decay curve */}
        <path d={curvePath} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />

        {/* Shaded area under curve */}
        <path d={`${curvePath} L ${chartR},${chartB} L ${chartL},${chartB} Z`} className="fill-blue-200 dark:fill-blue-900/30" opacity="0.3" />

        {/* Key points */}
        {keyPoints.map((kp, i) => {
          const px = chartL + (kp.halfLives / 5) * chartW;
          const py = chartB - (kp.pct / 100) * chartH;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r="4" className="fill-blue-600 dark:fill-blue-400" />
              {/* Dashed lines to axes */}
              <line x1={px} y1={py} x2={px} y2={chartB} className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="0.8" strokeDasharray="3,3" />
              <line x1={chartL} y1={py} x2={px} y2={py} className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="0.8" strokeDasharray="3,3" />
              {/* Value label */}
              {i > 0 && (
                <text x={px + 8} y={py - 6} className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="600">{kp.pct}%</text>
              )}
            </g>
          );
        })}

        {/* Animated dot */}
        <circle cx={dotX} cy={dotY} r="6" className="fill-red-500 dark:fill-red-400" opacity="0.9">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Legend */}
        <text x="300" y="55" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Each half-life: half remains
        </text>
        <text x="300" y="70" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          100 → 50 → 25 → 12.5 → ...
        </text>
      </svg>
    </div>
  );
}
