/**
 * Correlation: three scatter plots — positive, none, negative — each with its
 * approximate correlation coefficient.
 *
 * Used in the "Correlation and Scatter Plots" section.
 */
export default function StatsCorrelationDiagram() {
  const W = 720, H = 280;
  const panels = [
    { title: 'Positive', r: 'r ≈ +0.9', color: '#16a34a', pts: [[15, 85], [30, 70], [45, 60], [55, 50], [70, 35], [85, 20]] },
    { title: 'None', r: 'r ≈ 0', color: '#64748b', pts: [[20, 40], [40, 75], [55, 30], [70, 60], [30, 65], [80, 45]] },
    { title: 'Negative', r: 'r ≈ −0.9', color: '#dc2626', pts: [[15, 20], [30, 35], [45, 45], [55, 55], [70, 70], [85, 85]] },
  ];
  const panelW = 210, gap = 24, ox = 24, top = 70, plot = 150;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three scatter plots: a positive correlation rising together, no correlation with scattered points, and a negative correlation where one variable falls as the other rises.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="40" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Correlation: do two variables move together?</text>

        {panels.map((p, i) => {
          const px = ox + i * (panelW + gap);
          return (
            <g key={i}>
              <rect x={px} y={top} width={panelW} height={plot + 40} rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
              <text x={px + panelW / 2} y={top + 22} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" className="dark:fill-gray-100">{p.title}</text>
              {/* axes */}
              <line x1={px + 30} y1={top + 40} x2={px + 30} y2={top + plot} stroke="#94a3b8" strokeWidth="1" className="dark:stroke-gray-500" />
              <line x1={px + 30} y1={top + plot} x2={px + panelW - 20} y2={top + plot} stroke="#94a3b8" strokeWidth="1" className="dark:stroke-gray-500" />
              {/* points: x in 0..100 -> px+30..px+panelW-20 ; y in 0..100 -> top+plot..top+40 */}
              {p.pts.map((pt, k) => {
                const X = px + 30 + (pt[0] / 100) * (panelW - 50);
                const Y = top + plot - (pt[1] / 100) * (plot - 40);
                return <circle key={k} cx={X} cy={Y} r="4.5" fill={p.color} opacity="0.85" />;
              })}
              <text x={px + panelW / 2} y={top + plot + 28} textAnchor="middle" fontSize="11" fontWeight="700" fill={p.color} className="dark:fill-gray-200">{p.r}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
