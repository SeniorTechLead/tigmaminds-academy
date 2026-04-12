'use client';
import { useState } from 'react';

/**
 * Step-by-step visualization of how the regression slope is computed.
 * Shows each data point's deviation from the mean, the product of deviations,
 * and how they combine into the slope.
 */

const DATA = [
  { x: 180, y: 3.2, label: '2020' },
  { x: 210, y: 3.8, label: '2021' },
  { x: 160, y: 2.9, label: '2022' },
  { x: 195, y: 3.5, label: '2023' },
];

const xBar = DATA.reduce((s, d) => s + d.x, 0) / DATA.length; // 186.25
const yBar = DATA.reduce((s, d) => s + d.y, 0) / DATA.length; // 3.35

type Step = 'means' | 'deviations' | 'products' | 'slope';

const STEPS: { key: Step; label: string }[] = [
  { key: 'means', label: '1. Find means' },
  { key: 'deviations', label: '2. Deviations' },
  { key: 'products', label: '3. Multiply' },
  { key: 'slope', label: '4. The slope' },
];

export default function SlopeDeviationDiagram() {
  const [step, setStep] = useState<Step>('means');

  const W = 380, H = 260;
  const mx = 50, my = 20, mr = 20, mb = 35;
  const pw = W - mx - mr, ph = H - my - mb;

  const xMin = 145, xMax = 225, yMin = 2.5, yMax = 4.2;
  const sx = (v: number) => mx + ((v - xMin) / (xMax - xMin)) * pw;
  const sy = (v: number) => my + ((yMax - v) / (yMax - yMin)) * ph;

  const deviations = DATA.map(d => ({
    ...d,
    dx: d.x - xBar,
    dy: d.y - yBar,
    product: (d.x - xBar) * (d.y - yBar),
    dxSq: (d.x - xBar) ** 2,
  }));

  const sumProducts = deviations.reduce((s, d) => s + d.product, 0);
  const sumDxSq = deviations.reduce((s, d) => s + d.dxSq, 0);
  const slope = sumProducts / sumDxSq;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {STEPS.map(s => (
          <button key={s.key} onClick={() => setStep(s.key)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${step === s.key ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Grid */}
        {[160, 170, 180, 190, 200, 210, 220].map(v => <line key={`gx${v}`} x1={sx(v)} y1={my} x2={sx(v)} y2={H - mb} stroke="#f1f5f9" strokeWidth="0.5" />)}
        {[2.5, 3.0, 3.5, 4.0].map(v => <line key={`gy${v}`} x1={mx} y1={sy(v)} x2={W - mr} y2={sy(v)} stroke="#f1f5f9" strokeWidth="0.5" />)}

        {/* Axes */}
        <line x1={mx} y1={H - mb} x2={W - mr} y2={H - mb} stroke="#9ca3af" strokeWidth="1" />
        <line x1={mx} y1={my} x2={mx} y2={H - mb} stroke="#9ca3af" strokeWidth="1" />
        <text x={W / 2} y={H - 5} fontSize="9" fill="#6b7280" textAnchor="middle">Rainfall (cm)</text>
        <text x={12} y={H / 2} fontSize="9" fill="#6b7280" textAnchor="middle" transform={`rotate(-90, 12, ${H / 2})`}>Yield (t/ha)</text>

        {/* Axis labels */}
        {[160, 180, 200, 220].map(v => <text key={`lx${v}`} x={sx(v)} y={H - mb + 14} fontSize="8" fill="#9ca3af" textAnchor="middle">{v}</text>)}
        {[2.5, 3.0, 3.5, 4.0].map(v => <text key={`ly${v}`} x={mx - 8} y={sy(v) + 3} fontSize="8" fill="#9ca3af" textAnchor="end">{v.toFixed(1)}</text>)}

        {/* Mean lines */}
        {(step === 'means' || step === 'deviations' || step === 'products') && (
          <>
            <line x1={sx(xBar)} y1={my} x2={sx(xBar)} y2={H - mb} stroke="#dc2626" strokeWidth="1" strokeDasharray="4,3" />
            <line x1={mx} y1={sy(yBar)} x2={W - mr} y2={sy(yBar)} stroke="#dc2626" strokeWidth="1" strokeDasharray="4,3" />
            <text x={sx(xBar) + 3} y={my + 12} fontSize="8" fill="#dc2626" fontWeight="600">x̄={xBar.toFixed(1)}</text>
            <text x={W - mr - 3} y={sy(yBar) - 4} fontSize="8" fill="#dc2626" fontWeight="600" textAnchor="end">ȳ={yBar.toFixed(2)}</text>
          </>
        )}

        {/* Quadrant labels when showing deviations */}
        {step === 'deviations' && (
          <>
            <text x={sx(xBar) + 20} y={sy(yBar) - 10} fontSize="8" fill="#22c55e" fontWeight="600">x↑ y↑ (+)</text>
            <text x={sx(xBar) - 60} y={sy(yBar) - 10} fontSize="8" fill="#ef4444" fontWeight="600">x↓ y↑ (−)</text>
            <text x={sx(xBar) - 60} y={sy(yBar) + 18} fontSize="8" fill="#ef4444" fontWeight="600">x↓ y↓ (+)</text>
            <text x={sx(xBar) + 20} y={sy(yBar) + 18} fontSize="8" fill="#22c55e" fontWeight="600">x↑ y↓ (−)</text>
          </>
        )}

        {/* Deviation lines from points to means */}
        {(step === 'deviations' || step === 'products') && deviations.map((d, i) => (
          <g key={`dev${i}`}>
            {/* Horizontal deviation (x - x̄) */}
            <line x1={sx(xBar)} y1={sy(d.y)} x2={sx(d.x)} y2={sy(d.y)} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
            {/* Vertical deviation (y - ȳ) */}
            <line x1={sx(d.x)} y1={sy(yBar)} x2={sx(d.x)} y2={sy(d.y)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
          </g>
        ))}

        {/* Product rectangles (deviation * deviation) */}
        {step === 'products' && deviations.map((d, i) => {
          const positive = d.product > 0;
          return (
            <rect key={`prod${i}`}
              x={Math.min(sx(xBar), sx(d.x))} y={Math.min(sy(yBar), sy(d.y))}
              width={Math.abs(sx(d.x) - sx(xBar))} height={Math.abs(sy(d.y) - sy(yBar))}
              fill={positive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}
              stroke={positive ? '#22c55e' : '#ef4444'} strokeWidth="1" strokeDasharray="2,2"
            />
          );
        })}

        {/* Regression line (slope step) */}
        {step === 'slope' && (
          <line
            x1={sx(xMin)} y1={sy(yBar + slope * (xMin - xBar))}
            x2={sx(xMax)} y2={sy(yBar + slope * (xMax - xBar))}
            stroke="#10b981" strokeWidth="2.5"
          />
        )}

        {/* Data points */}
        {DATA.map((d, i) => (
          <g key={i}>
            <circle cx={sx(d.x)} cy={sy(d.y)} r="5" fill="#1e293b" className="dark:fill-white" />
            <text x={sx(d.x) + 8} y={sy(d.y) - 6} fontSize="8" fill="#6b7280">{d.label}</text>
          </g>
        ))}
      </svg>

      {/* Explanation per step */}
      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {step === 'means' && `Step 1: The red dashed lines show the mean of x (${xBar.toFixed(1)} cm) and y (${yBar.toFixed(2)} t/ha). Every point's deviation is measured from these lines.`}
        {step === 'deviations' && 'Step 2: Blue dashes = how far each x is from x̄. Amber dashes = how far each y is from ȳ. The quadrant labels show: when both deviations have the same sign, the point supports a positive slope.'}
        {step === 'products' && `Step 3: Each rectangle's area = (x deviation) × (y deviation). Green = positive product (same-sign deviations → move together). All 4 are green here → strong positive correlation. Sum of products = ${sumProducts.toFixed(2)}.`}
        {step === 'slope' && `Step 4: Slope = sum of products / sum of x² deviations = ${sumProducts.toFixed(2)} / ${sumDxSq.toFixed(2)} = ${slope.toFixed(4)}. Every extra cm of rainfall adds ${slope.toFixed(4)} tonnes/ha of yield.`}
      </div>
    </div>
  );
}
