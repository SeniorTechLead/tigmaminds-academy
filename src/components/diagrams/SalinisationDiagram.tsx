const SalinisationDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 440 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Salinisation diagram showing salt accumulation in irrigated soil cross-section"
      >
        <style>{`
          @keyframes evap {
            0% { opacity: 0.7; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-15px); }
          }
          .evap-arrow { animation: evap 2s ease-out infinite; }
          .evap-arrow-d { animation: evap 2s ease-out 0.7s infinite; }
          .evap-arrow-d2 { animation: evap 2s ease-out 1.4s infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <defs>
          <marker id="sal-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="420" height="360" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Soil Salinisation from Irrigation
        </text>

        {/* Sun */}
        <circle cx="370" cy="55" r="20" fill="#facc15" opacity="0.9" />
        <text x="370" y="85" textAnchor="middle" className="small-text fill-amber-600 dark:fill-amber-400">
          Sun
        </text>

        {/* Evaporation arrows */}
        <line x1="150" y1="115" x2="150" y2="85" stroke="#f97316" strokeWidth="1.5" className="evap-arrow" />
        <line x1="180" y1="115" x2="180" y2="85" stroke="#f97316" strokeWidth="1.5" className="evap-arrow-d" />
        <line x1="210" y1="115" x2="210" y2="85" stroke="#f97316" strokeWidth="1.5" className="evap-arrow-d2" />
        <line x1="240" y1="115" x2="240" y2="85" stroke="#f97316" strokeWidth="1.5" className="evap-arrow" />
        <text x="195" y="78" textAnchor="middle" className="small-text fill-orange-500 dark:fill-orange-400">
          Evaporation (water leaves, salt stays)
        </text>

        {/* Canal at top */}
        <rect x="30" y="100" width="100" height="20" rx="3"
          fill="#3b82f6" opacity="0.5" className="stroke-blue-500" strokeWidth="1" />
        <text x="80" y="114" textAnchor="middle" className="small-text fill-blue-800 dark:fill-blue-200">
          Canal
        </text>

        {/* Water flow arrows into soil */}
        <line x1="80" y1="122" x2="120" y2="155" stroke="#3b82f6" strokeWidth="1.5"
          strokeDasharray="3 2" markerEnd="url(#sal-arrow-blue)" />
        <line x1="90" y1="122" x2="150" y2="170" stroke="#3b82f6" strokeWidth="1.5"
          strokeDasharray="3 2" markerEnd="url(#sal-arrow-blue)" />

        {/* Soil surface */}
        <rect x="30" y="120" width="360" height="8"
          className="fill-amber-800 dark:fill-amber-900" opacity="0.6" />

        {/* Topsoil */}
        <rect x="30" y="128" width="360" height="50"
          className="fill-amber-200 dark:fill-amber-800" opacity="0.4" />
        <text x="350" y="155" className="small-text fill-amber-700 dark:fill-amber-300" textAnchor="end">
          Topsoil
        </text>

        {/* Salt accumulation zone (root zone) */}
        <rect x="30" y="178" width="360" height="50" rx="0"
          fill="#ef4444" opacity="0.15" />
        <rect x="30" y="178" width="360" height="50"
          fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="350" y="208" className="label-text fill-red-600 dark:fill-red-400" textAnchor="end" fontWeight="600">
          Salt accumulation
        </text>
        <text x="350" y="220" className="small-text fill-red-500 dark:fill-red-400" textAnchor="end">
          (root zone)
        </text>

        {/* Salt crystal symbols */}
        <text x="80" y="200" className="small-text" fill="#ef4444" style={{ fontSize: '14px' }}>*</text>
        <text x="130" y="210" className="small-text" fill="#ef4444" style={{ fontSize: '14px' }}>*</text>
        <text x="180" y="195" className="small-text" fill="#ef4444" style={{ fontSize: '14px' }}>*</text>
        <text x="220" y="215" className="small-text" fill="#ef4444" style={{ fontSize: '14px' }}>*</text>
        <text x="270" y="200" className="small-text" fill="#ef4444" style={{ fontSize: '14px' }}>*</text>

        {/* Subsoil */}
        <rect x="30" y="228" width="360" height="50"
          className="fill-amber-300 dark:fill-amber-900" opacity="0.3" />
        <text x="350" y="258" className="small-text fill-amber-700 dark:fill-amber-400" textAnchor="end">
          Subsoil
        </text>

        {/* Plant with stressed roots */}
        {/* Stem */}
        <line x1="210" y1="120" x2="210" y2="90" stroke="#22c55e" strokeWidth="3" />
        {/* Leaves (wilting) */}
        <path d="M 210 95 Q 195 80, 190 90" fill="none" stroke="#84cc16" strokeWidth="2" />
        <path d="M 210 100 Q 225 85, 230 95" fill="none" stroke="#84cc16" strokeWidth="2" />
        {/* Wilting leaf */}
        <path d="M 210 90 Q 200 75, 195 82" fill="none" stroke="#a3a344" strokeWidth="2" />

        {/* Roots (stressed) */}
        <line x1="210" y1="128" x2="195" y2="185" stroke="#92400e" strokeWidth="1.5" />
        <line x1="210" y1="128" x2="210" y2="195" stroke="#92400e" strokeWidth="1.5" />
        <line x1="210" y1="128" x2="225" y2="185" stroke="#92400e" strokeWidth="1.5" />
        <text x="210" y="140" textAnchor="middle" className="small-text fill-red-600 dark:fill-red-400">
          Stressed roots
        </text>

        {/* Water table */}
        <line x1="30" y1="278" x2="390" y2="278"
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 3" />
        <text x="350" y="290" className="small-text fill-blue-500 dark:fill-blue-400" textAnchor="end">
          Water table
        </text>

        {/* Bottom note */}
        <text x="210" y="320" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Water evaporates; dissolved salts remain and concentrate in root zone
        </text>
        <text x="210" y="340" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          Affected ~20% of irrigated farmland worldwide
        </text>
      </svg>
    </div>
  );
};

export default SalinisationDiagram;
