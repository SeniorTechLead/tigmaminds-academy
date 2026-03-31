export default function BambooMeristemDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bamboo intercalary growth: meristems at every node grow simultaneously, like building every floor at once"
      >
        <rect width="700" height="500" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Meristems: 60 Growth Engines in Parallel
        </text>

        {/* Bamboo culm cross-section */}
        <rect x="40" y="60" width="280" height="400" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="180" y="82" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Bamboo Culm</text>

        {/* Segments with nodes */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 100 + i * 55;
          return (
            <g key={i}>
              {/* Internode (segment) */}
              <rect x="140" y={y} width="80" height={i < 5 ? 42 : 0} rx="3" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="1" />
              {i < 5 && <text x="180" y={y + 25} textAnchor="middle" fontSize="9" className="fill-emerald-700 dark:fill-emerald-300">Internode</text>}
              {/* Node (growth zone) */}
              <rect x="130" y={y + 42} width="100" height="10" rx="2" fill="#f59e0b" opacity="0.5" stroke="#d97706" strokeWidth="1" />
              {/* Growth arrows */}
              <path d={`M 120 ${y + 47} L 120 ${y + 30}`} fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-bm)" />
              <path d={`M 240 ${y + 47} L 240 ${y + 30}`} fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-bm)" />
            </g>
          );
        })}

        {/* Node labels */}
        <text x="70" y="152" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Node</text>
        <text x="70" y="165" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">(meristem)</text>
        <line x1="95" y1="150" x2="130" y2="147" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1" />

        <text x="275" y="132" textAnchor="end" fontSize="9" className="fill-red-500 dark:fill-red-400">\u2191 Growth</text>

        <defs>
          <marker id="arrow-red-bm" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="#ef4444" />
          </marker>
        </defs>

        {/* Right panel: comparison */}
        <rect x="360" y="60" width="310" height="180" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="515" y="82" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Skyscraper Analogy</text>

        {/* Normal tree = one floor at a time */}
        <g transform="translate(400, 100)">
          <rect x="0" y="90" width="50" height="20" rx="2" className="fill-blue-200 dark:fill-blue-800" stroke="#3b82f6" strokeWidth="1" />
          <rect x="0" y="110" width="50" height="20" rx="2" className="fill-gray-200 dark:fill-gray-700" stroke="#9ca3af" strokeWidth="1" />
          <rect x="0" y="70" width="50" height="20" rx="2" fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
          <text x="25" y="105" textAnchor="middle" fontSize="8" className="fill-blue-700 dark:fill-blue-300">Active</text>
          <text x="25" y="125" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Done</text>
          <text x="25" y="85" textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">Waiting</text>
          <text x="25" y="155" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">Normal tree</text>
          <text x="25" y="168" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">1 floor at a time</text>
        </g>

        {/* Bamboo = all floors at once */}
        <g transform="translate(520, 100)">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="0" y={50 + i * 20} width="50" height="20" rx="2" className="fill-emerald-200 dark:fill-emerald-800" stroke="#10b981" strokeWidth="1" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <text key={i} x="25" y={65 + i * 20} textAnchor="middle" fontSize="8" className="fill-emerald-700 dark:fill-emerald-300">Active</text>
          ))}
          <text x="25" y="155" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">Bamboo</text>
          <text x="25" y="168" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">ALL floors at once!</text>
        </g>

        {/* Cell elongation process */}
        <rect x="360" y="260" width="310" height="200" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="515" y="282" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">How Cells Elongate</text>

        {/* Cell stages */}
        {[
          { x: 390, w: 30, h: 30, label: 'Small cell', color: 'fill-emerald-300 dark:fill-emerald-700' },
          { x: 450, w: 30, h: 55, label: 'Auxin loosens\ncell wall', color: 'fill-emerald-200 dark:fill-emerald-600' },
          { x: 520, w: 30, h: 80, label: 'Water rushes in\n(turgor pressure)', color: 'fill-emerald-100 dark:fill-emerald-500/40' },
          { x: 590, w: 30, h: 100, label: 'Wall re-stiffens\nwith cellulose', color: 'fill-emerald-200 dark:fill-emerald-700' },
        ].map(({ x, w, h, label, color }, i) => (
          <g key={i}>
            <rect x={x} y={380 - h} width={w} height={h} rx="3" className={color} stroke="#10b981" strokeWidth="1" />
            {label.split('\n').map((line, li) => (
              <text key={li} x={x + 15} y={395 + li * 12} textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-slate-400">{line}</text>
            ))}
            {i < 3 && <text x={x + 40} y={345} fontSize="14" className="fill-emerald-500 dark:fill-emerald-400">\u2192</text>}
          </g>
        ))}

        <text x="515" y="440" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Entire cycle: under 24 hours per cell
        </text>

        {/* Bottom fact */}
        <rect x="60" y="468" width="580" height="24" rx="6" className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-200 dark:stroke-emerald-800" strokeWidth="1" />
        <text x="350" y="484" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
          60 nodes \u00d7 parallel growth = up to 91 cm/day
        </text>
      </svg>
    </div>
  );
}
