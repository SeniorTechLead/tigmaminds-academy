export default function JapiTopViewDiagram() {
  // Layout: left panel = 3 crossing directions, right panel = 6-fold symmetry
  const leftCx = 150;
  const rightCx = 420;
  const cy = 150;
  const r = 95; // radius for the weave patterns

  // Three strip direction colors (warm, harmonious)
  const colors = ["#d97706", "#b45309", "#92400e"]; // amber-600, amber-700, amber-800
  const lightColors = ["#fbbf24", "#f59e0b", "#d97706"]; // for the left teaching panel

  // Helper: generate parallel lines for one direction
  const parallelLines = (
    angleDeg: number,
    cx: number,
    cy: number,
    color: string,
    count: number,
    spacing: number,
    clipId: string
  ) => {
    const rad = (angleDeg * Math.PI) / 180;
    const perpRad = rad + Math.PI / 2;
    const lines = [];
    for (let i = -count; i <= count; i++) {
      const offsetX = Math.cos(perpRad) * i * spacing;
      const offsetY = Math.sin(perpRad) * i * spacing;
      const x1 = cx + offsetX + Math.cos(rad) * (r + 20);
      const y1 = cy + offsetY + Math.sin(rad) * (r + 20);
      const x2 = cx + offsetX - Math.cos(rad) * (r + 20);
      const y2 = cy + offsetY - Math.sin(rad) * (r + 20);
      lines.push(
        <line
          key={`${angleDeg}-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          clipPath={`url(#${clipId})`}
        />
      );
    }
    return lines;
  };

  // Angle arc helper
  const angleArc = (
    cx: number,
    cy: number,
    startDeg: number,
    endDeg: number,
    arcR: number
  ) => {
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg * Math.PI) / 180;
    const x1 = cx + Math.cos(s) * arcR;
    const y1 = cy + Math.sin(s) * arcR;
    const x2 = cx + Math.cos(e) * arcR;
    const y2 = cy + Math.sin(e) * arcR;
    return `M ${x1},${y1} A ${arcR},${arcR} 0 0,1 ${x2},${y2}`;
  };

  // Mirror line helper for right panel
  const mirrorLine = (angleDeg: number, cx: number, cy: number, len: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x1: cx + Math.cos(rad) * len,
      y1: cy + Math.sin(rad) * len,
      x2: cx - Math.cos(rad) * len,
      y2: cy - Math.sin(rad) * len,
    };
  };

  const spacing = 18;
  const lineCount = 6;

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox="0 0 598 340"
        className="w-full"
        role="img"
        aria-label="Japi hat top view: three sets of bamboo strips crossing at 60 degrees create hexagonal weave with 6-fold rotational symmetry"
      >
        {/* Clip circles */}
        <defs>
          <clipPath id="leftClip">
            <circle cx={leftCx} cy={cy} r={r} />
          </clipPath>
          <clipPath id="rightClip">
            <circle cx={rightCx} cy={cy} r={r} />
          </clipPath>
        </defs>

        {/* ===== LEFT PANEL: Three crossing directions with angles ===== */}
        <g>
          {/* Faint background circle */}
          <circle
            cx={leftCx}
            cy={cy}
            r={r}
            fill="#fffbeb"
            className="dark:fill-amber-950/30"
            stroke="#d4a050"
            strokeWidth="1.5"
            opacity={0.5}
          />

          {/* Direction 1: 0° (horizontal) — amber */}
          {parallelLines(0, leftCx, cy, lightColors[0], lineCount, spacing, "leftClip")}
          {/* Direction 2: 60° — orange */}
          {parallelLines(60, leftCx, cy, lightColors[1], lineCount, spacing, "leftClip")}
          {/* Direction 3: 120° — dark amber */}
          {parallelLines(120, leftCx, cy, lightColors[2], lineCount, spacing, "leftClip")}

          {/* Angle arcs at center */}
          {/* Arc from 0° to 60° */}
          <path
            d={angleArc(leftCx, cy, 0, -60, 32)}
            fill="none"
            stroke="#78716c"
            className="dark:stroke-gray-400"
            strokeWidth="1.5"
          />
          <text
            x={leftCx + 38}
            y={cy - 16}
            fontSize="11"
            fontWeight="bold"
            className="fill-gray-700 dark:fill-gray-200"
          >
            60°
          </text>

          {/* Arc from 60° to 120° */}
          <path
            d={angleArc(leftCx, cy, -60, -120, 38)}
            fill="none"
            stroke="#78716c"
            className="dark:stroke-gray-400"
            strokeWidth="1.5"
          />
          <text
            x={leftCx - 6}
            y={cy - 40}
            fontSize="11"
            fontWeight="bold"
            className="fill-gray-700 dark:fill-gray-200"
          >
            60°
          </text>

          {/* Arc from 120° to 180° */}
          <path
            d={angleArc(leftCx, cy, -120, -180, 32)}
            fill="none"
            stroke="#78716c"
            className="dark:stroke-gray-400"
            strokeWidth="1.5"
          />
          <text
            x={leftCx - 52}
            y={cy - 16}
            fontSize="11"
            fontWeight="bold"
            className="fill-gray-700 dark:fill-gray-200"
          >
            60°
          </text>

          {/* Center dot */}
          <circle cx={leftCx} cy={cy} r={4} fill="#92400e" />

          {/* Legend below */}
          {[
            { color: lightColors[0], label: "Strip set A" },
            { color: lightColors[1], label: "Strip set B" },
            { color: lightColors[2], label: "Strip set C" },
          ].map((item, i) => (
            <g key={i}>
              <line
                x1={leftCx - 65}
                y1={cy + r + 22 + i * 16}
                x2={leftCx - 40}
                y2={cy + r + 22 + i * 16}
                stroke={item.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x={leftCx - 34}
                y={cy + r + 26 + i * 16}
                fontSize="10"
                className="fill-gray-600 dark:fill-gray-300"
              >
                {item.label}
              </text>
            </g>
          ))}
        </g>

        {/* ===== RIGHT PANEL: 6-fold symmetry ===== */}
        <g>
          {/* Faint background circle */}
          <circle
            cx={rightCx}
            cy={cy}
            r={r}
            fill="#fffbeb"
            className="dark:fill-amber-950/30"
            stroke="#d4a050"
            strokeWidth="1.5"
            opacity={0.5}
          />

          {/* Hexagonal weave — all three directions in uniform gold */}
          {parallelLines(0, rightCx, cy, "#d4a050", lineCount, spacing, "rightClip")}
          {parallelLines(60, rightCx, cy, "#d4a050", lineCount, spacing, "rightClip")}
          {parallelLines(120, rightCx, cy, "#d4a050", lineCount, spacing, "rightClip")}

          {/* 6 mirror/symmetry lines */}
          {[0, 30, 60, 90, 120, 150].map((angle) => {
            const ml = mirrorLine(angle, rightCx, cy, r + 8);
            return (
              <line
                key={`mirror-${angle}`}
                x1={ml.x1}
                y1={ml.y1}
                x2={ml.x2}
                y2={ml.y2}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="6,4"
                opacity={0.7}
              />
            );
          })}

          {/* Center dot */}
          <circle cx={rightCx} cy={cy} r={5} fill="#92400e" />

          {/* Small rotation arrow around center */}
          <path
            d={`M ${rightCx + 18},${cy - 10}
                A 20,20 0 1,1 ${rightCx - 10},${cy + 18}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            opacity={0.8}
            markerEnd="url(#redArrow)"
          />
          <defs>
            <marker
              id="redArrow"
              markerWidth="6"
              markerHeight="5"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0,0 6,2.5 0,5" fill="#ef4444" />
            </marker>
          </defs>

          {/* Label */}
          <text
            x={rightCx}
            y={cy + r + 22}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            className="fill-gray-700 dark:fill-gray-200"
          >
            6-fold symmetry
          </text>
          <text
            x={rightCx}
            y={cy + r + 38}
            textAnchor="middle"
            fontSize="10"
            className="fill-gray-500 dark:fill-gray-400"
          >
            Looks the same every 60° turn
          </text>
          {/* Dashed line legend */}
          <g>
            <line
              x1={rightCx - 40}
              y1={cy + r + 52}
              x2={rightCx - 15}
              y2={cy + r + 52}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              opacity={0.7}
            />
            <text
              x={rightCx - 10}
              y={cy + r + 56}
              fontSize="9"
              className="fill-gray-500 dark:fill-gray-400"
            >
              = mirror lines
            </text>
          </g>
        </g>

        {/* ===== BOTTOM ANNOTATION ===== */}
        <text
          x={285}
          y={308}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200"
        >
          Three sets of strips at 60° → hexagons → equal strength in every
          direction
        </text>
      </svg>
    </div>
  );
}
