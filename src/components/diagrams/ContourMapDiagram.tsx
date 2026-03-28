export default function ContourMapDiagram() {
  /* Centre of the hill and contour radii (closer at top = steeper) */
  const cx = 180;
  const cy = 160;

  const contours = [
    { rx: 150, ry: 120, elev: 100, steep: false },
    { rx: 120, ry: 95, elev: 200, steep: false },
    { rx: 85, ry: 68, elev: 300, steep: true },
    { rx: 52, ry: 42, elev: 400, steep: true },
    { rx: 24, ry: 19, elev: 500, steep: true },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox="0 0 400 350"
        className="w-full"
        role="img"
        aria-label="Topographic contour map of a hill with elevation labels from 100m to 500m"
      >
        {/* Background terrain tint */}
        <rect x="0" y="0" width="400" height="350" rx="6" className="fill-green-50 dark:fill-gray-800" />

        {/* Contour lines — outermost first */}
        {contours.map((c, i) => (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={c.rx}
              ry={c.ry}
              fill="none"
              className="stroke-amber-700 dark:stroke-amber-400"
              strokeWidth={1.4}
            />
            {/* Elevation label on right side of each contour */}
            <text
              x={cx + c.rx + 4}
              y={cy + 4}
              fontSize="11"
              fontWeight="600"
              className="fill-amber-800 dark:fill-amber-300"
              fontFamily="sans-serif"
            >
              {c.elev}m
            </text>
          </g>
        ))}

        {/* Peak marker */}
        <circle cx={cx} cy={cy} r="3" className="fill-amber-900 dark:fill-amber-200" />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          className="fill-amber-900 dark:fill-amber-200"
          fontFamily="sans-serif"
        >
          Summit
        </text>

        {/* Annotations — steep vs gentle */}
        {/* Arrow pointing to closely spaced lines (top of hill) */}
        <line
          x1={cx - 65}
          y1={cy - 75}
          x2={cx - 38}
          y2={cy - 50}
          className="stroke-red-600 dark:stroke-red-400"
          strokeWidth="1.2"
          markerEnd="url(#arrowRed)"
        />
        <text
          x={cx - 110}
          y={cy - 80}
          fontSize="10"
          fontWeight="600"
          className="fill-red-700 dark:fill-red-400"
          fontFamily="sans-serif"
        >
          Steep slope
        </text>
        <text
          x={cx - 115}
          y={cy - 68}
          fontSize="10"
          className="fill-red-600 dark:fill-red-400"
          fontFamily="sans-serif"
        >
          (lines close)
        </text>

        {/* Arrow pointing to widely spaced lines (base) */}
        <line
          x1={cx + 110}
          y1={cy + 95}
          x2={cx + 95}
          y2={cy + 75}
          className="stroke-blue-600 dark:stroke-blue-400"
          strokeWidth="1.2"
          markerEnd="url(#arrowBlue)"
        />
        <text
          x={cx + 90}
          y={cy + 112}
          fontSize="10"
          fontWeight="600"
          className="fill-blue-700 dark:fill-blue-400"
          fontFamily="sans-serif"
        >
          Gentle slope
        </text>
        <text
          x={cx + 88}
          y={cy + 124}
          fontSize="10"
          className="fill-blue-600 dark:fill-blue-400"
          fontFamily="sans-serif"
        >
          (lines far apart)
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-red-600 dark:stroke-red-400" strokeWidth="1" />
          </marker>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="1" />
          </marker>
        </defs>

        {/* Legend box */}
        <rect x="10" y="290" width="380" height="50" rx="6" className="fill-white/80 dark:fill-gray-700/80 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="20" y="310" fontSize="11" fontWeight="700" className="fill-gray-800 dark:fill-gray-200" fontFamily="sans-serif">
          Legend
        </text>
        <line x1="20" y1="322" x2="55" y2="322" className="stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.4" />
        <text x="60" y="326" fontSize="10" className="fill-gray-700 dark:fill-gray-300" fontFamily="sans-serif">
          Contour line (connects points of equal elevation)
        </text>
        <text x="20" y="338" fontSize="10" className="fill-gray-600 dark:fill-gray-400" fontFamily="sans-serif">
          Close lines = steep slope | Far apart = gentle slope
        </text>
      </svg>
    </div>
  );
}
