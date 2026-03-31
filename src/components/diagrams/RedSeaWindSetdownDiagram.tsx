const RedSeaWindSetdownDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Wind setdown diagram showing strong east wind pushing water away from a shallow ridge, exposing the seabed"
      >
        <style>{`
          @keyframes windBlow {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(6px); }
          }
          .wind-arrow { animation: windBlow 2s ease-in-out infinite; }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="rsw-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="rsw-arrow-orange" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Wind Setdown — How Wind Pushes Water Away
        </text>

        {/* BEFORE panel */}
        <text x="135" y="50" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          Normal Conditions
        </text>

        {/* Seabed before */}
        <path d="M 20 220 Q 75 200 135 190 Q 195 200 250 220"
          className="fill-amber-200 dark:fill-amber-800 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" fillOpacity="0.6" />
        <text x="135" y="208" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" style={{ fontSize: '10px' }}>
          Shallow ridge
        </text>

        {/* Water before */}
        <rect x="20" y="120" width="230" height="70" rx="3"
          fill="#3b82f6" opacity="0.25" />
        <path d="M 20 120 Q 50 115 80 120 Q 110 125 140 120 Q 170 115 200 120 Q 230 125 250 120"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="135" y="155" textAnchor="middle"
          className="label-text fill-blue-700 dark:fill-blue-300" style={{ fontSize: '10px' }}>
          Water covers ridge
        </text>

        {/* Depth annotation */}
        <line x1="15" y1="120" x2="15" y2="190"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="11" y1="120" x2="19" y2="120"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="11" y1="190" x2="19" y2="190"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="12" y="160" textAnchor="middle" transform="rotate(-90, 12, 160)"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          ~2 m
        </text>

        {/* AFTER panel */}
        <text x="405" y="50" textAnchor="middle"
          className="label-text fill-orange-600 dark:fill-orange-400" fontWeight="600">
          Strong East Wind (63 mph / 101 km/h)
        </text>

        {/* Wind arrows */}
        <g className="wind-arrow">
          <line x1="295" y1="75" x2="370" y2="75"
            className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2.5" markerEnd="url(#rsw-arrow-orange)" />
          <line x1="305" y1="88" x2="380" y2="88"
            className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2" markerEnd="url(#rsw-arrow-orange)" />
          <line x1="295" y1="101" x2="370" y2="101"
            className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2.5" markerEnd="url(#rsw-arrow-orange)" />
        </g>
        <text x="340" y="68" textAnchor="middle"
          className="label-text fill-orange-600 dark:fill-orange-400" style={{ fontSize: '10px' }}>
          Wind
        </text>

        {/* Seabed after */}
        <path d="M 290 220 Q 345 200 405 190 Q 465 200 520 220"
          className="fill-amber-200 dark:fill-amber-800 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" fillOpacity="0.6" />

        {/* Water pushed to right */}
        <rect x="440" y="120" width="80" height="100" rx="3"
          fill="#3b82f6" opacity="0.35" />
        <path d="M 440 120 Q 460 115 480 120 Q 500 125 520 120"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Water pushed to left */}
        <rect x="290" y="140" width="60" height="80" rx="3"
          fill="#3b82f6" opacity="0.35" />
        <path d="M 290 140 Q 310 135 330 140 Q 340 145 350 140"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Exposed ridge */}
        <rect x="360" y="175" width="70" height="15" rx="3"
          className="fill-amber-300 dark:fill-amber-700" opacity="0.8" />
        <text x="395" y="186" textAnchor="middle"
          className="label-text fill-amber-800 dark:fill-amber-200" fontWeight="600" style={{ fontSize: '10px' }}>
          EXPOSED
        </text>

        {/* Walking figures hint */}
        <text x="395" y="170" textAnchor="middle" style={{ fontSize: '14px' }}>
          🚶
        </text>

        {/* Water flow arrows */}
        <line x1="380" y1="145" x2="440" y2="130"
          className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" markerEnd="url(#rsw-arrow-blue)" />
        <line x1="405" y1="145" x2="345" y2="145"
          className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" markerEnd="url(#rsw-arrow-blue)" />

        {/* Explanation */}
        <text x="270" y="255" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          A sustained strong wind can push water away from a shallow area,
        </text>
        <text x="270" y="269" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          lowering local water level by 1.5–2 metres — enough to expose a ridge.
        </text>
        <text x="270" y="287" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          (2010 study by Drews &amp; Han, NCAR — modeled using fluid dynamics equations)
        </text>
      </svg>
    </div>
  );
};

export default RedSeaWindSetdownDiagram;
