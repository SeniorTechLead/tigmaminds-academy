export default function MapThematicDiagram() {
  /* Assam outline path reused for all three panels */
  const assamPath = "M5,30 Q15,10 40,8 Q65,5 80,15 Q95,22 105,32 Q110,40 107,52 Q102,62 85,66 Q65,70 50,68 Q30,65 15,55 Q3,45 5,30Z";

  const panels = [
    {
      label: "Population Density",
      fills: ["#fef3c7", "#f59e0b", "#92400e"],
      legend: ["Low", "Medium", "High"],
      legendColors: ["#fef3c7", "#f59e0b", "#92400e"],
    },
    {
      label: "Annual Rainfall",
      fills: ["#bfdbfe", "#3b82f6", "#1e3a8a"],
      legend: ["800mm", "1500mm", "2500mm"],
      legendColors: ["#bfdbfe", "#3b82f6", "#1e3a8a"],
    },
    {
      label: "Forest Cover",
      fills: ["#d9f99d", "#22c55e", "#14532d"],
      legend: ["Sparse", "Moderate", "Dense"],
      legendColors: ["#d9f99d", "#22c55e", "#14532d"],
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 525 346"
        className="w-full"
        role="img"
        aria-label="Thematic maps: same Assam outline showing population density, rainfall, and forest cover"
      >
        <rect width="500" height="310" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Thematic Maps
        </text>
        <text x="250" y="44" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Same region, different stories
        </text>

        {panels.map((panel, i) => {
          const offsetX = 20 + i * 160;
          const offsetY = 60;
          return (
            <g key={i}>
              {/* Panel background */}
              <rect x={offsetX} y={offsetY} width="145" height="170" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

              {/* Panel title */}
              <text x={offsetX + 72} y={offsetY + 18} textAnchor="middle" fontSize="9" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
                {panel.label}
              </text>

              {/* Assam outline with gradient fill */}
              <g transform={`translate(${offsetX + 18}, ${offsetY + 25}) scale(1.1)`}>
                {/* Base fill */}
                <path d={assamPath} fill={panel.fills[0]} stroke="#64748b" strokeWidth="0.8" />
                {/* Regional variation patches */}
                <ellipse cx="70" cy="30" rx="25" ry="18" fill={panel.fills[2]} opacity="0.7" />
                <ellipse cx="35" cy="40" rx="20" ry="15" fill={panel.fills[1]} opacity="0.6" />
                <ellipse cx="55" cy="55" rx="18" ry="10" fill={panel.fills[1]} opacity="0.5" />
                {/* Brahmaputra line */}
                <path d="M10,38 Q40,32 70,35 Q95,38 105,33" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
              </g>

              {/* Legend */}
              {panel.legend.map((leg, j) => (
                <g key={j}>
                  <rect x={offsetX + 15} y={offsetY + 118 + j * 15} width="10" height="10" rx="1" fill={panel.legendColors[j]} />
                  <text x={offsetX + 30} y={offsetY + 127 + j * 15} fontSize="8" fill="#d1d5db" fontFamily="sans-serif">
                    {leg}
                  </text>
                </g>
              ))}
            </g>
          );
        })}

        {/* Connecting note */}
        <text x="250" y="255" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="sans-serif" fontWeight="600">
          One outline + different datasets = different maps
        </text>

        {/* Bottom caption */}
        <text x="250" y="278" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Thematic maps show specific topics — not just where things are, but how much.
        </text>
        <text x="250" y="296" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Choropleth maps use color gradients to show quantity by region.
        </text>
      </svg>
    </div>
  );
}
