export default function HeightDistanceDiagram() {
  const w = 450, h = 300;

  // Ground line
  const groundY = 240;
  const personX = 80;
  const treeX = 350;
  const treeTopY = 50;

  // Person (stick figure)
  const personTop = groundY - 50;
  const eyeY = personTop + 8;

  // Angle of elevation
  const d = treeX - personX;
  const treeH = groundY - treeTopY;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Height and distance diagram with angle of elevation">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Ground */}
        <line x1={30} y1={groundY} x2={420} y2={groundY} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        {/* Grass ticks */}
        {Array.from({ length: 16 }, (_, i) => 45 + i * 24).map((x, i) => (
          <line key={i} x1={x} y1={groundY} x2={x - 4} y2={groundY + 6} className="stroke-green-500 dark:stroke-green-600" strokeWidth="1" />
        ))}

        {/* Person stick figure */}
        <circle cx={personX} cy={personTop} r="8" className="fill-blue-200 dark:fill-blue-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
        <line x1={personX} y1={personTop + 8} x2={personX} y2={groundY - 10} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        {/* Arms */}
        <line x1={personX - 12} y1={personTop + 22} x2={personX + 12} y2={personTop + 22} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        {/* Legs */}
        <line x1={personX} y1={groundY - 10} x2={personX - 10} y2={groundY} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <line x1={personX} y1={groundY - 10} x2={personX + 10} y2={groundY} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Tree trunk */}
        <rect x={treeX - 8} y={treeTopY + 40} width={16} height={groundY - treeTopY - 40} rx="3" className="fill-amber-700 dark:fill-amber-800" />
        {/* Tree crown */}
        <ellipse cx={treeX} cy={treeTopY + 25} rx={35} ry={30} className="fill-green-500 dark:fill-green-700" />
        <ellipse cx={treeX - 18} cy={treeTopY + 38} rx={22} ry={20} className="fill-green-600 dark:fill-green-800" />
        <ellipse cx={treeX + 18} cy={treeTopY + 38} rx={22} ry={20} className="fill-green-600 dark:fill-green-800" />

        {/* Line of sight (dashed) */}
        <line x1={personX + 8} y1={eyeY} x2={treeX} y2={treeTopY + 40}
          stroke="#f97316" strokeWidth="1.5" strokeDasharray="6 3" />

        {/* Horizontal sight line (dashed) */}
        <line x1={personX + 8} y1={eyeY} x2={treeX} y2={eyeY}
          stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

        {/* Angle of elevation arc */}
        <path
          d={`M ${personX + 50} ${eyeY} A 42 42 0 0 0 ${personX + 44} ${eyeY - 25}`}
          fill="none" stroke="#f97316" strokeWidth="2"
        />
        <text x={personX + 60} y={eyeY - 10} fontSize="14" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">θ</text>

        {/* Distance d (along ground) */}
        <line x1={personX} y1={groundY + 20} x2={treeX} y2={groundY + 20} className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.5" markerStart="url(#dimArrowL)" markerEnd="url(#dimArrowR)" />
        <defs>
          <marker id="dimArrowL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6 Z" className="fill-purple-500 dark:fill-purple-400" />
          </marker>
          <marker id="dimArrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-purple-500 dark:fill-purple-400" />
          </marker>
        </defs>
        <text x={(personX + treeX) / 2} y={groundY + 35} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">d = 50 m</text>

        {/* Height h */}
        <line x1={treeX + 30} y1={groundY} x2={treeX + 30} y2={treeTopY + 40} className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" markerStart="url(#dimArrowU)" markerEnd="url(#dimArrowD)" />
        <defs>
          <marker id="dimArrowU" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
            <path d="M0,0 L3,6 L6,0 Z" className="fill-red-500 dark:fill-red-400" />
          </marker>
          <marker id="dimArrowD" markerWidth="6" markerHeight="6" refX="3" refY="1" orient="auto">
            <path d="M0,6 L3,0 L6,6 Z" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>
        <text x={treeX + 42} y={(groundY + treeTopY + 40) / 2 + 4} fontSize="12" fontWeight="600" className="fill-red-600 dark:fill-red-400">h</text>

        {/* Formula box */}
        <rect x={10} y={10} width={180} height={55} rx="8" className="fill-gray-50 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x={100} y={30} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">h = d × tan(θ)</text>
        <text x={100} y={50} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">= 50 × tan(30°) ≈ 28.9 m</text>
      </svg>
    </div>
  );
}
