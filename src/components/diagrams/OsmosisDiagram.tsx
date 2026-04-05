const OsmosisDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 520 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Osmosis diagram showing water moving through a semi-permeable membrane from low to high solute concentration"
      >
        <style>{`
          @keyframes drift {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          .drift { animation: drift 2.5s ease-in-out infinite; }
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
          <marker id="osm-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="280" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Osmosis Through a Semi-Permeable Membrane
        </text>

        {/* Container */}
        <rect x="60" y="50" width="380" height="170" rx="4"
          className="fill-none stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Left side — low concentration (light blue) */}
        <rect x="61" y="51" width="188" height="168"
          fill="#3b82f6" opacity="0.1" />

        {/* Right side — high concentration (deeper blue) */}
        <rect x="251" y="51" width="188" height="168"
          fill="#3b82f6" opacity="0.25" />

        {/* Membrane — dashed line */}
        <line x1="250" y1="50" x2="250" y2="220"
          stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
        <text x="250" y="238" textAnchor="middle"
          className="label-text" fill="#d97706" fontWeight="600">
          Semi-Permeable Membrane
        </text>

        {/* Solute dots — left side (few) */}
        {[
          [110, 90], [160, 130], [130, 170], [100, 150],
        ].map(([cx, cy], i) => (
          <circle key={`ls-${i}`} cx={cx} cy={cy} r="5"
            fill="#ef4444" opacity="0.7" />
        ))}

        {/* Solute dots — right side (many) */}
        {[
          [280, 80], [320, 70], [360, 100], [300, 120],
          [340, 140], [380, 130], [290, 160], [350, 170],
          [310, 190], [270, 190], [400, 160], [370, 90],
        ].map(([cx, cy], i) => (
          <circle key={`rs-${i}`} cx={cx} cy={cy} r="5"
            fill="#ef4444" opacity="0.7" />
        ))}

        {/* Water flow arrows (left → right through membrane) */}
        <g className="drift">
          <line x1="195" y1="90" x2="240" y2="90"
            stroke="#3b82f6" strokeWidth="2" markerEnd="url(#osm-arrow)" />
          <line x1="200" y1="120" x2="240" y2="120"
            stroke="#3b82f6" strokeWidth="2" markerEnd="url(#osm-arrow)" />
          <line x1="190" y1="150" x2="240" y2="150"
            stroke="#3b82f6" strokeWidth="2" markerEnd="url(#osm-arrow)" />
          <line x1="198" y1="180" x2="240" y2="180"
            stroke="#3b82f6" strokeWidth="2" markerEnd="url(#osm-arrow)" />
        </g>

        {/* Labels */}
        <text x="150" y="70" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
          Low solute
        </text>
        <text x="150" y="83" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '9px' }}>
          (more water)
        </text>

        <text x="350" y="62" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
          High solute
        </text>
        <text x="350" y="75" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" style={{ fontSize: '9px' }}>
          (less water)
        </text>

        {/* Legend */}
        <circle cx="100" cy="260" r="4" fill="#ef4444" opacity="0.7" />
        <text x="110" y="264"
          className="label-text fill-slate-600 dark:fill-slate-300">= solute particle (cannot pass)</text>

        {/* Bottom formula */}
        <text x="250" y="275" textAnchor="middle"
          className="formula-text fill-slate-500 dark:fill-slate-400">
          Water moves from low → high solute concentration to equalize
        </text>
      </svg>
    </div>
  );
};

export default OsmosisDiagram;
