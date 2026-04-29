export default function MapNetworkDiagram() {
  /* Road network nodes (intersections) */
  const nodes: Record<string, { x: number; y: number; label: string }> = {
    A: { x: 50, y: 180, label: "A (Start)" },
    B: { x: 140, y: 90, label: "B" },
    C: { x: 140, y: 220, label: "C" },
    D: { x: 250, y: 140, label: "D" },
    E: { x: 250, y: 250, label: "E" },
    F: { x: 360, y: 90, label: "F" },
    G: { x: 360, y: 200, label: "G" },
    H: { x: 450, y: 150, label: "H (End)" },
  };

  /* All edges with weights (distances) */
  const edges = [
    { from: "A", to: "B", w: 5, shortest: true },
    { from: "A", to: "C", w: 4, shortest: false },
    { from: "B", to: "D", w: 3, shortest: true },
    { from: "C", to: "D", w: 6, shortest: false },
    { from: "C", to: "E", w: 3, shortest: false },
    { from: "D", to: "F", w: 4, shortest: true },
    { from: "D", to: "G", w: 5, shortest: false },
    { from: "E", to: "G", w: 4, shortest: false },
    { from: "F", to: "H", w: 3, shortest: true },
    { from: "G", to: "H", w: 4, shortest: false },
    { from: "B", to: "F", w: 7, shortest: false },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 525 368"
        className="w-full"
        role="img"
        aria-label="Network analysis: road network with intersections as nodes and shortest path from A to H highlighted"
      >
        <rect width="500" height="330" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Network Analysis
        </text>
        <text x="250" y="44" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Find the shortest or fastest route
        </text>

        {/* Draw edges */}
        {edges.map((edge, i) => {
          const n1 = nodes[edge.from];
          const n2 = nodes[edge.to];
          const mx = (n1.x + n2.x) / 2;
          const my = (n1.y + n2.y) / 2;
          return (
            <g key={i}>
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke={edge.shortest ? "#f59e0b" : "#475569"}
                strokeWidth={edge.shortest ? 3 : 1.5}
                strokeLinecap="round"
              />
              {/* Weight label */}
              <rect x={mx - 8} y={my - 7} width="16" height="12" rx="2" className="fill-white dark:fill-slate-950" opacity="0.8" />
              <text
                x={mx}
                y={my + 3}
                textAnchor="middle"
                fontSize="8"
                fill={edge.shortest ? "#fbbf24" : "#94a3b8"}
                fontFamily="monospace"
                fontWeight={edge.shortest ? "700" : "400"}
              >
                {edge.w}
              </text>
            </g>
          );
        })}

        {/* Draw nodes */}
        {Object.entries(nodes).map(([key, node]) => {
          const isEndpoint = key === "A" || key === "H";
          const isOnPath = ["A", "B", "D", "F", "H"].includes(key);
          return (
            <g key={key}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isEndpoint ? 10 : 7}
                fill={isEndpoint ? "#f59e0b" : isOnPath ? "#92400e" : "#334155"}
                stroke={isOnPath ? "#fbbf24" : "#64748b"}
                strokeWidth={isOnPath ? 2 : 1}
              />
              <text
                x={node.x}
                y={node.y + 3}
                textAnchor="middle"
                fontSize={isEndpoint ? 9 : 8}
                fontWeight="700"
                fill={isOnPath ? "#0f172a" : "#d1d5db"}
                fontFamily="sans-serif"
              >
                {key}
              </text>
              {/* Label for endpoints */}
              {key === "A" && (
                <text x={node.x - 15} y={node.y + 22} textAnchor="middle" fontSize="8" fill="#34d399" fontFamily="sans-serif" fontWeight="600">
                  Start
                </text>
              )}
              {key === "H" && (
                <text x={node.x + 15} y={node.y + 22} textAnchor="middle" fontSize="8" fill="#ef4444" fontFamily="sans-serif" fontWeight="600">
                  End
                </text>
              )}
            </g>
          );
        })}

        {/* Shortest path summary */}
        <rect x="100" y="272" width="300" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="0.8" />
        <text x="250" y="286" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="sans-serif" fontWeight="600">
          {"Shortest: A → B → D → F → H = 5 + 3 + 4 + 3 = 15 km"}
        </text>
        <text x="250" y="296" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          (Dijkstra's algorithm finds this automatically)
        </text>

        {/* Bottom caption */}
        <text x="250" y="318" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Find the fastest route from A to B — the basis of every navigation app.
        </text>
      </svg>
    </div>
  );
}
