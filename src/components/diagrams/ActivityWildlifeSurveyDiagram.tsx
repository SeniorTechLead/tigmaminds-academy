export default function ActivityWildlifeSurveyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: survey wildlife around your home and classify each species as helpful, neutral, or conflicting"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Wildlife Neighbours Survey
        </text>
        <text x="390" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: a notebook, patience, and 30 minutes of quiet observation
        </text>

        {/* House in center */}
        <g transform="translate(390, 150)">
          <rect x="-30" y="-20" width="60" height="40" rx="4" fill="#92400e" opacity="0.2" />
          <polygon points="-35,-20 0,-45 35,-20" fill="#92400e" opacity="0.3" />
          <text x="0" y="5" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Your Home</text>

          {/* Survey radius */}
          <circle cx="0" cy="0" r="100" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />
          <text x="75" y="-75" fontSize="10" className="fill-green-500 dark:fill-green-400">survey area</text>

          {/* Wildlife examples around */}
          {/* Spider */}
          <g transform="translate(-80, -60)">
            <circle cx="0" cy="0" r="3" fill="#6b7280" />
            <text x="0" y="15" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">spider</text>
          </g>
          {/* Lizard */}
          <g transform="translate(75, -50)">
            <ellipse cx="0" cy="0" rx="6" ry="3" fill="#22c55e" opacity="0.5" />
            <text x="0" y="15" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">lizard</text>
          </g>
          {/* Bird */}
          <g transform="translate(85, 40)">
            <circle cx="0" cy="0" r="4" fill="#3b82f6" opacity="0.5" />
            <text x="0" y="15" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">bird</text>
          </g>
          {/* Ants */}
          <g transform="translate(-70, 50)">
            <circle cx="0" cy="0" r="1.5" fill="#92400e" />
            <circle cx="4" cy="1" r="1.5" fill="#92400e" />
            <text x="0" y="15" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">ants</text>
          </g>
        </g>

        {/* Classification table */}
        <g transform="translate(390, 270)">
          <rect x="-330" y="0" width="660" height="110" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.4" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            Classify Each Species
          </text>

          {/* Three columns */}
          <g transform="translate(-210, 40)">
            <rect x="-5" y="-5" width="180" height="55" rx="4" fill="#22c55e" opacity="0.1" />
            <text x="85" y="10" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-600 dark:fill-green-400">Helpful</text>
            <text x="85" y="28" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Spiders eat mosquitoes</text>
            <text x="85" y="42" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Lizards eat cockroaches</text>
          </g>
          <g transform="translate(20, 40)">
            <rect x="-5" y="-5" width="180" height="55" rx="4" fill="#3b82f6" opacity="0.1" />
            <text x="85" y="10" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Neutral</text>
            <text x="85" y="28" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Geckos on walls</text>
            <text x="85" y="42" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Butterflies passing through</text>
          </g>
          <g transform="translate(250, 40)">
            <rect x="-55" y="-5" width="120" height="55" rx="4" fill="#ef4444" opacity="0.1" />
            <text x="5" y="10" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">Conflict</text>
            <text x="5" y="28" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Rats in store</text>
            <text x="5" y="42" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Mosquitoes</text>
          </g>
        </g>

        <text x="390" y="405" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Most of your wildlife neighbours are helping you {"\u2014"} you just didn{"\u2019"}t notice
        </text>
      </svg>
    </div>
  );
}
