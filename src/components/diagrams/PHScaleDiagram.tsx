export default function PHScaleDiagram() {
  const barX = 30, barY = 80, barW = 480, barH = 30;

  const substances: { name: string; ph: number }[] = [
    { name: 'Battery acid', ph: 0 },
    { name: 'Lemon', ph: 2 },
    { name: 'Vinegar', ph: 3 },
    { name: 'Coffee', ph: 5 },
    { name: 'Milk', ph: 6.5 },
    { name: 'Water', ph: 7 },
    { name: 'Blood', ph: 7.4 },
    { name: 'Baking soda', ph: 8.5 },
    { name: 'Soap', ph: 10 },
    { name: 'Bleach', ph: 13 },
  ];

  const phToX = (ph: number) => barX + (ph / 14) * barW;

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 200" className="w-full max-w-2xl mx-auto" role="img" aria-label="pH scale from 0 to 14 with common substances">
        {/* Title */}
        <text x="270" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">pH Scale</text>

        {/* Gradient bar */}
        <defs>
          <linearGradient id="ph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="15%" stopColor="#f97316" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="85%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect x={barX} y={barY} width={barW} height={barH} rx="6" fill="url(#ph-gradient)" />

        {/* pH number ticks */}
        {Array.from({ length: 15 }, (_, i) => {
          const x = phToX(i);
          return (
            <g key={i}>
              <line x1={x} y1={barY + barH} x2={x} y2={barY + barH + 6} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
              <text x={x} y={barY + barH + 16} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">{i}</text>
            </g>
          );
        })}

        {/* Region labels */}
        <text x={phToX(2.5)} y={barY - 6} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="bold">Acidic</text>
        <text x={phToX(7)} y={barY - 6} textAnchor="middle" className="fill-green-700 dark:fill-green-400" fontSize="11" fontWeight="bold">Neutral</text>
        <text x={phToX(11.5)} y={barY - 6} textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="11" fontWeight="bold">Basic (Alkaline)</text>

        {/* Substance markers */}
        {substances.map((s, i) => {
          const x = phToX(s.ph);
          // Alternate labels above and below to avoid overlap
          const above = i % 2 === 0;
          const textY = above ? barY - 20 : barY + barH + 36;
          const arrowY1 = above ? barY - 12 : barY + barH + 28;
          const arrowY2 = above ? barY + 2 : barY + barH - 2;
          return (
            <g key={s.name}>
              <line x1={x} y1={arrowY1} x2={x} y2={arrowY2}
                className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="1" />
              <circle cx={x} cy={arrowY2} r="2" className="fill-gray-700 dark:fill-gray-300" />
              <text x={x} y={textY} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">{s.name}</text>
              <text x={x} y={textY + 11} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">pH {s.ph}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
