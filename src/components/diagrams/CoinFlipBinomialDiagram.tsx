'use client';
import { useState } from 'react';

/**
 * Step-by-step coin flip visualization for the binomial formula.
 * Shows 3 flips, lists all arrangements for k heads, highlights probability.
 */

type TargetHeads = 0 | 1 | 2 | 3;

// All possible outcomes for 3 flips
const ALL_OUTCOMES: string[] = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'];

function countHeads(s: string): number {
  return [...s].filter(c => c === 'H').length;
}

function comb(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return Math.round(r);
}

export default function CoinFlipBinomialDiagram() {
  const [target, setTarget] = useState<TargetHeads>(2);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const matching = ALL_OUTCOMES.filter(o => countHeads(o) === target);
  const ways = matching.length; // = C(3, target)
  const pOne = Math.pow(0.5, 3); // 0.125
  const pTotal = ways * pOne;

  const W = 420, H = 200;

  return (
    <div className="space-y-2">
      {/* Target selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">How many heads?</span>
        {([0, 1, 2, 3] as TargetHeads[]).map(k => (
          <button key={k} onClick={() => { setTarget(k); setStep(1); }}
            className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${target === k ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {k}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        {([1, 2, 3] as const).map(s => (
          <button key={s} onClick={() => setStep(s)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${step === s ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
            Step {s}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* All 8 outcomes as coin rows */}
        {ALL_OUTCOMES.map((outcome, i) => {
          const heads = countHeads(outcome);
          const isMatch = heads === target;
          const row = i;
          const y = 18 + row * 22;

          return (
            <g key={outcome} opacity={step >= 1 ? (isMatch ? 1 : 0.25) : 1}>
              {/* Three coins */}
              {[...outcome].map((c, j) => {
                const cx = 30 + j * 28;
                const isH = c === 'H';
                return (
                  <g key={j}>
                    <circle cx={cx} cy={y} r="9"
                      fill={isH ? '#fbbf24' : '#e5e7eb'}
                      stroke={isH ? '#d97706' : '#9ca3af'}
                      strokeWidth="1.5"
                    />
                    <text x={cx} y={y + 3.5} fontSize="8" textAnchor="middle" fontWeight="700"
                      fill={isH ? '#92400e' : '#6b7280'}>
                      {c}
                    </text>
                  </g>
                );
              })}

              {/* Outcome label */}
              <text x={115} y={y + 4} fontSize="10" fill={isMatch ? '#1e293b' : '#d1d5db'} className={isMatch ? 'dark:fill-white' : 'dark:fill-gray-600'} fontWeight={isMatch ? '600' : '400'}>
                {outcome}
              </text>

              {/* Step 2: probability of this sequence */}
              {step >= 2 && isMatch && (
                <text x={170} y={y + 4} fontSize="9" fill="#3b82f6" fontWeight="600">
                  0.5 × 0.5 × 0.5 = 0.125
                </text>
              )}

              {/* Match indicator */}
              {isMatch && (
                <text x={W - 30} y={y + 4} fontSize="10" fill="#22c55e" textAnchor="middle" fontWeight="700">✓</text>
              )}
            </g>
          );
        })}

        {/* Step summaries on the right */}
        <g>
          {/* Step 1 summary */}
          {step >= 1 && (
            <g>
              <rect x={320} y={10} width={90} height={28} rx="6" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1" />
              <text x={365} y={22} fontSize="8" fill="#f59e0b" textAnchor="middle" fontWeight="600">Step 1: Count</text>
              <text x={365} y={33} fontSize="11" fill="#f59e0b" textAnchor="middle" fontWeight="700">C(3,{target}) = {ways}</text>
            </g>
          )}

          {/* Step 2 summary */}
          {step >= 2 && (
            <g>
              <rect x={320} y={48} width={90} height={28} rx="6" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1" />
              <text x={365} y={60} fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="600">Step 2: Each</text>
              <text x={365} y={71} fontSize="11" fill="#3b82f6" textAnchor="middle" fontWeight="700">p = 0.125</text>
            </g>
          )}

          {/* Step 3 summary */}
          {step >= 3 && (
            <g>
              <rect x={320} y={86} width={90} height={38} rx="6" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5" />
              <text x={365} y={98} fontSize="8" fill="#22c55e" textAnchor="middle" fontWeight="600">Step 3: Combine</text>
              <text x={365} y={111} fontSize="9" fill="#22c55e" textAnchor="middle">{ways} × 0.125</text>
              <text x={365} y={121} fontSize="12" fill="#22c55e" textAnchor="middle" fontWeight="700">= {pTotal.toFixed(3)}</text>
            </g>
          )}

          {/* Formula */}
          {step >= 3 && (
            <g>
              <rect x={320} y={135} width={90} height={48} rx="6" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeWidth="1" />
              <text x={365} y={150} fontSize="7" fill="#8b5cf6" textAnchor="middle" fontWeight="600">FORMULA</text>
              <text x={365} y={162} fontSize="8" fill="#8b5cf6" textAnchor="middle">P(X={target}) = C(3,{target})</text>
              <text x={365} y={174} fontSize="8" fill="#8b5cf6" textAnchor="middle">× 0.5^{target} × 0.5^{3 - target}</text>
            </g>
          )}
        </g>
      </svg>

      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {step === 1 && `Step 1: There are ${ways} way${ways !== 1 ? 's' : ''} to get exactly ${target} head${target !== 1 ? 's' : ''} in 3 flips. That's C(3,${target}) = ${ways}.`}
        {step === 2 && `Step 2: Each specific sequence has probability 0.5 × 0.5 × 0.5 = 0.125. That's p^${target} × (1−p)^${3 - target}.`}
        {step === 3 && `Step 3: ${ways} ways × 0.125 each = ${pTotal.toFixed(3)}. This is the binomial formula: P(X=${target}) = C(3,${target}) × 0.5^${target} × 0.5^${3 - target} = ${pTotal.toFixed(3)}.`}
      </div>
    </div>
  );
}
