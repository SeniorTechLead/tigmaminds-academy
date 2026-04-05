const CatenaryBridgeDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 520 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Catenary curve of a rope bridge between two cliffs showing sag, span, and tension"
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
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="cat-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="cat-arrow-slate" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="280" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Catenary Curve — Rope Bridge
        </text>

        {/* Sky background */}
        <rect x="1" y="30" width="498" height="200" fill="#e0f2fe" opacity="0.3" />

        {/* Left cliff */}
        <rect x="30" y="80" width="80" height="170" rx="2"
          fill="#78716c" opacity="0.5" stroke="#57534e" strokeWidth="1.5" />
        <text x="70" y="240" textAnchor="middle"
          className="label-text fill-stone-600 dark:fill-stone-400" style={{ fontSize: '9px' }}>cliff</text>

        {/* Right cliff */}
        <rect x="390" y="80" width="80" height="170" rx="2"
          fill="#78716c" opacity="0.5" stroke="#57534e" strokeWidth="1.5" />
        <text x="430" y="240" textAnchor="middle"
          className="label-text fill-stone-600 dark:fill-stone-400" style={{ fontSize: '9px' }}>cliff</text>

        {/* Anchor points */}
        <circle cx="110" cy="90" r="4" fill="#78716c" stroke="#44403c" strokeWidth="1.5" />
        <circle cx="390" cy="90" r="4" fill="#78716c" stroke="#44403c" strokeWidth="1.5" />

        {/* Straight line (dotted) for comparison */}
        <line x1="110" y1="90" x2="390" y2="90"
          stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="310" y="82" textAnchor="middle"
          className="label-text fill-slate-400" style={{ fontSize: '9px' }}>
          straight line (no gravity)
        </text>

        {/* Catenary curve */}
        <path d="M 110 90 Q 170 180, 250 190 Q 330 180, 390 90"
          fill="none" stroke="#92400e" strokeWidth="3" />

        {/* Rope texture lines */}
        {[140, 170, 200, 230, 260, 290, 320, 350].map((x) => (
          <line key={x} x1={x} y1={-2} x2={x + 3} y2={2}
            stroke="#92400e" strokeWidth="0.8" opacity="0.4"
            transform={`translate(0, ${90 + Math.sin((x - 110) * Math.PI / 280) * 100})`} />
        ))}

        {/* Sag dimension */}
        <line x1="250" y1="90" x2="250" y2="190"
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="242" y1="90" x2="258" y2="90" stroke="#3b82f6" strokeWidth="1" />
        <line x1="242" y1="190" x2="258" y2="190" stroke="#3b82f6" strokeWidth="1" />
        <text x="265" y="145" className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
          sag
        </text>

        {/* Span dimension */}
        <line x1="110" y1="210" x2="390" y2="210"
          stroke="#64748b" strokeWidth="1" markerEnd="url(#cat-arrow-slate)" />
        <line x1="390" y1="210" x2="110" y2="210"
          stroke="#64748b" strokeWidth="1" markerEnd="url(#cat-arrow-slate)" />
        <text x="250" y="225" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          span (L)
        </text>

        {/* Tension arrows at anchors */}
        <line x1="110" y1="90" x2="80" y2="65"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#cat-arrow-red)" />
        <text x="60" y="60"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">T</text>

        <line x1="390" y1="90" x2="420" y2="65"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#cat-arrow-red)" />
        <text x="428" y="60"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">T</text>

        {/* Formula */}
        <text x="250" y="262" textAnchor="middle"
          className="formula-text fill-slate-600 dark:fill-slate-300">
          y = a cosh(x/a) — the natural hanging shape under uniform gravity
        </text>
      </svg>
    </div>
  );
};

export default CatenaryBridgeDiagram;
