/**
 * Standard deviation as spread: two bell curves with the same mean but different
 * std — one tight, one wide — with ±1σ bands marked.
 *
 * Used in the "Standard Deviation and Variance" section.
 */
export default function StatsStdDevDiagram() {
  const W = 700, H = 300;
  const cx = 350, baseY = 230;
  // gaussian-ish path generator
  const bell = (amp, sd) => {
    const pts = [];
    for (let x = -200; x <= 200; x += 8) {
      const y = amp * Math.exp(-(x * x) / (2 * sd * sd));
      pts.push(`${cx + x},${baseY - y}`);
    }
    return 'M' + pts.join(' L');
  };
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Two bell curves with the same mean: a tall narrow one with small standard deviation and a short wide one with large standard deviation. Standard deviation measures spread.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Standard deviation = how spread out the data is</text>

        {/* axis */}
        <line x1="90" y1={baseY} x2="610" y2={baseY} stroke="#94a3b8" strokeWidth="1.5" className="dark:stroke-gray-500" />
        {/* mean line */}
        <line x1={cx} y1="70" x2={cx} y2={baseY} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" className="dark:stroke-gray-600" />
        <text x={cx} y="62" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">mean</text>

        {/* wide curve */}
        <path d={bell(110, 95)} fill="none" stroke="#f97316" strokeWidth="2.5" />
        {/* narrow curve */}
        <path d={bell(150, 45)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

        {/* sigma bands for narrow */}
        <line x1={cx - 45} y1={baseY} x2={cx - 45} y2={baseY - 40} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" />
        <line x1={cx + 45} y1={baseY} x2={cx + 45} y2={baseY - 40} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" />

        {/* legend */}
        <rect x="430" y="80" width="14" height="14" rx="3" fill="#3b82f6" />
        <text x="450" y="92" fontSize="11" fill="#334155" className="dark:fill-gray-200">small σ — tight</text>
        <rect x="430" y="104" width="14" height="14" rx="3" fill="#f97316" />
        <text x="450" y="116" fontSize="11" fill="#334155" className="dark:fill-gray-200">large σ — spread out</text>
        <text x="350" y={baseY + 30} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">Variance is σ². Same mean, very different spread.</text>
      </svg>
    </div>
  );
}
