/**
 * End-to-end sensor data pipeline with NumPy: load → clean (mask bad values) →
 * analyze (stats) → summarize. A four-step flow tying the guide together.
 *
 * Used in the "Real-World Example: Analyzing Sensor Data" section.
 */
export default function NumpySensorPipelineDiagram() {
  const W = 740, H = 230;
  const steps = [
    { t: 'Load', s: 'np.loadtxt(...)', fill: '#dbeafe', stroke: '#3b82f6', tc: '#1d4ed8', dc: 'dark:fill-blue-900/40 dark:stroke-blue-400' },
    { t: 'Clean', s: 'mask bad values', fill: '#fee2e2', stroke: '#dc2626', tc: '#b91c1c', dc: 'dark:fill-red-900/30 dark:stroke-red-400' },
    { t: 'Analyze', s: 'mean · std · max', fill: '#ede9fe', stroke: '#8b5cf6', tc: '#6d28d9', dc: 'dark:fill-purple-900/40 dark:stroke-purple-400' },
    { t: 'Summarize', s: 'report results', fill: '#dcfce7', stroke: '#16a34a', tc: '#15803d', dc: 'dark:fill-green-900/40 dark:stroke-green-400' },
  ];
  const boxW = 150, gap = 36, ox = 30, y = 90;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A NumPy sensor data pipeline: load the data, clean it by masking bad values, analyze with statistics, then summarize the results.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="40" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">A full pipeline, all in NumPy</text>
        {steps.map((s, i) => {
          const x = ox + i * (boxW + gap);
          return (
            <g key={i}>
              <rect x={x} y={y} width={boxW} height="72" rx="11" fill={s.fill} stroke={s.stroke} strokeWidth="1.8" className={s.dc} />
              <text x={x + boxW / 2} y={y + 32} textAnchor="middle" fontSize="13" fontWeight="700" fill={s.tc} className="dark:fill-gray-100">{s.t}</text>
              <text x={x + boxW / 2} y={y + 52} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#475569" className="dark:fill-gray-300">{s.s}</text>
              {i < steps.length - 1 && <line x1={x + boxW} y1={y + 36} x2={x + boxW + gap} y2={y + 36} stroke="#64748b" strokeWidth="2" markerEnd="url(#nsp-a)" />}
            </g>
          );
        })}
        <defs><marker id="nsp-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
