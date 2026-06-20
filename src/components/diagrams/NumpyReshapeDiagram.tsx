/**
 * Reshaping: a flat 1-D array of 6 elements becomes a 2x3 grid via reshape,
 * same data, new shape. Shows the 1-D row mapping into a 2-D grid.
 *
 * Used in the "Reshaping and Slicing" section.
 */
export default function NumpyReshapeDiagram() {
  const W = 700, H = 280;
  const flat = [1, 2, 3, 4, 5, 6];
  const cellW = 60, ox = 90, flatY = 80;
  const gridOx = 470, gridOy = 70, gw = 60, gh = 50;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Reshape turns a flat array of six elements into a two by three grid — the same data arranged in a new shape.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">reshape(2, 3) — same data, new shape</text>

        {/* flat array */}
        <text x={ox} y={flatY - 12} fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">1-D: shape (6,)</text>
        {flat.map((n, i) => (
          <g key={i}>
            <rect x={ox + i * cellW} y={flatY} width={cellW - 8} height="40" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y={flatY + 26} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1d4ed8" className="dark:fill-blue-300">{n}</text>
          </g>
        ))}

        {/* arrow */}
        <line x1={ox + 6 * cellW - 8} y1={flatY + 20} x2={gridOx - 20} y2={gridOy + gh} stroke="#64748b" strokeWidth="2" markerEnd="url(#nr-a)" />
        <text x={(ox + 6 * cellW + gridOx) / 2 - 10} y={flatY + 5} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#475569" className="dark:fill-gray-400">.reshape(2,3)</text>

        {/* 2x3 grid */}
        <text x={gridOx} y={gridOy - 12} fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">2-D: shape (2, 3)</text>
        {[0, 1].map((r) => [0, 1, 2].map((c) => {
          const val = flat[r * 3 + c];
          return (
            <g key={`${r}-${c}`}>
              <rect x={gridOx + c * gw} y={gridOy + r * gh} width={gw - 6} height={gh - 6} rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.2" className="dark:fill-green-900/40 dark:stroke-green-400" />
              <text x={gridOx + c * gw + (gw - 6) / 2} y={gridOy + r * gh + (gh - 6) / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#15803d" className="dark:fill-green-300">{val}</text>
            </g>
          );
        }))}
        <defs><marker id="nr-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
