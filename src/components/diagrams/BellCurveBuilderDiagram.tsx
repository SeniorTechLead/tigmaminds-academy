'use client';
import { useState } from 'react';

/**
 * Step-by-step visualization of building the bell curve formula.
 * Each step adds one piece — students see exactly what each part does.
 */

type Step = 'base' | 'centre' | 'width' | 'normalize';

const STEPS: { key: Step; label: string; formula: string; desc: string }[] = [
  { key: 'base', label: '1. Base shape', formula: 'f(x) = e^(−x²)', desc: 'The simplest bell: peaked at 0, drops off fast. At x=0: e⁰=1. At x=2: e⁻⁴≈0.018.' },
  { key: 'centre', label: '2. Centre at μ', formula: 'f(x) = e^(−(x−μ)²)', desc: 'Replace x with (x−μ) to shift the peak. Drag μ to move the bell left or right.' },
  { key: 'width', label: '3. Control width', formula: 'f(x) = e^(−(x−μ)²/(2σ²))', desc: 'Divide exponent by 2σ². Larger σ → wider bell. Drag σ to see.' },
  { key: 'normalize', label: '4. Area = 1', formula: 'f(x) = (1/(σ√(2π))) × e^(−(x−μ)²/(2σ²))', desc: 'Divide by σ√(2π) so the total area under the curve equals 1. Now it\'s a proper probability distribution.' },
];

