/**
 * ActivityTessellationDiagram — Escher-style tessellation guide.
 * Shows 4 steps: draw triangle → cut notch → tape to adjacent side → tile the result.
 */
export default function ActivityTessellationDiagram() {
  const panelW = 240;
  const panelH = 130;
  const gap = 14;
  const startX = 14;
  const startY = 42;

  const panels = [0, 1, 2, 3].map((i) => ({
    x: startX + (i % 2) * (panelW + gap),
    y: startY + Math.floor(i / 2) * (panelH + gap),
  }));

  // Equilateral triangle vertices
  const triW = 50;
  const triH = (triW * Math.sqrt(3)) / 2;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 510 330"
        className="w-full"
        role="img"
        aria-label="Step-by-step guide to making an Escher-style tessellation from a triangle"
      >
        <rect width="510" height="330" className="fill-white dark:fill-slate-950" rx="8" />

        <text
          x="254"
          y="26"
          textAnchor="middle"
          className="fill-gray-900 dark:fill-slate-50"
          fontFamily="system-ui"
          fontSize="14"
          fontWeight="bold"
        >
          Make Your Own Escher Tessellation
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

        {/* === Step 1: Draw equilateral triangle === */}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + 16}
          textAnchor="middle"
          fill="#38bdf8"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Step 1: Draw a Triangle
        </text>
        {(() => {
          const cx = panels[0].x + panelW / 2;
          const by = panels[0].y + 90;
          const ax = cx - triW / 2;
          const bx = cx + triW / 2;
          const ty = by - triH;
          return (
            <g>
              <polygon
                points={`${ax},${by} ${bx},${by} ${cx},${ty}`}
                fill="#38bdf8"
                fillOpacity="0.2"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {/* Label sides */}
              <text
                x={cx}
                y={by + 14}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-slate-400"
                fontFamily="system-ui"
                fontSize="10"
              >
                Equilateral (60° each)
              </text>
            </g>
          );
        })()}

        {/* === Step 2: Cut a curved notch from one side === */}
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + 16}
          textAnchor="middle"
          fill="#a78bfa"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Step 2: Cut a Notch
        </text>
        {(() => {
          const cx = panels[1].x + panelW / 2;
          const by = panels[1].y + 90;
          const ax = cx - triW / 2;
          const bx = cx + triW / 2;
          const ty = by - triH;
          // Left side with curved notch cut out
          const midLx = (ax + cx) / 2;
          const midLy = (by + ty) / 2;
          return (
            <g>
              {/* Triangle outline with notch on left side */}
              <path
                d={`M ${ax},${by} L ${bx},${by} L ${cx},${ty}
                    L ${midLx + 2},${midLy - 1}
                    Q ${midLx - 14},${midLy} ${midLx - 2},${midLy + 1}
                    L ${ax},${by}`}
                fill="#a78bfa"
                fillOpacity="0.2"
                stroke="#a78bfa"
                strokeWidth="2"
              />
              {/* The cut-out piece shown separately */}
              <path
                d={`M ${cx},${ty}
                    L ${midLx + 2},${midLy - 1}
                    Q ${midLx - 14},${midLy} ${midLx - 2},${midLy + 1}
                    L ${ax},${by}
                    L ${cx},${ty}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1"
                strokeDasharray="3,2"
              />
              {/* Arrow showing "cut" */}
              <path
                d={`M ${midLx - 18},${midLy} L ${midLx - 28},${midLy}`}
                stroke="#ef4444"
                strokeWidth="1.5"
                markerEnd="url(#cutArrow)"
              />
              {/* Cut piece floating nearby */}
              <path
                d={`M ${ax - 34},${by - 8}
                    L ${ax - 34 + (cx - ax) / 2 + 2},${by - 8 - triH / 2 - 1}
                    Q ${ax - 34 + (cx - ax) / 2 - 14},${by - 8 - triH / 2}
                    ${ax - 34 + (cx - ax) / 2 - 2},${by - 8 - triH / 2 + 1}
                    Z`}
                fill="#ef4444"
                fillOpacity="0.3"
                stroke="#ef4444"
                strokeWidth="1.5"
              />
              <text
                x={ax - 30}
                y={by + 2}
                textAnchor="middle"
                fill="#fca5a5"
                fontFamily="system-ui"
                fontSize="10"
              >
                cut
              </text>
            </g>
          );
        })()}

        <defs>
          <marker id="cutArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="#ef4444" />
          </marker>
          <marker id="tapeArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="#34d399" />
          </marker>
        </defs>

        {/* === Step 3: Tape to adjacent side === */}
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + 16}
          textAnchor="middle"
          fill="#34d399"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Step 3: Tape to Other Side
        </text>
        {(() => {
          const cx = panels[2].x + panelW / 2;
          const by = panels[2].y + 90;
          const ax = cx - triW / 2;
          const bx = cx + triW / 2;
          const ty = by - triH;
          // Right side with bump added
          const midRx = (bx + cx) / 2;
          const midRy = (by + ty) / 2;
          return (
            <g>
              {/* Modified triangle: left side indented, right side bumped */}
              <path
                d={`M ${ax},${by} L ${bx},${by}
                    L ${midRx - 2},${midRy + 1}
                    Q ${midRx + 14},${midRy} ${midRx + 2},${midRy - 1}
                    L ${cx},${ty}
                    L ${(ax + cx) / 2 + 2},${(by + ty) / 2 - 1}
                    Q ${(ax + cx) / 2 - 14},${(by + ty) / 2} ${(ax + cx) / 2 - 2},${(by + ty) / 2 + 1}
                    L ${ax},${by}`}
                fill="#34d399"
                fillOpacity="0.25"
                stroke="#34d399"
                strokeWidth="2"
              />
              {/* Arrow showing tape */}
              <path
                d={`M ${midRx + 18},${midRy} L ${midRx + 28},${midRy}`}
                stroke="#34d399"
                strokeWidth="1.5"
                markerEnd="url(#tapeArrow)"
              />
              <text
                x={midRx + 42}
                y={midRy + 4}
                fill="#6ee7b7"
                fontFamily="system-ui"
                fontSize="10"
              >
                tape
              </text>
              <text
                x={cx}
                y={by + 14}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-slate-400"
                fontFamily="system-ui"
                fontSize="10"
              >
                Same area as original!
              </text>
            </g>
          );
        })()}

        {/* === Step 4: Tile the modified shape === */}
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + 16}
          textAnchor="middle"
          fill="#fb923c"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          Step 4: Tile It!
        </text>
        {(() => {
          // Simplified modified triangle shape for tiling
          const s = 28;
          const h = (s * Math.sqrt(3)) / 2;
          const baseX = panels[3].x + 30;
          const baseY = panels[3].y + 40;
          const colors = ["#fb923c", "#f97316", "#ea580c", "#c2410c", "#fbbf24", "#f59e0b"];
          const shapes: { x: number; y: number; up: boolean; ci: number }[] = [];

          // Row layout: alternating up/down triangles
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 6; col++) {
              const up = (col + row) % 2 === 0;
              const tx = baseX + col * (s / 2);
              const ty = baseY + row * h;
              shapes.push({ x: tx, y: ty, up, ci: (row * 6 + col) % colors.length });
            }
          }

          return (
            <g>
              {shapes.map((sh, i) => {
                const ax = sh.x;
                const bx = sh.x + s;
                const mx = sh.x + s / 2;
                if (sh.up) {
                  const ty = sh.y;
                  const by = sh.y + h;
                  const midLx = (ax + mx) / 2;
                  const midLy = (by + ty) / 2;
                  const midRx = (bx + mx) / 2;
                  const midRy = midLy;
                  return (
                    <path
                      key={i}
                      d={`M ${ax},${by} L ${bx},${by}
                          L ${midRx - 1},${midRy + 0.5}
                          Q ${midRx + 6},${midRy} ${midRx + 1},${midRy - 0.5}
                          L ${mx},${ty}
                          L ${midLx + 1},${midLy - 0.5}
                          Q ${midLx - 6},${midLy} ${midLx - 1},${midLy + 0.5}
                          Z`}
                      fill={colors[sh.ci]}
                      fillOpacity="0.35"
                      stroke={colors[sh.ci]}
                      strokeWidth="0.8"
                    />
                  );
                } else {
                  const ty = sh.y + h;
                  const by = sh.y;
                  const midLx = (ax + mx) / 2;
                  const midLy = (by + ty) / 2;
                  const midRx = (bx + mx) / 2;
                  const midRy = midLy;
                  return (
                    <path
                      key={i}
                      d={`M ${ax},${by} L ${bx},${by}
                          L ${midRx - 1},${midRy - 0.5}
                          Q ${midRx + 6},${midRy} ${midRx + 1},${midRy + 0.5}
                          L ${mx},${ty}
                          L ${midLx + 1},${midLy + 0.5}
                          Q ${midLx - 6},${midLy} ${midLx - 1},${midLy - 0.5}
                          Z`}
                      fill={colors[sh.ci]}
                      fillOpacity="0.35"
                      stroke={colors[sh.ci]}
                      strokeWidth="0.8"
                    />
                  );
                }
              })}
              <text
                x={panels[3].x + panelW / 2}
                y={panels[3].y + panelH - 10}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-slate-400"
                fontFamily="system-ui"
                fontSize="10"
              >
                Every piece fits — no gaps!
              </text>
            </g>
          );
        })()}

        {/* Step numbers */}
        {panels.map((p, i) => (
          <circle
            key={i}
            cx={p.x + 14}
            cy={p.y + 14}
            r="10"
            className="fill-white dark:fill-slate-950"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
        ))}
        {panels.map((p, i) => (
          <text
            key={`n${i}`}
            x={p.x + 14}
            y={p.y + 18}
            textAnchor="middle"
            fill="#fbbf24"
            fontFamily="system-ui"
            fontSize="11"
            fontWeight="bold"
          >
            {i + 1}
          </text>
        ))}
      </svg>
    </div>
  );
}
