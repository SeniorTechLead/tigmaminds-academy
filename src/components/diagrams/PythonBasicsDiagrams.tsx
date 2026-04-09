import { useState, useEffect, useCallback } from 'react';

const BOX = 'rounded-lg border-2 px-3 py-2 text-center font-mono text-sm transition-all duration-500';
const DARK_BG = 'bg-gray-900';
const LABEL = 'text-[10px] font-bold uppercase tracking-wider';

/* ════════════════════════════════════════════
   1. PrintDiagram — terminal typing effect
   ════════════════════════════════════════════ */
export function PrintDiagram() {
  const lines = [
    { code: 'print("Hello, world!")', output: 'Hello, world!' },
    { code: 'print(42)', output: '42' },
    { code: 'print("Bees found:", 3)', output: 'Bees found: 3' },
  ];
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState('');
  const [outputs, setOutputs] = useState<string[]>([]);

  useEffect(() => {
    if (step >= lines.length) return;
    const code = lines[step].code;
    let i = 0;
    setTyping('');
    const timer = setInterval(() => {
      i++;
      setTyping(code.slice(0, i));
      if (i >= code.length) {
        clearInterval(timer);
        setTimeout(() => {
          setOutputs(prev => [...prev, lines[step].output]);
          setTimeout(() => setStep(s => s + 1), 600);
        }, 400);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [step]);

  const reset = () => { setStep(0); setTyping(''); setOutputs([]); };

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Python Terminal</span>
        <button onClick={reset} className="text-[10px] text-gray-500 hover:text-white">Replay</button>
      </div>
      <div className="font-mono text-sm space-y-1 min-h-[120px]">
        {outputs.map((out, i) => (
          <div key={i}>
            <span className="text-gray-500">{'>>> '}</span>
            <span className="text-emerald-400">{lines[i].code}</span>
            <div className="text-white pl-4">{out}</div>
          </div>
        ))}
        {step < lines.length && (
          <div>
            <span className="text-gray-500">{'>>> '}</span>
            <span className="text-emerald-400">{typing}</span>
            <span className="animate-pulse text-emerald-400">|</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. VariableDiagram — labeled boxes
   ════════════════════════════════════════════ */
export function VariableDiagram() {
  const steps = [
    { vars: [{ name: 'age', value: '14', color: 'border-emerald-500 bg-emerald-900/30 text-emerald-300' }], caption: 'age = 14 — a box labeled "age" now holds 14' },
    { vars: [
      { name: 'age', value: '14', color: 'border-emerald-500 bg-emerald-900/30 text-emerald-300' },
      { name: 'name', value: '"Tara"', color: 'border-blue-500 bg-blue-900/30 text-blue-300' },
    ], caption: 'name = "Tara" — a second box appears' },
    { vars: [
      { name: 'age', value: '15', color: 'border-amber-500 bg-amber-900/30 text-amber-300' },
      { name: 'name', value: '"Tara"', color: 'border-blue-500 bg-blue-900/30 text-blue-300' },
    ], caption: 'age = age + 1 — same box, new value!' },
  ];

  const [step, setStep] = useState(0);

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Memory</span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`w-6 h-6 rounded text-xs font-bold ${i === step ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center min-h-[80px] items-center">
        {steps[step].vars.map((v, i) => (
          <div key={v.name} className={`${BOX} ${v.color} min-w-[90px] transform ${i === steps[step].vars.length - 1 && step > 0 ? 'scale-105' : ''}`}>
            <div className="text-[10px] text-gray-400 mb-1">{v.name}</div>
            <div className="text-lg font-bold">{v.value}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">{steps[step].caption}</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. ListDiagram — numbered shelf
   ════════════════════════════════════════════ */
export function ListDiagram() {
  const items = ['12', '8', '15', '6', '20'];
  const [highlight, setHighlight] = useState<number | null>(null);
  const [showAppend, setShowAppend] = useState(false);

  const allItems = showAppend ? [...items, '18'] : items;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>honey_kg = [12, 8, 15, 6, 20]</span>
        <button onClick={() => setShowAppend(!showAppend)}
          className="text-[10px] text-gray-500 hover:text-emerald-400">{showAppend ? 'Reset' : '.append(18)'}</button>
      </div>

      <div className="flex gap-1 justify-center">
        {allItems.map((val, i) => (
          <button key={i} onClick={() => setHighlight(highlight === i ? null : i)}
            className={`${BOX} w-14 cursor-pointer ${
              highlight === i ? 'border-amber-400 bg-amber-900/30 text-amber-300 scale-110' :
              i === allItems.length - 1 && showAppend ? 'border-emerald-400 bg-emerald-900/30 text-emerald-300' :
              'border-gray-600 bg-gray-800 text-white'
            }`}>
            <div className="text-[9px] text-gray-500">[{i}]</div>
            <div className="text-lg font-bold">{val}</div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        {highlight !== null
          ? `honey_kg[${highlight}] = ${allItems[highlight]} — index ${highlight} ${highlight === 0 ? '(first item!)' : ''}`
          : showAppend ? '.append(18) added a new item at the end' : 'Click any box to see its index'}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   4. LoopDiagram — stepping through iterations
   ════════════════════════════════════════════ */
export function LoopDiagram() {
  const items = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const values = [10000, 15000, 25000, 38000, 50000];
  const [current, setCurrent] = useState(-1);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    setCurrent(-1);
    let i = -1;
    const timer = setInterval(() => {
      i++;
      if (i >= items.length) { clearInterval(timer); setRunning(false); return; }
      setCurrent(i);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>for month in months:</span>
        <button onClick={run} disabled={running}
          className={`text-[10px] px-2 py-1 rounded ${running ? 'text-gray-600' : 'text-emerald-400 hover:bg-emerald-900/30'}`}>
          {running ? 'Running...' : '▶ Run loop'}
        </button>
      </div>

      <div className="flex gap-1 justify-center">
        {items.map((month, i) => (
          <div key={i} className={`${BOX} w-16 transition-all duration-300 ${
            i === current ? 'border-amber-400 bg-amber-900/40 text-amber-300 scale-110 shadow-lg shadow-amber-900/50' :
            i < current ? 'border-emerald-600 bg-emerald-900/20 text-emerald-400' :
            'border-gray-700 bg-gray-800 text-gray-500'
          }`}>
            <div className="text-xs font-bold">{month}</div>
            <div className="text-[10px]">{values[i].toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 font-mono text-xs text-center min-h-[40px]">
        {current >= 0 && (
          <div className="transition-all duration-300">
            <span className="text-gray-500">iteration {current + 1}: </span>
            <span className="text-amber-300">month = "{items[current]}"</span>
            <span className="text-gray-500"> → </span>
            <span className="text-emerald-300">pop = {values[current].toLocaleString()}</span>
          </div>
        )}
        {current === -1 && !running && <span className="text-gray-600">Press Run to step through the loop</span>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   5. ConditionalDiagram — flowchart paths
   ════════════════════════════════════════════ */
export function ConditionalDiagram() {
  const [temp, setTemp] = useState(28);

  const result = temp > 40 ? { text: 'DANGER: Heat stroke', color: 'text-red-400', path: 'red' }
    : temp > 30 ? { text: 'CAUTION: Hot', color: 'text-orange-400', path: 'orange' }
    : temp > 15 ? { text: 'OK: Good conditions', color: 'text-emerald-400', path: 'green' }
    : { text: 'WARNING: Too cold', color: 'text-blue-400', path: 'blue' };

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>if / elif / else</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">temp =</span>
          <input type="range" min={0} max={50} value={temp} onChange={e => setTemp(+e.target.value)}
            className="w-24 accent-emerald-500" />
          <span className="text-sm font-mono text-white w-8">{temp}°</span>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { cond: 'temp > 40', active: temp > 40, color: 'border-red-500 bg-red-900/20 text-red-300' },
          { cond: 'temp > 30', active: temp > 30 && temp <= 40, color: 'border-orange-500 bg-orange-900/20 text-orange-300' },
          { cond: 'temp > 15', active: temp > 15 && temp <= 30, color: 'border-emerald-500 bg-emerald-900/20 text-emerald-300' },
          { cond: 'else', active: temp <= 15, color: 'border-blue-500 bg-blue-900/20 text-blue-300' },
        ].map((branch, i) => (
          <div key={i} className={`${BOX} ${branch.active ? branch.color + ' scale-[1.02]' : 'border-gray-700 bg-gray-800/50 text-gray-600 scale-100'}`}>
            <span className="text-xs">{i < 3 ? (i === 0 ? 'if ' : 'elif ') : ''}{branch.cond}</span>
            {branch.active && <span className="ml-2 text-xs">← active</span>}
          </div>
        ))}
      </div>

      <p className={`text-sm font-medium text-center mt-3 ${result.color}`}>{result.text}</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   6. FunctionDiagram — input → box → output
   ════════════════════════════════════════════ */
export function FunctionDiagram() {
  const [input, setInput] = useState(55000);
  const season = 0.85;
  const output = (input / 50000 * 25 * season).toFixed(1);

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Function Call</span>
      </div>

      <div className="flex items-center justify-center gap-3">
        {/* Input */}
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">input</div>
          <div className={`${BOX} border-blue-500 bg-blue-900/30 text-blue-300 min-w-[80px]`}>
            <div className="text-[10px] text-gray-400">population</div>
            <div className="font-bold">{input.toLocaleString()}</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="text-emerald-500 text-xl">→</div>

        {/* Function box */}
        <div className={`${BOX} border-emerald-500 bg-emerald-900/30 text-emerald-300 min-w-[120px]`}>
          <div className="text-[10px] text-gray-400 mb-1">honey_yield()</div>
          <div className="text-[9px] text-gray-500">pop / 50000 * 25 * 0.85</div>
        </div>

        {/* Arrow */}
        <div className="text-amber-500 text-xl">→</div>

        {/* Output */}
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">return</div>
          <div className={`${BOX} border-amber-500 bg-amber-900/30 text-amber-300 min-w-[70px]`}>
            <div className="text-lg font-bold">{output}</div>
            <div className="text-[10px] text-gray-400">kg</div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <input type="range" min={10000} max={80000} step={5000} value={input} onChange={e => setInput(+e.target.value)}
          className="w-48 accent-blue-500" />
      </div>
      <p className="text-xs text-gray-400 text-center mt-1">
        Slide to change population → watch the output change
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   7. NumpyDiagram — loop vs vectorized
   ════════════════════════════════════════════ */
export function NumpyDiagram() {
  const data = [12, 14, 11, 15, 13];
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'loop' | 'numpy'>('loop');

  // Loop mode: process one at a time
  // Numpy mode: process all at once
  const processed = mode === 'loop' ? step : step > 0 ? data.length : 0;

  useEffect(() => {
    if (step > 0) return;
    // Auto-advance is off — user clicks
  }, []);

  const advance = () => {
    if (mode === 'loop') {
      setStep(s => Math.min(s + 1, data.length));
    } else {
      setStep(s => s === 0 ? data.length : 0);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'loop' ? 'numpy' : 'loop');
    setStep(0);
  };

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>{mode === 'loop' ? 'Loop (one at a time)' : 'Numpy (all at once)'}</span>
        <div className="flex gap-2">
          <button onClick={switchMode} className="text-[10px] text-blue-400 hover:text-blue-300">
            Switch to {mode === 'loop' ? 'numpy' : 'loop'}
          </button>
          <button onClick={() => setStep(0)} className="text-[10px] text-gray-500 hover:text-white">Reset</button>
        </div>
      </div>

      <div className="flex gap-1 justify-center mb-2">
        <span className="text-[10px] text-gray-500 self-center mr-1">temps</span>
        {data.map((val, i) => (
          <div key={i} className={`${BOX} w-12 transition-all duration-300 ${
            i < processed
              ? 'border-emerald-500 bg-emerald-900/30 text-emerald-300'
              : 'border-gray-700 bg-gray-800 text-gray-500'
          }`}>
            {val}
          </div>
        ))}
      </div>

      <div className="text-center text-gray-500 text-sm mb-2">− 10 =</div>

      <div className="flex gap-1 justify-center">
        <span className="text-[10px] text-gray-500 self-center mr-1">result</span>
        {data.map((val, i) => (
          <div key={i} className={`${BOX} w-12 transition-all duration-300 ${
            i < processed
              ? 'border-amber-500 bg-amber-900/30 text-amber-300'
              : 'border-gray-700 bg-gray-800 text-gray-600'
          }`}>
            {i < processed ? val - 10 : '?'}
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button onClick={advance} disabled={processed >= data.length}
          className={`text-xs px-3 py-1 rounded ${processed >= data.length ? 'text-gray-600 bg-gray-800' : 'text-white bg-emerald-600 hover:bg-emerald-700'}`}>
          {processed >= data.length ? (mode === 'loop' ? `Done (${data.length} steps)` : 'Done (1 step!)') : mode === 'loop' ? `Process [${step}]` : 'Process ALL'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   8. PlotDiagram — axes with points appearing
   ════════════════════════════════════════════ */
export function PlotDiagram() {
  const points = [
    { x: 1, y: 12 }, { x: 2, y: 15 }, { x: 3, y: 25 },
    { x: 4, y: 38 }, { x: 5, y: 50 }, { x: 6, y: 55 },
  ];
  const [visible, setVisible] = useState(0);
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    if (visible >= points.length) {
      setTimeout(() => setShowLine(true), 300);
      return;
    }
    const timer = setTimeout(() => setVisible(v => v + 1), 400);
    return () => clearTimeout(timer);
  }, [visible]);

  const reset = () => { setVisible(0); setShowLine(false); };

  const W = 280, H = 160, PAD = 30;
  const scaleX = (x: number) => PAD + (x / 7) * (W - PAD * 2);
  const scaleY = (y: number) => H - PAD - (y / 60) * (H - PAD * 2);

  const linePath = points.slice(0, visible).map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`
  ).join(' ');

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-sm mx-auto my-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`${LABEL} text-gray-500`}>plt.plot(months, population)</span>
        <button onClick={reset} className="text-[10px] text-gray-500 hover:text-white">Replay</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Background */}
        <rect width={W} height={H} rx="4" fill="#111827" />

        {/* Grid lines */}
        {[0, 15, 30, 45, 60].map(y => (
          <line key={y} x1={PAD} y1={scaleY(y)} x2={W - PAD} y2={scaleY(y)} stroke="#1f2937" strokeWidth="1" />
        ))}

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#4b5563" strokeWidth="1.5" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#4b5563" strokeWidth="1.5" />

        {/* Axis labels */}
        <text x={W / 2} y={H - 5} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="system-ui">Month</text>
        <text x={8} y={H / 2} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="system-ui" transform={`rotate(-90, 8, ${H / 2})`}>Population (k)</text>

        {/* Line */}
        {showLine && (
          <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        )}

        {/* Points */}
        {points.slice(0, visible).map((p, i) => (
          <circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y)} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5">
            <animate attributeName="r" from="0" to="5" dur="0.3s" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
