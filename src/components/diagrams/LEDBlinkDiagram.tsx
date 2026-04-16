'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function LEDBlinkDiagram() {
  const [powered, setPowered] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [delay, setDelay] = useState(800);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    intervalRef.current = null;
    timerRef.current = null;
  }, []);

  useEffect(() => {
    cleanup();
    if (!powered) {
      setLedOn(false);
      setElapsed(0);
      return;
    }
    setElapsed(0);
    setLedOn(true);
    intervalRef.current = setInterval(() => {
      setLedOn(prev => !prev);
      setElapsed(0);
    }, delay);
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 50);
    }, 50);
    return cleanup;
  }, [powered, delay, cleanup]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 text-gray-900 dark:text-white font-mono select-none">
      <h3 className="text-center text-lg font-bold text-green-500 dark:text-green-400 mb-4">
        Your First Circuit — Blinking an LED
      </h3>

      {/* Circuit layout */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Arduino board */}
        <div className="relative w-32 h-44 bg-blue-900 rounded-lg border-2 border-blue-500 flex flex-col items-center justify-between p-2">
          <span className="text-[10px] text-blue-300 font-bold tracking-wide">ARDUINO</span>
          <div className="flex flex-col gap-1 w-full">
            {[13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2].map(pin => (
              <div key={pin} className="flex items-center gap-1">
                <div className={`w-2 h-1.5 rounded-sm ${pin === 2 ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                <span className={`text-[8px] ${pin === 2 ? 'text-yellow-400 font-bold' : 'text-gray-500'}`}>
                  {pin}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            <div className="flex flex-col items-center">
              <div className="w-2 h-1.5 rounded-sm bg-red-500" />
              <span className="text-[7px] text-red-400">5V</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-2 h-1.5 rounded-sm bg-gray-400" />
              <span className="text-[7px] text-gray-400">GND</span>
            </div>
          </div>
        </div>

        {/* Wire from pin 2 */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-1 bg-yellow-400 rounded" />
          <span className="text-[9px] text-yellow-500 dark:text-yellow-300">Pin 2</span>
        </div>

        {/* Resistor */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 rounded-sm border border-yellow-500 flex items-center justify-center">
            <div className="flex gap-0.5">
              {['bg-yellow-400', 'bg-purple-500', 'bg-black', 'bg-yellow-600'].map((c, i) => (
                <div key={i} className={`w-1 h-3 ${c} rounded-sm`} />
              ))}
            </div>
          </div>
          <span className="text-[9px] text-gray-500 dark:text-gray-400">220\u03a9</span>
        </div>

        {/* Wire to LED */}
        <div className="w-8 h-1 bg-yellow-400 rounded" />

        {/* LED */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full border-4 transition-all duration-100"
            style={{
              borderColor: ledOn ? '#22c55e' : '#9ca3af',
              backgroundColor: ledOn ? '#22c55e' : '#f3f4f6',
              boxShadow: ledOn
                ? '0 0 30px 10px rgba(34,197,94,0.6), 0 0 60px 20px rgba(34,197,94,0.3)'
                : 'none',
            }}
          />
          <span className={`text-sm font-bold ${ledOn ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {ledOn ? 'LED ON' : 'LED OFF'}
          </span>
        </div>

        {/* Wire back to GND */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-1 bg-gray-400 rounded" />
          <span className="text-[9px] text-gray-500 dark:text-gray-400">{'\u2192'} GND</span>
        </div>
      </div>

      {/* Timer bar */}
      {powered && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-50 ${ledOn ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500'}`}
              style={{ width: `${Math.min((elapsed / delay) * 100, 100)}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            Time until next toggle: {Math.max(delay - elapsed, 0)}ms
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <button
          onClick={() => setPowered(p => !p)}
          className={`px-8 py-3 rounded-lg text-lg font-bold transition-all ${
            powered
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/50'
          }`}
        >
          {powered ? '\u23f9 Power Off' : '\u26a1 Power On'}
        </button>

        <div className="w-full max-w-xs">
          <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1 text-center">
            Blink Speed: <span className="text-yellow-500 dark:text-yellow-400 font-bold">{delay}ms</span>
          </label>
          <input
            type="range"
            min={200}
            max={2000}
            step={50}
            value={delay}
            onChange={e => setDelay(Number(e.target.value))}
            className="w-full accent-yellow-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-500">
            <span>Fast (200ms)</span>
            <span>Slow (2000ms)</span>
          </div>
        </div>
      </div>

      {/* Live Arduino code */}
      <div className="bg-gray-100 dark:bg-gray-950 rounded-lg p-4 border border-gray-300 dark:border-gray-700 text-sm">
        <p className="text-gray-500 dark:text-gray-500 mb-2">// Arduino Code (updates live!):</p>
        <pre className="text-green-700 dark:text-green-300 whitespace-pre-wrap leading-relaxed">
{`void setup() {
  pinMode(2, OUTPUT);  // LED on pin 2
}

void loop() {
  digitalWrite(2, HIGH);  // LED ON
  delay(${delay});            // wait ${delay}ms
  digitalWrite(2, LOW);   // LED OFF
  delay(${delay});            // wait ${delay}ms
}`}
        </pre>
      </div>

      {/* Explanation */}
      <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="text-yellow-500 dark:text-yellow-400 font-bold mb-1">How it works:</p>
        <p><code className="text-green-600 dark:text-green-400">digitalWrite(2, HIGH)</code> = send power to pin 2 {'\u2192'} LED turns <span className="text-green-600 dark:text-green-400 font-bold">ON</span></p>
        <p><code className="text-green-600 dark:text-green-400">digitalWrite(2, LOW)</code> = cut power to pin 2 {'\u2192'} LED turns <span className="text-red-600 dark:text-red-400 font-bold">OFF</span></p>
        <p><code className="text-green-600 dark:text-green-400">delay({delay})</code> = wait {delay} milliseconds before the next step</p>
      </div>
    </div>
  );
}
