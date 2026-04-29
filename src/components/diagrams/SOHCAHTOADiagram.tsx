export default function SOHCAHTOADiagram() {
  const w = 450, h = 300;

  // Triangle vertices
  const A = { x: 60, y: 240 };  // bottom-left (angle θ)
  const B = { x: 310, y: 240 }; // bottom-right (right angle)
  const C = { x: 310, y: 60 };  // top-right

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="SOHCAHTOA right triangle diagram">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Triangle fill */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          className="fill-blue-50 dark:fill-blue-900/20"
        />

        {/* Triangle edges */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2.5" />
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2.5" />
        <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2.5" />

        {/* Right angle square */}
        <polyline
          points={`${B.x - 18},${B.y} ${B.x - 18},${B.y - 18} ${B.x},${B.y - 18}`}
          fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5"
        />

        {/* Angle θ arc */}
        <path
          d={`M ${A.x + 45} ${A.y} A 45 45 0 0 0 ${A.x + 40} ${A.y - 22}`}
          fill="none" className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2"
        />
        <text x={A.x + 52} y={A.y - 10} fontSize="16" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">θ</text>

        {/* Side labels */}
        {/* Adjacent (bottom) */}
        <text x={(A.x + B.x) / 2} y={A.y + 25} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          Adjacent (A)
        </text>

        {/* Opposite (right side) */}
        <text x={B.x + 16} y={(B.y + C.y) / 2 + 5} fontSize="13" fontWeight="700" className="fill-red-600 dark:fill-red-400" textAnchor="start"
          transform={`rotate(-90, ${B.x + 16}, ${(B.y + C.y) / 2 + 5})`}
        >
          Opposite (O)
        </text>

        {/* Hypotenuse */}
        <text x={(A.x + C.x) / 2 - 30} y={(A.y + C.y) / 2 - 10} fontSize="13" fontWeight="700" className="fill-blue-600 dark:fill-blue-400"
          textAnchor="middle"
          transform={`rotate(-36, ${(A.x + C.x) / 2 - 30}, ${(A.y + C.y) / 2 - 10})`}
        >
          Hypotenuse (H)
        </text>

        {/* Formulas */}
        <rect x={340} y={30} width={100} height={100} rx="8" className="fill-gray-50 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        <text x={390} y={55} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-600 dark:fill-red-400">
          sin θ = O / H
        </text>
        <text x={390} y={82} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          cos θ = A / H
        </text>
        <text x={390} y={109} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          tan θ = O / A
        </text>

        {/* Mnemonic */}
        <rect x={325} y={150} width={118} height={30} rx="6" className="fill-orange-50 dark:fill-orange-900/30 stroke-orange-300 dark:stroke-orange-600" strokeWidth="1" />
        <text x={384} y={170} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-orange-700 dark:fill-orange-300">
          SOH CAH TOA
        </text>
      </svg>
    </div>
  );
}
