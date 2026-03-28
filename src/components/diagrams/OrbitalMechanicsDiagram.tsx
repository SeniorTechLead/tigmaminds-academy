const OrbitalMechanicsDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Orbital mechanics diagram showing a satellite in circular orbit around Earth with velocity and gravity vectors"
      >
        <style>{`
          @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .satellite-orbit {
            animation: orbit 12s linear infinite;
            transform-origin: 200px 195px;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="orb-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="orb-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <radialGradient id="orb-earth-grad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="200" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Orbital Mechanics
        </text>

        {/* Orbit path (dashed circle) */}
        <circle cx="200" cy="195" r="120"
          fill="none" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="8 5" />

        {/* Earth */}
        <circle cx="200" cy="195" r="40" fill="url(#orb-earth-grad)" />
        <ellipse cx="190" cy="188" rx="10" ry="16"
          fill="#22c55e" opacity="0.5" />
        <ellipse cx="210" cy="200" rx="7" ry="9"
          fill="#22c55e" opacity="0.5" />
        <text x="200" y="199" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          Earth
        </text>

        {/* Satellite with orbit animation */}
        <g className="satellite-orbit">
          {/* Satellite at top of orbit */}
          <g transform="translate(200, 75)">
            {/* Satellite body */}
            <rect x="-6" y="-5" width="12" height="10" rx="2"
              className="fill-slate-500 dark:fill-slate-400 stroke-slate-700 dark:stroke-slate-300" strokeWidth="1" />
            {/* Solar panels */}
            <rect x="-20" y="-3" width="12" height="6" rx="1"
              fill="#3b82f6" className="stroke-slate-600 dark:stroke-slate-400" strokeWidth="0.5" />
            <rect x="8" y="-3" width="12" height="6" rx="1"
              fill="#3b82f6" className="stroke-slate-600 dark:stroke-slate-400" strokeWidth="0.5" />
          </g>
        </g>

        {/* Static reference satellite position (at top) for vectors */}
        {/* Velocity vector — tangent to orbit (horizontal right) */}
        <line x1="215" y1="75" x2="265" y2="75"
          stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#orb-arrow-green)" />
        <text x="270" y="72" className="label-text fill-green-600 dark:fill-green-400" style={{ fontSize: '10px' }}>
          v (velocity)
        </text>
        <text x="270" y="84" className="label-text fill-green-600 dark:fill-green-400" style={{ fontSize: '10px' }}>
          tangent to orbit
        </text>

        {/* Gravity vector — toward Earth center (downward) */}
        <line x1="200" y1="85" x2="200" y2="135"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#orb-arrow-red)" />
        <text x="160" y="115" textAnchor="end"
          className="label-text fill-red-600 dark:fill-red-400" style={{ fontSize: '10px' }}>
          Gravity
        </text>
        <text x="160" y="127" textAnchor="end"
          className="label-text fill-red-600 dark:fill-red-400" style={{ fontSize: '10px' }}>
          (toward center)
        </text>

        {/* Orbit radius label */}
        <line x1="200" y1="155" x2="200" y2="85"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="188" y="150" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          r
        </text>

        {/* Explanation box */}
        <rect x="50" y="340" width="300" height="40" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="200" y="358" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200" style={{ fontSize: '11px' }}>
          Gravity provides the centripetal force
        </text>
        <text x="200" y="373" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          that keeps the satellite in circular orbit
        </text>
      </svg>
    </div>
  );
};

export default OrbitalMechanicsDiagram;
