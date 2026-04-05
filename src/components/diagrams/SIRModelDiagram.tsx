const SIRModelDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 520 260"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="SIR epidemic model showing Susceptible, Infected, and Recovered compartments with transition rates"
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
            font-style: italic;
          }
          .box-label {
            font-family: system-ui, sans-serif;
            font-size: 14px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="sir-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="240" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          SIR Epidemic Model
        </text>

        {/* Susceptible box */}
        <rect x="40" y="70" width="120" height="60" rx="8"
          fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="2" />
        <text x="100" y="96" textAnchor="middle"
          className="box-label" fill="#2563eb">S</text>
        <text x="100" y="114" textAnchor="middle"
          className="label-text" fill="#2563eb">Susceptible</text>

        {/* Infected box */}
        <rect x="200" y="70" width="120" height="60" rx="8"
          fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="2" />
        <text x="260" y="96" textAnchor="middle"
          className="box-label" fill="#dc2626">I</text>
        <text x="260" y="114" textAnchor="middle"
          className="label-text" fill="#dc2626">Infected</text>

        {/* Recovered box */}
        <rect x="360" y="70" width="120" height="60" rx="8"
          fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="2" />
        <text x="420" y="96" textAnchor="middle"
          className="box-label" fill="#059669">R</text>
        <text x="420" y="114" textAnchor="middle"
          className="label-text" fill="#059669">Recovered</text>

        {/* Arrow S → I */}
        <line x1="160" y1="100" x2="196" y2="100"
          stroke="#64748b" strokeWidth="2.5" markerEnd="url(#sir-arrow)" />
        <text x="178" y="90" textAnchor="middle"
          className="formula-text fill-slate-600 dark:fill-slate-300">β</text>
        <text x="178" y="145" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '9px' }}>
          infection rate
        </text>

        {/* Arrow I → R */}
        <line x1="320" y1="100" x2="356" y2="100"
          stroke="#64748b" strokeWidth="2.5" markerEnd="url(#sir-arrow)" />
        <text x="338" y="90" textAnchor="middle"
          className="formula-text fill-slate-600 dark:fill-slate-300">γ</text>
        <text x="338" y="145" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '9px' }}>
          recovery rate
        </text>

        {/* Population flow note */}
        <text x="100" y="170" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400" style={{ fontSize: '9px' }}>
          Everyone starts here
        </text>

        {/* Formula box */}
        <rect x="150" y="190" width="200" height="36" rx="6"
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"
          className="dark:fill-slate-800 dark:stroke-slate-600" />
        <text x="250" y="213" textAnchor="middle"
          className="formula-text fill-slate-700 dark:fill-slate-200" style={{ fontSize: '13px' }}>
          R₀ = β / γ
        </text>

        {/* R0 explanation */}
        <text x="250" y="236" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '9px', fontStyle: 'italic' }}>
          R₀ &gt; 1 → epidemic spreads | R₀ &lt; 1 → epidemic dies out
        </text>
      </svg>
    </div>
  );
};

export default SIRModelDiagram;
