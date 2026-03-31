export default function PostmanShortestPathDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Dijkstra's algorithm finding shortest path through a graph: explores outward from start, updating distances at each node"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Shortest Path: Dijkstra\u2019s Algorithm
        </text>

        {/* Graph with nodes */}
        <g transform="translate(50, 55)">
          {/* Edges first (behind nodes) */}
          {[
            { x1: 80, y1: 60, x2: 220, y2: 40, w: 3, highlight: true },
            { x1: 80, y1: 60, x2: 180, y2: 160, w: 5, highlight: false },
            { x1: 220, y1: 40, x2: 380, y2: 60, w: 4, highlight: true },
            { x1: 220, y1: 40, x2: 300, y2: 160, w: 6, highlight: false },
            { x1: 180, y1: 160, x2: 300, y2: 160, w: 2, highlight: false },
            { x1: 300, y1: 160, x2: 380, y2: 60, w: 3, highlight: false },
            { x1: 380, y1: 60, x2: 500, y2: 120, w: 2, highlight: true },
            { x1: 300, y1: 160, x2: 500, y2: 120, w: 5, highlight: false },
          ].map((e, i) => (
            <g key={i}>
              <line
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={e.highlight ? "#3b82f6" : "#d1d5db"}
                strokeWidth={e.highlight ? 3 : 1.5}
                className={e.highlight ? "" : "dark:stroke-gray-600"}
              />
              <circle
                cx={(e.x1 + e.x2) / 2}
                cy={(e.y1 + e.y2) / 2}
                r="10"
                className="fill-white dark:fill-slate-950"
              />
              <text
                x={(e.x1 + e.x2) / 2}
                y={(e.y1 + e.y2) / 2 + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                className="fill-gray-600 dark:fill-gray-400"
              >
                {e.w}
              </text>
            </g>
          ))}

          {/* Nodes */}
          {[
            { x: 80, y: 60, label: 'S', dist: '0', color: '#22c55e' },
            { x: 220, y: 40, label: 'A', dist: '3', color: '#3b82f6' },
            { x: 180, y: 160, label: 'B', dist: '5', color: '#9ca3af' },
            { x: 300, y: 160, label: 'C', dist: '7', color: '#9ca3af' },
            { x: 380, y: 60, label: 'D', dist: '7', color: '#3b82f6' },
            { x: 500, y: 120, label: 'E', dist: '9', color: '#ef4444' },
          ].map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="22" fill={n.color} opacity="0.2" stroke={n.color} strokeWidth="2" />
              <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="14" fontWeight="700" fill={n.color}>{n.label}</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize="10" fontWeight="600" fill={n.color}>d={n.dist}</text>
            </g>
          ))}

          {/* Path highlight label */}
          <text x="290" y="230" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
            Shortest path: S \u2192 A \u2192 D \u2192 E (total: 9)
          </text>
        </g>

        {/* Algorithm steps */}
        <g transform="translate(50, 310)">
          <rect width="600" height="100" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <text x="300" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">How Dijkstra Works</text>

          {[
            { step: 1, text: 'Start at S (distance 0). Mark all others as \u221e.' },
            { step: 2, text: 'Visit nearest unvisited node. Update neighbors if shorter path found.' },
            { step: 3, text: 'Repeat until destination reached. Guaranteed optimal!' },
          ].map((s, i) => (
            <g key={i} transform={`translate(20, ${36 + i * 20})`}>
              <circle cx="8" cy="0" r="8" className="fill-blue-500 dark:fill-blue-400" />
              <text x="8" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{s.step}</text>
              <text x="25" y="4" fontSize="11" className="fill-gray-700 dark:fill-gray-300">{s.text}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
