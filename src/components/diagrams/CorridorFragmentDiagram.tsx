export default function CorridorFragmentDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Habitat fragmentation: roads and farms split forest into isolated patches, blocking wildlife movement"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          Habitat Fragmentation: Roads and Farms as Barriers
        </text>

        {/* Before: connected forest */}
        <text x="175" y="62" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Before</text>
        <rect x="40" y="70" width="270" height="170" rx="8" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="1.5" />
        {/* Trees scattered */}
        {[[80,110],[130,100],[180,120],[100,160],[150,150],[200,140],[240,130],[120,190],[170,185],[220,170],[250,160],[90,140],[210,110]].map(([x,y], i) => (
          <text key={i} x={x} y={y} fontSize="16" className="fill-emerald-600 dark:fill-emerald-500">{'\ud83c\udf33'}</text>
        ))}
        {/* Elephants moving freely */}
        <text x="100" y="210" fontSize="16">{'\ud83d\udc18'}</text>
        <text x="200" y="200" fontSize="14">{'\ud83d\udc18'}</text>
        <text x="260" y="190" fontSize="12">{'\ud83d\udc18'}</text>
        <path d="M 110 205 C 150 195 180 198 210 195 C 230 192 250 190 270 185" fill="none" stroke="#065f46" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="175" y="228" textAnchor="middle" fontSize="10" className="fill-emerald-700 dark:fill-emerald-300">Continuous forest \u2014 free movement</text>

        {/* After: fragmented */}
        <text x="525" y="62" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">After</text>
        <rect x="390" y="70" width="270" height="170" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#d97706" strokeWidth="1.5" />

        {/* Fragment A */}
        <rect x="400" y="80" width="80" height="70" rx="6" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="1" />
        {[[415,100],[440,95],[460,110]].map(([x,y], i) => (
          <text key={`a${i}`} x={x} y={y} fontSize="12" className="fill-emerald-600 dark:fill-emerald-500">{'\ud83c\udf33'}</text>
        ))}
        <text x="420" y="140" fontSize="12">{'\ud83d\udc18'}</text>

        {/* Fragment B */}
        <rect x="550" y="130" width="90" height="70" rx="6" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="1" />
        {[[565,150],[590,145],[620,160]].map(([x,y], i) => (
          <text key={`b${i}`} x={x} y={y} fontSize="12" className="fill-emerald-600 dark:fill-emerald-500">{'\ud83c\udf33'}</text>
        ))}

        {/* Road */}
        <rect x="488" y="75" width="55" height="160" rx="3" fill="#6b7280" opacity="0.3" />
        <text x="515" y="160" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90 515 160)">ROAD</text>

        {/* Farm */}
        <rect x="400" y="155" width="80" height="40" rx="3" fill="#fbbf24" opacity="0.2" />
        <text x="440" y="178" textAnchor="middle" fontSize="9" className="fill-amber-600 dark:fill-amber-400">Farm</text>

        {/* Blocked arrow */}
        <line x1="470" y1="135" x2="550" y2="155" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="510" y="128" textAnchor="middle" fontSize="14" className="fill-red-500 dark:fill-red-400">\u2717</text>

        <text x="525" y="228" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">Isolated patches \u2014 movement blocked</text>

        {/* Consequences */}
        <text x="350" y="270" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-red-600 dark:fill-red-400">
          What Fragmentation Causes
        </text>

        {[
          { x: 120, icon: '\ud83e\uddec', title: 'Inbreeding', desc: 'Small isolated populations\nlose genetic diversity' },
          { x: 290, icon: '\ud83c\udf3e', title: 'Resource Loss', desc: 'Seasonal food and water\nbecome unreachable' },
          { x: 460, icon: '\u26a0\ufe0f', title: 'Conflict', desc: 'Elephants cross farms\nand villages instead' },
          { x: 610, icon: '\ud83d\udcc9', title: 'Extinction Risk', desc: 'Local populations\ndie out permanently' },
        ].map(({ x, icon, title, desc }) => (
          <g key={title}>
            <text x={x} y="305" textAnchor="middle" fontSize="18">{icon}</text>
            <text x={x} y="325" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">{title}</text>
            {desc.split('\n').map((line, i) => (
              <text key={i} x={x} y={340 + i * 13} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}

        {/* Solution: corridor */}
        <rect x="60" y="380" width="580" height="88" rx="8" className="fill-green-50 dark:fill-green-950/30 stroke-green-200 dark:stroke-green-800" strokeWidth="1" />
        <text x="350" y="400" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-700 dark:fill-green-300">
          The Solution: Wildlife Corridors
        </text>
        <text x="350" y="420" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          A strip of habitat (even 50 m wide) connecting patches restores movement.
        </text>
        <text x="350" y="438" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          India has identified 101 elephant corridors \u2014 some barely a few hundred metres wide.
        </text>
        <text x="350" y="456" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">
          Lose one corridor = permanently isolate two populations.
        </text>
      </svg>
    </div>
  );
}
