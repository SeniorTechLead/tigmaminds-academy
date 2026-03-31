export default function BanyanInventoryDiagram() {
  // Forest inventory plot with measured trees
  const trees = [
    { x: 130, y: 160, d: 45, h: 22, sp: "Banyan", size: 18, color: "fill-green-500" },
    { x: 220, y: 130, d: 30, h: 18, sp: "Teak", size: 14, color: "fill-green-600" },
    { x: 310, y: 180, d: 15, h: 10, sp: "Neem", size: 10, color: "fill-green-700" },
    { x: 180, y: 230, d: 60, h: 25, sp: "Banyan", size: 22, color: "fill-green-500" },
    { x: 350, y: 120, d: 20, h: 14, sp: "Sal", size: 11, color: "fill-green-600" },
    { x: 280, y: 250, d: 10, h: 6, sp: "Sapling", size: 7, color: "fill-green-700" },
    { x: 400, y: 200, d: 25, h: 16, sp: "Mango", size: 12, color: "fill-green-600" },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 550 466" className="w-full max-w-lg mx-auto" role="img" aria-label="Forest inventory plot showing quadrat sampling method with measured trees recording diameter, height, and species">
        <rect width="500" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Forest Inventory Plot</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Quadrat sampling: measuring every tree in a defined area</text>

        {/* Plot boundary (20m x 20m quadrat) */}
        <rect x="90" y="80" width="350" height="210" rx="2" className="stroke-amber-500" strokeWidth="2" fill="none" strokeDasharray="8,4" />
        <text x="265" y="75" textAnchor="middle" className="fill-amber-400" fontSize="9" fontWeight="bold">20 m × 20 m plot</text>

        {/* Grid lines (5m intervals) */}
        {[1, 2, 3].map(i => (
          <g key={`grid-${i}`}>
            <line x1={90 + i * 87.5} y1={80} x2={90 + i * 87.5} y2={290} className="stroke-slate-700" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1={90} y1={80 + i * 52.5} x2={440} y2={80 + i * 52.5} className="stroke-slate-700" strokeWidth="0.5" strokeDasharray="3,3" />
          </g>
        ))}

        {/* Trees */}
        {trees.map((tree, i) => (
          <g key={i}>
            {/* Canopy circle */}
            <circle cx={tree.x} cy={tree.y} r={tree.size} className={tree.color} opacity="0.6" />
            {/* Trunk point */}
            <circle cx={tree.x} cy={tree.y} r="3" className="fill-amber-700" />
            {/* Tag number */}
            <text x={tree.x} y={tree.y - tree.size - 3} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="7">#{i + 1}</text>
          </g>
        ))}

        {/* Measurement callout for tree #4 (large banyan) */}
        <line x1={202} y1={230} x2={460} y2={310} className="stroke-amber-400" strokeWidth="1" />
        <rect x="350" y="300" width="140" height="55" rx="6" className="fill-amber-900" opacity="0.7" />
        <text x="420" y="315" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Tree #4 (Banyan)</text>
        <text x="420" y="328" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">DBH: 60 cm</text>
        <text x="420" y="340" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Height: 25 m</text>
        <text x="420" y="352" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Crown: 12 m wide</text>

        {/* DBH measurement illustration */}
        <line x1="180" y1="218" x2="180" y2="242" className="stroke-amber-400" strokeWidth="1.5" />
        <text x="170" y="233" textAnchor="end" className="fill-amber-400" fontSize="7">DBH ↔</text>

        {/* Data table */}
        <rect x="20" y="305" width="310" height="105" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="175" y="320" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9" fontWeight="bold">Plot Data Summary</text>

        {/* Table header */}
        <text x="35" y="337" className="fill-gray-500 dark:fill-slate-400" fontSize="7" fontWeight="bold">#</text>
        <text x="55" y="337" className="fill-gray-500 dark:fill-slate-400" fontSize="7" fontWeight="bold">Species</text>
        <text x="120" y="337" className="fill-gray-500 dark:fill-slate-400" fontSize="7" fontWeight="bold">DBH</text>
        <text x="155" y="337" className="fill-gray-500 dark:fill-slate-400" fontSize="7" fontWeight="bold">Height</text>
        <text x="200" y="337" className="fill-gray-500 dark:fill-slate-400" fontSize="7" fontWeight="bold">BA</text>
        <line x1="30" y1="340" x2="240" y2="340" className="stroke-slate-700" strokeWidth="0.5" />

        {/* Table rows (abbreviated) */}
        {trees.slice(0, 4).map((tree, i) => (
          <g key={`row-${i}`}>
            <text x="35" y={353 + i * 12} className="fill-gray-600 dark:fill-slate-300" fontSize="7">{i + 1}</text>
            <text x="55" y={353 + i * 12} className="fill-green-300" fontSize="7">{tree.sp}</text>
            <text x="120" y={353 + i * 12} className="fill-gray-600 dark:fill-slate-300" fontSize="7">{tree.d} cm</text>
            <text x="155" y={353 + i * 12} className="fill-gray-600 dark:fill-slate-300" fontSize="7">{tree.h} m</text>
            <text x="200" y={353 + i * 12} className="fill-gray-600 dark:fill-slate-300" fontSize="7">{(Math.PI * (tree.d / 200) ** 2).toFixed(3)} m²</text>
          </g>
        ))}
        <text x="35" y={353 + 48} className="fill-gray-400 dark:fill-slate-500" fontSize="7">... 3 more trees</text>

        {/* Summary stats */}
        <text x="270" y="353" className="fill-amber-300" fontSize="7" fontWeight="bold">7 trees</text>
        <text x="270" y="366" className="fill-gray-600 dark:fill-slate-300" fontSize="7">Total BA: 0.54 m²</text>
        <text x="270" y="379" className="fill-gray-600 dark:fill-slate-300" fontSize="7">Per hectare: ~135 m²/ha</text>
        <text x="270" y="392" className="fill-gray-600 dark:fill-slate-300" fontSize="7">Density: ~1,750 trees/ha</text>

        {/* Bottom note */}
        <text x="250" y="416" textAnchor="middle" className="fill-green-300" fontSize="8">BA = Basal Area = π × (DBH/2)² — the cross-sectional area of the trunk</text>

        <defs>
          <marker id="invArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
