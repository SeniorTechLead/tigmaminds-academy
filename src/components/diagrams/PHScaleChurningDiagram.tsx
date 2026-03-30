export default function PHScaleChurningDiagram() {
  const barX = 40;
  const barY = 100;
  const barW = 480;
  const barH = 28;

  const phToX = (ph: number) => barX + (ph / 14) * barW;

  const substances: { name: string; ph: number; above: boolean }[] = [
    { name: 'Battery acid', ph: 0.5, above: true },
    { name: 'Lemon juice', ph: 2, above: false },
    { name: 'Pure water', ph: 7, above: true },
    { name: 'Baking soda', ph: 9, above: false },
    { name: 'Drain cleaner', ph: 14, above: true },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 567 280"
        className="w-full h-auto"
        role="img"
        aria-label="pH scale from 0 to 14 connecting Halahala poison and Amrit nectar to acids and bases"
      >
        <style>{`
          .ph-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .ph-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .ph-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .ph-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .ph-story { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; font-style: italic; }
        `}</style>

        {/* Background */}
        <rect width="567" height="280" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="283" y="26" textAnchor="middle" className="ph-title fill-gray-700 dark:fill-gray-200">
          pH Scale — From Halahala to Amrit
        </text>

        {/* Story labels above the bar */}
        <text x={phToX(1.5)} y="52" textAnchor="middle" className="ph-story fill-red-600 dark:fill-red-400">
          Halahala
        </text>
        <text x={phToX(1.5)} y="66" textAnchor="middle" className="ph-small fill-red-500 dark:fill-red-400">
          (deadly poison)
        </text>

        <text x={phToX(12.5)} y="52" textAnchor="middle" className="ph-story fill-blue-600 dark:fill-blue-400">
          Amrit
        </text>
        <text x={phToX(12.5)} y="66" textAnchor="middle" className="ph-small fill-blue-500 dark:fill-blue-400">
          (nectar of life)
        </text>

        {/* Gradient bar */}
        <defs>
          <linearGradient id="phc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="15%" stopColor="#f97316" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="85%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <marker id="phc-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        <rect x={barX} y={barY} width={barW} height={barH} rx="6" fill="url(#phc-gradient)" />

        {/* Region labels */}
        <text x={phToX(2.5)} y={barY - 6} textAnchor="middle"
          className="ph-bold fill-red-600 dark:fill-red-400">Acidic</text>
        <text x={phToX(7)} y={barY - 6} textAnchor="middle"
          className="ph-bold fill-green-700 dark:fill-green-400">Neutral</text>
        <text x={phToX(11.5)} y={barY - 6} textAnchor="middle"
          className="ph-bold fill-purple-600 dark:fill-purple-400">Basic (Alkaline)</text>

        {/* pH number ticks */}
        {Array.from({ length: 15 }, (_, i) => {
          const x = phToX(i);
          return (
            <g key={i}>
              <line x1={x} y1={barY + barH} x2={x} y2={barY + barH + 6}
                className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
              <text x={x} y={barY + barH + 17} textAnchor="middle"
                className="ph-small fill-gray-600 dark:fill-gray-300">
                {i}
              </text>
            </g>
          );
        })}

        {/* Substance markers */}
        {substances.map((s) => {
          const x = phToX(s.ph);
          const textY = s.above ? barY - 22 : barY + barH + 36;
          const lineY1 = s.above ? barY - 14 : barY + barH + 26;
          const lineY2 = s.above ? barY + 2 : barY + barH - 2;
          return (
            <g key={s.name}>
              <line x1={x} y1={lineY1} x2={x} y2={lineY2}
                className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
              <circle cx={x} cy={lineY2} r="2.5" className="fill-gray-600 dark:fill-gray-300" />
              <text x={x} y={textY} textAnchor="middle"
                className="ph-bold fill-gray-700 dark:fill-gray-200">
                {s.name}
              </text>
              <text x={x} y={textY + 12} textAnchor="middle"
                className="ph-small fill-gray-500 dark:fill-gray-400">
                pH {s.ph}
              </text>
            </g>
          );
        })}

        {/* Neutralisation arrow in the middle */}
        <line x1={phToX(3)} y1={barY + barH + 60} x2={phToX(6.5)} y2={barY + barH + 60}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#phc-arrow)" />
        <line x1={phToX(11)} y1={barY + barH + 60} x2={phToX(7.5)} y2={barY + barH + 60}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#phc-arrow)" />

        <text x={phToX(7)} y={barY + barH + 56} textAnchor="middle"
          className="ph-bold fill-green-600 dark:fill-green-400">
          Neutralisation
        </text>
        <text x={phToX(7)} y={barY + barH + 76} textAnchor="middle"
          className="ph-small fill-gray-500 dark:fill-gray-400">
          Acid + Base → Salt + Water
        </text>

        {/* Bottom note */}
        <text x="283" y="262" textAnchor="middle" className="ph-small fill-gray-400 dark:fill-gray-500">
          Extremes on either end are dangerous — balance lies at the centre
        </text>
      </svg>
    </div>
  );
}
