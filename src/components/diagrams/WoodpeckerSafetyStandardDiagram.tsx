export default function WoodpeckerSafetyStandardDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="CPSC helmet testing: anvil drop test, acceleration threshold, and pass-fail criteria"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
        `}</style>

        <rect width="640" height="460" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          CPSC Helmet Safety Standard Testing
        </text>

        {/* Drop test apparatus */}
        <g transform="translate(30, 50)">
          <text x="100" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">Drop Test Setup</text>

          {/* Guide rail */}
          <rect x="95" y="10" width="10" height="220" rx="2" fill="#334155" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

          {/* Height markers */}
          {[1.0, 1.5, 2.0].map((h, i) => (
            <g key={i}>
              <line x1="80" y1={220 - i * 70} x2="95" y2={220 - i * 70} stroke="#64748b" strokeWidth="1" />
              <text x="75" y={224 - i * 70} textAnchor="end" className="sm fill-gray-400 dark:fill-slate-500">{h}m</text>
            </g>
          ))}

          {/* Helmet + headform on carriage */}
          <g transform="translate(60, 30)">
            {/* Carriage */}
            <rect x="20" y="0" width="40" height="10" rx="2" fill="#475569" />
            {/* Headform */}
            <ellipse cx="40" cy="35" rx="25" ry="22" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
            {/* Helmet on headform */}
            <path d="M12,35 Q40,0 68,35" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <path d="M18,33 Q40,5 62,33" fill="none" stroke="#818cf8" strokeWidth="6" opacity="0.3" />
            {/* Accelerometer */}
            <rect x="32" y="28" width="16" height="10" rx="2" fill="#22c55e" stroke="#86efac" strokeWidth="0.8" />
            <text x="40" y="36" textAnchor="middle" className="sm fill-white dark:fill-slate-950" style={{ fontSize: '6px' }}>ACC</text>
          </g>

          {/* Drop arrow */}
          <line x1="100" y1="85" x2="100" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />
          <polygon points="95,180 100,195 105,180" fill="#ef4444" />

          {/* Anvil types */}
          <g transform="translate(30, 225)">
            {/* Flat anvil */}
            <rect x="0" y="0" width="60" height="20" rx="2" className="fill-gray-400 dark:fill-slate-500" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="30" y="38" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Flat anvil</text>

            {/* Curbstone anvil */}
            <g transform="translate(80, 0)">
              <polygon points="0,20 20,0 40,0 60,20" className="fill-gray-400 dark:fill-slate-500" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="30" y="38" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Curbstone</text>
            </g>
          </g>
        </g>

        {/* Pass/Fail criteria */}
        <g transform="translate(260, 50)">
          <rect x="0" y="0" width="350" height="160" rx="8" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="175" y="22" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">
            CPSC 1203 Pass/Fail Criteria
          </text>

          {[
            { test: 'Impact attenuation', req: 'Peak g < 300g', pass: true },
            { test: 'Drop height', req: '2.0m (flat), 1.2m (curb)', pass: true },
            { test: 'Positional stability', req: 'Helmet stays on head', pass: true },
            { test: 'Retention strength', req: 'Strap holds under 300N', pass: true },
            { test: 'Duration threshold', req: '<4ms above 200g', pass: true },
          ].map((c, i) => (
            <g key={i} transform={`translate(15, ${35 + i * 24})`}>
              <rect x="0" y="0" width="10" height="10" rx="2" fill={c.pass ? '#22c55e' : '#ef4444'} opacity="0.3" stroke={c.pass ? '#22c55e' : '#ef4444'} strokeWidth="1" />
              <text x="7" y="8" textAnchor="middle" className="sm" fill={c.pass ? '#22c55e' : '#ef4444'} style={{ fontSize: '8px' }}>
                {c.pass ? '✓' : '✗'}
              </text>
              <text x="18" y="9" className="sm fill-gray-900 dark:fill-slate-50">{c.test}:</text>
              <text x="320" y="9" textAnchor="end" className="sm fill-gray-500 dark:fill-slate-400">{c.req}</text>
            </g>
          ))}
        </g>

        {/* Acceleration vs time graph */}
        <g transform="translate(260, 225)">
          <rect x="0" y="0" width="350" height="140" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="175" y="20" textAnchor="middle" className="label fill-gray-900 dark:fill-slate-50" fontWeight="600">
            Impact Test Result
          </text>

          <g transform="translate(35, 30)">
            <line x1="0" y1="0" x2="0" y2="90" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <line x1="0" y1="90" x2="280" y2="90" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

            <text x="-10" y="50" textAnchor="end" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,-10,50)">g-force</text>
            <text x="140" y="106" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Time (ms)</text>

            {/* 300g threshold line */}
            <line x1="0" y1="15" x2="280" y2="15" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
            <text x="285" y="19" className="sm" fill="#ef4444">300g limit</text>

            {/* 200g threshold */}
            <line x1="0" y1="40" x2="280" y2="40" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <text x="285" y="44" className="sm" fill="#f59e0b">200g</text>

            {/* Pass curve (below 300g) */}
            <path d="M20,90 C40,85 60,65 80,25 C90,22 100,25 110,45 C130,75 150,87 200,90"
              fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="2" />
            <text x="100" y="12" textAnchor="middle" className="val" fill="#22c55e" style={{ fontSize: '11px' }}>Peak: 250g PASS</text>

            {/* Fail curve (above 300g) - dashed */}
            <path d="M20,90 C35,85 50,55 65,8 C72,5 80,8 88,35 C100,65 120,87 160,90"
              fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
            <text x="70" y="5" className="sm" fill="#ef4444" opacity="0.7">350g FAIL</text>
          </g>
        </g>

        {/* Woodpecker comparison */}
        <g transform="translate(30, 385)">
          <rect x="0" y="0" width="580" height="58" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1" />
          <text x="290" y="18" textAnchor="middle" className="label" fill="#22c55e" fontWeight="600">
            Woodpecker Comparison
          </text>
          <text x="290" y="34" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            CPSC requires helmets to stay under 300g. Woodpeckers survive 1200g — 4x the safety standard —
          </text>
          <text x="290" y="49" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            proving that biology's multi-layer design far exceeds current engineering standards.
          </text>
        </g>
      </svg>
    </div>
  );
}
