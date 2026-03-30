export default function ActivityEggDropDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 720 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Egg drop experiment: bare egg smashes, one thick layer might survive, three thin layers protect best"
      >
        {/* Background */}
        <rect width="720" height="460" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="360" y="34" textAnchor="middle" fontSize="15" fontWeight="600" className="fill-amber-300">
          Try This: Egg Drop Challenge
        </text>

        {/* Drop height arrow on left */}
        <line x1="35" y1="70" x2="35" y2="310" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="35,70 31,80 39,80" className="fill-gray-500 dark:fill-slate-400" />
        <polygon points="35,310 31,300 39,300" className="fill-gray-500 dark:fill-slate-400" />
        <text x="22" y="195" textAnchor="middle" fontSize="10" className="fill-slate-400"
          transform="rotate(-90,22,195)">~1 metre drop</text>

        {/* Column positions */}
        {/* Col 1: x=140, Col 2: x=340, Col 3: x=540 */}

        {/* Divider lines */}
        <line x1="240" y1="55" x2="240" y2="400" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="440" y1="55" x2="440" y2="400" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

        {/* ─── Column 1: Bare egg ─── */}
        <ellipse cx="140" cy="125" rx="20" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <line x1="126" y1="103" x2="126" y2="87" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
        <line x1="154" y1="103" x2="154" y2="87" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
        {/* Down arrow */}
        <line x1="140" y1="158" x2="140" y2="260" stroke="#ef4444" strokeWidth="2.5" />
        <polygon points="140,268 134,256 146,256" fill="#ef4444" />
        {/* Splatter */}
        <ellipse cx="140" cy="310" rx="38" ry="9" fill="#ef4444" opacity="0.6" />
        <path d="M 122 306 Q 110 288 102 300" stroke="#ef4444" strokeWidth="2" fill="none" />
        <path d="M 158 306 Q 170 288 178 300" stroke="#ef4444" strokeWidth="2" fill="none" />
        <path d="M 132 303 Q 126 282 120 294" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        <path d="M 148 303 Q 154 282 160 294" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        <path d="M 130 308 L 126 299 L 134 302 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="0.5" />
        <path d="M 150 308 L 154 299 L 146 302 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="0.5" />
        <line x1="85" y1="322" x2="195" y2="322" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        <text x="140" y="350" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-red-400">SMASH!</text>
        <text x="140" y="370" textAnchor="middle" fontSize="12" className="fill-slate-400">Bare egg</text>
        <text x="140" y="388" textAnchor="middle" fontSize="10" className="fill-slate-500">No protection</text>

        {/* ─── Column 2: One thick layer ─── */}
        <ellipse cx="340" cy="125" rx="32" ry="38" fill="#a78bfa" opacity="0.35"
          stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,2" />
        <ellipse cx="340" cy="125" rx="20" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <line x1="376" y1="114" x2="410" y2="104" stroke="#a78bfa" strokeWidth="1" />
        <text x="414" y="100" fontSize="10" className="fill-purple-300">Thick cotton</text>
        <text x="414" y="114" fontSize="10" className="fill-purple-300">(one layer)</text>
        {/* Down arrow */}
        <line x1="340" y1="170" x2="340" y2="260" stroke="#f59e0b" strokeWidth="2.5" />
        <polygon points="340,268 334,256 346,256" fill="#f59e0b" />
        {/* Cracked egg on ground */}
        <ellipse cx="340" cy="305" rx="32" ry="10" fill="#a78bfa" opacity="0.25" />
        <ellipse cx="340" cy="300" rx="20" ry="24" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <path d="M 335 284 L 338 294 L 332 304 L 337 312" stroke="#92400e" strokeWidth="1.5" fill="none" />
        <text x="340" y="280" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-400">?</text>
        <line x1="285" y1="322" x2="395" y2="322" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        <text x="340" y="350" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-amber-400">MAYBE...</text>
        <text x="340" y="370" textAnchor="middle" fontSize="12" className="fill-slate-400">One thick wrap</text>
        <text x="340" y="388" textAnchor="middle" fontSize="10" className="fill-slate-500">Single layer</text>

        {/* ─── Column 3: Three thin layers ─── */}
        {/* Outer layer: bubble wrap (green) */}
        <ellipse cx="540" cy="125" rx="42" ry="48" fill="#86efac" opacity="0.12"
          stroke="#4ade80" strokeWidth="1" strokeDasharray="3,2" />
        {/* Middle layer: paper (blue) */}
        <ellipse cx="540" cy="125" rx="34" ry="40" fill="#93c5fd" opacity="0.12"
          stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,2" />
        {/* Inner layer: cloth (amber) */}
        <ellipse cx="540" cy="125" rx="26" ry="34" fill="#fde68a" opacity="0.15"
          stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
        {/* Egg */}
        <ellipse cx="540" cy="125" rx="20" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />

        {/* Layer labels — positioned with enough room */}
        <line x1="584" y1="85" x2="620" y2="68" stroke="#4ade80" strokeWidth="1" />
        <text x="624" y="72" fontSize="11" fontWeight="500" className="fill-green-300">Bubble wrap</text>

        <line x1="578" y1="102" x2="620" y2="90" stroke="#60a5fa" strokeWidth="1" />
        <text x="624" y="94" fontSize="11" fontWeight="500" className="fill-blue-300">Paper</text>

        <line x1="570" y1="118" x2="620" y2="112" stroke="#fbbf24" strokeWidth="1" />
        <text x="624" y="116" fontSize="11" fontWeight="500" className="fill-amber-300">Cloth</text>

        {/* Down arrow */}
        <line x1="540" y1="180" x2="540" y2="260" stroke="#22c55e" strokeWidth="2.5" />
        <polygon points="540,268 534,256 546,256" fill="#22c55e" />

        {/* Intact egg on ground */}
        <ellipse cx="540" cy="305" rx="42" ry="12" fill="#86efac" opacity="0.12" />
        <ellipse cx="540" cy="300" rx="20" ry="24" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <path d="M 530 300 L 537 310 L 554 288" stroke="#22c55e" strokeWidth="3" fill="none" />
        <line x1="485" y1="322" x2="595" y2="322" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        <text x="540" y="350" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-green-400">SURVIVES!</text>
        <text x="540" y="370" textAnchor="middle" fontSize="12" className="fill-slate-400">Three thin layers</text>
        <text x="540" y="388" textAnchor="middle" fontSize="10" className="fill-slate-500">Multi-layer wins</text>

        {/* Bottom note */}
        <text x="360" y="430" textAnchor="middle" fontSize="11" className="fill-slate-500">
          Multi-layer wins — same principle as woodpecker skull
        </text>
      </svg>
    </div>
  );
}
