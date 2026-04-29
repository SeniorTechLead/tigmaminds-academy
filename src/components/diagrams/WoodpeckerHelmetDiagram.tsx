export default function WoodpeckerHelmetDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 443"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bio-inspired helmet design with multi-layer protection based on woodpecker skull"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 12px; }
        `}</style>

        <rect width="630" height="443" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Bio-Inspired Helmet Design
        </text>
        <text x="300" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          Woodpecker skull principles applied to human protection
        </text>

        {/* Arrow from woodpecker to helmet */}
        <text x="300" y="75" textAnchor="middle" className="label fill-gray-400 dark:fill-slate-500">Woodpecker Skull  ------  Modern Helmet</text>

        {/* Woodpecker skull cross-section - left */}
        <g transform="translate(40, 90)">
          <text x="110" y="0" textAnchor="middle" className="label" fill="#d97706" fontWeight="600">Woodpecker Skull</text>

          {/* Outer dense bone */}
          <path d="M30,120 Q110,10 190,120" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
          {/* Spongy bone */}
          <path d="M42,115 Q110,25 178,115" fill="none" stroke="#b45309" strokeWidth="12" opacity="0.4" strokeDasharray="4 3" strokeLinecap="round" />
          {/* Inner dense bone */}
          <path d="M55,110 Q110,35 165,110" fill="none" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
          {/* Hyoid */}
          <path d="M25,125 Q0,80 30,40 Q60,10 110,10 Q160,10 190,40" fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 3" />

          {/* Brain */}
          <ellipse cx="110" cy="100" rx="48" ry="35" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1" />
          <text x="110" y="105" textAnchor="middle" className="sm" fill="#86efac">Brain</text>

          {/* Labels */}
          <text x="215" y="30" className="sm" fill="#fbbf24" fontWeight="600">1. Hard outer shell</text>
          <text x="215" y="55" className="sm" fill="#b45309" fontWeight="600">2. Spongy absorber</text>
          <text x="215" y="80" className="sm" fill="#fbbf24" fontWeight="600">3. Hard inner shell</text>
          <text x="215" y="105" className="sm" fill="#fca5a5" fontWeight="600">4. Hyoid strap</text>
        </g>

        {/* Helmet cross-section - right/bottom */}
        <g transform="translate(40, 250)">
          <text x="110" y="0" textAnchor="middle" className="label" fill="#38bdf8" fontWeight="600">Bio-Inspired Helmet</text>

          {/* Outer shell (polycarbonate) */}
          <path d="M30,100 Q110,-5 190,100" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
          {/* EPS foam (spongy equivalent) */}
          <path d="M42,95 Q110,10 178,95" fill="none" stroke="#818cf8" strokeWidth="12" opacity="0.4" strokeDasharray="4 3" strokeLinecap="round" />
          {/* Inner comfort liner */}
          <path d="M55,90 Q110,20 165,90" fill="none" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
          {/* Chin strap (hyoid equivalent) */}
          <path d="M30,100 L30,115 Q110,140 190,115 L190,100" fill="none" stroke="#dc2626" strokeWidth="3" />

          {/* Head */}
          <ellipse cx="110" cy="85" rx="48" ry="32" className="fill-gray-900 dark:fill-slate-50" opacity="0.08" stroke="#94a3b8" strokeWidth="1" />
          <text x="110" y="90" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Head</text>

          {/* Labels */}
          <text x="215" y="15" className="sm" fill="#38bdf8" fontWeight="600">1. Polycarbonate shell</text>
          <text x="215" y="40" className="sm" fill="#818cf8" fontWeight="600">2. EPS foam (crushable)</text>
          <text x="215" y="65" className="sm" fill="#a78bfa" fontWeight="600">3. Comfort liner</text>
          <text x="215" y="90" className="sm" fill="#fca5a5" fontWeight="600">4. Chin strap (retention)</text>
        </g>

        {/* Connection arrows */}
        <g transform="translate(440, 90)">
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <line x1="60" y1={25 + i * 25} x2="60" y2={170 + i * 25} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="60" cy={170 + i * 25} r="3" fill="#475569" />
            </g>
          ))}
        </g>

        <text x="300" y="393" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
          Every layer of a modern helmet has a direct parallel in the woodpecker skull
        </text>
      </svg>
    </div>
  );
}
