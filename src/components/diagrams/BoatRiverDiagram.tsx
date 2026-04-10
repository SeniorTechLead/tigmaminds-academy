'use client';

/**
 * Static boat-crossing-river diagram.
 * Shows motor vector (north), current vector (east), resultant diagonal,
 * right triangle with labeled legs (3, 8) and hypotenuse (√73 ≈ 8.5),
 * and the angle θ ≈ 69°.
 *
 * This is the EXPLANATORY diagram — it matches the text exactly.
 * The interactive VectorBoatDiagram is for exploration.
 */
export default function BoatRiverDiagram() {
  // Layout constants
  const W = 340, H = 300;
  const ox = 80, oy = H - 50;
  const scale = 25;

  // Vectors
  const motor = { x: 0, y: 8 };   // north
  const current = { x: 3, y: 0 };  // east
  const result = { x: 3, y: 8 };

  const px = (x: number) => ox + x * scale;
  const py = (y: number) => oy - y * scale;

  return (
    <div className="bg-gradient-to-b from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl p-3 my-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto">
        {/* Water background */}
        <rect x="0" y="0" width={W} height={H} rx="8" fill="none" />

        {/* Wave lines for water effect */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <path
            key={i}
            d={`M 0 ${50 + i * 35} Q ${W / 4} ${45 + i * 35} ${W / 2} ${50 + i * 35} T ${W} ${50 + i * 35}`}
            fill="none" stroke="#bae6fd" strokeWidth="0.5" opacity="0.5"
            className="dark:stroke-sky-800"
          />
        ))}

        {/* Boat emoji at origin */}
        <text x={ox - 2} y={oy + 6} textAnchor="middle" className="text-[16px]">⛵</text>

        {/* STEP 1: Motor vector (blue, north) */}
        <line x1={px(0)} y1={py(0)} x2={px(motor.x)} y2={py(motor.y)} stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points={`${px(0)},${py(8)} ${px(0) - 6},${py(7.3)} ${px(0) + 6},${py(7.3)}`} fill="#2563eb" />
        <text x={px(0) - 16} y={py(4)} textAnchor="end" className="fill-blue-600 dark:fill-blue-400 text-[12px] font-bold">Motor</text>
        <text x={px(0) - 16} y={py(4) + 14} textAnchor="end" className="fill-blue-500 dark:fill-blue-400 text-[11px]">8 km/h</text>

        {/* STEP 2: Current vector (red, east) */}
        <line x1={px(0)} y1={py(0)} x2={px(current.x)} y2={py(0)} stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points={`${px(3)},${py(0)} ${px(2.4)},${py(0) - 6} ${px(2.4)},${py(0) + 6}`} fill="#dc2626" />
        <text x={px(1.5)} y={py(0) + 20} textAnchor="middle" className="fill-red-600 dark:fill-red-400 text-[12px] font-bold">Current</text>
        <text x={px(1.5)} y={py(0) + 33} textAnchor="middle" className="fill-red-500 dark:fill-red-400 text-[11px]">3 km/h</text>

        {/* STEP 3: Dashed right-triangle sides */}
        {/* Vertical dashed from result tip down to current tip */}
        <line x1={px(3)} y1={py(8)} x2={px(3)} y2={py(0)} stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" />
        {/* Horizontal dashed from motor tip to result tip */}
        <line x1={px(0)} y1={py(8)} x2={px(3)} y2={py(8)} stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" />

        {/* Right angle marker at result tip */}
        <polyline points={`${px(3) - 10},${py(0)} ${px(3) - 10},${py(0) - 10} ${px(3)},${py(0) - 10}`}
          fill="none" stroke="#6b7280" strokeWidth="1.5" />

        {/* STEP 4: Resultant (green, diagonal) */}
        <line x1={px(0)} y1={py(0)} x2={px(result.x)} y2={py(result.y)} stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
        {/* Arrow head for resultant */}
        {(() => {
          const dx = px(3) - px(0), dy = py(8) - py(0);
          const len = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / len, uy = dy / len;
          const sz = 10;
          return <polygon points={`${px(3)},${py(8)} ${px(3) - sz * ux + (sz / 2.5) * uy},${py(8) - sz * uy - (sz / 2.5) * ux} ${px(3) - sz * ux - (sz / 2.5) * uy},${py(8) - sz * uy + (sz / 2.5) * ux}`} fill="#16a34a" />;
        })()}

        {/* Labels on the triangle */}
        {/* Leg label: 3 (bottom) */}
        <text x={px(1.5)} y={py(0) - 6} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-[11px] font-semibold">3</text>
        {/* Leg label: 8 (right side) */}
        <text x={px(3) + 14} y={py(4)} textAnchor="start" className="fill-gray-700 dark:fill-gray-300 text-[11px] font-semibold">8</text>
        {/* Hypotenuse label */}
        <text x={px(1.2) + 4} y={py(4.5) - 4} textAnchor="start" className="fill-green-700 dark:fill-green-300 text-[12px] font-bold"
          transform={`rotate(-69, ${px(1.2) + 4}, ${py(4.5) - 4})`}>
          √73 ≈ 8.5
        </text>

        {/* Angle arc at origin */}
        <path
          d={`M ${px(0) + 22} ${py(0)} A 22 22 0 0 0 ${px(0) + 22 * Math.cos(69 * Math.PI / 180)} ${py(0) - 22 * Math.sin(69 * Math.PI / 180)}`}
          fill="none" stroke="#f59e0b" strokeWidth="2"
        />
        <text x={px(0) + 30} y={py(0) - 14} className="fill-amber-600 dark:fill-amber-400 text-[11px] font-bold">69°</text>

        {/* Result label */}
        <text x={px(3) + 8} y={py(8) + 4} className="fill-green-700 dark:fill-green-300 text-[11px] font-bold">Actual path</text>
      </svg>
    </div>
  );
}
