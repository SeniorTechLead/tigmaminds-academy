const BuoyancyDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Buoyancy diagram showing an object half-submerged in water with weight and buoyant force arrows"
      >
        <style>{`
          @keyframes bobbing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .bob { animation: bobbing 3s ease-in-out infinite; }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="buoy-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="buoy-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <clipPath id="water-clip">
            <rect x="80" y="140" width="200" height="130" />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width="400" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="200" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Buoyancy (Archimedes' Principle)
        </text>

        {/* Container walls */}
        <rect x="80" y="60" width="200" height="210" rx="4"
          className="fill-none stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Water fill */}
        <rect x="81" y="140" width="198" height="129" rx="2"
          fill="#3b82f6" opacity="0.2" />

        {/* Water surface line */}
        <line x1="80" y1="140" x2="280" y2="140"
          stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="285" y="144" className="label-text fill-blue-600 dark:fill-blue-400">
          Water surface
        </text>

        {/* Object (half submerged) */}
        <g className="bob">
          <rect x="145" y="110" width="70" height="60" rx="4"
            className="fill-amber-200 dark:fill-amber-600 stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
          <text x="180" y="144" textAnchor="middle"
            className="label-text fill-amber-800 dark:fill-amber-100">
            Object
          </text>

          {/* Displaced water highlight */}
          <rect x="145" y="140" width="70" height="30" rx="2"
            fill="#3b82f6" opacity="0.35" clipPath="url(#water-clip)" />

          {/* Weight arrow (down) */}
          <line x1="180" y1="175" x2="180" y2="225"
            stroke="#ef4444" strokeWidth="3" markerEnd="url(#buoy-arrow-red)" />

          {/* Buoyant force arrow (up) */}
          <line x1="180" y1="105" x2="180" y2="58"
            stroke="#3b82f6" strokeWidth="3" markerEnd="url(#buoy-arrow-blue)" />
        </g>

        {/* Labels for forces */}
        <text x="195" y="235" className="label-text fill-red-600 dark:fill-red-400">
          Weight (W)
        </text>
        <text x="195" y="55" className="label-text fill-blue-600 dark:fill-blue-400">
          Buoyant force (F_b)
        </text>

        {/* Displaced water label */}
        <text x="85" y="160" className="label-text fill-blue-700 dark:fill-blue-300" style={{ fontSize: '10px' }}>
          Displaced
        </text>
        <text x="85" y="172" className="label-text fill-blue-700 dark:fill-blue-300" style={{ fontSize: '10px' }}>
          water
        </text>

        {/* Depth markers */}
        <line x1="75" y1="140" x2="75" y2="269"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="72" y="210" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Depth
        </text>

        {/* Formula */}
        <text x="200" y="288" textAnchor="middle"
          className="formula-text fill-slate-700 dark:fill-slate-200">
          Buoyant force = Weight of displaced fluid
        </text>
      </svg>
    </div>
  );
};

export default BuoyancyDiagram;
