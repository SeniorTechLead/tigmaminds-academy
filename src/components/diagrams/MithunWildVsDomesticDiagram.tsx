export default function MithunWildVsDomesticDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of wild gaur and domesticated mithun showing trait changes from domestication"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Wild Gaur vs Domesticated Mithun
        </text>
        <text x="390" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          8,000 years of human selection changed these traits
        </text>

        {/* Dividing line */}
        <line x1="390" y1="65" x2="390" y2="460" stroke="#64748b" strokeWidth="1" strokeDasharray="6 4" />

        {/* Wild Gaur - Left */}
        <text x="195" y="82" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ef4444">
          Wild Gaur (Bos gaurus)
        </text>

        {/* Gaur body - larger, more muscular */}
        <g transform="translate(120, 160)">
          {/* Body */}
          <ellipse cx="80" cy="60" rx="75" ry="45" fill="#4a3728" />
          {/* Muscular hump */}
          <ellipse cx="40" cy="25" rx="35" ry="25" fill="#5c4433" />
          {/* Head */}
          <ellipse cx="-5" cy="45" rx="28" ry="22" fill="#3d2b1f" />
          {/* Large horns */}
          <path d="M-25,30 Q-45,0 -30,-25" fill="none" stroke="#d4a574" strokeWidth="5" strokeLinecap="round" />
          <path d="M5,25 Q25,-5 10,-30" fill="none" stroke="#d4a574" strokeWidth="5" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="-12" cy="40" r="4" fill="#fbbf24" />
          <circle cx="-12" cy="40" r="2" fill="#1e1b18" />
          {/* Legs */}
          <rect x="20" y="95" width="12" height="55" rx="4" fill="#3d2b1f" />
          <rect x="50" y="95" width="12" height="55" rx="4" fill="#3d2b1f" />
          <rect x="100" y="95" width="12" height="55" rx="4" fill="#3d2b1f" />
          <rect x="130" y="95" width="12" height="55" rx="4" fill="#3d2b1f" />
          {/* White stockings */}
          <rect x="20" y="135" width="12" height="15" rx="4" fill="#e8dcc8" />
          <rect x="50" y="135" width="12" height="15" rx="4" fill="#e8dcc8" />
          <rect x="100" y="135" width="12" height="15" rx="4" fill="#e8dcc8" />
          <rect x="130" y="135" width="12" height="15" rx="4" fill="#e8dcc8" />
        </g>

        {/* Gaur traits */}
        <g fontSize="11" className="fill-gray-700 dark:fill-slate-300">
          <text x="30" y="345" fontWeight="600" fill="#ef4444">{'\u2022'} Larger brain (100%)</text>
          <text x="30" y="365">{'\u2022'} Strong flight response</text>
          <text x="30" y="385">{'\u2022'} Late sexual maturity</text>
          <text x="30" y="405">{'\u2022'} Lean, muscular build</text>
          <text x="30" y="425">{'\u2022'} Aggressive temperament</text>
          <text x="30" y="445">{'\u2022'} Uniform dark coat</text>
        </g>

        {/* Domesticated Mithun - Right */}
        <text x="585" y="82" textAnchor="middle" fontSize="14" fontWeight="700" fill="#22c55e">
          Mithun (Bos frontalis)
        </text>

        {/* Mithun body - slightly smaller, stockier */}
        <g transform="translate(510, 170)">
          {/* Body */}
          <ellipse cx="70" cy="55" rx="68" ry="40" fill="#2d2420" />
          {/* Smaller hump */}
          <ellipse cx="35" cy="25" rx="28" ry="18" fill="#3d3028" />
          {/* Head */}
          <ellipse cx="0" cy="42" rx="25" ry="20" fill="#1e1815" />
          {/* Wider, flatter horns */}
          <path d="M-20,28 Q-35,10 -22,-8" fill="none" stroke="#c9a86c" strokeWidth="6" strokeLinecap="round" />
          <path d="M8,22 Q22,5 12,-12" fill="none" stroke="#c9a86c" strokeWidth="6" strokeLinecap="round" />
          {/* Calm eye */}
          <circle cx="-8" cy="38" r="4" fill="#a16207" />
          <circle cx="-8" cy="38" r="2" fill="#1e1b18" />
          {/* Legs - slightly shorter */}
          <rect x="15" y="85" width="12" height="50" rx="4" fill="#1e1815" />
          <rect x="42" y="85" width="12" height="50" rx="4" fill="#1e1815" />
          <rect x="90" y="85" width="12" height="50" rx="4" fill="#1e1815" />
          <rect x="115" y="85" width="12" height="50" rx="4" fill="#1e1815" />
          {/* White stockings */}
          <rect x="15" y="120" width="12" height="15" rx="4" fill="#f5f0e6" />
          <rect x="42" y="120" width="12" height="15" rx="4" fill="#f5f0e6" />
          <rect x="90" y="120" width="12" height="15" rx="4" fill="#f5f0e6" />
          <rect x="115" y="120" width="12" height="15" rx="4" fill="#f5f0e6" />
        </g>

        {/* Mithun traits */}
        <g fontSize="11" className="fill-gray-700 dark:fill-slate-300">
          <text x="420" y="345" fontWeight="600" fill="#22c55e">{'\u2022'} Smaller brain (~75%)</text>
          <text x="420" y="365">{'\u2022'} Calm around humans</text>
          <text x="420" y="385">{'\u2022'} Earlier sexual maturity</text>
          <text x="420" y="405">{'\u2022'} More fat deposition</text>
          <text x="420" y="425">{'\u2022'} Docile temperament</text>
          <text x="420" y="445">{'\u2022'} Varied coat colours</text>
        </g>

        {/* Arrow showing direction */}
        <g transform="translate(340, 440)">
          <line x1="0" y1="0" x2="100" y2="0" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow-dom)" />
          <defs>
            <marker id="arrow-dom" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
            </marker>
          </defs>
          <text x="50" y="-8" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="600">
            8,000 years
          </text>
        </g>
      </svg>
    </div>
  );
}
