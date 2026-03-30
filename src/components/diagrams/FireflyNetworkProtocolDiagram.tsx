export default function FireflyNetworkProtocolDiagram() {
  const w = 520, h = 400;

  // Node positions for a mesh network
  const nodes = [
    { x: 130, y: 130 }, { x: 260, y: 90 }, { x: 380, y: 120 },
    { x: 100, y: 230 }, { x: 220, y: 210 }, { x: 340, y: 230 },
    { x: 440, y: 210 }, { x: 160, y: 310 }, { x: 300, y: 300 },
    { x: 410, y: 310 },
  ];

  // Connections between nodes (neighbor links)
  const edges = [
    [0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6],
    [3, 4], [4, 5], [5, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9],
    [6, 9], [7, 8], [8, 9],
  ];

  // Phase values (some synced, some still adjusting)
  const phases = [0.8, 0.82, 0.85, 0.75, 0.8, 0.83, 0.87, 0.72, 0.78, 0.84];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Firefly-inspired network synchronization: wireless mesh nodes adjusting timing based on neighbors">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Firefly Algorithm: Network Sync</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Same Kuramoto model, applied to wireless sensor networks</text>

        {/* Network edges */}
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            className="stroke-gray-300 dark:stroke-slate-600"
            strokeWidth="0.8"
            opacity="0.5"
          />
        ))}

        {/* Sync pulse waves on some edges */}
        {[[0, 1], [1, 5], [4, 5], [5, 6]].map(([a, b], i) => {
          const mx = (nodes[a].x + nodes[b].x) / 2;
          const my = (nodes[a].y + nodes[b].y) / 2;
          return (
            <circle key={`pulse${i}`} cx={mx} cy={my} r="4" fill="#4ade80" opacity="0.4" />
          );
        })}

        {/* Network nodes */}
        {nodes.map((node, i) => {
          const syncLevel = Math.abs(phases[i] - 0.82); // How close to consensus
          const isSynced = syncLevel < 0.03;
          const color = isSynced ? '#4ade80' : '#f59e0b';
          return (
            <g key={i}>
              {/* Wireless range indicator */}
              <circle cx={node.x} cy={node.y} r="35" fill={color} opacity="0.03" />

              {/* Node body */}
              <circle cx={node.x} cy={node.y} r="14" className="fill-gray-100 dark:fill-slate-800" stroke={color} strokeWidth="1.5" />

              {/* Antenna symbol */}
              <line x1={node.x} y1={node.y - 14} x2={node.x} y2={node.y - 20} stroke={color} strokeWidth="1" />
              <circle cx={node.x} cy={node.y - 22} r="2" fill={color} opacity="0.6" />

              {/* Phase clock hand */}
              <line
                x1={node.x}
                y1={node.y}
                x2={node.x + Math.cos(phases[i] * 2 * Math.PI) * 9}
                y2={node.y + Math.sin(phases[i] * 2 * Math.PI) * 9}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Node label */}
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill={color} fontSize="7" fontWeight="600">N{i}</text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x="20" y="60" width="90" height="55" rx="5" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <circle cx="35" cy="75" r="5" className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1.5" />
        <text x="48" y="79" fill="#4ade80" fontSize="8">Synced</text>
        <circle cx="35" cy="95" r="5" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="48" y="99" fill="#f59e0b" fontSize="8">Adjusting</text>

        {/* Comparison box */}
        <rect x="30" y="345" width="220" height="45" rx="6" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1" />
        <text x="140" y="362" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="600">Firefly (Biology)</text>
        <text x="140" y="378" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Flash phase → neighbor adjusts</text>

        <text x="262" y="370" fill="#f59e0b" fontSize="14" fontWeight="700">=</text>

        <rect x="280" y="345" width="220" height="45" rx="6" className="fill-white dark:fill-slate-950" stroke="#60a5fa" strokeWidth="1" />
        <text x="390" y="362" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">Sensor Network (Tech)</text>
        <text x="390" y="378" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Broadcast timing → neighbor adjusts</text>
      </svg>
    </div>
  );
}
