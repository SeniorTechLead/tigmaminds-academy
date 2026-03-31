export default function ActivityNeighborhoodMapDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: draw a map of your neighborhood from memory, then walk the area and compare"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#14b8a6">
          Try This: Map Your Neighborhood From Memory
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: blank paper, a pencil, and your own two feet
        </text>

        {/* Step 1 */}
        <rect x="30" y="75" width="230" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#14b8a6" strokeWidth="1.5" />
        <circle cx="55" cy="100" r="14" fill="#14b8a6" fillOpacity="0.2" />
        <text x="55" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#14b8a6">1</text>
        <text x="78" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Draw from memory</text>
        {/* Sketch of a rough map */}
        <rect x="50" y="120" width="190" height="110" rx="4" className="fill-white dark:fill-slate-800" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="60" y1="175" x2="230" y2="175" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="145" y="172" textAnchor="middle" fontSize="8" className="fill-gray-400">main road</text>
        <rect x="80" y="140" width="20" height="15" rx="2" fill="#94a3b8" fillOpacity="0.3" />
        <text x="90" y="137" textAnchor="middle" fontSize="7" className="fill-gray-400">school</text>
        <rect x="150" y="185" width="15" height="15" rx="2" fill="#94a3b8" fillOpacity="0.3" />
        <text x="158" y="210" textAnchor="middle" fontSize="7" className="fill-gray-400">shop</text>
        <circle cx="200" cy="145" r="10" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="0.5" />
        <text x="200" y="148" textAnchor="middle" fontSize="7" fill="#3b82f6">pond</text>

        {/* Step 2 */}
        <rect x="275" y="75" width="230" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="300" cy="100" r="14" fill="#f59e0b" fillOpacity="0.2" />
        <text x="300" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">2</text>
        <text x="323" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Walk and check</text>
        <text x="290" y="130" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Walk your neighborhood with</text>
        <text x="290" y="148" fontSize="11" className="fill-gray-600 dark:fill-slate-300">your map in hand. Mark:</text>
        <text x="300" y="170" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} What you got right {'\u2714'}</text>
        <text x="300" y="188" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} What you missed {'\u2716'}</text>
        <text x="300" y="206" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} What you put in the</text>
        <text x="307" y="222" fontSize="11" className="fill-gray-600 dark:fill-slate-300">wrong place {'\u21C4'}</text>

        {/* Step 3 */}
        <rect x="520" y="75" width="230" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="545" cy="100" r="14" fill="#ec4899" fillOpacity="0.2" />
        <text x="545" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">3</text>
        <text x="568" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Compare with satellite</text>
        <text x="535" y="130" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Look up your area on</text>
        <text x="535" y="148" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Google Maps / satellite view.</text>
        <text x="535" y="172" fontSize="11" fontWeight="600" fill="#ec4899">Ask yourself:</text>
        <text x="545" y="192" fontSize="10" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Why did I distort distances?</text>
        <text x="545" y="208" fontSize="10" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} What did I forget entirely?</text>
        <text x="545" y="224" fontSize="10" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} What do I walk past but</text>
        <text x="552" y="238" fontSize="10" className="fill-gray-600 dark:fill-slate-300">never actually notice?</text>

        {/* Add a scale */}
        <rect x="60" y="265" width="660" height="70" rx="10" className="fill-white dark:fill-slate-900" stroke="#14b8a6" strokeWidth="1" />
        <text x="390" y="290" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14b8a6">
          Bonus: Add a scale to your map
        </text>
        <text x="390" y="310" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Measure one distance you know (e.g., "my house to school = 500m"). Use that to draw a scale bar.
        </text>
        <text x="390" y="326" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Then check: do other distances on your map match reality? Usually they don&apos;t {'\u2014'} that&apos;s why maps need measurement.
        </text>

        {/* What you learned */}
        <rect x="80" y="350" width="620" height="55" rx="10" fill="#14b8a6" fillOpacity="0.1" stroke="#14b8a6" strokeWidth="1" />
        <text x="390" y="372" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14b8a6">
          What this teaches you:
        </text>
        <text x="390" y="392" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-teal-300">
          Memory maps are biased {'\u2014'} we enlarge familiar places and shrink unknown ones. Real cartography uses measurement to fix this.
        </text>
      </svg>
    </div>
  );
}
