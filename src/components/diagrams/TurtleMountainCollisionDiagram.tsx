export default function TurtleMountainCollisionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Continental collision forming the Himalayas: Indian plate pushes into Eurasian plate, crust crumples and folds upward creating mountains"
      >
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Continental Collision: How Mountains Form
        </text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          India crashed into Eurasia ∼50 million years ago and is still pushing today
        </text>

        {/* Before collision */}
        <g transform="translate(50, 70)">
          <rect width="280" height="140" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <text x="140" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Before: 50 million years ago</text>

          {/* Ocean between */}
          <rect x="80" y="60" width="120" height="40" rx="4" fill="#3b82f6" opacity="0.2" />
          <text x="140" y="83" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">Tethys Ocean</text>

          {/* Indian plate */}
          <rect x="10" y="55" width="80" height="50" rx="4" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1" />
          <text x="50" y="83" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">India</text>
          <line x1="90" y1="80" x2="115" y2="80" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-mt-y)" />

          {/* Eurasian plate */}
          <rect x="190" y="55" width="80" height="50" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280" strokeWidth="1" />
          <text x="230" y="83" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Eurasia</text>

          <text x="140" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">India moving north at ∼15 cm/year</text>
        </g>

        {/* After collision */}
        <g transform="translate(370, 70)">
          <rect width="280" height="140" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1" />
          <text x="140" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">After: Today</text>

          {/* Crumpled zone = mountains */}
          <path
            d="M70,100 L90,50 L110,80 L130,35 L150,70 L170,40 L190,80 L210,100"
            fill="#f59e0b"
            opacity="0.3"
            stroke="#92400e"
            strokeWidth="1.5"
          />

          {/* Indian plate pushing */}
          <rect x="10" y="80" width="80" height="30" rx="4" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1" />
          <text x="50" y="99" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">India</text>
          <line x1="90" y1="95" x2="105" y2="95" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-mt-y)" />

          {/* Eurasian plate */}
          <rect x="190" y="80" width="80" height="30" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280" strokeWidth="1" />
          <text x="230" y="99" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Eurasia</text>

          {/* Himalayas label */}
          <text x="140" y="28" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-amber-800 dark:fill-amber-200">Himalayas</text>
          <text x="140" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Still growing ∼5 mm/year!</text>
        </g>

        {/* Boundary types */}
        <g transform="translate(50, 230)">
          <text x="300" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Three Types of Plate Boundaries</text>

          {/* Convergent */}
          <g transform="translate(0, 20)">
            <rect width="190" height="120" rx="6" className="fill-red-50 dark:fill-red-950/20" stroke="#ef4444" strokeWidth="1" />
            <text x="95" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">Convergent</text>
            <line x1="40" y1="60" x2="80" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arr-mt-r)" />
            <line x1="150" y1="60" x2="110" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arr-mt-r)" />
            <text x="95" y="85" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Plates push together</text>
            <text x="95" y="100" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">→ Mountains, volcanoes</text>
            <text x="95" y="115" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Himalayas, Andes</text>
          </g>

          {/* Divergent */}
          <g transform="translate(210, 20)">
            <rect width="190" height="120" rx="6" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
            <text x="95" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Divergent</text>
            <line x1="80" y1="60" x2="40" y2="60" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arr-mt-bl)" />
            <line x1="110" y1="60" x2="150" y2="60" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arr-mt-bl)" />
            <text x="95" y="85" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Plates pull apart</text>
            <text x="95" y="100" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">→ Rift valleys, new ocean floor</text>
            <text x="95" y="115" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Mid-Atlantic Ridge</text>
          </g>

          {/* Transform */}
          <g transform="translate(420, 20)">
            <rect width="190" height="120" rx="6" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1" />
            <text x="95" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">Transform</text>
            <line x1="40" y1="55" x2="95" y2="55" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-mt-y)" />
            <line x1="150" y1="65" x2="95" y2="65" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-mt-y2)" />
            <text x="95" y="85" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Plates slide past</text>
            <text x="95" y="100" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">→ Earthquakes</text>
            <text x="95" y="115" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">San Andreas Fault</text>
          </g>
        </g>

        <defs>
          <marker id="arr-mt-y" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f59e0b" />
          </marker>
          <marker id="arr-mt-y2" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
            <path d="M8,0 L0,4 L8,8" fill="#f59e0b" />
          </marker>
          <marker id="arr-mt-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#ef4444" />
          </marker>
          <marker id="arr-mt-bl" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
