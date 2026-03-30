export default function LatLongGridDiagram() {
  const cx = 200;
  const cy = 200;
  const r = 170;

  return (
    <div className="my-4">
      <svg viewBox="0 0 420 435" className="w-full max-w-lg mx-auto" role="img" aria-label="Globe with latitude and longitude grid, Guwahati marked">
        {/* Globe background */}
        <circle cx={cx} cy={cy} r={r} className="fill-blue-100 dark:fill-blue-950" />
        <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Longitude lines (vertical ellipses) */}
        {[-60, -30, 30, 60].map(deg => {
          const xOffset = (deg / 90) * r;
          const rx = Math.abs(Math.cos((deg * Math.PI) / 180)) * 10 + 2;
          return (
            <ellipse key={`lon-${deg}`}
              cx={cx + xOffset} cy={cy} rx={rx} ry={r}
              fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
          );
        })}

        {/* Prime Meridian (0° longitude) — highlighted */}
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r}
          className="stroke-green-600 dark:stroke-green-400" strokeWidth="1.5" />
        <text x={cx + 5} y={cy - r + 15} className="fill-green-700 dark:fill-green-400" fontSize="10">0° (Prime Meridian)</text>

        {/* Latitude lines (horizontal) */}
        {[-60, -30, 30, 60].map(deg => {
          const yOffset = (deg / 90) * r;
          const lineR = Math.cos((deg * Math.PI) / 180) * r;
          return (
            <ellipse key={`lat-${deg}`}
              cx={cx} cy={cy - yOffset} rx={lineR} ry={lineR * 0.15}
              fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
          );
        })}

        {/* Equator (0° latitude) — highlighted */}
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.15}
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <text x={cx + r + 5} y={cy + 4} className="fill-red-600 dark:fill-red-400" fontSize="10">Equator (0°)</text>

        {/* Tropic of Cancer line (approx 23.5°N) */}
        {(() => {
          const latY = cy - (23.5 / 90) * r;
          const lineR = Math.cos((23.5 * Math.PI) / 180) * r;
          return (
            <ellipse cx={cx} cy={latY} rx={lineR} ry={lineR * 0.15}
              fill="none" className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="0.8" strokeDasharray="4,3" />
          );
        })()}

        {/* Guwahati point: 26.14°N, 91.74°E */}
        {/* On the globe projection, approximate position */}
        {(() => {
          const latFrac = 26.14 / 90;
          const lonFrac = 91.74 / 180;
          const gx = cx + lonFrac * r * 0.55;
          const gy = cy - latFrac * r;
          return (
            <g>
              <circle cx={gx} cy={gy} r="5" className="fill-red-500 dark:fill-red-400" opacity="0.9">
                <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={gx} cy={gy} r="2" className="fill-white" />
              <line x1={gx + 8} y1={gy} x2={gx + 40} y2={gy - 20}
                className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
              <rect x={gx + 40} y={gy - 38} width="110" height="30" rx="4"
                className="fill-white dark:fill-gray-700" stroke="#6b7280" strokeWidth="0.5" />
              <text x={gx + 95} y={gy - 24} textAnchor="middle"
                className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">Guwahati</text>
              <text x={gx + 95} y={gy - 13} textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400" fontSize="10">26.14°N, 91.74°E</text>
            </g>
          );
        })()}

        {/* Legend labels */}
        <text x="15" y="385" className="fill-red-600 dark:fill-red-400" fontSize="10">
          — Latitude (horizontal)
        </text>
        <text x="200" y="385" className="fill-green-600 dark:fill-green-400" fontSize="10">
          | Longitude (vertical)
        </text>

        {/* Axis labels */}
        <text x={cx} y={cy - r - 8} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">N</text>
        <text x={cx} y={cy + r + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">S</text>
        <text x={cx - r - 10} y={cy + 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">W</text>
        <text x={cx + r + 10} y={cy + 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">E</text>
      </svg>
    </div>
  );
}
