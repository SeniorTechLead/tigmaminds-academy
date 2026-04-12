'use client';
import { useState, useMemo } from 'react';

// Deterministic data: x from 150-200, y = 0.8x + noise
function generateData() {
  const seed = [3, 7, 1, 9, 4, 6, 2, 8, 5, 0, 7, 3, 9, 1, 6, 4, 8, 2, 5, 0];
  return seed.map((s, i) => {
    const x = 150 + (i / 19) * 50 + (s - 4.5) * 3;
    const y = 0.8 * x + (s - 4.5) * 8 + 10;
    return { x, y };
  });
}

const STEPS = [
  { label: '1. Raw data', short: 'Raw data' },
  { label: '2. Center', short: 'Center' },
  { label: '3. Covariance', short: 'Covariance' },
  { label: '4. Eigenvectors', short: 'Eigenvectors' },
  { label: '5. Project', short: 'Project' },
];

const DESCRIPTIONS: Record<number, string> = {
  0: 'Raw scatter plot of elephant height vs weight. Notice the strong upward correlation — taller elephants tend to weigh more.',
  1: 'Subtract the mean from every point so the cloud is centered at the origin. Faded dots show old positions.',
  2: 'The covariance matrix summarizes how height and weight vary together. The ellipse shows the data spread.',
  3: 'Eigenvectors of the covariance matrix point along the directions of maximum and minimum variance.',
  4: 'Project every point onto PC1. The 1D number line below keeps 78% of the information — most of the spread is preserved.',
};

