export default function DemographicTransitionDiagram() {
  const left = 60;
  const right = 480;
  const top = 30;
  const bottom = 240;
  const graphW = right - left;
  const graphH = bottom - top;

  /* Stage boundaries (fraction of graphW) */
  const stages = [
    { label: "Stage 1", sub: "Pre-industrial", frac: 0 },
    { label: "Stage 2", sub: "Urbanizing", frac: 0.25 },
    { label: "Stage 3", sub: "Mature Industrial", frac: 0.55 },
    { label: "Stage 4", sub: "Post-industrial", frac: 0.8 },
  ];

  const stageX = (frac: number) => left + frac * graphW;

  /* Rate curves (birth & death) as polyline points */
  /* x: 0-1 fraction across graph, y: rate 0-50 per 1000 */
  const rateY = (r: number) => bottom - (r / 50) * graphH;

  const birthData = [
    [0, 43], [0.1, 43], [0.2, 42], [0.3, 41], [0.4, 40],
    [0.5, 37], [0.55, 34], [0.6, 28], [0.65, 22], [0.7, 17],
    [0.75, 14], [0.8, 12], [0.85, 11], [0.9, 11], [1, 11],
  ];

  const deathData = [
    [0, 40], [0.1, 39], [0.2, 36], [0.25, 30], [0.3, 22],
    [0.35, 17], [0.4, 14], [0.45, 12], [0.5, 11], [0.55, 10],
    [0.6, 10], [0.7, 10], [0.8, 10], [0.9, 11], [1, 11],
  ];

  const toSvg = (data: number[][]) =>
    data.map(([x, r]) => `${left + x * graphW},${rateY(r)}`).join(" ");

  /* Shaded area between birth & death (population growth) */
  const areaPoints = () => {
    const pts: string[] = [];
    /* Forward along birth rate */
    birthData.forEach(([x, r]) => pts.push(`${left + x * graphW},${rateY(r)}`));
    /* Backward along death rate */
    [...deathData].reverse().forEach(([x, r]) => pts.push(`${left + x * graphW},${rateY(r)}`));
    return pts.join(" ");
  };

  const yTicks = [0, 10, 20, 30, 40, 50];

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <svg
        viewBox="0 0 525 315"
        className="w-full"
        role="img"
        aria-label="Demographic Transition Model showing 4 stages with birth rate and death rate curves"
      >
        {/* Background */}
        <rect x="0" y="0" width="500" height="300" rx="6" className="fill-gray-50 dark:fill-gray-800" />

        {/* Stage dividers and labels */}
        {stages.map((s, i) => {
          const x = stageX(s.frac);
          const nextX = i < stages.length - 1 ? stageX(stages[i + 1].frac) : right;
          const midX = (x + nextX) / 2;
          return (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={x} y1={top} x2={x} y2={bottom}
                  className="stroke-gray-300 dark:stroke-gray-600"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
              )}
              <text
                x={midX} y={bottom + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className="fill-gray-700 dark:fill-gray-200"
                fontFamily="sans-serif"
              >
                {s.label}
              </text>
              <text
                x={midX} y={bottom + 30}
                textAnchor="middle"
                fontSize="10"
                className="fill-gray-500 dark:fill-gray-400"
                fontFamily="sans-serif"
              >
                {s.sub}
              </text>
            </g>
          );
        })}

        {/* Shaded area between curves (population growth) */}
        <polygon
          points={areaPoints()}
          className="fill-green-300/40 dark:fill-green-600/25"
        />

        {/* Birth rate line */}
        <polyline
          points={toSvg(birthData)}
          fill="none"
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Death rate line */}
        <polyline
          points={toSvg(deathData)}
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Y-axis ticks and labels */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={left - 4} y1={rateY(t)} x2={left} y2={rateY(t)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
            <text x={left - 8} y={rateY(t) + 4} textAnchor="end" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontFamily="sans-serif">
              {t}
            </text>
          </g>
        ))}

        {/* Y-axis title */}
        <text
          x="14" y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
          fontFamily="sans-serif"
          transform={`rotate(-90, 14, ${(top + bottom) / 2})`}
        >
          Rate per 1 000
        </text>

        {/* X-axis title */}
        <text x={(left + right) / 2} y={bottom + 46} textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-300" fontFamily="sans-serif">
          Time →
        </text>

        {/* Legend */}
        <line x1={right - 160} y1={top + 8} x2={right - 140} y2={top + 8} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />
        <text x={right - 136} y={top + 12} fontSize="10" className="fill-red-600 dark:fill-red-300" fontFamily="sans-serif">Birth rate</text>

        <line x1={right - 160} y1={top + 22} x2={right - 140} y2={top + 22} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />
        <text x={right - 136} y={top + 26} fontSize="10" className="fill-blue-600 dark:fill-blue-300" fontFamily="sans-serif">Death rate</text>

        <rect x={right - 162} y={top + 30} width="10" height="10" className="fill-green-300/60 dark:fill-green-600/40" />
        <text x={right - 148} y={top + 39} fontSize="10" className="fill-green-700 dark:fill-green-300" fontFamily="sans-serif">Population growth</text>

        {/* Title */}
        <text x={(left + right) / 2} y={16} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-gray-100" fontFamily="sans-serif">
          Demographic Transition Model
        </text>
      </svg>
    </div>
  );
}
