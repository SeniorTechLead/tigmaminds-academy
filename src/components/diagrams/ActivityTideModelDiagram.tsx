const ActivityTideModelDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hands-on activity diagram showing how to model wind setdown using a baking tray, water, and a hairdryer"
      >
        <style>{`
          @keyframes blowWater {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          .blow-anim { animation: blowWater 1.5s ease-in-out infinite; }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .step-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
        `}</style>

        <defs>
          <marker id="atm-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Activity: Build a Wind Setdown Model
        </text>

        {/* Baking tray */}
        <rect x="120" y="100" width="300" height="80" rx="4"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        <text x="270" y="192" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Shallow baking tray or plastic container
        </text>

        {/* Sand ridge in middle */}
        <path d="M 230 175 Q 250 155 270 150 Q 290 155 310 175"
          className="fill-amber-300 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-500" strokeWidth="1.5" />
        <text x="270" y="147" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" style={{ fontSize: '10px' }}>
          Clay/sand ridge
        </text>

        {/* Water */}
        <rect x="122" y="130" width="296" height="48" rx="2"
          fill="#3b82f6" opacity="0.2" />
        <path d="M 122 130 Q 160 126 200 130 Q 240 134 280 130 Q 320 126 360 130 Q 400 134 418 130"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" />

        {/* Hairdryer */}
        <rect x="40" y="115" width="70" height="35" rx="8"
          className="fill-orange-200 dark:fill-orange-800 stroke-orange-400 dark:stroke-orange-500" strokeWidth="1.5" />
        <text x="75" y="137" textAnchor="middle"
          className="label-text fill-orange-700 dark:fill-orange-300" style={{ fontSize: '10px' }}>
          Fan/dryer
        </text>

        {/* Wind arrows */}
        <g className="blow-anim">
          <line x1="112" y1="125" x2="150" y2="125"
            stroke="#f97316" strokeWidth="2" markerEnd="url(#atm-arrow)" />
          <line x1="112" y1="135" x2="155" y2="135"
            stroke="#f97316" strokeWidth="2.5" markerEnd="url(#atm-arrow)" />
          <line x1="112" y1="145" x2="150" y2="145"
            stroke="#f97316" strokeWidth="2" markerEnd="url(#atm-arrow)" />
        </g>

        {/* Steps below */}
        <rect x="20" y="205" width="500" height="85" rx="6"
          className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />

        <text x="270" y="222" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
          Steps
        </text>

        <text x="35" y="240"
          className="step-text fill-emerald-700 dark:fill-emerald-400">
          1. Fill a shallow tray with 2–3 cm of water
        </text>
        <text x="35" y="255"
          className="step-text fill-emerald-700 dark:fill-emerald-400">
          2. Build a small ridge in the middle using clay, sand, or a flat stone
        </text>
        <text x="35" y="270"
          className="step-text fill-emerald-700 dark:fill-emerald-400">
          3. Blow air across the surface with a fan or hairdryer (cool setting)
        </text>
        <text x="35" y="285"
          className="step-text fill-emerald-700 dark:fill-emerald-400">
          4. Watch the water level drop over the ridge — the ridge gets exposed!
        </text>
      </svg>
    </div>
  );
};

export default ActivityTideModelDiagram;
