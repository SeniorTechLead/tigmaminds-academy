export default function StarBortleScaleDiagram() {
  const levels = [
    { bortle: 1, label: 'Pristine', stars: '~7500', sky: '#020617', starColor: '#fefce8' },
    { bortle: 2, label: 'Dark site', stars: '~5500', sky: '#0c1220', starColor: '#fef9c3' },
    { bortle: 3, label: 'Rural', stars: '~4000', sky: '#1a1c2e', starColor: '#fef08a' },
    { bortle: 4, label: 'Transition', stars: '~2500', sky: '#2a2535', starColor: '#fde68a' },
    { bortle: 5, label: 'Suburban', stars: '~1500', sky: '#3d3040', starColor: '#fcd34d' },
    { bortle: 6, label: 'Bright suburb', stars: '~500', sky: '#4a3530', starColor: '#fbbf24' },
    { bortle: 7, label: 'Sub/urban', stars: '~200', sky: '#5c3d28', starColor: '#f59e0b' },
    { bortle: 8, label: 'City', stars: '~50', sky: '#6e4520', starColor: '#d97706' },
    { bortle: 9, label: 'Inner city', stars: '~20', sky: '#825020', starColor: '#b45309' },
  ];

  const barW = 44;
  const startX = 32;

  return (
    <svg viewBox="0 0 560 348" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Bortle scale from 1 (pristine dark sky) to 9 (inner city, only 20 stars visible)">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Bortle Dark-Sky Scale</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">How many stars can you see?</text>

      {levels.map((l, i) => {
        const x = startX + i * (barW + 8);
        const numStars = Math.min(Math.round(parseInt(l.stars.replace(/[~,]/g, '')) / 500), 15);
        return (
          <g key={l.bortle}>
            {/* Sky rectangle */}
            <rect x={x} y={60} width={barW} height="140" rx="4" fill={l.sky} stroke="#334155" strokeWidth="0.5" />

            {/* Stars in sky */}
            {Array.from({ length: numStars }).map((_, si) => (
              <circle
                key={si}
                cx={x + 6 + (si % 5) * 8}
                cy={70 + Math.floor(si / 5) * 18 + (si % 3) * 6}
                r={1 + Math.random()}
                fill={l.starColor}
                opacity={0.6 + Math.random() * 0.4}
              />
            ))}

            {/* Milky Way hint for bortle 1-2 */}
            {l.bortle <= 2 && (
              <ellipse cx={x + barW / 2} cy={130} rx="6" ry="40" className="fill-gray-700 dark:fill-slate-200" opacity={0.06} transform={`rotate(15 ${x + barW / 2} 130)`} />
            )}

            {/* Bortle number */}
            <text x={x + barW / 2} y={215} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">{l.bortle}</text>

            {/* Star count */}
            <text x={x + barW / 2} y={232} textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="600">{l.stars}</text>

            {/* Label */}
            <text x={x + barW / 2} y={248} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">{l.label}</text>
          </g>
        );
      })}

      {/* Ziro Valley marker */}
      <g>
        <line x1={startX + barW / 2} y1="253" x2={startX + barW / 2} y2="268" stroke="#22c55e" strokeWidth="1.5" />
        <text x={startX + barW / 2} y="280" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">Ziro Valley</text>
      </g>

      {/* City marker */}
      <g>
        <line x1={startX + 8 * (barW + 8) + barW / 2} y1="253" x2={startX + 8 * (barW + 8) + barW / 2} y2="268" stroke="#f87171" strokeWidth="1.5" />
        <text x={startX + 8 * (barW + 8) + barW / 2} y="280" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="600">Big city</text>
      </g>

      {/* Gradient arrow */}
      <line x1="60" y1="292" x2="460" y2="292" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x="60" y="298" fill="#22c55e" fontSize="8">Dark →</text>
      <text x="430" y="298" fill="#f87171" fontSize="8">→ Bright</text>
    </svg>
  );
}
