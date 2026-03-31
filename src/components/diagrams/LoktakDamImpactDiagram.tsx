export default function LoktakDamImpactDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 430" className="w-full max-w-lg mx-auto" role="img" aria-label="Before and after the Ithai Barrage showing impact on phumdi thickness and water level">
        <rect width="560" height="430" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#f87171">Ithai Barrage: How a Dam Changed Everything</text>

        {/* Dividing line */}
        <line x1="280" y1="45" x2="280" y2="400" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4,4" />

        {/* BEFORE section */}
        <text x="140" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#34d399">Before 1983</text>
        <text x="140" y="70" textAnchor="middle" fontSize="9" fill="#6ee7b7" opacity="0.7">Natural water cycle</text>

        {/* Before: water level (lower) */}
        <rect x="20" y="230" width="240" height="80" rx="4" fill="#1e3a5f" opacity="0.5" />
        {[40, 90, 140, 200].map((x, i) => (
          <path key={`bw-${i}`} d={`M${x},230 q15,-4 30,0`} fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        ))}

        {/* Before: thick phumdi */}
        <path d="M40,165 Q80,152 130,160 Q180,148 230,158 L230,230 Q180,240 130,235 Q80,242 40,230 Z" fill="#166534" opacity="0.7" />
        <path d="M40,165 Q80,152 130,160 Q180,148 230,158" fill="none" stroke="#22c55e" strokeWidth="2" />

        {/* Grass on thick phumdi */}
        {[60, 90, 120, 150, 180, 210].map((x, i) => (
          <g key={`bg-${i}`}>
            <line x1={x} y1={158 - (i % 2) * 3} x2={x - 3} y2={135 - (i % 2) * 5} stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <line x1={x} y1={158 - (i % 2) * 3} x2={x + 4} y2={140 - (i % 2) * 4} stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Before: deer standing happily */}
        <g transform="translate(95, 95)">
          <ellipse cx="30" cy="30" rx="22" ry="12" fill="#b45309" opacity="0.8" />
          <path d="M14,22 Q8,8 12,0" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
          <circle cx="11" cy="-2" r="6" fill="#92400e" />
          <path d="M8,-7 Q5,-18 3,-22 M8,-7 Q12,-18 16,-20" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="38" x2="16" y2="58" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="38" x2="44" y2="58" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Before: thickness label */}
        <line x1="30" y1="160" x2="30" y2="232" stroke="white" strokeWidth="1" />
        <line x1="24" y1="160" x2="36" y2="160" stroke="white" strokeWidth="1" />
        <line x1="24" y1="232" x2="36" y2="232" stroke="white" strokeWidth="1" />
        <text x="26" y="200" fontSize="9" fill="white" transform="rotate(-90, 26, 200)" textAnchor="middle">~2 m</text>

        {/* Before: metrics */}
        <rect x="30" y="320" width="220" height="70" rx="6" fill="#065f46" opacity="0.2" />
        <text x="140" y="340" textAnchor="middle" fontSize="10" fill="#34d399">Healthy phumdi: 1.5-2 m thick</text>
        <text x="140" y="356" textAnchor="middle" fontSize="10" fill="#34d399">Natural water cycle (seasonal)</text>
        <text x="140" y="372" textAnchor="middle" fontSize="10" fill="#34d399">Deer population: stable</text>
        <text x="140" y="385" textAnchor="middle" fontSize="8" fill="#6ee7b7" opacity="0.6">Monsoon floods, dry season recedes</text>

        {/* AFTER section */}
        <text x="420" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#f87171">After 1983</text>
        <text x="420" y="70" textAnchor="middle" fontSize="9" fill="#fca5a5" opacity="0.7">Ithai Barrage built</text>

        {/* After: water level (higher) */}
        <rect x="300" y="185" width="240" height="125" rx="4" fill="#1e3a5f" opacity="0.6" />
        {[320, 370, 430, 490].map((x, i) => (
          <path key={`aw-${i}`} d={`M${x},185 q15,-4 30,0`} fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
        ))}

        {/* After: thin phumdi — nearly submerged */}
        <path d="M320,185 Q370,178 420,183 Q470,176 510,185 L510,210 Q470,218 420,213 Q370,220 320,210 Z" fill="#166534" opacity="0.4" />
        <path d="M320,185 Q370,178 420,183 Q470,176 510,185" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />

        {/* Sparse grass */}
        {[350, 410, 470].map((x, i) => (
          <line key={`ag-${i}`} x1={x} y1={180 - (i % 2) * 2} x2={x - 2} y2={170} stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        ))}

        {/* After: struggling deer, partially in water */}
        <g transform="translate(380, 135)">
          <ellipse cx="30" cy="30" rx="18" ry="10" fill="#b45309" opacity="0.6" />
          <path d="M16,24 Q10,12 14,2" fill="none" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
          <circle cx="12" cy="0" r="5" fill="#92400e" opacity="0.7" />
          <line x1="20" y1="37" x2="19" y2="54" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <line x1="40" y1="37" x2="41" y2="52" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* After: water level arrow showing rise */}
        <g>
          <line x1="545" y1="230" x2="545" y2="185" stroke="#f87171" strokeWidth="2" />
          <polygon points="545,182 540,190 550,190" fill="#f87171" />
          <text x="543" y="245" fontSize="8" fill="#fca5a5" textAnchor="middle" transform="rotate(-90, 543, 225)">+2-3 m rise</text>
        </g>

        {/* After: thickness label */}
        <line x1="310" y1="182" x2="310" y2="212" stroke="white" strokeWidth="1" />
        <line x1="304" y1="182" x2="316" y2="182" stroke="white" strokeWidth="1" />
        <line x1="304" y1="212" x2="316" y2="212" stroke="white" strokeWidth="1" />
        <text x="306" y="202" fontSize="8" fill="white" transform="rotate(-90, 306, 200)" textAnchor="middle">&lt;0.5 m</text>

        {/* After: metrics */}
        <rect x="310" y="320" width="220" height="70" rx="6" fill="#7f1d1d" opacity="0.2" />
        <text x="420" y="340" textAnchor="middle" fontSize="10" fill="#f87171">Thin phumdi: &lt;0.5 m</text>
        <text x="420" y="356" textAnchor="middle" fontSize="10" fill="#f87171">Permanent high water</text>
        <text x="420" y="372" textAnchor="middle" fontSize="10" fill="#f87171">Deer population: crashed</text>
        <text x="420" y="385" textAnchor="middle" fontSize="8" fill="#fca5a5" opacity="0.6">Phumdi waterlogged, fragmented, sinking</text>

        {/* Dam icon at bottom center */}
        <rect x="262" y="400" width="36" height="20" rx="3" fill="#475569" opacity="0.5" />
        <text x="280" y="414" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">DAM</text>
      </svg>
    </div>
  );
}
