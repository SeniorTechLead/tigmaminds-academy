'use client';
import { useState } from 'react';

/**
 * Computing Chi-Squared Step by Step.
 * Observed coin flips vs expected. Adjustable observed values.
 * Steps: Observe → Expected → Difference → Square & divide → Sum = χ².
 */

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: 1, label: '1. Observe' },
  { key: 2, label: '2. Expected' },
  { key: 3, label: '3. Difference' },
  { key: 4, label: '4. Square & Divide' },
  { key: 5, label: '5. Sum = χ²' },
];

const TOTAL = 100;
const EXPECTED = 50;
const CRITICAL = 3.84; // df=1, α=0.05

export default function ChiSquaredStepsDiagram() {
  const [step, setStep] = useState<Step>(1);
  const [heads, setHeads] = useState(60);
  const tails = TOTAL - heads;

  const diffH = heads - EXPECTED;
  const diffT = tails - EXPECTED;
  const chiH = (diffH * diffH) / EXPECTED;
  const chiT = (diffT * diffT) / EXPECTED;
  const chiSq = chiH + chiT;

  const W = 460, H = 260;
  const mx = 50, mr = 50;
  const barW = 60;
  const barMaxH = 100;
  const barBaseY = 170;

  const headsCx = 150, tailsCx = 310;

  const barH = (val: number) => (val / TOTAL) * barMaxH;
  const expH = barH(EXPECTED);

  // Chi-squared distribution curve points (df=1) for step 5
  const chiCurve = () => {
    const pts: string[] = [];
    const curveX = 60, curveW = 340, curveY = 190, curveH = 40;
    const xMax = 10;
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * xMax;
      // df=1 chi-squared pdf: f(x) = (1/(√(2πx))) * e^(-x/2)
      const fx = x < 0.05 ? 0 : (1 / Math.sqrt(2 * Math.PI * x)) * Math.exp(-x / 2);
      const normFx = Math.min(fx, 3) / 3; // normalize
      pts.push(`${curveX + (i / 80) * curveW},${curveY - normFx * curveH}`);
    }
    return { pts: pts.join(' '), curveX, curveW, curveY, curveH, xMax };
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Step buttons */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {STEP_LABELS.map(s => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              step === s.key ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Adjustable observed values */}
      <div className="flex gap-3 mb-2 justify-center items-center text-xs text-slate-300">
        <span>Heads:</span>
        <button onClick={() => setHeads(h => Math.max(0, h - 5))} className="px-2 py-0.5 bg-slate-700 rounded hover:bg-slate-600">-5</button>
        <button onClick={() => setHeads(h => Math.max(0, h - 1))} className="px-2 py-0.5 bg-slate-700 rounded hover:bg-slate-600">-1</button>
        <span className="font-bold text-blue-400 w-8 text-center">{heads}</span>
        <button onClick={() => setHeads(h => Math.min(TOTAL, h + 1))} className="px-2 py-0.5 bg-slate-700 rounded hover:bg-slate-600">+1</button>
        <button onClick={() => setHeads(h => Math.min(TOTAL, h + 5))} className="px-2 py-0.5 bg-slate-700 rounded hover:bg-slate-600">+5</button>
        <span className="text-slate-500">Tails: {tails}</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Chi-squared test step by step"
      >
        <rect width={W} height={H} rx="8" className="fill-slate-900" />

        {/* Steps 1-4: Bar chart area */}
        {step <= 4 && (
          <>
            {/* Baseline */}
            <line x1={mx} y1={barBaseY} x2={W - mr} y2={barBaseY} stroke="#475569" strokeWidth="1" />

            {/* Labels */}
            <text x={headsCx} y={barBaseY + 15} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">Heads</text>
            <text x={tailsCx} y={barBaseY + 15} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">Tails</text>

            {/* Step 1+: Observed bars */}
            <rect x={headsCx - barW / 2} y={barBaseY - barH(heads)} width={barW} height={barH(heads)} fill="#3b82f6" opacity="0.7" rx="2" />
            <text x={headsCx} y={barBaseY - barH(heads) - 5} textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">{heads}</text>

            <rect x={tailsCx - barW / 2} y={barBaseY - barH(tails)} width={barW} height={barH(tails)} fill="#3b82f6" opacity="0.7" rx="2" />
            <text x={tailsCx} y={barBaseY - barH(tails) - 5} textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">{tails}</text>

            {/* Step 2+: Expected dashed lines */}
            {step >= 2 && (
              <>
                <line x1={headsCx - barW / 2 - 5} y1={barBaseY - expH} x2={headsCx + barW / 2 + 5} y2={barBaseY - expH} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
                <text x={headsCx + barW / 2 + 10} y={barBaseY - expH + 4} fill="#f59e0b" fontSize="8" fontFamily="system-ui, sans-serif">E=50</text>

                <line x1={tailsCx - barW / 2 - 5} y1={barBaseY - expH} x2={tailsCx + barW / 2 + 5} y2={barBaseY - expH} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
                <text x={tailsCx + barW / 2 + 10} y={barBaseY - expH + 4} fill="#f59e0b" fontSize="8" fontFamily="system-ui, sans-serif">E=50</text>
              </>
            )}

            {/* Step 3: Difference arrows */}
            {step >= 3 && (
              <>
                {/* Heads difference */}
                {diffH !== 0 && (
                  <>
                    <line x1={headsCx} y1={barBaseY - barH(heads)} x2={headsCx} y2={barBaseY - expH}
                      stroke={diffH > 0 ? '#22c55e' : '#ef4444'} strokeWidth="2" markerEnd="url(#chi-arrow)" />
                    <text x={headsCx - barW / 2 - 10} y={(barBaseY - barH(heads) + barBaseY - expH) / 2 + 4} textAnchor="end"
                      fill={diffH > 0 ? '#22c55e' : '#ef4444'} fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
                      {diffH > 0 ? '+' : ''}{diffH}
                    </text>
                  </>
                )}
                {/* Tails difference */}
                {diffT !== 0 && (
                  <>
                    <line x1={tailsCx} y1={barBaseY - barH(tails)} x2={tailsCx} y2={barBaseY - expH}
                      stroke={diffT > 0 ? '#22c55e' : '#ef4444'} strokeWidth="2" markerEnd="url(#chi-arrow)" />
                    <text x={tailsCx - barW / 2 - 10} y={(barBaseY - barH(tails) + barBaseY - expH) / 2 + 4} textAnchor="end"
                      fill={diffT > 0 ? '#22c55e' : '#ef4444'} fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
                      {diffT > 0 ? '+' : ''}{diffT}
                    </text>
                  </>
                )}
                <defs>
                  <marker id="chi-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
                  </marker>
                </defs>
              </>
            )}

            {/* Step 4: Show computation */}
            {step === 4 && (
              <>
                <text x={headsCx} y={barBaseY + 32} textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="system-ui, sans-serif">
                  ({diffH})²/{EXPECTED} = {chiH.toFixed(1)}
                </text>
                <text x={tailsCx} y={barBaseY + 32} textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="system-ui, sans-serif">
                  ({diffT})²/{EXPECTED} = {chiT.toFixed(1)}
                </text>
              </>
            )}
          </>
        )}

        {/* Step 5: Chi-squared curve */}
        {step === 5 && (() => {
          const { pts, curveX, curveW, curveY, xMax } = chiCurve();
          const critX = curveX + (CRITICAL / xMax) * curveW;
          const chiX = curveX + (Math.min(chiSq, xMax) / xMax) * curveW;
          const reject = chiSq > CRITICAL;
          return (
            <>
              {/* Rejection region shading */}
              <rect x={critX} y={curveY - 45} width={curveX + curveW - critX} height={45} fill="#ef4444" opacity="0.1" />

              {/* Curve */}
              <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="1.5" />

              {/* Baseline */}
              <line x1={curveX} y1={curveY} x2={curveX + curveW} y2={curveY} stroke="#475569" strokeWidth="1" />

              {/* Critical value marker */}
              <line x1={critX} y1={curveY - 45} x2={critX} y2={curveY + 5} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
              <text x={critX} y={curveY + 16} textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="system-ui, sans-serif">
                {CRITICAL}
              </text>
              <text x={critX} y={curveY + 26} textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="system-ui, sans-serif">
                critical
              </text>

              {/* Our chi-squared value */}
              <line x1={chiX} y1={curveY - 50} x2={chiX} y2={curveY} stroke="#f59e0b" strokeWidth="2" />
              <text x={chiX} y={curveY - 55} textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
                χ² = {chiSq.toFixed(1)}
              </text>

              {/* Sum formula */}
              <text x={W / 2} y={35} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">
                χ² = {chiH.toFixed(1)} + {chiT.toFixed(1)} = {chiSq.toFixed(1)}
              </text>

              {/* Verdict */}
              <text x={W / 2} y={55} textAnchor="middle" fill={reject ? '#ef4444' : '#22c55e'} fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">
                {chiSq.toFixed(1)} {reject ? '>' : '≤'} {CRITICAL} → {reject ? 'Reject H₀ — coin likely unfair!' : 'Fail to reject H₀ — consistent with fair coin.'}
              </text>

              {/* Axis labels */}
              {[0, 2, 4, 6, 8, 10].map(v => (
                <text key={v} x={curveX + (v / xMax) * curveW} y={curveY + 16} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">
                  {v}
                </text>
              ))}
            </>
          );
        })()}

        {/* Step descriptions */}
        {step === 1 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">
            We flipped a coin {TOTAL} times: {heads} heads, {tails} tails. Is it fair?
          </text>
        )}
        {step === 2 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">
            If fair, we expect 50 heads, 50 tails. Dashed lines = expected.
          </text>
        )}
        {step === 3 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">
            Differences: how far is each from expected?
          </text>
        )}
        {step === 4 && (
          <text x={W / 2} y={H - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">
            Square each difference and divide by expected: (O−E)²/E
          </text>
        )}
        {step === 5 && (
          <text x={W / 2} y={H - 8} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui, sans-serif">
            df=1, α=0.05. Adjust heads with +/- buttons to explore!
          </text>
        )}
      </svg>
    </div>
  );
}
