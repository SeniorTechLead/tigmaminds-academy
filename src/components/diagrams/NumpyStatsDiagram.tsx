/**
 * Statistics on an array: one array reduces to summary numbers (mean, max, min,
 * std). Shows the array fanning into stat outputs.
 *
 * Used in the "Statistics on Arrays" section.
 */
export default function NumpyStatsDiagram() {
  const W = 700, H = 300;
  const data = [4, 8, 15, 16, 23, 42];
  const stats = [
    { fn: '.mean()', val: '18.0', color: '#3b82f6', lf: '#dbeafe', dc: 'dark:fill-blue-900/40 dark:stroke-blue-400', tc: '#1d4ed8' },
    { fn: '.max()', val: '42', color: '#16a34a', lf: '#dcfce7', dc: 'dark:fill-green-900/40 dark:stroke-green-400', tc: '#15803d' },
    { fn: '.min()', val: '4', color: '#d97706', lf: '#fef3c7', dc: 'dark:fill-amber-900/40 dark:stroke-amber-400', tc: '#b45309' },
    { fn: '.std()', val: '12.7', color: '#8b5cf6', lf: '#ede9fe', dc: 'dark:fill-purple-900/40 dark:stroke-purple-400', tc: '#6d28d9' },
  ];
  const cellW = 64, ox = 200;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Statistics on an array: one array of numbers reduces to summary values — mean, max, min, and standard deviation.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">One array → summary numbers</text>

        {/* array */}
        {data.map((n, i) => (
          <g key={i}>
            <rect x={ox + i * cellW} y="70" width={cellW - 8} height="36" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" className="dark:fill-gray-800 dark:stroke-gray-500" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y="93" textAnchor="middle" fontSize="12" fill="#0f172a" className="dark:fill-gray-100">{n}</text>
          </g>
        ))}

        {/* stats */}
        {stats.map((s, i) => {
          const x = 80 + i * 165;
          return (
            <g key={i}>
              <line x1={ox + 150} y1="106" x2={x + 70} y2="180" stroke="#cbd5e1" strokeWidth="1.2" className="dark:stroke-gray-600" />
              <rect x={x} y="180" width="140" height="62" rx="10" fill={s.lf} stroke={s.color} strokeWidth="1.5" className={s.dc} />
              <text x={x + 70} y="205" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="700" fill={s.tc} className="dark:fill-gray-100">{s.fn}</text>
              <text x={x + 70} y="228" textAnchor="middle" fontSize="15" fontWeight="800" fill={s.tc} className="dark:fill-gray-100">{s.val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
