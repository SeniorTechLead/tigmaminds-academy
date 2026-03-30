/**
 * AlgorithmStepsDiagram — teaches what an "algorithm" is by showing it as
 * a step-by-step recipe, using weaving as the concrete example.
 * Vertical flowchart with 4 steps + a twill pattern output + insight box.
 */

export default function AlgorithmStepsDiagram() {
  // Layout constants
  const totalW = 540;
  const totalH = 520;

  // Step boxes (left column)
  const boxW = 220;
  const boxH = 56;
  const boxX = 40;
  const stepGap = 18;
  const circleR = 12;
  const arrowGap = stepGap;

  // Vertical positions for each step
  const stepY = (i: number) => 20 + i * (boxH + arrowGap);

  // Twill grid (right side)
  const gridSize = 6;
  const cellSize = 18;
  const gridW = cellSize * gridSize;
  const gridX = 330;
  const gridY = 60;

  // Insight box
  const insightY = stepY(4) - 4;
  const insightW = totalW - 60;
  const insightH = 72;

  // Colors
  const amber = "#f59e0b";
  const amberDark = "#b45309";
  const gray = "#d1d5db";
  const grayDark = "#6b7280";

  // Twill pattern: over-2-under-1 shifted by 1 each row → diagonal stripes
  const isOver = (row: number, col: number) => (col - row + gridSize) % 3 !== 2;

  // Step mini-illustrations
  const renderStepIllustration = (step: number, gX: number, gY: number) => {
    const iy = gY + 30; // illustration vertical center
    const ix = gX + 155; // start x for mini-illustration

    if (step === 0) {
      // Single horizontal strip
      return (
        <line
          x1={ix}
          y1={iy}
          x2={ix + 60}
          y2={iy}
          stroke={amber}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
    }
    if (step === 1) {
      // Strip going OVER 2 vertical strips
      return (
        <g>
          {/* Two vertical strips behind */}
          <line x1={ix + 12} y1={iy - 10} x2={ix + 12} y2={iy + 10} stroke={gray} strokeWidth={4} strokeLinecap="round" />
          <line x1={ix + 32} y1={iy - 10} x2={ix + 32} y2={iy + 10} stroke={gray} strokeWidth={4} strokeLinecap="round" />
          {/* Horizontal strip on top — amber for "over" */}
          <line x1={ix} y1={iy} x2={ix + 44} y2={iy} stroke={amber} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    }
    if (step === 2) {
      // Strip going UNDER 1 vertical strip
      return (
        <g>
          {/* Horizontal strip behind (gray because it's underneath) */}
          <line x1={ix} y1={iy} x2={ix + 30} y2={iy} stroke={grayDark} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
          {/* Vertical strip on top */}
          <line x1={ix + 15} y1={iy - 10} x2={ix + 15} y2={iy + 10} stroke={amber} strokeWidth={4} strokeLinecap="round" />
          {/* Dashed continuation */}
          <line x1={ix + 30} y1={iy} x2={ix + 44} y2={iy} stroke={amber} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    }
    // step === 3: loop arrow is handled separately
    return null;
  };

  const steps = [
    "Pick up strip #1",
    "Over 2 strips",
    "Under 1 strip",
    "Shift 1, repeat →",
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Flowchart showing an algorithm as a step-by-step weaving recipe: start with strip, go over 2, go under 1, shift and repeat, producing a diagonal twill pattern"
      >
        {/* ═══════════ STEP BOXES ═══════════ */}
        {steps.map((label, i) => {
          const y = stepY(i);
          return (
            <g key={`step-${i}`}>
              {/* Box */}
              <rect
                x={boxX}
                y={y}
                width={boxW}
                height={boxH}
                rx={10}
                className="fill-amber-50 stroke-amber-600 dark:fill-amber-950 dark:stroke-amber-400"
                strokeWidth={1.5}
              />

              {/* Numbered circle */}
              <circle
                cx={boxX + 22}
                cy={y + boxH / 2}
                r={circleR}
                className="fill-amber-500 dark:fill-amber-600"
              />
              <text
                x={boxX + 22}
                y={y + boxH / 2 + 4.5}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill="white"
              >
                {i + 1}
              </text>

              {/* Label */}
              <text
                x={boxX + 44}
                y={y + boxH / 2 + 4.5}
                fontSize={12}
                fontWeight={600}
                className="fill-current text-gray-800 dark:text-gray-100"
              >
                {label}
              </text>

              {/* Mini illustration */}
              {renderStepIllustration(i, boxX, y)}
            </g>
          );
        })}

        {/* ═══════════ CONNECTING ARROWS (Step 1→2, 2→3, 3→4) ═══════════ */}
        {[0, 1, 2].map((i) => {
          const fromY = stepY(i) + boxH;
          const toY = stepY(i + 1);
          const cx = boxX + boxW / 2;
          const midY = (fromY + toY) / 2;
          return (
            <g key={`arrow-${i}`}>
              <line
                x1={cx}
                y1={fromY + 2}
                x2={cx}
                y2={toY - 2}
                className="stroke-amber-500 dark:stroke-amber-400"
                strokeWidth={2}
              />
              {/* Arrowhead */}
              <polygon
                points={`${cx},${toY - 2} ${cx - 5},${midY + 2} ${cx + 5},${midY + 2}`}
                className="fill-amber-500 dark:fill-amber-400"
              />
            </g>
          );
        })}

        {/* ═══════════ LOOP-BACK ARROW (Step 4 → Step 2) ═══════════ */}
        {(() => {
          const fromY = stepY(3) + boxH / 2;
          const toY = stepY(1) + boxH / 2;
          const loopX = boxX - 20;
          return (
            <g>
              {/* Horizontal from step 4 box left edge */}
              <line
                x1={boxX}
                y1={fromY}
                x2={loopX}
                y2={fromY}
                className="stroke-amber-600 dark:stroke-amber-300"
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              {/* Vertical up */}
              <line
                x1={loopX}
                y1={fromY}
                x2={loopX}
                y2={toY}
                className="stroke-amber-600 dark:stroke-amber-300"
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              {/* Horizontal into step 2 box */}
              <line
                x1={loopX}
                y1={toY}
                x2={boxX}
                y2={toY}
                className="stroke-amber-600 dark:stroke-amber-300"
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              {/* Arrowhead pointing right into step 2 */}
              <polygon
                points={`${boxX},${toY} ${boxX - 7},${toY - 4} ${boxX - 7},${toY + 4}`}
                className="fill-amber-600 dark:fill-amber-300"
              />
              {/* "REPEAT" label on loop */}
              <text
                x={loopX - 2}
                y={(fromY + toY) / 2 + 3}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                letterSpacing="1"
                className="fill-current text-amber-700 dark:text-amber-300"
                transform={`rotate(-90, ${loopX - 2}, ${(fromY + toY) / 2 + 3})`}
              >
                REPEAT
              </text>
            </g>
          );
        })()}

        {/* ═══════════ TWILL GRID (right side) ═══════════ */}
        <g>
          {/* Label */}
          <text
            x={gridX + gridW / 2}
            y={gridY - 8}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="fill-current text-amber-700 dark:text-amber-300"
          >
            Output
          </text>

          {/* Grid cells */}
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => (
              <rect
                key={`g-${row}-${col}`}
                x={gridX + col * cellSize}
                y={gridY + row * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isOver(row, col) ? amber : gray}
                stroke={amberDark}
                strokeWidth={0.5}
                rx={1}
              />
            ))
          )}

          {/* Arrow from steps to grid */}
          <line
            x1={boxX + boxW + 8}
            y1={stepY(1) + boxH / 2}
            x2={gridX - 8}
            y2={gridY + gridW / 2}
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <polygon
            points={`${gridX - 8},${gridY + gridW / 2} ${gridX - 16},${gridY + gridW / 2 - 4} ${gridX - 16},${gridY + gridW / 2 + 4}`}
            className="fill-gray-400 dark:fill-gray-500"
          />

          {/* Result label */}
          <text
            x={gridX + gridW / 2}
            y={gridY + gridW + 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            className="fill-current text-amber-800 dark:text-amber-200"
          >
            Result: diagonal stripes!
          </text>

          {/* Diagonal highlight hint — subtle lines showing the stripe direction */}
          {[0, 1, 2].map((d) => (
            <line
              key={`diag-${d}`}
              x1={gridX + d * cellSize * 2}
              y1={gridY}
              x2={gridX + gridW}
              y2={gridY + gridW - d * cellSize * 2}
              stroke={amberDark}
              strokeWidth={0.5}
              opacity={0.3}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* ═══════════ KEY INSIGHT BOX ═══════════ */}
        <g>
          <rect
            x={30}
            y={insightY}
            width={insightW}
            height={insightH}
            rx={8}
            className="fill-amber-50 stroke-amber-400 dark:fill-amber-950 dark:stroke-amber-500"
            strokeWidth={1.5}
          />
          {/* Lightbulb icon */}
          <text
            x={46}
            y={insightY + 26}
            fontSize={16}
          >
            💡
          </text>
          <text
            x={66}
            y={insightY + 26}
            fontSize={11}
            fontWeight={700}
            className="fill-current text-amber-800 dark:text-amber-200"
          >
            An algorithm = a list of steps to finish a task.
          </text>
          <text
            x={66}
            y={insightY + 43}
            fontSize={10}
            className="fill-current text-gray-700 dark:text-gray-300"
          >
            Some algorithms repeat (like weaving). Some don't (like a recipe).
          </text>
          <text
            x={66}
            y={insightY + 58}
            fontSize={10}
            className="fill-current text-gray-600 dark:text-gray-400"
          >
            A weaver, a drummer, and a computer all follow algorithms.
          </text>
        </g>
      </svg>
    </div>
  );
}
