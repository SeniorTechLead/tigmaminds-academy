/**
 * The four market structures arranged on a spectrum from most competitive
 * (perfect competition) to least (monopoly), with seller count and a real
 * example for each. Light/dark aware.
 *
 * Used in the "Market Types" section of the supply-demand-economics guide.
 */
export default function MarketTypesSpectrumDiagram() {
  const W = 760, H = 300;
  const cols = [
    { t: 'Perfect Competition', sellers: 'Many sellers', ex: 'Vegetable market', color: '#16a34a', lf: '#dcfce7', dc: 'dark:fill-green-900/40 dark:stroke-green-400', tc: '#15803d' },
    { t: 'Monopolistic Competition', sellers: 'Many, differentiated', ex: 'Restaurants, weavers', color: '#0d9488', lf: '#ccfbf1', dc: 'dark:fill-teal-900/40 dark:stroke-teal-400', tc: '#0f766e' },
    { t: 'Oligopoly', sellers: 'A few large', ex: 'Telecom: Jio/Airtel/Vi', color: '#d97706', lf: '#fef3c7', dc: 'dark:fill-amber-900/40 dark:stroke-amber-400', tc: '#b45309' },
    { t: 'Monopoly', sellers: 'One seller', ex: 'Indian Railways', color: '#dc2626', lf: '#fee2e2', dc: 'dark:fill-red-900/40 dark:stroke-red-400', tc: '#b91c1c' },
  ];
  const boxW = 168, gap = 16, ox = 24, y = 95;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img"
        aria-label="A spectrum of market structures from most competitive (perfect competition, many sellers) to least competitive (monopoly, one seller), with examples for each.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">From most to least competitive</text>

        {/* spectrum arrow underneath */}
        <line x1={ox + 10} y1="78" x2={W - 24} y2="78" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#mts-a)" />
        <text x={ox + 10} y="70" fontSize="10" fontWeight="700" fill="#16a34a" className="dark:fill-green-400">more competition</text>
        <text x={W - 30} y="70" textAnchor="end" fontSize="10" fontWeight="700" fill="#dc2626" className="dark:fill-red-400">less competition</text>

        {cols.map((c, i) => {
          const x = ox + i * (boxW + gap);
          return (
            <g key={i}>
              <rect x={x} y={y} width={boxW} height="150" rx="11" fill={c.lf} stroke={c.color} strokeWidth="1.8" className={c.dc} />
              <text x={x + boxW / 2} y={y + 30} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={c.tc} className="dark:fill-gray-100">
                {c.t.split(' ').length > 1 && c.t.length > 16
                  ? <><tspan x={x + boxW / 2} dy="0">{c.t.split(' ').slice(0, -1).join(' ')}</tspan><tspan x={x + boxW / 2} dy="16">{c.t.split(' ').slice(-1)}</tspan></>
                  : c.t}
              </text>
              <line x1={x + 20} y1={y + 64} x2={x + boxW - 20} y2={y + 64} stroke={c.color} strokeWidth="1" opacity="0.4" />
              <text x={x + boxW / 2} y={y + 88} textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155" className="dark:fill-gray-200">{c.sellers}</text>
              <text x={x + boxW / 2} y={y + 120} textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">e.g.</text>
              <text x={x + boxW / 2} y={y + 135} textAnchor="middle" fontSize="10" fontStyle="italic" fill={c.tc} className="dark:fill-gray-300">{c.ex}</text>
            </g>
          );
        })}
        <defs><marker id="mts-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#94a3b8" /></marker></defs>
      </svg>
    </div>
  );
}
