/**
 * TileAnglesDiagram — Why 360° matters for tessellations.
 * Shows triangles (6×60°), squares (4×90°), hexagons (3×120°) meeting at a point,
 * plus pentagon failure (3×108°=324°, 36° gap).
 */
export default function TileAnglesDiagram() {
  const panelW = 130;
  const panelH = 150;
  const gap = 10;
  const startX = 8;
  const startY = 36;

  // Helper: polygon points centered at (cx, cy) with n sides and radius r
  function polyPoints(cx: number, cy: number, n: number, r: number, startAngle = -90): string {
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const angle = ((360 / n) * i + startAngle) * (Math.PI / 180);
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  }

  // Panel positions
  const panels = [0, 1, 2, 3].map((i) => ({
    x: startX + i * (panelW + gap),
    y: startY,
  }));

  // Triangle panel: 6 equilateral triangles meeting at center
  const triR = 38;
  const triCenter = { x: panels[0].x + panelW / 2, y: panels[0].y + panelH / 2 - 5 };

  // Square panel: 4 squares meeting at center
  const sqR = 34;
  const sqCenter = { x: panels[1].x + panelW / 2, y: panels[1].y + panelH / 2 - 5 };

  // Hex panel: 3 hexagons meeting at center
  const hexR = 30;
  const hexCenter = { x: panels[2].x + panelW / 2, y: panels[2].y + panelH / 2 - 5 };

  // Pentagon panel: 3 pentagons with gap
  const pentR = 28;
  const pentCenter = { x: panels[3].x + panelW / 2, y: panels[3].y + panelH / 2 - 5 };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 568 220"
        className="w-full"
        role="img"
        aria-label="Why 360 degrees matters for tessellations"
      >
        <rect width="568" height="220" className="fill-white dark:fill-slate-950" rx="8" />

        {/* Title */}
        <text
          x="284"
          y="24"
          textAnchor="middle"
          className="fill-gray-900 dark:fill-slate-50"
          fontFamily="system-ui"
          fontSize="14"
          fontWeight="bold"
        >
          Why 360° Matters at Every Vertex
        </text>

        {/* Panel backgrounds */}
        {panels.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={panelW}
            height={panelH}
            fill={i === 3 ? "#1e1028" : "#1e293b"}
            rx="6"
            stroke={i === 3 ? "#ef4444" : "#334155"}
            strokeWidth="1"
          />
        ))}

        {/* === Panel 1: 6 Triangles === */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a1 = (60 * i - 90) * (Math.PI / 180);
          const a2 = (60 * (i + 1) - 90) * (Math.PI / 180);
          const cx = triCenter.x;
          const cy = triCenter.y;
          const x1 = cx + triR * Math.cos(a1);
          const y1 = cy + triR * Math.sin(a1);
          const x2 = cx + triR * Math.cos(a2);
          const y2 = cy + triR * Math.sin(a2);
          const colors = ["#38bdf8", "#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9"];
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${x1},${y1} ${x2},${y2}`}
              fill={colors[i]}
              fillOpacity="0.3"
              stroke={colors[i]}
              strokeWidth="1.5"
            />
          );
        })}
        {/* Center dot */}
        <circle cx={triCenter.x} cy={triCenter.y} r="3" fill="#fbbf24" />
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="11"
        >
          6 × 60° = 360° ✓
        </text>

        {/* === Panel 2: 4 Squares === */}
        {[0, 1, 2, 3].map((i) => {
          const cx = sqCenter.x;
          const cy = sqCenter.y;
          const angle = 90 * i * (Math.PI / 180);
          const nextAngle = 90 * (i + 1) * (Math.PI / 180);
          const x1 = cx + sqR * Math.cos(angle);
          const y1 = cy + sqR * Math.sin(angle);
          const x2 = cx + sqR * Math.cos(nextAngle);
          const y2 = cy + sqR * Math.sin(nextAngle);
          // Corner of square
          const diagAngle = (45 + 90 * i) * (Math.PI / 180);
          const d = sqR * Math.SQRT2;
          const x3 = cx + d * Math.cos(diagAngle);
          const y3 = cy + d * Math.sin(diagAngle);
          const colors = ["#34d399", "#2dd4bf", "#22d3ee", "#38bdf8"];
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${x1},${y1} ${x3},${y3} ${x2},${y2}`}
              fill={colors[i]}
              fillOpacity="0.25"
              stroke={colors[i]}
              strokeWidth="1.5"
            />
          );
        })}
        <circle cx={sqCenter.x} cy={sqCenter.y} r="3" fill="#fbbf24" />
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="11"
        >
          4 × 90° = 360° ✓
        </text>

        {/* === Panel 3: 3 Hexagons === */}
        {[0, 1, 2].map((i) => {
          // Place hex centers around the meeting point
          const a = (120 * i + 90) * (Math.PI / 180);
          const dist = hexR * Math.sqrt(3) * 0.58;
          const hx = hexCenter.x + dist * Math.cos(a);
          const hy = hexCenter.y + dist * Math.sin(a);
          const colors = ["#fb923c", "#f97316", "#ea580c"];
          return (
            <polygon
              key={i}
              points={polyPoints(hx, hy, 6, hexR, -90 + 30)}
              fill={colors[i]}
              fillOpacity="0.25"
              stroke={colors[i]}
              strokeWidth="1.5"
            />
          );
        })}
        <circle cx={hexCenter.x} cy={hexCenter.y} r="3" fill="#fbbf24" />
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="11"
        >
          3 × 120° = 360° ✓
        </text>

        {/* === Panel 4: 3 Pentagons with gap === */}
        {[0, 1, 2].map((i) => {
          const a = (108 * i - 54) * (Math.PI / 180);
          const dist = pentR * 1.35;
          const px = pentCenter.x + dist * Math.cos(a);
          const py = pentCenter.y + dist * Math.sin(a);
          return (
            <polygon
              key={i}
              points={polyPoints(px, py, 5, pentR, -90 + 72 * i)}
              fill="#ef4444"
              fillOpacity="0.2"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
          );
        })}
        {/* Gap wedge indicator */}
        {(() => {
          const cx = pentCenter.x;
          const cy = pentCenter.y;
          const gapStart = (324 / 2 - 90) * (Math.PI / 180);
          const gapEnd = (324 / 2 + 36 - 90) * (Math.PI / 180);
          const r = 18;
          const x1 = cx + r * Math.cos(gapStart);
          const y1 = cy + r * Math.sin(gapStart);
          const x2 = cx + r * Math.cos(gapEnd);
          const y2 = cy + r * Math.sin(gapEnd);
          return (
            <path
              d={`M ${cx},${cy} L ${x1},${y1} A ${r} ${r} 0 0 1 ${x2},${y2} Z`}
              fill="#ef4444"
              fillOpacity="0.5"
              stroke="#ef4444"
              strokeWidth="1"
            />
          );
        })()}
        <circle cx={pentCenter.x} cy={pentCenter.y} r="3" fill="#fbbf24" />
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + panelH - 22}
          textAnchor="middle"
          fill="#fca5a5"
          fontFamily="system-ui"
          fontSize="11"
        >
          3 × 108° = 324°
        </text>
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + panelH - 8}
          textAnchor="middle"
          fill="#ef4444"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="bold"
        >
          36° gap! ✗
        </text>

        {/* Panel titles */}
        {["Triangles", "Squares", "Hexagons", "Pentagons"].map((label, i) => (
          <text
            key={label}
            x={panels[i].x + panelW / 2}
            y={panels[i].y + 16}
            textAnchor="middle"
            fill={i === 3 ? "#fca5a5" : "#e2e8f0"}
            fontFamily="system-ui"
            fontSize="12"
            fontWeight="600"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
