/**
 * Natural vs synthetic dyes: a two-column trade-off comparison of source,
 * durability, and environmental impact.
 *
 * Used in the "Natural vs Synthetic — Trade-offs" section.
 */
export default function MatNaturalVsSyntheticDiagram() {
  const W = 720, H = 290;
  const rows = [
    { label: 'Source', nat: 'plants & insects', syn: 'petroleum chemistry' },
    { label: 'Colour', nat: 'softer, fades', syn: 'vivid, permanent' },
    { label: 'Binding', nat: 'needs mordants', syn: 'binds easily' },
    { label: 'Environment', nat: 'biodegradable', syn: 'can pollute water' },
  ];
  const natX = 230, synX = 470, colW = 220, rowH = 44, oy = 95;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Natural versus synthetic dyes compared across source, colour, binding, and environmental impact. Natural dyes are biodegradable but fade; synthetic dyes are vivid and permanent but can pollute.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="40" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Natural vs synthetic dyes — every choice is a trade-off</text>

        {/* column headers */}
        <rect x={natX} y="58" width={colW} height="30" rx="6" fill="#dcfce7" className="dark:fill-green-900/40" />
        <text x={natX + colW / 2} y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Natural</text>
        <rect x={synX} y="58" width={colW} height="30" rx="6" fill="#dbeafe" className="dark:fill-blue-900/40" />
        <text x={synX + colW / 2} y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Synthetic</text>

        {rows.map((r, i) => (
          <g key={i}>
            <text x="210" y={oy + i * rowH + 20} textAnchor="end" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">{r.label}</text>
            <rect x={natX} y={oy + i * rowH} width={colW} height={rowH - 8} rx="6" fill="#ffffff" stroke="#bbf7d0" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-green-900" />
            <text x={natX + colW / 2} y={oy + i * rowH + 23} textAnchor="middle" fontSize="11" fill="#0f172a" className="dark:fill-gray-100">{r.nat}</text>
            <rect x={synX} y={oy + i * rowH} width={colW} height={rowH - 8} rx="6" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-blue-900" />
            <text x={synX + colW / 2} y={oy + i * rowH + 23} textAnchor="middle" fontSize="11" fill="#0f172a" className="dark:fill-gray-100">{r.syn}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
