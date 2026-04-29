/**
 * Tara has 24 chocolates and wants to know all the ways she can share them
 * equally among friends. Each row is one factor pair: rows × cols = 24.
 * Visual proof of factoring — every grid layout matches a factor pair.
 *
 * Used to open the Factors and Multiples section.
 */
import Tara from './people/Tara';

export default function SharingChocolatesDiagram() {
  const W = 720, H = 380;

  // Five factor-pair layouts of 24
  const layouts = [
    { rows: 1, cols: 24, label: '1 × 24' },
    { rows: 2, cols: 12, label: '2 × 12' },
    { rows: 3, cols: 8,  label: '3 × 8' },
    { rows: 4, cols: 6,  label: '4 × 6' },
  ];

  // Layout in left half is Tara's introduction; right half is the grid stack
  const taraX = 80, groundY = 320;

  // Right pane: stacked mini-grids showing each factor pair
  const stackX = 240, stackTop = 90, rowSpacing = 56;
  const cell = 14;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara discovers all the ways to share 24 chocolates equally">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Tara on left, looking thoughtful */}
        <Tara x={taraX} y={groundY} scale={1.1} pose="thinking" />

        {/* Speech bubble from Tara — placed ABOVE her, away from the chocolate grids */}
        <path d={`M ${taraX - 8} ${groundY - 138} L ${taraX} ${groundY - 128} L ${taraX + 4} ${groundY - 138} Z`}
          fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <rect x={taraX - 80} y={groundY - 188} width="170" height="52" rx="14"
          fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x={taraX + 5} y={groundY - 170} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          I have 24 chocolates.
        </text>
        <text x={taraX + 5} y={groundY - 154} textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          How many ways can I share
        </text>
        <text x={taraX + 5} y={groundY - 141} textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          them equally?
        </text>

        {/* Caption */}
        <rect x="20" y="14" width="240" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Factors of 24
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Each grid is one way to share evenly.
        </text>

        {/* Right pane: stacked grids */}
        {layouts.map((layout, i) => {
          const yTop = stackTop + i * rowSpacing;
          const gridWidth = layout.cols * cell;
          // For the very wide 1×24 layout, scale down so it fits
          const scaleX = layout.cols > 16 ? 0.6 : 1;
          const cellW = cell * scaleX;
          const totalW = layout.cols * cellW;
          const xStart = stackX;

          return (
            <g key={layout.label}>
              {/* Label */}
              <rect x={xStart - 60} y={yTop + (layout.rows * cell - 22) / 2} width="50" height="22" rx="11"
                fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
              <text x={xStart - 35} y={yTop + (layout.rows * cell + 4) / 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
                {layout.label}
              </text>

              {/* Chocolates */}
              {Array.from({ length: layout.rows }).map((_, r) =>
                Array.from({ length: layout.cols }).map((_, c) => (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={xStart + c * cellW + 1}
                      y={yTop + r * cell + 1}
                      width={cellW - 2}
                      height={cell - 2}
                      rx="2"
                      fill="#7c2d12"
                      stroke="#451a03"
                      strokeWidth="0.5"
                    />
                    {/* Small highlight on chocolate */}
                    <rect
                      x={xStart + c * cellW + 2}
                      y={yTop + r * cell + 2}
                      width={cellW - 4}
                      height={2}
                      fill="#a16207"
                      opacity="0.6"
                    />
                  </g>
                ))
              )}

              {/* Total = label */}
              <text x={xStart + totalW + 10} y={yTop + (layout.rows * cell + 4) / 2} fontSize="11" fontWeight="600" fill="#475569" className="dark:fill-gray-300">
                = 24 ✓
              </text>
            </g>
          );
        })}

        {/* Footer note: factors */}
        <rect x="20" y={H - 48} width={W - 40} height="32" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 28} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The factors of 24: 1, 2, 3, 4, 6, 8, 12, 24
        </text>
      </svg>
    </div>
  );
}
