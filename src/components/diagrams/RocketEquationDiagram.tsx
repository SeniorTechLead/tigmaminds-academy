const RocketEquationDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 440 360"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Rocket equation diagram showing fuel mass vs payload mass ratio with Tsiolkovsky equation"
      >
        <style>{`
          @keyframes exhaust {
            0% { opacity: 0.8; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(30px); }
          }
          .exhaust-puff { animation: exhaust 1.2s ease-out infinite; }
          .exhaust-puff-delay { animation: exhaust 1.2s ease-out 0.4s infinite; }
          .exhaust-puff-delay2 { animation: exhaust 1.2s ease-out 0.8s infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .formula-text { font-family: system-ui, sans-serif; font-size: 12px; font-style: italic; }
        `}</style>

        <defs>
          <marker id="rocket-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="rocket-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="420" height="340" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Tsiolkovsky Rocket Equation
        </text>

        {/* Nose cone (payload) */}
        <polygon points="180,55 210,40 240,55"
          className="fill-sky-400 dark:fill-sky-500 stroke-sky-600 dark:stroke-sky-300" strokeWidth="1.5" />
        <rect x="180" y="55" width="60" height="35" rx="2"
          className="fill-sky-400 dark:fill-sky-500 stroke-sky-600 dark:stroke-sky-300" strokeWidth="1.5" />
        <text x="210" y="77" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          Payload
        </text>

        {/* Fuel tank (large) */}
        <rect x="175" y="90" width="70" height="120" rx="4"
          className="fill-orange-400 dark:fill-orange-500 stroke-orange-600 dark:stroke-orange-300" strokeWidth="1.5" />
        <text x="210" y="145" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          Fuel
        </text>
        <text x="210" y="160" textAnchor="middle"
          className="label-text fill-white" style={{ fontSize: '9px' }}>
          (propellant)
        </text>

        {/* Nozzle */}
        <polygon points="185,210 175,240 245,240 235,210"
          className="fill-slate-500 dark:fill-slate-400 stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.5" />

        {/* Exhaust flames */}
        <ellipse cx="210" cy="255" rx="18" ry="10" fill="#ef4444" opacity="0.7" className="exhaust-puff" />
        <ellipse cx="210" cy="265" rx="14" ry="8" fill="#f97316" opacity="0.6" className="exhaust-puff-delay" />
        <ellipse cx="210" cy="275" rx="10" ry="6" fill="#fbbf24" opacity="0.4" className="exhaust-puff-delay2" />

        {/* Exhaust direction arrow */}
        <line x1="210" y1="245" x2="210" y2="300"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#rocket-arrow)" />
        <text x="235" y="290" className="label-text fill-red-500 dark:fill-red-400">
          Exhaust (v_e)
        </text>

        {/* Mass labels with brackets */}
        {/* Payload bracket */}
        <line x1="255" y1="42" x2="270" y2="42" className="stroke-slate-400" strokeWidth="1" />
        <line x1="255" y1="88" x2="270" y2="88" className="stroke-slate-400" strokeWidth="1" />
        <line x1="270" y1="42" x2="270" y2="88" className="stroke-slate-400" strokeWidth="1" />
        <text x="278" y="70" className="label-text fill-sky-600 dark:fill-sky-400">
          m_payload
        </text>

        {/* Fuel bracket */}
        <line x1="255" y1="92" x2="280" y2="92" className="stroke-slate-400" strokeWidth="1" />
        <line x1="255" y1="210" x2="280" y2="210" className="stroke-slate-400" strokeWidth="1" />
        <line x1="280" y1="92" x2="280" y2="210" className="stroke-slate-400" strokeWidth="1" />
        <text x="288" y="155" className="label-text fill-orange-600 dark:fill-orange-400">
          m_fuel
        </text>

        {/* Total mass bracket */}
        <line x1="310" y1="42" x2="325" y2="42" className="stroke-slate-400" strokeWidth="1" />
        <line x1="310" y1="210" x2="325" y2="210" className="stroke-slate-400" strokeWidth="1" />
        <line x1="325" y1="42" x2="325" y2="210" className="stroke-slate-400" strokeWidth="1" />
        <text x="333" y="122" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          m₀ (wet)
        </text>
        <text x="333" y="138" className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '9px' }}>
          m_f = m₀ - fuel
        </text>

        {/* Ratio bar */}
        <rect x="30" y="55" width="20" height="35" rx="2"
          className="fill-sky-400 dark:fill-sky-500 stroke-sky-600" strokeWidth="1" />
        <rect x="30" y="90" width="20" height="120" rx="2"
          className="fill-orange-400 dark:fill-orange-500 stroke-orange-600" strokeWidth="1" />
        <text x="40" y="48" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '9px' }}>
          Mass ratio
        </text>

        {/* Formula */}
        <text x="210" y="325" textAnchor="middle"
          className="formula-text fill-slate-700 dark:fill-slate-200">
          Δv = vₑ × ln(m₀ / m_f) — more fuel ratio = more Δv
        </text>
      </svg>
    </div>
  );
};

export default RocketEquationDiagram;
