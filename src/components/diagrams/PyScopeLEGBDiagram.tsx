/**
 * The LEGB rule as nested rings: Python looks up a name Local → Enclosing →
 * Global → Built-in, innermost first.
 *
 * Used in the "Scope — Where Variables Live" section.
 */
export default function PyScopeLEGBDiagram() {
  const W = 620, H = 360;
  const cx = 250;
  const rings = [
    { r: 160, y: 185, label: 'Built-in', sub: 'print, len, range', fill: '#f1f5f9', stroke: '#94a3b8', tc: '#475569', dc: 'dark:fill-gray-800 dark:stroke-gray-600', lY: 45 },
    { r: 120, y: 195, label: 'Global', sub: 'module level', fill: '#dcfce7', stroke: '#16a34a', tc: '#15803d', dc: 'dark:fill-green-900/30 dark:stroke-green-500', lY: 95 },
    { r: 80, y: 200, label: 'Enclosing', sub: 'outer function', fill: '#dbeafe', stroke: '#3b82f6', tc: '#1d4ed8', dc: 'dark:fill-blue-900/40 dark:stroke-blue-500', lY: 140 },
    { r: 42, y: 205, label: 'Local', sub: 'current fn', fill: '#ede9fe', stroke: '#8b5cf6', tc: '#6d28d9', dc: 'dark:fill-purple-900/50 dark:stroke-purple-400', lY: 200 },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" role="img" aria-label="The LEGB rule: Python searches for a name in the Local scope first, then Enclosing, then Global, then Built-in, drawn as nested rings from inner to outer.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="32" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">LEGB: name lookup, innermost first</text>

        {rings.map((r, i) => (
          <circle key={i} cx={cx} cy={r.y} r={r.r} fill={r.fill} stroke={r.stroke} strokeWidth="2" className={r.dc} />
        ))}
        {/* labels stacked at top of each ring to avoid overlap */}
        {rings.map((r, i) => (
          <g key={'l' + i}>
            <text x={cx} y={r.lY} textAnchor="middle" fontSize="12" fontWeight="700" fill={r.tc} className="dark:fill-gray-100">{r.label}</text>
            <text x={cx} y={r.lY + 15} textAnchor="middle" fontSize="9" fill={r.tc} className="dark:fill-gray-300">{r.sub}</text>
          </g>
        ))}

        {/* search arrow */}
        <line x1="500" y1="120" x2="500" y2="260" stroke="#f97316" strokeWidth="2.5" markerEnd="url(#legb-a)" />
        <text x="512" y="180" fontSize="10" fontWeight="700" fill="#c2410c" className="dark:fill-orange-300" transform="rotate(90, 512, 180)">search outward →</text>
        <defs><marker id="legb-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#f97316" /></marker></defs>
      </svg>
    </div>
  );
}
