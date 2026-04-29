export default function WoodpeckerEnergyAbsorptionDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 450"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Energy budget showing kinetic energy converting to elastic, heat, and sound through each skull layer"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <rect width="630" height="450" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="315" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Energy Budget: Where Does the Impact Energy Go?
        </text>

        {/* Sankey-style flow diagram */}
        <g transform="translate(30, 55)">
          {/* Input energy block */}
          <rect x="0" y="40" width="80" height="120" rx="6" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="2" />
          <text x="40" y="80" textAnchor="middle" className="val" fill="#ef4444">100%</text>
          <text x="40" y="97" textAnchor="middle" className="sm" fill="#fca5a5">Kinetic</text>
          <text x="40" y="110" textAnchor="middle" className="sm" fill="#fca5a5">Energy</text>
          <text x="40" y="126" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">0.049 mJ</text>

          {/* Flow arrow to beak */}
          <path d="M80,100 L120,100" fill="none" stroke="#ef4444" strokeWidth="8" opacity="0.4" />
        </g>

        {/* Layer 1: Beak */}
        <g transform="translate(150, 55)">
          <rect x="0" y="30" width="95" height="60" rx="6" fill="#d97706" opacity="0.2" stroke="#d97706" strokeWidth="1.5" />
          <text x="48" y="55" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">Beak</text>
          <text x="48" y="70" textAnchor="middle" className="sm" fill="#d97706">Elastic deformation</text>
          <text x="48" y="85" textAnchor="middle" className="val" fill="#fbbf24">~15%</text>

          {/* Branch: elastic energy */}
          <path d="M48,90 L48,125" fill="none" stroke="#fbbf24" strokeWidth="2" />
          <rect x="10" y="125" width="76" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#fbbf24" strokeWidth="1" />
          <text x="48" y="143" textAnchor="middle" className="sm" fill="#fbbf24">Elastic</text>
        </g>

        {/* Arrow */}
        <path d="M245,85 L275,85" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.3" />
        <text x="260" y="78" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">85%</text>

        {/* Layer 2: Spongy Bone */}
        <g transform="translate(275, 55)">
          <rect x="0" y="20" width="100" height="70" rx="6" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="1.5" />
          <text x="50" y="42" textAnchor="middle" className="label" fill="#86efac" fontWeight="600">Spongy Bone</text>
          <text x="50" y="58" textAnchor="middle" className="sm" fill="#22c55e">Crushes + rebounds</text>
          <text x="50" y="82" textAnchor="middle" className="val" fill="#22c55e">~55%</text>

          {/* Branch: heat */}
          <path d="M25,90 L25,125" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <rect x="-5" y="125" width="60" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" />
          <text x="25" y="143" textAnchor="middle" className="sm" fill="#f59e0b">Heat</text>

          {/* Branch: elastic rebound */}
          <path d="M75,90 L75,125" fill="none" stroke="#22c55e" strokeWidth="2" />
          <rect x="45" y="125" width="60" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1" />
          <text x="75" y="143" textAnchor="middle" className="sm" fill="#22c55e">Elastic</text>
        </g>

        {/* Arrow */}
        <path d="M375,85 L405,85" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.2" />
        <text x="390" y="78" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">30%</text>

        {/* Layer 3: Hyoid */}
        <g transform="translate(405, 55)">
          <rect x="0" y="30" width="85" height="60" rx="6" fill="#dc2626" opacity="0.2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="42" y="52" textAnchor="middle" className="label" fill="#fca5a5" fontWeight="600">Hyoid</text>
          <text x="42" y="68" textAnchor="middle" className="sm" fill="#dc2626">Distributes strain</text>
          <text x="42" y="85" textAnchor="middle" className="val" fill="#dc2626">~20%</text>

          {/* Branch: elastic strain */}
          <path d="M42,90 L42,125" fill="none" stroke="#dc2626" strokeWidth="2" />
          <rect x="7" y="125" width="70" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#dc2626" strokeWidth="1" />
          <text x="42" y="143" textAnchor="middle" className="sm" fill="#fca5a5">Strain</text>
        </g>

        {/* Arrow to brain */}
        <path d="M490,85 L520,85" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.15" />
        <text x="505" y="78" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">10%</text>

        {/* Brain */}
        <g transform="translate(520, 55)">
          <rect x="0" y="35" width="75" height="50" rx="6" fill="#38bdf8" opacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="38" y="57" textAnchor="middle" className="label" fill="#7dd3fc" fontWeight="600">Brain</text>
          <text x="38" y="74" textAnchor="middle" className="val" fill="#38bdf8">~10%</text>
          <text x="38" y="84" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">safe</text>
        </g>

        {/* Sound energy (small) */}
        <g transform="translate(180, 225)">
          <rect x="0" y="0" width="280" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#a78bfa" strokeWidth="1" />
          <text x="140" y="18" textAnchor="middle" className="sm" fill="#c4b5fd">
            Sound energy: ~5% (the drumming sound you hear!)
          </text>
        </g>

        {/* Pie chart summary */}
        <g transform="translate(130, 275)">
          <text x="185" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">Energy Distribution Summary</text>

          {/* Simplified stacked bar */}
          <rect x="0" y="18" width="56" height="30" rx="4" fill="#fbbf24" opacity="0.6" />
          <rect x="56" y="18" width="203" height="30" rx="0" fill="#22c55e" opacity="0.6" />
          <rect x="259" y="18" width="74" height="30" rx="0" fill="#dc2626" opacity="0.6" />
          <rect x="333" y="18" width="37" height="30" rx="4" fill="#38bdf8" opacity="0.6" />

          <text x="28" y="38" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">15%</text>
          <text x="157" y="38" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">55%</text>
          <text x="296" y="38" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">20%</text>
          <text x="351" y="38" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">10%</text>

          {/* Legend */}
          {[
            { label: 'Beak', color: '#fbbf24', x: 20 },
            { label: 'Spongy bone', color: '#22c55e', x: 110 },
            { label: 'Hyoid', color: '#dc2626', x: 220 },
            { label: 'Reaches brain', color: '#38bdf8', x: 300 },
          ].map((l, i) => (
            <g key={i}>
              <rect x={l.x} y="58" width="10" height="10" rx="2" fill={l.color} opacity="0.6" />
              <text x={l.x + 15} y="67" className="sm fill-gray-500 dark:fill-slate-400">{l.label}</text>
            </g>
          ))}
        </g>

        <text x="315" y="430" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
          90% of impact energy is absorbed before reaching the brain
        </text>
      </svg>
    </div>
  );
}
