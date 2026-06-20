/**
 * The four material families — metals, ceramics, polymers, composites — each
 * with examples and a defining property.
 *
 * Used in the "What Are Materials?" section.
 */
export default function MatMaterialClassesDiagram() {
  const W = 720, H = 280;
  const cats = [
    { t: 'Metals', ex: 'iron · copper · gold', prop: 'strong, conductive', fill: '#dbeafe', stroke: '#3b82f6', tc: '#1d4ed8', dc: 'dark:fill-blue-900/40 dark:stroke-blue-400' },
    { t: 'Ceramics', ex: 'clay · glass · cement', prop: 'hard, heat-proof', fill: '#fef3c7', stroke: '#d97706', tc: '#b45309', dc: 'dark:fill-amber-900/40 dark:stroke-amber-400' },
    { t: 'Polymers', ex: 'plastic · rubber · silk', prop: 'light, flexible', fill: '#dcfce7', stroke: '#16a34a', tc: '#15803d', dc: 'dark:fill-green-900/40 dark:stroke-green-400' },
    { t: 'Composites', ex: 'fibreglass · concrete', prop: 'best of both', fill: '#ede9fe', stroke: '#8b5cf6', tc: '#6d28d9', dc: 'dark:fill-purple-900/40 dark:stroke-purple-400' },
  ];
  const boxW = 160, gap = 16, ox = 28, y = 80;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="The four material families: metals (strong, conductive), ceramics (hard, heat-proof), polymers (light, flexible), and composites (best of both).">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="44" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Four families of materials</text>
        {cats.map((c, i) => {
          const x = ox + i * (boxW + gap);
          return (
            <g key={i}>
              <rect x={x} y={y} width={boxW} height="150" rx="12" fill={c.fill} stroke={c.stroke} strokeWidth="1.8" className={c.dc} />
              <text x={x + boxW / 2} y={y + 36} textAnchor="middle" fontSize="14" fontWeight="700" fill={c.tc} className="dark:fill-gray-100">{c.t}</text>
              <text x={x + boxW / 2} y={y + 78} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">{c.ex}</text>
              <line x1={x + 20} y1={y + 96} x2={x + boxW - 20} y2={y + 96} stroke={c.stroke} strokeWidth="1" opacity="0.5" />
              <text x={x + boxW / 2} y={y + 122} textAnchor="middle" fontSize="11" fontStyle="italic" fontWeight="600" fill={c.tc} className="dark:fill-gray-200">{c.prop}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
