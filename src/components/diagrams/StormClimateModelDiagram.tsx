const StormClimateModelDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 670 432"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram comparing weather forecasts which are specific and short-term versus climate projections which show long-term trends"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .big-label { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        {/* Background */}
        <rect width="600" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Weather Forecast vs Climate Projection
        </text>

        {/* Divider */}
        <line x1="300" y1="45" x2="300" y2="350"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="300" y="42" textAnchor="middle"
          className="label-text fill-slate-400 dark:fill-slate-500">vs</text>

        {/* LEFT: Weather forecast */}
        <text x="150" y="65" textAnchor="middle"
          className="big-label fill-blue-600 dark:fill-blue-400">
          Weather Forecast
        </text>
        <text x="150" y="82" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          Next 5 days
        </text>

        {/* Weather chart - jagged detailed line */}
        <rect x="30" y="95" width="240" height="130" rx="6"
          className="fill-blue-50 dark:fill-blue-950" opacity="0.6" />

        {/* X axis */}
        <line x1="50" y1="210" x2="250" y2="210"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
          <text key={day} x={70 + i * 42} y="222" textAnchor="middle"
            className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '8px' }}>
            {day}
          </text>
        ))}

        {/* Detailed zigzag temperature line */}
        <polyline
          points="70,160 95,140 112,175 140,130 154,155 180,125 196,150 220,145 250,138"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Weather icons */}
        <circle cx="70" cy="148" r="5" className="fill-yellow-400" />
        <circle cx="112" cy="163" r="5" className="fill-gray-400" />
        <circle cx="154" cy="143" r="5" className="fill-blue-400" />

        {/* Labels */}
        <text x="150" y="245" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          Detailed and specific
        </text>
        <text x="150" y="260" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          "Rain on Thursday at 2pm"
        </text>
        <text x="150" y="278" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Accuracy fades after ~7 days
        </text>

        {/* RIGHT: Climate projection */}
        <text x="450" y="65" textAnchor="middle"
          className="big-label fill-red-600 dark:fill-red-400">
          Climate Projection
        </text>
        <text x="450" y="82" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          Next 50 years
        </text>

        {/* Climate chart - smooth trend line with band */}
        <rect x="330" y="95" width="240" height="130" rx="6"
          className="fill-red-50 dark:fill-red-950" opacity="0.6" />

        {/* X axis */}
        <line x1="350" y1="210" x2="550" y2="210"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        {['2000', '2025', '2050', '2075'].map((yr, i) => (
          <text key={yr} x={370 + i * 55} y="222" textAnchor="middle"
            className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '8px' }}>
            {yr}
          </text>
        ))}

        {/* Uncertainty band */}
        <path d="M 360 170 Q 420 165 460 155 Q 510 140 550 120 L 550 150 Q 510 165 460 175 Q 420 182 360 185 Z"
          className="fill-red-200 dark:fill-red-800" opacity="0.4" />

        {/* Smooth trend line going up */}
        <path d="M 360 178 Q 420 172 460 162 Q 510 150 550 132"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />

        {/* Trend arrow */}
        <text x="540" y="125" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="700">↑</text>

        {/* Labels */}
        <text x="450" y="245" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">
          Trends and averages
        </text>
        <text x="450" y="260" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          "Summers will be 2°C warmer"
        </text>
        <text x="450" y="278" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Big picture, not specific days
        </text>

        {/* Key difference box */}
        <rect x="100" y="295" width="400" height="55" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="313" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Think of it this way:
        </text>
        <text x="300" y="330" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Weather = "Will I need an umbrella tomorrow?"
        </text>
        <text x="300" y="344" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Climate = "Should I build my house on stilts?"
        </text>

        {/* Bottom caption */}
        <rect x="60" y="365" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="382" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Weather = what happens tomorrow. Climate = the pattern over decades.
        </text>
      </svg>
    </div>
  );
};

export default StormClimateModelDiagram;
