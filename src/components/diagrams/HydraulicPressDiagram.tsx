const HydraulicPressDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 500 250"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hydraulic press diagram showing Pascal's principle with two connected pistons of different sizes"
      >
        <style>{`
          @keyframes pressDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(4px); }
          }
          @keyframes pressUp {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .small-piston { animation: pressDown 3s ease-in-out infinite; }
          .large-piston { animation: pressUp 3s ease-in-out infinite; }
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
          <marker id="hydr-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="hydr-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="250" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Hydraulic Press (Pascal's Principle)
        </text>

        {/* Fluid reservoir — U-tube shape */}
        {/* Bottom connecting tube */}
        <rect x="100" y="165" width="300" height="30" rx="4"
          fill="#3b82f6" opacity="0.2"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Left narrow cylinder */}
        <rect x="120" y="80" width="40" height="85"
          fill="#3b82f6" opacity="0.2"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Right wide cylinder */}
        <rect x="310" y="80" width="80" height="85"
          fill="#3b82f6" opacity="0.2"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Fluid label */}
        <text x="250" y="183" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          Fluid (incompressible)
        </text>

        {/* Small piston (left) */}
        <g className="small-piston">
          <rect x="115" y="68" width="50" height="16" rx="3"
            className="fill-slate-400 dark:fill-slate-500 stroke-slate-600 dark:stroke-slate-400" strokeWidth="1.5" />
          <rect x="133" y="48" width="14" height="22" rx="2"
            className="fill-slate-500 dark:fill-slate-400 stroke-slate-600 dark:stroke-slate-400" strokeWidth="1" />

          {/* F1 arrow (small, down) */}
          <line x1="140" y1="20" x2="140" y2="44"
            stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#hydr-arrow-red)" />
          <text x="140" y="16" textAnchor="middle"
            className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
            F₁ (small)
          </text>
        </g>

        {/* Large piston (right) */}
        <g className="large-piston">
          <rect x="305" y="68" width="90" height="16" rx="3"
            className="fill-slate-400 dark:fill-slate-500 stroke-slate-600 dark:stroke-slate-400" strokeWidth="1.5" />
          <rect x="340" y="48" width="20" height="22" rx="2"
            className="fill-slate-500 dark:fill-slate-400 stroke-slate-600 dark:stroke-slate-400" strokeWidth="1" />

          {/* F2 arrow (large, up) */}
          <line x1="350" y1="44" x2="350" y2="15"
            stroke="#22c55e" strokeWidth="3.5" markerEnd="url(#hydr-arrow-green)" />
          <text x="350" y="11" textAnchor="middle"
            className="label-text fill-green-600 dark:fill-green-400" fontWeight="600">
            F₂ (large)
          </text>
        </g>

        {/* Area labels */}
        <text x="140" y="105" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          A₁ (small)
        </text>
        <text x="350" y="105" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          A₂ (large)
        </text>

        {/* Pressure arrows in fluid */}
        <circle cx="200" cy="175" r="3" fill="#3b82f6" opacity="0.6" />
        <circle cx="250" cy="175" r="3" fill="#3b82f6" opacity="0.6" />
        <circle cx="300" cy="175" r="3" fill="#3b82f6" opacity="0.6" />

        {/* Divider line */}
        <line x1="40" y1="210" x2="460" y2="210"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {/* Formula */}
        <text x="250" y="232" textAnchor="middle"
          className="formula-text fill-slate-700 dark:fill-slate-200">
          F₁ / A₁ = F₂ / A₂
        </text>
        <text x="250" y="246" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Pressure is transmitted equally throughout the fluid
        </text>
      </svg>
    </div>
  );
};

export default HydraulicPressDiagram;
