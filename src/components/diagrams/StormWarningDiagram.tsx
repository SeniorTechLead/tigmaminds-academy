const StormWarningDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 692 452"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Timeline showing cyclone early warning system from 72 hours to landfall, with cone of uncertainty narrowing"
      >
        <style>{`
          @keyframes blink-warn {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes sat-orbit {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .warn-blink { animation: blink-warn 1.5s ease-in-out infinite; }
          .sat-bob { animation: sat-orbit 3s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .time-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="sw-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400 dark:fill-slate-500" />
          </marker>
          <marker id="sw-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Cyclone Early Warning System — A Race Against Time
        </text>

        {/* Timeline bar */}
        <rect x="60" y="145" width="480" height="4" rx="2"
          className="fill-slate-300 dark:fill-slate-600" />

        {/* Timeline arrow */}
        <line x1="540" y1="147" x2="560" y2="147"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2"
          markerEnd="url(#sw-arrow)" />

        {/* ========= STAGE 1: 72 hours — Satellite Detection ========= */}
        <circle cx="100" cy="147" r="8"
          className="fill-blue-500 dark:fill-blue-400" />
        <text x="100" y="130" textAnchor="middle"
          className="time-text fill-blue-600 dark:fill-blue-300">
          72 hrs
        </text>

        {/* Satellite icon */}
        <g className="sat-bob">
          {/* Satellite body */}
          <rect x="82" y="60" width="16" height="10" rx="2"
            className="fill-gray-400 dark:fill-gray-500" />
          {/* Solar panels */}
          <rect x="68" y="62" width="14" height="6" rx="1"
            className="fill-blue-400 dark:fill-blue-500" />
          <rect x="98" y="62" width="14" height="6" rx="1"
            className="fill-blue-400 dark:fill-blue-500" />
          {/* Antenna */}
          <line x1="90" y1="70" x2="90" y2="78"
            className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
          {/* Signal waves */}
          <path d="M 84 80 Q 90 86 96 80" fill="none"
            className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" opacity="0.7" />
          <path d="M 80 85 Q 90 94 100 85" fill="none"
            className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Small cyclone detected */}
        <circle cx="100" cy="100" r="8"
          className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
        <path d="M 97 97 Q 100 100 103 97" fill="none"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />

        <text x="100" y="170" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-300" fontWeight="600">
          Satellite detects
        </text>
        <text x="100" y="182" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          storm at sea
        </text>

        {/* ========= STAGE 2: 48 hours — Weather Center ========= */}
        <circle cx="280" cy="147" r="8"
          className="fill-amber-500 dark:fill-amber-400" />
        <text x="280" y="130" textAnchor="middle"
          className="time-text fill-amber-600 dark:fill-amber-300">
          48 hrs
        </text>

        {/* Weather center building icon */}
        <rect x="260" y="60" width="40" height="30" rx="2"
          className="fill-amber-100 dark:fill-amber-900" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Satellite dish on top */}
        <path d="M 275 60 Q 280 50 285 60" fill="none"
          stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="280" cy="52" r="2" className="fill-amber-500 dark:fill-amber-400" />
        {/* Screen inside */}
        <rect x="268" y="68" width="24" height="14" rx="1"
          className="fill-green-200 dark:fill-green-800" />
        {/* Data lines on screen */}
        <line x1="271" y1="72" x2="289" y2="72"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="1" />
        <line x1="271" y1="76" x2="285" y2="76"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="1" />

        {/* Warning symbol */}
        <g className="warn-blink">
          <polygon points="280,95 274,107 286,107"
            className="fill-amber-400 dark:fill-amber-500" stroke="#f59e0b" strokeWidth="1" />
          <text x="280" y="105" textAnchor="middle"
            className="fill-amber-900 dark:fill-amber-100" style={{ fontSize: '8px', fontWeight: 700 }}>
            !
          </text>
        </g>

        <text x="280" y="170" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-300" fontWeight="600">
          Weather center
        </text>
        <text x="280" y="182" textAnchor="middle"
          className="label-text fill-amber-500 dark:fill-amber-400">
          tracks + warns
        </text>

        {/* ========= STAGE 3: 24 hours — Evacuation ========= */}
        <circle cx="420" cy="147" r="8"
          className="fill-orange-500 dark:fill-orange-400" />
        <text x="420" y="130" textAnchor="middle"
          className="time-text fill-orange-600 dark:fill-orange-300">
          24 hrs
        </text>

        {/* People evacuating to shelter */}
        {/* Shelter building */}
        <rect x="420" y="60" width="35" height="25" rx="2"
          className="fill-green-200 dark:fill-green-800" stroke="#16a34a" strokeWidth="1.5" />
        <path d="M 416 60 L 437 45 L 459 60" fill="none"
          stroke="#16a34a" strokeWidth="2" />
        {/* Door */}
        <rect x="432" y="72" width="10" height="13" rx="1"
          className="fill-green-600 dark:fill-green-500" />

        {/* Stick figures moving toward shelter */}
        {[400, 410].map((x, i) => (
          <g key={`person-${i}`}>
            <circle cx={x} cy={70 + i * 2} r="3"
              className="fill-slate-500 dark:fill-slate-400" />
            <line x1={x} y1={73 + i * 2} x2={x} y2={82 + i * 2}
              className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
            <line x1={x - 4} y1={77 + i * 2} x2={x + 4} y2={77 + i * 2}
              className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1" />
            {/* Arrow toward shelter */}
            <line x1={x + 5} y1={76 + i * 2} x2={x + 12} y2={76 + i * 2}
              className="stroke-green-500 dark:stroke-green-400" strokeWidth="1"
              markerEnd="url(#sw-arrow)" />
          </g>
        ))}

        <text x="420" y="170" textAnchor="middle"
          className="label-text fill-orange-600 dark:fill-orange-300" fontWeight="600">
          Evacuation
        </text>
        <text x="420" y="182" textAnchor="middle"
          className="label-text fill-orange-500 dark:fill-orange-400">
          to shelters
        </text>

        {/* ========= STAGE 4: Landfall ========= */}
        <circle cx="540" cy="147" r="8"
          className="fill-red-500 dark:fill-red-400" />
        <text x="540" y="130" textAnchor="middle"
          className="time-text fill-red-600 dark:fill-red-300">
          0 hrs
        </text>

        {/* Cyclone hitting land */}
        <circle cx="540" cy="85" r="18"
          className="fill-gray-400 dark:fill-gray-600" opacity="0.6" />
        <circle cx="540" cy="85" r="10"
          className="fill-gray-500 dark:fill-gray-500" opacity="0.5" />
        <circle cx="540" cy="85" r="4"
          className="fill-sky-100 dark:fill-sky-900" />
        {/* Rain */}
        {[530, 540, 550].map((x, i) => (
          <line key={`lf-rain-${i}`} x1={x} y1={105} x2={x - 1} y2={112}
            stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        ))}

        <text x="540" y="170" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="700">
          Landfall
        </text>

        {/* ======== CONE OF UNCERTAINTY — below timeline ======== */}
        <text x="300" y="215" textAnchor="middle"
          className="title-text fill-slate-600 dark:fill-slate-300">
          Cone of Uncertainty
        </text>
        <text x="300" y="230" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          (predicted path narrows as storm approaches)
        </text>

        {/* Cone shape — wide on left (72hrs), narrow on right (landfall) */}
        <path d="M 100 300 L 540 280 L 540 320 L 100 360 Z"
          className="fill-amber-200 dark:fill-amber-900" opacity="0.4"
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Actual path line through cone */}
        <path d="M 100 330 Q 200 320 300 305 Q 400 295 540 300"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5"
          markerEnd="url(#sw-arrow-red)" />
        <text x="320" y="345" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400" fontWeight="600">
          Actual storm path
        </text>

        {/* Width labels */}
        {/* At 72 hours — wide */}
        <line x1="90" y1="300" x2="90" y2="360"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        <text x="78" y="335" textAnchor="end"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '9px' }}>
          Wide
        </text>

        {/* At landfall — narrow */}
        <line x1="550" y1="280" x2="550" y2="320"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        <text x="562" y="305" textAnchor="start"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '9px' }}>
          Narrow
        </text>

        {/* Bottom caption */}
        <rect x="55" y="385" width="490" height="24" rx="6"
          className="fill-green-50 dark:fill-green-950" opacity="0.8" />
        <text x="300" y="402" textAnchor="middle"
          className="caption-text fill-green-700 dark:fill-green-300" fontWeight="700">
          Early warning saves lives — 72 hours of advance notice reduces deaths by 90%
        </text>
      </svg>
    </div>
  );
};

export default StormWarningDiagram;
