const ActivityMonsoonModelDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 661 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hands-on activity diagram showing how to model differential heating with a lamp, sand, and water"
      >
        <style>{`
          @keyframes lampGlow {
            0%, 100% { opacity: 0.5; r: 18; }
            50% { opacity: 0.9; r: 20; }
          }
          @keyframes heatRise {
            0% { opacity: 0.5; transform: translateY(0); }
            50% { opacity: 0.9; transform: translateY(-4px); }
            100% { opacity: 0.5; transform: translateY(0); }
          }
          .lamp-glow {
            animation: lampGlow 2s ease-in-out infinite;
          }
          .heat-rise-1 {
            animation: heatRise 2s ease-in-out infinite;
          }
          .heat-rise-2 {
            animation: heatRise 2s ease-in-out infinite 0.5s;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
          .section-title {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
          .small-text {
            font-family: system-ui, sans-serif;
            font-size: 9px;
          }
          .step-num {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 700;
          }
        `}</style>

        <defs>
          <marker id="mact-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <radialGradient id="mact-lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="620" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="310" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Try This: Build a Monsoon in Your Kitchen
        </text>

        {/* ===== LEFT: Setup diagram ===== */}
        <rect x="15" y="35" width="305" height="250" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        <text x="167" y="52" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Experiment Setup
        </text>

        {/* Desk lamp (heat source = sun) */}
        <circle cx="167" cy="80" r="18" fill="url(#mact-lamp)" className="lamp-glow" />
        <rect x="163" y="95" width="8" height="25" rx="2"
          className="fill-slate-400 dark:fill-slate-500" />
        <text x="167" y="135" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Desk lamp (“sun”)
        </text>

        {/* Two containers */}
        {/* Sand container (land) */}
        <rect x="40" y="180" width="110" height="65" rx="4"
          className="fill-amber-200 dark:fill-amber-700 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="95" y="200" textAnchor="middle"
          className="label-text fill-amber-900 dark:fill-amber-200" fontWeight="600">
          Dry sand
        </text>
        <text x="95" y="215" textAnchor="middle"
          className="small-text fill-amber-800 dark:fill-amber-300">
          (“Land”)
        </text>

        {/* Heat shimmer from sand */}
        <path d="M 70 178 Q 75 165, 80 178" stroke="#ef4444" strokeWidth="1" fill="none" className="heat-rise-1" />
        <path d="M 100 178 Q 105 162, 110 178" stroke="#ef4444" strokeWidth="1" fill="none" className="heat-rise-2" />

        {/* Thermometer in sand */}
        <rect x="115" y="190" width="4" height="35" rx="2" fill="#ef4444" />
        <circle cx="117" cy="228" r="5" fill="#ef4444" />
        <text x="130" y="225" className="small-text fill-red-600 dark:fill-red-400" fontWeight="600">
          38°C
        </text>
        <text x="130" y="237" className="small-text fill-red-500 dark:fill-red-400">
          (after 10 min)
        </text>

        {/* Water container (ocean) */}
        <rect x="175" y="180" width="110" height="65" rx="4"
          className="fill-blue-200 dark:fill-blue-700 stroke-blue-400 dark:stroke-blue-600" strokeWidth="1.5" />
        <text x="230" y="200" textAnchor="middle"
          className="label-text fill-blue-900 dark:fill-blue-200" fontWeight="600">
          Water
        </text>
        <text x="230" y="215" textAnchor="middle"
          className="small-text fill-blue-800 dark:fill-blue-300">
          (“Ocean”)
        </text>

        {/* Thermometer in water */}
        <rect x="250" y="190" width="4" height="35" rx="2" fill="#3b82f6" />
        <circle cx="252" cy="228" r="5" fill="#3b82f6" />
        <text x="265" y="225" className="small-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
          24°C
        </text>
        <text x="265" y="237" className="small-text fill-blue-500 dark:fill-blue-400">
          (after 10 min)
        </text>

        {/* Incense stick */}
        <rect x="155" y="155" width="2" height="30" rx="1"
          className="fill-slate-500 dark:fill-slate-400" />
        <path d="M 156 155 Q 150 140, 158 128 Q 165 118, 155 108"
          fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" className="heat-rise-1" />
        <text x="167" y="148" className="small-text fill-slate-500 dark:fill-slate-400">
          Incense
        </text>
        <text x="167" y="158" className="small-text fill-slate-500 dark:fill-slate-400">
          (shows wind)
        </text>

        {/* Wind arrow from water to sand */}
        <path d="M 200 175 Q 170 165, 120 175" fill="none" stroke="#34d399" strokeWidth="2"
          markerEnd="url(#mact-arrow-red)" />
        <text x="160" y="168" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400" fontWeight="600">
          “Monsoon” wind!
        </text>

        {/* Temperature difference label */}
        <rect x="40" y="255" width="245" height="22" rx="3"
          className="fill-red-100 dark:fill-red-900/30" />
        <text x="162" y="270" textAnchor="middle"
          className="small-text fill-red-700 dark:fill-red-300" fontWeight="600">
          14°C difference = smoke drifts from water toward sand!
        </text>

        {/* ===== RIGHT: Steps ===== */}
        <rect x="335" y="35" width="270" height="250" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        <text x="470" y="52" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          What You Need + Steps
        </text>

        {/* Materials */}
        <text x="350" y="72" className="label-text fill-slate-700 dark:fill-slate-200" fontWeight="600">
          Materials:
        </text>
        <text x="350" y="86" className="small-text fill-slate-600 dark:fill-slate-400">
          • Two identical bowls or trays
        </text>
        <text x="350" y="98" className="small-text fill-slate-600 dark:fill-slate-400">
          • Dry sand (or soil) + water
        </text>
        <text x="350" y="110" className="small-text fill-slate-600 dark:fill-slate-400">
          • Desk lamp (60W or more)
        </text>
        <text x="350" y="122" className="small-text fill-slate-600 dark:fill-slate-400">
          • Two thermometers (or phone sensor)
        </text>
        <text x="350" y="134" className="small-text fill-slate-600 dark:fill-slate-400">
          • Incense stick or tissue paper strip
        </text>

        {/* Steps */}
        <circle cx="358" cy="155" r="8" className="fill-indigo-500 dark:fill-indigo-400" />
        <text x="358" y="159" textAnchor="middle" className="step-num fill-white">1</text>
        <text x="372" y="159" className="small-text fill-slate-700 dark:fill-slate-300">
          Fill one bowl with sand, one with water
        </text>

        <circle cx="358" cy="177" r="8" className="fill-indigo-500 dark:fill-indigo-400" />
        <text x="358" y="181" textAnchor="middle" className="step-num fill-white">2</text>
        <text x="372" y="181" className="small-text fill-slate-700 dark:fill-slate-300">
          Place both under the lamp, equal distance
        </text>

        <circle cx="358" cy="199" r="8" className="fill-indigo-500 dark:fill-indigo-400" />
        <text x="358" y="203" textAnchor="middle" className="step-num fill-white">3</text>
        <text x="372" y="203" className="small-text fill-slate-700 dark:fill-slate-300">
          Record temperature every 2 minutes (10 min)
        </text>

        <circle cx="358" cy="221" r="8" className="fill-indigo-500 dark:fill-indigo-400" />
        <text x="358" y="225" textAnchor="middle" className="step-num fill-white">4</text>
        <text x="372" y="225" className="small-text fill-slate-700 dark:fill-slate-300">
          Hold incense between bowls — watch smoke
        </text>

        <circle cx="358" cy="243" r="8" className="fill-indigo-500 dark:fill-indigo-400" />
        <text x="358" y="247" textAnchor="middle" className="step-num fill-white">5</text>
        <text x="372" y="247" className="small-text fill-slate-700 dark:fill-slate-300">
          Turn off lamp = “winter” — watch reversal!
        </text>

        <text x="470" y="270" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          Sand cools faster too — wind reverses
        </text>

        {/* Bottom: What to observe */}
        <rect x="15" y="295" width="590" height="95" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />

        <text x="310" y="312" textAnchor="middle"
          className="section-title fill-emerald-700 dark:fill-emerald-300">
          What You’re Seeing = The Monsoon Engine
        </text>

        <text x="310" y="330" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300">
          Sand (land) heats up fast → hot air rises → cooler air from above water (ocean) rushes in to fill the gap.
        </text>
        <text x="310" y="346" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300">
          This is exactly how the Indian monsoon works! The Indian subcontinent is the sand bowl.
        </text>
        <text x="310" y="362" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          Bonus: plot your temperature readings (sand vs water) on graph paper. The growing gap is what creates monsoon wind strength.
        </text>
        <text x="310" y="378" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          When you turn off the lamp, sand cools faster than water — the wind reverses. That’s the winter monsoon!
        </text>
      </svg>
    </div>
  );
};

export default ActivityMonsoonModelDiagram;
