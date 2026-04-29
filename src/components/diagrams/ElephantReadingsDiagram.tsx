export default function ElephantReadingsDiagram() {
  const readings = [0.2, 0.5, 0.8, 1.0, 0.7, 0.3, 0.1];

  // Layout constants
  const W = 520;
  const H = 480;

  // Elephant section
  const elephantY = 30;

  // Sensor strip section
  const stripY = 100;
  const stripH = 60;
  const stripLeft = 60;
  const stripRight = 460;
  const stripW = stripRight - stripLeft;

  // Discrete points section
  const pointsY = stripY + stripH + 30;

  // List cells section
  const cellW = 52;
  const cellH = 34;
  const cellGap = 4;
  const totalCellsW = readings.length * cellW + (readings.length - 1) * cellGap;
  const cellStartX = (W - totalCellsW) / 2;
  const cellY = pointsY + 50;

  // Annotation section
  const annoY = cellY + cellH + 10;

  // Wave path for sensor strip (continuous)
  const wavePoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = stripLeft + t * stripW;
    // Build an amplitude envelope that peaks around index 3 (t~0.5)
    const envelope =
      0.2 +
      0.8 *
        Math.exp(-((t - 0.47) * (t - 0.47)) / 0.04);
    const freq = t * 14 * Math.PI;
    const y = stripY + stripH / 2 - envelope * (stripH / 2 - 4) * Math.sin(freq);
    wavePoints.push({ x, y });
  }

  let wavePath = `M ${wavePoints[0].x} ${wavePoints[0].y}`;
  for (let i = 1; i < wavePoints.length; i++) {
    wavePath += ` L ${wavePoints[i].x} ${wavePoints[i].y}`;
  }

  // Discrete measurement points along strip
  const dotPositions = readings.map((val, i) => {
    const t = (i + 0.5) / readings.length;
    const x = stripLeft + t * stripW;
    const envelope =
      0.2 +
      0.8 *
        Math.exp(-((t - 0.47) * (t - 0.47)) / 0.04);
    const y = stripY + stripH / 2 - envelope * (stripH / 2 - 4) * Math.sin(t * 14 * Math.PI);
    return { x, y };
  });

  // Ground vibration wave under elephant feet
  const groundY = elephantY + 48;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label="Diagram showing how elephant ground vibration readings become a Python list with indexed values"
        style={{ display: "block" }}
      >
        {/* Background */}
        <rect x={0} y={0} width={W} height={H} rx={12} className="fill-white dark:fill-slate-950" />

        {/* === SECTION 1: Elephant walking with ground vibrations === */}

        {/* Ground line */}
        <line x1={40} y1={groundY} x2={200} y2={groundY} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth={1.5} />

        {/* Elephant body - simple silhouette */}
        <g transform={`translate(100, ${elephantY})`}>
          {/* Body */}
          <ellipse cx={0} cy={20} rx={22} ry={14} className="fill-gray-500 dark:fill-slate-400" />
          {/* Head */}
          <circle cx={22} cy={12} r={10} className="fill-gray-500 dark:fill-slate-400" />
          {/* Trunk */}
          <path d="M 30 16 Q 38 20, 36 28 Q 34 32, 30 30" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
          {/* Ear */}
          <ellipse cx={16} cy={10} rx={6} ry={8} fill="#7c8da4" />
          {/* Eye */}
          <circle cx={26} cy={10} r={1.5} className="fill-white dark:fill-slate-950" />
          {/* Legs */}
          <line x1={-10} y1={30} x2={-10} y2={44} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
          <line x1={-2} y1={30} x2={-4} y2={44} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
          <line x1={8} y1={30} x2={6} y2={44} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
          <line x1={14} y1={30} x2={14} y2={44} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
          {/* Tail */}
          <path d="M -22 16 Q -30 10, -28 18" fill="none" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* Ground vibration waves (concentric arcs under feet) */}
        {[1, 2, 3, 4].map((ring) => (
          <path
            key={ring}
            d={`M ${100 - ring * 14} ${groundY + 2} Q ${100} ${groundY + 2 + ring * 6}, ${100 + ring * 14} ${groundY + 2}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth={1.2}
            opacity={1 - ring * 0.2}
          />
        ))}

        {/* Label */}
        <text x={210} y={elephantY + 30} fontSize={11} className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Elephant footsteps create ground vibrations
        </text>

        {/* === SECTION 2: Sensor strip with continuous wave === */}

        {/* Strip background */}
        <rect
          x={stripLeft}
          y={stripY}
          width={stripW}
          height={stripH}
          rx={4}
          className="fill-gray-100 dark:fill-slate-800"
          stroke="#334155"
          strokeWidth={1}
        />

        {/* Center line */}
        <line
          x1={stripLeft}
          y1={stripY + stripH / 2}
          x2={stripRight}
          y2={stripY + stripH / 2}
          stroke="#334155"
          strokeWidth={0.5}
          strokeDasharray="4,3"
        />

        {/* Continuous wave */}
        <path d={wavePath} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" />

        {/* Strip label */}
        <text x={W / 2} y={stripY - 6} textAnchor="middle" fontSize={11} className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Seismograph sensor readout
        </text>

        {/* === SECTION 3: Discrete measurement points === */}

        {/* Dashed lines from wave to dots */}
        {dotPositions.map((pos, i) => (
          <line
            key={`dash-${i}`}
            x1={pos.x}
            y1={stripY + stripH}
            x2={pos.x}
            y2={pointsY}
            className="stroke-gray-300 dark:stroke-slate-600"
            strokeWidth={0.8}
            strokeDasharray="3,2"
          />
        ))}

        {/* Measurement dots */}
        {dotPositions.map((pos, i) => (
          <g key={`dot-${i}`}>
            <circle cx={pos.x} cy={pointsY} r={5} fill="#22c55e" />
            <text
              x={pos.x}
              y={pointsY + 16}
              textAnchor="middle"
              fontSize={9}
              className="fill-gray-400 dark:fill-slate-500"
              fontFamily="monospace"
            >
              [{i}]
            </text>
          </g>
        ))}

        {/* === SECTION 4: Python list cells === */}

        {/* Section label */}
        <text
          x={W / 2}
          y={cellY - 10}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="monospace"
        >
          readings = [0.2, 0.5, 0.8, 1.0, 0.7, 0.3, 0.1]
        </text>

        {readings.map((val, i) => {
          const x = cellStartX + i * (cellW + cellGap);
          const isHighlight = i === 0 || i === 3 || i === 6;
          const fillColor = isHighlight ? "#78350f" : "#1e293b";
          const strokeColor = isHighlight ? "#f59e0b" : "#334155";
          const textColor = isHighlight ? "#fbbf24" : "#94a3b8";

          return (
            <g key={`cell-${i}`}>
              {/* Index label above */}
              <text
                x={x + cellW / 2}
                y={cellY + 0}
                textAnchor="middle"
                fontSize={9}
                className="fill-gray-400 dark:fill-slate-500"
                fontFamily="monospace"
              >
                [{i}]
              </text>
              {/* Cell box */}
              <rect
                x={x}
                y={cellY + 6}
                width={cellW}
                height={cellH}
                rx={4}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1.5}
              />
              {/* Value */}
              <text
                x={x + cellW / 2}
                y={cellY + 6 + cellH / 2 + 4}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                fill={textColor}
                fontFamily="monospace"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* === SECTION 5: Annotations === */}

        {/* Arrow to [0]: "First reading (index 0)" */}
        {(() => {
          const x0 = cellStartX + cellW / 2;
          const tipY = cellY + 6 + cellH;
          const labelY = annoY + 30;
          return (
            <g>
              <line x1={x0} y1={tipY} x2={x0} y2={labelY - 12} stroke="#f59e0b" strokeWidth={1.2} />
              <polygon
                points={`${x0},${tipY} ${x0 - 4},${tipY + 8} ${x0 + 4},${tipY + 8}`}
                fill="#f59e0b"
              />
              <text
                x={x0}
                y={labelY}
                textAnchor="middle"
                fontSize={10}
                fill="#fbbf24"
                fontFamily="sans-serif"
              >
                First reading
              </text>
              <text
                x={x0}
                y={labelY + 13}
                textAnchor="middle"
                fontSize={9}
                fill="#f59e0b"
                fontFamily="monospace"
              >
                (index 0)
              </text>
            </g>
          );
        })()}

        {/* Arrow to [3]: "Strongest (1.0)" */}
        {(() => {
          const x3 = cellStartX + 3 * (cellW + cellGap) + cellW / 2;
          const tipY = cellY + 6 + cellH;
          const labelY = annoY + 30;
          return (
            <g>
              <line x1={x3} y1={tipY} x2={x3} y2={labelY - 12} stroke="#f59e0b" strokeWidth={1.2} />
              <polygon
                points={`${x3},${tipY} ${x3 - 4},${tipY + 8} ${x3 + 4},${tipY + 8}`}
                fill="#f59e0b"
              />
              <text
                x={x3}
                y={labelY}
                textAnchor="middle"
                fontSize={10}
                fill="#fbbf24"
                fontFamily="sans-serif"
                fontWeight={700}
              >
                Strongest
              </text>
              <text
                x={x3}
                y={labelY + 13}
                textAnchor="middle"
                fontSize={9}
                fill="#f59e0b"
                fontFamily="monospace"
              >
                (1.0)
              </text>
            </g>
          );
        })()}

        {/* Arrow to [6]: "Last reading (index -1)" */}
        {(() => {
          const x6 = cellStartX + 6 * (cellW + cellGap) + cellW / 2;
          const tipY = cellY + 6 + cellH;
          const labelY = annoY + 30;
          return (
            <g>
              <line x1={x6} y1={tipY} x2={x6} y2={labelY - 12} stroke="#f59e0b" strokeWidth={1.2} />
              <polygon
                points={`${x6},${tipY} ${x6 - 4},${tipY + 8} ${x6 + 4},${tipY + 8}`}
                fill="#f59e0b"
              />
              <text
                x={x6}
                y={labelY}
                textAnchor="middle"
                fontSize={10}
                fill="#fbbf24"
                fontFamily="sans-serif"
              >
                Last reading
              </text>
              <text
                x={x6}
                y={labelY + 13}
                textAnchor="middle"
                fontSize={9}
                fill="#f59e0b"
                fontFamily="monospace"
              >
                (index -1)
              </text>
            </g>
          );
        })()}

        {/* === BOTTOM CAPTION === */}
        <text
          x={W / 2}
          y={H - 16}
          textAnchor="middle"
          fontSize={12}
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="sans-serif"
        >
          A list stores measurements in order
        </text>
        <text
          x={W / 2}
          y={H - 2}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-400 dark:fill-slate-500"
          fontFamily="sans-serif"
        >
          each has an index (position number)
        </text>
      </svg>
    </div>
  );
}
