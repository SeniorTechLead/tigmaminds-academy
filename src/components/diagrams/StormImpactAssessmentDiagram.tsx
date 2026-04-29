const StormImpactAssessmentDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 657 457"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Impact assessment flow chart showing wind speed, pressure, and coastal slope feeding into surge height, then inundation area, then population at risk"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .small-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .value-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="ia-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="ia-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Impact Assessment — From Storm Data to People at Risk
        </text>

        {/* INPUT BOXES (top row) */}
        {/* Wind Speed */}
        <rect x="30" y="50" width="140" height="70" rx="8"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.7"
          stroke="#3b82f6" strokeWidth="1.5" />
        <text x="100" y="72" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">Wind Speed</text>
        <text x="100" y="95" textAnchor="middle"
          className="value-text fill-blue-600 dark:fill-blue-400">185 km/h</text>
        <text x="100" y="110" textAnchor="middle"
          className="small-text fill-blue-500 dark:fill-blue-400">(Category 3)</text>

        {/* Pressure */}
        <rect x="230" y="50" width="140" height="70" rx="8"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.7"
          stroke="#f59e0b" strokeWidth="1.5" />
        <text x="300" y="72" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">Central Pressure</text>
        <text x="300" y="95" textAnchor="middle"
          className="value-text fill-amber-600 dark:fill-amber-400">960 mb</text>
        <text x="300" y="110" textAnchor="middle"
          className="small-text fill-amber-500 dark:fill-amber-400">(Very low)</text>

        {/* Coastal Slope */}
        <rect x="430" y="50" width="140" height="70" rx="8"
          className="fill-green-100 dark:fill-green-900" opacity="0.7"
          stroke="#22c55e" strokeWidth="1.5" />
        <text x="500" y="72" textAnchor="middle"
          className="step-text fill-green-700 dark:fill-green-300">Coastal Slope</text>
        <text x="500" y="95" textAnchor="middle"
          className="value-text fill-green-600 dark:fill-green-400">1:500</text>
        <text x="500" y="110" textAnchor="middle"
          className="small-text fill-green-500 dark:fill-green-400">(Very shallow)</text>

        {/* Arrows down to surge height */}
        <line x1="100" y1="122" x2="255" y2="158"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ia-arrow)" />
        <line x1="300" y1="122" x2="300" y2="158"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ia-arrow)" />
        <line x1="500" y1="122" x2="345" y2="158"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ia-arrow)" />

        {/* SURGE HEIGHT (calculation box) */}
        <rect x="200" y="160" width="200" height="60" rx="10"
          className="fill-orange-100 dark:fill-orange-900" opacity="0.8"
          stroke="#f97316" strokeWidth="2" />
        <text x="300" y="180" textAnchor="middle"
          className="step-text fill-orange-700 dark:fill-orange-300">
          Surge Height Calculation
        </text>
        <text x="300" y="200" textAnchor="middle"
          className="value-text fill-orange-600 dark:fill-orange-400">
          = 4.5 metres
        </text>
        <text x="300" y="214" textAnchor="middle"
          className="small-text fill-orange-500 dark:fill-orange-400">
          (wind pushes water + low pressure lifts water + shallow coast amplifies)
        </text>

        {/* Arrow down */}
        <line x1="300" y1="222" x2="300" y2="248"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#ia-red)" />

        {/* INUNDATION AREA */}
        <rect x="170" y="250" width="260" height="55" rx="10"
          className="fill-red-100 dark:fill-red-900" opacity="0.8"
          stroke="#ef4444" strokeWidth="2" />
        <text x="300" y="270" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">
          Inundation Area
        </text>
        <text x="300" y="290" textAnchor="middle"
          className="value-text fill-red-600 dark:fill-red-400">
          120 km of coast × 8 km inland = 960 km²
        </text>

        {/* Arrow down */}
        <line x1="300" y1="307" x2="300" y2="333"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#ia-red)" />

        {/* POPULATION AT RISK */}
        <rect x="150" y="335" width="300" height="50" rx="10"
          className="fill-red-200 dark:fill-red-800" opacity="0.8"
          stroke="#ef4444" strokeWidth="2.5" />
        <text x="300" y="355" textAnchor="middle"
          className="step-text fill-red-800 dark:fill-red-200">
          Population at Risk
        </text>
        <text x="300" y="375" textAnchor="middle"
          className="value-text fill-red-700 dark:fill-red-300">
          ~2.4 million people
        </text>

        {/* Side annotations */}
        {/* Formula callout */}
        <rect x="430" y="165" width="150" height="50" rx="6"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7" />
        <text x="505" y="182" textAnchor="middle"
          className="small-text fill-slate-600 dark:fill-slate-300">
          surge ≈ k × V² / g ×
        </text>
        <text x="505" y="196" textAnchor="middle"
          className="small-text fill-slate-600 dark:fill-slate-300">
          (1/slope) × cos(angle)
        </text>
        <line x1="430" y1="190" x2="402" y2="190"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />

        {/* Population density note */}
        <rect x="470" y="340" width="115" height="45" rx="6"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7" />
        <text x="527" y="357" textAnchor="middle"
          className="small-text fill-slate-600 dark:fill-slate-300">
          960 km² × 2500
        </text>
        <text x="527" y="371" textAnchor="middle"
          className="small-text fill-slate-600 dark:fill-slate-300">
          people/km² average
        </text>
        <line x1="470" y1="362" x2="452" y2="362"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />

        {/* Bottom caption */}
        <rect x="60" y="392" width="480" height="22" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="407" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Your code will chain these calculations to estimate who needs to evacuate
        </text>
      </svg>
    </div>
  );
};

export default StormImpactAssessmentDiagram;
