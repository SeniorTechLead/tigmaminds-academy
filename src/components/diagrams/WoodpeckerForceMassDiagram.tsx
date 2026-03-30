export default function WoodpeckerForceMassDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="F equals ma: woodpecker 2g brain at 1200g equals only 23N vs human 1400g brain at 100g equals 1372N"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 20px; font-weight: 700; }
          .eq { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 600; }
        `}</style>

        <rect width="640" height="440" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          F = m x a : Why Size Matters
        </text>

        {/* Formula box */}
        <rect x="180" y="40" width="280" height="32" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="320" y="62" textAnchor="middle" className="eq" fill="#fbbf24">
          Force = mass x acceleration
        </text>

        {/* Woodpecker calculation - left */}
        <g transform="translate(20, 95)">
          <rect x="0" y="0" width="290" height="275" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1.5" />

          {/* Woodpecker icon */}
          <ellipse cx="145" cy="30" rx="15" ry="12" fill="#16a34a" />
          <ellipse cx="145" cy="20" rx="8" ry="6" fill="#dc2626" />
          <polygon points="160,28 175,27 160,31" fill="#d97706" />
          <circle cx="153" cy="25" r="2" fill="#fef9c3" />

          <text x="145" y="60" textAnchor="middle" className="label" fill="#86efac" fontWeight="600">Woodpecker</text>

          <line x1="20" y1="72" x2="270" y2="72" stroke="#334155" strokeWidth="1" />

          <text x="30" y="97" className="label fill-gray-500 dark:fill-slate-400">Brain mass:</text>
          <text x="260" y="97" textAnchor="end" className="label" fill="#86efac" fontWeight="600">2 grams (0.002 kg)</text>

          <text x="30" y="120" className="label fill-gray-500 dark:fill-slate-400">Deceleration:</text>
          <text x="260" y="120" textAnchor="end" className="label" fill="#86efac" fontWeight="600">1200g (11,760 m/s2)</text>

          <line x1="20" y1="134" x2="270" y2="134" stroke="#334155" strokeWidth="1" />

          <text x="145" y="160" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">F = 0.002 kg x 11,760 m/s2</text>

          <text x="145" y="195" textAnchor="middle" className="val" fill="#22c55e">F = 23.5 N</text>
          <text x="145" y="218" textAnchor="middle" className="sm" fill="#86efac">(about 2.4 kg of force)</text>

          {/* Visual: small force bar */}
          <rect x="40" y="235" width={23.5 / 1372 * 200} height="16" rx="4" fill="#22c55e" opacity="0.7" />
          <text x="40" y="267" className="sm fill-gray-400 dark:fill-slate-500">Force scale (relative)</text>
        </g>

        {/* Human calculation - right */}
        <g transform="translate(330, 95)">
          <rect x="0" y="0" width="290" height="275" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#f87171" strokeWidth="1.5" />

          {/* Human head icon */}
          <circle cx="145" cy="27" r="16" fill="#475569" />
          <circle cx="150" cy="23" r="2" className="fill-gray-500 dark:fill-slate-400" />

          <text x="145" y="60" textAnchor="middle" className="label" fill="#fca5a5" fontWeight="600">Human</text>

          <line x1="20" y1="72" x2="270" y2="72" stroke="#334155" strokeWidth="1" />

          <text x="30" y="97" className="label fill-gray-500 dark:fill-slate-400">Brain mass:</text>
          <text x="260" y="97" textAnchor="end" className="label" fill="#fca5a5" fontWeight="600">1400 grams (1.4 kg)</text>

          <text x="30" y="120" className="label fill-gray-500 dark:fill-slate-400">Deceleration:</text>
          <text x="260" y="120" textAnchor="end" className="label" fill="#fca5a5" fontWeight="600">100g (980 m/s2)</text>

          <line x1="20" y1="134" x2="270" y2="134" stroke="#334155" strokeWidth="1" />

          <text x="145" y="160" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">F = 1.4 kg x 980 m/s2</text>

          <text x="145" y="195" textAnchor="middle" className="val" fill="#ef4444">F = 1,372 N</text>
          <text x="145" y="218" textAnchor="middle" className="sm" fill="#fca5a5">(about 140 kg of force)</text>

          {/* Visual: large force bar */}
          <rect x="40" y="235" width="200" height="16" rx="4" fill="#ef4444" opacity="0.7" />
          <text x="40" y="267" className="sm fill-gray-400 dark:fill-slate-500">Force scale (relative)</text>
        </g>

        {/* Bottom insight */}
        <rect x="80" y="390" width="480" height="30" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="320" y="410" textAnchor="middle" className="label" fill="#fbbf24">
          Human brain experiences 58x more force than woodpecker brain
        </text>
      </svg>
    </div>
  );
}
