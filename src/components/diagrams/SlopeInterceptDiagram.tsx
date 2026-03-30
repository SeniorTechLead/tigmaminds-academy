export default function SlopeInterceptDiagram() {
  // Coordinate system: origin at (200, 200), scale 20px per unit
  const ox = 200, oy = 200, s = 20;
  const toX = (x: number) => ox + x * s;
  const toY = (y: number) => oy - y * s;

  return (
    <div className="my-4">
      <svg viewBox="0 0 420 395" className="w-full max-w-md mx-auto" role="img" aria-label="Slope intercept diagram with three lines showing positive, zero, and negative slopes">
        <text x="200" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Slope-Intercept Form: y = mx + b</text>

        {/* Grid */}
        {Array.from({ length: 19 }, (_, i) => i - 9).map(v => (
          <g key={`g${v}`}>
            <line x1={toX(v)} y1={toY(-7)} x2={toX(v)} y2={toY(7)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <line x1={toX(-9)} y1={toY(v)} x2={toX(9)} y2={toY(v)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={toX(-9)} y1={oy} x2={toX(9)} y2={oy} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={ox} y1={toY(-7)} x2={ox} y2={toY(7)} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <text x={toX(9) + 10} y={oy + 5} className="fill-gray-500 dark:fill-gray-400" fontSize="11">x</text>
        <text x={ox + 8} y={toY(7) - 3} className="fill-gray-500 dark:fill-gray-400" fontSize="11">y</text>

        {/* Axis numbers */}
        {[-8, -4, 4, 8].map(v => (
          <g key={`n${v}`}>
            <text x={toX(v)} y={oy + 15} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">{v}</text>
          </g>
        ))}
        {[-4, 4].map(v => (
          <text key={`ny${v}`} x={ox - 12} y={toY(v) + 4} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="10">{v}</text>
        ))}

        {/* Positive slope line: y = x + 1 (blue) */}
        <line x1={toX(-7)} y1={toY(-6)} x2={toX(6)} y2={toY(7)} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />
        <circle cx={toX(0)} cy={toY(1)} r="4" className="fill-blue-500" />
        <text x={toX(5)} y={toY(5.5)} className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">y = x + 1</text>
        <text x={toX(5)} y={toY(4.8)} className="fill-blue-500 dark:fill-blue-400" fontSize="10">slope = +1</text>

        {/* Rise/run triangle on the blue line */}
        <line x1={toX(2)} y1={toY(3)} x2={toX(4)} y2={toY(3)} className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" strokeDasharray="3,2" />
        <line x1={toX(4)} y1={toY(3)} x2={toX(4)} y2={toY(5)} className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x={toX(3)} y={toY(2.5)} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">run=2</text>
        <text x={toX(4.6)} y={toY(4)} className="fill-amber-600 dark:fill-amber-400" fontSize="10">rise=2</text>

        {/* Zero slope line: y = 2 (green horizontal) */}
        <line x1={toX(-8)} y1={toY(-2)} x2={toX(8)} y2={toY(-2)} className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />
        <text x={toX(-7)} y={toY(-2.8)} className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">y = -2</text>
        <text x={toX(-7)} y={toY(-3.5)} className="fill-emerald-500 dark:fill-emerald-400" fontSize="10">slope = 0</text>

        {/* Negative slope line: y = -0.5x + 3 (red) */}
        <line x1={toX(-6)} y1={toY(6)} x2={toX(8)} y2={toY(-1)} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />
        <circle cx={toX(0)} cy={toY(3)} r="4" className="fill-red-500" />
        <text x={toX(-7)} y={toY(5)} className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">y = -0.5x + 3</text>
        <text x={toX(-7)} y={toY(4.3)} className="fill-red-500 dark:fill-red-400" fontSize="10">slope = -0.5</text>

        {/* Y-intercept dots */}
        <text x={toX(0.5)} y={toY(1) + 4} className="fill-blue-500 dark:fill-blue-400" fontSize="10">b=1</text>
        <text x={toX(0.5)} y={toY(3) + 4} className="fill-red-500 dark:fill-red-400" fontSize="10">b=3</text>

        {/* Legend */}
        <text x="200" y="330" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">m = slope (rise/run), b = y-intercept</text>
        <text x="200" y="345" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Positive slope goes up, negative goes down, zero is flat</text>
      </svg>
    </div>
  );
}
