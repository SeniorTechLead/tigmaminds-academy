const DoseResponseDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 440 370"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Dose-response sigmoidal curve showing antibiotic concentration vs bacterial survival with MIC, EC50, and MBC marked"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
          .axis-text { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <defs>
          <marker id="dose-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
          <linearGradient id="therapeutic-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="420" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Dose-Response Curve (Antibiotic)
        </text>

        {/* Axes */}
        {/* Y-axis */}
        <line x1="70" y1="50" x2="70" y2="280"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" markerEnd="url(#dose-arrow)" />
        {/* X-axis */}
        <line x1="70" y1="280" x2="390" y2="280"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" markerEnd="url(#dose-arrow)" />

        {/* Y-axis label */}
        <text x="20" y="165" textAnchor="middle"
          className="axis-text fill-slate-600 dark:fill-slate-300"
          transform="rotate(-90, 20, 165)">
          Bacterial survival (%)
        </text>

        {/* Y-axis ticks */}
        <text x="65" y="74" textAnchor="end" className="small-text fill-slate-500 dark:fill-slate-400">100</text>
        <text x="65" y="122" textAnchor="end" className="small-text fill-slate-500 dark:fill-slate-400">75</text>
        <text x="65" y="170" textAnchor="end" className="small-text fill-slate-500 dark:fill-slate-400">50</text>
        <text x="65" y="218" textAnchor="end" className="small-text fill-slate-500 dark:fill-slate-400">25</text>
        <text x="65" y="282" textAnchor="end" className="small-text fill-slate-500 dark:fill-slate-400">0</text>

        {/* X-axis label */}
        <text x="230" y="310" textAnchor="middle"
          className="axis-text fill-slate-600 dark:fill-slate-300">
          Antibiotic concentration (log scale)
        </text>

        {/* Grid lines */}
        {[70, 118, 166, 214].map((y) => (
          <line key={y} x1="70" y1={y} x2="385" y2={y}
            className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.5" />
        ))}

        {/* Sigmoidal curve */}
        <path
          d="M 80 72 Q 120 72, 155 74 Q 190 78, 210 100 Q 230 130, 245 166 Q 260 200, 280 240 Q 300 260, 340 272 Q 360 276, 385 278"
          fill="none" stroke="#8b5cf6" strokeWidth="3" />

        {/* Therapeutic window shading */}
        <rect x="165" y="50" width="130" height="230" rx="4"
          fill="url(#therapeutic-grad)" />
        <text x="230" y="46" textAnchor="middle"
          className="small-text fill-green-600 dark:fill-green-400" fontWeight="600">
          Therapeutic window
        </text>

        {/* MIC line */}
        <line x1="165" y1="50" x2="165" y2="280"
          stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="165" y="295" textAnchor="middle"
          className="label-text fill-orange-500 dark:fill-orange-400" fontWeight="600">
          MIC
        </text>

        {/* EC50 line */}
        <line x1="245" y1="50" x2="245" y2="280"
          stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />
        {/* EC50 horizontal guide */}
        <line x1="70" y1="166" x2="245" y2="166"
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <text x="245" y="295" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400" fontWeight="600">
          EC50
        </text>
        <circle cx="245" cy="166" r="4" fill="#3b82f6" />

        {/* MBC line */}
        <line x1="295" y1="50" x2="295" y2="280"
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="295" y="295" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400" fontWeight="600">
          MBC
        </text>

        {/* Legend */}
        <text x="80" y="330" className="small-text fill-orange-500 dark:fill-orange-400">
          MIC = Min. Inhibitory Conc.
        </text>
        <text x="210" y="330" className="small-text fill-blue-500 dark:fill-blue-400">
          EC50 = 50% effective
        </text>
        <text x="340" y="330" className="small-text fill-red-500 dark:fill-red-400">
          MBC = Min. Bactericidal
        </text>

        {/* Bottom note */}
        <text x="210" y="345" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Dose within therapeutic window: effective but below toxic levels
        </text>
      </svg>
    </div>
  );
};

export default DoseResponseDiagram;
