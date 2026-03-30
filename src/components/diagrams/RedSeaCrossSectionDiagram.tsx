const RedSeaCrossSectionDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of the Gulf of Suez showing the underwater ridge, water depths, and wind-driven water displacement"
      >
        <style>{`
          @keyframes waterReturn {
            0%, 80% { opacity: 0; }
            100% { opacity: 0.35; }
          }
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
          <linearGradient id="rsx-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <marker id="rsx-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="280" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Cross-Section: Gulf of Suez Underwater Ridge
        </text>

        {/* Sea level line */}
        <line x1="40" y1="100" x2="500" y2="100"
          className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="505" y="104"
          className="label-text fill-blue-600 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          Sea level
        </text>

        {/* Water fill */}
        <path d="M 40 100 L 40 230 Q 120 240 200 210 Q 270 180 290 165 Q 310 180 340 210 Q 420 240 500 230 L 500 100 Z"
          fill="#3b82f6" opacity="0.2" />

        {/* Seabed profile */}
        <path d="M 40 230 Q 120 240 200 210 Q 270 180 290 165 Q 310 180 340 210 Q 420 240 500 230"
          fill="none" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="2.5" />

        {/* Seabed fill */}
        <path d="M 40 230 Q 120 240 200 210 Q 270 180 290 165 Q 310 180 340 210 Q 420 240 500 230 L 500 265 L 40 265 Z"
          fill="url(#rsx-sand)" opacity="0.4" />

        {/* Ridge peak */}
        <circle cx="290" cy="165" r="4" className="fill-amber-500 dark:fill-amber-400" />
        <line x1="290" y1="100" x2="290" y2="161"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="3 3" />

        {/* Ridge label */}
        <text x="290" y="155" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600" style={{ fontSize: '10px' }}>
          Ridge (~2 m deep)
        </text>

        {/* Depth annotations */}
        <line x1="80" y1="100" x2="80" y2="238"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="76" y1="100" x2="84" y2="100"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="76" y1="238" x2="84" y2="238"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="70" y="175" textAnchor="end"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          ~10 m
        </text>

        <line x1="460" y1="100" x2="460" y2="234"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="456" y1="100" x2="464" y2="100"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="456" y1="234" x2="464" y2="234"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="470" y="175"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          ~10 m
        </text>

        {/* Ridge depth */}
        <line x1="310" y1="100" x2="310" y2="170"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        <line x1="306" y1="100" x2="314" y2="100"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        <line x1="306" y1="170" x2="314" y2="170"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        <text x="326" y="140"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          ~2 m
        </text>

        {/* West / East labels */}
        <text x="55" y="92" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600" style={{ fontSize: '10px' }}>
          West
        </text>
        <text x="485" y="92" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600" style={{ fontSize: '10px' }}>
          East
        </text>

        {/* Width */}
        <line x1="120" y1="252" x2="460" y2="252"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="120" y1="248" x2="120" y2="256"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="460" y1="248" x2="460" y2="256"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="290" y="265" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          ~3–4 km wide crossing (at ridge)
        </text>
      </svg>
    </div>
  );
};

export default RedSeaCrossSectionDiagram;
