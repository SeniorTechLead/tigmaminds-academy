export default function WoodpeckerCrashTestDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Drop test comparing egg in multi-layer padding vs single-layer padding"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          @keyframes drop { 0%{transform:translateY(0)} 80%{transform:translateY(100px)} 100%{transform:translateY(95px)} }
        `}</style>

        <rect width="640" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Egg Drop Challenge: Multi-Layer vs Single-Layer
        </text>

        <line x1="320" y1="45" x2="320" y2="360" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

        {/* LEFT: Single layer (fails) */}
        <text x="155" y="60" textAnchor="middle" className="val" fill="#ef4444">Single Layer</text>

        <g transform="translate(40, 75)">
          {/* Drop height indicator */}
          <line x1="20" y1="0" x2="20" y2="170" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
          <text x="15" y="85" textAnchor="end" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,15,85)">1 meter drop</text>

          {/* Package */}
          <g transform="translate(50, 0)">
            {/* Outer box */}
            <rect x="0" y="0" width="120" height="80" rx="4" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
            {/* Single foam layer */}
            <rect x="5" y="5" width="110" height="70" rx="2" fill="#818cf8" opacity="0.2" stroke="#818cf8" strokeWidth="1" />
            <text x="60" y="30" textAnchor="middle" className="sm" fill="#818cf8">Single foam</text>
            {/* Egg */}
            <ellipse cx="60" cy="50" rx="18" ry="22" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="60" y="55" textAnchor="middle" className="sm" fill="#92400e">Egg</text>
          </g>

          {/* Arrow down */}
          <line x1="110" y1="85" x2="110" y2="140" stroke="#ef4444" strokeWidth="2" markerEnd="url(#wpct-arr)" />

          {/* Ground */}
          <line x1="40" y1="170" x2="180" y2="170" stroke="#64748b" strokeWidth="2" />
          {[0,1,2,3,4,5,6].map(i => (
            <line key={i} x1={45 + i * 20} y1="170" x2={40 + i * 20} y2="178" stroke="#64748b" strokeWidth="1" />
          ))}

          {/* Result: cracked egg */}
          <g transform="translate(50, 170)">
            <ellipse cx="60" cy="15" rx="25" ry="10" fill="#fef3c7" opacity="0.5" />
            {/* Crack lines */}
            <path d="M50,10 L55,5 L60,12 L65,3 L70,10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            {/* Splat */}
            <ellipse cx="60" cy="18" rx="35" ry="8" fill="#fbbf24" opacity="0.2" />
          </g>
          <text x="110" y="210" textAnchor="middle" className="val" fill="#ef4444">CRACK!</text>
          <text x="110" y="228" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Single material can't</text>
          <text x="110" y="241" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">absorb enough energy</text>
        </g>

        {/* RIGHT: Multi-layer (survives) */}
        <text x="485" y="60" textAnchor="middle" className="val" fill="#22c55e">Multi-Layer (Bio-Inspired)</text>

        <g transform="translate(350, 75)">
          {/* Package */}
          <g transform="translate(30, 0)">
            {/* Hard outer shell */}
            <rect x="0" y="0" width="120" height="100" rx="4" fill="#475569" stroke="#38bdf8" strokeWidth="2" />
            <text x="60" y="12" textAnchor="middle" className="sm" fill="#7dd3fc">Hard shell</text>

            {/* Spongy middle */}
            <rect x="8" y="16" width="104" height="68" rx="2" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1" />
            {/* Bubbles */}
            {[[25,35,6],[45,30,5],[65,38,7],[85,32,5],[35,55,6],[55,52,5],[75,58,6],[95,50,5]].map(([cx,cy,r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth="0.8" opacity="0.5" />
            ))}
            <text x="60" y="48" textAnchor="middle" className="sm" fill="#86efac">Crushable foam</text>

            {/* Tight inner liner */}
            <rect x="20" y="30" width="80" height="42" rx="4" fill="#a78bfa" opacity="0.15" stroke="#a78bfa" strokeWidth="1" />

            {/* Egg */}
            <ellipse cx="60" cy="51" rx="18" ry="22" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="60" y="56" textAnchor="middle" className="sm" fill="#92400e">Egg</text>
            <text x="60" y="78" textAnchor="middle" className="sm" fill="#c4b5fd">Tight fit</text>
          </g>

          {/* Arrow down */}
          <line x1="90" y1="105" x2="90" y2="140" stroke="#22c55e" strokeWidth="2" markerEnd="url(#wpct-arr-g)" />

          {/* Ground */}
          <line x1="20" y1="170" x2="160" y2="170" stroke="#64748b" strokeWidth="2" />
          {[0,1,2,3,4,5,6].map(i => (
            <line key={i} x1={25 + i * 20} y1="170" x2={20 + i * 20} y2="178" stroke="#64748b" strokeWidth="1" />
          ))}

          {/* Result: intact egg */}
          <g transform="translate(30, 160)">
            <rect x="0" y="0" width="120" height="30" rx="4" fill="#475569" opacity="0.3" />
            <ellipse cx="60" cy="10" rx="18" ry="15" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="60" y="14" textAnchor="middle" className="sm" fill="#92400e">Intact!</text>
          </g>
          <text x="90" y="210" textAnchor="middle" className="val" fill="#22c55e">SAFE!</text>
          <text x="90" y="228" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Each layer absorbs</text>
          <text x="90" y="241" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">a portion of energy</text>
        </g>

        <defs>
          <marker id="wpct-arr" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L5,10 L10,0 z" fill="#ef4444" />
          </marker>
          <marker id="wpct-arr-g" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L5,10 L10,0 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Scoring table */}
        <g transform="translate(40, 340)">
          <rect x="0" y="0" width="560" height="75" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="280" y="18" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">Design Principles Checklist</text>

          {[
            { p: 'Hard outer shell', s: true, m: true },
            { p: 'Crushable absorber', s: false, m: true },
            { p: 'Tight fit (no slosh)', s: false, m: true },
            { p: 'Multiple layers', s: false, m: true },
          ].map((row, i) => (
            <g key={i} transform={`translate(${i * 138 + 5}, 28)`}>
              <text x="65" y="12" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">{row.p}</text>
              <text x="35" y="32" textAnchor="middle" className="sm" fill={row.s ? '#22c55e' : '#ef4444'}>
                Single: {row.s ? 'Yes' : 'No'}
              </text>
              <text x="100" y="32" textAnchor="middle" className="sm" fill="#22c55e">
                Multi: Yes
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
