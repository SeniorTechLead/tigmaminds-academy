'use client';
import { useState } from 'react';

/**
 * Computing Standard Deviation Step by Step.
 * Data = [2,4,4,4,5,5,7,9], mean = 5.
 * Five steps: Mean → Distances → Square → Variance → Std Dev.
 */

const DATA = [2, 4, 4, 4, 5, 5, 7, 9];
const MEAN = 5;
const DISTS = DATA.map(d => d - MEAN); // [-3,-1,-1,-1,0,0,2,4]
const SQUARES = DISTS.map(d => d * d);  // [9,1,1,1,0,0,4,16]
const SUM_SQ = SQUARES.reduce((a, b) => a + b, 0); // 32
const VARIANCE = SUM_SQ / DATA.length; // 4
const STD_DEV = Math.sqrt(VARIANCE); // 2

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: 1, label: '1. Mean' },
  { key: 2, label: '2. Distances' },
  { key: 3, label: '3. Square' },
  { key: 4, label: '4. Variance' },
  { key: 5, label: '5. Std Dev' },
];

export default function StdDevStepsDiagram() {
  const [step, setStep] = useState<Step>(1);

  const W = 460, H = 280;
  const mx = 30, mr = 20, my = 10, mb = 30;
  const pw = W - mx - mr;

  // Number line from 0 to 10
  const nlMin = 0, nlMax = 10;
  const nlY = 50; // number line y position
  const sx = (v: number) => mx + ((v - nlMin) / (nlMax - nlMin)) * pw;

  // Unique positions for data points (stack duplicates)
  const pointPositions = DATA.map((d, i) => {
    const countBefore = DATA.slice(0, i).filter(v => v === d).length;
    return { value: d, x: sx(d), y: nlY - 8 - countBefore * 12 };
  });

  const distColor = (d: number) => d < 0 ? '#ef4444' : d > 0 ? '#22c55e' : '#94a3b8';

  // Square sizes for step 3 (scaled down for visual)
  const sqScale = 4;
  const sqBaseY = 150;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Step buttons */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {STEP_LABELS.map(s => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              step === s.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Standard deviation step-by-step computation"
      >
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        {/* Number line */}
        <line x1={sx(nlMin)} y1={nlY} x2={sx(nlMax)} y2={nlY} stroke="#475569" strokeWidth="1.5" />
        {Array.from({ length: nlMax - nlMin + 1 }, (_, i) => nlMin + i).map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={nlY - 3} x2={sx(v)} y2={nlY + 3} stroke="#64748b" strokeWidth="1" />
            <text x={sx(v)} y={nlY + 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">{v}</text>
          </g>
        ))}

        {/* Data points always shown */}
        {pointPositions.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" />
        ))}

        {/* Step 1+: Mean line */}
        {step >= 1 && (
          <>
            <line x1={sx(MEAN)} y1={nlY - 45} x2={sx(MEAN)} y2={nlY + 3} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            <text x={sx(MEAN)} y={nlY - 48} textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
              μ = {MEAN}
            </text>
          </>
        )}

        {/* Step 2: Distance arrows */}
        {step === 2 && (
          <>
            {pointPositions.map((p, i) => {
              const d = DISTS[i];
              if (d === 0) return (
                <text key={i} x={p.x} y={p.y - 10} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="system-ui, sans-serif">0</text>
              );
              const meanX = sx(MEAN);
              const arrowY = nlY + 25 + i * 10;
              return (
                <g key={i}>
                  <line x1={p.x} y1={arrowY} x2={meanX} y2={arrowY} stroke={distColor(d)} strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <text x={(p.x + meanX) / 2} y={arrowY - 3} textAnchor="middle" fill={distColor(d)} fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
                    {d > 0 ? '+' : ''}{d}
                  </text>
                </g>
              );
            })}
            <text x={W / 2} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
              Sum of distances: ({DISTS.join(' + ')}) = 0 — they cancel!
            </text>
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
              </marker>
            </defs>
          </>
        )}

        {/* Step 3: Squares */}
        {step === 3 && (
          <>
            {DATA.map((d, i) => {
              const sq = SQUARES[i];
              if (sq === 0) return null;
              const side = Math.sqrt(sq) * sqScale;
              const xPos = mx + 8 + i * 50;
              return (
                <g key={i}>
                  <rect x={xPos} y={sqBaseY - side} width={side} height={side} fill={distColor(DISTS[i])} opacity="0.3" stroke={distColor(DISTS[i])} strokeWidth="1" rx="1" />
                  <text x={xPos + side / 2} y={sqBaseY + 12} textAnchor="middle" fill={distColor(DISTS[i])} fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
                    {DISTS[i]}² = {sq}
                  </text>
                  <text x={xPos + side / 2} y={sqBaseY - side - 4} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui, sans-serif">
                    val={d}
                  </text>
                </g>
              );
            })}
            <text x={W / 2} y={H - 18} textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
              Sum of squares: {SQUARES.filter(s => s > 0).join(' + ')} = {SUM_SQ}
            </text>
          </>
        )}

        {/* Step 4: Variance — single average square */}
        {step === 4 && (
          <>
            <rect x={W / 2 - 40} y={100} width={40} height={40} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" rx="2" />
            <text x={W / 2 - 20} y={125} textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">4</text>
            <text x={W / 2 + 60} y={110} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
              Variance = {SUM_SQ}/{DATA.length}
            </text>
            <text x={W / 2 + 60} y={125} textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
              σ² = {VARIANCE}
            </text>
            <text x={W / 2} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
              The average squared distance from the mean is {VARIANCE}.
            </text>
          </>
        )}

        {/* Step 5: Std dev — band on number line */}
        {step === 5 && (
          <>
            {/* ±2 band */}
            <rect x={sx(MEAN - STD_DEV)} y={nlY - 45} width={sx(MEAN + STD_DEV) - sx(MEAN - STD_DEV)} height={55} fill="#3b82f6" opacity="0.15" rx="3" />
            <line x1={sx(MEAN - STD_DEV)} y1={nlY - 45} x2={sx(MEAN - STD_DEV)} y2={nlY + 5} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
            <line x1={sx(MEAN + STD_DEV)} y1={nlY - 45} x2={sx(MEAN + STD_DEV)} y2={nlY + 5} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
            <text x={sx(MEAN - STD_DEV)} y={nlY + 28} textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">μ−σ = {MEAN - STD_DEV}</text>
            <text x={sx(MEAN + STD_DEV)} y={nlY + 28} textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">μ+σ = {MEAN + STD_DEV}</text>

            {/* Formula */}
            <text x={W / 2} y={130} textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
              σ = √{VARIANCE} = {STD_DEV}
            </text>

            {/* Count inside */}
            {(() => {
              const inside = DATA.filter(d => d >= MEAN - STD_DEV && d <= MEAN + STD_DEV).length;
              return (
                <text x={W / 2} y={150} textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="system-ui, sans-serif">
                  {inside} of {DATA.length} points ({Math.round(100 * inside / DATA.length)}%) fall within ±σ of the mean
                </text>
              );
            })()}

            <text x={W / 2} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
              Standard deviation tells you the typical spread around the mean.
            </text>
          </>
        )}

        {/* Step 1 description */}
        {step === 1 && (
          <text x={W / 2} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
            Data: [{DATA.join(', ')}] — Mean = ({DATA.join('+')})/8 = 40/8 = 5
          </text>
        )}
      </svg>
    </div>
  );
}
