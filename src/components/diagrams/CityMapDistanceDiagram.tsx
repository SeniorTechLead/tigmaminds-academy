/**
 * Tara stands at a corner of Guwahati's grid map. She wants to know the
 * straight-line distance to a friend's house. Visual: a grid map with two
 * marked points, a horizontal step (Δx) along the streets, a vertical step
 * (Δy), and the diagonal hypotenuse connecting them — Pythagoras applied
 * to coordinates.
 *
 * Used to open the Distance Between Two Points section.
 */
import Tara from './people/Tara';

export default function CityMapDistanceDiagram() {
  const W = 760, H = 380;

  // Map area on the right
  const mapX = 240, mapY = 60, mapW = 480, mapH = 280;
  // Grid: 10 columns × 6 rows
  const cols = 10, rows = 6;
  const cellW = mapW / cols, cellH = mapH / rows;

  // Two points on the grid: A at (1,5), B at (8,1)
  // (grid coords: x going right, y going down on screen)
  const A = { gx: 1, gy: 5, name: 'Tara' };
  const B = { gx: 8, gy: 1, name: 'Bipin' };
  const Ax = mapX + A.gx * cellW;
  const Ay = mapY + A.gy * cellH;
  const Bx = mapX + B.gx * cellW;
  const By = mapY + B.gy * cellH;

  // dx = (8-1)=7 blocks, dy = (5-1)=4 blocks
  const dx = B.gx - A.gx;
  const dy = A.gy - B.gy; // y inverted for "north-up"
  const distance = Math.sqrt(dx * dx + dy * dy);

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara measures the straight-line distance between two points on a city grid map using Pythagoras">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="200" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Distance on a map
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Two coordinates → one distance.
        </text>

        {/* Tara on left */}
        <Tara x={120} y={350} scale={1.0} pose="thinking" />

        {/* Map background — light beige */}
        <rect x={mapX} y={mapY} width={mapW} height={mapH} fill="#fef3c7" stroke="#854d0e" strokeWidth="1.5" className="dark:fill-amber-900/30 dark:stroke-amber-700" />

        {/* Grid lines (streets) */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={mapX + i * cellW} y1={mapY} x2={mapX + i * cellW} y2={mapY + mapH}
            stroke="#94a3b8" strokeWidth="0.6" opacity="0.6" />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line key={`h${i}`} x1={mapX} y1={mapY + i * cellH} x2={mapX + mapW} y2={mapY + i * cellH}
            stroke="#94a3b8" strokeWidth="0.6" opacity="0.6" />
        ))}

        {/* Some "buildings" — rectangles in selected cells */}
        {[
          [2, 2], [3, 4], [4, 1], [5, 3], [6, 4], [7, 2], [3, 2], [4, 3],
        ].map(([gx, gy], i) => (
          <rect key={i}
            x={mapX + gx * cellW + 4} y={mapY + gy * cellH + 4}
            width={cellW - 8} height={cellH - 8}
            fill="#cbd5e1" opacity="0.6" rx="2" className="dark:fill-gray-700" />
        ))}

        {/* The right triangle path — solid straight-line, plus dashed grid path */}
        {/* Walking path: horizontal then vertical (along the streets) */}
        <line x1={Ax} y1={Ay} x2={Bx} y2={Ay}
          stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.85" />
        <line x1={Bx} y1={Ay} x2={Bx} y2={By}
          stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.85" />

        {/* Direct (as the crow flies) */}
        <line x1={Ax} y1={Ay} x2={Bx} y2={By}
          stroke="#f97316" strokeWidth="2.5" />

        {/* Δx label */}
        <rect x={(Ax + Bx) / 2 - 28} y={Ay + 12} width="56" height="20" rx="10"
          fill="#cffafe" stroke="#06b6d4" strokeWidth="1" className="dark:fill-cyan-900/40 dark:stroke-cyan-400" />
        <text x={(Ax + Bx) / 2} y={Ay + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0e7490" className="dark:fill-cyan-200">
          Δx = 7
        </text>

        {/* Δy label */}
        <rect x={Bx + 8} y={(Ay + By) / 2 - 11} width="50" height="20" rx="10"
          fill="#cffafe" stroke="#06b6d4" strokeWidth="1" className="dark:fill-cyan-900/40 dark:stroke-cyan-400" />
        <text x={Bx + 33} y={(Ay + By) / 2 + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0e7490" className="dark:fill-cyan-200">
          Δy = 4
        </text>

        {/* Hypotenuse label */}
        <rect x={(Ax + Bx) / 2 - 50} y={(Ay + By) / 2 - 28} width="100" height="22" rx="11"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={(Ax + Bx) / 2} y={(Ay + By) / 2 - 13} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          √(7² + 4²) ≈ 8.06
        </text>

        {/* Point A */}
        <circle cx={Ax} cy={Ay} r="6" fill="#f97316" stroke="white" strokeWidth="2" />
        <rect x={Ax - 30} y={Ay + 8} width="60" height="22" rx="11"
          fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-400" />
        <text x={Ax} y={Ay + 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A (1, 1)
        </text>

        {/* Point B */}
        <circle cx={Bx} cy={By} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
        <rect x={Bx - 30} y={By - 24} width="60" height="22" rx="11"
          fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-400" />
        <text x={Bx} y={By - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          B (8, 5)
        </text>

        {/* Footer */}
        <rect x={W / 2 - 230} y={H - 30} width="460" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Walk along streets: 7 + 4 = 11 blocks. Crow flies: ≈ 8.06.
        </text>
      </svg>
    </div>
  );
}
