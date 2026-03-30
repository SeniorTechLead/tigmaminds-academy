export default function BeePathOptimizationDiagram() {
  const flowers = [
    { id: "A", x: 130, y: 100, color: "#ef4444" },
    { id: "B", x: 380, y: 90, color: "#3b82f6" },
    { id: "C", x: 440, y: 230, color: "#22c55e" },
    { id: "D", x: 260, y: 280, color: "#a855f7" },
    { id: "E", x: 90, y: 220, color: "#f59e0b" },
  ];

  // Optimal route: Hive → E → A → B → C → D → Hive
  const hive = { x: 260, y: 180 };
  const optimalRoute = ["E", "A", "B", "C", "D"];
  const naiveRoute = ["A", "B", "C", "D", "E"];

  const getFlower = (id: string) => flowers.find((f) => f.id === id)!;

  const buildPath = (route: string[]) => {
    const points = [hive, ...route.map((id) => getFlower(id)), hive];
    return points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  };

  // Calculate approximate total distances
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.round(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));

  const calcTotal = (route: string[]) => {
    const points = [hive, ...route.map((id) => getFlower(id)), hive];
    let total = 0;
    for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i]);
    return total;
  };

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee path optimization diagram showing traveling salesman problem with 5 flowers">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Path Optimization</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Bees solve the Traveling Salesman Problem naturally</text>

        {/* Naive path — faded */}
        <path d={buildPath(naiveRoute)} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.2" />

        {/* Optimal path — bright */}
        <path d={buildPath(optimalRoute)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.6" />

        {/* Animated bee on optimal path */}
        <circle r="5" fill="#eab308">
          <animateMotion dur="6s" repeatCount="indefinite" path={buildPath(optimalRoute)} />
        </circle>

        {/* Hive */}
        <g transform={`translate(${hive.x}, ${hive.y})`}>
          <polygon points="-15,-10 0,-22 15,-10 15,8 -15,8" fill="#a16207" opacity="0.5" stroke="#d97706" strokeWidth="1.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#d97706">Hive</text>
        </g>

        {/* Flowers */}
        {flowers.map((f) => (
          <g key={f.id}>
            {/* Flower */}
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={f.x + Math.cos((a * Math.PI) / 180) * 10}
                cy={f.y + Math.sin((a * Math.PI) / 180) * 10}
                rx="7" ry="4" fill={f.color} opacity="0.4"
                transform={`rotate(${a}, ${f.x + Math.cos((a * Math.PI) / 180) * 10}, ${f.y + Math.sin((a * Math.PI) / 180) * 10})`}
              />
            ))}
            <circle cx={f.x} cy={f.y} r="5" fill="#fbbf24" opacity="0.7" />
            <text x={f.x} y={f.y - 18} textAnchor="middle" fontSize="11" fontWeight="bold" fill={f.color}>{f.id}</text>
          </g>
        ))}

        {/* Legend — bottom */}
        <g transform="translate(260, 335)">
          {/* Naive route */}
          <line x1="-190" y1="0" x2="-155" y2="0" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" opacity="0.4" />
          <text x="-150" y="4" fontSize="9" fill="#ef4444">Naive order (A→B→C→D→E): ~{calcTotal(naiveRoute)} units</text>

          {/* Optimal route */}
          <line x1="-190" y1="20" x2="-155" y2="20" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.7" />
          <text x="-150" y="24" fontSize="9" fontWeight="bold" fill="#22c55e">Optimal (E→A→B→C→D): ~{calcTotal(optimalRoute)} units</text>

          <text x="0" y="48" textAnchor="middle" fontSize="9" fill="#fcd34d">
            Bees learn shortest route after just 3-4 trial runs
          </text>
        </g>

        {/* TSP complexity note */}
        <g transform="translate(260, 395)">
          <text x="0" y="0" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">
            TSP with n flowers = n!/2 possible routes &bull; 5 flowers = 60 routes &bull; 20 flowers = 1.2 quintillion
          </text>
        </g>
      </svg>
    </div>
  );
}
