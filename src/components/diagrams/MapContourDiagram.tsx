export default function MapContourDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 598 338"
        className="w-full"
        role="img"
        aria-label="Contour lines: a 3D hill on the left and its contour map view on the right"
      >
        <rect width="500" height="300" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          How Contour Lines Work
        </text>

        {/* Left panel: 3D hill side view */}
        <text x="125" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Side View (3D)
        </text>

        {/* Hill shape */}
        <path
          d="M30,220 Q60,210 80,180 Q100,140 125,80 Q150,140 170,180 Q190,210 220,220Z"
          fill="#166534"
          stroke="#4ade80"
          strokeWidth="1.5"
        />

        {/* Horizontal slice lines on the hill */}
        {[200, 175, 150, 125, 105].map((y, i) => {
          const t = (220 - y) / 140;
          const halfW = 95 * (1 - t * 0.7);
          return (
            <g key={y}>
              <line
                x1={125 - halfW}
                y1={y}
                x2={125 + halfW}
                y2={y}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text x={125 + halfW + 5} y={y + 4} fontSize="8" fill="#fbbf24" fontFamily="sans-serif">
                {(i + 1) * 100}m
              </text>
            </g>
          );
        })}

        {/* Ground line */}
        <line x1="20" y1="220" x2="230" y2="220" stroke="#64748b" strokeWidth="1" />
        <text x="125" y="240" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Ground level (0m)
        </text>

        {/* Arrow */}
        <line x1="245" y1="150" x2="275" y2="150" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowContour)" />
        <defs>
          <marker id="arrowContour" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>
        <text x="260" y="140" textAnchor="middle" fontSize="8" fill="#f59e0b" fontFamily="sans-serif">top</text>
        <text x="260" y="164" textAnchor="middle" fontSize="8" fill="#f59e0b" fontFamily="sans-serif">view</text>

        {/* Right panel: contour rings from above */}
        <text x="375" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Top View (Map)
        </text>

        {/* Contour rings — outer to inner */}
        {[
          { rx: 90, ry: 70, label: "100m" },
          { rx: 70, ry: 54, label: "200m" },
          { rx: 50, ry: 38, label: "300m" },
          { rx: 32, ry: 24, label: "400m" },
          { rx: 16, ry: 12, label: "500m" },
        ].map((ring) => (
          <g key={ring.label}>
            <ellipse
              cx="375"
              cy="155"
              rx={ring.rx}
              ry={ring.ry}
              fill="none"
              stroke="#a16207"
              strokeWidth="1.2"
            />
          </g>
        ))}

        {/* Labels on right side of rings */}
        <text x="468" y="158" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">100m</text>
        <text x="448" y="140" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">200m</text>
        <text x="428" y="128" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">300m</text>
        <text x="410" y="145" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">400m</text>
        <text x="375" y="158" textAnchor="middle" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">500m</text>

        {/* Peak marker */}
        <circle cx="375" cy="155" r="3" fill="#ef4444" />
        <text x="375" y="147" textAnchor="middle" fontSize="8" fill="#ef4444" fontFamily="sans-serif">peak</text>

        {/* Steep vs gentle annotations */}
        {/* Steep side — left, lines close */}
        <line x1="305" y1="200" x2="310" y2="175" stroke="#34d399" strokeWidth="1.5" />
        <text x="290" y="215" textAnchor="middle" fontSize="9" fontWeight="600" fill="#34d399" fontFamily="sans-serif">
          Steep
        </text>
        <text x="290" y="226" textAnchor="middle" fontSize="8" fill="#6ee7b7" fontFamily="sans-serif">
          (close lines)
        </text>

        {/* Gentle side — right, lines far */}
        <line x1="445" y1="200" x2="440" y2="175" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="460" y="215" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa" fontFamily="sans-serif">
          Gentle
        </text>
        <text x="460" y="226" textAnchor="middle" fontSize="8" fill="#93c5fd" fontFamily="sans-serif">
          (far apart)
        </text>

        {/* Bottom caption */}
        <text x="250" y="270" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Close lines = steep slope. Far apart = gentle slope.
        </text>
        <text x="250" y="288" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Each contour line connects points at the same elevation.
        </text>
      </svg>
    </div>
  );
}
