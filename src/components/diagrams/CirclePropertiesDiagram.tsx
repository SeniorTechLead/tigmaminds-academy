export default function CirclePropertiesDiagram() {
  const cx = 180;
  const cy = 150;
  const r = 100;

  return (
    <div className="my-4">
      <svg viewBox="0 0 420 368" className="w-full max-w-md mx-auto" role="img" aria-label="Circle properties diagram">
        {/* Title */}
        <text x="200" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Properties of a Circle
        </text>

        {/* Circle */}
        <circle cx={cx} cy={cy} r={r}
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />

        {/* Circumference highlight arc */}
        <path
          d={`M ${cx + r * Math.cos(-0.3)},${cy + r * Math.sin(-0.3)} A ${r},${r} 0 0 1 ${cx + r * Math.cos(0.8)},${cy + r * Math.sin(0.8)}`}
          fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="4" />
        {/* Circumference label */}
        <text x={cx + r + 20} y={cy - 30} className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="600">
          Circumference
        </text>
        <line x1={cx + r + 18} y1={cy - 25} x2={cx + r * Math.cos(-0.1) + 3} y2={cy + r * Math.sin(-0.1)}
          className="stroke-emerald-400" strokeWidth="1" />

        {/* Center point */}
        <circle cx={cx} cy={cy} r="4" className="fill-red-500 dark:fill-red-400" />
        <text x={cx + 8} y={cy - 8} className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="600">Center</text>

        {/* Radius */}
        <line x1={cx} y1={cy} x2={cx + r * Math.cos(Math.PI / 4)} y2={cy - r * Math.sin(Math.PI / 4)}
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <text x={cx + 35} y={cy - 45} className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="bold">r</text>
        <text x={cx + 35} y={cy - 33} className="fill-gray-500 dark:fill-gray-400" fontSize="10">(radius)</text>

        {/* Diameter */}
        <line x1={cx - r * Math.cos(Math.PI / 6)} y1={cy + r * Math.sin(Math.PI / 6)}
          x2={cx + r * Math.cos(Math.PI / 6)} y2={cy - r * Math.sin(Math.PI / 6)}
          className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="6,3" />
        <text x={cx - 60} y={cy + 65} className="fill-purple-600 dark:fill-purple-400" fontSize="11" fontWeight="bold">d = 2r</text>
        <text x={cx - 60} y={cy + 78} className="fill-gray-500 dark:fill-gray-400" fontSize="10">(diameter)</text>

        {/* Formulas box */}
        <rect x="10" y="275" width="380" height="60" rx="8"
          className="fill-gray-50 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        <text x="30" y="298" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Formulas:</text>

        <text x="30" y="318" className="fill-blue-600 dark:fill-blue-400" fontSize="11">
          Circumference: C = 2πr
        </text>
        <text x="220" y="318" className="fill-amber-600 dark:fill-amber-400" fontSize="11">
          Area: A = πr²
        </text>

        {/* Pi relationship */}
        <text x="200" y="260" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          π ≈ 3.14159... = C ÷ d (ratio of circumference to diameter)
        </text>
      </svg>
    </div>
  );
}
