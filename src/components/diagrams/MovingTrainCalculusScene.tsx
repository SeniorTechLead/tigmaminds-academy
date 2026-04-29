/**
 * Tara watches a train pass. Over 1 second its position changes by a small
 * amount — the *instantaneous* speed at that moment. As the time interval
 * shrinks (from 1 s to 0.1 s to 0.01 s), the average speed approaches the
 * exact speed at one moment — that's the derivative.
 *
 * Used to open Calculus.
 */
import Tara from './people/Tara';

export default function MovingTrainCalculusScene() {
  const W = 760, H = 380;
  const groundY = 280;
  const trainY = groundY - 30;

  // Three "snapshots" of the train at 0s, 1s, 2s
  const snapshots = [
    { x: 200, t: '0 s', dist: '0 m' },
    { x: 380, t: '1 s', dist: '20 m' },
    { x: 560, t: '2 s', dist: '40 m' },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara watches a train pass: average speed over an interval shrinks toward the instantaneous speed at one moment">

        <defs>
          <linearGradient id="sky-tc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-tc)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          How fast is the train *right now*?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Calculus is the answer to "right now."
        </text>

        {/* Train tracks */}
        <line x1="0" y1={groundY - 6} x2={W} y2={groundY - 6} stroke="#475569" strokeWidth="3" />
        <line x1="0" y1={groundY - 14} x2={W} y2={groundY - 14} stroke="#475569" strokeWidth="3" />
        {/* Sleepers */}
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={i} x={i * 45 + 4} y={groundY - 18} width="14" height="16" fill="#7c2d12" />
        ))}

        {/* Three faded train snapshots */}
        {snapshots.map((s, i) => (
          <g key={i} opacity={i === 1 ? 1 : 0.4}>
            {/* Train body */}
            <rect x={s.x - 36} y={trainY - 28} width="72" height="32" rx="4" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
            {/* Window */}
            <rect x={s.x - 28} y={trainY - 22} width="14" height="14" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1" />
            <rect x={s.x - 8} y={trainY - 22} width="14" height="14" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1" />
            <rect x={s.x + 12} y={trainY - 22} width="14" height="14" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1" />
            {/* Wheels */}
            <circle cx={s.x - 22} cy={trainY + 6} r="6" fill="#0f172a" />
            <circle cx={s.x + 22} cy={trainY + 6} r="6" fill="#0f172a" />

            {/* Time label */}
            <rect x={s.x - 24} y={trainY - 60} width="48" height="20" rx="10"
              fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
            <text x={s.x} y={trainY - 46} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
              t = {s.t}
            </text>
          </g>
        ))}

        {/* Distance arrow at the bottom */}
        <line x1={snapshots[0].x} y1={groundY + 30} x2={snapshots[2].x} y2={groundY + 30}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arR-tc)" markerStart="url(#arL-tc)" />
        <defs>
          <marker id="arR-tc" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arL-tc" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#475569" />
          </marker>
        </defs>
        <rect x={(snapshots[0].x + snapshots[2].x) / 2 - 70} y={groundY + 36} width="140" height="20" rx="10"
          fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x={(snapshots[0].x + snapshots[2].x) / 2} y={groundY + 50} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">
          40 m in 2 s = 20 m/s
        </text>

        {/* Tara on lower left, looking at the train */}
        <Tara x={90} y={groundY + H - groundY} scale={0.85} pose="lookingUp" />

        {/* "Shrinking interval" annotation top right */}
        <rect x="540" y="74" width="200" height="68" rx="8"
          fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="640" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          As Δt shrinks
        </text>
        <text x="640" y="108" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">
          1s → 0.1s → 0.01s → 0
        </text>
        <text x="640" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">
          → instant speed
        </text>
        <text x="640" y="138" textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">
          (the derivative)
        </text>
      </svg>
    </div>
  );
}
