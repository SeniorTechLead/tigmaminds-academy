export default function DistanceFormulaDiagram() {
  // Points A(2,1) and B(8,5) on a grid
  const ax = 2, ay = 1, bx = 8, by = 5;
  const scale = 40;
  const ox = 30, oy = 310; // origin offset

  const toX = (v: number) => ox + v * scale;
  const toY = (v: number) => oy - v * scale;

  return (
    <div className="my-4">
      <svg viewBox="0 0 420 367" className="w-full max-w-lg mx-auto" role="img" aria-label="Distance formula diagram">
        {/* Grid lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <g key={`grid-${i}`}>
            <line x1={toX(i)} y1={toY(0)} x2={toX(i)} y2={toY(7)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <line x1={toX(0)} y1={toY(i)} x2={toX(9)} y2={toY(i)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={toX(0)} y1={toY(0)} x2={toX(9)} y2={toY(0)} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={toX(0)} y1={toY(0)} x2={toX(0)} y2={toY(7)} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Axis labels */}
        {Array.from({ length: 10 }, (_, i) => (
          <text key={`xl-${i}`} x={toX(i)} y={toY(0) + 14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{i}</text>
        ))}
        {Array.from({ length: 8 }, (_, i) => i > 0 && (
          <text key={`yl-${i}`} x={toX(0) - 10} y={toY(i) + 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{i}</text>
        ))}

        {/* Right triangle */}
        {/* Horizontal leg (dx) */}
        <line x1={toX(ax)} y1={toY(ay)} x2={toX(bx)} y2={toY(ay)} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" strokeDasharray="6,3" />
        {/* Vertical leg (dy) */}
        <line x1={toX(bx)} y1={toY(ay)} x2={toX(bx)} y2={toY(by)} className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeDasharray="6,3" />
        {/* Hypotenuse (d) */}
        <line x1={toX(ax)} y1={toY(ay)} x2={toX(bx)} y2={toY(by)} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />

        {/* Right angle marker */}
        <polyline points={`${toX(bx) - 8},${toY(ay)} ${toX(bx) - 8},${toY(ay) - 8} ${toX(bx)},${toY(ay) - 8}`}
          fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Labels on legs */}
        <text x={(toX(ax) + toX(bx)) / 2} y={toY(ay) + 18} textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="12" fontWeight="600">
          dx = {bx - ax}
        </text>
        <text x={toX(bx) + 16} y={(toY(ay) + toY(by)) / 2 + 4} textAnchor="start" className="fill-emerald-600 dark:fill-emerald-300" fontSize="12" fontWeight="600">
          dy = {by - ay}
        </text>

        {/* Label on hypotenuse */}
        <text x={(toX(ax) + toX(bx)) / 2 - 25} y={(toY(ay) + toY(by)) / 2 - 8} className="fill-red-600 dark:fill-red-300" fontSize="12" fontWeight="bold"
          transform={`rotate(-33.7, ${(toX(ax) + toX(bx)) / 2 - 25}, ${(toY(ay) + toY(by)) / 2 - 8})`}>
          d = ?
        </text>

        {/* Points */}
        <circle cx={toX(ax)} cy={toY(ay)} r="5" className="fill-violet-500 dark:fill-violet-400" />
        <text x={toX(ax) - 8} y={toY(ay) - 10} className="fill-violet-700 dark:fill-violet-300" fontSize="11" fontWeight="600">A ({ax},{ay})</text>
        <circle cx={toX(bx)} cy={toY(by)} r="5" className="fill-violet-500 dark:fill-violet-400" />
        <text x={toX(bx) - 8} y={toY(by) - 10} className="fill-violet-700 dark:fill-violet-300" fontSize="11" fontWeight="600">B ({bx},{by})</text>

        {/* Formula box */}
        <rect x="140" y="5" width="250" height="52" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="265" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
          d = √(dx² + dy²)
        </text>
        <text x="265" y="38" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          = √(6² + 4²) = √(36 + 16) = √52 ≈ 7.21
        </text>
        <text x="265" y="52" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="600">
          Distance = 7.21 units
        </text>
      </svg>
    </div>
  );
}
