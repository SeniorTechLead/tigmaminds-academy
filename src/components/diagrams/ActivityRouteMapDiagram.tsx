export default function ActivityRouteMapDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 837 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: draw a map of your neighborhood as a graph with nodes for landmarks and edges with walking times, then find the shortest route"
      >
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Map Your Neighborhood as a Graph
        </text>
        <text x="350" y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: paper, pen, a watch or phone timer, walking shoes
        </text>

        {/* Step 1 */}
        <g transform="translate(50, 70)">
          <rect width="190" height="160" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="20" cy="18" r="12" className="fill-blue-500 dark:fill-blue-400" />
          <text x="20" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">1</text>
          <text x="45" y="22" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Pick 6–8 landmarks</text>

          {/* Example landmarks */}
          {[
            { y: 45, icon: '\u{1F3E0}', label: 'Your home' },
            { y: 65, icon: '\u{1F3EB}', label: 'School' },
            { y: 85, icon: '\u{1F6D2}', label: 'Shop' },
            { y: 105, icon: '\u26EA', label: 'Temple / mosque' },
            { y: 125, icon: '\u{1F333}', label: 'Park / tree' },
            { y: 145, icon: '\u{1F4EE}', label: 'Post office' },
          ].map((l, i) => (
            <text key={i} x="20" y={l.y} fontSize="11" className="fill-gray-600 dark:fill-gray-400">
              {l.icon} {l.label}
            </text>
          ))}
        </g>

        {/* Step 2 */}
        <g transform="translate(260, 70)">
          <rect width="190" height="160" rx="8" className="fill-green-50 dark:fill-green-950/20" stroke="#16a34a" strokeWidth="1" />
          <circle cx="20" cy="18" r="12" className="fill-green-500 dark:fill-green-400" />
          <text x="20" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">2</text>
          <text x="45" y="22" fontSize="12" fontWeight="700" className="fill-green-700 dark:fill-green-300">Walk and time edges</text>

          {/* Mini graph */}
          <g transform="translate(20, 45)">
            <circle cx="30" cy="20" r="8" className="fill-blue-400 dark:fill-blue-500" />
            <circle cx="120" cy="15" r="8" className="fill-blue-400 dark:fill-blue-500" />
            <circle cx="75" cy="80" r="8" className="fill-blue-400 dark:fill-blue-500" />
            <line x1="30" y1="20" x2="120" y2="15" stroke="#16a34a" strokeWidth="1.5" />
            <text x="75" y="10" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">4 min</text>
            <line x1="30" y1="20" x2="75" y2="80" stroke="#16a34a" strokeWidth="1.5" />
            <text x="40" y="58" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">6 min</text>
            <line x1="120" y1="15" x2="75" y2="80" stroke="#16a34a" strokeWidth="1.5" />
            <text x="108" y="54" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">5 min</text>
          </g>

          <text x="95" y="150" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Time each walk in minutes</text>
        </g>

        {/* Step 3 */}
        <g transform="translate(470, 70)">
          <rect width="190" height="160" rx="8" className="fill-purple-50 dark:fill-purple-950/20" stroke="#9333ea" strokeWidth="1" />
          <circle cx="20" cy="18" r="12" className="fill-purple-500 dark:fill-purple-400" />
          <text x="20" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">3</text>
          <text x="45" y="22" fontSize="12" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">Find the best route</text>

          <text x="95" y="50" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">Visit ALL landmarks</text>
          <text x="95" y="68" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">and return home.</text>

          <text x="95" y="95" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">Try different orders:</text>
          <text x="95" y="115" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Route 1: Home→School→Shop→...</text>
          <text x="95" y="130" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Route 2: Home→Park→Temple→...</text>
          <text x="95" y="150" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">Which route is fastest?</text>
        </g>

        {/* Questions to think about */}
        <rect x="50" y="250" width="600" height="115" rx="8" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="272" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">Think About</text>
        <text x="70" y="295" fontSize="11" className="fill-gray-700 dark:fill-gray-300">• Did the nearest-neighbor approach (always go to the closest next stop) give the best route?</text>
        <text x="70" y="315" fontSize="11" className="fill-gray-700 dark:fill-gray-300">• How much faster was your best route compared to your worst route?</text>
        <text x="70" y="335" fontSize="11" className="fill-gray-700 dark:fill-gray-300">• Bah Kitbok’s 7-village route has 360 possible orderings — he found the best one through 27 years of walking!</text>
        <text x="70" y="355" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">• This is the Travelling Salesman Problem — one of the hardest problems in computer science.</text>
      </svg>
    </div>
  );
}
