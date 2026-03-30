const StormPressureGradientDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 660 424"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing pressure gradient force with two isobars and arrows from high to low pressure"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .big-label { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="pgf-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Pressure Gradient Force — Why Wind Begins to Move
        </text>

        {/* High pressure isobar (right) */}
        <path d="M 440 70 Q 480 200 440 330"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2.5" strokeDasharray="8,4" />
        <rect x="448" y="85" width="80" height="24" rx="6"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.8" />
        <text x="488" y="102" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          1013 mb
        </text>
        <text x="530" y="130" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          High pressure
        </text>

        {/* Low pressure isobar (left) */}
        <path d="M 160 70 Q 120 200 160 330"
          fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeDasharray="8,4" />
        <rect x="72" y="85" width="80" height="24" rx="6"
          className="fill-red-100 dark:fill-red-900" opacity="0.8" />
        <text x="112" y="102" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">
          1005 mb
        </text>
        <text x="80" y="130" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Low pressure
        </text>

        {/* H and L labels */}
        <text x="520" y="210" textAnchor="middle"
          className="big-label fill-blue-500 dark:fill-blue-400">H</text>
        <text x="80" y="210" textAnchor="middle"
          className="big-label fill-red-500 dark:fill-red-400">L</text>

        {/* PGF arrows from high to low */}
        {[130, 180, 230, 270].map((y) => (
          <line key={`pgf-${y}`} x1="420" y1={y} x2="185" y2={y}
            stroke="#3b82f6" strokeWidth="2.5"
            markerEnd="url(#pgf-arrow)" />
        ))}

        {/* Arrow label */}
        <rect x="250" y="145" width="100" height="22" rx="6"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.8" />
        <text x="300" y="160" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          PGF →
        </text>

        {/* Distance marker */}
        <line x1="185" y1="310" x2="420" y2="310"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="185" y1="304" x2="185" y2="316"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="420" y1="304" x2="420" y2="316"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <text x="300" y="328" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          distance
        </text>

        {/* Bottom caption */}
        <rect x="80" y="355" width="440" height="28" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="374" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          PGF = pressure difference ÷ distance — the bigger the difference, the stronger the wind
        </text>
      </svg>
    </div>
  );
};

export default StormPressureGradientDiagram;
