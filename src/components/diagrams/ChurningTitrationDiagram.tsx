export default function ChurningTitrationDiagram() {
  // Titration curve points (pH vs volume of base added)
  const points = [
    [0, 1], [5, 1.5], [10, 2], [15, 2.5], [20, 3], [22, 3.5],
    [24, 4.5], [24.5, 5.5], [25, 7], [25.5, 8.5], [26, 9.5],
    [28, 10.5], [30, 11], [35, 11.5], [40, 12], [50, 12.5],
  ];

  const chartX = 60, chartY = 30, chartW = 340, chartH = 160;
  const toX = (v: number) => chartX + (v / 50) * chartW;
  const toY = (ph: number) => chartY + chartH - (ph / 14) * chartH;

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p[0])} ${toY(p[1])}`).join(' ');

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" role="img" aria-label="Acid-base titration curve showing pH change as base is added, with sharp jump at equivalence point">
        <style>{`
          .tt-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .tt-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .tt-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="480" height="260" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="240" y="22" textAnchor="middle" className="tt-title fill-gray-700 dark:fill-gray-200">Acid-Base Titration Curve</text>

        {/* Axes */}
        <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* pH color bands */}
        <rect x={chartX} y={toY(7)} width={chartW} height={toY(0) - toY(7)} className="fill-red-200 dark:fill-red-900/20" opacity="0.3" />
        <rect x={chartX} y={toY(14)} width={chartW} height={toY(7) - toY(14)} className="fill-blue-200 dark:fill-blue-900/20" opacity="0.3" />

        {/* pH 7 line */}
        <line x1={chartX} y1={toY(7)} x2={chartX + chartW} y2={toY(7)} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />
        <text x={chartX - 5} y={toY(7) + 4} textAnchor="end" className="tt-small fill-gray-500 dark:fill-gray-400">pH 7</text>

        {/* Y axis labels */}
        {[0, 7, 14].map(ph => (
          <text key={ph} x={chartX - 8} y={toY(ph) + 3} textAnchor="end" className="tt-small fill-gray-500 dark:fill-gray-400">{ph}</text>
        ))}
        <text x="15" y={chartY + chartH / 2} textAnchor="middle" className="tt-label fill-gray-600 dark:fill-gray-300" transform={`rotate(-90, 15, ${chartY + chartH / 2})`}>pH</text>

        {/* X axis labels */}
        <text x={chartX + chartW / 2} y={chartY + chartH + 25} textAnchor="middle" className="tt-label fill-gray-600 dark:fill-gray-300">Volume of NaOH added (mL)</text>
        {[0, 10, 20, 30, 40, 50].map(v => (
          <text key={v} x={toX(v)} y={chartY + chartH + 12} textAnchor="middle" className="tt-small fill-gray-500 dark:fill-gray-400">{v}</text>
        ))}

        {/* Curve */}
        <path d={pathD} fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2.5" />

        {/* Equivalence point marker */}
        <circle cx={toX(25)} cy={toY(7)} r="4" className="fill-emerald-500" />
        <line x1={toX(25)} y1={toY(7) + 6} x2={toX(25)} y2={chartY + chartH} className="stroke-emerald-400" strokeWidth="1" strokeDasharray="3 2" />
        <text x={toX(25) + 5} y={toY(7) - 8} className="tt-small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Equivalence point</text>

        {/* Region labels */}
        <text x={chartX + 15} y={toY(1.5)} className="tt-small fill-red-500">Acidic</text>
        <text x={chartX + chartW - 30} y={toY(12)} className="tt-small fill-blue-500">Basic</text>

        <text x="240" y="248" textAnchor="middle" className="tt-small fill-gray-400 dark:fill-gray-500">The sharp jump near 25 mL is where acid is completely neutralized</text>
      </svg>
    </div>
  );
}
