export default function WoodpeckerBrainFitDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tight brain fit in woodpecker vs loose brain in human skull — why sloshing causes concussion"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes slosh { 0%,100%{transform:translate(0,0)} 30%{transform:translate(8px,0)} 70%{transform:translate(-8px,0)} }
          .slosh { animation: slosh 1.5s ease-in-out infinite; }
        `}</style>

        <rect width="640" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="30" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Brain Fit: Why Sloshing = Concussion
        </text>

        {/* VS divider */}
        <line x1="320" y1="50" x2="320" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
        <text x="320" y="65" textAnchor="middle" className="label fill-gray-400 dark:fill-slate-500" fontWeight="600">VS</text>

        {/* HUMAN SKULL - left side */}
        <text x="160" y="65" textAnchor="middle" className="label" fill="#f87171" fontWeight="600">Human Brain</text>

        <g transform="translate(65, 80)">
          {/* Skull */}
          <ellipse cx="95" cy="100" rx="80" ry="90" className="fill-gray-100 dark:fill-slate-800" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Cerebrospinal fluid (gap) */}
          <ellipse cx="95" cy="100" rx="70" ry="80" fill="#38bdf8" opacity="0.1" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />

          {/* Brain (with slosh animation) */}
          <g className="slosh">
            <ellipse cx="95" cy="100" rx="55" ry="65" fill="#f87171" opacity="0.2" stroke="#f87171" strokeWidth="2" />
            {/* Brain folds */}
            <path d="M60,80 Q95,65 130,80" fill="none" stroke="#f87171" strokeWidth="1" opacity="0.5" />
            <path d="M60,100 Q95,88 130,100" fill="none" stroke="#f87171" strokeWidth="1" opacity="0.5" />
            <path d="M65,120 Q95,110 125,120" fill="none" stroke="#f87171" strokeWidth="1" opacity="0.5" />
          </g>

          {/* Gap indicator */}
          <line x1="165" y1="55" x2="165" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <line x1="160" y1="55" x2="170" y2="55" stroke="#38bdf8" strokeWidth="1" />
          <line x1="160" y1="80" x2="170" y2="80" stroke="#38bdf8" strokeWidth="1" />

          {/* Impact arrow */}
          <path d="M185,100 L173,100" stroke="#ef4444" strokeWidth="2" markerEnd="url(#wpbf-arr)" />
        </g>

        <text x="240" y="240" textAnchor="end" className="sm" fill="#7dd3fc">Fluid gap</text>
        <text x="240" y="253" textAnchor="end" className="sm" fill="#7dd3fc">(~3mm)</text>

        {/* Human labels */}
        <g transform="translate(50, 290)">
          <rect x="0" y="0" width="220" height="75" rx="6" className="fill-gray-100 dark:fill-slate-800" />
          <text x="110" y="18" textAnchor="middle" className="sm" fill="#f87171" fontWeight="600">Problem: Brain floats in fluid</text>
          <text x="110" y="33" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">On impact, skull stops but</text>
          <text x="110" y="46" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">brain keeps moving and SLAMS</text>
          <text x="110" y="59" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">into the inner skull wall</text>
        </g>

        {/* WOODPECKER SKULL - right side */}
        <text x="480" y="65" textAnchor="middle" className="label" fill="#86efac" fontWeight="600">Woodpecker Brain</text>

        <g transform="translate(385, 80)">
          {/* Skull */}
          <ellipse cx="95" cy="100" rx="70" ry="80" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="2.5" />

          {/* Brain (tight fit - no gap, no animation) */}
          <ellipse cx="95" cy="100" rx="62" ry="72" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2" />
          {/* Brain folds */}
          <path d="M53,85 Q95,72 137,85" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
          <path d="M53,100 Q95,90 137,100" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
          <path d="M57,115 Q95,107 133,115" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />

          {/* Red crest */}
          <path d="M45,25 Q95,5 145,25 Q120,40 65,40 Z" fill="#dc2626" opacity="0.7" />

          {/* Beak */}
          <polygon points="160,95 200,93 200,107 160,105" fill="#d97706" />

          {/* Tight fit indicators */}
          <line x1="157" y1="60" x2="157" y2="72" stroke="#22c55e" strokeWidth="1" />
          <line x1="153" y1="60" x2="161" y2="60" stroke="#22c55e" strokeWidth="1" />
          <line x1="153" y1="72" x2="161" y2="72" stroke="#22c55e" strokeWidth="1" />

          {/* Impact arrow */}
          <path d="M215,100 L205,100" stroke="#ef4444" strokeWidth="2" markerEnd="url(#wpbf-arr)" />
        </g>

        <text x="550" y="240" textAnchor="start" className="sm" fill="#86efac">Tiny gap</text>
        <text x="550" y="253" textAnchor="start" className="sm" fill="#86efac">(&lt;0.5mm)</text>

        <defs>
          <marker id="wpbf-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Woodpecker labels */}
        <g transform="translate(370, 290)">
          <rect x="0" y="0" width="220" height="75" rx="6" className="fill-gray-100 dark:fill-slate-800" />
          <text x="110" y="18" textAnchor="middle" className="sm" fill="#86efac" fontWeight="600">Solution: Brain fills skull tightly</text>
          <text x="110" y="33" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Almost no cerebrospinal fluid</text>
          <text x="110" y="46" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Brain and skull move as one unit</text>
          <text x="110" y="59" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">No sloshing = no concussion</text>
        </g>

        <text x="320" y="410" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
          A snug fit prevents the brain from accelerating independently of the skull
        </text>
      </svg>
    </div>
  );
}
