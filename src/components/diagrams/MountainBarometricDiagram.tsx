export default function MountainBarometricDiagram() {
  const left = 100;
  const right = 560;
  const top = 30;
  const bottom = 340;
  const graphW = right - left;
  const graphH = bottom - top;

  /* Barometric formula: P = P0 * (1 - Lh/T0)^(gM/RL) */
  const P0 = 1013;
  const L = 0.0065;
  const T0 = 288.15;
  const gMRL = 5.2561;
  const pressure = (alt: number) => P0 * Math.pow(1 - (L * alt) / T0, gMRL);

  const maxAlt = 9000;
  const altX = (m: number) => left + (m / maxAlt) * graphW;
  const pY = (p: number) => top + ((P0 - p) / (P0 - 250)) * graphH;

  /* Key altitude markers */
  const markers = [
    { alt: 0, label: "Sea level", p: 1013 },
    { alt: 1800, label: "Gangtok", p: Math.round(pressure(1800)) },
    { alt: 5364, label: "Everest BC", p: Math.round(pressure(5364)) },
    { alt: 8849, label: "Summit", p: Math.round(pressure(8849)) },
  ];

  /* Pressure curve points */
  const curvePts: string[] = [];
  for (let m = 0; m <= maxAlt; m += 100) {
    curvePts.push(`${altX(m)},${pY(pressure(m))}`);
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 430"
        className="w-full"
        role="img"
        aria-label="Barometric formula graph showing pressure decreasing exponentially with altitude from 1013 hPa at sea level to 330 hPa at Everest summit"
      >
        <rect x="0" y="0" width="600" height="410" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="20" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Barometric Pressure vs Altitude
        </text>

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500" strokeWidth="1" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-gray-500" strokeWidth="1" />

        {/* Y-axis label */}
        <text
          x={18}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
          fontWeight="600"
          transform={`rotate(-90,18,${(top + bottom) / 2})`}
        >
          Pressure (hPa)
        </text>

        {/* X-axis label */}
        <text x={(left + right) / 2} y={bottom + 30} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Altitude (m)
        </text>

        {/* Y-axis ticks */}
        {[300, 400, 500, 600, 700, 800, 900, 1013].map((p) => (
          <g key={p}>
            <line x1={left - 4} y1={pY(p)} x2={left} y2={pY(p)} className="stroke-gray-500" strokeWidth="1" />
            <text x={left - 8} y={pY(p) + 3} textAnchor="end" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {p}
            </text>
            <line x1={left} y1={pY(p)} x2={right} y2={pY(p)} className="stroke-gray-700" strokeWidth="0.5" strokeDasharray="3 3" />
          </g>
        ))}

        {/* X-axis ticks */}
        {[0, 2000, 4000, 6000, 8000].map((m) => (
          <g key={m}>
            <line x1={altX(m)} y1={bottom} x2={altX(m)} y2={bottom + 5} className="stroke-gray-500" strokeWidth="1" />
            <text x={altX(m)} y={bottom + 16} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {m.toLocaleString()}
            </text>
          </g>
        ))}

        {/* Gradient fill under curve */}
        <defs>
          <linearGradient id="baroGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon
          points={`${curvePts.join(" ")} ${altX(maxAlt)},${bottom} ${left},${bottom}`}
          fill="url(#baroGrad)"
        />

        {/* Pressure curve */}
        <polyline points={curvePts.join(" ")} fill="none" className="stroke-sky-400" strokeWidth="2.5" />

        {/* Key altitude markers */}
        {markers.map((mk, i) => (
          <g key={i}>
            <line
              x1={altX(mk.alt)}
              y1={pY(mk.p)}
              x2={altX(mk.alt)}
              y2={bottom}
              className="stroke-amber-400"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle cx={altX(mk.alt)} cy={pY(mk.p)} r="4" className="fill-amber-400" />
            <rect
              x={altX(mk.alt) - 32}
              y={pY(mk.p) - 26}
              width="64"
              height="20"
              rx="3"
              className="fill-gray-100 dark:fill-slate-800"
              stroke="#f59e0b"
              strokeWidth="0.5"
            />
            <text
              x={altX(mk.alt)}
              y={pY(mk.p) - 18}
              textAnchor="middle"
              fontSize="7"
              className="fill-amber-300"
              fontWeight="600"
            >
              {mk.label}
            </text>
            <text
              x={altX(mk.alt)}
              y={pY(mk.p) - 10}
              textAnchor="middle"
              fontSize="7"
              className="fill-gray-600 dark:fill-gray-300"
            >
              {mk.p} hPa
            </text>
          </g>
        ))}

        {/* Formula box */}
        <rect x={320} y={60} width="230" height="44" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="1" />
        <text x={335} y={77} fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Barometric Formula:
        </text>
        <text x={335} y={95} fontSize="11" className="fill-sky-300" fontWeight="700" fontFamily="serif">
          {"P = P₀(1 − Lh / T₀)"}
          <tspan fontSize="8" dy="-4">gM/RL</tspan>
        </text>

        {/* Insight */}
        <rect x={left - 10} y={bottom + 38} width="470" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x={left} y={bottom + 53} fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Pressure drops exponentially -- halves roughly every 5 500 m of altitude gain
        </text>
      </svg>
    </div>
  );
}
