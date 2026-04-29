export default function MapInterpolationDiagram() {
  /* Sample points with known values (e.g., temperature or rainfall) */
  const samplePoints = [
    { x: 80, y: 90, val: 28 },
    { x: 200, y: 70, val: 24 },
    { x: 350, y: 85, val: 22 },
    { x: 120, y: 180, val: 30 },
    { x: 280, y: 160, val: 26 },
    { x: 410, y: 150, val: 20 },
    { x: 90, y: 250, val: 32 },
    { x: 230, y: 240, val: 29 },
    { x: 370, y: 230, val: 25 },
  ];

  function valColor(v: number): string {
    if (v >= 31) return "#ef4444";
    if (v >= 29) return "#f97316";
    if (v >= 27) return "#f59e0b";
    if (v >= 25) return "#eab308";
    if (v >= 23) return "#84cc16";
    if (v >= 21) return "#22c55e";
    return "#14b8a6";
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 525 395"
        className="w-full"
        role="img"
        aria-label="Spatial interpolation: scattered sample points with known values and gaps filled in using color gradients"
      >
        <rect width="500" height="360" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Spatial Interpolation
        </text>
        <text x="250" y="44" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Estimating unknown values between measurements
        </text>

        {/* Background: interpolated gradient field (simplified as colored circles) */}
        {/* We simulate the interpolated surface with overlapping translucent circles */}
        {samplePoints.map((pt, i) => (
          <circle
            key={`grad-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="80"
            fill={valColor(pt.val)}
            opacity="0.12"
          />
        ))}

        {/* Grid region outline */}
        <rect x="40" y="55" width="420" height="220" rx="4" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" strokeDasharray="4 2" />

        {/* Estimated value labels at midpoints (interpolated) */}
        {[
          { x: 140, y: 130, val: "~27°" },
          { x: 310, y: 120, val: "~24°" },
          { x: 170, y: 210, val: "~29°" },
          { x: 330, y: 195, val: "~23°" },
        ].map((est, i) => (
          <g key={`est-${i}`}>
            <text
              x={est.x}
              y={est.y}
              textAnchor="middle"
              fontSize="9"
              fill="#d1d5db"
              fontFamily="sans-serif"
              fontStyle="italic"
              opacity="0.7"
            >
              {est.val}
            </text>
            <circle cx={est.x} cy={est.y - 5} r="1.5" className="fill-gray-400 dark:fill-slate-500" opacity="0.5" />
          </g>
        ))}

        {/* Sample points (known values) */}
        {samplePoints.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="8" fill={valColor(pt.val)} stroke="#f8fafc" strokeWidth="1.5" />
            <text
              x={pt.x}
              y={pt.y + 3}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              className="fill-white dark:fill-slate-950"
              fontFamily="monospace"
            >
              {pt.val}°
            </text>
          </g>
        ))}

        {/* Connection lines showing influence (IDW concept) */}
        <line x1="140" y1="125" x2="80" y2="90" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
        <line x1="140" y1="125" x2="200" y2="70" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
        <line x1="140" y1="125" x2="120" y2="180" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />

        {/* Legend */}
        <text x="250" y="295" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Color Legend (Temperature °C)
        </text>
        {[
          { color: "#14b8a6", label: "20" },
          { color: "#22c55e", label: "22" },
          { color: "#84cc16", label: "24" },
          { color: "#eab308", label: "26" },
          { color: "#f59e0b", label: "28" },
          { color: "#f97316", label: "30" },
          { color: "#ef4444", label: "32" },
        ].map((item, i) => (
          <g key={i}>
            <rect x={130 + i * 35} y="303" width="30" height="10" rx="1" fill={item.color} />
            <text x={145 + i * 35} y="322" textAnchor="middle" fontSize="7" fill="#d1d5db" fontFamily="sans-serif">
              {item.label}°
            </text>
          </g>
        ))}

        {/* Method note */}
        <text x="250" y="345" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          IDW: closer points have more influence. Kriging: also considers spatial patterns.
        </text>
      </svg>
    </div>
  );
}
