export default function ActivitySeedDropDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Seed drop test activity: drop different seed types from a height and measure fall time and distance"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Seed Drop Race
        </text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: paper, scissors, a small coin, tape, and a stopwatch
        </text>

        {/* Drop height indicator */}
        <g transform="translate(60, 90)">
          <line x1="0" y1="0" x2="0" y2="300" stroke="#6b7280" strokeWidth="2" strokeDasharray="6,4" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#6b7280" strokeWidth="2" />
          <line x1="-10" y1="300" x2="10" y2="300" stroke="#6b7280" strokeWidth="2" />
          <text x="-5" y="155" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300" transform="rotate(-90, -5, 155)">
            2 meters (same height for all)
          </text>
        </g>

        {/* Seed model 1: Paper helicopter (samara) */}
        <g transform="translate(180, 90)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-green-600 dark:fill-green-400">
            Paper Samara
          </text>
          {/* Paper strip folded */}
          <rect x="-3" y="25" width="6" height="20" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1" />
          <path d="M -3,25 L -25,18" stroke="#4d7c0f" strokeWidth="2" />
          <path d="M 3,25 L 25,18" stroke="#4d7c0f" strokeWidth="2" />
          <circle cx="0" cy="48" r="4" fill="#92400e" />
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">tape coin here</text>

          {/* Spiral fall path */}
          <path d="M 0,80 Q 15,110 5,140 Q -10,170 0,200 Q 10,230 5,260 Q -5,280 0,300"
            fill="none" stroke="#84cc16" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="25" y="200" fontSize="10" className="fill-green-500 dark:fill-green-400">spins!</text>

          {/* Time box */}
          <rect x="-40" y="310" width="80" height="30" rx="4" className="fill-green-50 dark:fill-green-950" stroke="#84cc16" strokeWidth="1" />
          <text x="0" y="330" textAnchor="middle" fontSize="11" className="fill-green-700 dark:fill-green-300">Time: ___ s</text>
        </g>

        {/* Seed model 2: Paper parachute (dandelion) */}
        <g transform="translate(340, 90)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Paper Parachute
          </text>
          {/* Tissue square with strings */}
          <rect x="-20" y="18" width="40" height="30" rx="2" fill="#dbeafe" opacity="0.7" stroke="#93c5fd" strokeWidth="1" />
          <line x1="-18" y1="48" x2="0" y2="62" stroke="#6b7280" strokeWidth="0.8" />
          <line x1="18" y1="48" x2="0" y2="62" stroke="#6b7280" strokeWidth="0.8" />
          <circle cx="0" cy="65" r="3" fill="#92400e" />
          <text x="0" y="82" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">tissue + thread</text>

          {/* Slow straight fall */}
          <path d="M 0,95 L 0,300" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="25" y="200" fontSize="10" className="fill-blue-500 dark:fill-blue-400">floats!</text>

          <rect x="-40" y="310" width="80" height="30" rx="4" className="fill-blue-50 dark:fill-blue-950" stroke="#60a5fa" strokeWidth="1" />
          <text x="0" y="330" textAnchor="middle" fontSize="11" className="fill-blue-700 dark:fill-blue-300">Time: ___ s</text>
        </g>

        {/* Seed model 3: Crumpled paper (no adaptation) */}
        <g transform="translate(500, 90)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
            Crumpled Ball
          </text>
          {/* Ball */}
          <circle cx="0" cy="35" r="12" fill="#d4d4d8" className="dark:fill-slate-600" />
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">no adaptation</text>

          {/* Fast straight fall */}
          <path d="M 0,80 L 0,300" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
          <text x="25" y="180" fontSize="10" className="fill-amber-600 dark:fill-amber-400">fast!</text>

          <rect x="-40" y="310" width="80" height="30" rx="4" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="330" textAnchor="middle" fontSize="11" className="fill-amber-700 dark:fill-amber-300">Time: ___ s</text>
        </g>

        {/* Seed model 4: Flat paper (maximum drag) */}
        <g transform="translate(660, 90)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">
            Flat Sheet
          </text>
          <rect x="-18" y="22" width="36" height="24" rx="1" fill="#e9d5ff" opacity="0.6" stroke="#a78bfa" strokeWidth="1" />
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">max surface area</text>

          {/* Zigzag fall */}
          <path d="M 0,80 Q -20,120 5,160 Q 25,200 -5,240 Q -15,270 0,300"
            fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="30" y="200" fontSize="10" className="fill-purple-500 dark:fill-purple-400">drifts!</text>

          <rect x="-40" y="310" width="80" height="30" rx="4" className="fill-purple-50 dark:fill-purple-950" stroke="#a78bfa" strokeWidth="1" />
          <text x="0" y="330" textAnchor="middle" fontSize="11" className="fill-purple-700 dark:fill-purple-300">Time: ___ s</text>
        </g>

        {/* Ground line */}
        <line x1="100" y1="390" x2="730" y2="390" stroke="#92400e" strokeWidth="2" />

        {/* Results table prompt */}
        <g transform="translate(390, 420)">
          <rect x="-300" y="0" width="600" height="65" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            Record and Compare
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Which fell slowest? Which drifted farthest sideways? Why?
          </text>
          <text x="0" y="56" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            The slowest faller would travel farthest in wind {"\u2014"} that{"\u2019"}s dispersal distance!
          </text>
        </g>

        <text x="390" y="508" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Build paper seed models and race them to discover how shape affects fall time
        </text>
      </svg>
    </div>
  );
}
