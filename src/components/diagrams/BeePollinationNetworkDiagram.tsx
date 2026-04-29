export default function BeePollinationNetworkDiagram() {
  const bees = [
    { id: "Apis mellifera", x: 60, y: 90, short: "Honey bee" },
    { id: "Bombus", x: 60, y: 160, short: "Bumblebee" },
    { id: "Apis cerana", x: 60, y: 230, short: "Asian bee" },
    { id: "Megachile", x: 60, y: 300, short: "Leafcutter" },
  ];

  const plants = [
    { id: "Apple", x: 460, y: 70 },
    { id: "Mustard", x: 460, y: 130 },
    { id: "Sunflower", x: 460, y: 190 },
    { id: "Lavender", x: 460, y: 250 },
    { id: "Clover", x: 460, y: 310 },
  ];

  // Connections: [bee_index, plant_index, strength]
  const links: [number, number, number][] = [
    [0, 0, 3], [0, 1, 2], [0, 2, 3], [0, 3, 1], [0, 4, 2],
    [1, 2, 2], [1, 3, 3], [1, 4, 3],
    [2, 1, 3], [2, 2, 2], [2, 3, 1],
    [3, 0, 1], [3, 3, 2], [3, 4, 1],
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 590 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bipartite pollination network showing which bees visit which flowers">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Pollination Network</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Bipartite graph: bee species ↔ plant species</text>

        {/* Column headers */}
        <text x="60" y="68" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#eab308">Bee Species</text>
        <text x="460" y="48" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">Plant Species</text>

        {/* Links */}
        {links.map(([bi, pi, strength], idx) => {
          const bee = bees[bi];
          const plant = plants[pi];
          return (
            <line
              key={idx}
              x1={bee.x + 55}
              y1={bee.y}
              x2={plant.x - 45}
              y2={plant.y}
              stroke="#f59e0b"
              strokeWidth={strength}
              opacity={0.15 + strength * 0.08}
            />
          );
        })}

        {/* Bee nodes */}
        {bees.map((bee, i) => (
          <g key={bee.id}>
            <rect x={bee.x - 50} y={bee.y - 16} width="110" height="32" rx="6" fill="#eab308" opacity="0.1" stroke="#eab308" strokeWidth="1" />
            {/* Mini bee */}
            <ellipse cx={bee.x - 30} cy={bee.y} rx="8" ry="5" fill="#eab308" opacity="0.6" />
            <line x1={bee.x - 34} y1={bee.y} x2={bee.x - 26} y2={bee.y} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
            <text x={bee.x - 5} y={bee.y - 3} fontSize="8" fontWeight="bold" fill="#eab308">{bee.short}</text>
            <text x={bee.x - 5} y={bee.y + 8} fontSize="6" className="fill-gray-500 dark:fill-slate-400" fontStyle="italic">{bee.id}</text>
          </g>
        ))}

        {/* Plant nodes */}
        {plants.map((plant) => (
          <g key={plant.id}>
            <rect x={plant.x - 40} y={plant.y - 14} width="80" height="28" rx="6" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="1" />
            {/* Mini flower */}
            {[0, 90, 180, 270].map((a) => (
              <ellipse
                key={a}
                cx={plant.x - 22 + Math.cos((a * Math.PI) / 180) * 5}
                cy={plant.y + Math.sin((a * Math.PI) / 180) * 5}
                rx="4" ry="2" fill="#22c55e" opacity="0.5"
                transform={`rotate(${a}, ${plant.x - 22 + Math.cos((a * Math.PI) / 180) * 5}, ${plant.y + Math.sin((a * Math.PI) / 180) * 5})`}
              />
            ))}
            <circle cx={plant.x - 22} cy={plant.y} r="2.5" fill="#fbbf24" />
            <text x={plant.x + 5} y={plant.y + 4} fontSize="9" fontWeight="bold" fill="#22c55e">{plant.id}</text>
          </g>
        ))}

        {/* Network metrics — bottom */}
        <g transform="translate(260, 360)">
          <rect x="-220" y="-18" width="440" height="36" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />

          {[
            { label: "Connectance", value: "70%", desc: "links / possible" },
            { label: "Generalist", value: "Honey bee", desc: "visits 5 plants" },
            { label: "Specialist", value: "Leafcutter", desc: "visits 3 plants" },
            { label: "Keystone plant", value: "Lavender", desc: "4 bee visitors" },
          ].map((m, i) => (
            <g key={i}>
              <text x={-175 + i * 115} y="-3" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{m.label}</text>
              <text x={-175 + i * 115} y="8" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fbbf24">{m.value}</text>
              <text x={-175 + i * 115} y="17" textAnchor="middle" fontSize="6" className="fill-gray-400 dark:fill-slate-500">{m.desc}</text>
            </g>
          ))}
        </g>

        {/* Strength legend */}
        <g transform="translate(260, 55)">
          <text x="-50" y="0" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Link thickness = visit frequency:</text>
          <line x1="40" y1="-2" x2="55" y2="-2" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
          <text x="60" y="0" fontSize="7" className="fill-gray-500 dark:fill-slate-400">low</text>
          <line x1="80" y1="-2" x2="95" y2="-2" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
          <text x="100" y="0" fontSize="7" className="fill-gray-500 dark:fill-slate-400">high</text>
        </g>
      </svg>
    </div>
  );
}
