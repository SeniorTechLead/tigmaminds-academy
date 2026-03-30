import { useState, useEffect } from 'react';

export default function FireflySyncDiagram() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const w = 520, h = 340;
  const rowY = { before: 80, after: 250 };
  const startX = 60;
  const spacing = 90;
  const fireflyR = 14;

  // Each "before" firefly has a random fixed phase offset (degrees)
  const phases = [0, 72, 200, 130, 290];

  // Glow intensity: 0 to 1 based on sine wave
  const glowAt = (phaseDeg: number) => {
    const rad = ((tick + phaseDeg) % 360) * (Math.PI / 180);
    return Math.max(0, Math.sin(rad));
  };

  // Small clock icon showing phase
  const ClockIcon = ({ cx, cy, phaseDeg }: { cx: number; cy: number; phaseDeg: number }) => {
    const r = 7;
    const handAngle = ((tick + phaseDeg) % 360) * (Math.PI / 180) - Math.PI / 2;
    const hx = cx + Math.cos(handAngle) * (r - 2);
    const hy = cy + Math.sin(handAngle) * (r - 2);
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#64748b" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="1" className="fill-gray-500 dark:fill-slate-400" />
      </g>
    );
  };

  // Single firefly with glow
  const Firefly = ({ cx, cy, intensity }: { cx: number; cy: number; intensity: number }) => {
    const glowColor = `rgba(190, 242, 100, ${intensity * 0.6})`;
    const coreColor = `rgba(250, 240, 100, ${0.3 + intensity * 0.7})`;
    return (
      <g>
        {/* Outer glow */}
        <circle cx={cx} cy={cy} r={fireflyR + 10} fill={glowColor} />
        {/* Mid glow */}
        <circle cx={cx} cy={cy} r={fireflyR + 4} fill={`rgba(210, 250, 80, ${intensity * 0.4})`} />
        {/* Body */}
        <circle cx={cx} cy={cy} r={fireflyR} className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1.5" />
        {/* Core light */}
        <circle cx={cx} cy={cy} r={fireflyR - 4} fill={coreColor} />
      </g>
    );
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        How Fireflies Learn to Flash Together
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Firefly synchronization diagram">
        {/* Tiny background stars */}
        {Array.from({ length: 20 }, (_, i) => (
          <circle
            key={`star-${i}`}
            cx={(i * 137.5) % w}
            cy={(i * 73.1) % h}
            r={0.6 + (i % 3) * 0.4}
            fill="white"
            opacity={0.15 + (i % 4) * 0.05}
          />
        ))}

        {/* "Before" label */}
        <text x={w / 2} y={rowY.before - 38} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="13" fontWeight="600">
          Before — each firefly flashes on its own
        </text>

        {/* Before row: staggered phases */}
        {phases.map((phase, i) => {
          const cx = startX + i * spacing;
          const cy = rowY.before;
          const intensity = glowAt(phase);
          return (
            <g key={`before-${i}`}>
              <Firefly cx={cx} cy={cy} intensity={intensity} />
              <ClockIcon cx={cx + 18} cy={cy - 34} phaseDeg={phase} />
            </g>
          );
        })}

        {/* Arrow + explanation between rows */}
        <defs>
          <marker id="sync-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#4ade80" />
          </marker>
        </defs>
        <line
          x1={w / 2} y1={rowY.before + 35}
          x2={w / 2} y2={rowY.after - 40}
          stroke="#4ade80" strokeWidth="2" strokeDasharray="6 3"
          markerEnd="url(#sync-arrow)"
        />
        <text x={w / 2} y={(rowY.before + rowY.after) / 2 + 4} textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="500">
          Each firefly watches its neighbor and adjusts
        </text>

        {/* "After" label */}
        <text x={w / 2} y={rowY.after - 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="13" fontWeight="600">
          After — all flash together!
        </text>

        {/* After row: all in sync (phase 0) */}
        {phases.map((_, i) => {
          const cx = startX + i * spacing;
          const cy = rowY.after;
          const intensity = glowAt(0);
          return (
            <g key={`after-${i}`}>
              <Firefly cx={cx} cy={cy} intensity={intensity} />
              <ClockIcon cx={cx + 18} cy={cy - 34} phaseDeg={0} />
            </g>
          );
        })}

        {/* Bottom note */}
        <text x={w / 2} y={h - 8} textAnchor="middle" fill="#6b7280" fontSize="9">
          This is called "emergent synchronization" — simple rules, amazing results
        </text>
      </svg>
    </div>
  );
}
