export default function WoodpeckerRotationalForceDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Straight strike means no rotation equals safe, angled strike means rotation equals dangerous"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
          @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(15deg)} }
        `}</style>

        <rect width="640" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Straight Strike vs Angled Strike
        </text>
        <text x="320" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          Rotational acceleration is far more dangerous than linear
        </text>

        {/* Divider */}
        <line x1="320" y1="55" x2="320" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

        {/* LEFT: Straight strike (safe) */}
        <text x="160" y="70" textAnchor="middle" className="val" fill="#22c55e">Straight Strike (Safe)</text>

        <g transform="translate(50, 90)">
          {/* Tree trunk */}
          <rect x="170" y="0" width="30" height="160" rx="4" fill="#92400e" opacity="0.5" stroke="#d97706" strokeWidth="1" />
          {/* Bark texture */}
          {[20, 50, 80, 110, 140].map(y => (
            <line key={y} x1="175" y1={y} x2="195" y2={y} stroke="#78350f" strokeWidth="0.5" />
          ))}

          {/* Woodpecker head - perfectly aligned */}
          <ellipse cx="110" cy="80" rx="40" ry="35" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="110" cy="65" rx="20" ry="12" fill="#dc2626" opacity="0.7" />
          <polygon points="150,78 170,76 170,84 150,82" fill="#d97706" />
          <circle cx="135" cy="75" r="4" fill="#fef9c3" />

          {/* Force vector - perfectly horizontal */}
          <line x1="50" y1="80" x2="68" y2="80" stroke="#22c55e" strokeWidth="3" markerEnd="url(#wpr-arr-g)" />
          <text x="40" y="75" textAnchor="end" className="sm" fill="#86efac">F</text>

          {/* Center of mass dot */}
          <circle cx="110" cy="80" r="3" fill="#fbbf24" />
          <text x="110" y="128" textAnchor="middle" className="sm" fill="#fbbf24">Center of mass</text>

          {/* Result */}
          <text x="110" y="148" textAnchor="middle" className="sm" fill="#86efac">Force passes through center</text>
          <text x="110" y="163" textAnchor="middle" className="sm" fill="#22c55e" fontWeight="600">Zero rotation</text>
        </g>

        {/* RIGHT: Angled strike (dangerous) */}
        <text x="480" y="70" textAnchor="middle" className="val" fill="#ef4444">Angled Strike (Dangerous)</text>

        <g transform="translate(370, 90)">
          {/* Tree trunk (angled surface) */}
          <rect x="170" y="0" width="30" height="160" rx="4" fill="#92400e" opacity="0.5" stroke="#d97706" strokeWidth="1" transform="rotate(10,185,80)" />

          {/* Woodpecker head - slightly tilted showing bad angle */}
          <g transform="rotate(-15,110,80)">
            <ellipse cx="110" cy="80" rx="40" ry="35" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="2" />
            <ellipse cx="110" cy="65" rx="20" ry="12" fill="#dc2626" opacity="0.7" />
            <polygon points="150,78 170,76 170,84 150,82" fill="#d97706" />
            <circle cx="135" cy="75" r="4" fill="#fef9c3" />
          </g>

          {/* Force vector - off-center */}
          <line x1="50" y1="65" x2="68" y2="72" stroke="#ef4444" strokeWidth="3" markerEnd="url(#wpr-arr-r)" />
          <text x="40" y="60" textAnchor="end" className="sm" fill="#fca5a5">F</text>

          {/* Center of mass dot */}
          <circle cx="110" cy="80" r="3" fill="#fbbf24" />

          {/* Rotation arrow */}
          <path d="M130,50 A30,30 0 0,1 155,75" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#wpr-arr-r)" />
          <text x="160" y="55" className="sm" fill="#fca5a5">Torque!</text>

          {/* Moment arm */}
          <line x1="110" y1="80" x2="75" y2="68" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
          <text x="80" y="60" textAnchor="middle" className="sm" fill="#fbbf24">moment arm</text>

          {/* Result */}
          <text x="110" y="148" textAnchor="middle" className="sm" fill="#fca5a5">Force misses center of mass</text>
          <text x="110" y="163" textAnchor="middle" className="sm" fill="#ef4444" fontWeight="600">Creates rotation!</text>
        </g>

        <defs>
          <marker id="wpr-arr-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#22c55e" />
          </marker>
          <marker id="wpr-arr-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Bottom explanation */}
        <g transform="translate(50, 320)">
          <rect x="0" y="0" width="540" height="90" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="270" y="20" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">
            Why Rotation Is Dangerous
          </text>
          <text x="270" y="38" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Brain tissue shears easily under rotational forces (like twisting jelly)
          </text>
          <text x="270" y="53" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Woodpeckers avoid this by striking perfectly straight every time
          </text>
          <text x="270" y="68" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            In sports: rotational hits cause worse concussions than straight impacts
          </text>
        </g>
      </svg>
    </div>
  );
}
