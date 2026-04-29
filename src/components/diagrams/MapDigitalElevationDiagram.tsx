export default function MapDigitalElevationDiagram() {
  /* Generate a grid of elevation values */
  const cols = 10;
  const rows = 8;
  const cellW = 38;
  const cellH = 24;
  const gridX = 60;
  const gridY = 55;

  /* Simulated elevation data — valley in center, mountains at edges */
  const elevations = [
    [1200, 1100, 900, 700, 500, 400, 500, 700, 900, 1000],
    [1300, 1000, 800, 550, 350, 300, 400, 600, 850, 950],
    [1100, 900, 650, 400, 200, 150, 250, 500, 750, 900],
    [1000, 800, 500, 300, 100, 80, 150, 350, 650, 850],
    [1050, 850, 550, 350, 120, 100, 180, 400, 700, 880],
    [1150, 950, 700, 450, 250, 200, 300, 550, 800, 950],
    [1250, 1050, 850, 600, 400, 350, 450, 650, 870, 980],
    [1350, 1150, 950, 750, 550, 500, 600, 780, 920, 1050],
  ];

  function elevColor(elev: number): string {
    if (elev < 150) return "#1e40af";   // water/lowest — deep blue
    if (elev < 300) return "#166534";   // low — dark green
    if (elev < 500) return "#22c55e";   // medium low — green
    if (elev < 700) return "#86efac";   // medium — light green
    if (elev < 900) return "#a16207";   // medium high — brown
    if (elev < 1100) return "#92400e";  // high — dark brown
    return "#f5f5f4";                   // highest — near white/snow
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 596 368"
        className="w-full"
        role="img"
        aria-label="Digital Elevation Model: a grid of height values colored from blue (low) through green and brown to white (high)"
      >
        <rect width="500" height="330" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Digital Elevation Model (DEM)
        </text>
        <text x="250" y="44" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Each cell stores one height measurement
        </text>

        {/* Grid of elevation cells */}
        {elevations.map((row, r) =>
          row.map((elev, c) => {
            const x = gridX + c * cellW;
            const y = gridY + r * cellH;
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellW}
                  height={cellH}
                  fill={elevColor(elev)}
                  stroke="#0f172a"
                  strokeWidth="0.5"
                />
                <text
                  x={x + cellW / 2}
                  y={y + cellH / 2 + 3}
                  textAnchor="middle"
                  fontSize="7"
                  fill={elev > 800 ? "#1e293b" : "#f8fafc"}
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  {elev}
                </text>
              </g>
            );
          })
        )}

        {/* Grid border */}
        <rect x={gridX} y={gridY} width={cols * cellW} height={rows * cellH} fill="none" stroke="#64748b" strokeWidth="1" />

        {/* Color legend on right */}
        {[
          { color: "#f5f5f4", label: "> 1100m (peaks)" },
          { color: "#92400e", label: "900-1100m" },
          { color: "#a16207", label: "700-900m" },
          { color: "#86efac", label: "500-700m" },
          { color: "#22c55e", label: "300-500m" },
          { color: "#166534", label: "150-300m" },
          { color: "#1e40af", label: "< 150m (valley)" },
        ].map((item, i) => (
          <g key={i}>
            <rect x="448" y={gridY + i * 22 + 15} width="14" height="14" rx="1" fill={item.color} stroke="#64748b" strokeWidth="0.3" />
            <text x="466" y={gridY + i * 22 + 26} fontSize="7" fill="#d1d5db" fontFamily="sans-serif">
              {item.label}
            </text>
          </g>
        ))}

        {/* Annotation: river in valley */}
        <line x1={gridX + 4 * cellW + cellW / 2} y1={gridY + rows * cellH + 5} x2={gridX + 4 * cellW + cellW / 2} y2={gridY + rows * cellH + 18} stroke="#3b82f6" strokeWidth="1" />
        <text x={gridX + 4.5 * cellW} y={gridY + rows * cellH + 28} textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">
          River valley (lowest values)
        </text>

        {/* Bottom caption */}
        <text x="250" y="300" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          A DEM stores elevation as a grid of numbers — each cell is one height measurement.
        </text>
        <text x="250" y="318" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Used for flood modeling, slope analysis, and 3D terrain visualization.
        </text>
      </svg>
    </div>
  );
}
