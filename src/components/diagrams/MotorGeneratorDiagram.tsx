const MotorGeneratorDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 580 296"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Motor and generator comparison diagram showing current-in rotation-out for motor and rotation-in current-out for generator"
      >
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .motor-coil {
            animation: spin 3s linear infinite;
            transform-origin: 135px 120px;
          }
          .gen-coil {
            animation: spin 3s linear infinite;
            transform-origin: 385px 120px;
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
          .section-title {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="mg-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="mg-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="mg-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="mg-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="520" height="250" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Divider line */}
        <line x1="260" y1="15" x2="260" y2="235"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="6 4" />

        {/* === MOTOR (Left Side) === */}
        <text x="135" y="24" textAnchor="middle"
          className="section-title fill-red-600 dark:fill-red-400">
          Motor
        </text>
        <text x="135" y="38" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Current in → Rotation out
        </text>

        {/* Motor magnets */}
        <rect x="60" y="80" width="20" height="80" rx="3"
          className="fill-red-400 dark:fill-red-600 stroke-red-600 dark:stroke-red-400" strokeWidth="1.5" />
        <text x="70" y="124" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          N
        </text>

        <rect x="190" y="80" width="20" height="80" rx="3"
          className="fill-blue-400 dark:fill-blue-600 stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.5" />
        <text x="200" y="124" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          S
        </text>

        {/* Motor coil (rotating) */}
        <g className="motor-coil">
          <rect x="110" y="95" width="50" height="50" rx="3"
            fill="none" stroke="#f97316" strokeWidth="2.5" />
        </g>

        {/* Motor axle */}
        <circle cx="135" cy="120" r="4"
          className="fill-slate-500 dark:fill-slate-400 stroke-slate-600 dark:stroke-slate-300" strokeWidth="1" />

        {/* Current input arrow (red) */}
        <line x1="95" y1="180" x2="95" y2="155"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#mg-arrow-red)" />
        <text x="95" y="195" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" style={{ fontSize: '10px' }}>
          Current in
        </text>

        {/* Rotation output arrow (curved) */}
        <path d="M 155 70 A 30 30 0 0 1 175 85" fill="none"
          stroke="#22c55e" strokeWidth="2" markerEnd="url(#mg-arrow-green)" />
        <text x="175" y="65" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400" style={{ fontSize: '10px' }}>
          Rotation
        </text>

        {/* Battery symbol */}
        <rect x="110" y="206" width="50" height="18" rx="3"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="135" y="219" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px' }}>
          Battery
        </text>

        {/* === GENERATOR (Right Side) === */}
        <text x="385" y="24" textAnchor="middle"
          className="section-title fill-blue-600 dark:fill-blue-400">
          Generator
        </text>
        <text x="385" y="38" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Rotation in → Current out
        </text>

        {/* Generator magnets */}
        <rect x="310" y="80" width="20" height="80" rx="3"
          className="fill-red-400 dark:fill-red-600 stroke-red-600 dark:stroke-red-400" strokeWidth="1.5" />
        <text x="320" y="124" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          N
        </text>

        <rect x="440" y="80" width="20" height="80" rx="3"
          className="fill-blue-400 dark:fill-blue-600 stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.5" />
        <text x="450" y="124" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          S
        </text>

        {/* Generator coil (rotating) */}
        <g className="gen-coil">
          <rect x="360" y="95" width="50" height="50" rx="3"
            fill="none" stroke="#f97316" strokeWidth="2.5" />
        </g>

        {/* Generator axle */}
        <circle cx="385" cy="120" r="4"
          className="fill-slate-500 dark:fill-slate-400 stroke-slate-600 dark:stroke-slate-300" strokeWidth="1" />

        {/* Rotation input arrow (curved, amber) */}
        <path d="M 405 70 A 30 30 0 0 1 425 85" fill="none"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#mg-arrow-amber)" />
        <text x="425" y="65" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          Rotation
        </text>

        {/* Current output arrow (blue) */}
        <line x1="345" y1="155" x2="345" y2="180"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#mg-arrow-blue)" />
        <text x="345" y="195" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          Current out
        </text>

        {/* Light bulb symbol */}
        <circle cx="385" cy="214" r="12"
          className="fill-yellow-100 dark:fill-yellow-900 stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" />
        <text x="385" y="218" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          💡
        </text>
        <text x="385" y="238" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Load
        </text>

        {/* Bottom comparison */}
        <text x="260" y="246" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Same device — reverse energy conversion
        </text>
      </svg>
    </div>
  );
};

export default MotorGeneratorDiagram;
