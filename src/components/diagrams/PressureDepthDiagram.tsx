const PressureDepthDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 403 384"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Pressure vs depth diagram showing increasing pressure arrows with depth in a water tank"
      >
        <style>{`
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
            font-size: 12px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="pd-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="300" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="150" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Pressure Increases with Depth
        </text>

        {/* Tank outline */}
        <rect x="80" y="45" width="120" height="230" rx="4"
          className="fill-none stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Water fill with gradient */}
        <rect x="81" y="46" width="118" height="228" rx="3"
          fill="url(#water-gradient)" />

        {/* Surface line */}
        <line x1="80" y1="46" x2="200" y2="46"
          stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5 3" />

        {/* Depth scale on the left */}
        <line x1="60" y1="46" x2="60" y2="275"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="55" y1="46" x2="65" y2="46"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="55" y1="275" x2="65" y2="275"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />

        {/* Depth labels */}
        <text x="57" y="42" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          h = 0
        </text>
        <text x="57" y="122" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          h₁
        </text>
        <text x="57" y="195" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          h₂
        </text>
        <text x="57" y="268" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          h₃
        </text>

        {/* "h" label with arrow */}
        <text x="42" y="165" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          h
        </text>

        {/* Pressure arrows at different depths — increasing size */}
        {/* Depth 1 — small arrow */}
        <line x1="210" y1="100" x2="240" y2="100"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#pd-arrow-blue)" />
        <line x1="70" y1="100" x2="90" y2="100"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#pd-arrow-blue)" />

        {/* Depth 2 — medium arrow */}
        <line x1="210" y1="165" x2="252" y2="165"
          stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#pd-arrow-blue)" />
        <line x1="70" y1="165" x2="90" y2="165"
          stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#pd-arrow-blue)" />

        {/* Depth 3 — large arrow */}
        <line x1="210" y1="230" x2="265" y2="230"
          stroke="#3b82f6" strokeWidth="3" markerEnd="url(#pd-arrow-blue)" />
        <line x1="70" y1="230" x2="90" y2="230"
          stroke="#3b82f6" strokeWidth="3" markerEnd="url(#pd-arrow-blue)" />

        {/* Pressure labels */}
        <text x="248" y="96" className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          P₁
        </text>
        <text x="260" y="161" className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          P₂
        </text>
        <text x="273" y="226" className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          P₃
        </text>

        {/* Density label */}
        <text x="140" y="155" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-200" style={{ fontSize: '10px' }}>
          Fluid density: ρ
        </text>

        {/* Divider */}
        <line x1="20" y1="295" x2="280" y2="295"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {/* Formula */}
        <text x="150" y="316" textAnchor="middle"
          className="formula-text fill-slate-700 dark:fill-slate-200">
          P = ρgh
        </text>
        <text x="150" y="334" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          ρ = density, g = gravity, h = depth
        </text>
      </svg>
    </div>
  );
};

export default PressureDepthDiagram;
