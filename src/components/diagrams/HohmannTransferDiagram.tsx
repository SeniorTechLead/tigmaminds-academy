const HohmannTransferDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 440 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hohmann transfer orbit diagram showing elliptical path from Earth orbit to Moon orbit with two delta-v burns"
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
            font-size: 11px;
            font-style: italic;
          }
          @keyframes pulse {
            0%, 100% { r: 5; }
            50% { r: 7; }
          }
          .burn-pulse { animation: pulse 1.5s ease-in-out infinite; }
        `}</style>

        <defs>
          <marker id="hoh-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="hoh-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="420" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Hohmann Transfer Orbit
        </text>

        {/* Central body (Earth) */}
        <circle cx="210" cy="220" r="18" fill="#3b82f6" opacity="0.8" />
        <text x="210" y="224" textAnchor="middle"
          className="label-text" fill="white" style={{ fontSize: '9px', fontWeight: 600 }}>
          Earth
        </text>

        {/* Inner orbit (LEO) */}
        <circle cx="210" cy="220" r="70" fill="none"
          stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="210" y="142" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400" style={{ fontSize: '9px' }}>
          Low Earth Orbit
        </text>

        {/* Outer orbit (target) */}
        <circle cx="210" cy="220" r="170" fill="none"
          stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="210" y="44" textAnchor="middle"
          className="label-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '9px' }}>
          Target Orbit
        </text>

        {/* Transfer ellipse — right half of an ellipse from inner to outer */}
        <ellipse cx="210" cy="220" rx="120" ry="170"
          fill="none" stroke="#f59e0b" strokeWidth="2.5"
          strokeDasharray="8 4"
          clipPath="url(#right-half)" />

        <defs>
          <clipPath id="right-half">
            <rect x="210" y="30" width="200" height="400" />
          </clipPath>
        </defs>

        {/* Transfer orbit label */}
        <text x="355" y="220" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Transfer
        </text>
        <text x="355" y="234" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          orbit
        </text>

        {/* Burn point 1 — bottom of inner orbit (periapsis) */}
        <circle cx="210" cy="290" r="5" fill="#ef4444" className="burn-pulse" />
        <line x1="210" y1="290" x2="240" y2="310"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#hoh-arrow)" />
        <text x="248" y="318"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
          Burn 1
        </text>
        <text x="248" y="332"
          className="formula-text fill-red-500 dark:fill-red-400" style={{ fontSize: '10px' }}>
          Δv₁ (speed up)
        </text>

        {/* Burn point 2 — top of outer orbit (apoapsis) */}
        <circle cx="210" cy="50" r="5" fill="#ef4444" className="burn-pulse" />
        <line x1="210" y1="50" x2="240" y2="55"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#hoh-arrow)" />
        <text x="248" y="52"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
          Burn 2
        </text>
        <text x="248" y="66"
          className="formula-text fill-red-500 dark:fill-red-400" style={{ fontSize: '10px' }}>
          Δv₂ (circularize)
        </text>

        {/* Spacecraft marker on inner orbit */}
        <rect x="204" y="285" width="12" height="10" rx="2"
          fill="#64748b" stroke="#475569" strokeWidth="1" />

        {/* Direction arrow on inner orbit */}
        <path d="M 145 195 L 140 210"
          fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#hoh-arrow-blue)" />

        {/* Formula box */}
        <rect x="30" y="370" width="360" height="36" rx="6"
          fill="#fffbeb" stroke="#f59e0b" strokeWidth="1"
          className="dark:fill-amber-900/20 dark:stroke-amber-700" />
        <text x="210" y="393" textAnchor="middle"
          className="formula-text fill-amber-800 dark:fill-amber-200" style={{ fontSize: '11px' }}>
          Total Δv = Δv₁ + Δv₂ — most fuel-efficient two-impulse transfer
        </text>
      </svg>
    </div>
  );
};

export default HohmannTransferDiagram;
