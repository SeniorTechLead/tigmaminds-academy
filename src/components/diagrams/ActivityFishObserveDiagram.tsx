/* ActivityFishObserveDiagram – Offline activity: observe fish at a local water body and record jump frequency */

export default function ActivityFishObserveDiagram() {
  return (
    <svg
      viewBox="0 0 592 340"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="Activity: observe fish jumping behaviour at a local water body, recording frequency, conditions, and analysing patterns"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        Activity: Fish Jump Watch
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Observe, count, and think like an aquatic biologist
      </text>

      {/* Step 1: Find a spot */}
      <rect x="15" y="52" width="175" height="115" rx="6" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
      <text x="102" y="70" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">Step 1: Choose a Spot</text>
      {/* River icon */}
      <path d="M40,100 Q70,90 102,100 Q134,110 165,100" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
      <path d="M40,115 Q70,105 102,115 Q134,125 165,115" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3" />
      <text x="102" y="140" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">River bank, pond edge, or</text>
      <text x="102" y="151" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">bridge over a stream</text>
      <text x="102" y="162" textAnchor="middle" fontSize="7" fontStyle="italic" className="fill-blue-500 dark:fill-blue-400">Sit quietly for 5 min first</text>

      {/* Step 2: Record */}
      <rect x="208" y="52" width="175" height="115" rx="6" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="295" y="70" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-green-600 dark:fill-green-400">Step 2: Count Jumps</text>
      {/* Tally marks */}
      <rect x="225" y="80" width="140" height="70" rx="4" className="fill-white dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
      <line x1="225" y1="95" x2="365" y2="95" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
      <text x="260" y="91" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">Time</text>
      <text x="330" y="91" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">Jumps</text>
      {['0\u20135 min', '5\u201310 min', '10\u201315 min', '15\u201320 min'].map((t, i) => (
        <g key={i}>
          <text x="260" y={108 + i * 11} textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">{t}</text>
          <text x="330" y={108 + i * 11} textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
            {['|||', '|||| |', '||', '||||'][i]}
          </text>
        </g>
      ))}

      {/* Step 3: Record conditions */}
      <rect x="401" y="52" width="175" height="115" rx="6" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
      <text x="488" y="70" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Step 3: Conditions</text>
      <text x="488" y="90" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">\u2022 Time of day: ___</text>
      <text x="488" y="104" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">\u2022 Weather: sunny / cloudy / hot</text>
      <text x="488" y="118" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">\u2022 Water: clear / murky / foamy</text>
      <text x="488" y="132" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">\u2022 Flow: still / slow / fast</text>
      <text x="488" y="148" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">\u2022 Nearby: factory / farm / forest</text>

      {/* Step 4: Analyse */}
      <rect x="50" y="185" width="492" height="80" rx="6" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1" />
      <text x="296" y="203" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">Step 4: Think Like a Scientist</text>
      <text x="75" y="222" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        \u2022 Did jump frequency change during your observation? Why?
      </text>
      <text x="75" y="236" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        \u2022 Were jumps clustered in one area? (rapids? shallows? near pipes?)
      </text>
      <text x="75" y="250" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        \u2022 Predict: would you see more or fewer jumps on a hotter day? Why?
      </text>
      <text x="75" y="264" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        \u2022 Return at a different time of day. Compare your two counts.
      </text>

      {/* Bottom insight */}
      <rect x="50" y="280" width="492" height="50" rx="6" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="296" y="300" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-700 dark:fill-green-300">
        You just did what fisheries scientists do \u2014 behavioural observation
      </text>
      <text x="296" y="316" textAnchor="middle" fontSize="8" className="fill-green-600 dark:fill-green-400">
        Real researchers repeat this weekly for months to spot trends. One session is a start. Keep going!
      </text>
    </svg>
  );
}
