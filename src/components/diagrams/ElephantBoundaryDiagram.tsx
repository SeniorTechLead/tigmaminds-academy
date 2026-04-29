export default function ElephantBoundaryDiagram() {
  // Shared dot positions for both panels
  const elephantDots = [
    { x: 0.15, y: 0.25 },
    { x: 0.22, y: 0.18 },
    { x: 0.10, y: 0.35 },
    { x: 0.28, y: 0.30 },
    { x: 0.18, y: 0.40 },
    { x: 0.32, y: 0.22 },
    { x: 0.12, y: 0.15 },
    { x: 0.25, y: 0.38 },
    { x: 0.20, y: 0.30 },
    { x: 0.35, y: 0.42 },
    { x: 0.40, y: 0.35 },
    { x: 0.30, y: 0.15 },
  ];

  const birdDots = [
    { x: 0.65, y: 0.70 },
    { x: 0.72, y: 0.78 },
    { x: 0.80, y: 0.65 },
    { x: 0.58, y: 0.75 },
    { x: 0.85, y: 0.82 },
    { x: 0.70, y: 0.60 },
    { x: 0.75, y: 0.88 },
    { x: 0.62, y: 0.68 },
    { x: 0.78, y: 0.72 },
    { x: 0.88, y: 0.75 },
    { x: 0.55, y: 0.62 },
  ];

  // Outliers: one elephant dot deep in bird territory, one bird in elephant territory
  const outlierElephant = { x: 0.60, y: 0.58 };
  const outlierBird = { x: 0.38, y: 0.48 };

  // Panel layout
  const panelW = 230;
  const panelH = 170;
  const leftPanelX = 30;
  const rightPanelX = 330;
  const panelY = 70;

  // Jagged boundary (k=1, overfitting) — wiggles to wrap around every outlier
  const jaggedPath =
    'M0.05,0.50 L0.15,0.48 L0.25,0.46 L0.30,0.50 L0.35,0.55 L0.42,0.50 ' +
    'L0.45,0.44 L0.50,0.48 L0.55,0.55 L0.58,0.62 L0.62,0.55 L0.65,0.52 ' +
    'L0.68,0.56 L0.72,0.58 L0.78,0.55 L0.82,0.58 L0.88,0.55 L0.95,0.58';

  // Smooth boundary (k=15) — gentle curve
  const smoothPath =
    'M0.05,0.52 Q0.25,0.50 0.45,0.52 Q0.60,0.54 0.75,0.56 Q0.90,0.58 0.95,0.56';

  const renderPanel = (
    panelX: number,
    title: string,
    subtitle: string,
    boundaryPath: string,
    borderColor: string,
    subtitleColor: string
  ) => {
    const toSX = (x: number) => panelX + x * panelW;
    const toSY = (y: number) => panelY + y * panelH;

    // Convert boundary path to screen coords
    const screenPath = boundaryPath.replace(
      /([0-9.]+),([0-9.]+)/g,
      (_, px, py) => `${toSX(parseFloat(px)).toFixed(1)},${toSY(parseFloat(py)).toFixed(1)}`
    );

    return (
      <g>
        {/* Panel background */}
        <rect
          x={panelX}
          y={panelY}
          width={panelW}
          height={panelH}
          rx="4"
          className="fill-white dark:fill-slate-950"
          stroke={borderColor}
          strokeWidth="1"
        />

        {/* Title */}
        <text x={panelX + panelW / 2} y={panelY - 18} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="11" fontWeight="700">
          {title}
        </text>

        {/* Elephant dots */}
        {elephantDots.map((d, i) => (
          <circle key={`e-${i}`} cx={toSX(d.x)} cy={toSY(d.y)} r="4" fill="#22c55e" opacity="0.8" />
        ))}
        <circle cx={toSX(outlierElephant.x)} cy={toSY(outlierElephant.y)} r="4" fill="#22c55e" opacity="0.8" />

        {/* Bird dots */}
        {birdDots.map((d, i) => (
          <circle key={`b-${i}`} cx={toSX(d.x)} cy={toSY(d.y)} r="4" fill="#f59e0b" opacity="0.8" />
        ))}
        <circle cx={toSX(outlierBird.x)} cy={toSY(outlierBird.y)} r="4" fill="#f59e0b" opacity="0.8" />

        {/* Decision boundary */}
        <path d={screenPath} fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="5,3" />

        {/* Subtitle */}
        <text x={panelX + panelW / 2} y={panelY + panelH + 16} textAnchor="middle" fill={subtitleColor} fontSize="9" fontWeight="600">
          {subtitle}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 630 350"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Decision boundaries: k=1 produces a jagged overfitting boundary while k=15 produces a smooth generalizing boundary"
    >
      {/* Dark background */}
      <rect width="600" height="320" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Decision Boundaries: Overfitting vs. Generalization
      </text>

      {/* Left panel: k=1 */}
      {renderPanel(
        leftPanelX,
        'k = 1 (overfitting)',
        'Follows every point — too wiggly',
        jaggedPath,
        '#ef4444',
        '#fca5a5'
      )}

      {/* Right panel: k=15 */}
      {renderPanel(
        rightPanelX,
        'k = 15 (smooth)',
        'Ignores noise — captures the real pattern',
        smoothPath,
        '#22c55e',
        '#86efac'
      )}

      {/* VS label in the middle */}
      <text x="300" y={panelY + panelH / 2 + 4} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="14" fontWeight="800">
        vs
      </text>

      {/* Legend */}
      <g transform={`translate(200, ${panelY + panelH + 34})`}>
        <circle cx="6" cy="4" r="4" fill="#22c55e" opacity="0.8" />
        <text x="14" y="8" fill="#86efac" fontSize="9">Elephant</text>

        <circle cx="86" cy="4" r="4" fill="#f59e0b" opacity="0.8" />
        <text x="94" y="8" fill="#fde68a" fontSize="9">Bird</text>

        <line x1="156" y1="4" x2="176" y2="4" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4,3" />
        <text x="182" y="8" className="fill-gray-600 dark:fill-slate-300" fontSize="9">Boundary</text>
      </g>

      {/* ── Bottom summary ── */}
      <text x="300" y="300" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        More neighbors = smoother boundary = better generalization
      </text>
    </svg>
  );
}
