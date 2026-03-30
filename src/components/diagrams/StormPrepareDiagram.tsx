const StormPrepareDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 685 432"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cyclone preparedness timeline showing shelter, supplies, evacuation route, and radio as key preparation steps"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .time-text { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
        `}</style>

        <defs>
          <marker id="prep-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Cyclone Preparedness Timeline
        </text>

        {/* Timeline arrow */}
        <line x1="60" y1="75" x2="540" y2="75"
          className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="3"
          markerEnd="url(#prep-arrow)" />

        {/* Time markers */}
        <text x="80" y="65" textAnchor="middle"
          className="time-text fill-amber-600 dark:fill-amber-400">72 hours</text>
        <text x="210" y="65" textAnchor="middle"
          className="time-text fill-amber-600 dark:fill-amber-400">48 hours</text>
        <text x="340" y="65" textAnchor="middle"
          className="time-text fill-amber-600 dark:fill-amber-400">24 hours</text>
        <text x="470" y="65" textAnchor="middle"
          className="time-text fill-red-600 dark:fill-red-400">6 hours</text>

        {/* Tick marks */}
        {[80, 210, 340, 470].map((x) => (
          <line key={`tick-${x}`} x1={x} y1="70" x2={x} y2="80"
            className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        ))}

        <text x="555" y="65" textAnchor="middle"
          className="time-text fill-red-600 dark:fill-red-400">STORM</text>

        {/* Item 1: Shelter */}
        <rect x="30" y="100" width="120" height="120" rx="8"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.7"
          stroke="#3b82f6" strokeWidth="1.5" />
        {/* House icon */}
        <path d="M 90 120 L 65 140 L 115 140 Z"
          className="fill-blue-400 dark:fill-blue-500" />
        <rect x="75" y="140" width="30" height="25" rx="2"
          className="fill-blue-300 dark:fill-blue-600" />
        <rect x="85" y="148" width="10" height="17" rx="1"
          className="fill-blue-500 dark:fill-blue-400" />
        <text x="90" y="182" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          Shelter
        </text>
        <text x="90" y="196" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Identify safe
        </text>
        <text x="90" y="208" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          buildings nearby
        </text>

        {/* Item 2: Supplies */}
        <rect x="170" y="100" width="120" height="120" rx="8"
          className="fill-green-100 dark:fill-green-900" opacity="0.7"
          stroke="#22c55e" strokeWidth="1.5" />
        {/* Water bottle icon */}
        <rect x="220" y="118" width="16" height="30" rx="3"
          className="fill-green-300 dark:fill-green-600" />
        <rect x="222" y="112" width="12" height="8" rx="2"
          className="fill-green-400 dark:fill-green-500" />
        {/* Food can */}
        <rect x="242" y="125" width="14" height="22" rx="3"
          className="fill-green-400 dark:fill-green-500" />
        <text x="230" y="168" textAnchor="middle"
          className="step-text fill-green-700 dark:fill-green-300">
          Supplies
        </text>
        <text x="230" y="182" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400">
          Water (3 days),
        </text>
        <text x="230" y="194" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400">
          food, medicines,
        </text>
        <text x="230" y="206" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400">
          torch, batteries
        </text>

        {/* Item 3: Evacuation route */}
        <rect x="310" y="100" width="120" height="120" rx="8"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.7"
          stroke="#f59e0b" strokeWidth="1.5" />
        {/* Map/route icon */}
        <rect x="345" y="115" width="30" height="22" rx="3"
          className="fill-amber-200 dark:fill-amber-700" />
        <polyline points="350,132 358,120 365,128 370,118"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <circle cx="370" cy="118" r="3" className="fill-red-500 dark:fill-red-400" />
        <text x="370" y="156" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          Evacuation
        </text>
        <text x="370" y="170" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Know your route
        </text>
        <text x="370" y="182" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          to higher ground
        </text>
        <text x="370" y="194" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          or shelter
        </text>

        {/* Item 4: Radio */}
        <rect x="450" y="100" width="120" height="120" rx="8"
          className="fill-red-100 dark:fill-red-900" opacity="0.7"
          stroke="#ef4444" strokeWidth="1.5" />
        {/* Radio icon */}
        <rect x="490" y="116" width="24" height="30" rx="4"
          className="fill-red-300 dark:fill-red-600" />
        <line x1="502" y1="116" x2="508" y2="100"
          className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" />
        <circle cx="508" cy="98" r="2" className="fill-red-400 dark:fill-red-500" />
        <circle cx="502" y="130" r="6"
          className="fill-red-200 dark:fill-red-700 stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
        <text x="510" y="164" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">
          Radio
        </text>
        <text x="510" y="178" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Battery-powered
        </text>
        <text x="510" y="190" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          radio for official
        </text>
        <text x="510" y="202" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          warnings
        </text>

        {/* Checklist section */}
        <rect x="50" y="240" width="500" height="110" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="260" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Your Storm Checklist
        </text>

        {[
          { x: 100, text: 'Safe meeting point for family' },
          { x: 100, text: 'Important documents in waterproof bag' },
          { x: 350, text: 'Phone charged, emergency numbers saved' },
          { x: 350, text: 'Know nearest cyclone shelter location' },
        ].map((item, i) => (
          <g key={`check-${i}`}>
            <rect x={item.x - 30} y={272 + (i % 2) * 22} width="12" height="12" rx="2"
              className="fill-green-200 dark:fill-green-800 stroke-green-500 dark:stroke-green-400" strokeWidth="1" />
            <text x={item.x - 12} y={282 + (i % 2) * 22}
              className="label-text fill-slate-600 dark:fill-slate-300">
              {item.text}
            </text>
          </g>
        ))}

        {/* Bottom caption */}
        <rect x="60" y="365" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="382" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Prepare before the storm: shelter, water, radio, evacuation plan
        </text>
      </svg>
    </div>
  );
};

export default StormPrepareDiagram;
