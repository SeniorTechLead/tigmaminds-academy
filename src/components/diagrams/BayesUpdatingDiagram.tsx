'use client';
import { useState } from 'react';

/**
 * Bayesian Updating — Watch Beliefs Change.
 * Start at 0.1% prior. Each positive test multiplies odds by LR=99.
 * Each negative test divides odds by LR=99.
 * Students experiment with sequences of tests.
 */

const INITIAL_PRIOR = 0.001;
const LR_POS = 99; // sensitivity / false-positive rate = 0.99/0.01
const LR_NEG = 1 / LR_POS; // (1-sensitivity) / (1-fpr) = 0.01/0.99

function probToOdds(p: number) { return p / (1 - p); }
function oddsToProb(o: number) { return o / (1 + o); }

interface TestResult { type: '+' | '-'; priorP: number; posteriorP: number; odds: number; }

const INACTIVE_BTN = 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600';
const TEXT_MID = 'fill-gray-500 dark:fill-gray-400';
const TEXT_SUBTLE = 'fill-gray-500 dark:fill-gray-500';

export default function BayesUpdatingDiagram() {
  const [tests, setTests] = useState<TestResult[]>([]);

  const currentProb = tests.length > 0 ? tests[tests.length - 1].posteriorP : INITIAL_PRIOR;
  const currentOdds = probToOdds(currentProb);

  const addTest = (type: '+' | '-') => {
    const lr = type === '+' ? LR_POS : LR_NEG;
    const newOdds = currentOdds * lr;
    const newProb = oddsToProb(newOdds);
    setTests(prev => [...prev, {
      type,
      priorP: currentProb,
      posteriorP: newProb,
      odds: newOdds,
    }]);
  };

  const reset = () => setTests([]);

  const W = 460, H = 270;
  const mx = 30, mr = 20;
  const barY = 70, barH = 24;
  const barW = W - mx - mr;

  // Probability bar position (log scale for better visualization)
  const probToX = (p: number) => {
    const logMin = Math.log10(0.0001);
    const logMax = Math.log10(1);
    const logP = Math.log10(Math.max(p, 0.0001));
    return mx + ((logP - logMin) / (logMax - logMin)) * barW;
  };

  const pctStr = (p: number) => {
    if (p < 0.01) return (p * 100).toFixed(2) + '%';
    if (p < 0.1) return (p * 100).toFixed(1) + '%';
    return (p * 100).toFixed(1) + '%';
  };

  const oddsStr = (o: number) => {
    if (o < 0.01) return '1:' + Math.round(1 / o);
    if (o < 1) return '1:' + (1 / o).toFixed(1);
    return o.toFixed(1) + ':1';
  };

  // Log scale tick marks
  const logTicks = [0.01, 0.1, 1, 10, 50, 90, 99, 99.9].map(pct => pct / 100);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Buttons */}
      <div className="flex gap-2 mb-2 justify-center">
        <button
          onClick={() => addTest('+')}
          className="px-3 py-1 rounded text-xs font-medium bg-green-700 text-white hover:bg-green-600 transition-colors"
        >
          + Positive Test
        </button>
        <button
          onClick={() => addTest('-')}
          className="px-3 py-1 rounded text-xs font-medium bg-red-700 text-white hover:bg-red-600 transition-colors"
        >
          - Negative Test
        </button>
        <button
          onClick={reset}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${INACTIVE_BTN}`}
        >
          Reset
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bayesian updating visualization"
      >
        <rect width={W} height={H} rx="8" className="fill-gray-50 dark:fill-slate-900" />

        {/* Title */}
        <text x={W / 2} y={20} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          Bayesian Updating — Watch Beliefs Change
        </text>

        {/* Probability bar background */}
        <rect x={mx} y={barY} width={barW} height={barH} rx="4" className="fill-gray-200 dark:fill-slate-800 stroke-gray-400 dark:stroke-gray-600" strokeWidth="1" />

        {/* Filled portion */}
        <rect x={mx} y={barY} width={Math.max(2, probToX(currentProb) - mx)} height={barH} rx="4" fill="#3b82f6" opacity="0.6" />

        {/* Current position marker */}
        <line x1={probToX(currentProb)} y1={barY - 5} x2={probToX(currentProb)} y2={barY + barH + 5} stroke="#f59e0b" strokeWidth="2" />

        {/* Log scale labels */}
        {logTicks.map(p => (
          <g key={p}>
            <line x1={probToX(p)} y1={barY + barH} x2={probToX(p)} y2={barY + barH + 4} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" />
            <text x={probToX(p)} y={barY + barH + 14} textAnchor="middle" className={TEXT_SUBTLE} fontSize="6" fontFamily="system-ui, sans-serif">
              {(p * 100) < 1 ? (p * 100).toFixed(1) + '%' : (p * 100 >= 99 ? (p * 100).toFixed(1) : Math.round(p * 100)) + '%'}
            </text>
          </g>
        ))}

        {/* Current value label */}
        <text x={probToX(currentProb)} y={barY - 10} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          P(disease) = {pctStr(currentProb)}
        </text>

        {/* Stats panel */}
        <rect x={mx} y={120} width={barW} height={52} rx="4" className="fill-gray-100 dark:fill-slate-950 stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.5" />

        <text x={mx + 10} y={136} className={TEXT_MID} fontSize="8" fontFamily="system-ui, sans-serif">
          Prior: {pctStr(tests.length > 0 ? tests[tests.length - 1].priorP : INITIAL_PRIOR)}
        </text>
        <text x={mx + 130} y={136} className={TEXT_MID} fontSize="8" fontFamily="system-ui, sans-serif">
          Odds: {oddsStr(currentOdds)}
        </text>
        <text x={mx + 260} y={136} className={TEXT_MID} fontSize="8" fontFamily="system-ui, sans-serif">
          Posterior: {pctStr(currentProb)}
        </text>
        <text x={mx + 380} y={136} className={TEXT_MID} fontSize="8" fontFamily="system-ui, sans-serif">
          Tests: {tests.length}
        </text>

        {/* Test sequence */}
        <text x={mx + 10} y={155} className={TEXT_SUBTLE} fontSize="8" fontFamily="system-ui, sans-serif">
          LR: {tests.length > 0 && tests[tests.length - 1].type === '+' ? `\u00d7${LR_POS}` : tests.length > 0 ? `\u00d7${(1 / LR_POS).toFixed(4)}` : '\u2014'}
        </text>
        <text x={mx + 130} y={155} className={TEXT_SUBTLE} fontSize="8" fontFamily="system-ui, sans-serif">
          Sequence: {tests.length === 0 ? '(none)' : tests.map(t => t.type).join(' ')}
        </text>

        {/* History timeline */}
        {tests.length > 0 && (
          <>
            <text x={mx + 10} y={192} className={TEXT_MID} fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
              Update history:
            </text>
            {/* Show initial + each step */}
            {(() => {
              const maxShow = 6;
              const items = [{ label: 'Start', prob: INITIAL_PRIOR }, ...tests.map((t, i) => ({ label: `Test ${i + 1} (${t.type})`, prob: t.posteriorP }))];
              const shown = items.length <= maxShow ? items : [...items.slice(0, 2), { label: '...', prob: -1 }, ...items.slice(-3)];
              const spacing = barW / (shown.length + 1);

              return shown.map((item, i) => {
                const cx = mx + spacing * (i + 1);
                const cy = 220;
                if (item.prob < 0) {
                  return <text key={i} x={cx} y={cy} textAnchor="middle" className={TEXT_SUBTLE} fontSize="9" fontFamily="system-ui, sans-serif">...</text>;
                }
                const isPositive = item.label.includes('+');
                const isNegative = item.label.includes('-');
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy - 5} r="8" fill={isPositive ? '#14532d' : isNegative ? '#7f1d1d' : '#1e3a5f'} stroke={isPositive ? '#22c55e' : isNegative ? '#ef4444' : '#3b82f6'} strokeWidth="1" />
                    <text x={cx} y={cy - 2} textAnchor="middle" fill="white" fontSize="6" fontWeight="600" fontFamily="system-ui, sans-serif">
                      {item.label.includes('Start') ? 'S' : item.label.includes('+') ? '+' : '-'}
                    </text>
                    <text x={cx} y={cy + 14} textAnchor="middle" className={TEXT_MID} fontSize="6" fontFamily="system-ui, sans-serif">
                      {pctStr(item.prob)}
                    </text>
                    {/* Arrow between nodes */}
                    {i < shown.length - 1 && (
                      <line x1={cx + 10} y1={cy - 5} x2={cx + spacing - 10} y2={cy - 5} className="stroke-gray-400 dark:stroke-gray-600" strokeWidth="0.5" markerEnd="url(#bu-arrow)" />
                    )}
                  </g>
                );
              });
            })()}
            <defs>
              <marker id="bu-arrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <polygon points="0 0, 5 2, 0 4" className="fill-gray-400 dark:fill-gray-600" />
              </marker>
            </defs>
          </>
        )}

        {/* Instructions when empty */}
        {tests.length === 0 && (
          <>
            <text x={W / 2} y={200} textAnchor="middle" className={TEXT_MID} fontSize="9" fontFamily="system-ui, sans-serif">
              Start with prior P(disease) = 0.1%. Click &quot;+ Positive Test&quot; to update.
            </text>
            <text x={W / 2} y={215} textAnchor="middle" className={TEXT_SUBTLE} fontSize="8" fontFamily="system-ui, sans-serif">
              Each positive test multiplies odds by {LR_POS} (likelihood ratio).
            </text>
            <text x={W / 2} y={228} textAnchor="middle" className={TEXT_SUBTLE} fontSize="8" fontFamily="system-ui, sans-serif">
              Try: 3 positives? 2 positives + 1 negative? See how beliefs shift!
            </text>
          </>
        )}

        {/* Bottom description */}
        <text x={W / 2} y={H - 10} textAnchor="middle" className={TEXT_SUBTLE} fontSize="8" fontFamily="system-ui, sans-serif">
          Sensitivity = 99%, False positive rate = 1% → Likelihood ratio = 99
        </text>
      </svg>
    </div>
  );
}
