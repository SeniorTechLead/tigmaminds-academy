const TidesDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 550 292"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tides diagram showing Earth-Moon system with two tidal bulges caused by gravitational pull"
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
          <marker id="tide-arrow-gray" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
          <radialGradient id="tide-earth-grad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>
          <radialGradient id="moon-grad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="520" height="250" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Tides — Earth-Moon Gravitational Interaction
        </text>

        {/* Earth */}
        <circle cx="200" cy="125" r="50" fill="url(#tide-earth-grad)" />
        {/* Continent hints */}
        <ellipse cx="188" cy="115" rx="10" ry="16" fill="#22c55e" opacity="0.5" />
        <ellipse cx="210" cy="130" rx="7" ry="9" fill="#22c55e" opacity="0.5" />

        <text x="200" y="129" textAnchor="middle"
          className="label-text fill-white" fontWeight="600" style={{ fontSize: '10px' }}>
          Earth
        </text>

        {/* Tidal bulge — near side (toward Moon) */}
        <ellipse cx="265" cy="125" rx="22" ry="35"
          fill="#3b82f6" opacity="0.25"
          className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Tidal bulge — far side (away from Moon) */}
        <ellipse cx="135" cy="125" rx="22" ry="35"
          fill="#3b82f6" opacity="0.25"
          className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* High tide labels */}
        <text x="265" y="78" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600" style={{ fontSize: '10px' }}>
          High Tide
        </text>
        <text x="265" y="89" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          (near side)
        </text>

        <text x="135" y="78" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600" style={{ fontSize: '10px' }}>
          High Tide
        </text>
        <text x="135" y="89" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400" style={{ fontSize: '10px' }}>
          (far side)
        </text>

        {/* Low tide indicators (top and bottom) */}
        <text x="200" y="67" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Low Tide
        </text>
        <text x="200" y="193" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Low Tide
        </text>

        {/* Moon */}
        <circle cx="420" cy="125" r="28" fill="url(#moon-grad)" />
        {/* Crater hints */}
        <circle cx="412" cy="118" r="4" fill="#9ca3af" opacity="0.6" />
        <circle cx="425" cy="130" r="3" fill="#9ca3af" opacity="0.6" />
        <circle cx="416" cy="136" r="2.5" fill="#9ca3af" opacity="0.6" />

        <text x="420" y="129" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200" fontWeight="600" style={{ fontSize: '10px' }}>
          Moon
        </text>

        {/* Gravitational pull arrows (Moon pulling Earth) */}
        <line x1="290" y1="115" x2="340" y2="115"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" markerEnd="url(#tide-arrow-gray)" />
        <line x1="290" y1="125" x2="355" y2="125"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2.5" markerEnd="url(#tide-arrow-gray)" />
        <line x1="290" y1="135" x2="340" y2="135"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" markerEnd="url(#tide-arrow-gray)" />

        {/* Pull label */}
        <text x="325" y="108" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Gravitational
        </text>
        <text x="325" y="150" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          pull
        </text>

        {/* Distance label */}
        <line x1="200" y1="200" x2="420" y2="200"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="200" y1="196" x2="200" y2="204"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="420" y1="196" x2="420" y2="204"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Explanation */}
        <text x="260" y="228" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Moon's gravity stretches Earth's oceans into two bulges:
        </text>
        <text x="260" y="242" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          one toward the Moon and one on the opposite side
        </text>
      </svg>
    </div>
  );
};

export default TidesDiagram;
