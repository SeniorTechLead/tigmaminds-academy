export default function ActivityGrassGrowDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: plant grass in two pots, one in sun and one in shade, then trim one to simulate a controlled burn and watch regrowth"
      >
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Grass Growth and “Fire” Recovery
        </text>
        <text x="350" y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: 2 pots, grass seeds or clippings, scissors, a sunny spot, a shady spot
        </text>

        {/* Part 1: Sun vs Shade */}
        <text x="190" y="80" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Part 1: Sun vs Shade</text>

        {/* Sunny pot */}
        <g transform="translate(80, 95)">
          <rect x="0" y="60" width="80" height="50" rx="4" fill="#92400e" opacity="0.5" />
          <rect x="5" y="50" width="70" height="15" rx="2" fill="#78350f" opacity="0.3" />
          {[15, 28, 41, 54, 67].map((cx, i) => (
            <line key={i} x1={cx} y1={50} x2={cx} y2={15 + i * 2} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          ))}
          {/* Sun */}
          <circle cx="40" cy="-5" r="14" fill="#fbbf24" opacity="0.7" />
          <text x="40" y="125" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Sunny pot</text>
          <text x="40" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Grows fast</text>
        </g>

        {/* Shady pot */}
        <g transform="translate(220, 95)">
          <rect x="0" y="60" width="80" height="50" rx="4" fill="#92400e" opacity="0.5" />
          <rect x="5" y="50" width="70" height="15" rx="2" fill="#78350f" opacity="0.3" />
          {[15, 28, 41, 54, 67].map((cx, i) => (
            <line key={i} x1={cx} y1={50} x2={cx} y2={35 + i * 1} stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
          ))}
          {/* Cloud */}
          <ellipse cx="40" cy="0" rx="22" ry="10" fill="#94a3b8" opacity="0.4" />
          <text x="40" y="125" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-gray-400">Shady pot</text>
          <text x="40" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Grows slower</text>
        </g>

        {/* Measure label */}
        <rect x="80" y="250" width="220" height="28" rx="4" className="fill-blue-50 dark:fill-blue-950/30" stroke="#3b82f6" strokeWidth="1" />
        <text x="190" y="269" textAnchor="middle" fontSize="11" className="fill-blue-700 dark:fill-blue-300">Measure daily for 7 days with a ruler</text>

        {/* Part 2: Trim = simulated fire */}
        <text x="510" y="80" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">Part 2: Simulated “Burn”</text>

        {/* Before trim */}
        <g transform="translate(420, 95)">
          <rect x="0" y="60" width="70" height="45" rx="4" fill="#92400e" opacity="0.5" />
          <rect x="5" y="50" width="60" height="15" rx="2" fill="#78350f" opacity="0.3" />
          {[12, 24, 36, 48].map((cx, i) => (
            <line key={i} x1={cx} y1={50} x2={cx} y2={20} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          ))}
          <text x="35" y="120" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-400">Before</text>
        </g>

        {/* Scissors */}
        <text x="520" y="155" fontSize="22">✂</text>
        <text x="520" y="175" textAnchor="middle" fontSize="10" className="fill-orange-600 dark:fill-orange-400">Trim to soil</text>

        {/* After trim */}
        <g transform="translate(560, 95)">
          <rect x="0" y="60" width="70" height="45" rx="4" fill="#92400e" opacity="0.5" />
          <rect x="5" y="50" width="60" height="15" rx="2" fill="#78350f" opacity="0.3" />
          {/* Tiny regrowth */}
          {[12, 24, 36, 48].map((cx, i) => (
            <line key={i} x1={cx} y1={50} x2={cx} y2={44} stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
          ))}
          <text x="35" y="120" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">After: regrows!</text>
        </g>

        {/* Explanation box */}
        <rect x="400" y="230" width="260" height="80" rx="6" className="fill-green-50 dark:fill-green-950/30" stroke="#16a34a" strokeWidth="1" />
        <text x="530" y="252" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">Why it works:</text>
        <text x="530" y="270" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Grass roots survive underground.</text>
        <text x="530" y="285" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">New shoots emerge in days — same</text>
        <text x="530" y="300" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">mechanism as Kaziranga after a burn.</text>

        {/* Bottom insight */}
        <rect x="50" y="340" width="600" height="44" rx="6" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="358" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-800 dark:fill-amber-200">
          Record: Which pot grew taller? How many days until trimmed grass recovered?
        </text>
        <text x="350" y="374" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          C4 grasses in Kaziranga do this at massive scale — regrowing 5m from burnt stubble in one season
        </text>
      </svg>
    </div>
  );
}
