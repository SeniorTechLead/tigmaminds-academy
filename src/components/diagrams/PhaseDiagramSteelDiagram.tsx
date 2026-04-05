const PhaseDiagramSteelDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 520 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Simplified iron-carbon phase diagram showing ferrite, austenite, and cementite regions with the eutectoid point"
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
          .axis-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .phase-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-style: italic;
          }
        `}</style>

        {/* Background */}
        <rect width="500" height="360" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Iron-Carbon Phase Diagram (Simplified)
        </text>

        {/* Axes */}
        {/* Y-axis: Temperature */}
        <line x1="80" y1="50" x2="80" y2="310" stroke="#64748b" strokeWidth="2" />
        <text x="30" y="180" textAnchor="middle"
          className="axis-text fill-slate-600 dark:fill-slate-300"
          transform="rotate(-90, 30, 180)">
          Temperature (°C)
        </text>

        {/* X-axis: Carbon % */}
        <line x1="80" y1="310" x2="460" y2="310" stroke="#64748b" strokeWidth="2" />
        <text x="270" y="340" textAnchor="middle"
          className="axis-text fill-slate-600 dark:fill-slate-300">
          Carbon Content (wt%)
        </text>

        {/* Temperature scale */}
        {[
          { t: '1600', y: 55 },
          { t: '1400', y: 95 },
          { t: '1148', y: 130 },
          { t: '912', y: 175 },
          { t: '727', y: 220 },
          { t: '400', y: 280 },
        ].map((tick) => (
          <g key={tick.t}>
            <line x1="75" y1={tick.y} x2="80" y2={tick.y} stroke="#64748b" strokeWidth="1" />
            <text x="72" y={tick.y + 4} textAnchor="end"
              className="axis-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '8px' }}>
              {tick.t}
            </text>
          </g>
        ))}

        {/* Carbon % scale */}
        {[
          { c: '0', x: 80 },
          { c: '0.77', x: 207 },
          { c: '2.14', x: 300 },
          { c: '4.3', x: 380 },
          { c: '6.67', x: 460 },
        ].map((tick) => (
          <g key={tick.c}>
            <line x1={tick.x} y1={310} x2={tick.x} y2={315} stroke="#64748b" strokeWidth="1" />
            <text x={tick.x} y={326} textAnchor="middle"
              className="axis-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '8px' }}>
              {tick.c}
            </text>
          </g>
        ))}

        {/* Austenite region (top) */}
        <path d="M 80 55 L 80 175 L 207 220 L 300 130 L 460 130 L 460 55 Z"
          fill="#ef4444" opacity="0.1" />
        <text x="230" y="115" textAnchor="middle"
          className="phase-text fill-red-600 dark:fill-red-400">
          Austenite (γ)
        </text>

        {/* Ferrite region (lower left) */}
        <path d="M 80 175 L 80 310 L 207 310 L 207 220 Z"
          fill="#3b82f6" opacity="0.12" />
        <text x="140" y="270" textAnchor="middle"
          className="phase-text fill-blue-600 dark:fill-blue-400">
          Ferrite (α)
        </text>

        {/* Ferrite + Cementite (lower right of eutectoid) */}
        <path d="M 207 220 L 207 310 L 460 310 L 460 130 L 300 130 Z"
          fill="#10b981" opacity="0.1" />
        <text x="350" y="240" textAnchor="middle"
          className="phase-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '11px' }}>
          Ferrite +
        </text>
        <text x="350" y="256" textAnchor="middle"
          className="phase-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '11px' }}>
          Cementite (Fe₃C)
        </text>

        {/* Phase boundary lines */}
        {/* Upper: austenite top boundary */}
        <line x1="80" y1="175" x2="207" y2="220" stroke="#64748b" strokeWidth="1.5" />
        <line x1="207" y1="220" x2="300" y2="130" stroke="#64748b" strokeWidth="1.5" />

        {/* Eutectoid line at 727°C */}
        <line x1="80" y1="220" x2="460" y2="220" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

        {/* 1148°C line (eutectic) */}
        <line x1="80" y1="130" x2="460" y2="130" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

        {/* Eutectoid point */}
        <circle cx="207" cy="220" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <text x="207" y="210" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-400" fontWeight="600" style={{ fontSize: '10px' }}>
          Eutectoid
        </text>
        <text x="207" y="243" textAnchor="middle"
          className="formula-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '9px' }}>
          727°C, 0.77% C
        </text>

        {/* Pearlite label near eutectoid */}
        <text x="207" y="256" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '8px' }}>
          (pearlite forms here)
        </text>

        {/* Bottom note */}
        <text x="250" y="354" textAnchor="middle"
          className="formula-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Steel = iron with 0.02 - 2.14% carbon | Cast iron = 2.14 - 6.67%
        </text>
      </svg>
    </div>
  );
};

export default PhaseDiagramSteelDiagram;
