/**
 * Boolean indexing: temps > 30 makes a True/False mask, and temps[mask] keeps
 * only the matching elements. Three aligned rows: data, mask, result.
 *
 * Used in the "Filtering Data — Boolean Indexing" sections.
 */
export default function NumpyBooleanMaskDiagram() {
  const W = 720, H = 290;
  const temps = [28, 33, 25, 31, 22, 36];
  const mask = temps.map((t) => t > 30);
  const result = temps.filter((t) => t > 30);
  const cellW = 78, ox = 130;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Boolean indexing: the comparison temps greater than 30 makes a True/False mask, and indexing with that mask keeps only the hot days.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">A True/False mask filters the array</text>

        {/* data row */}
        <text x="120" y="86" textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">temps</text>
        {temps.map((t, i) => (
          <g key={'d' + i}>
            <rect x={ox + i * cellW} y="66" width={cellW - 8} height="38" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" className="dark:fill-gray-800 dark:stroke-gray-500" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y="90" textAnchor="middle" fontSize="13" fill="#0f172a" className="dark:fill-gray-100">{t}</text>
          </g>
        ))}

        {/* mask row */}
        <text x="120" y="150" textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">&gt; 30</text>
        {mask.map((m, i) => (
          <g key={'m' + i}>
            <rect x={ox + i * cellW} y="130" width={cellW - 8} height="38" rx="6"
              fill={m ? '#dcfce7' : '#fee2e2'} stroke={m ? '#16a34a' : '#dc2626'} strokeWidth="1.2"
              className={m ? 'dark:fill-green-900/40 dark:stroke-green-400' : 'dark:fill-red-900/30 dark:stroke-red-400'} />
            <text x={ox + i * cellW + (cellW - 8) / 2} y="154" textAnchor="middle" fontSize="11" fontWeight="700"
              fill={m ? '#15803d' : '#b91c1c'} className={m ? 'dark:fill-green-300' : 'dark:fill-red-300'}>{m ? 'True' : 'False'}</text>
          </g>
        ))}

        {/* result */}
        <text x="120" y="226" textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">kept</text>
        {result.map((t, i) => (
          <g key={'r' + i}>
            <rect x={ox + i * cellW} y="206" width={cellW - 8} height="38" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.4" className="dark:fill-green-900/40 dark:stroke-green-400" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y="230" textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d" className="dark:fill-green-300">{t}</text>
          </g>
        ))}
        <text x={ox} y="270" fontSize="11" fontFamily="monospace" fill="#475569" className="dark:fill-gray-400">temps[temps &gt; 30]  →  only the hot days</text>
      </svg>
    </div>
  );
}
