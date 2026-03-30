export default function MapVectorRasterDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 368"
        className="w-full"
        role="img"
        aria-label="Vector versus raster: same river shown as a smooth line versus a pixel grid"
      >
        <rect width="500" height="330" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Vector vs. Raster Data
        </text>

        {/* Left panel: Vector */}
        <rect x="20" y="48" width="210" height="185" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
        <text x="125" y="68" textAnchor="middle" fontSize="12" fontWeight="700" fill="#60a5fa" fontFamily="sans-serif">
          Vector
        </text>

        {/* Vector river — smooth curves */}
        <path
          d="M40,100 Q70,95 90,110 Q110,130 130,125 Q155,118 175,135 Q195,155 210,150"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Control points */}
        {[
          [40, 100], [90, 110], [130, 125], [175, 135], [210, 150],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
        ))}

        {/* Vector building — precise polygon */}
        <polygon points="60,170 60,195 95,195 95,170" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="60" cy="170" r="2" fill="#fbbf24" />
        <circle cx="95" cy="170" r="2" fill="#fbbf24" />
        <circle cx="95" cy="195" r="2" fill="#fbbf24" />
        <circle cx="60" cy="195" r="2" fill="#fbbf24" />
        <text x="77" y="186" textAnchor="middle" fontSize="9" fill="#c4b5fd" fontFamily="sans-serif">building</text>

        {/* Vector point */}
        <circle cx="160" cy="180" r="4" fill="#ef4444" stroke="#fbbf24" strokeWidth="1" />
        <text x="160" y="175" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="sans-serif">school</text>

        {/* Pros/cons */}
        <text x="125" y="218" textAnchor="middle" fontSize="9" fill="#34d399" fontFamily="sans-serif">+ Sharp at any zoom</text>
        <text x="125" y="230" textAnchor="middle" fontSize="9" fill="#f87171" fontFamily="sans-serif">- Complex to render</text>

        {/* Right panel: Raster */}
        <rect x="270" y="48" width="210" height="185" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1" />
        <text x="375" y="68" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4ade80" fontFamily="sans-serif">
          Raster
        </text>

        {/* Pixel grid */}
        {(() => {
          const gx = 285;
          const gy = 78;
          const cellSize = 12;
          const gridCols = 15;
          const gridRows = 10;
          /* River path as pixel cells (approximate) */
          const riverCells = new Set([
            "0,2", "1,2", "1,3", "2,3", "3,4", "4,4", "5,3", "6,3",
            "7,3", "8,4", "9,4", "10,5", "11,5", "12,4", "13,4", "14,5",
          ]);
          /* Building as pixel cells */
          const buildingCells = new Set([
            "1,7", "1,8", "2,7", "2,8", "3,7", "3,8",
          ]);

          const cells = [];
          for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
              const key = `${c},${r}`;
              let color = "#1e293b";
              if (riverCells.has(key)) color = "#3b82f6";
              else if (buildingCells.has(key)) color = "#7c3aed";
              cells.push(
                <rect
                  key={key}
                  x={gx + c * cellSize}
                  y={gy + r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={color}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              );
            }
          }
          return cells;
        })()}

        {/* Zoom callout showing pixels */}
        <rect x="400" y="82" width="60" height="45" rx="2" className="fill-white dark:fill-slate-950" stroke="#64748b" strokeWidth="0.5" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect
              key={`zoom-${r}-${c}`}
              x={403 + c * 14}
              y={85 + r * 14}
              width="14"
              height="14"
              fill={c === 1 || (r === 1 && c === 2) ? "#3b82f6" : "#1e293b"}
              className="stroke-gray-300 dark:stroke-slate-600"
              strokeWidth="0.5"
            />
          ))
        )}
        <text x="430" y="138" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">zoomed in: pixels!</text>

        {/* Pros/cons */}
        <text x="375" y="218" textAnchor="middle" fontSize="9" fill="#34d399" fontFamily="sans-serif">+ Fast to display, good for imagery</text>
        <text x="375" y="230" textAnchor="middle" fontSize="9" fill="#f87171" fontFamily="sans-serif">- Gets blurry when zoomed in</text>

        {/* VS badge */}
        <circle cx="250" cy="140" r="16" fill="#f59e0b" />
        <text x="250" y="145" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-white dark:fill-slate-950" fontFamily="sans-serif">VS</text>

        {/* Comparison table */}
        <g>
          <rect x="60" y="248" width="380" height="50" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
          <line x1="250" y1="248" x2="250" y2="298" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
          <line x1="60" y1="265" x2="440" y2="265" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

          <text x="155" y="261" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa" fontFamily="sans-serif">Vector</text>
          <text x="345" y="261" textAnchor="middle" fontSize="9" fontWeight="600" fill="#4ade80" fontFamily="sans-serif">Raster</text>

          <text x="155" y="278" textAnchor="middle" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">Points, lines, polygons</text>
          <text x="345" y="278" textAnchor="middle" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">Grid of pixels (cells)</text>
          <text x="155" y="292" textAnchor="middle" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">Roads, boundaries, buildings</text>
          <text x="345" y="292" textAnchor="middle" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">Satellite photos, elevation</text>
        </g>

        {/* Bottom caption */}
        <text x="250" y="318" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Most GIS projects use both — vector for features, raster for imagery.
        </text>
      </svg>
    </div>
  );
}
