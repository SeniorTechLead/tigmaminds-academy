const StormNWPDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 455"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing numerical weather prediction with a grid overlay on a map and computational steps"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .num-text { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <defs>
          <marker id="nwp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
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
          Numerical Weather Prediction — How Computers Forecast Storms
        </text>

        {/* Step 1: Map with grid */}
        <rect x="30" y="50" width="160" height="140" rx="6"
          className="fill-blue-50 dark:fill-blue-950" opacity="0.7"
          stroke="#3b82f6" strokeWidth="1" />

        {/* Simplified land/ocean */}
        <rect x="35" y="55" width="150" height="110" rx="4"
          className="fill-blue-200 dark:fill-blue-800" opacity="0.5" />
        {/* Land mass */}
        <path d="M 100 80 Q 130 60 155 75 L 170 90 Q 160 120 140 130 Q 110 145 90 130 Q 80 110 85 90 Z"
          className="fill-green-300 dark:fill-green-800" opacity="0.6" />

        {/* Grid overlay */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={`grid-${i}`}>
            <line x1={35 + i * 30} y1="55" x2={35 + i * 30} y2="165"
              className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="0.5" opacity="0.6" />
            <line x1="35" y1={55 + i * 22} x2="185" y2={55 + i * 22}
              className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="0.5" opacity="0.6" />
          </g>
        ))}

        {/* Small data values in some cells */}
        <text x="50" y="72" className="num-text fill-blue-600 dark:fill-blue-400">T:28</text>
        <text x="80" y="94" className="num-text fill-blue-600 dark:fill-blue-400">P:1008</text>
        <text x="110" y="116" className="num-text fill-red-600 dark:fill-red-400">W:45</text>
        <text x="140" y="138" className="num-text fill-blue-600 dark:fill-blue-400">H:80%</text>

        <text x="110" y="200" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          1. Divide into grid
        </text>

        {/* Arrow 1→2 */}
        <line x1="195" y1="120" x2="220" y2="120"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#nwp-arrow)" />

        {/* Step 2: Solve physics in each box */}
        <rect x="225" y="50" width="150" height="140" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7"
          stroke="#f59e0b" strokeWidth="1" />

        {/* Equations in a box */}
        <rect x="240" y="60" width="120" height="30" rx="4"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="300" y="79" textAnchor="middle"
          className="num-text fill-amber-700 dark:fill-amber-300">∂T/∂t = advection + radiation</text>

        <rect x="240" y="95" width="120" height="30" rx="4"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="300" y="114" textAnchor="middle"
          className="num-text fill-amber-700 dark:fill-amber-300">∂v/∂t = pressure + Coriolis</text>

        <rect x="240" y="130" width="120" height="30" rx="4"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="300" y="149" textAnchor="middle"
          className="num-text fill-amber-700 dark:fill-amber-300">∂q/∂t = evaporation − rain</text>

        <text x="300" y="200" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          2. Solve physics
        </text>

        {/* Arrow 2→3 */}
        <line x1="380" y1="120" x2="410" y2="120"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#nwp-arrow)" />

        {/* Step 3: Step forward in time */}
        <rect x="415" y="50" width="160" height="140" rx="6"
          className="fill-green-50 dark:fill-green-950" opacity="0.7"
          stroke="#22c55e" strokeWidth="1" />

        {/* Time steps */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`time-${i}`}>
            <rect x={430 + i * 35} y={70 + i * 25} width="30" height="22" rx="4"
              className="fill-green-200 dark:fill-green-800" opacity={0.5 + i * 0.15} />
            <text x={445 + i * 35} y={85 + i * 25} textAnchor="middle"
              className="num-text fill-green-700 dark:fill-green-300">
              t+{i * 6}h
            </text>
            {i < 3 && (
              <line x1={462 + i * 35} y1={81 + i * 25} x2={468 + i * 35} y2={87 + i * 25}
                className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
            )}
          </g>
        ))}

        <text x="495" y="200" textAnchor="middle"
          className="step-text fill-green-700 dark:fill-green-300">
          3. Step forward in time
        </text>

        {/* Loop arrow showing repetition */}
        <path d="M 495 210 Q 520 240 495 260 Q 460 275 300 270 Q 140 265 110 250 Q 80 235 110 218"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5"
          strokeDasharray="4,3" markerEnd="url(#nwp-arrow)" />
        <text x="300" y="288" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Repeat every few minutes of model time
        </text>

        {/* Result: forecast map */}
        <rect x="150" y="305" width="300" height="75" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="325" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Result: 5-day forecast
        </text>
        {/* Mini weather icons */}
        <circle cx="200" cy="355" r="8" className="fill-yellow-400 dark:fill-yellow-500" />
        <text x="200" y="372" textAnchor="middle" className="num-text fill-slate-600 dark:fill-slate-400">Day 1</text>
        <circle cx="260" cy="355" r="8" className="fill-gray-300 dark:fill-gray-600" />
        <text x="260" y="372" textAnchor="middle" className="num-text fill-slate-600 dark:fill-slate-400">Day 2</text>
        <circle cx="320" cy="355" r="8" className="fill-blue-400 dark:fill-blue-500" />
        <text x="320" y="372" textAnchor="middle" className="num-text fill-slate-600 dark:fill-slate-400">Day 3</text>
        <circle cx="380" cy="355" r="8" className="fill-red-400 dark:fill-red-500" />
        <text x="380" y="372" textAnchor="middle" className="num-text fill-slate-600 dark:fill-slate-400">Day 4</text>

        {/* Bottom caption */}
        <rect x="50" y="390" width="500" height="22" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="405" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Divide atmosphere into millions of boxes → solve physics in each → step forward in time
        </text>
      </svg>
    </div>
  );
};

export default StormNWPDiagram;
