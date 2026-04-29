export default function MountainOxygenDiagram() {
  const levels = [
    { alt: "Sea level", pressure: 1013, o2hPa: 213, pct: "21%", y: 270, color: "fill-green-400", ringColor: "stroke-green-400", bgColor: "fill-green-900/30" },
    { alt: "3 500 m", pressure: 650, o2hPa: 137, pct: "21%", y: 155, color: "fill-amber-400", ringColor: "stroke-amber-400", bgColor: "fill-amber-900/20" },
    { alt: "5 500 m", pressure: 500, o2hPa: 105, pct: "21%", y: 55, color: "fill-red-400", ringColor: "stroke-red-400", bgColor: "fill-red-900/20" },
  ];

  const pieR = 34;
  const pieCx = 170;

  /* 21% arc for pie chart — ~75.6 degrees */
  const arcEnd = (r: number) => {
    const angle = 0.21 * 2 * Math.PI;
    return { x: r * Math.sin(angle), y: -r * Math.cos(angle) };
  };

  const end = arcEnd(pieR);

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 620 415"
        className="w-full"
        role="img"
        aria-label="Pie charts showing oxygen at three altitudes: same 21 percent but fewer molecules per breath at higher altitude"
      >
        <rect x="0" y="0" width="580" height="380" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="290" y="28" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Oxygen at Different Altitudes
        </text>

        {levels.map((lv, i) => (
          <g key={i}>
            {/* Background panel */}
            <rect x="40" y={lv.y} width="500" height="80" rx="6" className={lv.bgColor} />

            {/* Altitude label */}
            <text x="60" y={lv.y + 20} fontSize="11" className={lv.color} fontWeight="700">
              {lv.alt}
            </text>
            <text x="60" y={lv.y + 34} fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {lv.pressure} hPa total
            </text>

            {/* Pie chart */}
            <g transform={`translate(${pieCx}, ${lv.y + 45})`}>
              {/* Full circle (N2 + other) */}
              <circle cx="0" cy="0" r={pieR} className="fill-gray-700/60" />
              {/* O2 slice — 21% */}
              <path
                d={`M0,0 L0,${-pieR} A${pieR},${pieR} 0 0,1 ${end.x},${end.y} Z`}
                className={lv.color}
                opacity="0.8"
              />
              {/* Ring border */}
              <circle cx="0" cy="0" r={pieR} fill="none" className={lv.ringColor} strokeWidth="1.5" />
              {/* Center label */}
              <text x="0" y="4" textAnchor="middle" fontSize="11" className="fill-white" fontWeight="800">
                {lv.pct}
              </text>
              <text x="0" y="14" textAnchor="middle" fontSize="6" className="fill-gray-600 dark:fill-gray-300">
                O₂
              </text>
            </g>

            {/* Molecule count visualization — fewer dots higher up */}
            <g transform={`translate(260, ${lv.y + 24})`}>
              <text x="0" y="0" fontSize="8" className="fill-gray-500 dark:fill-gray-400" fontWeight="600">
                O₂ molecules per breath:
              </text>
              {/* Dot grid — proportional to actual O2 */}
              {Array.from({ length: Math.round(lv.o2hPa / 10) }).map((_, j) => (
                <circle
                  key={j}
                  cx={10 + (j % 14) * 10}
                  cy={12 + Math.floor(j / 14) * 10}
                  r="3"
                  className={lv.color}
                  opacity="0.7"
                />
              ))}
            </g>

            {/* Effective O2 */}
            <text x={490} y={lv.y + 40} textAnchor="end" fontSize="14" className={lv.color} fontWeight="800">
              {lv.o2hPa} hPa
            </text>
            <text x={490} y={lv.y + 54} textAnchor="end" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
              actual O₂ pressure
            </text>
          </g>
        ))}

        {/* Insight bar */}
        <rect x="40" y="350" width="500" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x="290" y="365" textAnchor="middle" fontSize="9" className="fill-amber-300" fontWeight="600">
          Same percentage, but fewer molecules per breath — that is why altitude feels breathless
        </text>
      </svg>
    </div>
  );
}
