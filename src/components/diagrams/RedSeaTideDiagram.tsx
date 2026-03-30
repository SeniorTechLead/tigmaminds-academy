const RedSeaTideDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tidal physics diagram showing Moon gravity creating tidal bulges and low-tide exposure of seabed"
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
            font-size: 10px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="rst-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-cyan-500 dark:fill-cyan-400" />
          </marker>
          <marker id="rst-arrow-gray" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
          <radialGradient id="rst-moon" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </radialGradient>
          <linearGradient id="rst-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="540" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Tidal Forces — How the Moon Pulls Water
        </text>

        {/* Earth */}
        <circle cx="180" cy="145" r="52" className="fill-blue-500 dark:fill-blue-600" />
        <ellipse cx="168" cy="135" rx="12" ry="18" fill="#22c55e" opacity="0.5" />
        <ellipse cx="192" cy="150" rx="8" ry="10" fill="#22c55e" opacity="0.5" />
        <text x="180" y="149" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          Earth
        </text>

        {/* Tidal bulge near side */}
        <ellipse cx="246" cy="145" rx="22" ry="38"
          fill="url(#rst-water)"
          className="stroke-cyan-400 dark:stroke-cyan-500" strokeWidth="1.5" />

        {/* Tidal bulge far side */}
        <ellipse cx="114" cy="145" rx="22" ry="38"
          fill="url(#rst-water)"
          className="stroke-cyan-400 dark:stroke-cyan-500" strokeWidth="1.5" />

        {/* High tide labels */}
        <text x="246" y="95" textAnchor="middle"
          className="label-text fill-cyan-600 dark:fill-cyan-400" fontWeight="600" style={{ fontSize: '10px' }}>
          High Tide
        </text>
        <text x="114" y="95" textAnchor="middle"
          className="label-text fill-cyan-600 dark:fill-cyan-400" fontWeight="600" style={{ fontSize: '10px' }}>
          High Tide
        </text>

        {/* Low tide at top/bottom */}
        <text x="180" y="82" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Low Tide
        </text>
        <text x="180" y="215" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Low Tide
        </text>

        {/* Moon */}
        <circle cx="420" cy="145" r="26" fill="url(#rst-moon)" />
        <circle cx="413" cy="138" r="3.5" fill="#9ca3af" opacity="0.5" />
        <circle cx="426" cy="150" r="2.5" fill="#9ca3af" opacity="0.5" />
        <text x="420" y="149" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200" fontWeight="600" style={{ fontSize: '10px' }}>
          Moon
        </text>

        {/* Gravity arrows */}
        <line x1="272" y1="135" x2="330" y2="135"
          className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="2" markerEnd="url(#rst-arrow)" />
        <line x1="272" y1="145" x2="350" y2="145"
          className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="2.5" markerEnd="url(#rst-arrow)" />
        <line x1="272" y1="155" x2="330" y2="155"
          className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="2" markerEnd="url(#rst-arrow)" />

        <text x="315" y="128"  textAnchor="middle"
          className="label-text fill-cyan-600 dark:fill-cyan-400" style={{ fontSize: '10px' }}>
          Gravitational
        </text>
        <text x="315" y="170" textAnchor="middle"
          className="label-text fill-cyan-600 dark:fill-cyan-400" style={{ fontSize: '10px' }}>
          pull
        </text>

        {/* Red Sea inset box */}
        <rect x="325" y="210" width="200" height="78" rx="6"
          className="fill-amber-50 dark:fill-amber-950/40 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="425" y="228" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600" style={{ fontSize: '10px' }}>
          Gulf of Suez (Red Sea)
        </text>
        <text x="425" y="244" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          Tidal range: up to 2 m
        </text>
        <text x="425" y="258" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          Shallow ridge exposed at low tide
        </text>
        <text x="425" y="272" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          could reveal seabed for crossing
        </text>

        {/* Formula */}
        <text x="170" y="260" textAnchor="middle"
          className="formula-text fill-slate-600 dark:fill-slate-300">
          F = G × (m₁ × m₂) / r²
        </text>
        <text x="170" y="275" textAnchor="middle"
          className="formula-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Tidal force ∝ 1/r³ (drops with cube of distance)
        </text>
      </svg>
    </div>
  );
};

export default RedSeaTideDiagram;
