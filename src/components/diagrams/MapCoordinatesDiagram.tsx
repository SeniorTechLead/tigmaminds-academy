export default function MapCoordinatesDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 535 370"
        className="w-full"
        role="img"
        aria-label="Latitude and longitude on a globe, with Guwahati marked at 26 degrees north, 91 degrees east"
      >
        {/* Background */}
        <rect width="500" height="340" rx="8" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Latitude &amp; Longitude
        </text>

        {/* Globe */}
        <circle cx="170" cy="170" r="120" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />

        {/* Longitude lines (vertical arcs) */}
        {[-60, -30, 0, 30, 60].map((angle) => (
          <ellipse
            key={`lon-${angle}`}
            cx={170 + angle * 1.2}
            cy={170}
            rx={Math.max(4, Math.abs(Math.cos((angle * Math.PI) / 180) * 60))}
            ry={115}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}

        {/* Latitude lines (horizontal) */}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const y = 170 - lat * 1.8;
          const halfW = Math.sqrt(Math.max(0, 120 * 120 - (lat * 1.8) * (lat * 1.8)));
          return (
            <line
              key={`lat-${lat}`}
              x1={170 - halfW}
              y1={y}
              x2={170 + halfW}
              y2={y}
              stroke="#f59e0b"
              strokeWidth={lat === 0 ? 1.5 : 0.6}
              opacity={lat === 0 ? 0.9 : 0.5}
            />
          );
        })}

        {/* Equator label */}
        <text x={170 + 125} y={174} fontSize="11" fill="#fbbf24" fontFamily="sans-serif">
          Equator 0°
        </text>

        {/* Tropic of Cancer line + label */}
        <line x1={170 - 108} y1={170 - 23.5 * 1.8} x2={170 + 108} y2={170 - 23.5 * 1.8} stroke="#fb923c" strokeWidth="1" strokeDasharray="4 2" />
        <text x={170 + 115} y={170 - 23.5 * 1.8 + 4} fontSize="10" fill="#fb923c" fontFamily="sans-serif">
          23.5°N
        </text>
        <text x={170 + 115} y={170 - 23.5 * 1.8 + 15} fontSize="9" fill="#fb923c" fontFamily="sans-serif">
          Tropic of Cancer
        </text>

        {/* Guwahati dot at ~26°N */}
        <circle cx={170 + 40} cy={170 - 26 * 1.8} r="5" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
        <line x1={170 + 47} y1={170 - 26 * 1.8} x2={170 + 70} y2={170 - 26 * 1.8 - 20} stroke="#fbbf24" strokeWidth="0.8" />
        <text x={170 + 73} y={170 - 26 * 1.8 - 24} fontSize="11" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Guwahati
        </text>
        <text x={170 + 73} y={170 - 26 * 1.8 - 12} fontSize="10" fill="#fcd34d" fontFamily="sans-serif">
          26°N, 91°E
        </text>

        {/* Right side: explanation */}
        <g>
          {/* Latitude diagram */}
          <text x="370" y="85" textAnchor="middle" fontSize="12" fontWeight="600" fill="#34d399" fontFamily="sans-serif">
            Latitude
          </text>
          <line x1="340" y1="95" x2="340" y2="155" stroke="#94a3b8" strokeWidth="1" />
          <text x="335" y="100" textAnchor="end" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">N</text>
          <text x="335" y="155" textAnchor="end" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">S</text>
          <line x1="335" y1="125" x2="400" y2="125" stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" />
          <text x="405" y="129" fontSize="9" fill="#34d399" fontFamily="sans-serif">0° Equator</text>
          <text x="370" y="172" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">
            How far north/south
          </text>

          {/* Longitude diagram */}
          <text x="370" y="210" textAnchor="middle" fontSize="12" fontWeight="600" fill="#60a5fa" fontFamily="sans-serif">
            Longitude
          </text>
          <line x1="340" y1="220" x2="400" y2="220" stroke="#94a3b8" strokeWidth="1" />
          <text x="335" y="224" textAnchor="end" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">W</text>
          <text x="405" y="224" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">E</text>
          <line x1="370" y1="215" x2="370" y2="250" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" />
          <text x="370" y="262" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">
            How far east/west
          </text>
        </g>

        {/* Bottom caption */}
        <text x="250" y="320" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Latitude = how far north/south. Longitude = how far east/west.
        </text>
      </svg>
    </div>
  );
}
