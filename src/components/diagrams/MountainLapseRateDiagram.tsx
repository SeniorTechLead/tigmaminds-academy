export default function MountainLapseRateDiagram() {
  const left = 90;
  const right = 540;
  const top = 45;
  const bottom = 355;
  const maxAlt = 5500;
  const minTemp = -10;
  const maxTemp = 35;

  const altY = (m: number) => bottom - (m / maxAlt) * (bottom - top);
  const tempX = (t: number) => left + ((t - minTemp) / (maxTemp - minTemp)) * (right - left);
  const tempAtAlt = (m: number) => 30 - 6.5 * (m / 1000);

  /* Zones */
  const zones = [
    { from: 0, to: 1000, label: "Tropical forest", color: "fill-green-400/20", textClass: "fill-green-300" },
    { from: 1000, to: 2500, label: "Alpine meadow", color: "fill-green-700/15", textClass: "fill-green-400" },
    { from: 2500, to: 3800, label: "Snowline zone", color: "fill-blue-400/10", textClass: "fill-blue-300" },
    { from: 3800, to: 5500, label: "Glacier / snow", color: "fill-white/8", textClass: "fill-gray-300" },
  ];

  /* Lapse rate line points */
  const linePoints: string[] = [];
  for (let m = 0; m <= 5500; m += 100) {
    linePoints.push(`${tempX(tempAtAlt(m))},${altY(m)}`);
  }

  /* Grid temps */
  const gridTemps = [-5, 0, 5, 10, 15, 20, 25, 30];
  const gridAlts = [0, 1000, 2000, 3000, 4000, 5000];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 609 420"
        className="w-full"
        role="img"
        aria-label="Graph showing temperature lapse rate: 6.5 degrees Celsius per 1000 metres from 30°C at sea level to minus 5°C at 5500 metres"
      >
        <rect x="0" y="0" width="580" height="400" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="290" y="24" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Temperature Lapse Rate
        </text>

        {/* Zone bands */}
        {zones.map((z, i) => (
          <g key={i}>
            <rect
              x={left}
              y={altY(z.to)}
              width={right - left}
              height={altY(z.from) - altY(z.to)}
              className={z.color}
            />
            <text
              x={right - 8}
              y={(altY(z.from) + altY(z.to)) / 2 + 3}
              textAnchor="end"
              fontSize="8"
              className={z.textClass}
              fontWeight="600"
            >
              {z.label}
            </text>
          </g>
        ))}

        {/* Grid lines */}
        {gridTemps.map((t, i) => (
          <g key={`t-${i}`}>
            <line x1={tempX(t)} y1={top} x2={tempX(t)} y2={bottom} className="stroke-gray-700" strokeWidth="0.5" />
            <text x={tempX(t)} y={bottom + 14} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {t}°C
            </text>
          </g>
        ))}
        {gridAlts.map((a, i) => (
          <g key={`a-${i}`}>
            <line x1={left} y1={altY(a)} x2={right} y2={altY(a)} className="stroke-gray-700" strokeWidth="0.5" />
            <text x={left - 6} y={altY(a) + 3} textAnchor="end" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {a === 0 ? "0 m" : `${(a / 1000).toFixed(0)}k m`}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-400" strokeWidth="1.5" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-gray-400" strokeWidth="1.5" />

        {/* Axis labels */}
        <text
          x={18}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
          fontWeight="600"
          transform={`rotate(-90,18,${(top + bottom) / 2})`}
        >
          Altitude (m)
        </text>
        <text x={(left + right) / 2} y={bottom + 30} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Temperature (°C)
        </text>

        {/* Lapse rate line */}
        <polyline
          points={linePoints.join(" ")}
          fill="none"
          className="stroke-red-400"
          strokeWidth="2.5"
        />

        {/* Data points */}
        <circle cx={tempX(30)} cy={altY(0)} r="4" className="fill-red-400" />
        <text x={tempX(30) + 8} y={altY(0) + 4} fontSize="9" className="fill-red-300" fontWeight="700">
          30°C
        </text>

        <circle cx={tempX(tempAtAlt(5500))} cy={altY(5500)} r="4" className="fill-blue-400" />
        <text x={tempX(tempAtAlt(5500)) - 8} y={altY(5500) - 8} textAnchor="end" fontSize="9" className="fill-blue-300" fontWeight="700">
          -5.75°C
        </text>

        {/* Lapse rate annotation */}
        <g transform={`translate(${tempX(12)}, ${altY(2500)})`}>
          <rect x="-55" y="-12" width="110" height="22" rx="4" className="fill-amber-900/60" />
          <text x="0" y="3" textAnchor="middle" fontSize="10" className="fill-amber-300" fontWeight="800">
            -6.5 °C per 1 000 m
          </text>
        </g>

        {/* Snowline marker */}
        <line
          x1={left}
          y1={altY(3800)}
          x2={tempX(tempAtAlt(3800)) + 10}
          y2={altY(3800)}
          className="stroke-blue-300"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text x={left + 4} y={altY(3800) - 4} fontSize="7" className="fill-blue-300" fontWeight="600">
          Snowline ~3 800 m
        </text>
      </svg>
    </div>
  );
}
