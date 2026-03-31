export default function PostmanTSPDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Travelling Salesman Problem: visiting all villages exactly once with the shortest total distance, showing why brute force is impossible for many nodes"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          The Travelling Salesman Problem (TSP)
        </text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Visit every village exactly once and return home \u2014 what\u2019s the shortest route?
        </text>

        {/* Small example: 4 villages */}
        <g transform="translate(50, 70)">
          <rect width="200" height="200" rx="8" className="fill-green-50 dark:fill-green-950/20" stroke="#16a34a" strokeWidth="1" />
          <text x="100" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-700 dark:fill-green-300">4 villages</text>

          {/* All possible edges (faint) */}
          {[
            [50, 60, 150, 60],
            [50, 60, 50, 160],
            [50, 60, 150, 160],
            [150, 60, 50, 160],
            [150, 60, 150, 160],
            [50, 160, 150, 160],
          ].map((e, i) => (
            <line key={i} x1={e[0]} y1={e[1]} x2={e[2]} y2={e[3]} stroke="#d1d5db" strokeWidth="1" className="dark:stroke-gray-700" />
          ))}

          {/* Optimal route highlighted */}
          <path d="M50,60 L150,60 L150,160 L50,160 Z" fill="none" stroke="#16a34a" strokeWidth="2.5" />

          {/* Nodes */}
          {[
            [50, 60], [150, 60], [50, 160], [150, 160],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="10" className="fill-green-500 dark:fill-green-400" />
          ))}

          <text x="100" y="190" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">3 possible routes</text>
          <text x="100" y="198" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(easy to check all)</text>
        </g>

        {/* Medium example: 10 villages */}
        <g transform="translate(280, 70)">
          <rect width="200" height="200" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1" />
          <text x="100" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">10 villages</text>

          {/* Scattered nodes */}
          {[
            [30, 50], [80, 40], [150, 55], [170, 100],
            [140, 150], [90, 170], [35, 140], [50, 90],
            [120, 100], [160, 40],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" className="fill-amber-500 dark:fill-amber-400" />
            </g>
          ))}

          {/* Some connecting lines */}
          <path d="M30,50 L80,40 L150,55 L170,100 L140,150 L90,170 L35,140 L50,90 L120,100 L160,40" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />

          <text x="100" y="195" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">181,440 routes</text>
        </g>

        {/* Large example: 20 villages */}
        <g transform="translate(510, 70)">
          <rect width="160" height="200" rx="8" className="fill-red-50 dark:fill-red-950/20" stroke="#ef4444" strokeWidth="1" />
          <text x="80" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">20 villages</text>

          {/* Many dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={20 + (i % 5) * 28}
              cy={45 + Math.floor(i / 5) * 32}
              r="5"
              className="fill-red-500 dark:fill-red-400"
              opacity="0.7"
            />
          ))}

          <text x="80" y="185" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-red-700 dark:fill-red-300">
            60,822,550,204,
          </text>
          <text x="80" y="198" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-red-700 dark:fill-red-300">
            416,000 routes!
          </text>
        </g>

        {/* Why heuristics are needed */}
        <g transform="translate(50, 290)">
          <rect width="600" height="120" rx="8" className="fill-indigo-50 dark:fill-indigo-950/20" stroke="#6366f1" strokeWidth="1" />
          <text x="300" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">Why Optimization Matters</text>

          <g transform="translate(20, 40)">
            <rect width="170" height="60" rx="6" className="fill-blue-100 dark:fill-blue-900/30" />
            <text x="85" y="18" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">Nearest Neighbor</text>
            <text x="85" y="34" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Always go to closest</text>
            <text x="85" y="48" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">unvisited village next</text>
          </g>

          <g transform="translate(215, 40)">
            <rect width="170" height="60" rx="6" className="fill-purple-100 dark:fill-purple-900/30" />
            <text x="85" y="18" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">2-opt Swap</text>
            <text x="85" y="34" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Try swapping pairs of</text>
            <text x="85" y="48" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">edges to improve route</text>
          </g>

          <g transform="translate(410, 40)">
            <rect width="170" height="60" rx="6" className="fill-emerald-100 dark:fill-emerald-900/30" />
            <text x="85" y="18" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Real World</text>
            <text x="85" y="34" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Amazon, FedEx, GPS all</text>
            <text x="85" y="48" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">use heuristic algorithms</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
