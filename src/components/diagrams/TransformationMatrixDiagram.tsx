export default function TransformationMatrixDiagram() {
  // Unit square vertices: (0,0), (1,0), (1,1), (0,1)
  // Matrix [[2, 1], [0, 1]] transforms them to: (0,0), (2,0), (3,1), (1,1)
  const ox = 50, oy = 280, s = 70;
  const toX = (x: number) => ox + x * s;
  const toY = (y: number) => oy - y * s;

  return (
    <div className="my-4">
      <svg viewBox="0 0 440 395" className="w-full max-w-md mx-auto" role="img" aria-label="Transformation matrix diagram showing a unit square being transformed into a parallelogram">
        <text x="200" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Matrix Transformation</text>

        {/* Grid */}
        {Array.from({ length: 6 }, (_, i) => i - 1).map(v => (
          <g key={`g${v}`}>
            <line x1={toX(v)} y1={toY(-0.5)} x2={toX(v)} y2={toY(3.5)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <line x1={toX(-1)} y1={toY(v)} x2={toX(5)} y2={toY(v)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={toX(-1)} y1={oy} x2={toX(5)} y2={oy} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={ox} y1={toY(-0.5)} x2={ox} y2={toY(3.5)} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <text x={toX(5) + 10} y={oy + 5} className="fill-gray-500 dark:fill-gray-400" fontSize="11">x</text>
        <text x={ox + 8} y={toY(3.5) - 3} className="fill-gray-500 dark:fill-gray-400" fontSize="11">y</text>

        {/* Axis numbers */}
        {[1, 2, 3, 4].map(v => (
          <text key={`xn${v}`} x={toX(v)} y={oy + 15} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">{v}</text>
        ))}
        {[1, 2, 3].map(v => (
          <text key={`yn${v}`} x={ox - 12} y={toY(v) + 4} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="10">{v}</text>
        ))}

        {/* Unit square (before) */}
        <polygon
          points={`${toX(0)},${toY(0)} ${toX(1)},${toY(0)} ${toX(1)},${toY(1)} ${toX(0)},${toY(1)}`}
          className="fill-blue-200 dark:fill-blue-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" opacity="0.6"
        />
        <text x={toX(0.5)} y={toY(0.5) + 4} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">Before</text>

        {/* Vertex labels (before) */}
        <text x={toX(0) - 5} y={toY(0) + 12} className="fill-blue-600 dark:fill-blue-400" fontSize="10">(0,0)</text>
        <text x={toX(1) + 3} y={toY(0) + 12} className="fill-blue-600 dark:fill-blue-400" fontSize="10">(1,0)</text>
        <text x={toX(1) + 3} y={toY(1) - 3} className="fill-blue-600 dark:fill-blue-400" fontSize="10">(1,1)</text>
        <text x={toX(0) - 5} y={toY(1) - 3} className="fill-blue-600 dark:fill-blue-400" fontSize="10">(0,1)</text>

        {/* Transformed parallelogram (after) - matrix [[2,1],[0,1]] */}
        <polygon
          points={`${toX(0)},${toY(0)} ${toX(2)},${toY(0)} ${toX(3)},${toY(1)} ${toX(1)},${toY(1)}`}
          className="fill-red-200 dark:fill-red-800 stroke-red-500 dark:stroke-red-400" strokeWidth="2" opacity="0.6"
        />
        <text x={toX(1.5)} y={toY(0.5) + 4} textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">After</text>

        {/* Vertex labels (after) */}
        <text x={toX(2) + 3} y={toY(0) + 12} className="fill-red-600 dark:fill-red-400" fontSize="10">(2,0)</text>
        <text x={toX(3) + 3} y={toY(1) - 3} className="fill-red-600 dark:fill-red-400" fontSize="10">(3,1)</text>
        <text x={toX(1) + 3} y={toY(1) - 18} className="fill-red-600 dark:fill-red-400" fontSize="10">(1,1)</text>

        {/* Transformation arrow */}
        <path d="M 120,100 Q 170,80 220,100" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#tmArrow)" />

        {/* Matrix display */}
        <rect x="240" y="55" width="140" height="60" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
        <text x="310" y="72" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Matrix:</text>
        <text x="290" y="92" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">[ 2  1 ]</text>
        <text x="290" y="108" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">[ 0  1 ]</text>

        {/* Explanation */}
        <text x="200" y="330" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">The unit square is sheared into a parallelogram by the 2x2 matrix</text>
        <text x="200" y="345" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Each vertex (x,y) maps to (2x+y, y)</text>

        <defs>
          <marker id="tmArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
