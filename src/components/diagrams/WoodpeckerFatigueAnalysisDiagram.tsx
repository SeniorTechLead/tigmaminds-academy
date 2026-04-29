export default function WoodpeckerFatigueAnalysisDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 660 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cumulative fatigue analysis: 12000 impacts per day times 365 days times 10 years"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
          .big { font-family: system-ui, sans-serif; font-size: 22px; font-weight: 700; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Fatigue Analysis: A Lifetime of Impacts
        </text>

        {/* Calculation chain */}
        <g transform="translate(30, 50)">
          {[
            { val: '12,000', unit: 'strikes/day', color: '#ef4444' },
            { val: '365', unit: 'days/year', color: '#f59e0b' },
            { val: '10', unit: 'year lifespan', color: '#22c55e' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 155}, 0)`}>
              <rect x="0" y="0" width="130" height="55" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke={item.color} strokeWidth="1.5" />
              <text x="65" y="25" textAnchor="middle" className="val" fill={item.color}>{item.val}</text>
              <text x="65" y="42" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">{item.unit}</text>
              {i < 2 && <text x="142" y="30" textAnchor="middle" className="val fill-gray-400 dark:fill-slate-500">x</text>}
            </g>
          ))}

          {/* Equals */}
          <text x="478" y="30" textAnchor="middle" className="val fill-gray-400 dark:fill-slate-500">=</text>

          <rect x="490" y="0" width="80" height="55" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#38bdf8" strokeWidth="2" />
          <text x="530" y="22" textAnchor="middle" className="val" fill="#38bdf8" style={{ fontSize: '14px' }}>43.8M</text>
          <text x="530" y="42" textAnchor="middle" className="sm" fill="#7dd3fc">lifetime hits</text>
        </g>

        {/* S-N Curve (Fatigue curve) */}
        <g transform="translate(60, 125)">
          <text x="220" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">
            S-N Curve: Stress vs Number of Cycles to Failure
          </text>

          <line x1="0" y1="10" x2="0" y2="180" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          <line x1="0" y1="180" x2="440" y2="180" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          <text x="-40" y="95" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" transform="rotate(-90,-40,95)">
            Stress (MPa)
          </text>
          <text x="220" y="200" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">
            Number of Cycles (log scale)
          </text>

          {/* X axis labels */}
          {['1', '10', '100', '1K', '10K', '100K', '1M', '10M', '100M'].map((l, i) => (
            <g key={i}>
              <line x1={i * 52 + 10} y1="180" x2={i * 52 + 10} y2="185" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
              <text x={i * 52 + 10} y="196" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">{l}</text>
            </g>
          ))}

          {/* Steel S-N curve (no endurance limit shown as failure) */}
          <path d="M10,30 C60,35 120,80 200,120 C280,140 350,145 430,145"
            fill="none" stroke="#94a3b8" strokeWidth="2" />
          <text x="435" y="142" className="sm fill-gray-600 dark:fill-slate-300">Steel</text>

          {/* Bone S-N curve (with biological repair) */}
          <path d="M10,50 C60,55 120,90 200,130 C280,145 350,148 430,148"
            fill="none" stroke="#d97706" strokeWidth="2.5" />
          <text x="435" y="155" className="sm" fill="#fbbf24">Bone</text>

          {/* Endurance limit line */}
          <line x1="0" y1="148" x2="440" y2="148" stroke="#22c55e" strokeWidth="1" strokeDasharray="6 3" />
          <text x="440" y="168" textAnchor="end" className="sm" fill="#86efac">Endurance limit</text>

          {/* Woodpecker operating point */}
          <circle cx={7 * 52 + 10} cy="148" r="8" fill="#22c55e" opacity="0.3" stroke="#22c55e" strokeWidth="2">
            <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1={7 * 52 + 10} y1="140" x2={7 * 52 + 10} y2="100" stroke="#86efac" strokeWidth="1" strokeDasharray="3 2" />
          <text x={7 * 52 + 10} y="95" textAnchor="middle" className="val" fill="#22c55e" style={{ fontSize: '11px' }}>Woodpecker</text>
          <text x={7 * 52 + 10} y="85" textAnchor="middle" className="sm" fill="#86efac">43.8M cycles</text>

          {/* Danger zone */}
          <rect x="0" y="10" width="440" height="30" fill="#ef4444" opacity="0.05" />
          <text x="220" y="25" textAnchor="middle" className="sm" fill="#ef4444" opacity="0.5">Failure zone</text>
        </g>

        {/* Secret weapon: biological repair */}
        <g transform="translate(50, 340)">
          <rect x="0" y="0" width="500" height="50" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1" />
          <text x="250" y="18" textAnchor="middle" className="label" fill="#22c55e" fontWeight="600">
            Secret Weapon: Biological Self-Repair
          </text>
          <text x="250" y="35" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Unlike steel, bone continuously remodels: osteoclasts remove micro-damaged bone,
          </text>
          <text x="250" y="47" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            osteoblasts rebuild fresh bone. The skull essentially rebuilds itself every few months.
          </text>
        </g>
      </svg>
    </div>
  );
}
