export default function WoodpeckerSpongyBoneDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 410"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Dense-spongy-dense bone sandwich structure compared to bubble wrap"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="640" height="410" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="30" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Bone Sandwich: Dense-Spongy-Dense
        </text>

        {/* Cross-section of skull bone - magnified */}
        <g transform="translate(50, 55)">
          <text x="175" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">Magnified skull bone cross-section</text>

          {/* Outer dense layer */}
          <rect x="50" y="20" width="250" height="40" rx="4" fill="#92400e" stroke="#d97706" strokeWidth="2" />
          <text x="175" y="45" textAnchor="middle" className="label" fill="#fef3c7" fontWeight="600">Dense outer bone</text>

          {/* Spongy middle layer */}
          <rect x="50" y="60" width="250" height="80" rx="0" className="fill-gray-100 dark:fill-slate-800" stroke="#b45309" strokeWidth="2" />
          {/* Spongy structure - bubbles/pores */}
          {[
            [80,80,8], [110,90,10], [140,78,7], [170,95,9], [200,82,8],
            [230,90,7], [260,78,9], [95,105,8], [125,115,7], [155,100,10],
            [185,112,8], [215,105,9], [245,115,7], [275,100,6],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.6" />
          ))}
          <text x="175" y="130" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">Spongy bone (trabecular)</text>

          {/* Inner dense layer */}
          <rect x="50" y="140" width="250" height="40" rx="4" fill="#92400e" stroke="#d97706" strokeWidth="2" />
          <text x="175" y="165" textAnchor="middle" className="label" fill="#fef3c7" fontWeight="600">Dense inner bone</text>

          {/* Brain side */}
          <rect x="50" y="180" width="250" height="30" rx="4" fill="#22c55e" opacity="0.15" />
          <text x="175" y="200" textAnchor="middle" className="sm" fill="#86efac">Brain (protected side)</text>

          {/* Impact side */}
          <path d="M175,10 L175,20" stroke="#ef4444" strokeWidth="2" markerEnd="url(#wp-down)" />
          <text x="175" y="8" textAnchor="middle" className="sm" fill="#fca5a5">Impact</text>

          {/* Dimension arrows */}
          <line x1="38" y1="20" x2="38" y2="60" stroke="#64748b" strokeWidth="1" />
          <text x="30" y="44" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,30,44)">~1mm</text>
          <line x1="38" y1="60" x2="38" y2="140" stroke="#64748b" strokeWidth="1" />
          <text x="30" y="104" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,30,104)">~3mm</text>
          <line x1="38" y1="140" x2="38" y2="180" stroke="#64748b" strokeWidth="1" />
          <text x="30" y="164" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,30,164)">~1mm</text>
        </g>

        <defs>
          <marker id="wp-down" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L5,10 L10,0 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Bubble wrap analogy */}
        <g transform="translate(380, 55)">
          <text x="110" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">Analogy: Bubble Wrap</text>

          {/* Package layers */}
          <rect x="30" y="20" width="160" height="30" rx="4" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
          <text x="110" y="40" textAnchor="middle" className="sm fill-gray-600 dark:fill-slate-300">Hard outer box</text>

          {/* Bubble wrap */}
          <rect x="30" y="50" width="160" height="80" rx="0" className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="1.5" />
          {[
            [55,65,8], [80,70,9], [105,63,8], [130,72,7], [155,65,8],
            [65,90,9], [90,95,8], [115,88,9], [140,95,7],
            [55,112,7], [80,108,8], [105,115,7], [130,110,8], [155,112,6],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#38bdf8" opacity="0.15" stroke="#38bdf8" strokeWidth="1" />
          ))}
          <text x="110" y="125" textAnchor="middle" className="sm" fill="#7dd3fc">Bubble wrap</text>

          <rect x="30" y="130" width="160" height="30" rx="4" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
          <text x="110" y="150" textAnchor="middle" className="sm fill-gray-600 dark:fill-slate-300">Hard inner box</text>

          {/* Protected item */}
          <rect x="30" y="160" width="160" height="30" rx="4" fill="#22c55e" opacity="0.15" />
          <text x="110" y="180" textAnchor="middle" className="sm" fill="#86efac">Fragile item</text>
        </g>

        {/* Equals sign */}
        <text x="370" y="170" textAnchor="middle" className="title fill-gray-400 dark:fill-slate-500">=</text>

        {/* How it works explanation */}
        <g transform="translate(50, 300)">
          <rect x="0" y="0" width="540" height="88" rx="8" className="fill-gray-100 dark:fill-slate-800" />

          <text x="270" y="20" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">
            How the sandwich works:
          </text>
          <text x="270" y="38" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Dense outer bone spreads impact force over a wide area
          </text>
          <text x="270" y="53" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Spongy bone crushes slightly, converting kinetic energy to heat
          </text>
          <text x="270" y="68" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Dense inner bone provides a rigid barrier protecting the brain
          </text>
        </g>
      </svg>
    </div>
  );
}
