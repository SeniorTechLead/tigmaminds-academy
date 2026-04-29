import { useState, useEffect, useCallback } from 'react';

const BOX = 'rounded-lg border-2 px-3 py-2 text-center font-mono text-sm transition-all duration-500';
const DARK_BG = 'bg-white dark:bg-gray-900';
const LABEL = 'text-[10px] font-bold uppercase tracking-wider';

/* ════════════════════════════════════════════
   1. PrintDiagram — terminal typing effect
   ════════════════════════════════════════════ */
export function PrintDiagram() {
  const lines = [
    { code: 'print("Hello, world!")', output: 'Hello, world!' },
    { code: 'print("My name is Python.")', output: 'My name is Python.' },
    { code: 'print(42)', output: '42' },
    { code: 'print("A banyan tree can live for", 500, "years!")', output: 'A banyan tree can live for 500 years!' },
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
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>Python Terminal</span>
        <button onClick={reset} className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white">Replay</button>
      </div>
      <div className="font-mono text-sm space-y-1 min-h-[120px]">
        {outputs.map((out, i) => (
          <div key={i}>
            <span className="text-gray-500">{'>>> '}</span>
            <span className="text-emerald-400">{lines[i].code}</span>
            <div className="text-gray-900 dark:text-white pl-4">{out}</div>
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
   2. VariableDiagram — labeled boxes matching lesson content
   Matches: name="Kavitha", age=14, height=1.55
   Shows types (str/int/float) and age = age + 1 update
   ════════════════════════════════════════════ */
export function VariableDiagram() {
  const TYPE_COLORS = {
    str: 'border-blue-500 bg-blue-900/30 text-blue-300',
    int: 'border-emerald-500 bg-emerald-900/30 text-emerald-300',
    float: 'border-purple-500 bg-purple-900/30 text-purple-300',
    updated: 'border-amber-500 bg-amber-900/30 text-amber-300',
  };

  const steps = [
    {
      code: 'name = "Kavitha"',
      vars: [{ name: 'name', value: '"Kavitha"', type: 'str', color: TYPE_COLORS.str }],
      caption: 'name = "Kavitha" → a box labeled "name" stores the text',
    },
    {
      code: 'age = 14',
      vars: [
        { name: 'name', value: '"Kavitha"', type: 'str', color: TYPE_COLORS.str },
        { name: 'age', value: '14', type: 'int', color: TYPE_COLORS.int },
      ],
      caption: 'age = 14 → a second box appears, holding a whole number',
    },
    {
      code: 'height = 1.55',
      vars: [
        { name: 'name', value: '"Kavitha"', type: 'str', color: TYPE_COLORS.str },
        { name: 'age', value: '14', type: 'int', color: TYPE_COLORS.int },
        { name: 'height', value: '1.55', type: 'float', color: TYPE_COLORS.float },
      ],
      caption: 'height = 1.55 → three variables, three types — Python detects each automatically',
    },
    {
      code: 'age = age + 1',
      vars: [
        { name: 'name', value: '"Kavitha"', type: 'str', color: TYPE_COLORS.str },
        { name: 'age', value: '15', type: 'int', color: TYPE_COLORS.updated },
        { name: 'height', value: '1.55', type: 'float', color: TYPE_COLORS.float },
      ],
      caption: 'age = age + 1 → takes old value (14), adds 1, stores 15 back. Same box, new value!',
    },
  ];

  const [step, setStep] = useState(0);
  const newest = steps[step].vars.length - 1;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>Memory — Labeled Boxes</span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`w-6 h-6 rounded text-xs font-bold ${i === step ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current line of code */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 mb-3 text-center">
        <code className="text-sm text-emerald-400 font-mono">{steps[step].code}</code>
      </div>

      {/* Variable boxes */}
      <div className="flex gap-3 justify-center min-h-[90px] items-end">
        {steps[step].vars.map((v, i) => (
          <div key={v.name}
            className={`${BOX} ${v.color} min-w-[90px] transition-all duration-500 ${
              (step < 3 && i === newest) || (step === 3 && v.name === 'age') ? 'scale-105 ring-1 ring-white/30' : ''
            }`}>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">{v.name}</div>
            <div className="text-lg font-bold mb-0.5">{v.value}</div>
            <div className={`text-[9px] font-mono ${v.color.includes('blue') ? 'text-blue-500' : v.color.includes('emerald') ? 'text-emerald-500' : v.color.includes('purple') ? 'text-purple-500' : 'text-amber-500'}`}>
              {v.type}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">{steps[step].caption}</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. ListDiagram — matches lesson: animals = ["elephant", "tiger", "rhino"]
   Shows index access and .append("deer")
   ════════════════════════════════════════════ */
export function ListDiagram() {
  const items = ['elephant', 'tiger', 'rhino'];
  const [highlight, setHighlight] = useState<number | null>(null);
  const [showAppend, setShowAppend] = useState(false);

  const allItems = showAppend ? [...items, 'deer'] : items;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>animals = ["elephant", "tiger", "rhino"]</span>
        <button onClick={() => { setShowAppend(!showAppend); setHighlight(null); }}
          className="text-[10px] text-gray-500 hover:text-emerald-400">{showAppend ? 'Reset' : '.append("deer")'}</button>
      </div>

      <div className="flex gap-2 justify-center">
        {allItems.map((val, i) => (
          <button key={`${val}-${i}`} onClick={() => setHighlight(highlight === i ? null : i)}
            className={`${BOX} min-w-[80px] cursor-pointer ${
              highlight === i ? 'border-amber-400 bg-amber-900/30 text-amber-300 scale-110' :
              i === allItems.length - 1 && showAppend ? 'border-emerald-400 bg-emerald-900/30 text-emerald-300' :
              'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}>
            <div className="text-[9px] text-gray-500">[{i}]</div>
            <div className="text-sm font-bold">"{val}"</div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        {highlight !== null
          ? `animals[${highlight}] → "${allItems[highlight]}" ${highlight === 0 ? '— index starts at 0, not 1!' : ''}`
          : showAppend ? `.append("deer") added a 4th item — len(animals) is now ${allItems.length}` : 'Click any box to see its index'}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   4. LoopDiagram — matches lesson: for animal in ["elephant", "tiger", "rhino"]: print(animal)
   Steps through each iteration, shows print output
   ════════════════════════════════════════════ */
export function LoopDiagram() {
  const animals = ['elephant', 'tiger', 'rhino'];
  const [current, setCurrent] = useState(-1);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    setCurrent(-1);
    setOutputs([]);
    let i = -1;
    const timer = setInterval(() => {
      i++;
      if (i >= animals.length) { clearInterval(timer); setRunning(false); return; }
      setCurrent(i);
      setOutputs(prev => [...prev, animals[i]]);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>for animal in animals:</span>
        <button onClick={run} disabled={running}
          className={`text-[10px] px-2 py-1 rounded ${running ? 'text-gray-400 dark:text-gray-600' : 'text-emerald-400 hover:bg-emerald-900/30'}`}>
          {running ? 'Running...' : '▶ Run loop'}
        </button>
      </div>

      {/* The list being iterated */}
      <div className="flex gap-2 justify-center mb-3">
        {animals.map((a, i) => (
          <div key={a} className={`${BOX} min-w-[80px] transition-all duration-300 ${
            i === current ? 'border-amber-400 bg-amber-900/40 text-amber-300 scale-110 shadow-lg shadow-amber-900/50' :
            i < current ? 'border-emerald-600 bg-emerald-900/20 text-emerald-400' :
            'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>
            <div className="text-[9px] text-gray-500">[{i}]</div>
            <div className="text-sm font-bold">"{a}"</div>
          </div>
        ))}
      </div>

      {/* Terminal output */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 font-mono text-xs min-h-[60px]">
        <div className="text-gray-500 mb-1">output:</div>
        {outputs.map((o, i) => (
          <div key={i} className="text-gray-900 dark:text-white transition-all duration-300">{o}</div>
        ))}
        {current === -1 && !running && outputs.length === 0 && (
          <div className="text-gray-400 dark:text-gray-600 italic">Press Run to step through the loop</div>
        )}
      </div>

      {current >= 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          iteration {current + 1}: <span className="text-amber-300 font-mono">animal = "{animals[current]}"</span> → <span className="text-emerald-300 font-mono">print("{animals[current]}")</span>
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   5. ConditionalDiagram — matches lesson exactly:
   if temp > 35: "Dangerous heat"
   elif temp > 25: "Warm — good for bees"
   elif temp > 10: "Cool — bees stay inside"
   else: "Too cold — risk of colony death"
   ════════════════════════════════════════════ */
export function ConditionalDiagram() {
  const [temp, setTemp] = useState(28);

  const branches = [
    { keyword: 'if', cond: 'temperature > 35', active: temp > 35, msg: 'Dangerous heat', color: 'border-red-500 bg-red-900/20 text-red-300' },
    { keyword: 'elif', cond: 'temperature > 25', active: temp > 25 && temp <= 35, msg: 'Warm — good for bees', color: 'border-amber-500 bg-amber-900/20 text-amber-300' },
    { keyword: 'elif', cond: 'temperature > 10', active: temp > 10 && temp <= 25, msg: 'Cool — bees stay inside', color: 'border-blue-500 bg-blue-900/20 text-blue-300' },
    { keyword: 'else', cond: '', active: temp <= 10, msg: 'Too cold — risk of colony death', color: 'border-purple-500 bg-purple-900/20 text-purple-300' },
  ];

  const activeBranch = branches.find(b => b.active)!;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>if / elif / else</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">temperature =</span>
          <input type="range" min={0} max={50} value={temp} onChange={e => setTemp(+e.target.value)}
            className="w-24 accent-emerald-500" />
          <span className="text-sm font-mono text-gray-900 dark:text-white w-8">{temp}°</span>
        </div>
      </div>

      <div className="space-y-2">
        {branches.map((b, i) => (
          <div key={i} className={`${BOX} text-left transition-all duration-300 ${b.active ? b.color + ' scale-[1.02]' : 'border-gray-300 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono">
                <span className="text-purple-400">{b.keyword}</span>{b.cond ? ` ${b.cond}:` : ':'}
              </span>
              {b.active && <span className="text-[10px]">← runs this</span>}
            </div>
            <div className={`text-xs mt-1 font-mono pl-4 ${b.active ? '' : 'opacity-40'}`}>
              print("{b.msg}")
            </div>
          </div>
        ))}
      </div>

      <p className={`text-sm font-medium text-center mt-3 ${activeBranch.color.split(' ').pop()}`}>
        Output: {activeBranch.msg}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   6. FunctionDiagram — matches lesson:
   def greet(name): print("Hello, " + name + "!")
   greet("Tara"), greet("Kavitha")
   ════════════════════════════════════════════ */
export function FunctionDiagram() {
  const names = ['Tara', 'Kavitha', 'Arjun'];
  const [nameIdx, setNameIdx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'calling' | 'inside' | 'output'>('idle');
  const [outputText, setOutputText] = useState('');

  const call = () => {
    if (phase !== 'idle') return;
    setPhase('calling');
    setTimeout(() => {
      setPhase('inside');
      setTimeout(() => {
        setOutputText(`Hello, ${names[nameIdx]}!`);
        setPhase('output');
        setTimeout(() => {
          setPhase('idle');
          setNameIdx(i => (i + 1) % names.length);
        }, 1200);
      }, 800);
    }, 500);
  };

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>Function Call</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">def greet(name):</span>
      </div>

      <div className="flex items-center justify-center gap-3">
        {/* Input */}
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">argument</div>
          <div className={`${BOX} min-w-[80px] transition-all duration-300 ${
            phase === 'calling' ? 'border-blue-400 bg-blue-900/40 text-blue-300 scale-105' : 'border-blue-500 bg-blue-900/30 text-blue-300'
          }`}>
            <div className="text-[10px] text-gray-500 dark:text-gray-400">name</div>
            <div className="font-bold">"{names[nameIdx]}"</div>
          </div>
        </div>

        <div className={`text-xl transition-colors duration-300 ${phase === 'calling' ? 'text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>→</div>

        {/* Function box */}
        <div className={`${BOX} min-w-[140px] transition-all duration-300 ${
          phase === 'inside' ? 'border-emerald-400 bg-emerald-900/40 text-emerald-300 scale-105' : 'border-emerald-500 bg-emerald-900/30 text-emerald-300'
        }`}>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">greet()</div>
          <div className="text-[9px] text-gray-500 font-mono">print("Hello, " + name + "!")</div>
        </div>

        <div className={`text-xl transition-colors duration-300 ${phase === 'output' ? 'text-amber-400' : 'text-gray-400 dark:text-gray-600'}`}>→</div>

        {/* Output */}
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">output</div>
          <div className={`${BOX} min-w-[100px] transition-all duration-300 ${
            phase === 'output' ? 'border-amber-400 bg-amber-900/40 text-amber-300 scale-105' : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>
            <div className="text-sm font-bold">{outputText || '...'}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <button onClick={call} disabled={phase !== 'idle'}
          className={`text-xs px-4 py-1.5 rounded font-mono ${phase === 'idle' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
          {phase === 'idle' ? `greet("${names[nameIdx]}")` : phase === 'calling' ? 'Passing argument...' : phase === 'inside' ? 'Running body...' : 'Printed!'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   7. NumpyDiagram — matches lesson: temps = np.array([12, 14, 11, 15, 13, 10, 14])
   Shows loop vs vectorized temps - 10
   ════════════════════════════════════════════ */
export function NumpyDiagram() {
  const data = [12, 14, 11, 15, 13, 10, 14];
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
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>{mode === 'loop' ? 'Loop (one at a time)' : 'Numpy (all at once)'}</span>
        <div className="flex gap-2">
          <button onClick={switchMode} className="text-[10px] text-blue-400 hover:text-blue-300">
            Switch to {mode === 'loop' ? 'numpy' : 'loop'}
          </button>
          <button onClick={() => setStep(0)} className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white">Reset</button>
        </div>
      </div>

      <div className="flex gap-1 justify-center mb-2">
        <span className="text-[10px] text-gray-500 self-center mr-1">temps</span>
        {data.map((val, i) => (
          <div key={i} className={`${BOX} w-12 transition-all duration-300 ${
            i < processed
              ? 'border-emerald-500 bg-emerald-900/30 text-emerald-300'
              : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500'
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
              : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
          }`}>
            {i < processed ? val - 10 : '?'}
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button onClick={advance} disabled={processed >= data.length}
          className={`text-xs px-3 py-1 rounded ${processed >= data.length ? 'text-gray-400 dark:text-gray-600 bg-gray-200 dark:bg-gray-800' : 'text-white bg-emerald-600 hover:bg-emerald-700'}`}>
          {processed >= data.length ? (mode === 'loop' ? `Done (${data.length} steps)` : 'Done (1 step!)') : mode === 'loop' ? `Process [${step}]` : 'Process ALL'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   8. PlotDiagram — matches lesson:
   x = [1, 2, 3, 4, 5], y = [10, 25, 15, 30, 20]
   xlabel("Month"), ylabel("Honey (kg)"), title("Annual Honey Production")
   ════════════════════════════════════════════ */
export function PlotDiagram() {
  const points = [
    { x: 1, y: 10 }, { x: 2, y: 25 }, { x: 3, y: 15 },
    { x: 4, y: 30 }, { x: 5, y: 20 },
  ];
  const [visible, setVisible] = useState(0);
  const [showLine, setShowLine] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    if (visible >= points.length) {
      setTimeout(() => setShowLine(true), 300);
      setTimeout(() => setShowLabels(true), 800);
      return;
    }
    const timer = setTimeout(() => setVisible(v => v + 1), 400);
    return () => clearTimeout(timer);
  }, [visible]);

  const reset = () => { setVisible(0); setShowLine(false); setShowLabels(false); };

  const W = 280, H = 180, PAD = 35;
  const maxY = 35;
  const scaleX = (x: number) => PAD + (x / 6) * (W - PAD * 2);
  const scaleY = (y: number) => H - PAD - (y / maxY) * (H - PAD * 2);

  const linePath = points.slice(0, visible).map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`
  ).join(' ');

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-sm mx-auto my-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>plt.plot(x, y)</span>
        <button onClick={reset} className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white">Replay</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect width={W} height={H} rx="4" className="fill-white dark:fill-gray-900" />

        {/* Title */}
        {showLabels && (
          <text x={W / 2} y={16} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontFamily="system-ui" fontWeight="bold">
            Annual Honey Production
          </text>
        )}

        {/* Grid lines */}
        {[0, 10, 20, 30].map(y => (
          <g key={y}>
            <line x1={PAD} y1={scaleY(y)} x2={W - PAD} y2={scaleY(y)} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="1" />
            <text x={PAD - 4} y={scaleY(y) + 3} textAnchor="end" fill="#4b5563" fontSize="8" fontFamily="system-ui">{y}</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#4b5563" strokeWidth="1.5" />
        <line x1={PAD} y1={PAD - 5} x2={PAD} y2={H - PAD} stroke="#4b5563" strokeWidth="1.5" />

        {/* X tick marks */}
        {[1, 2, 3, 4, 5].map(x => (
          <text key={x} x={scaleX(x)} y={H - PAD + 12} textAnchor="middle" fill="#4b5563" fontSize="8" fontFamily="system-ui">{x}</text>
        ))}

        {/* Axis labels */}
        {showLabels && (
          <>
            <text x={W / 2} y={H - 4} textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="system-ui">Month</text>
            <text x={10} y={H / 2} textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="system-ui" transform={`rotate(-90, 10, ${H / 2})`}>Honey (kg)</text>
          </>
        )}

        {/* Line */}
        {showLine && (
          <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Points */}
        {points.slice(0, visible).map((p, i) => (
          <circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y)} r="5" fill="#22c55e" stroke="white" strokeWidth="1.5">
            <animate attributeName="r" from="0" to="5" dur="0.3s" />
          </circle>
        ))}
      </svg>

      <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
        {!showLabels ? 'Plotting points...' : 'plt.xlabel(), plt.ylabel(), plt.title() — always label your plots'}
      </p>
    </div>
  );
}
