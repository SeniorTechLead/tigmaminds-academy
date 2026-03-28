export default function NaturalSelectionDiagram() {
  const stageW = 160;
  const stageH = 160;
  const gap = 20;
  const startX = 15;
  const startY = 40;

  /* Beetle: small oval with legs */
  const Beetle = ({ x, y, color, dead }: { x: number; y: number; color: string; dead?: boolean }) => (
    <g>
      <ellipse cx={x} cy={y} rx={7} ry={5} className={color} />
      {/* Legs */}
      <line x1={x - 5} y1={y + 2} x2={x - 9} y2={y + 7} stroke="currentColor" className="text-gray-600 dark:text-gray-400" strokeWidth="0.8" />
      <line x1={x + 5} y1={y + 2} x2={x + 9} y2={y + 7} stroke="currentColor" className="text-gray-600 dark:text-gray-400" strokeWidth="0.8" />
      <line x1={x - 3} y1={y + 3} x2={x - 7} y2={y + 8} stroke="currentColor" className="text-gray-600 dark:text-gray-400" strokeWidth="0.8" />
      <line x1={x + 3} y1={y + 3} x2={x + 7} y2={y + 8} stroke="currentColor" className="text-gray-600 dark:text-gray-400" strokeWidth="0.8" />
      {dead && (
        <text x={x} y={y + 2} textAnchor="middle" className="fill-red-600" fontSize="12" fontWeight="bold">&times;</text>
      )}
    </g>
  );

  /* Leaf background for each stage */
  const LeafBg = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
    <rect x={x} y={y} width={w} height={h} rx="8" className="fill-green-100 dark:fill-green-900/25 stroke-green-400 dark:stroke-green-600" strokeWidth="1.5" />
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 250" className="w-full max-w-2xl mx-auto" role="img" aria-label="Natural selection on beetle color">
        {/* Title */}
        <text x="270" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Natural Selection: Beetle Color on Green Leaves
        </text>

        {/* ── Stage 1: Variation ── */}
        <LeafBg x={startX} y={startY} w={stageW} h={stageH} />
        <text x={startX + stageW / 2} y={startY + 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
          1. Variation
        </text>
        {/* Mix of green and brown beetles */}
        <Beetle x={startX + 30} y={startY + 45} color="fill-green-600 dark:fill-green-500" />
        <Beetle x={startX + 60} y={startY + 55} color="fill-amber-800 dark:fill-amber-700" />
        <Beetle x={startX + 90} y={startY + 40} color="fill-green-600 dark:fill-green-500" />
        <Beetle x={startX + 120} y={startY + 50} color="fill-amber-800 dark:fill-amber-700" />
        <Beetle x={startX + 45} y={startY + 80} color="fill-amber-800 dark:fill-amber-700" />
        <Beetle x={startX + 80} y={startY + 75} color="fill-green-600 dark:fill-green-500" />
        <Beetle x={startX + 110} y={startY + 85} color="fill-green-600 dark:fill-green-500" />
        <Beetle x={startX + 130} y={startY + 100} color="fill-amber-800 dark:fill-amber-700" />
        <Beetle x={startX + 35} y={startY + 110} color="fill-green-600 dark:fill-green-500" />
        <Beetle x={startX + 75} y={startY + 115} color="fill-amber-800 dark:fill-amber-700" />

        <text x={startX + stageW / 2} y={startY + stageH + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          5 green, 5 brown
        </text>

        {/* Arrow 1 → 2 */}
        <line x1={startX + stageW + 4} y1={startY + stageH / 2} x2={startX + stageW + gap - 4} y2={startY + stageH / 2}
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" markerEnd="url(#nsArrow)" />

        {/* ── Stage 2: Selection ── */}
        <LeafBg x={startX + stageW + gap} y={startY} w={stageW} h={stageH} />
        {(() => {
          const sx = startX + stageW + gap;
          return (
            <>
              <text x={sx + stageW / 2} y={startY + 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
                2. Selection
              </text>
              {/* Bird predator */}
              <text x={sx + stageW / 2} y={startY + 35} textAnchor="middle" fontSize="18">🐦</text>
              <text x={sx + stageW / 2} y={startY + 48} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
                birds eat visible beetles
              </text>

              {/* Green beetles survive (camouflaged) */}
              <Beetle x={sx + 30} y={startY + 70} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 70} y={startY + 65} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 110} y={startY + 75} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 50} y={startY + 100} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 90} y={startY + 95} color="fill-green-600 dark:fill-green-500" />

              {/* Brown beetles eaten (X marks) */}
              <Beetle x={sx + 130} y={startY + 105} color="fill-amber-800 dark:fill-amber-700" dead />
              <Beetle x={sx + 35} y={startY + 125} color="fill-amber-800 dark:fill-amber-700" dead />
              <Beetle x={sx + 90} y={startY + 130} color="fill-amber-800 dark:fill-amber-700" dead />
            </>
          );
        })()}

        <text x={startX + stageW + gap + stageW / 2} y={startY + stageH + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Brown beetles spotted &amp; eaten
        </text>

        {/* Arrow 2 → 3 */}
        <line x1={startX + 2 * stageW + gap + 4} y1={startY + stageH / 2} x2={startX + 2 * stageW + 2 * gap - 4} y2={startY + stageH / 2}
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" markerEnd="url(#nsArrow)" />

        {/* ── Stage 3: Inheritance ── */}
        <LeafBg x={startX + 2 * (stageW + gap)} y={startY} w={stageW} h={stageH} />
        {(() => {
          const sx = startX + 2 * (stageW + gap);
          return (
            <>
              <text x={sx + stageW / 2} y={startY + 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
                3. Inheritance
              </text>
              <text x={sx + stageW / 2} y={startY + 30} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
                next generation
              </text>

              {/* Mostly green beetles */}
              <Beetle x={sx + 25} y={startY + 50} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 55} y={startY + 45} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 85} y={startY + 55} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 115} y={startY + 48} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 40} y={startY + 75} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 70} y={startY + 80} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 100} y={startY + 78} color="fill-green-600 dark:fill-green-500" />
              <Beetle x={sx + 130} y={startY + 85} color="fill-green-600 dark:fill-green-500" />
              {/* Few brown remain */}
              <Beetle x={sx + 55} y={startY + 110} color="fill-amber-800 dark:fill-amber-700" />
              <Beetle x={sx + 100} y={startY + 115} color="fill-amber-800 dark:fill-amber-700" />
            </>
          );
        })()}

        <text x={startX + 2 * (stageW + gap) + stageW / 2} y={startY + stageH + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          8 green, 2 brown
        </text>

        {/* Bottom label — process flow */}
        <text x="270" y="235" textAnchor="middle" className="fill-indigo-600 dark:fill-indigo-400" fontSize="12" fontWeight="bold">
          Variation → Selection → Inheritance
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="nsArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
