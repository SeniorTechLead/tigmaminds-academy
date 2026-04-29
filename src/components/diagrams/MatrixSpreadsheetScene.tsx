/**
 * Tara at a market stall. She tracks three items × three days of sales.
 * That table IS a matrix. Visual: realistic ledger that's also a matrix.
 *
 * Used in the Matrices section.
 */
import Tara from './people/Tara';

export default function MatrixSpreadsheetScene() {
  const W = 760, H = 380;

  // Sales table: 3 items × 3 days
  const items = ['Tea', 'Sugar', 'Milk'];
  const days = ['Mon', 'Tue', 'Wed'];
  const sales = [
    [12, 15, 9],   // Tea
    [8, 6, 11],    // Sugar
    [4, 5, 7],     // Milk
  ];

  // Cell geometry
  const cellW = 60, cellH = 36;
  const tableX = 280, tableY = 130;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A matrix is a table — Tara tracks 3 items across 3 days as a 3 by 3 matrix">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara&apos;s sales ledger
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Rows × columns of numbers — that&apos;s a matrix.
        </text>

        {/* Tara on left */}
        <Tara x={120} y={340} scale={0.9} pose="pointing" />

        {/* Day headers */}
        {days.map((d, j) => (
          <g key={d}>
            <rect x={tableX + j * cellW} y={tableY - cellH} width={cellW} height={cellH}
              fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1.2" className="dark:fill-blue-900/40" />
            <text x={tableX + j * cellW + cellW / 2} y={tableY - cellH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0c4a6e" className="dark:fill-blue-200">
              {d}
            </text>
          </g>
        ))}
        {/* Item labels (left column) */}
        {items.map((name, i) => (
          <g key={name}>
            <rect x={tableX - cellW} y={tableY + i * cellH} width={cellW} height={cellH}
              fill="#dcfce7" stroke="#15803d" strokeWidth="1.2" className="dark:fill-emerald-900/40" />
            <text x={tableX - cellW / 2} y={tableY + i * cellH + cellH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-emerald-200">
              {name}
            </text>
          </g>
        ))}
        {/* Sales values */}
        {sales.map((row, i) =>
          row.map((v, j) => (
            <g key={`${i}-${j}`}>
              <rect x={tableX + j * cellW} y={tableY + i * cellH} width={cellW} height={cellH}
                fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
              <text x={tableX + j * cellW + cellW / 2} y={tableY + i * cellH + cellH / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
                {v}
              </text>
            </g>
          ))
        )}

        {/* Matrix bracket form on the right */}
        <g transform="translate(560, 130)">
          {/* Left bracket */}
          <path d="M 8 0 L 0 0 L 0 110 L 8 110" fill="none" stroke="#475569" strokeWidth="2" />
          {/* Numbers */}
          {sales.map((row, i) =>
            row.map((v, j) => (
              <text key={`m-${i}-${j}`} x={20 + j * 26} y={28 + i * 32} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
                {v}
              </text>
            ))
          )}
          {/* Right bracket */}
          <path d="M 90 0 L 98 0 L 98 110 L 90 110" fill="none" stroke="#475569" strokeWidth="2" />
          <text x="50" y="135" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
            3 × 3 matrix
          </text>
        </g>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A matrix is just a rectangular grid of numbers — every spreadsheet is one.
        </text>
      </svg>
    </div>
  );
}
