export default function FluteFingerHoleDiagram() {
  const holes = [
    { x: 210, open: false, note: '\u2014', freq: '572 Hz', label: 'All closed' },
    { x: 250, open: true, note: 'E\u2085', freq: '659 Hz', label: 'Hole 1 open' },
    { x: 300, open: true, note: 'G\u2085', freq: '784 Hz', label: 'Holes 1\u20132 open' },
    { x: 350, open: true, note: 'A\u2085', freq: '880 Hz', label: 'Holes 1\u20133 open' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how opening finger holes on a bamboo flute shortens the vibrating air column, raising the pitch"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .formula { font-family: system-ui, sans-serif; font-size: 12px; font-style: italic; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .note { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <rect width="600" height="520" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Finger Holes Change the Note
        </text>
        <text x="300" y="48" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
          Opening a hole shortens the vibrating air column \u2192 higher frequency \u2192 higher pitch
        </text>

        {/* Row 1: All holes closed */}
        <g transform="translate(0, 70)">
          <text x="20" y="15" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">All closed</text>
          <text x="530" y="15" textAnchor="end" className="note fill-blue-600 dark:fill-blue-400">D\u2085 (572 Hz)</text>

          {/* Tube */}
          <rect x="60" y="25" width="480" height="30" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />

          {/* Embouchure hole */}
          <circle cx="100" cy="40" r="8" className="fill-amber-300 dark:fill-amber-700" stroke="#b45309" strokeWidth="1" />
          <text x="100" y="70" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">blow</text>

          {/* Closed finger holes */}
          {[210, 260, 310, 360, 410].map((hx, i) => (
            <g key={i}>
              <circle cx={hx} cy={40} r={8} className="fill-amber-700 dark:fill-amber-600" stroke="#78350f" strokeWidth="1.5" />
              <line x1={hx - 4} y1={36} x2={hx + 4} y2={44} className="stroke-amber-900 dark:stroke-amber-300" strokeWidth="1.5" />
            </g>
          ))}

          {/* Vibrating air column - full length */}
          <rect x="62" y="27" width="476" height="26" rx="3" className="fill-blue-400/20 dark:fill-blue-500/15" />
          <line x1="62" y1="60" x2="538" y2="60" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#fhArrow)" markerStart="url(#fhArrowR)" />
          <text x="300" y="58" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400" fontWeight="600">L = 30 cm (full length)</text>
        </g>

        {/* Row 2: First hole open */}
        <g transform="translate(0, 180)">
          <text x="20" y="15" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">1st hole open</text>
          <text x="530" y="15" textAnchor="end" className="note fill-emerald-600 dark:fill-emerald-400">E\u2085 (659 Hz)</text>

          <rect x="60" y="25" width="480" height="30" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="100" cy="40" r="8" className="fill-amber-300 dark:fill-amber-700" stroke="#b45309" strokeWidth="1" />

          {/* First hole OPEN */}
          <circle cx="410" cy="40" r="8" className="fill-white dark:fill-slate-800" stroke="#059669" strokeWidth="2" />
          <text x="410" y="18" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">open</text>

          {/* Other holes closed */}
          {[210, 260, 310, 360].map((hx, i) => (
            <g key={i}>
              <circle cx={hx} cy={40} r={8} className="fill-amber-700 dark:fill-amber-600" stroke="#78350f" strokeWidth="1.5" />
            </g>
          ))}

          {/* Shorter air column */}
          <rect x="62" y="27" width="346" height="26" rx="3" className="fill-emerald-400/20 dark:fill-emerald-500/15" />
          <line x1="62" y1="60" x2="408" y2="60" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" markerEnd="url(#fhArrow)" markerStart="url(#fhArrowR)" />
          <text x="235" y="58" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">L\u2032 = 26 cm</text>

          {/* Escaped air */}
          <path d="M410,25 Q415,15 420,10 M410,25 Q405,15 400,12" fill="none" className="stroke-emerald-400/60 dark:stroke-emerald-400/40" strokeWidth="1.5" />
        </g>

        {/* Row 3: Two holes open */}
        <g transform="translate(0, 290)">
          <text x="20" y="15" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">2 holes open</text>
          <text x="530" y="15" textAnchor="end" className="note fill-violet-600 dark:fill-violet-400">G\u2085 (784 Hz)</text>

          <rect x="60" y="25" width="480" height="30" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="100" cy="40" r="8" className="fill-amber-300 dark:fill-amber-700" stroke="#b45309" strokeWidth="1" />

          {/* Two holes OPEN */}
          <circle cx="360" cy="40" r="8" className="fill-white dark:fill-slate-800" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="410" cy="40" r="8" className="fill-white dark:fill-slate-800" stroke="#7c3aed" strokeWidth="2" />

          {[210, 260, 310].map((hx, i) => (
            <g key={i}>
              <circle cx={hx} cy={40} r={8} className="fill-amber-700 dark:fill-amber-600" stroke="#78350f" strokeWidth="1.5" />
            </g>
          ))}

          <rect x="62" y="27" width="296" height="26" rx="3" className="fill-violet-400/20 dark:fill-violet-500/15" />
          <line x1="62" y1="60" x2="358" y2="60" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" markerEnd="url(#fhArrow)" markerStart="url(#fhArrowR)" />
          <text x="210" y="58" textAnchor="middle" className="small fill-violet-600 dark:fill-violet-400" fontWeight="600">L\u2033 = 22 cm</text>
        </g>

        {/* Summary box */}
        <rect x="40" y="400" width="520" height="100" rx="8" className="fill-slate-100 dark:fill-slate-800/60" />

        <text x="300" y="422" textAnchor="middle" className="label fill-gray-800 dark:fill-slate-200" fontWeight="600">
          The Rule: f = v / 2L\u2032
        </text>
        <text x="300" y="442" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          L\u2032 = effective length from embouchure to the first open hole
        </text>
        <text x="300" y="460" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Shorter air column \u2192 shorter wavelength \u2192 higher frequency \u2192 higher pitch
        </text>
        <text x="300" y="480" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Each open hole acts as a new \u201Cend\u201D of the tube for the standing wave
        </text>

        <defs>
          <marker id="fhArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-gray-500 dark:stroke-slate-400" strokeWidth="1" />
          </marker>
          <marker id="fhArrowR" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M8,0 L0,3 L8,6" fill="none" className="stroke-gray-500 dark:stroke-slate-400" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
