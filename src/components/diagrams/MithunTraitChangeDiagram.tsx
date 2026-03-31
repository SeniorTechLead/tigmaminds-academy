export default function MithunTraitChangeDiagram() {
  const traits = [
    { name: 'Brain size', wild: 100, domestic: 75, unit: '%', color: '#ef4444' },
    { name: 'Aggression', wild: 90, domestic: 20, unit: '%', color: '#f97316' },
    { name: 'Fat storage', wild: 25, domestic: 70, unit: '%', color: '#22c55e' },
    { name: 'Body mass', wild: 85, domestic: 65, unit: '%', color: '#3b82f6' },
    { name: 'Horn spread', wild: 95, domestic: 70, unit: '%', color: '#8b5cf6' },
  ];

  const barY = (i: number) => 120 + i * 68;

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 490"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Horizontal bar chart comparing wild gaur and domesticated mithun trait values across five traits"
      >
        <rect width="780" height="490" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          How Traits Change Through Domestication
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Comparing wild gaur (ancestor) to domesticated mithun
        </text>

        {/* Legend */}
        <rect x="260" y="70" width="14" height="14" rx="3" fill="#94a3b8" />
        <text x="280" y="82" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Wild gaur</text>
        <rect x="370" y="70" width="14" height="14" rx="3" fill="#f59e0b" />
        <text x="390" y="82" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Mithun</text>

        {traits.map((t, i) => {
          const y = barY(i);
          const maxW = 420;
          const barX = 180;
          return (
            <g key={t.name}>
              {/* Trait label */}
              <text x="170" y={y + 14} textAnchor="end" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
                {t.name}
              </text>
              {/* Wild bar */}
              <rect x={barX} y={y} width={t.wild / 100 * maxW} height="18" rx="4" fill="#94a3b8" fillOpacity="0.5" />
              <text x={barX + t.wild / 100 * maxW + 6} y={y + 14} fontSize="10" className="fill-gray-500 dark:fill-slate-400">
                {t.wild}{t.unit}
              </text>
              {/* Domestic bar */}
              <rect x={barX} y={y + 24} width={t.domestic / 100 * maxW} height="18" rx="4" fill="#f59e0b" fillOpacity="0.7" />
              <text x={barX + t.domestic / 100 * maxW + 6} y={y + 38} fontSize="10" fill="#f59e0b" fontWeight="600">
                {t.domestic}{t.unit}
              </text>
              {/* Direction arrow */}
              <text x={barX + maxW + 50} y={y + 28} textAnchor="middle" fontSize="16" fill={t.domestic < t.wild ? '#ef4444' : '#22c55e'}>
                {t.domestic < t.wild ? '\u2193' : '\u2191'}
              </text>
            </g>
          );
        })}

        {/* Bottom note */}
        <rect x="120" y="455" width="540" height="28" rx="6" fill="#f59e0b" fillOpacity="0.1" />
        <text x="390" y="474" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-amber-300">
          Selecting for tameness changes many traits at once {'\u2014'} the "domestication syndrome"
        </text>
      </svg>
    </div>
  );
}
