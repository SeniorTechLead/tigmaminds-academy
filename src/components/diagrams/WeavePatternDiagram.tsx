/**
 * WeavePatternDiagram — shows the connection between weaving, rhythm,
 * and punched cards through a shared binary pattern (1-0-1-0-1-0).
 */

export default function WeavePatternDiagram() {
  const cellSize = 14;
  const gridSize = 6;
  const gridW = cellSize * gridSize;

  // Binary pattern row
  const bits = [1, 0, 1, 0, 1, 0];

  // Panel geometry
  const panelW = 150;
  const panelH = 195;
  const gap = 10;
  const totalW = panelW * 3 + gap * 2;
  const topPad = 10;

  // Panel x-offsets
  const p1x = 0;
  const p2x = panelW + gap;
  const p3x = (panelW + gap) * 2;

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox={`0 0 ${totalW} ${panelH + 55}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three panels showing how the same binary pattern appears in weaving, rhythm, and punched cards"
      >
        {/* ═══════════ PANEL 1 — Weave ═══════════ */}
        <g transform={`translate(${p1x}, 0)`}>
          {/* Panel label */}
          <text
            x={panelW / 2}
            y={topPad + 10}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="fill-current text-amber-700 dark:text-amber-300"
          >
            Weave
          </text>

          {/* 6x6 checkerboard grid */}
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              const isOver = (row + col) % 2 === 0;
              return (
                <rect
                  key={`w-${row}-${col}`}
                  x={panelW / 2 - gridW / 2 + col * cellSize}
                  y={topPad + 20 + row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={isOver ? "#f59e0b" : "#e5e7eb"}
                  stroke="#b45309"
                  strokeWidth={0.5}
                  rx={1}
                />
              );
            })
          )}

          {/* Sub-label */}
          <text
            x={panelW / 2}
            y={topPad + 20 + gridW + 15}
            textAnchor="middle"
            fontSize={9}
            className="fill-current text-gray-600 dark:text-gray-300"
          >
            over-1-under-1
          </text>

          {/* Binary row */}
          {bits.map((b, i) => (
            <text
              key={`wb-${i}`}
              x={panelW / 2 - gridW / 2 + i * cellSize + cellSize / 2}
              y={topPad + 20 + gridW + 32}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fontFamily="monospace"
              className="fill-current text-amber-800 dark:text-amber-200"
            >
              {b}
            </text>
          ))}
        </g>

        {/* ═══════════ PANEL 2 — Rhythm ═══════════ */}
        <g transform={`translate(${p2x}, 0)`}>
          {/* Panel label */}
          <text
            x={panelW / 2}
            y={topPad + 10}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="fill-current text-violet-700 dark:text-violet-300"
          >
            Rhythm
          </text>

          {/* Timeline bar */}
          <line
            x1={20}
            y1={topPad + 65}
            x2={panelW - 20}
            y2={topPad + 65}
            stroke="#7c3aed"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Beat dots */}
          {bits.map((b, i) => {
            const cx = 20 + i * ((panelW - 40) / (bits.length - 1));
            const r = b === 1 ? 8 : 4;
            return (
              <circle
                key={`rd-${i}`}
                cx={cx}
                cy={topPad + 65}
                r={r}
                fill={b === 1 ? "#7c3aed" : "#c4b5fd"}
                stroke="#5b21b6"
                strokeWidth={1}
              />
            );
          })}

          {/* Beat labels above dots */}
          {bits.map((b, i) => {
            const cx = 20 + i * ((panelW - 40) / (bits.length - 1));
            return (
              <text
                key={`rl-${i}`}
                x={cx}
                y={topPad + 48}
                textAnchor="middle"
                fontSize={8}
                fontWeight={b === 1 ? 700 : 400}
                className="fill-current text-violet-700 dark:text-violet-300"
              >
                {b === 1 ? "BOOM" : "tap"}
              </text>
            );
          })}

          {/* Sub-label */}
          <text
            x={panelW / 2}
            y={topPad + 20 + gridW + 15}
            textAnchor="middle"
            fontSize={9}
            className="fill-current text-gray-600 dark:text-gray-300"
          >
            BOOM-tap-BOOM-tap
          </text>

          {/* Binary row */}
          {bits.map((b, i) => (
            <text
              key={`rb-${i}`}
              x={panelW / 2 - gridW / 2 + i * cellSize + cellSize / 2}
              y={topPad + 20 + gridW + 32}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fontFamily="monospace"
              className="fill-current text-violet-800 dark:text-violet-200"
            >
              {b}
            </text>
          ))}
        </g>

        {/* ═══════════ PANEL 3 — Punched Card ═══════════ */}
        <g transform={`translate(${p3x}, 0)`}>
          {/* Panel label */}
          <text
            x={panelW / 2}
            y={topPad + 10}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="fill-current text-blue-700 dark:text-blue-300"
          >
            Punched Card
          </text>

          {/* Card rectangle */}
          <rect
            x={20}
            y={topPad + 22}
            width={panelW - 40}
            height={60}
            rx={4}
            fill="#dbeafe"
            stroke="#2563eb"
            strokeWidth={1.5}
          />

          {/* Corner notch */}
          <rect
            x={20}
            y={topPad + 22}
            width={10}
            height={10}
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth={1}
          />

          {/* Holes and solid positions */}
          {bits.map((b, i) => {
            const cx = 35 + i * ((panelW - 70) / (bits.length - 1));
            const cy = topPad + 52;
            if (b === 1) {
              // Punched hole
              return (
                <circle
                  key={`ph-${i}`}
                  cx={cx}
                  cy={cy}
                  r={7}
                  fill="#eff6ff"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                />
              );
            }
            // Solid area — small filled dot
            return (
              <circle
                key={`ps-${i}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="#3b82f6"
                stroke="#1d4ed8"
                strokeWidth={1}
              />
            );
          })}

          {/* Sub-label */}
          <text
            x={panelW / 2}
            y={topPad + 20 + gridW + 15}
            textAnchor="middle"
            fontSize={9}
            className="fill-current text-gray-600 dark:text-gray-300"
          >
            Jacquard loom card
          </text>

          {/* Binary row */}
          {bits.map((b, i) => (
            <text
              key={`pb-${i}`}
              x={panelW / 2 - gridW / 2 + i * cellSize + cellSize / 2}
              y={topPad + 20 + gridW + 32}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fontFamily="monospace"
              className="fill-current text-blue-800 dark:text-blue-200"
            >
              {b}
            </text>
          ))}
        </g>

        {/* ═══════════ BOTTOM CAPTION ═══════════ */}
        <text
          x={totalW / 2}
          y={panelH + 30}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          className="fill-current text-gray-700 dark:text-gray-200"
        >
          Same binary pattern → three different materials: bamboo, sound, paper
        </text>
      </svg>
    </div>
  );
}
