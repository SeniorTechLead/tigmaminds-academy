'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function VariableSpeedDiagram() {
  const [speed, setSpeed] = useState(1000);
  const [running, setRunning] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [history, setHistory] = useState<number[]>([1000]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    cleanup();
    if (!running) {
      setLedOn(false);
      return;
    }
    setLedOn(true);
    intervalRef.current = setInterval(() => {
      setLedOn(prev => !prev);
    }, speed);
    return cleanup;
  }, [running, speed, cleanup]);

  const decrement = () => {
    setSpeed(prev => {
      const next = Math.max(prev - 50, 100);
      setHistory(h => [...h.slice(-19), next]);
      return next;
    });
  };

  const handleSlider = (val: number) => {
    setSpeed(val);
    setHistory(h => [...h.slice(-19), val]);
  };

  const reset = () => {
    setSpeed(1000);
    setHistory([1000]);
    setRunning(false);
  };

  // Gauge calculations
  const gaugeAngle = -135 + ((2000 - speed) / 1900) * 270; // faster = more angle
  const gaugePercent = ((2000 - speed) / 1900) * 100;

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 text-gray-900 dark:text-white font-mono select-none">
      <h3 className="text-center text-lg font-bold text-cyan-400 mb-4">
        Variables Control Everything
      </h3>

      {/* Variable box */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 border-2 border-cyan-500 rounded-lg px-6 py-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Variable declaration:</p>
          <p className="text-2xl">
            <span className="text-blue-400">int</span>{' '}
            <span className="text-yellow-400">speed</span>{' '}
            <span className="text-gray-500 dark:text-gray-400">=</span>{' '}
            <span className="text-green-400 font-bold text-3xl">{speed}</span>
            <span className="text-gray-500 dark:text-gray-400">;</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: LED + Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* LED */}
          <div
            className="w-24 h-24 rounded-full border-4 transition-all duration-75"
            style={{
              borderColor: ledOn ? '#f59e0b' : '#374151',
              backgroundColor: ledOn ? '#f59e0b' : '#111827',
              boxShadow: ledOn
                ? '0 0 40px 15px rgba(245,158,11,0.5), 0 0 80px 30px rgba(245,158,11,0.2)'
                : 'none',
            }}
          />
          <span className={`text-sm font-bold ${running ? 'text-amber-400' : 'text-gray-500'}`}>
            {running ? `Blinking every ${speed}ms` : 'Stopped'}
          </span>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => setRunning(r => !r)}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                running
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {running ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={decrement}
              className="px-5 py-2 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 transition-all"
            >
              speed = speed - 50
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 rounded-lg font-bold bg-gray-600 hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Slider */}
          <div className="w-full max-w-xs">
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 text-center">
              Or drag to set speed:
            </label>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={speed}
              onChange={e => handleSlider(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-500">
              <span>100ms (fast!)</span>
              <span>2000ms (slow)</span>
            </div>
          </div>
        </div>

        {/* Right: Speedometer gauge */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 200 140" className="w-48 h-auto">
            {/* Gauge background arc */}
            <path
              d="M 20 120 A 80 80 0 1 1 180 120"
              fill="none"
              stroke="#374151"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Gauge fill arc */}
            <path
              d="M 20 120 A 80 80 0 1 1 180 120"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${gaugePercent * 2.51} 251`}
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            {/* Needle */}
            <line
              x1="100"
              y1="120"
              x2={100 + 60 * Math.cos((gaugeAngle * Math.PI) / 180)}
              y2={120 + 60 * Math.sin((gaugeAngle * Math.PI) / 180)}
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="120" r="5" fill="#ffffff" />
            {/* Labels */}
            <text x="15" y="138" fill="#6b7280" fontSize="9" fontFamily="monospace">Slow</text>
            <text x="160" y="138" fill="#6b7280" fontSize="9" fontFamily="monospace">Fast</text>
            <text x="100" y="108" textAnchor="middle" fill="#22d3ee" fontSize="22" fontWeight="bold" fontFamily="monospace">
              {speed}
            </text>
            <text x="100" y="120" textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="monospace">ms</text>
          </svg>

          {/* History trail */}
          <div className="mt-2 w-full">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 text-center">Speed history:</p>
            <div className="flex gap-1 justify-center flex-wrap">
              {history.slice(-10).map((v, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    i === history.slice(-10).length - 1
                      ? 'bg-cyan-800 text-cyan-300 font-bold'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live code */}
      <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-300 dark:border-gray-700 text-sm">
        <p className="text-gray-500 mb-2">// Arduino Code (updates live!):</p>
        <pre className="text-green-300 whitespace-pre-wrap leading-relaxed">
{`int speed = ${speed};  // ← this variable controls timing

void setup() {
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  delay(speed);          // wait 'speed' milliseconds
  digitalWrite(2, LOW);
  delay(speed);
  speed = speed - 50;    // go faster each loop!
  if (speed < 100) {
    speed = 100;          // don't go below 100ms
  }
}`}
        </pre>
      </div>

      <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <p className="text-cyan-400 font-bold mb-1">Key idea:</p>
        <p>A <span className="text-yellow-400">variable</span> is a named box that holds a number. Instead of writing <code className="text-green-400">delay(1000)</code> everywhere, we write <code className="text-green-400">delay(speed)</code> and change <code className="text-yellow-400">speed</code> whenever we want. One variable controls the whole program!</p>
      </div>
    </div>
  );
}
