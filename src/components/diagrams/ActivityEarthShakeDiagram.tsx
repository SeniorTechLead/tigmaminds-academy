export default function ActivityEarthShakeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: demonstrate plate tectonics with two books on a table, push them together to see friction, sudden slip, and crumpling paper crust"
      >
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Plate Tectonics with Books
        </text>
        <text x="350" y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: 2 heavy books, a sheet of paper, a smooth table
        </text>

        {/* Experiment 1: Friction and slip */}
        <g transform="translate(50, 70)">
          <rect width="290" height="160" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <text x="145" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Part 1: Friction Earthquake</text>

          {/* Two books side by side */}
          <rect x="30" y="70" width="90" height="55" rx="4" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="75" y="100" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Book A</text>

          <rect x="170" y="70" width="90" height="55" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280" strokeWidth="1.5" />
          <text x="215" y="100" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Book B</text>

          {/* Push arrows */}
          <line x1="45" y1="97" x2="115" y2="97" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-shake)" />
          <text x="80" y="65" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">Push slowly</text>

          <text x="145" y="148" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Books resist, resist, then</text>
          <text x="145" y="160" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">SLIP! = earthquake!</text>
        </g>

        {/* Experiment 2: Mountain building */}
        <g transform="translate(360, 70)">
          <rect width="290" height="160" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1" />
          <text x="145" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">Part 2: Mountain Building</text>

          {/* Paper on table */}
          <rect x="30" y="100" width="230" height="8" rx="2" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
          <text x="145" y="95" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Lay paper flat on table</text>

          {/* Books pushing from sides */}
          <rect x="10" y="85" width="30" height="35" rx="3" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1" />
          <rect x="250" y="85" width="30" height="35" rx="3" fill="#6b7280" opacity="0.3" stroke="#6b7280" strokeWidth="1" />

          {/* Push arrows */}
          <line x1="42" y1="102" x2="80" y2="102" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-shake)" />
          <line x1="248" y1="102" x2="210" y2="102" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arr-shake-g)" />

          {/* Crumpled paper = mountains */}
          <path d="M90,95 Q110,70 130,85 Q150,60 170,80 Q190,65 200,95" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="4 2" />
          <text x="145" y="55" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Paper crumples = mountains!</text>

          <text x="145" y="142" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Push books together from both sides.</text>
          <text x="145" y="156" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Paper folds up = Himalayas forming!</text>
        </g>

        {/* Observations to record */}
        <rect x="50" y="250" width="600" height="115" rx="8" className="fill-emerald-50 dark:fill-emerald-950/30" stroke="#16a34a" strokeWidth="1" />
        <text x="350" y="272" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Record Your Observations</text>
        <text x="70" y="295" fontSize="11" className="fill-gray-700 dark:fill-gray-300">\u2022 Part 1: How long before the books slipped? Did the slip feel sudden? (That\u2019s elastic rebound.)</text>
        <text x="70" y="315" fontSize="11" className="fill-gray-700 dark:fill-gray-300">\u2022 Part 2: How many folds formed? Are they all the same height? (Mountain ranges have varied peaks too.)</text>
        <text x="70" y="335" fontSize="11" className="fill-gray-700 dark:fill-gray-300">\u2022 Try with rough vs smooth books \u2014 rough surfaces grip longer and slip harder (bigger \u201cearthquake\u201d).</text>
        <text x="70" y="355" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">\u2022 India is still pushing into Eurasia at \u223c4 cm/year \u2014 the Himalayas grow \u223c5 mm taller each year.</text>

        <defs>
          <marker id="arr-shake" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f59e0b" />
          </marker>
          <marker id="arr-shake-g" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#6b7280" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
