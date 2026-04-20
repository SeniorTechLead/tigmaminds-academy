import { useState } from 'react';

// ── Click a Cell to See Its Recipe ────────────────────────────
// Interactive 2x2 × 2x2 multiplication. User clicks any cell in
// the result matrix — the contributing row from A and column
// from B light up, and the dot-product calculation is shown
// step by step below.

const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];

export default function MatrixMultiplicationDiagram() {
  // selected cell in result: [row, col]
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const [row, col] = sel;

  const product = A[row][0] * B[0][col] + A[row][1] * B[1][col];
  const allResults = [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];

  const W = 540, H = 290;

  // Cell rendering helpers
  const cellSize = 44;
  const matCx = { A: 70, B: 205, R: 360 };
  const startY = 60;

  const rowHighlight = (matrix: 'A' | 'B', r: number, c: number) => {
    if (matrix === 'A') return r === row ? '#dbeafe' : 'transparent';
    if (matrix === 'B') return c === col ? '#fef3c7' : 'transparent';
    return 'transparent';
  };
  const rowHighlightDark = (matrix: 'A' | 'B', r: number, c: number) => {
    if (matrix === 'A' && r === row) return 'dark:fill-blue-900';
    if (matrix === 'B' && c === col) return 'dark:fill-amber-900';
    return 'dark:fill-transparent';
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50 dark:from-blue-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          Click Any Result Cell
        </p>
        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
          Row {row + 1} · Column {col + 1}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Interactive matrix multiplication — click result cells to see their recipe">

        {/* Labels */}
        <text x={matCx.A} y={45} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">A</text>
        <text x={matCx.B} y={45} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">B</text>
        <text x={matCx.R} y={45} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">A × B</text>

        {/* Matrix A */}
        {[0, 1].map(r => (
          [0, 1].map(c => (
            <g key={`A-${r}-${c}`}>
              <rect x={matCx.A - cellSize + c * cellSize} y={startY + r * cellSize}
                width={cellSize} height={cellSize}
                fill={rowHighlight('A', r, c)}
                className={rowHighlightDark('A', r, c)} />
              <text x={matCx.A - cellSize + c * cellSize + cellSize / 2}
                y={startY + r * cellSize + cellSize / 2 + 5}
                textAnchor="middle"
                className={r === row ? 'fill-blue-700 dark:fill-blue-300 font-bold' : 'fill-gray-700 dark:fill-gray-200'}
                fontSize="16">
                {A[r][c]}
              </text>
            </g>
          ))
        ))}
        {/* A matrix brackets */}
        <rect x={matCx.A - cellSize} y={startY} width={cellSize * 2} height={cellSize * 2}
          fill="none" stroke="#64748b" strokeWidth="1.5" rx="4" />

        <text x={135} y={startY + cellSize + 6} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="20" fontWeight="bold">×</text>

        {/* Matrix B */}
        {[0, 1].map(r => (
          [0, 1].map(c => (
            <g key={`B-${r}-${c}`}>
              <rect x={matCx.B - cellSize + c * cellSize} y={startY + r * cellSize}
                width={cellSize} height={cellSize}
                fill={rowHighlight('B', r, c)}
                className={rowHighlightDark('B', r, c)} />
              <text x={matCx.B - cellSize + c * cellSize + cellSize / 2}
                y={startY + r * cellSize + cellSize / 2 + 5}
                textAnchor="middle"
                className={c === col ? 'fill-amber-700 dark:fill-amber-300 font-bold' : 'fill-gray-700 dark:fill-gray-200'}
                fontSize="16">
                {B[r][c]}
              </text>
            </g>
          ))
        ))}
        <rect x={matCx.B - cellSize} y={startY} width={cellSize * 2} height={cellSize * 2}
          fill="none" stroke="#64748b" strokeWidth="1.5" rx="4" />

        <text x={292} y={startY + cellSize + 6} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="20" fontWeight="bold">=</text>

        {/* Result — clickable */}
        {[0, 1].map(r => (
          [0, 1].map(c => (
            <g key={`R-${r}-${c}`} onClick={() => setSel([r, c])} className="cursor-pointer">
              <rect x={matCx.R - cellSize + c * cellSize} y={startY + r * cellSize}
                width={cellSize} height={cellSize}
                fill={r === row && c === col ? '#d1fae5' : '#f8fafc'}
                className={r === row && c === col ? 'dark:fill-emerald-900' : 'dark:fill-slate-800 hover:fill-emerald-100 dark:hover:fill-emerald-950'}
                stroke={r === row && c === col ? '#10b981' : 'transparent'}
                strokeWidth="2" />
              <text x={matCx.R - cellSize + c * cellSize + cellSize / 2}
                y={startY + r * cellSize + cellSize / 2 + 5}
                textAnchor="middle"
                className={r === row && c === col ? 'fill-emerald-700 dark:fill-emerald-300 font-bold' : 'fill-gray-700 dark:fill-gray-200'}
                fontSize="16">
                {allResults[r][c]}
              </text>
            </g>
          ))
        ))}
        <rect x={matCx.R - cellSize} y={startY} width={cellSize * 2} height={cellSize * 2}
          fill="none" stroke="#64748b" strokeWidth="1.5" rx="4" />

        {/* The recipe for the selected cell */}
        <rect x={40} y={190} width={W - 80} height={70} rx="8"
          fill="#f1f5f9" className="dark:fill-slate-800" stroke="#10b981" strokeWidth="1.5" opacity="0.95" />

        <text x={W / 2} y={210} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">
          Result[{row + 1}][{col + 1}] = Row {row + 1} of A  ·  Column {col + 1} of B
        </text>

        <text x={W / 2} y={234} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100" fontSize="14" fontFamily="monospace">
          ({A[row][0]} × {B[0][col]}) + ({A[row][1]} × {B[1][col]}) = {A[row][0] * B[0][col]} + {A[row][1] * B[1][col]} = {product}
        </text>

        <text x={W / 2} y={252} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Click another cell above to see its dot product.
        </text>
      </svg>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        Every cell in the result is a <strong>dot product</strong> — one row of A with one column of B.
      </p>
    </div>
  );
}
