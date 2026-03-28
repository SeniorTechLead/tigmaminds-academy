const EarthMagnetismDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 450 350"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Earth's magnetic field diagram showing field lines, geographic vs magnetic north, and compass alignment"
      >
        <style>{`
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
          <marker id="mag-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
          </marker>
          <radialGradient id="mag-earth-grad" cx="45%" cy="45%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="450" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="225" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Earth's Magnetic Field
        </text>

        {/* Earth */}
        <circle cx="200" cy="180" r="60" fill="url(#mag-earth-grad)" />
        {/* Continent hints */}
        <ellipse cx="185" cy="168" rx="12" ry="20" fill="#22c55e" opacity="0.4" />
        <ellipse cx="210" cy="185" rx="9" ry="12" fill="#22c55e" opacity="0.4" />

        {/* Earth's axis (tilted) */}
        <line x1="200" y1="108" x2="200" y2="252"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="4 3" />

        {/* Geographic N label */}
        <text x="200" y="100" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600" style={{ fontSize: '10px' }}>
          Geographic N
        </text>

        {/* Geographic S label */}
        <text x="200" y="268" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px' }}>
          Geographic S
        </text>

        {/* Magnetic axis (offset ~11 degrees) */}
        <line x1="212" y1="112" x2="188" y2="248"
          stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5 3" />

        {/* Magnetic N label (offset from geographic) */}
        <text x="224" y="108" textAnchor="start"
          className="label-text fill-purple-600 dark:fill-purple-400" fontWeight="600" style={{ fontSize: '10px' }}>
          Magnetic N
        </text>

        {/* Magnetic S label */}
        <text x="168" y="260" textAnchor="end"
          className="label-text fill-purple-600 dark:fill-purple-400" style={{ fontSize: '10px' }}>
          Magnetic S
        </text>

        {/* Offset angle indicator */}
        <path d="M 200 120 A 12 12 0 0 1 208 118" fill="none"
          stroke="#f97316" strokeWidth="1.5" />
        <text x="216" y="122" className="label-text fill-orange-500 dark:fill-orange-400" style={{ fontSize: '10px' }}>
          ~11°
        </text>

        {/* Magnetic field lines */}
        {/* Right side field lines */}
        <path d="M 212 112 Q 310 100, 340 180 Q 310 260, 188 248" fill="none"
          stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#mag-arrow)" opacity="0.7" />
        <path d="M 212 112 Q 370 80, 395 180 Q 370 290, 188 248" fill="none"
          stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#mag-arrow)" opacity="0.5" />

        {/* Left side field lines */}
        <path d="M 212 112 Q 90 100, 60 180 Q 90 260, 188 248" fill="none"
          stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#mag-arrow)" opacity="0.7" />
        <path d="M 212 112 Q 30 80, 5 180 Q 30 290, 188 248" fill="none"
          stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#mag-arrow)" opacity="0.5" />

        {/* Inner field lines (through Earth) */}
        <line x1="192" y1="230" x2="208" y2="130"
          stroke="#8b5cf6" strokeWidth="1" opacity="0.3" />

        {/* Compass section */}
        <g transform="translate(370, 60)">
          {/* Compass body */}
          <circle cx="0" cy="0" r="28"
            className="fill-slate-100 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

          {/* Compass rose */}
          <text x="0" y="-18" textAnchor="middle"
            className="label-text fill-red-500" style={{ fontSize: '10px', fontWeight: 600 }}>N</text>
          <text x="0" y="24" textAnchor="middle"
            className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>S</text>
          <text x="18" y="4" textAnchor="middle"
            className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>E</text>
          <text x="-18" y="4" textAnchor="middle"
            className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>W</text>

          {/* Needle — red half points to magnetic north (slightly offset) */}
          <line x1="2" y1="12" x2="-2" y2="-12"
            stroke="#ef4444" strokeWidth="2.5" />
          <polygon points="-2,-12 2,-12 0,-18" fill="#ef4444" />
          <line x1="-2" y1="-12" x2="2" y2="12"
            className="stroke-slate-400" strokeWidth="2.5" />
          <polygon points="-2,12 2,12 0,18" className="fill-slate-400" />

          {/* Center pin */}
          <circle cx="0" cy="0" r="2.5"
            className="fill-slate-500 dark:fill-slate-400" />
        </g>

        {/* Compass label */}
        <text x="370" y="100" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px' }}>
          Compass needle
        </text>
        <text x="370" y="112" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px' }}>
          aligns with field
        </text>

        {/* Inner core label */}
        <circle cx="200" cy="180" r="12"
          fill="#f97316" opacity="0.4" className="stroke-orange-500" strokeWidth="1" />
        <text x="200" y="184" textAnchor="middle"
          className="label-text fill-orange-700 dark:fill-orange-300" style={{ fontSize: '10px' }}>
          Core
        </text>

        {/* Explanation */}
        <text x="225" y="310" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Earth's molten iron core generates a magnetic field.
        </text>
        <text x="225" y="324" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          The magnetic poles are offset from the geographic poles by about 11 degrees.
        </text>

        {/* Field line direction label */}
        <text x="345" y="178" textAnchor="start"
          className="label-text fill-purple-600 dark:fill-purple-400" style={{ fontSize: '10px' }}>
          Field lines
        </text>
      </svg>
    </div>
  );
};

export default EarthMagnetismDiagram;
