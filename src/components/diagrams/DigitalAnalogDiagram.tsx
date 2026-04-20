import { useState, useEffect } from 'react';

// ── Smooth vs Stepped ────────────────────────────────────────
// Animated side-by-side: analog signal (smooth sine wave) and
// digital signal (stepped on/off). PWM toggle shows how digital
// pins fake analog output by flicking on/off fast.

type Mode = 'compare' | 'pwm';

export default function DigitalAnalogDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<Mode>('compare');
  const [duty, setDuty] = useState(50);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(id);
  }, [paused]);

  const W = 560, H = 300;

  // Analog signal: continuous sine
  const analogPoints: string[] = [];
  for (let x = 0; x <= 240; x++) {
    const t = (x + tick) * 0.04;
    const y = 130 + Math.sin(t) * 50 + Math.sin(t * 3) * 8;
    analogPoints.push(`${x === 0 ? 'M' : 'L'} ${20 + x},${y}`);
  }

  // Digital: square wave at constant frequency
  const digitalPoints: string[] = [];
  for (let x = 0; x <= 240; x++) {
    const t = (x + tick) * 0.04;
    const high = Math.sin(t) > 0;
    const y = high ? 80 : 180;
    digitalPoints.push(`${x === 0 ? 'M' : 'L'} ${300 + x},${y}`);
  }

  // PWM square wave: duty cycle controlled
  const pwmPoints: string[] = [];
  const pwmPeriod = 20; // pixels per cycle
  for (let x = 0; x <= 500; x++) {
    const phase = ((x + tick) % pwmPeriod) / pwmPeriod;
    const high = phase < duty / 100;
    const y = high ? 80 : 180;
    pwmPoints.push(`${x === 0 ? 'M' : 'L'} ${30 + x},${y}`);
  }
  const avgY = 180 - (duty / 100) * 100;

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50 dark:from-blue-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          Smooth vs Stepped
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('compare')}
            className={`text-xs px-2 py-0.5 rounded transition ${
              mode === 'compare'
                ? 'bg-blue-500/30 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setMode('pwm')}
            className={`text-xs px-2 py-0.5 rounded transition ${
              mode === 'pwm'
                ? 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-200 ring-1 ring-emerald-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            PWM trick
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      {mode === 'compare' && (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
            aria-label="Side-by-side comparison of analog (smooth) and digital (stepped) signals">

            {/* Analog panel */}
            <rect x={10} y={50} width={270} height={200} rx={8}
              fill="#eff6ff" className="dark:fill-blue-900/20" stroke="#93c5fd" strokeWidth="1" />
            <text x={145} y={45} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">
              Analog (smooth)
            </text>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line key={`ag-${i}`} x1={20} y1={70 + i * 30} x2={270} y2={70 + i * 30}
                stroke="#cbd5e1" className="dark:stroke-gray-700" strokeWidth="0.5" opacity="0.5" />
            ))}
            <path d={analogPoints.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            <text x={145} y={270} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">
              Voltage varies continuously (0–5V)
            </text>

            {/* Digital panel */}
            <rect x={290} y={50} width={260} height={200} rx={8}
              fill="#ecfdf5" className="dark:fill-emerald-900/20" stroke="#86efac" strokeWidth="1" />
            <text x={420} y={45} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="12" fontWeight="bold">
              Digital (stepped)
            </text>
            <line x1={295} y1={80} x2={545} y2={80} stroke="#cbd5e1" className="dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x={290} y={78} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="8">HIGH</text>
            <line x1={295} y1={180} x2={545} y2={180} stroke="#cbd5e1" className="dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x={290} y={184} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="8">LOW</text>
            <path d={digitalPoints.join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" />
            <text x={420} y={270} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">
              Only two states: HIGH (5V) or LOW (0V)
            </text>
          </svg>

          <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 text-center">
            Thermometer, potentiometer, microphone → <strong>analog</strong>.
            Button, switch, LED → <strong>digital</strong>.
          </div>
        </>
      )}

      {mode === 'pwm' && (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
            aria-label="PWM signal fakes analog output by toggling a digital pin on/off rapidly">

            <rect x={10} y={40} width={540} height={220} rx={8}
              fill="#fef3c7" className="dark:fill-amber-900/20" stroke="#fbbf24" strokeWidth="1" />
            <text x={W / 2} y={35} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">
              PWM — Digital pin pretending to be analog
            </text>

            {/* HIGH/LOW guides */}
            <line x1={20} y1={80} x2={540} y2={80} stroke="#cbd5e1" className="dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x={15} y={78} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="8">HIGH (5V)</text>
            <line x1={20} y1={180} x2={540} y2={180} stroke="#cbd5e1" className="dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x={15} y={184} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="8">LOW (0V)</text>

            {/* PWM square wave */}
            <path d={pwmPoints.join(' ')} fill="none" stroke="#10b981" strokeWidth="2" />

            {/* Average line */}
            <line x1={20} y1={avgY} x2={540} y2={avgY} stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
            <text x={548} y={avgY + 4} className="fill-red-600 dark:fill-red-400" fontSize="9" fontWeight="bold">
              avg
            </text>
            <text x={548} y={avgY + 16} className="fill-red-600 dark:fill-red-400" fontSize="9">
              = {(duty / 100 * 5).toFixed(2)}V
            </text>

            <text x={W / 2} y={230} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200" fontSize="11">
              Duty cycle: <strong>{duty}%</strong> ON →
              LED appears <strong>{duty < 25 ? 'dim' : duty < 75 ? 'medium' : 'bright'}</strong>
            </text>
            <text x={W / 2} y={247} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">
              Arduino flips the pin ~490 times per second — too fast to see
            </text>
          </svg>

          {/* Duty slider */}
          <div className="max-w-sm mx-auto mt-2">
            <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
              <span>Duty cycle</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{duty}%</span>
            </label>
            <input type="range" min={0} max={100} value={duty}
              onChange={e => setDuty(+e.target.value)}
              className="w-full accent-amber-500" />
            <p className="text-xs text-gray-500 mt-1 text-center">
              <code>analogWrite(pin, {Math.round(duty * 2.55)})</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
