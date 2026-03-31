export default function MountainUVDiagram() {
  const left = 100;
  const right = 555;
  const top = 50;
  const bottom = 310;
  const graphW = right - left;
  const graphH = bottom - top;
  const maxAlt = 6000;

  const altX = (m: number) => left + (m / maxAlt) * graphW;

  /* UV index increases ~10-12% per 1000m */
  const uvAtAlt = (m: number) => 6 * Math.pow(1.11, m / 1000);
  const maxUV = 16;
  const uvY = (uv: number) => bottom - (uv / maxUV) * graphH;

  /* Curve points */
  const uvPts: string[] = [];
  for (let m = 0; m <= maxAlt; m += 100) {
    uvPts.push(`${altX(m)},${uvY(uvAtAlt(m))}`);
  }

  /* UV severity zones */
  const zones = [
    { min: 0, max: 3, label: "Low", color: "#22c55e" },
    { min: 3, max: 6, label: "Moderate", color: "#eab308" },
    { min: 6, max: 8, label: "High", color: "#f97316" },
    { min: 8, max: 11, label: "Very High", color: "#ef4444" },
    { min: 11, max: 16, label: "Extreme", color: "#9333ea" },
  ];

  /* Key altitude markers */
  const markers = [
    { alt: 0, label: "Sea level", uv: 6 },
    { alt: 1800, label: "Gangtok", uv: +(uvAtAlt(1800)).toFixed(1) },
    { alt: 3500, label: "3 500 m", uv: +(uvAtAlt(3500)).toFixed(1) },
    { alt: 5000, label: "5 000 m", uv: +(uvAtAlt(5000)).toFixed(1) },
  ];

  /* Atmosphere thickness illustration */
  const atmLayers = [
    { alt: 0, thickness: 50, label: "Sea level: thick atmosphere" },
    { alt: 3000, thickness: 30, label: "3 000 m: thinner" },
    { alt: 5500, thickness: 14, label: "5 500 m: very thin" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 451"
        className="w-full"
        role="img"
        aria-label="Graph showing UV radiation index increasing with altitude from UV 6 at sea level to UV 11 at 5000 metres, with atmosphere thickness illustration"
      >
        <rect x="0" y="0" width="600" height="410" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="22" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          UV Radiation Increases with Altitude
        </text>
        <text x="300" y="38" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">
          ~10-12% more UV per 1 000 m elevation gain
        </text>

        {/* UV severity zone bands */}
        {zones.map((z) => (
          <rect
            key={z.label}
            x={left}
            y={uvY(z.max)}
            width={graphW}
            height={uvY(z.min) - uvY(z.max)}
            fill={z.color}
            fillOpacity="0.08"
          />
        ))}

        {/* Zone labels on right */}
        {zones.map((z) => (
          <text
            key={z.label}
            x={right + 5}
            y={(uvY(z.min) + uvY(z.max)) / 2 + 3}
            fontSize="7"
            fill={z.color}
            fontWeight="600"
          >
            {z.label}
          </text>
        ))}

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500" strokeWidth="1" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-gray-500" strokeWidth="1" />

        {/* Y-axis label */}
        <text
          x={20}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
          fontWeight="600"
          transform={`rotate(-90,20,${(top + bottom) / 2})`}
        >
          UV Index
        </text>

        {/* X-axis label */}
        <text x={(left + right) / 2} y={bottom + 28} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Altitude (m)
        </text>

        {/* Y-axis ticks */}
        {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((uv) => (
          <g key={uv}>
            <line x1={left - 4} y1={uvY(uv)} x2={left} y2={uvY(uv)} className="stroke-gray-500" strokeWidth="1" />
            <text x={left - 8} y={uvY(uv) + 3} textAnchor="end" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {uv}
            </text>
            {uv > 0 && (
              <line x1={left} y1={uvY(uv)} x2={right} y2={uvY(uv)} className="stroke-gray-700" strokeWidth="0.5" strokeDasharray="3 3" />
            )}
          </g>
        ))}

        {/* X-axis ticks */}
        {[0, 1000, 2000, 3000, 4000, 5000, 6000].map((m) => (
          <g key={m}>
            <line x1={altX(m)} y1={bottom} x2={altX(m)} y2={bottom + 5} className="stroke-gray-500" strokeWidth="1" />
            <text x={altX(m)} y={bottom + 16} textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
              {m.toLocaleString()}
            </text>
          </g>
        ))}

        {/* Gradient fill under curve */}
        <defs>
          <linearGradient id="uvGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polygon
          points={`${uvPts.join(" ")} ${altX(maxAlt)},${bottom} ${left},${bottom}`}
          fill="url(#uvGrad)"
        />

        {/* UV curve */}
        <polyline points={uvPts.join(" ")} fill="none" className="stroke-amber-400" strokeWidth="2.5" />

        {/* Key markers */}
        {markers.map((mk, i) => (
          <g key={i}>
            <circle cx={altX(mk.alt)} cy={uvY(mk.uv)} r="4" className="fill-amber-400" />
            <line
              x1={altX(mk.alt)}
              y1={uvY(mk.uv) + 5}
              x2={altX(mk.alt)}
              y2={bottom}
              className="stroke-amber-400"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <rect
              x={altX(mk.alt) - 28}
              y={uvY(mk.uv) - 24}
              width="56"
              height="20"
              rx="3"
              className="fill-gray-100 dark:fill-slate-800"
              stroke="#f59e0b"
              strokeWidth="0.5"
            />
            <text x={altX(mk.alt)} y={uvY(mk.uv) - 14} textAnchor="middle" fontSize="7" className="fill-amber-300" fontWeight="600">
              {mk.label}
            </text>
            <text x={altX(mk.alt)} y={uvY(mk.uv) - 6} textAnchor="middle" fontSize="7" className="fill-gray-600 dark:fill-gray-300">
              UV {mk.uv}
            </text>
          </g>
        ))}

        {/* Atmosphere thickness mini-diagram */}
        <g transform="translate(40, 340)">
          <text x="0" y="10" fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="700">
            Why? Thinner air = less UV filtering:
          </text>
          {atmLayers.map((layer, i) => (
            <g key={i} transform={`translate(${i * 180}, 18)`}>
              {/* Sun icon */}
              <circle cx={25} cy={4} r="5" className="fill-amber-400" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={25 + 7 * Math.cos((angle * Math.PI) / 180)}
                  y1={4 + 7 * Math.sin((angle * Math.PI) / 180)}
                  x2={25 + 10 * Math.cos((angle * Math.PI) / 180)}
                  y2={4 + 10 * Math.sin((angle * Math.PI) / 180)}
                  className="stroke-amber-400"
                  strokeWidth="1"
                />
              ))}

              {/* UV arrow through atmosphere */}
              <line x1={25} y1={16} x2={25} y2={16 + layer.thickness} className="stroke-purple-400" strokeWidth="2" markerEnd="url(#uvArrow)" />

              {/* Atmosphere block */}
              <rect x={10} y={16} width={30} height={layer.thickness} rx="2" className="fill-blue-400" fillOpacity={0.15 + (layer.thickness / 50) * 0.2} />

              <text x={25} y={16 + layer.thickness + 14} textAnchor="middle" fontSize="6" className="fill-gray-500 dark:fill-gray-400">
                {layer.label}
              </text>
            </g>
          ))}
          <defs>
            <marker id="uvArrow" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 5 10 L 10 0 Z" className="fill-purple-400" />
            </marker>
          </defs>
        </g>

        {/* Warning */}
        <rect x="40" y="390" width="520" height="16" rx="3" className="fill-red-900/30" />
        <text x="300" y="401" textAnchor="middle" fontSize="8" className="fill-red-300" fontWeight="600">
          Sunburn risk is real at high altitude -- even in freezing cold with snow reflecting UV
        </text>
      </svg>
    </div>
  );
}
