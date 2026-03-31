export default function WarpWeftDiagram() {
  const warpColor = '#6366f1';
  const weftColor = '#f59e0b';

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing warp threads running vertically under tension and weft threads woven horizontally across them"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Warp and Weft: The Two Thread Systems
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Every woven fabric has vertical warp threads and horizontal weft threads
        </text>

        {/* Loom frame */}
        <rect x="120" y="80" width="540" height="300" rx="0" fill="none" stroke="#8b6914" strokeWidth="6" />

        {/* Top beam */}
        <rect x="108" y="72" width="564" height="15" rx="4" fill="#a16207" />
        <text x="390" y="68" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">Top beam</text>

        {/* Bottom beam */}
        <rect x="108" y="373" width="564" height="15" rx="4" fill="#a16207" />
        <text x="390" y="404" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">Bottom beam</text>

        {/* Warp threads (vertical) */}
        {Array.from({ length: 18 }, (_, i) => {
          const x = 145 + i * 30;
          return (
            <line key={`warp-${i}`} x1={x} y1="87" x2={x} y2="373" stroke={warpColor} strokeWidth="3" opacity="0.7" />
          );
        })}

        {/* Weft threads (horizontal, weaving over/under) */}
        {Array.from({ length: 9 }, (_, row) => {
          const y = 110 + row * 30;
          return (
            <g key={`weft-${row}`}>
              {Array.from({ length: 18 }, (_, col) => {
                const x1 = 145 + col * 30 - 15;
                const x2 = 145 + col * 30 + 15;
                const isOver = (col + row) % 2 === 0;
                return (
                  <line
                    key={`seg-${row}-${col}`}
                    x1={x1} y1={y} x2={x2} y2={y}
                    stroke={weftColor}
                    strokeWidth="3"
                    opacity={isOver ? 0.9 : 0.3}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Labels */}
        <g transform="translate(75, 230)">
          <text textAnchor="middle" fontSize="13" fontWeight="700" fill={warpColor} transform="rotate(-90)">
            WARP (vertical)
          </text>
        </g>

        <text x="390" y="360" textAnchor="middle" fontSize="13" fontWeight="700" fill={weftColor}>
          WEFT (horizontal)
        </text>

        {/* Shuttle */}
        <rect x="630" y="215" width="60" height="18" rx="8" fill={weftColor} fillOpacity="0.5" stroke={weftColor} strokeWidth="1" />
        <text x="660" y="228" textAnchor="middle" fontSize="10" fill="#854d0e" fontWeight="600">Shuttle</text>
        <path d="M660,237 L660,255 L690,255" fill="none" stroke={weftColor} strokeWidth="1" strokeDasharray="3 2" />
        <text x="698" y="260" fontSize="10" className="fill-gray-500 dark:fill-slate-400">carries weft</text>
        <text x="698" y="272" fontSize="10" className="fill-gray-500 dark:fill-slate-400">thread across</text>

        {/* Key facts */}
        <rect x="100" y="408" width="280" height="40" rx="8" fill={warpColor} fillOpacity="0.08" stroke={warpColor} strokeWidth="1" />
        <text x="240" y="425" textAnchor="middle" fontSize="11" fontWeight="600" fill={warpColor}>
          Warp: set up first, under tension
        </text>
        <text x="240" y="440" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Must be strong {'\u2014'} carries the fabric weight
        </text>

        <rect x="400" y="408" width="280" height="40" rx="8" fill={weftColor} fillOpacity="0.08" stroke={weftColor} strokeWidth="1" />
        <text x="540" y="425" textAnchor="middle" fontSize="11" fontWeight="600" fill={weftColor}>
          Weft: woven in second, row by row
        </text>
        <text x="540" y="440" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Creates the pattern and width
        </text>
      </svg>
    </div>
  );
}
