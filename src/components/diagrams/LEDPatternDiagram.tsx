'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type Pattern = 'chase' | 'bounce' | 'allFlash' | 'random';

const LED_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
const LED_PINS = [2, 3, 4, 5, 6, 7];

export default function LEDPatternDiagram() {
  const [activeLeds, setActiveLeds] = useState<boolean[]>(Array(6).fill(false));
  const [pattern, setPattern] = useState<Pattern>('chase');
  const [speed, setSpeed] = useState(300);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // for bounce
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);
  const dirRef = useRef(1);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const advanceStep = useCallback(() => {
    const s = stepRef.current;
    const d = dirRef.current;
    let next: boolean[];
    let nextStep: number;
    let nextDir = d;

    switch (pattern) {
      case 'chase':
        next = Array(6).fill(false);
        nextStep = (s + 1) % 6;
        next[nextStep] = true;
        break;
      case 'bounce':
        next = Array(6).fill(false);
        nextStep = s + d;
        if (nextStep >= 5) { nextStep = 5; nextDir = -1; }
        if (nextStep <= 0) { nextStep = 0; nextDir = 1; }
        next[nextStep] = true;
        break;
      case 'allFlash':
        nextStep = s + 1;
        next = Array(6).fill(nextStep % 2 === 0);
        break;
      case 'random':
        next = Array(6).fill(false).map(() => Math.random() > 0.5);
        nextStep = s + 1;
        break;
      default:
        next = Array(6).fill(false);
        nextStep = 0;
    }

    stepRef.current = nextStep;
    dirRef.current = nextDir;
    setStepIndex(nextStep);
    setDirection(nextDir);
    setActiveLeds(next);
  }, [pattern]);

  useEffect(() => {
    cleanup();
    stepRef.current = 0;
    dirRef.current = 1;
    setStepIndex(0);
    setDirection(1);
    setActiveLeds(Array(6).fill(false));
    if (!running) return;
    advanceStep();
    intervalRef.current = setInterval(advanceStep, speed);
    return cleanup;
  }, [running, speed, pattern, advanceStep, cleanup]);

  const handleStep = () => {
    if (running) return;
    advanceStep();
  };

  const resetAll = () => {
    setRunning(false);
    stepRef.current = 0;
    dirRef.current = 1;
    setStepIndex(0);
    setDirection(1);
    setActiveLeds(Array(6).fill(false));
  };

  const activeIndex = pattern === 'chase' || pattern === 'bounce' ? stepIndex : -1;

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 text-gray-900 dark:text-white font-mono select-none">
      <h3 className="text-center text-lg font-bold text-purple-400 mb-4">
        Multiple LEDs in Sequence
      </h3>

      {/* LED row */}
      <div className="flex justify-center gap-4 mb-6">
        {LED_COLORS.map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 transition-all duration-75"
              style={{
                borderColor: activeLeds[i] ? color : '#374151',
                backgroundColor: activeLeds[i] ? color : '#111827',
                boxShadow: activeLeds[i]
                  ? `0 0 25px 8px ${color}80, 0 0 50px 15px ${color}40`
                  : 'none',
              }}
            />
            <span className="text-[10px] text-gray-500 dark:text-gray-500">Pin {LED_PINS[i]}</span>
          </div>
        ))}
      </div>

      {/* Array visualization */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">The array in memory:</p>
        <div className="flex justify-center gap-1 items-end">
          <span className="text-blue-400 text-sm">int leds[] = {'{'}</span>
          {LED_PINS.map((pin, i) => (
            <span key={i}>
              <span
                className={`inline-block px-2 py-1 rounded text-sm font-bold transition-all ${
                  activeIndex === i
                    ? 'bg-yellow-500 text-black scale-110'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {pin}
              </span>
              {i < 5 && <span className="text-gray-500 dark:text-gray-500">, </span>}
            </span>
          ))}
          <span className="text-blue-400 text-sm">{'}'}</span>
        </div>
        {activeIndex >= 0 && (
          <p className="text-xs text-yellow-400 mt-2">
            leds[<span className="font-bold">{activeIndex}</span>] = {LED_PINS[activeIndex]} → Pin {LED_PINS[activeIndex]} is ON
          </p>
        )}
      </div>

      {/* Pattern selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {([
          ['chase', 'Chase →', 'LEDs light up one after another, left to right'],
          ['bounce', 'Bounce ↔', 'LED bounces back and forth like a ping-pong ball'],
          ['allFlash', 'All Flash', 'All LEDs flash on and off together'],
          ['random', 'Random', 'Each LED randomly turns on or off'],
        ] as [Pattern, string, string][]).map(([p, label, _desc]) => (
          <button
            key={p}
            onClick={() => { setPattern(p); resetAll(); }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              pattern === p
                ? 'bg-purple-600 ring-2 ring-purple-400 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Description of current pattern */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        {pattern === 'chase' && 'LEDs light up one after another, left to right, then repeat.'}
        {pattern === 'bounce' && 'The lit LED bounces back and forth like a ping-pong ball.'}
        {pattern === 'allFlash' && 'All 6 LEDs flash on and off together in unison.'}
        {pattern === 'random' && 'Each LED randomly decides to be on or off each step.'}
      </p>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button
          onClick={() => setRunning(r => !r)}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            running ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {running ? 'Stop' : 'Play'}
        </button>
        <button
          onClick={handleStep}
          disabled={running}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            running
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Step →
        </button>
        <button
          onClick={resetAll}
          className="px-6 py-2 rounded-lg font-bold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          Reset
        </button>
      </div>

      {/* Speed slider */}
      <div className="w-full max-w-xs mx-auto mb-6">
        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 text-center">
          Animation speed: <span className="text-purple-400 font-bold">{speed}ms</span>
        </label>
        <input
          type="range"
          min={50}
          max={800}
          step={25}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="w-full accent-purple-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-500">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>

      {/* Live code */}
      <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-300 dark:border-gray-700 text-sm">
        <p className="text-gray-500 mb-2">// Arduino Code for &ldquo;{pattern}&rdquo; pattern:</p>
        <pre className="text-green-300 whitespace-pre-wrap leading-relaxed">
{pattern === 'chase' ? `int leds[] = {2, 3, 4, 5, 6, 7};

void loop() {
  for (int i = 0; i < 6; i++) {
    digitalWrite(leds[i], HIGH);  // turn ON
    delay(${speed});
    digitalWrite(leds[i], LOW);   // turn OFF
  }
}` : pattern === 'bounce' ? `int leds[] = {2, 3, 4, 5, 6, 7};
int i = 0, dir = 1;

void loop() {
  digitalWrite(leds[i], HIGH);
  delay(${speed});
  digitalWrite(leds[i], LOW);
  i = i + dir;
  if (i >= 5 || i <= 0) dir = -dir;
}` : pattern === 'allFlash' ? `int leds[] = {2, 3, 4, 5, 6, 7};

void loop() {
  for (int i = 0; i < 6; i++)
    digitalWrite(leds[i], HIGH); // all ON
  delay(${speed});
  for (int i = 0; i < 6; i++)
    digitalWrite(leds[i], LOW);  // all OFF
  delay(${speed});
}` : `int leds[] = {2, 3, 4, 5, 6, 7};

void loop() {
  for (int i = 0; i < 6; i++) {
    if (random(2) == 1)
      digitalWrite(leds[i], HIGH);
    else
      digitalWrite(leds[i], LOW);
  }
  delay(${speed});
}`}
        </pre>
      </div>

      <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <p className="text-purple-400 font-bold mb-1">Key idea:</p>
        <p>An <span className="text-yellow-400">array</span> stores multiple values in one variable. <code className="text-green-400">leds[0]</code> is pin 2, <code className="text-green-400">leds[1]</code> is pin 3, and so on. A <code className="text-green-400">for</code> loop walks through each index to control all LEDs with just a few lines of code.</p>
      </div>
    </div>
  );
}