export default function BellCurveBuilderDiagram() {
  const [step, setStep] = useState<Step>('base');
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  const stepIdx = STEPS.findIndex(s => s.key === step);
  const currentStep = STEPS[stepIdx];

  // Bell curve function based on current step
  const f = (x: number): number => {
    switch (step) {
      case 'base':
        return Math.exp(-(x * x));
      case 'centre':
        return Math.exp(-((x - mu) * (x - mu)));
      case 'width':
        return Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma));
      case 'normalize':
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma));
    }
  };

  // Also show the previous step's curve for comparison
  const fPrev = (x: number): number | null => {
    switch (step) {
      case 'base': return null;
      case 'centre': return Math.exp(-(x * x));
      case 'width': return Math.exp(-((x - mu) * (x - mu)));
      case 'normalize': return Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma));
    }
  };

  const W = 460, H = 220;
  const mx = 35, mr = 20, my = 15, mb = 35;
  const pw = W - mx - mr, ph = H - my - mb;

  const xMin = -5, xMax = 5;
  const sx = (v: number) => mx + ((v - xMin) / (xMax - xMin)) * pw;
  const sy = (v: number, maxY: number) => my + ((maxY - v) / maxY) * ph;

  // Compute max Y for scaling
  const maxY = step === 'normalize' ? Math.max(0.5, f(mu)) * 1.15 : 1.15;

  // Sample points for the curve
  const numPts = 150;
  const points: string[] = [];
  const prevPoints: string[] = [];
  for (let i = 0; i <= numPts; i++) {
    const x = xMin + (i / numPts) * (xMax - xMin);
    const y = f(x);
    points.push(`${sx(x)},${sy(y, maxY)}`);
    const yp = fPrev(x);
    if (yp !== null) prevPoints.push(`${sx(x)},${sy(yp, maxY)}`);
  }

  // Fill area under curve
  const areaPoints = [...points, `${sx(xMax)},${sy(0, maxY)}`, `${sx(xMin)},${sy(0, maxY)}`].join(' ');

  // Axis ticks
  const ticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  // Key values to annotate
  const keyVals = step === 'base' ? [
    { x: 0, label: 'e⁰ = 1' },
    { x: 1, label: 'e⁻¹ ≈ 0.37' },
    { x: 2, label: 'e⁻⁴ ≈ 0.02' },
  ] : [];

  return (
    <div className="space-y-2">
      {/* Step buttons */}
      <div className="flex flex-wrap gap-1">
        {STEPS.map((s, i) => (
          <button key={s.key} onClick={() => setStep(s.key)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${step === s.key ? 'bg-violet-500 text-white' : i <= stepIdx ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Formula display */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg px-3 py-2 text-center">
        <code className="text-sm font-mono font-bold text-violet-700 dark:text-violet-300">{currentStep.formula}</code>
      </div>

      {/* Parameter controls (only when relevant) */}
      {(step === 'centre' || step === 'width' || step === 'normalize') && (
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-500">μ = {mu.toFixed(1)}</label>
            <input type="range" min="-3" max="3" step="0.1" value={mu} onChange={e => setMu(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#8b5cf6' }} />
          </div>
          {(step === 'width' || step === 'normalize') && (
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500">σ = {sigma.toFixed(1)}</label>
              <input type="range" min="0.3" max="3" step="0.1" value={sigma} onChange={e => setSigma(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#8b5cf6' }} />
            </div>
          )}
        </div>
      )}

      {/* SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Grid */}
        {ticks.map(t => <line key={`g${t}`} x1={sx(t)} y1={my} x2={sx(t)} y2={H - mb} stroke="#f1f5f9" strokeWidth="0.5" />)}

        {/* X axis */}
        <line x1={mx} y1={sy(0, maxY)} x2={W - mr} y2={sy(0, maxY)} stroke="#9ca3af" strokeWidth="1" />
        {ticks.map(t => (
          <g key={`t${t}`}>
            <line x1={sx(t)} y1={sy(0, maxY) - 3} x2={sx(t)} y2={sy(0, maxY) + 3} stroke="#9ca3af" strokeWidth="1" />
            <text x={sx(t)} y={sy(0, maxY) + 14} fontSize="8" fill="#9ca3af" textAnchor="middle">
              {step === 'base' ? t : (t === 0 && mu === 0 ? 'μ' : '')}
            </text>
          </g>
        ))}

        {/* μ marker */}
        {step !== 'base' && (
          <>
            <line x1={sx(mu)} y1={my} x2={sx(mu)} y2={sy(0, maxY)} stroke="#dc2626" strokeWidth="1" strokeDasharray="3,3" />
            <text x={sx(mu)} y={sy(0, maxY) + 14} fontSize="9" fill="#dc2626" textAnchor="middle" fontWeight="600">μ={mu.toFixed(1)}</text>
          </>
        )}

        {/* σ markers */}
        {(step === 'width' || step === 'normalize') && (
          <>
            <line x1={sx(mu - sigma)} y1={my} x2={sx(mu - sigma)} y2={sy(0, maxY)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,3" />
            <line x1={sx(mu + sigma)} y1={my} x2={sx(mu + sigma)} y2={sy(0, maxY)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,3" />
            <text x={sx(mu + sigma)} y={H - mb + 26} fontSize="8" fill="#f59e0b" textAnchor="middle">μ+σ</text>
            <text x={sx(mu - sigma)} y={H - mb + 26} fontSize="8" fill="#f59e0b" textAnchor="middle">μ−σ</text>
          </>
        )}

        {/* Previous step curve (faded) */}
        {prevPoints.length > 0 && (
          <polyline points={prevPoints.join(' ')} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" />
        )}

        {/* Filled area under curve */}
        <polygon points={areaPoints} fill="rgba(139,92,246,0.1)" />

        {/* Current curve */}
        <polyline points={points.join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />

        {/* Key value annotations */}
        {keyVals.map((kv, i) => {
          const y = f(kv.x);
          return (
            <g key={i}>
              <circle cx={sx(kv.x)} cy={sy(y, maxY)} r="3.5" fill="#8b5cf6" />
              <text x={sx(kv.x) + 6} y={sy(y, maxY) - 6} fontSize="9" fill="#8b5cf6" fontWeight="600">{kv.label}</text>
            </g>
          );
        })}

        {/* Area = 1 annotation for normalize step */}
        {step === 'normalize' && (
          <text x={sx(mu + 2.5)} y={sy(f(mu) * 0.3, maxY)} fontSize="9" fill="#8b5cf6" fontWeight="600">Area = 1.0</text>
        )}
      </svg>

      {/* Description */}
      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {currentStep.desc}
      </div>
    </div>
  );
}
