export default function BridgeTimelineDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 722 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Timeline showing how a living root bridge grows over 30 years and strengthens over 500 years"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 9.5px; }
          .year { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
        `}</style>

        <rect width="700" height="460" rx="8" className="fill-slate-900" />

        <text x="350" y="28" textAnchor="middle" className="title fill-emerald-300">
          Growing a Bridge Takes 30 Years
        </text>
        <text x="350" y="44" textAnchor="middle" className="small fill-slate-400">
          But the bridge lasts for centuries — and gets stronger every year
        </text>

        {/* --- Timeline phases --- */}
        {/* Main timeline line */}
        <line x1="50" y1="80" x2="650" y2="80" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* Phase markers */}
        {/* Year 0 */}
        <circle cx="80" cy="80" r="6" fill="#f59e0b" />
        <text x="80" y="70" textAnchor="middle" className="year fill-amber-300">Year 0</text>

        {/* Year 5 */}
        <circle cx="200" cy="80" r="6" fill="#f59e0b" />
        <text x="200" y="70" textAnchor="middle" className="year fill-amber-300">Year 5</text>

        {/* Year 15 */}
        <circle cx="350" cy="80" r="6" fill="#22c55e" />
        <text x="350" y="70" textAnchor="middle" className="year fill-green-300">Year 15</text>

        {/* Year 30 */}
        <circle cx="500" cy="80" r="6" fill="#22c55e" />
        <text x="500" y="70" textAnchor="middle" className="year fill-green-300">Year 30</text>

        {/* Year 500+ */}
        <circle cx="630" cy="80" r="6" fill="#16a34a" />
        <text x="630" y="70" textAnchor="middle" className="year fill-green-400">500+</text>

        {/* Phase 1: Planting (Year 0-5) */}
        <rect x="55" y="95" width="170" height="95" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" opacity="0.8" />
        <text x="140" y="112" textAnchor="middle" className="label fill-amber-300" fontWeight="600">Phase 1: Guiding</text>

        {/* Simple root sketch */}
        <path d="M 80 140 Q 100 142 120 141 Q 140 140 160 142 Q 180 143 200 141"
          fill="none" stroke="#a3a38c" strokeWidth="2" strokeDasharray="4,3" />
        <rect x="80" y="136" width="120" height="8" rx="2" fill="#a08060" opacity="0.4" />
        <text x="140" y="160" textAnchor="middle" className="small fill-slate-300">Roots guided through</text>
        <text x="140" y="172" textAnchor="middle" className="small fill-slate-300">betel nut troughs</text>
        <text x="140" y="184" textAnchor="middle" className="small fill-amber-400">~1 m/year growth</text>

        {/* Phase 2: Crossing (Year 5-15) */}
        <rect x="205" y="95" width="170" height="95" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#84cc16" strokeWidth="1" opacity="0.8" />
        <text x="290" y="112" textAnchor="middle" className="label fill-lime-300" fontWeight="600">Phase 2: Crossing</text>

        {/* Roots reaching far bank */}
        <path d="M 225 140 Q 260 145 290 143 Q 320 140 355 140"
          fill="none" stroke="#7cb342" strokeWidth="2.5" />
        <path d="M 225 148 Q 265 153 290 150 Q 315 148 355 148"
          fill="none" stroke="#558b2f" strokeWidth="1.5" />
        <circle cx="355" cy="140" r="3" fill="#aed581" />
        <text x="290" y="165" textAnchor="middle" className="small fill-slate-300">Roots reach far bank</text>
        <text x="290" y="177" textAnchor="middle" className="small fill-slate-300">and anchor in soil</text>
        <text x="290" y="189" textAnchor="middle" className="small fill-lime-400">Inosculation begins</text>

        {/* Phase 3: Walkable (Year 15-30) */}
        <rect x="355" y="95" width="170" height="95" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1" opacity="0.8" />
        <text x="440" y="112" textAnchor="middle" className="label fill-green-300" fontWeight="600">Phase 3: Walkable</text>

        {/* Thicker intertwined roots */}
        <path d="M 375 135 Q 410 142 440 140 Q 470 138 505 135"
          fill="none" stroke="#16a34a" strokeWidth="4" />
        <path d="M 375 145 Q 410 150 440 148 Q 470 146 505 145"
          fill="none" stroke="#22c55e" strokeWidth="3" />
        <path d="M 375 140 Q 410 145 440 143 Q 470 142 505 140"
          fill="none" stroke="#4ade80" strokeWidth="2" />
        {/* Person icon */}
        <circle cx="440" cy="125" r="4" fill="#fbbf24" />
        <line x1="440" y1="129" x2="440" y2="135" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="440" y="165" textAnchor="middle" className="small fill-slate-300">Supports 50+ people</text>
        <text x="440" y="177" textAnchor="middle" className="small fill-slate-300">Roots fused into lattice</text>
        <text x="440" y="189" textAnchor="middle" className="small fill-green-400">Self-repairing begins</text>

        {/* Phase 4: Ancient (500+) */}
        <rect x="530" y="95" width="145" height="95" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#16a34a" strokeWidth="1" opacity="0.8" />
        <text x="602" y="112" textAnchor="middle" className="label fill-green-400" fontWeight="600">Phase 4: Ancient</text>

        {/* Dense root mass */}
        <rect x="550" y="130" width="105" height="20" rx="5" fill="#14532d" opacity="0.5" />
        {[555, 570, 585, 600, 615, 630, 645].map((x, i) => (
          <line key={i} x1={x} y1="130" x2={x} y2="150" stroke="#22c55e" strokeWidth={1.5 + (i % 2)} opacity="0.6" />
        ))}
        <text x="602" y="165" textAnchor="middle" className="small fill-slate-300">Massive, dense structure</text>
        <text x="602" y="177" textAnchor="middle" className="small fill-slate-300">Stronger than new bridge</text>
        <text x="602" y="189" textAnchor="middle" className="small fill-green-500">Ecosystem on the bridge</text>

        {/* --- BOTTOM: Strength over time graph --- */}
        <rect x="30" y="210" width="640" height="230" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />

        <text x="350" y="232" textAnchor="middle" className="label fill-amber-300" fontWeight="600">
          Strength Over Time: Root Bridge vs Steel Bridge
        </text>

        {/* Axes */}
        <line x1="90" y1="250" x2="90" y2="410" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="90" y1="410" x2="620" y2="410" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Y-axis label */}
        <text x="55" y="330" textAnchor="middle" className="small fill-slate-400" transform="rotate(-90 55 330)">Structural Strength</text>

        {/* X-axis label */}
        <text x="355" y="430" textAnchor="middle" className="small fill-slate-400">Time (years)</text>

        {/* X-axis marks */}
        {[
          [90, '0'], [195, '50'], [300, '100'], [405, '200'], [510, '500'],
        ].map(([x, label], i) => (
          <g key={i}>
            <line x1={Number(x)} y1={410} x2={Number(x)} y2={415} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <text x={Number(x)} y={425} textAnchor="middle" className="small fill-slate-500">{label}</text>
          </g>
        ))}

        {/* Steel bridge curve - rises fast, then declines */}
        <path d="M 90 390 Q 130 280 195 280 Q 260 280 300 310 Q 380 360 450 400 L 460 410"
          fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6,3" />
        <text x="195" y="270" textAnchor="middle" className="small fill-slate-300">Steel bridge</text>
        <text x="400" y="375" className="small fill-red-400">rust + fatigue</text>
        <text x="465" y="405" className="small fill-red-300">replace</text>

        {/* Root bridge curve - rises slowly, keeps rising */}
        <path d="M 90 410 Q 130 405 195 380 Q 260 355 300 340 Q 380 310 450 290 Q 530 275 610 265"
          fill="none" stroke="#22c55e" strokeWidth="2.5" />
        <text x="550" y="258" className="small fill-green-300">Root bridge</text>

        {/* Arrow showing it keeps going up */}
        <line x1="610" y1="265" x2="630" y2="258" stroke="#22c55e" strokeWidth="2" />
        <polygon points="635,256 625,254 628,263" fill="#22c55e" />
        <text x="640" y="260" className="small fill-green-400">still growing</text>

        {/* Key insight */}
        <rect x="120" y="340" width="160" height="30" rx="4" fill="#14532d" opacity="0.4" />
        <text x="200" y="354" textAnchor="middle" className="small fill-green-300">Root bridge overtakes</text>
        <text x="200" y="366" textAnchor="middle" className="small fill-green-300">steel after ~50 years</text>
      </svg>
    </div>
  );
}
