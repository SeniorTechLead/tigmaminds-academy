/**
 * SymmetryOperationsDiagram — The 4 symmetry operations:
 * Translation, Rotation, Reflection, and Glide Reflection.
 * Each shown with a simple L-shape motif.
 */
export default function SymmetryOperationsDiagram() {
  const panelW = 250;
  const panelH = 110;
  const gap = 12;
  const startX = 16;
  const startY = 38;

  const panels = [0, 1, 2, 3].map((i) => ({
    x: startX + (i % 2) * (panelW + gap),
    y: startY + Math.floor(i / 2) * (panelH + gap),
  }));

  // L-shape path relative to origin, pointing right and up
  const lShape = (x: number, y: number, scale = 1, flipX = false, flipY = false) => {
    const sx = flipX ? -scale : scale;
    const sy = flipY ? -scale : scale;
    return `M ${x},${y} l ${12 * sx},0 l 0,${-6 * sy} l ${-6 * sx},0 l 0,${12 * sy} l ${-6 * sx},0 Z`;
  };

  // Arrow helper
  const arrow = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const tipSize = 4;
    const ax = x2 - tipSize * ux + tipSize * 0.4 * uy;
    const ay = y2 - tipSize * uy - tipSize * 0.4 * ux;
    const bx = x2 - tipSize * ux - tipSize * 0.4 * uy;
    const by = y2 - tipSize * uy + tipSize * 0.4 * ux;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="1.5" />
        <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} className="fill-gray-400 dark:fill-slate-500" />
      </g>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 540 290"
        className="w-full"
        role="img"
        aria-label="The four symmetry operations: translation, rotation, reflection, glide reflection"
      >
        <rect width="540" height="290" className="fill-white dark:fill-slate-950" rx="8" />

        <text
          x="270"
          y="26"
          textAnchor="middle"
          className="fill-gray-900 dark:fill-slate-50"
          fontFamily="system-ui"
          fontSize="14"
          fontWeight="bold"
        >
          The 4 Symmetry Operations
        </text>

        {/* Panel backgrounds */}
        {panels.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={panelW}
            height={panelH}
            className="fill-gray-100 dark:fill-slate-800"
            rx="6"
            stroke="#334155"
            strokeWidth="1"
          />
        ))}

        {/* === Panel 1: Translation === */}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + 18}
          textAnchor="middle"
          fill="#38bdf8"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Translation
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const bx = panels[0].x + 30 + i * 44;
          const by = panels[0].y + 58;
          const opacity = 0.3 + i * 0.175;
          return (
            <path
              key={i}
              d={lShape(bx, by)}
              fill="#38bdf8"
              fillOpacity={opacity}
              stroke="#38bdf8"
              strokeWidth="1"
            />
          );
        })}
        {/* Arrows between shapes */}
        {[0, 1, 2, 3].map((i) => {
          const x1 = panels[0].x + 44 + i * 44;
          const x2 = x1 + 30;
          const y = panels[0].y + 62;
          return <g key={i}>{arrow(x1, y, x2, y)}</g>;
        })}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          Slide in one direction
        </text>

        {/* === Panel 2: Rotation === */}
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + 18}
          textAnchor="middle"
          fill="#a78bfa"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Rotation (90°)
        </text>
        {/* 4 L-shapes rotated around center */}
        {[0, 1, 2, 3].map((i) => {
          const cx = panels[1].x + panelW / 2;
          const cy = panels[1].y + 60;
          const angle = 90 * i;
          const colors = ["#a78bfa", "#c084fc", "#e879f9", "#f0abfc"];
          return (
            <g key={i} transform={`rotate(${angle}, ${cx}, ${cy})`}>
              <path
                d={lShape(cx + 10, cy - 4)}
                fill={colors[i]}
                fillOpacity="0.5"
                stroke={colors[i]}
                strokeWidth="1"
              />
            </g>
          );
        })}
        {/* Center point */}
        <circle cx={panels[1].x + panelW / 2} cy={panels[1].y + 60} r="3" fill="#fbbf24" />
        {/* Curved arrow */}
        <path
          d={`M ${panels[1].x + panelW / 2 + 25},${panels[1].y + 36} A 20 20 0 0 1 ${panels[1].x + panelW / 2 + 6},${panels[1].y + 36}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          markerEnd="url(#rotArrow)"
        />
        <defs>
          <marker id="rotArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="#fbbf24" />
          </marker>
        </defs>
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          Spin around a fixed point
        </text>

        {/* === Panel 3: Reflection === */}
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + 18}
          textAnchor="middle"
          fill="#34d399"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Reflection
        </text>
        {/* Mirror line */}
        <line
          x1={panels[2].x + panelW / 2}
          y1={panels[2].y + 28}
          x2={panels[2].x + panelW / 2}
          y2={panels[2].y + panelH - 18}
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />
        {/* Original L */}
        <path
          d={lShape(panels[2].x + panelW / 2 - 50, panels[2].y + 58)}
          fill="#34d399"
          fillOpacity="0.5"
          stroke="#34d399"
          strokeWidth="1.5"
        />
        {/* Mirrored L */}
        <path
          d={lShape(panels[2].x + panelW / 2 + 38, panels[2].y + 58, 1, true)}
          fill="#34d399"
          fillOpacity="0.5"
          stroke="#34d399"
          strokeWidth="1.5"
        />
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          Flip across a mirror line
        </text>

        {/* === Panel 4: Glide Reflection === */}
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + 18}
          textAnchor="middle"
          fill="#fb923c"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Glide Reflection
        </text>
        {/* Dashed glide axis */}
        <line
          x1={panels[3].x + 20}
          y1={panels[3].y + 58}
          x2={panels[3].x + panelW - 20}
          y2={panels[3].y + 58}
          stroke="#64748b"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        {/* Alternating footprint-like L-shapes above and below */}
        {[0, 1, 2, 3, 4].map((i) => {
          const bx = panels[3].x + 30 + i * 44;
          const above = i % 2 === 0;
          const by = panels[3].y + (above ? 48 : 68);
          const opacity = 0.3 + i * 0.175;
          return (
            <path
              key={i}
              d={lShape(bx, by, 1, false, !above)}
              fill="#fb923c"
              fillOpacity={opacity}
              stroke="#fb923c"
              strokeWidth="1"
            />
          );
        })}
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + panelH - 10}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          Slide + flip (like footprints)
        </text>
      </svg>
    </div>
  );
}
