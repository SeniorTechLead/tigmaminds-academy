import { useState, useRef } from 'react';

export default function ActivityRaceTimerDiagram() {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setPhase('running');
    const now = Date.now();
    setStartTime(now);
    intervalRef.current = setInterval(() => {
      setElapsed((Date.now() - now) / 1000);
    }, 50);
  };

  const stop = () => {
    setPhase('done');
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed((Date.now() - startTime) / 1000);
  };

  const reset = () => {
    setPhase('idle');
    setElapsed(0);
    setDistance('');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const dist = parseFloat(distance) || 0;
  const speed = elapsed > 0 && dist > 0 ? dist / elapsed : 0;

  /* Compare to animals */
  const comparisons = [
    { name: 'Garden snail', speed: 0.013, emoji: '🐌' },
    { name: 'Tortoise',     speed: 0.08,  emoji: '🐢' },
    { name: 'Human walk',   speed: 1.4,   emoji: '🚶' },
    { name: 'Human sprint', speed: 10,    emoji: '🏃' },
    { name: 'Hare',         speed: 19.4,  emoji: '🐇' },
    { name: 'Cheetah',      speed: 30,    emoji: '🐆' },
  ];

  const closest = speed > 0
    ? comparisons.reduce((prev, curr) =>
        Math.abs(curr.speed - speed) < Math.abs(prev.speed - speed) ? curr : prev
      )
    : null;

  return (
    <div className="w-full max-w-xl mx-auto my-4 rounded-xl bg-white dark:bg-slate-900 p-5 border border-gray-200 dark:border-slate-700">
      <h3 className="text-center text-gray-900 dark:text-slate-100 font-bold text-lg mb-1">
        Activity: Measure Your Speed
      </h3>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-4">
        Mark a distance outside, time yourself, then calculate your speed.
      </p>

      {/* Distance input */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-slate-300 text-sm whitespace-nowrap">Distance (m):</label>
        <input
          type="number"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          placeholder="e.g. 20"
          className="flex-1 bg-slate-800 text-gray-900 dark:text-slate-100 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
          min={0}
          step={0.1}
        />
      </div>

      {/* Timer display */}
      <div className="text-center mb-4">
        <div className="text-5xl font-mono text-cyan-400 tabular-nums">
          {elapsed.toFixed(2)}
          <span className="text-lg text-gray-500 dark:text-slate-400 ml-1">s</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center mb-4">
        {phase === 'idle' && (
          <button
            onClick={start}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Start
          </button>
        )}
        {phase === 'running' && (
          <button
            onClick={stop}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Stop
          </button>
        )}
        {phase === 'done' && (
          <button
            onClick={reset}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results */}
      {phase === 'done' && dist > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">Distance</div>
              <div className="text-gray-900 dark:text-slate-100 font-bold">{dist.toFixed(1)} m</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">Time</div>
              <div className="text-gray-900 dark:text-slate-100 font-bold">{elapsed.toFixed(2)} s</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-slate-400 text-xs">Speed</div>
              <div className="text-cyan-400 font-bold">{speed.toFixed(2)} m/s</div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-300 mb-2">
            speed = distance ÷ time = {dist.toFixed(1)} ÷ {elapsed.toFixed(2)} = <span className="text-cyan-400 font-semibold">{speed.toFixed(2)} m/s</span>
          </div>

          {closest && (
            <div className="text-center mt-3 p-2 bg-slate-700/50 rounded-lg">
              <div className="text-gray-500 dark:text-slate-400 text-xs mb-1">Closest animal match:</div>
              <div className="text-lg">
                <span className="mr-2">{closest.emoji}</span>
                <span className="text-gray-900 dark:text-slate-100 font-semibold">{closest.name}</span>
                <span className="text-gray-500 dark:text-slate-400 text-sm ml-2">({closest.speed} m/s)</span>
              </div>
            </div>
          )}

          {/* Comparison bar */}
          <div className="mt-3 space-y-1">
            {comparisons.map(c => {
              const maxSpd = 32;
              const barPct = Math.min((c.speed / maxSpd) * 100, 100);
              const youPct = Math.min((speed / maxSpd) * 100, 100);
              return (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-slate-400 w-24 text-right truncate">{c.emoji} {c.name}</span>
                  <div className="flex-1 h-3 bg-slate-700 rounded-full relative overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-500"
                      style={{ width: `${barPct}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-cyan-400"
                      style={{ left: `${youPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-14">{c.speed} m/s</span>
                </div>
              );
            })}
            <div className="text-center text-xs text-cyan-400 mt-1">
              Cyan line = your speed
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && dist <= 0 && (
        <div className="text-center text-amber-400 text-sm">
          Enter a distance above to calculate your speed.
        </div>
      )}
    </div>
  );
}
