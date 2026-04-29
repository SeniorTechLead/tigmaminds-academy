import { useState } from 'react';

const DARK_BG = 'bg-white dark:bg-gray-900';
const LABEL = 'text-[10px] font-bold uppercase tracking-wider';
const SVG_BG = 'fill-gray-50 dark:fill-gray-900';
const PANEL_BG = 'bg-gray-100 dark:bg-gray-800';
const TEXT_MUTED = 'text-gray-500 dark:text-gray-500';
const TEXT_SECONDARY = 'text-gray-600 dark:text-gray-400';
const TEXT_BODY = 'text-gray-700 dark:text-gray-300';

/* ════════════════════════════════════════════
   1. ExpressionEvaluator — plug in x, see the result
   ════════════════════════════════════════════ */
export function ExpressionEvaluator() {
  const [x, setX] = useState(5);
  const expressions = [
    { expr: '3x + 2', fn: (x: number) => 3 * x + 2 },
    { expr: '2x² - 1', fn: (x: number) => 2 * x * x - 1 },
    { expr: 'x/2 + 10', fn: (x: number) => x / 2 + 10 },
  ];

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} ${TEXT_MUTED}`}>Expression Evaluator</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={`text-sm ${TEXT_SECONDARY}`}>x =</span>
        <input type="range" min={-10} max={10} value={x} onChange={e => setX(+e.target.value)}
          className="flex-1 accent-emerald-500" />
        <span className="text-lg font-mono font-bold text-emerald-400 w-8 text-center">{x}</span>
      </div>

      <div className="space-y-2">
        {expressions.map(({ expr, fn }) => (
          <div key={expr} className={`flex items-center justify-between px-3 py-2 rounded-lg ${PANEL_BG}`}>
            <span className={`font-mono text-sm ${TEXT_BODY}`}>{expr}</span>
            <span className={`text-sm ${TEXT_MUTED}`}>=</span>
            <span className="font-mono text-lg font-bold text-amber-400">{fn(x)}</span>
          </div>
        ))}
      </div>
      <p className={`text-xs ${TEXT_MUTED} mt-3 text-center`}>Drag the slider to change x — watch all expressions update</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. EquationBalanceScale — step through solving
   ════════════════════════════════════════════ */
export function EquationBalanceScale() {
  const steps = [
    { left: '2x + 3', right: '11', action: 'Start: solve for x', highlight: '' },
    { left: '2x + 3 - 3', right: '11 - 3', action: 'Subtract 3 from both sides', highlight: '- 3' },
    { left: '2x', right: '8', action: 'Simplify', highlight: '' },
    { left: '2x ÷ 2', right: '8 ÷ 2', action: 'Divide both sides by 2', highlight: '÷ 2' },
    { left: 'x', right: '4', action: 'Solution!', highlight: '' },
    { left: '2(4) + 3', right: '11', action: 'Check: 8 + 3 = 11 ✓', highlight: 'check' },
  ];

  const [step, setStep] = useState(0);
  const s = steps[step];

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} ${TEXT_MUTED}`}>Solving: 2x + 3 = 11</span>
        <div className="flex gap-1">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className={`px-2 py-1 rounded text-xs ${PANEL_BG} ${TEXT_SECONDARY} hover:text-gray-900 dark:hover:text-white disabled:opacity-30`}>&#x2190;</button>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
            className={`px-2 py-1 rounded text-xs ${PANEL_BG} ${TEXT_SECONDARY} hover:text-gray-900 dark:hover:text-white disabled:opacity-30`}>&#x2192;</button>
        </div>
      </div>

      {/* Balance scale visualization */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className={`flex-1 text-center px-4 py-3 rounded-lg border-2 font-mono text-lg transition-all duration-300 ${
          s.highlight === 'check' ? 'border-emerald-500 bg-emerald-100/40 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
          : step === steps.length - 2 ? 'border-amber-500 bg-amber-100/40 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
          : 'border-blue-500 bg-blue-100/40 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        }`}>
          {s.left}
        </div>
        <span className={`text-xl ${TEXT_MUTED} font-bold`}>=</span>
        <div className={`flex-1 text-center px-4 py-3 rounded-lg border-2 font-mono text-lg transition-all duration-300 ${
          s.highlight === 'check' ? 'border-emerald-500 bg-emerald-100/40 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
          : step === steps.length - 2 ? 'border-amber-500 bg-amber-100/40 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
          : 'border-blue-500 bg-blue-100/40 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        }`}>
          {s.right}
        </div>
      </div>

      <p className={`text-sm text-center font-medium ${
        s.highlight === 'check' ? 'text-emerald-600 dark:text-emerald-400' : `${TEXT_BODY}`
      }`}>{s.action}</p>

      {/* Step dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-emerald-400 scale-125' : i < step ? 'bg-emerald-700' : 'bg-gray-300 dark:bg-gray-700'}`} />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. InequalityNumberLine — interactive number line
   ════════════════════════════════════════════ */
export function InequalityNumberLine() {
  const [value, setValue] = useState(3);
  const [operator, setOperator] = useState<'<' | '>' | '≤' | '≥'>('<');

  const W = 300, PAD = 20;
  const scale = (n: number) => PAD + ((n + 10) / 20) * (W - PAD * 2);
  const threshold = value;

  const isFilled = operator === '≤' || operator === '≥';
  const isRight = operator === '>' || operator === '≥';

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} ${TEXT_MUTED}`}>Inequality Visualizer</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className={`text-sm ${TEXT_SECONDARY}`}>x</span>
        <select value={operator} onChange={e => setOperator(e.target.value as any)}
          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white">
          <option value="<">&lt;</option>
          <option value=">">&gt;</option>
          <option value="≤">≤</option>
          <option value="≥">≥</option>
        </select>
        <input type="range" min={-8} max={8} value={value} onChange={e => setValue(+e.target.value)}
          className="flex-1 accent-amber-500" />
        <span className="font-mono text-amber-400 font-bold w-6 text-center">{value}</span>
      </div>

      <svg viewBox={`0 0 ${W} 50`} className="w-full">
        <rect width={W} height={50} rx={4} className={SVG_BG} />

        {/* Number line */}
        <line x1={PAD} y1={25} x2={W - PAD} y2={25} className="stroke-gray-300 dark:stroke-gray-700" strokeWidth={2} />

        {/* Tick marks */}
        {Array.from({ length: 21 }, (_, i) => i - 10).map(n => (
          <g key={n}>
            <line x1={scale(n)} y1={20} x2={scale(n)} y2={30} className="stroke-gray-400 dark:stroke-gray-600" strokeWidth={1} />
            {n % 2 === 0 && <text x={scale(n)} y={42} textAnchor="middle" className="fill-gray-500 dark:fill-gray-500" fontSize={8}>{n}</text>}
          </g>
        ))}

        {/* Shaded region */}
        {isRight ? (
          <rect x={scale(threshold)} y={18} width={W - PAD - scale(threshold)} height={14} fill="#f59e0b" opacity={0.2} rx={2} />
        ) : (
          <rect x={PAD} y={18} width={scale(threshold) - PAD} height={14} fill="#f59e0b" opacity={0.2} rx={2} />
        )}

        {/* Arrow */}
        {isRight ? (
          <line x1={scale(threshold) + 5} y1={25} x2={W - PAD - 5} y2={25} stroke="#f59e0b" strokeWidth={3} markerEnd="url(#arrow)" />
        ) : (
          <line x1={scale(threshold) - 5} y1={25} x2={PAD + 5} y2={25} stroke="#f59e0b" strokeWidth={3} markerEnd="url(#arrow)" />
        )}

        {/* Threshold point */}
        <circle cx={scale(threshold)} cy={25} r={5} fill={isFilled ? '#f59e0b' : 'currentColor'} className={isFilled ? '' : 'text-gray-50 dark:text-gray-900'} stroke="#f59e0b" strokeWidth={2} />

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>

      <p className={`text-xs text-center ${TEXT_SECONDARY} mt-2`}>
        x {operator} {value} — {isFilled ? 'filled' : 'open'} circle ({isFilled ? 'includes' : 'excludes'} {value})
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   4. SlopeExplorer — adjust m and b, see the line move
   ════════════════════════════════════════════ */
export function SlopeExplorer() {
  const [m, setM] = useState(2);
  const [b, setB] = useState(1);

  const W = 280, H = 200, PAD = 30;
  const scaleX = (x: number) => PAD + ((x + 5) / 10) * (W - PAD * 2);
  const scaleY = (y: number) => H - PAD - ((y + 5) / 10) * (H - PAD * 2);

  const x1 = -5, x2 = 5;
  const y1 = m * x1 + b, y2 = m * x2 + b;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`${LABEL} ${TEXT_MUTED}`}>y = mx + b</span>
        <span className="font-mono text-sm text-emerald-400">y = {m}x {b >= 0 ? '+' : ''} {b}</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-3">
        <rect width={W} height={H} rx={4} className={SVG_BG} />

        {/* Grid */}
        {Array.from({ length: 11 }, (_, i) => i - 5).map(n => (
          <g key={n}>
            <line x1={scaleX(n)} y1={PAD} x2={scaleX(n)} y2={H - PAD} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth={0.5} />
            <line x1={PAD} y1={scaleY(n)} x2={W - PAD} y2={scaleY(n)} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth={0.5} />
          </g>
        ))}

        {/* Axes */}
        <line x1={scaleX(0)} y1={PAD} x2={scaleX(0)} y2={H - PAD} className="stroke-gray-400 dark:stroke-gray-600" strokeWidth={1.5} />
        <line x1={PAD} y1={scaleY(0)} x2={W - PAD} y2={scaleY(0)} className="stroke-gray-400 dark:stroke-gray-600" strokeWidth={1.5} />

        {/* Line */}
        <line x1={scaleX(x1)} y1={scaleY(y1)} x2={scaleX(x2)} y2={scaleY(y2)}
          stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" />

        {/* Y-intercept point */}
        <circle cx={scaleX(0)} cy={scaleY(b)} r={5} fill="#f59e0b" stroke="white" strokeWidth={1.5} />
        <text x={scaleX(0) + 8} y={scaleY(b) - 5} fill="#f59e0b" fontSize={9} fontFamily="monospace">(0, {b})</text>

        {/* Slope triangle */}
        {m !== 0 && (
          <>
            <line x1={scaleX(1)} y1={scaleY(b)} x2={scaleX(2)} y2={scaleY(b)} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3" />
            <line x1={scaleX(2)} y1={scaleY(b)} x2={scaleX(2)} y2={scaleY(m + b)} stroke="#ef4444" strokeWidth={1} strokeDasharray="3" />
            <text x={scaleX(1.5)} y={scaleY(b) + 12} fill="#3b82f6" fontSize={8} textAnchor="middle">run: 1</text>
            <text x={scaleX(2) + 5} y={scaleY(b + m / 2)} fill="#ef4444" fontSize={8}>rise: {m}</text>
          </>
        )}
      </svg>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className={`flex items-center justify-between text-xs ${TEXT_SECONDARY} mb-1`}>
            <span>Slope (m)</span><span className="font-mono text-emerald-400">{m}</span>
          </div>
          <input type="range" min={-4} max={4} step={0.5} value={m} onChange={e => setM(+e.target.value)}
            className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className={`flex items-center justify-between text-xs ${TEXT_SECONDARY} mb-1`}>
            <span>Y-intercept (b)</span><span className="font-mono text-amber-400">{b}</span>
          </div>
          <input type="range" min={-4} max={4} step={0.5} value={b} onChange={e => setB(+e.target.value)}
            className="w-full accent-amber-500" />
        </div>
      </div>
    </div>
  );
}
