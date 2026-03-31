export default function SeedExplosiveGravityDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Explosive and gravity seed dispersal: pods that burst open and heavy seeds that roll"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Explosive and Gravity Dispersal
        </text>

        {/* Dividing line */}
        <line x1="390" y1="55" x2="390" y2="440" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="6,4" className="dark:stroke-slate-700" />

        {/* BALLISTIC / EXPLOSIVE - Left side */}
        <g transform="translate(195, 70)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
            Ballistic (Explosive) Dispersal
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Pod dries, builds tension, then bursts open
          </text>

          {/* Pod before burst */}
          <g transform="translate(-80, 70)">
            <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Before</text>
            <path d="M -25,0 Q 0,-12 25,0 Q 0,12 -25,0 Z" fill="#65a30d" stroke="#4d7c0f" strokeWidth="1.5" />
            {/* Seeds inside */}
            <circle cx="-8" cy="0" r="3" fill="#92400e" />
            <circle cx="0" cy="0" r="3" fill="#92400e" />
            <circle cx="8" cy="0" r="3" fill="#92400e" />
            {/* Tension arrows */}
            <path d="M -22,-8 L -28,-14" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#burst-arrow)" />
            <path d="M 22,-8 L 28,-14" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#burst-arrow)" />
            <defs>
              <marker id="burst-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <path d="M 0,0 L 6,2.5 L 0,5 Z" fill="#ef4444" />
              </marker>
            </defs>
            <text x="0" y="22" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">tension builds</text>
          </g>

          {/* Pod after burst */}
          <g transform="translate(80, 70)">
            <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">After</text>
            {/* Split pod halves */}
            <path d="M -5,0 Q -15,-15 -30,-5" fill="none" stroke="#4d7c0f" strokeWidth="2" />
            <path d="M 5,0 Q 15,-15 30,-5" fill="none" stroke="#4d7c0f" strokeWidth="2" />
            {/* Seeds flying out */}
            <circle cx="-35" cy="-20" r="3" fill="#92400e" />
            <circle cx="40" cy="-25" r="3" fill="#92400e" />
            <circle cx="15" cy="-35" r="3" fill="#92400e" />
            {/* Trajectory lines */}
            <line x1="-5" y1="0" x2="-35" y2="-20" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="5" y1="0" x2="40" y2="-25" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="0" y1="-5" x2="15" y2="-35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
          </g>

          {/* Examples */}
          <g transform="translate(0, 130)">
            <rect x="-155" y="0" width="310" height="85" rx="6" className="fill-orange-50 dark:fill-orange-950" opacity="0.5" />
            <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-orange-700 dark:fill-orange-300">
              Examples
            </text>
            <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Witch hazel: seeds launched up to 14 m
            </text>
            <text x="0" y="56" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Sandbox tree: explosive pods reach 70 m/s
            </text>
            <text x="0" y="72" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Touch-me-not (Impatiens): pods curl on contact
            </text>
          </g>
        </g>

        {/* GRAVITY / BAROCHORY - Right side */}
        <g transform="translate(585, 70)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-teal-600 dark:fill-teal-400">
            Gravity (Barochory)
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Heavy seeds fall and roll downhill
          </text>

          {/* Tree trunk and branch */}
          <line x1="0" y1="45" x2="0" y2="200" stroke="#92400e" strokeWidth="8" />
          <line x1="0" y1="60" x2="-50" y2="45" stroke="#92400e" strokeWidth="4" />
          {/* Canopy */}
          <circle cx="0" cy="35" r="35" fill="#22c55e" opacity="0.3" />

          {/* Falling seed path */}
          <g>
            {/* Coconut */}
            <circle cx="-45" cy="55" r="10" fill="#a16207" opacity="0.4" />
            <line x1="-45" y1="65" x2="-45" y2="160" stroke="#a16207" strokeWidth="1.5" strokeDasharray="4,3" />
            <circle cx="-45" cy="170" r="10" fill="#a16207" />
            <text x="-45" y="145" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">{"\u2193"} gravity</text>
          </g>

          {/* Ground with slope */}
          <line x1="-100" y1="200" x2="100" y2="185" stroke="#92400e" strokeWidth="2" />
          {/* Rolling seed */}
          <circle cx="60" cy="182" r="8" fill="#a16207" opacity="0.6" />
          <path d="M -40,195 Q 10,192 60,182" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="80" y="178" fontSize="10" className="fill-amber-600 dark:fill-amber-400">rolls</text>

          {/* Examples */}
          <g transform="translate(0, 130)">
            <rect x="-155" y="0" width="310" height="85" rx="6" className="fill-teal-50 dark:fill-teal-950" opacity="0.5" />
            <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-teal-700 dark:fill-teal-300">
              Examples
            </text>
            <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Coconut: heavy, rolls, also floats (water backup)
            </text>
            <text x="0" y="56" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Acorns: gravity + squirrels (zoochory combo)
            </text>
            <text x="0" y="72" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Short range, but reliable on slopes
            </text>
          </g>
        </g>

        {/* HYDROCHORY across bottom */}
        <g transform="translate(390, 365)">
          <rect x="-340" y="0" width="680" height="85" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Hydrochory (Water Dispersal)
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            Seeds with waterproof coats or air pockets float on rivers and ocean currents
          </text>
          <text x="0" y="60" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            Coconuts can float for months across oceans {"\u2014"} how coconut palms colonized Pacific islands
          </text>
          {/* Water wave line */}
          <path d="M -320,75 Q -280,65 -240,75 Q -200,85 -160,75 Q -120,65 -80,75 Q -40,85 0,75 Q 40,65 80,75 Q 120,85 160,75 Q 200,65 240,75 Q 280,85 320,75" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
        </g>

        <text x="390" y="500" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Five dispersal mechanisms: wind, animal, explosive, gravity, water
        </text>
      </svg>
    </div>
  );
}
