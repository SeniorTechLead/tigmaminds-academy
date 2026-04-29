const StormGeostrophicDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 685 458"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing geostrophic balance where PGF equals Coriolis force and wind blows parallel to isobars"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .big-label { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="geo-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="geo-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="geo-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Geostrophic Balance — Why Wind Flows Along Isobars
        </text>

        {/* Isobars (horizontal lines) */}
        <line x1="60" y1="100" x2="540" y2="100"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="555" y="104" textAnchor="start"
          className="label-text fill-red-600 dark:fill-red-400">1005 mb (Low)</text>

        <line x1="60" y1="200" x2="540" y2="200"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="555" y="204" textAnchor="start"
          className="label-text fill-slate-500 dark:fill-slate-400">1009 mb</text>

        <line x1="60" y1="300" x2="540" y2="300"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="555" y="304" textAnchor="start"
          className="label-text fill-blue-600 dark:fill-blue-400">1013 mb (High)</text>

        {/* Wind parcel in center */}
        <circle cx="300" cy="200" r="10"
          className="fill-amber-200 dark:fill-amber-800 stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />

        {/* PGF arrow — pointing upward (toward low pressure) */}
        <line x1="300" y1="185" x2="300" y2="120"
          stroke="#3b82f6" strokeWidth="3"
          markerEnd="url(#geo-blue)" />
        <rect x="308" y="135" width="50" height="20" rx="4"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.8" />
        <text x="333" y="149" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">PGF ↑</text>

        {/* Coriolis arrow — pointing downward (opposite to PGF in balance) */}
        <line x1="300" y1="215" x2="300" y2="280"
          stroke="#ef4444" strokeWidth="3"
          markerEnd="url(#geo-red)" />
        <rect x="308" y="245" width="75" height="20" rx="4"
          className="fill-red-100 dark:fill-red-900" opacity="0.8" />
        <text x="345" y="259" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">Coriolis ↓</text>

        {/* Resulting wind arrow — parallel to isobars (horizontal) */}
        <line x1="315" y1="200" x2="470" y2="200"
          stroke="#f59e0b" strokeWidth="3.5"
          markerEnd="url(#geo-amber)" />
        <rect x="370" y="175" width="90" height="20" rx="4"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="415" y="189" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">Wind →</text>

        {/* Legend box */}
        <rect x="60" y="330" width="220" height="60" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.8"
          stroke="#64748b" strokeWidth="1" />
        <line x1="75" y1="348" x2="105" y2="348" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="112" y="352" className="label-text fill-slate-700 dark:fill-slate-300">
          PGF (toward low pressure)
        </text>
        <line x1="75" y1="365" x2="105" y2="365" stroke="#ef4444" strokeWidth="2.5" />
        <text x="112" y="369" className="label-text fill-slate-700 dark:fill-slate-300">
          Coriolis (deflects right in NH)
        </text>
        <line x1="75" y1="382" x2="105" y2="382" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="112" y="386" className="label-text fill-slate-700 dark:fill-slate-300">
          Resulting wind (parallel to isobars)
        </text>

        {/* Bottom caption */}
        <rect x="70" y="393" width="460" height="22" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="408" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          When PGF = Coriolis, wind follows the isobars
        </text>
      </svg>
    </div>
  );
};

export default StormGeostrophicDiagram;
