/**
 * Three distribution shapes as mini-histograms: normal (symmetric), right-skewed,
 * and bimodal — showing how shape reveals patterns.
 *
 * Used in the "Histograms and Distribution Shapes" section.
 */
export default function StatsHistogramShapesDiagram() {
  const W = 720, H = 280;
  const shapes = [
    { title: 'Normal', sub: 'symmetric bell', bars: [2, 4, 7, 9, 7, 4, 2], color: '#3b82f6', dc: 'dark:fill-blue-500' },
    { title: 'Right-skewed', sub: 'long tail right', bars: [9, 7, 5, 3, 2, 1, 1], color: '#16a34a', dc: 'dark:fill-green-500' },
    { title: 'Bimodal', sub: 'two peaks', bars: [3, 8, 4, 1, 4, 8, 3], color: '#8b5cf6', dc: 'dark:fill-purple-500' },
  ];
  const panelW = 210, gap = 24, ox = 24, baseY = 220, barW = 22;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three histogram shapes: a symmetric normal bell, a right-skewed distribution with a long tail, and a bimodal distribution with two peaks.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">The shape of a histogram tells a story</text>

        {shapes.map((s, i) => {
          const px = ox + i * (panelW + gap);
          return (
            <g key={i}>
              <rect x={px} y="58" width={panelW} height="200" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
              <text x={px + panelW / 2} y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" className="dark:fill-gray-100">{s.title}</text>
              {s.bars.map((h, b) => (
                <rect key={b} x={px + 22 + b * (barW + 4)} y={baseY - h * 11} width={barW} height={h * 11} rx="3" fill={s.color} className={s.dc} />
              ))}
              <line x1={px + 18} y1={baseY} x2={px + panelW - 14} y2={baseY} stroke="#94a3b8" strokeWidth="1.2" className="dark:stroke-gray-500" />
              <text x={px + panelW / 2} y="248" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">{s.sub}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
