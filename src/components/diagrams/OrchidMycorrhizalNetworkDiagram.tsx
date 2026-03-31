export default function OrchidMycorrhizalNetworkDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Mycorrhizal network: fungal hyphae connecting trees and orchids underground, the wood-wide web"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          The Wood-Wide Web: Mycorrhizal Networks
        </text>

        {/* Ground line */}
        <line x1="40" y1="250" x2="740" y2="250" stroke="#92400e" strokeWidth="2" />
        <text x="760" y="254" fontSize="10" className="fill-amber-700 dark:fill-amber-300">soil surface</text>

        {/* Above ground: trees */}
        <g transform="translate(150, 160)">
          <line x1="0" y1="0" x2="0" y2="90" stroke="#92400e" strokeWidth="8" />
          <circle cx="0" cy="-20" r="50" fill="#22c55e" opacity="0.3" />
          <circle cx="0" cy="-20" r="35" fill="#22c55e" opacity="0.3" />
          <text x="0" y="-60" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-green-700 dark:fill-green-300">Mature Tree</text>
          <text x="0" y="-46" textAnchor="middle" fontSize="10" className="fill-green-600 dark:fill-green-400">produces sugar</text>
        </g>

        {/* Small seedling */}
        <g transform="translate(400, 230)">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#65a30d" strokeWidth="2" />
          <ellipse cx="-5" cy="-5" rx="8" ry="5" fill="#22c55e" opacity="0.7" />
          <ellipse cx="5" cy="-8" rx="8" ry="5" fill="#22c55e" opacity="0.7" />
          <text x="0" y="-20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-600 dark:fill-green-400">Shaded Seedling</text>
          <text x="0" y="-8" textAnchor="middle" fontSize="9" className="fill-green-500 dark:fill-green-400">receives sugar</text>
        </g>

        {/* Orchid on tree */}
        <g transform="translate(620, 175)">
          <line x1="0" y1="0" x2="0" y2="75" stroke="#92400e" strokeWidth="6" />
          <circle cx="0" cy="-15" r="40" fill="#22c55e" opacity="0.25" />
          {/* Orchid */}
          <g transform="translate(25, -5)">
            <ellipse cx="-5" cy="-4" rx="6" ry="4" fill="#d946ef" opacity="0.7" />
            <ellipse cx="5" cy="-4" rx="6" ry="4" fill="#d946ef" opacity="0.7" />
            <ellipse cx="0" cy="4" rx="5" ry="7" fill="#f0abfc" opacity="0.7" />
          </g>
          <text x="0" y="-50" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-fuchsia-600 dark:fill-fuchsia-400">Host Tree + Orchid</text>
        </g>

        {/* Underground: fungal network */}
        {/* Roots from trees */}
        <g>
          {/* Tree 1 roots */}
          <path d="M 150,250 Q 130,280 110,310" stroke="#92400e" strokeWidth="3" fill="none" />
          <path d="M 150,250 Q 170,290 180,320" stroke="#92400e" strokeWidth="3" fill="none" />

          {/* Tree 2 roots */}
          <path d="M 620,250 Q 600,280 580,310" stroke="#92400e" strokeWidth="3" fill="none" />
          <path d="M 620,250 Q 640,290 650,320" stroke="#92400e" strokeWidth="3" fill="none" />

          {/* Seedling root */}
          <path d="M 400,250 Q 395,270 390,290" stroke="#65a30d" strokeWidth="1.5" fill="none" />
        </g>

        {/* Fungal hyphae network */}
        <g>
          {/* Main network connections */}
          <path d="M 120,310 Q 200,350 300,340 Q 380,335 390,295" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <path d="M 180,320 Q 300,370 450,360 Q 550,350 580,315" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="3,2" />
          <path d="M 390,290 Q 470,330 560,320" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />

          {/* Branch hyphae */}
          <path d="M 250,345 Q 260,380 280,400" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M 350,340 Q 340,370 330,395" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M 480,355 Q 490,380 500,400" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.6" />

          {/* Hyphal tips (small dots) */}
          {[
            [120, 312], [180, 322], [250, 347], [300, 342], [350, 342],
            [390, 297], [450, 360], [480, 357], [560, 322], [580, 317],
            [280, 402], [330, 397], [500, 402],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#f59e0b" opacity="0.7" />
          ))}
        </g>

        {/* Labels for exchange */}
        <g transform="translate(260, 380)">
          <rect x="-70" y="0" width="140" height="40" rx="4" className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
          <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Fungal hyphae</text>
          <text x="0" y="30" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">(mycorrhizal network)</text>
        </g>

        {/* Exchange arrows and labels */}
        <g transform="translate(150, 280)">
          <text x="0" y="0" fontSize="10" className="fill-blue-500 dark:fill-blue-400">{"\u2193"} sugar to fungus</text>
          <text x="0" y="14" fontSize="10" className="fill-emerald-500 dark:fill-emerald-400">{"\u2191"} minerals to tree</text>
        </g>

        {/* Bottom info box */}
        <g transform="translate(390, 440)">
          <rect x="-330" y="0" width="660" height="55" rx="8" className="fill-fuchsia-50 dark:fill-fuchsia-950" opacity="0.5" />
          <text x="0" y="18" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-fuchsia-700 dark:fill-fuchsia-300">
            Orchid seeds cannot germinate without a fungal partner
          </text>
          <text x="0" y="36" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Dust-like seeds have zero stored nutrients {"\u2014"} the fungus feeds the seedling until it can photosynthesize
          </text>
        </g>

        <text x="390" y="510" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Mycorrhizal networks connect trees, seedlings, and orchids through underground fungal threads
        </text>
      </svg>
    </div>
  );
}
