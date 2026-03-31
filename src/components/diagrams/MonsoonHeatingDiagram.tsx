const MonsoonHeatingDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing why land heats faster than sea due to specific heat capacity"
      >
        <style>{`
          @keyframes heatShimmer {
            0%, 100% { opacity: 0.4; transform: translateY(0); }
            50% { opacity: 0.8; transform: translateY(-3px); }
          }
          @keyframes sunPulse {
            0%, 100% { r: 28; }
            50% { r: 31; }
          }
          .heat-shimmer {
            animation: heatShimmer 2s ease-in-out infinite;
          }
          .heat-shimmer-delay {
            animation: heatShimmer 2s ease-in-out infinite 0.7s;
          }
          .sun-pulse {
            animation: sunPulse 3s ease-in-out infinite;
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
          .value-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-weight: 700;
          }
          .small-text {
            font-family: system-ui, sans-serif;
            font-size: 9px;
          }
        `}</style>

        <defs>
          <marker id="mheat-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="mheat-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="mheat-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <linearGradient id="mheat-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="mheat-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="mheat-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="620" height="460" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="310" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Why Land Heats Faster Than Sea
        </text>

        {/* Sun */}
        <circle cx="310" cy="60" r="28" fill="url(#mheat-sun)" className="sun-pulse" />
        <text x="310" y="64" textAnchor="middle"
          className="label-text fill-amber-900" fontWeight="700">
          Sun
        </text>

        {/* Sun rays to both sides */}
        <line x1="270" y1="70" x2="170" y2="130" stroke="#f59e0b" strokeWidth="1.5"
          markerEnd="url(#mheat-arrow-amber)" strokeDasharray="4 3" />
        <line x1="350" y1="70" x2="450" y2="130" stroke="#f59e0b" strokeWidth="1.5"
          markerEnd="url(#mheat-arrow-amber)" strokeDasharray="4 3" />
        <text x="210" y="96" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400">
          Same energy
        </text>
        <text x="410" y="96" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400">
          Same energy
        </text>

        {/* ===== LEFT SIDE: LAND ===== */}
        <rect x="30" y="140" width="260" height="130" rx="6" fill="url(#mheat-land)" opacity="0.8" />

        {/* Heat shimmer lines over land */}
        <path d="M 80 138 Q 90 125, 100 138" stroke="#ef4444" strokeWidth="1.5" fill="none" className="heat-shimmer" opacity="0.6" />
        <path d="M 130 138 Q 140 120, 150 138" stroke="#ef4444" strokeWidth="1.5" fill="none" className="heat-shimmer-delay" opacity="0.6" />
        <path d="M 180 138 Q 190 125, 200 138" stroke="#ef4444" strokeWidth="1.5" fill="none" className="heat-shimmer" opacity="0.6" />
        <path d="M 230 138 Q 240 120, 250 138" stroke="#ef4444" strokeWidth="1.5" fill="none" className="heat-shimmer-delay" opacity="0.6" />

        <text x="160" y="160" textAnchor="middle"
          className="section-title fill-amber-100">
          LAND (India)
        </text>
        <text x="160" y="178" textAnchor="middle"
          className="label-text fill-amber-200">
          Heats quickly, cools quickly
        </text>

        {/* Specific heat box */}
        <rect x="60" y="190" width="200" height="55" rx="4"
          fill="#78350f" stroke="#d97706" strokeWidth="1" opacity="0.7" />
        <text x="160" y="207" textAnchor="middle"
          className="label-text fill-amber-200">
          Specific heat capacity:
        </text>
        <text x="160" y="222" textAnchor="middle"
          className="value-text fill-red-400">
          ~800 J/kg\u00B7K (rock/soil)
        </text>
        <text x="160" y="237" textAnchor="middle"
          className="small-text fill-amber-300">
          Lower = heats up fast with less energy
        </text>

        {/* Temperature indicator */}
        <rect x="70" y="252" width="24" height="12" rx="2" fill="#ef4444" />
        <text x="100" y="262" className="value-text fill-amber-100">
          Summer: 45\u201350\u00B0C surface
        </text>

        {/* ===== RIGHT SIDE: OCEAN ===== */}
        <rect x="330" y="140" width="260" height="130" rx="6" fill="url(#mheat-ocean)" />

        <text x="460" y="160" textAnchor="middle"
          className="section-title fill-blue-100">
          OCEAN (Indian Ocean)
        </text>
        <text x="460" y="178" textAnchor="middle"
          className="label-text fill-blue-200">
          Heats slowly, cools slowly
        </text>

        {/* Mixing arrows in ocean */}
        <path d="M 370 195 Q 380 220, 390 195" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M 430 195 Q 440 225, 450 195" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M 500 195 Q 510 220, 520 195" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.5" />
        <text x="460" y="220" textAnchor="middle"
          className="small-text fill-blue-300">
          Water mixes \u2014 heat spreads deep
        </text>

        {/* Specific heat box */}
        <rect x="360" y="230" width="200" height="35" rx="4"
          fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1" opacity="0.7" />
        <text x="460" y="247" textAnchor="middle"
          className="label-text fill-blue-200">
          Specific heat capacity:
        </text>
        <text x="460" y="260" textAnchor="middle"
          className="value-text fill-blue-300">
          4,186 J/kg\u00B7K (water) \u2014 5\u00D7 more!
        </text>

        {/* ===== BOTTOM: THE MONSOON ENGINE ===== */}
        <rect x="30" y="290" width="560" height="155" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        <text x="310" y="310" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          The Monsoon Engine: Differential Heating \u2192 Pressure Difference \u2192 Wind
        </text>

        {/* Step 1: Hot land = low pressure */}
        <rect x="45" y="322" width="155" height="52" rx="4"
          className="fill-red-50 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="122" y="338" textAnchor="middle"
          className="label-text fill-red-700 dark:fill-red-300" fontWeight="600">
          1. Hot land
        </text>
        <text x="122" y="352" textAnchor="middle"
          className="small-text fill-red-600 dark:fill-red-400">
          Air heats up, expands, rises
        </text>
        <text x="122" y="365" textAnchor="middle"
          className="value-text fill-red-700 dark:fill-red-300">
          LOW pressure zone
        </text>

        {/* Arrow 1->2 */}
        <line x1="205" y1="348" x2="235" y2="348" stroke="#ef4444" strokeWidth="1.5"
          markerEnd="url(#mheat-arrow-red)" />

        {/* Step 2: Cool ocean = high pressure */}
        <rect x="240" y="322" width="155" height="52" rx="4"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="317" y="338" textAnchor="middle"
          className="label-text fill-blue-700 dark:fill-blue-300" fontWeight="600">
          2. Cooler ocean
        </text>
        <text x="317" y="352" textAnchor="middle"
          className="small-text fill-blue-600 dark:fill-blue-400">
          Air stays denser, sinks
        </text>
        <text x="317" y="365" textAnchor="middle"
          className="value-text fill-blue-700 dark:fill-blue-300">
          HIGH pressure zone
        </text>

        {/* Arrow 2->3 */}
        <line x1="400" y1="348" x2="430" y2="348" stroke="#60a5fa" strokeWidth="1.5"
          markerEnd="url(#mheat-arrow-blue)" />

        {/* Step 3: Wind */}
        <rect x="435" y="322" width="140" height="52" rx="4"
          className="fill-emerald-50 dark:fill-emerald-900/30 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="505" y="338" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
          3. MONSOON WIND
        </text>
        <text x="505" y="352" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          Air rushes from high
        </text>
        <text x="505" y="365" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          to low pressure
        </text>

        {/* Key insight */}
        <rect x="50" y="385" width="520" height="48" rx="4"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="310" y="402" textAnchor="middle"
          className="label-text fill-amber-800 dark:fill-amber-200" fontWeight="600">
          Key insight: Water needs 5\u00D7 more energy than rock to heat up 1\u00B0C.
        </text>
        <text x="310" y="416" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          So in summer, India heats to 45\u00B0C while the ocean stays at 28\u00B0C. This 17\u00B0C gap creates the pressure
        </text>
        <text x="310" y="428" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          difference that pulls moist ocean air inland \u2014 the southwest monsoon.
        </text>
      </svg>
    </div>
  );
};

export default MonsoonHeatingDiagram;
