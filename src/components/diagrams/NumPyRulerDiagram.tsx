import { useState } from 'react';

// ── linspace vs arange ───────────────────────────────────────
// Interactive demo of NumPy's range-making functions. User picks
// count or step; ruler ticks update live. Shows the difference
// between linspace (count-based) and arange (step-based).

type Mode = 'linspace' | 'arange';

export default function NumPyRulerDiagram() {
  const [mode, setMode] = useState<Mode>('linspace');
  const [count, setCount] = useState(10); // for linspace
  const [step, setStep] = useState(0.5); // for arange
  const start = 0, stop = 3;

  // Compute values
  let values: number[] = [];
  let code = '';
  if (mode === 'linspace') {
    if (count > 1) {
      const stepSize = (stop - start) / (count - 1);
      values = Array.from({ length: count }, (_, i) => start + i * stepSize);
    } else {
      values = [start];
    }
    code = `np.linspace(${start}, ${stop}, ${count})`;
  } else {
    values = [];
    for (let v = start; v <= stop + 0.0001; v += step) values.push(Number(v.toFixed(4)));
    code = `np.arange(${start}, ${stop + step}, ${step})`;
  }

  const W = 580, H = 200;
  const padX = 30;
  const plotW = W - padX * 2;
  const xAt = (v: number) => padX + ((v - start) / (stop - start)) * plotW;
  const lineY = 80;

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-slate-50 to-emerald-50 dark:from-indigo-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
          linspace vs arange
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('linspace')}
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded transition ${
              mode === 'linspace'
                ? 'bg-indigo-500 text-white'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            linspace
          </button>
          <button
            onClick={() => setMode('arange')}
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded transition ${
              mode === 'arange'
                ? 'bg-emerald-500 text-white'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            arange
          </button>
        </div>
      </div>

      {/* Ruler */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Interactive ruler showing linspace and arange spacing">
        {/* Main line */}
        <line x1={padX} y1={lineY} x2={W - padX} y2={lineY}
          stroke="#334155" strokeWidth="2" />

        {/* Major ticks at 0, 1, 2, 3 */}
        {[0, 1, 2, 3].map(v => (
          <g key={`maj-${v}`}>
            <line x1={xAt(v)} y1={lineY - 10} x2={xAt(v)} y2={lineY + 10}
              stroke="#334155" strokeWidth="1.5" />
            <text x={xAt(v)} y={lineY + 26} textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-200" fontSize="11" fontWeight="bold">
              {v}
            </text>
          </g>
        ))}

        {/* Generated points */}
        {values.map((v, i) => (
          <g key={`pt-${i}`}>
            <circle cx={xAt(v)} cy={lineY}
              r="5"
              fill={mode === 'linspace' ? '#6366f1' : '#10b981'}
              stroke="white" strokeWidth="1.5" />
            {values.length <= 20 && (
              <text x={xAt(v)} y={lineY - 18} textAnchor="middle"
                className={mode === 'linspace' ? 'fill-indigo-700 dark:fill-indigo-300' : 'fill-emerald-700 dark:fill-emerald-300'}
                fontSize="8" fontWeight="bold">
                {v.toFixed(2)}
              </text>
            )}
          </g>
        ))}

        {/* Code snippet */}
        <rect x={padX} y={H - 50} width={W - padX * 2} height={38} rx={6}
          fill="#0f172a" />
        <text x={padX + 10} y={H - 36}
          className="fill-gray-400" fontSize="9" fontFamily="monospace">
          Python / NumPy:
        </text>
        <text x={padX + 10} y={H - 20}
          fill={mode === 'linspace' ? '#818cf8' : '#34d399'}
          fontSize="12" fontFamily="monospace" fontWeight="bold">
          {code}
        </text>
      </svg>

      {/* Control for current mode */}
      <div className="max-w-sm mx-auto mt-3">
        {mode === 'linspace' ? (
          <>
            <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between mb-1">
              <span>Count (number of points)</span>
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{count}</span>
            </label>
            <input type="range" min={2} max={31} value={count}
              onChange={e => setCount(+e.target.value)}
              className="w-full accent-indigo-500" />
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 text-center">
              <strong>linspace</strong> — you pick the COUNT; NumPy picks the step.
            </p>
          </>
        ) : (
          <>
            <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between mb-1">
              <span>Step size</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{step.toFixed(2)}</span>
            </label>
            <input type="range" min={0.1} max={1.5} step={0.05} value={step}
              onChange={e => setStep(+e.target.value)}
              className="w-full accent-emerald-500" />
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 text-center">
              <strong>arange</strong> — you pick the STEP; NumPy picks the count.
            </p>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Both create a 1D NumPy array — the difference is which parameter you control.
      </p>
    </div>
  );
}
