/**
 * Vectorized math: a * 2 applies to every element at once — no loop. Shows the
 * source array, the per-element operation, and the result array aligned.
 *
 * Used in the "Math on Entire Arrays" / "Vectorized Math" sections.
 */
export default function NumpyVectorizedDiagram() {
  const W = 700, H = 280;
  const src = [1, 2, 3, 4];
  const res = [2, 4, 6, 8];
  const cellW = 70, ox = 120, topY = 90, botY = 190;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Vectorized math: multiplying an array by 2 applies to every element simultaneously, turning 1 2 3 4 into 2 4 6 8 with no loop.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">a * 2 — one operation hits every element</text>

        <text x="80" y={topY + 28} textAnchor="end" fontSize="12" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">a</text>
        {src.map((n, i) => (
          <g key={'s' + i}>
            <rect x={ox + i * cellW} y={topY} width={cellW - 8} height="44" rx="7" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.3" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y={topY + 29} textAnchor="middle" fontSize="14" fontWeight="600" fill="#1d4ed8" className="dark:fill-blue-300">{n}</text>
            {/* per-element op arrow */}
            <line x1={ox + i * cellW + (cellW - 8) / 2} y1={topY + 44} x2={ox + i * cellW + (cellW - 8) / 2} y2={botY} stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#nv-a)" />
            <text x={ox + i * cellW + (cellW - 8) / 2 + 8} y={topY + 70} fontSize="10" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">×2</text>
          </g>
        ))}
        <text x="80" y={botY + 28} textAnchor="end" fontSize="12" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">a*2</text>
        {res.map((n, i) => (
          <g key={'r' + i}>
            <rect x={ox + i * cellW} y={botY} width={cellW - 8} height="44" rx="7" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.3" className="dark:fill-green-900/40 dark:stroke-green-400" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y={botY + 29} textAnchor="middle" fontSize="14" fontWeight="600" fill="#15803d" className="dark:fill-green-300">{n}</text>
          </g>
        ))}
        <defs><marker id="nv-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#8b5cf6" /></marker></defs>
      </svg>
    </div>
  );
}
