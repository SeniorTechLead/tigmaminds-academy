/**
 * JapiHexagonDiagram - Shows WHY hexagons tile: angle math at vertices.
 * Three panels: triangle (60deg x 6 = 360), square (90deg x 4 = 360),
 * hexagon (120deg x 3 = 360), plus pentagon failure (108deg x 3 = 324).
 */
export default function JapiHexagonDiagram() {
  const w = 560;
  const h = 360;

  // Helper: regular polygon points centered at (cx, cy) with given radius
  const polyPoints = (cx: number, cy: number, sides: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(' ');
  };

  // Helper: draw an angle arc at a vertex
  const arcPath = (cx: number, cy: number, startDeg: number, endDeg: number, arcR: number) => {
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg * Math.PI) / 180;
    const x1 = cx + Math.cos(s) * arcR;
    const y1 = cy + Math.sin(s) * arcR;
    const x2 = cx + Math.cos(e) * arcR;
    const y2 = cy + Math.sin(e) * arcR;
    const sweep = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1},${y1} A ${arcR},${arcR} 0 ${sweep},1 ${x2},${y2}`;
  };

  // Panel data
  const panels = [
    {
      label: 'Triangle',
      sides: 3,
      angle: 60,
      count: 6,
      total: 360,
      works: true,
      cx: 80,
      r: 28,
    },
    {
      label: 'Square',
      sides: 4,
      angle: 90,
      count: 4,
      total: 360,
      works: true,
      cx: 200,
      r: 26,
    },
    {
      label: 'Hexagon',
      sides: 6,
      angle: 120,
      count: 3,
      total: 360,
      works: true,
      cx: 330,
      r: 26,
    },
    {
      label: 'Pentagon',
      sides: 5,
      angle: 108,
      count: 3,
      total: 324,
      works: false,
      cx: 470,
      r: 26,
    },
  ];

  const topCy = 100;

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label="Why hexagons tile: interior angles of triangles, squares, and hexagons divide evenly into 360 degrees, but pentagons do not"
      >
        {/* Title */}
        <text
          x={w / 2}
          y="22"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          className="fill-gray-700 dark:fill-gray-200"
        >
          Which shapes tile? The angle test
        </text>
        <text
          x={w / 2}
          y="38"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          At every meeting point, corner angles must add to exactly 360°
        </text>

        {panels.map((p, pi) => {
          const fillClass = p.works
            ? 'fill-amber-200/70 dark:fill-amber-700/40'
            : 'fill-red-100/70 dark:fill-red-900/30';
          const strokeClass = p.works
            ? 'stroke-amber-600 dark:stroke-amber-400'
            : 'stroke-red-400 dark:stroke-red-400';

          // Draw multiple copies meeting at a vertex
          const shapes: JSX.Element[] = [];
          const meetX = p.cx;
          const meetY = topCy;

          for (let i = 0; i < p.count; i++) {
            const rotAngle = (360 / p.count) * i;
            // Offset center so one vertex is at meetX, meetY
            const offsetAngle = ((rotAngle - 90) * Math.PI) / 180;
            const cx = meetX + Math.cos(offsetAngle) * p.r;
            const cy = meetY + Math.sin(offsetAngle) * p.r;
            shapes.push(
              <polygon
                key={`shape-${pi}-${i}`}
                points={polyPoints(cx, cy, p.sides, p.r)}
                className={`${fillClass} ${strokeClass}`}
                strokeWidth="1.2"
                transform={`rotate(${rotAngle}, ${meetX}, ${meetY})`}
                opacity={0.85}
              />
            );
          }

          // Angle arc at meeting point
          const arcEl = p.works ? (
            <path
              d={arcPath(meetX, meetY, 0, 350, 14)}
              fill="none"
              className="stroke-green-500 dark:stroke-green-400"
              strokeWidth="1.5"
            />
          ) : (
            <>
              <path
                d={arcPath(meetX, meetY, 0, 324, 14)}
                fill="none"
                className="stroke-red-500 dark:stroke-red-400"
                strokeWidth="1.5"
              />
              {/* Gap indicator */}
              <path
                d={arcPath(meetX, meetY, 324, 360, 14)}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity={0.5}
              />
            </>
          );

          return (
            <g key={pi}>
              {shapes}
              {arcEl}

              {/* Center dot at meeting point */}
              <circle
                cx={meetX}
                cy={meetY}
                r={2.5}
                className="fill-gray-700 dark:fill-gray-300"
              />

              {/* Shape name */}
              <text
                x={meetX}
                y={topCy + p.r + 36}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                className="fill-gray-700 dark:fill-gray-200"
              >
                {p.label}
              </text>

              {/* Angle math */}
              <text
                x={meetX}
                y={topCy + p.r + 52}
                textAnchor="middle"
                fontSize="10"
                className="fill-gray-500 dark:fill-gray-400"
              >
                {p.angle}° × {p.count} = {p.total}°
              </text>

              {/* Result */}
              {p.works ? (
                <g transform={`translate(${meetX}, ${topCy + p.r + 70})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={10}
                    className="fill-green-100 dark:fill-green-900/50 stroke-green-500 dark:stroke-green-400"
                    strokeWidth="1.2"
                  />
                  <polyline
                    points="-4,0 -1,4 5,-4"
                    fill="none"
                    className="stroke-green-600 dark:stroke-green-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ) : (
                <g transform={`translate(${meetX}, ${topCy + p.r + 70})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={10}
                    className="fill-red-100 dark:fill-red-900/50 stroke-red-500 dark:stroke-red-400"
                    strokeWidth="1.2"
                  />
                  <line
                    x1={-4}
                    y1={-4}
                    x2={4}
                    y2={4}
                    className="stroke-red-500 dark:stroke-red-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={4}
                    y1={-4}
                    x2={-4}
                    y2={4}
                    className="stroke-red-500 dark:stroke-red-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Divider */}
        <line
          x1={20}
          y1={250}
          x2={w - 20}
          y2={250}
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="1"
        />

        {/* Bottom annotation: The Japi connection */}
        <text
          x={w / 2}
          y={275}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-amber-700 dark:fill-amber-400"
        >
          The japi uses hexagons because 120° × 3 = 360°
        </text>
        <text
          x={w / 2}
          y={295}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          Three bamboo strips meeting at 60° naturally form hexagonal cells
        </text>

        {/* Small hexagonal cell illustration */}
        <g transform={`translate(${w / 2}, 332)`}>
          <polygon
            points={polyPoints(0, 0, 6, 20)}
            className="fill-amber-200/50 dark:fill-amber-700/30 stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            className="fill-amber-700 dark:fill-amber-400"
          >
            120°
          </text>
        </g>
      </svg>
    </div>
  );
}
