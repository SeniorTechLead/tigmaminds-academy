const LockChamberDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 540 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Canal lock chamber cross-section showing a ship, water levels, gates, and valves"
      >
        <style>{`
          @keyframes waterFlow {
            0% { stroke-dashoffset: 16; }
            100% { stroke-dashoffset: 0; }
          }
          .water-flow {
            animation: waterFlow 1s linear infinite;
            stroke-dasharray: 8 8;
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
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="lock-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="520" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Canal Lock Chamber
        </text>

        {/* Higher water level — left side */}
        <rect x="20" y="100" width="130" height="150" fill="#3b82f6" opacity="0.2" />
        <line x1="20" y1="100" x2="150" y2="100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="85" y="93" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
          Upper level
        </text>

        {/* Lock chamber — middle */}
        <rect x="170" y="140" width="180" height="110" fill="#3b82f6" opacity="0.15" />
        <line x1="170" y1="140" x2="350" y2="140" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />

        {/* Lower water level — right side */}
        <rect x="370" y="180" width="130" height="70" fill="#3b82f6" opacity="0.12" />
        <line x1="370" y1="180" x2="500" y2="180" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="435" y="173" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400" fontWeight="600">
          Lower level
        </text>

        {/* Chamber walls */}
        {/* Left wall / upper gate */}
        <rect x="150" y="60" width="20" height="190" rx="2"
          fill="#78716c" opacity="0.6" stroke="#57534e" strokeWidth="1.5" />
        <text x="160" y="55" textAnchor="middle"
          className="label-text fill-stone-600 dark:fill-stone-400" style={{ fontSize: '9px', fontWeight: 600 }}>
          Upper Gate
        </text>

        {/* Right wall / lower gate */}
        <rect x="350" y="60" width="20" height="190" rx="2"
          fill="#78716c" opacity="0.6" stroke="#57534e" strokeWidth="1.5" />
        <text x="360" y="55" textAnchor="middle"
          className="label-text fill-stone-600 dark:fill-stone-400" style={{ fontSize: '9px', fontWeight: 600 }}>
          Lower Gate
        </text>

        {/* Chamber floor */}
        <rect x="150" y="250" width="220" height="15" rx="2"
          fill="#78716c" opacity="0.4" stroke="#57534e" strokeWidth="1" />

        {/* Left canal floor */}
        <rect x="20" y="250" width="130" height="15" rx="2"
          fill="#78716c" opacity="0.4" stroke="#57534e" strokeWidth="1" />

        {/* Right canal floor */}
        <rect x="370" y="250" width="130" height="15" rx="2"
          fill="#78716c" opacity="0.4" stroke="#57534e" strokeWidth="1" />

        {/* Valve in upper gate */}
        <rect x="153" y="200" width="14" height="20" rx="2"
          fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <text x="160" y="234" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '8px' }}>
          Valve
        </text>

        {/* Water flowing through valve */}
        <line x1="167" y1="205" x2="200" y2="195"
          stroke="#3b82f6" strokeWidth="2" className="water-flow" markerEnd="url(#lock-arrow)" />
        <line x1="167" y1="210" x2="200" y2="210"
          stroke="#3b82f6" strokeWidth="2" className="water-flow" markerEnd="url(#lock-arrow)" />
        <line x1="167" y1="215" x2="200" y2="225"
          stroke="#3b82f6" strokeWidth="2" className="water-flow" markerEnd="url(#lock-arrow)" />

        {/* Ship in chamber */}
        <g>
          {/* Hull */}
          <path d="M 220 118 L 210 140 L 310 140 L 300 118 Z"
            fill="#64748b" stroke="#475569" strokeWidth="1.5" />
          {/* Deck */}
          <rect x="225" y="108" width="70" height="10" rx="2"
            fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          {/* Cabin */}
          <rect x="245" y="90" width="30" height="18" rx="2"
            fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
          {/* Mast */}
          <line x1="260" y1="90" x2="260" y2="70" stroke="#475569" strokeWidth="2" />
        </g>

        {/* Rising water arrow */}
        <line x1="330" y1="200" x2="330" y2="155"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#lock-arrow)" />
        <text x="340" y="183"
          className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '9px' }}>
          Water
        </text>
        <text x="340" y="194"
          className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '9px' }}>
          rising
        </text>

        {/* Height difference markers */}
        <line x1="500" y1="100" x2="500" y2="180" stroke="#ef4444" strokeWidth="1" />
        <line x1="495" y1="100" x2="510" y2="100" stroke="#ef4444" strokeWidth="1" />
        <line x1="495" y1="180" x2="510" y2="180" stroke="#ef4444" strokeWidth="1" />
        <text x="515" y="144" className="label-text fill-red-500 dark:fill-red-400" style={{ fontSize: '9px' }}>
          Δh
        </text>

        {/* Bottom note */}
        <text x="260" y="282" textAnchor="middle"
          className="formula-text fill-slate-500 dark:fill-slate-400">
          Water from upper level fills chamber, raising the ship to match the higher water level
        </text>
      </svg>
    </div>
  );
};

export default LockChamberDiagram;
