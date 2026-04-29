const StormCoriolisFormationDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 670 451"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing the Coriolis effect at different latitudes with increasing deflection from equator to 30 degrees north"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .lat-text { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="cor-straight" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
          </marker>
          <marker id="cor-curve" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Coriolis Effect at Different Latitudes
        </text>

        {/* Panel 1: Equator (0°) — no deflection */}
        <rect x="20" y="50" width="170" height="260" rx="8"
          className="fill-green-50 dark:fill-green-950" opacity="0.6"
          stroke="#22c55e" strokeWidth="1.5" />
        <text x="105" y="75" textAnchor="middle"
          className="lat-text fill-green-600 dark:fill-green-400">0° Equator</text>

        {/* Earth surface line */}
        <rect x="35" y="230" width="140" height="8" rx="2"
          className="fill-green-200 dark:fill-green-800" />

        {/* Straight arrow — no deflection */}
        <line x1="105" y1="220" x2="105" y2="110"
          stroke="#6b7280" strokeWidth="2.5" markerEnd="url(#cor-straight)" />
        <text x="125" y="165" textAnchor="start"
          className="label-text fill-slate-600 dark:fill-slate-400">
          Straight
        </text>
        <text x="125" y="178" textAnchor="start"
          className="label-text fill-slate-600 dark:fill-slate-400">
          path
        </text>

        <rect x="35" y="250" width="140" height="40" rx="6"
          className="fill-green-100 dark:fill-green-900" opacity="0.8" />
        <text x="105" y="268" textAnchor="middle"
          className="step-text fill-green-700 dark:fill-green-300">
          No deflection
        </text>
        <text x="105" y="283" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400">
          Coriolis = 0
        </text>

        {/* Panel 2: 15°N — moderate deflection */}
        <rect x="215" y="50" width="170" height="260" rx="8"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.6"
          stroke="#f59e0b" strokeWidth="1.5" />
        <text x="300" y="75" textAnchor="middle"
          className="lat-text fill-amber-600 dark:fill-amber-400">15°N</text>

        {/* Earth surface */}
        <rect x="230" y="230" width="140" height="8" rx="2"
          className="fill-amber-200 dark:fill-amber-800" />

        {/* Intended path (dashed) */}
        <line x1="300" y1="220" x2="300" y2="110"
          stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Curved deflected path */}
        <path d="M 300 220 Q 310 175 330 130"
          fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#cor-curve)" />

        <text x="340" y="155" textAnchor="start"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Moderate
        </text>
        <text x="340" y="168" textAnchor="start"
          className="label-text fill-blue-600 dark:fill-blue-400">
          curve
        </text>

        <rect x="230" y="250" width="140" height="40" rx="6"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="300" y="268" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          Moderate deflection
        </text>
        <text x="300" y="283" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Cyclones can form here
        </text>

        {/* Panel 3: 30°N — strong deflection */}
        <rect x="410" y="50" width="170" height="260" rx="8"
          className="fill-red-50 dark:fill-red-950" opacity="0.6"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="495" y="75" textAnchor="middle"
          className="lat-text fill-red-600 dark:fill-red-400">30°N</text>

        {/* Earth surface */}
        <rect x="425" y="230" width="140" height="8" rx="2"
          className="fill-red-200 dark:fill-red-800" />

        {/* Intended path (dashed) */}
        <line x1="495" y1="220" x2="495" y2="110"
          stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Strongly curved deflected path */}
        <path d="M 495 220 Q 520 175 555 145"
          fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#cor-curve)" />

        <text x="540" y="175" textAnchor="start"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Strong
        </text>
        <text x="540" y="188" textAnchor="start"
          className="label-text fill-blue-600 dark:fill-blue-400">
          curve
        </text>

        <rect x="425" y="250" width="140" height="40" rx="6"
          className="fill-red-100 dark:fill-red-900" opacity="0.8" />
        <text x="495" y="268" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">
          Strong deflection
        </text>
        <text x="495" y="283" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Storms curve away
        </text>

        {/* Key insight box */}
        <rect x="50" y="320" width="500" height="50" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="340" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Why cyclones need latitude 5°–20° to form:
        </text>
        <text x="300" y="358" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Too close to equator = no spin. Too far = too much deflection before strengthening.
        </text>

        {/* Bottom caption */}
        <rect x="60" y="385" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="401" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          The Coriolis effect increases with latitude — it gives cyclones their spin
        </text>
      </svg>
    </div>
  );
};

export default StormCoriolisFormationDiagram;
