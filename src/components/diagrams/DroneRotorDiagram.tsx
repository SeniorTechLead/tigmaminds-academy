export default function DroneRotorDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="How a quadcopter drone flies: four rotors generating lift, with direction control">
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f43f5e">How a Drone Flies: 4 Rotors, No Wings</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Each rotor pushes air down → drone goes up (Newton's Third Law)</text>

        {/* Drone body - top view */}
        <g transform="translate(390, 240)">
          {/* Arms */}
          <line x1="-120" y1="-120" x2="120" y2="120" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
          <line x1="120" y1="-120" x2="-120" y2="120" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

          {/* Center body */}
          <rect x="-30" y="-20" width="60" height="40" rx="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#67e8f9">CPU</text>

          {/* Rotors */}
          {[
            { x: -120, y: -120, dir: 'CW', color: '#3b82f6' },
            { x: 120, y: -120, dir: 'CCW', color: '#ef4444' },
            { x: -120, y: 120, dir: 'CCW', color: '#ef4444' },
            { x: 120, y: 120, dir: 'CW', color: '#3b82f6' },
          ].map((r, i) => (
            <g key={i} transform={`translate(${r.x}, ${r.y})`}>
              <circle r="55" fill={r.color} opacity="0.08" stroke={r.color} strokeWidth="1.5" strokeDasharray="4,2" />
              <circle r="8" fill="#475569" />
              {/* Rotation arrow */}
              <path d={r.dir === 'CW' ? 'M -30 -15 A 33 33 0 1 1 -15 -30' : 'M 30 -15 A 33 33 0 1 0 15 -30'} fill="none" stroke={r.color} strokeWidth="2" markerEnd={`url(#rotor-arr-${i})`} />
              <text x="0" y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill={r.color}>{r.dir}</text>
            </g>
          ))}
        </g>

        <defs>
          {[0, 1, 2, 3].map(i => (
            <marker key={i} id={`rotor-arr-${i}`} markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <path d="M0,0 L6,2.5 L0,5" fill={[0, 3].includes(i) ? '#3b82f6' : '#ef4444'} />
            </marker>
          ))}
        </defs>

        {/* Thrust arrows - upward */}
        {[
          { x: 270, y: 120 }, { x: 510, y: 120 },
          { x: 270, y: 360 }, { x: 510, y: 360 },
        ].map((a, i) => (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={a.x} y2={a.y - 40} stroke="#22c55e" strokeWidth="3" markerEnd="url(#thrust-up)" />
          </g>
        ))}
        <defs>
          <marker id="thrust-up" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
            <path d="M0,6 L4,0 L8,6" fill="#22c55e" />
          </marker>
        </defs>

        <text x="200" y="82" fontSize="11" fontWeight="600" fill="#22c55e">↑ Thrust</text>
        <text x="545" y="82" fontSize="11" fontWeight="600" fill="#22c55e">↑ Thrust</text>

        {/* Labels */}
        <text x="390" y="415" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Top-down view of a quadcopter</text>

        {/* Key explanations */}
        <rect x="50" y="440" width="210" height="55" rx="6" fill="#3b82f6" opacity="0.08" stroke="#3b82f6" strokeWidth="1" />
        <text x="155" y="460" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">Diagonal pair: same direction</text>
        <text x="155" y="478" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Cancels torque so drone stays level</text>

        <rect x="285" y="440" width="210" height="55" rx="6" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="1" />
        <text x="390" y="460" textAnchor="middle" fontSize="11" fontWeight="600" fill="#22c55e">All 4 fast = go up</text>
        <text x="390" y="478" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Thrust &gt; weight → drone rises</text>

        <rect x="520" y="440" width="210" height="55" rx="6" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
        <text x="625" y="460" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">Rear faster = tilt forward</text>
        <text x="625" y="478" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Unequal thrust → drone moves</text>
      </svg>
    </div>
  );
}