export default function PCAStepsDiagram() {
  const [step, setStep] = useState(0);
  const raw = useMemo(generateData, []);

  const meanX = raw.reduce((s, p) => s + p.x, 0) / raw.length;
  const meanY = raw.reduce((s, p) => s + p.y, 0) / raw.length;

  const centered = raw.map(p => ({ x: p.x - meanX, y: p.y - meanY }));

  // Covariance matrix
  const n = raw.length;
  const covXX = centered.reduce((s, p) => s + p.x * p.x, 0) / (n - 1);
  const covXY = centered.reduce((s, p) => s + p.x * p.y, 0) / (n - 1);
  const covYY = centered.reduce((s, p) => s + p.y * p.y, 0) / (n - 1);

  // Eigenvectors of 2x2 symmetric matrix
  const trace = covXX + covYY;
  const det = covXX * covYY - covXY * covXY;
  const lambda1 = trace / 2 + Math.sqrt(trace * trace / 4 - det);
  const lambda2 = trace / 2 - Math.sqrt(trace * trace / 4 - det);
  const totalVar = lambda1 + lambda2;
  const pct1 = Math.round((lambda1 / totalVar) * 100);
  const pct2 = 100 - pct1;

  // PC1 direction
  let ev1x = covXY;
  let ev1y = lambda1 - covXX;
  const len1 = Math.sqrt(ev1x * ev1x + ev1y * ev1y);
  ev1x /= len1; ev1y /= len1;
  // PC2 perpendicular
  const ev2x = -ev1y;
  const ev2y = ev1x;

  // Project onto PC1
  const projections = centered.map(p => p.x * ev1x + p.y * ev1y);

  // SVG coordinate mapping
  const svgW = 460;
  const svgH = 300;
  const plotL = 50, plotR = step >= 4 ? 310 : 410, plotT = 40, plotB = step >= 4 ? 210 : 260;
  const plotW = plotR - plotL;
  const plotH = plotB - plotT;

  // Data range for current step
  const dataPoints = step >= 1 ? centered : raw;
  const xMin = Math.min(...dataPoints.map(p => p.x));
  const xMax = Math.max(...dataPoints.map(p => p.x));
  const yMin = Math.min(...dataPoints.map(p => p.y));
  const yMax = Math.max(...dataPoints.map(p => p.y));
  const xPad = (xMax - xMin) * 0.15 || 10;
  const yPad = (yMax - yMin) * 0.15 || 10;
  const xRange = [xMin - xPad, xMax + xPad];
  const yRange = [yMin - yPad, yMax + yPad];

  const toSvgX = (v: number) => plotL + ((v - xRange[0]) / (xRange[1] - xRange[0])) * plotW;
  const toSvgY = (v: number) => plotB - ((v - yRange[0]) / (yRange[1] - yRange[0])) * plotH;

  // Variance bar
  const varianceExplained = step <= 2 ? 0 : step === 3 ? 0 : pct1;
  const showVarianceBar = step >= 4;

  // Ellipse params for step 3
  const ellipseA = Math.sqrt(lambda1) * 2.5;
  const ellipseB = Math.sqrt(lambda2) * 2.5;
  const ellipseAngle = Math.atan2(ev1y, ev1x) * (180 / Math.PI);

  // Projection number line (step 5)
  const projMin = Math.min(...projections);
  const projMax = Math.max(...projections);
  const projPad = (projMax - projMin) * 0.1;
  const projRange = [projMin - projPad, projMax + projPad];
  const nlY = 245;
  const nlL = 60, nlR = 300;
  const toProjX = (v: number) => nlL + ((v - projRange[0]) / (projRange[1] - projRange[0])) * (nlR - nlL);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Step buttons */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              step === i
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg h-auto" role="img" aria-label="PCA step-by-step diagram">
        <rect width={svgW} height={svgH} rx="8" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x={svgW / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          PCA Step by Step — {STEPS[step].short}
        </text>

        {/* Axes */}
        <line x1={plotL} y1={plotB} x2={plotR} y2={plotB} stroke="#94a3b8" strokeWidth="1" />
        <line x1={plotL} y1={plotT} x2={plotL} y2={plotB} stroke="#94a3b8" strokeWidth="1" />
        <text x={plotL + plotW / 2} y={plotB + 16} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">
          {step === 0 ? 'Height (cm)' : 'Centered height'}
        </text>
        <text x={plotL - 8} y={plotT + plotH / 2} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" transform={`rotate(-90, ${plotL - 8}, ${plotT + plotH / 2})`}>
          {step === 0 ? 'Weight (kg)' : 'Centered weight'}
        </text>

        {/* Origin crosshair for centered steps */}
        {step >= 1 && (
          <g>
            <line x1={toSvgX(0) - 8} y1={toSvgY(0)} x2={toSvgX(0) + 8} y2={toSvgY(0)} stroke="#ef4444" strokeWidth="1.5" />
            <line x1={toSvgX(0)} y1={toSvgY(0) - 8} x2={toSvgX(0)} y2={toSvgY(0) + 8} stroke="#ef4444" strokeWidth="1.5" />
          </g>
        )}

        {/* Faded old positions in step 1 */}
        {step === 1 && raw.map((p, i) => {
          // Map raw coords into centered range for display
          const cx = toSvgX(p.x - meanX) + (meanX - meanX); // same as centered
          // We show them at "where they would be if we pretended they were in the raw range"
          // Actually just show small ghost dots at a slight offset to hint at the shift
          const rawInCentered = { x: p.x - meanX + (meanX - meanX), y: p.y - meanY };
          // Show ghost at a fixed offset representing the mean shift direction
          const ghostX = toSvgX(rawInCentered.x) + 12;
          const ghostY = toSvgY(rawInCentered.y) - 10;
          return <circle key={`ghost-${i}`} cx={ghostX} cy={ghostY} r="2.5" fill="#a5b4fc" opacity="0.3" />;
        })}

        {/* Covariance ellipse (step 3+) */}
        {step >= 2 && (
          <ellipse
            cx={toSvgX(0)}
            cy={toSvgY(0)}
            rx={(ellipseA / (xRange[1] - xRange[0])) * plotW}
            ry={(ellipseB / (yRange[1] - yRange[0])) * plotH}
            transform={`rotate(${-ellipseAngle}, ${toSvgX(0)}, ${toSvgY(0)})`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.2"
            strokeDasharray={step === 2 ? '4 2' : 'none'}
            opacity={step >= 3 ? 0.5 : 0.7}
          />
        )}

        {/* Eigenvector arrows (step 3, 4) */}
        {step >= 3 && (
          <g>
            {/* PC1 */}
            <line
              x1={toSvgX(-ev1x * ellipseA)}
              y1={toSvgY(-ev1y * ellipseA)}
              x2={toSvgX(ev1x * ellipseA)}
              y2={toSvgY(ev1y * ellipseA)}
              stroke="#ef4444"
              strokeWidth="2"
              markerEnd="url(#arrowRed)"
            />
            <text
              x={toSvgX(ev1x * ellipseA * 0.7) + 6}
              y={toSvgY(ev1y * ellipseA * 0.7) - 6}
              fontSize="8"
              fontWeight="600"
              fill="#ef4444"
            >
              PC1 ({pct1}%)
            </text>
            {/* PC2 */}
            <line
              x1={toSvgX(-ev2x * ellipseB)}
              y1={toSvgY(-ev2y * ellipseB)}
              x2={toSvgX(ev2x * ellipseB)}
              y2={toSvgY(ev2y * ellipseB)}
              stroke="#3b82f6"
              strokeWidth="1.5"
              markerEnd="url(#arrowBlue)"
            />
            <text
              x={toSvgX(ev2x * ellipseB * 0.6) + 6}
              y={toSvgY(ev2y * ellipseB * 0.6) - 4}
              fontSize="8"
              fontWeight="600"
              fill="#3b82f6"
            >
              PC2 ({pct2}%)
            </text>
          </g>
        )}

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={toSvgX(p.x)}
            cy={toSvgY(p.y)}
            r="3.5"
            fill={step >= 4 ? '#818cf8' : '#6366f1'}
            opacity={step >= 4 ? 0.4 : 0.85}
            stroke="#fff"
            strokeWidth="0.5"
          />
        ))}

        {/* Projection lines from points to PC1 axis (step 5) */}
        {step >= 4 && centered.map((p, i) => {
          const proj = projections[i];
          const projPtX = ev1x * proj;
          const projPtY = ev1y * proj;
          return (
            <line
              key={`proj-${i}`}
              x1={toSvgX(p.x)}
              y1={toSvgY(p.y)}
              x2={toSvgX(projPtX)}
              y2={toSvgY(projPtY)}
              stroke="#c084fc"
              strokeWidth="0.7"
              strokeDasharray="2 1"
              opacity="0.5"
            />
          );
        })}

        {/* 1D number line (step 5) */}
        {step >= 4 && (
          <g>
            <text x={nlL + (nlR - nlL) / 2} y={nlY - 12} textAnchor="middle" fontSize="9" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
              Projection onto PC1
            </text>
            <line x1={nlL} y1={nlY} x2={nlR} y2={nlY} stroke="#94a3b8" strokeWidth="1.5" />
            {/* Tick marks */}
            {[0, 0.25, 0.5, 0.75, 1].map(f => {
              const tx = nlL + f * (nlR - nlL);
              const val = projRange[0] + f * (projRange[1] - projRange[0]);
              return (
                <g key={f}>
                  <line x1={tx} y1={nlY - 3} x2={tx} y2={nlY + 3} stroke="#94a3b8" strokeWidth="1" />
                  <text x={tx} y={nlY + 12} textAnchor="middle" fontSize="6" className="fill-gray-400 dark:fill-slate-500">{val.toFixed(0)}</text>
                </g>
              );
            })}
            {/* Projected points */}
            {projections.map((v, i) => (
              <circle key={`nl-${i}`} cx={toProjX(v)} cy={nlY} r="3" fill="#6366f1" opacity="0.8" stroke="#fff" strokeWidth="0.5" />
            ))}
          </g>
        )}

        {/* Covariance matrix display (step 2) */}
        {step === 2 && (
          <g transform={`translate(${plotR + 16}, ${plotT + 10})`}>
            <text x="0" y="0" fontSize="8" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Covariance Matrix</text>
            {/* 2x2 grid */}
            <rect x="0" y="6" width="36" height="18" rx="2" fill="#c7d2fe" />
            <rect x="36" y="6" width="36" height="18" rx="2" fill="#e0e7ff" />
            <rect x="0" y="24" width="36" height="18" rx="2" fill="#e0e7ff" />
            <rect x="36" y="24" width="36" height="18" rx="2" fill="#c7d2fe" />
            <text x="18" y="19" textAnchor="middle" fontSize="7" fontWeight="600" fill="#4338ca">{covXX.toFixed(0)}</text>
            <text x="54" y="19" textAnchor="middle" fontSize="7" fill="#4338ca">{covXY.toFixed(0)}</text>
            <text x="18" y="37" textAnchor="middle" fontSize="7" fill="#4338ca">{covXY.toFixed(0)}</text>
            <text x="54" y="37" textAnchor="middle" fontSize="7" fontWeight="600" fill="#4338ca">{covYY.toFixed(0)}</text>
            {/* Labels */}
            <text x="18" y="52" textAnchor="middle" fontSize="6" className="fill-gray-400 dark:fill-slate-500">σ²ₓ</text>
            <text x="54" y="52" textAnchor="middle" fontSize="6" className="fill-gray-400 dark:fill-slate-500">σ²ᵧ</text>
          </g>
        )}

        {/* Variance bar (step 5) */}
        {showVarianceBar && (
          <g transform={`translate(${plotR + 16}, ${plotT + 10})`}>
            <text x="0" y="0" fontSize="8" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Variance captured</text>
            <rect x="0" y="6" width="100" height="12" rx="3" fill="#e2e8f0" />
            <rect x="0" y="6" width={varianceExplained} height="12" rx="3" fill="#6366f1" />
            <text x="50" y="16" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">{varianceExplained}%</text>
            <text x="0" y="30" fontSize="7" className="fill-gray-500 dark:fill-slate-400">PC1 keeps {pct1}% of info</text>
            <text x="0" y="40" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Reduced 2D → 1D!</text>
          </g>
        )}

        {/* Arrow markers */}
        <defs>
          <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
          </marker>
          <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 text-center px-2">
        {DESCRIPTIONS[step]}
      </p>
    </div>
  );
}
