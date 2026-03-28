const GravitationalFieldDiagram = () => {
  const fieldLines = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Gravitational field diagram showing Earth with radial field lines pointing inward"
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
          <marker id="grav-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <radialGradient id="earth-grad" cx="40%" cy="40%">
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
          Gravitational Field
        </text>

        {/* Field lines — radial, pointing inward */}
        {fieldLines.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 200;
          const cy = 195;
          const outerR = 160;
          const innerR = 55;
          const x1 = cx + outerR * Math.cos(rad);
          const y1 = cy + outerR * Math.sin(rad);
          const x2 = cx + innerR * Math.cos(rad);
          const y2 = cy + innerR * Math.sin(rad);

          return (
            <line key={angle}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#grav-arrow)" opacity="0.7" />
          );
        })}

        {/* Outer arrows — showing decreasing strength (smaller arrows further out) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 200;
          const cy = 195;
          const midR = 130;
          const x = cx + midR * Math.cos(rad);
          const y = cy + midR * Math.sin(rad);

          return (
            <circle key={`dot-${angle}`} cx={x} cy={y} r="2"
              fill="#ef4444" opacity="0.4" />
          );
        })}

        {/* Earth */}
        <circle cx="200" cy="195" r="45" fill="url(#earth-grad)" />
        {/* Continents hint */}
        <ellipse cx="190" cy="185" rx="12" ry="18"
          fill="#22c55e" opacity="0.5" />
        <ellipse cx="210" cy="200" rx="8" ry="10"
          fill="#22c55e" opacity="0.5" />

        <text x="200" y="199" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          Earth (M)
        </text>

        {/* Test mass label */}
        <circle cx="200" cy="58" r="5"
          className="fill-amber-400 stroke-amber-600" strokeWidth="1" />
        <text x="212" y="54" className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          m (test mass)
        </text>

        {/* Distance label */}
        <line x1="200" y1="150" x2="200" y2="64"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="3 3" />
        <text x="215" y="110" className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          r
        </text>

        {/* Strength note */}
        <text x="350" y="120" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Field weakens
        </text>
        <text x="350" y="132" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          with distance
        </text>

        {/* Divider */}
        <line x1="30" y1="368" x2="370" y2="368"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {/* Formula */}
        <text x="200" y="388" textAnchor="middle"
          className="formula-text fill-slate-700 dark:fill-slate-200">
          F = GMm / r²
        </text>
      </svg>
    </div>
  );
};

export default GravitationalFieldDiagram;
