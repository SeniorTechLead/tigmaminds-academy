export default function MithunSelectionDiagram() {
  const generations = [
    { gen: 0, avg: 35, label: 'Start' },
    { gen: 1, avg: 40, label: '' },
    { gen: 2, avg: 46, label: '' },
    { gen: 3, avg: 52, label: '' },
    { gen: 4, avg: 57, label: '' },
    { gen: 5, avg: 62, label: '' },
    { gen: 6, avg: 66, label: '' },
    { gen: 7, avg: 70, label: '' },
    { gen: 8, avg: 73, label: '' },
    { gen: 9, avg: 76, label: '' },
    { gen: 10, avg: 78, label: 'After 10 gen' },
  ];

  const chartLeft = 80;
  const chartRight = 720;
  const chartTop = 90;
  const chartBottom = 340;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  const xScale = (g: number) => chartLeft + (g / 10) * chartW;
  const yScale = (v: number) => chartBottom - ((v - 20) / 70) * chartH;

  const pathD = generations
    .map((pt, i) => `${i === 0 ? 'M' : 'L'}${xScale(pt.gen)},${yScale(pt.avg)}`)
    .join(' ');

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Line chart showing how artificial selection shifts average trait value upward across 10 generations"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          How Artificial Selection Shifts Traits
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Selecting the top 30% each generation steadily increases the average
        </text>

        {/* Axes */}
        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#64748b" strokeWidth="1.5" />
        <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={chartBottom} stroke="#64748b" strokeWidth="1.5" />

        {/* Y axis labels */}
        {[20, 40, 60, 80].map(v => (
          <g key={v}>
            <line x1={chartLeft - 5} y1={yScale(v)} x2={chartLeft} y2={yScale(v)} stroke="#64748b" />
            <text x={chartLeft - 10} y={yScale(v) + 4} textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-slate-400">{v}</text>
            <line x1={chartLeft} y1={yScale(v)} x2={chartRight} y2={yScale(v)} stroke="#64748b" strokeWidth="0.3" strokeDasharray="4 4" />
          </g>
        ))}

        {/* X axis labels */}
        {[0, 2, 4, 6, 8, 10].map(g => (
          <g key={g}>
            <line x1={xScale(g)} y1={chartBottom} x2={xScale(g)} y2={chartBottom + 5} stroke="#64748b" />
            <text x={xScale(g)} y={chartBottom + 18} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">{g}</text>
          </g>
        ))}

        {/* Axis titles */}
        <text x={390} y={chartBottom + 38} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
          Generation
        </text>
        <text x={28} y={(chartTop + chartBottom) / 2} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300" transform={`rotate(-90, 28, ${(chartTop + chartBottom) / 2})`}>
          Trait Score
        </text>

        {/* Shaded area under curve */}
        <path
          d={`${pathD} L${xScale(10)},${chartBottom} L${xScale(0)},${chartBottom} Z`}
          fill="#f59e0b" fillOpacity="0.12"
        />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {generations.map(pt => (
          <circle key={pt.gen} cx={xScale(pt.gen)} cy={yScale(pt.avg)} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
        ))}

        {/* Annotations */}
        <text x={xScale(0)} y={yScale(35) - 14} textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          Score: 35
        </text>
        <text x={xScale(10)} y={yScale(78) - 14} textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          Score: 78
        </text>

        {/* Selection callout */}
        <rect x="440" y="370" width="310" height="50" rx="8" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="1" />
        <text x="595" y="390" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-800 dark:fill-amber-200">
          Only the top 30% breed each generation
        </text>
        <text x="595" y="406" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-amber-300">
          {'\u2192'} Average trait doubles in 10 generations
        </text>
      </svg>
    </div>
  );
}
