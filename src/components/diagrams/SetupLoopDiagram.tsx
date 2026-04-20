import { useState, useEffect } from 'react';

// ── Heartbeat of Every Arduino ───────────────────────────────
// Animated setup/loop cycle. Board boots → setup() runs once
// (flashes green) → loop() runs forever (cyclic arrow pulses).
// A loop counter ticks up showing just how often loop() runs.

export default function SetupLoopDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(id);
  }, [paused]);

  // Phase: 0 = boot, 1 = setup, 2 = loop
  // First 20 ticks: boot, next 30: setup, then loop forever
  let phase: 0 | 1 | 2;
  let phaseProgress = 0;
  if (tick < 20) {
    phase = 0;
    phaseProgress = tick / 20;
  } else if (tick < 50) {
    phase = 1;
    phaseProgress = (tick - 20) / 30;
  } else {
    phase = 2;
    phaseProgress = ((tick - 50) % 40) / 40;
  }

  const loopIterations = phase === 2 ? Math.floor((tick - 50) / 40) : 0;

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-emerald-50 dark:from-sky-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          The Heartbeat of Every Arduino
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
            loop #{loopIterations}
          </span>
          <button
            onClick={() => { setTick(0); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox="0 0 540 300" className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated Arduino execution flow — power on, setup() runs once, loop() runs forever">

        {/* Power on node */}
        <g opacity={phase === 0 ? 1 : 0.4}>
          <rect x={40} y={130} width={70} height={40} rx={8}
            fill={phase === 0 ? '#fbbf24' : '#e5e7eb'} className={phase !== 0 ? 'dark:fill-gray-700' : ''}
            stroke={phase === 0 ? '#f59e0b' : '#94a3b8'} strokeWidth="2"
            style={phase === 0 ? { filter: 'drop-shadow(0 0 8px #fbbf24)' } : undefined} />
          <text x={75} y={148} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100" fontSize="11" fontWeight="bold">
            ⚡ Power
          </text>
          <text x={75} y={162} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300" fontSize="9">
            on / reset
          </text>
        </g>

        {/* Arrow power → setup */}
        <line x1={115} y1={150} x2={170} y2={150}
          stroke={phase >= 1 ? '#10b981' : '#cbd5e1'} className={phase < 1 ? 'dark:stroke-gray-600' : ''}
          strokeWidth="2" markerEnd="url(#arrow1)" />

        {/* setup() node */}
        <g>
          <rect x={175} y={125} width={130} height={50} rx={8}
            fill={phase === 1 ? '#34d399' : phase > 1 ? '#d1fae5' : '#e5e7eb'}
            className={phase === 0 ? 'dark:fill-gray-700' : phase > 1 ? 'dark:fill-emerald-900/40' : ''}
            stroke={phase === 1 ? '#059669' : phase > 1 ? '#10b981' : '#94a3b8'}
            strokeWidth="2"
            style={phase === 1 ? { filter: 'drop-shadow(0 0 10px #34d399)' } : undefined} />
          <text x={240} y={145} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100" fontSize="12" fontWeight="bold">
            setup()
          </text>
          <text x={240} y={160} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300" fontSize="9">
            runs <strong>once</strong>
          </text>

          {phase === 1 && (
            <rect x={180} y={170} width={120 * phaseProgress} height={3} rx={1} fill="#059669" />
          )}
          {phase > 1 && (
            <text x={240} y={117} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="9" fontWeight="bold">
              ✓ done
            </text>
          )}
        </g>

        {/* Arrow setup → loop */}
        <line x1={310} y1={150} x2={365} y2={150}
          stroke={phase >= 2 ? '#10b981' : '#cbd5e1'} className={phase < 2 ? 'dark:stroke-gray-600' : ''}
          strokeWidth="2" markerEnd="url(#arrow1)" />

        {/* loop() node */}
        <g>
          <rect x={370} y={125} width={130} height={50} rx={8}
            fill={phase === 2 ? '#60a5fa' : '#e5e7eb'}
            className={phase !== 2 ? 'dark:fill-gray-700' : ''}
            stroke={phase === 2 ? '#3b82f6' : '#94a3b8'}
            strokeWidth="2"
            style={phase === 2 ? { filter: `drop-shadow(0 0 ${6 + Math.sin(tick * 0.3) * 4}px #60a5fa)` } : undefined} />
          <text x={435} y={145} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100" fontSize="12" fontWeight="bold">
            loop()
          </text>
          <text x={435} y={160} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300" fontSize="9">
            runs <strong>forever</strong>
          </text>
        </g>

        {/* Cycle arrow on loop */}
        {phase === 2 && (
          <g>
            {/* Curved arrow going back on itself */}
            <path d={`M 500,150 Q 530,150 530,200 Q 530,260 435,260 Q 340,260 340,200 Q 340,150 370,150`}
              fill="none" stroke="#3b82f6" strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeDashoffset={-tick * 2}
              opacity="0.7" />
            <path d={`M 370,150 L 365,145 L 365,155 Z`} fill="#3b82f6" />

            {/* Traveling dot along the cycle */}
            {(() => {
              const t = phaseProgress;
              // simple parametric on the bottom curve
              const path = [
                { x: 500, y: 150 }, { x: 525, y: 170 }, { x: 530, y: 200 },
                { x: 520, y: 230 }, { x: 500, y: 250 }, { x: 470, y: 260 },
                { x: 435, y: 260 }, { x: 400, y: 260 }, { x: 370, y: 250 },
                { x: 350, y: 230 }, { x: 340, y: 200 }, { x: 345, y: 170 },
                { x: 370, y: 150 },
              ];
              const idx = Math.min(path.length - 1, Math.floor(t * path.length));
              return <circle cx={path[idx].x} cy={path[idx].y} r="5" fill="#fbbf24" />;
            })()}

            <text x={435} y={207} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="9" fontWeight="600">
              ↻
            </text>
            <text x={435} y={223} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="9" fontWeight="600">
              forever
            </text>
          </g>
        )}

        {/* Arrows */}
        <defs>
          <marker id="arrow1" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#10b981" />
          </marker>
        </defs>

        {/* Bottom explanation */}
        <g>
          <rect x={30} y={30} width={480} height={60} rx={8}
            fill="#f8fafc" className="dark:fill-slate-800" stroke="#cbd5e1" className_dark="dark:stroke-gray-600" strokeWidth="1" />
          <text x={270} y={52} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200" fontSize="12" fontWeight="bold">
            {phase === 0 && '⚡ Board powered on — about to run setup()'}
            {phase === 1 && '🔧 setup() running — configuring pins, starting Serial...'}
            {phase === 2 && `🔁 loop() iteration #${loopIterations + 1} — reading sensors, updating outputs...`}
          </text>
          <text x={270} y={70} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
            {phase === 0 && 'Boot sequence: ~1 second after plugging in USB'}
            {phase === 1 && 'setup() runs once — typically takes a few ms'}
            {phase === 2 && 'On a typical Uno, loop() runs ~100,000 times per second'}
          </text>
        </g>
      </svg>
    </div>
  );
}
