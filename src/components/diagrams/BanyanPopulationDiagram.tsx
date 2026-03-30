export default function BanyanPopulationDiagram() {
  // Exponential mortality curve: many seedlings, few old trees
  const ageClasses = [
    { age: "0-10", count: 1000, label: "Seedlings" },
    { age: "10-50", count: 200, label: "Saplings" },
    { age: "50-100", count: 50, label: "Young trees" },
    { age: "100-200", count: 15, label: "Mature" },
    { age: "200-500", count: 3, label: "Old growth" },
    { age: "500+", count: 0.5, label: "Ancient" },
  ];

  const chartLeft = 80;
  const chartBottom = 290;
  const chartTop = 70;
  const barWidth = 50;
  const maxCount = 1000;
  const chartH = chartBottom - chartTop;

  function barHeight(count: number): number {
    if (count <= 0) return 2;
    return (Math.log10(count + 1) / Math.log10(maxCount + 1)) * chartH;
  }

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 436" className="w-full max-w-lg mx-auto" role="img" aria-label="Tree population dynamics showing age structure and exponential mortality explaining why old trees are rare">
        <rect width="500" height="400" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Why Old Trees Are Rare</text>
        <text x="250" y="44" textAnchor="middle" className="fill-slate-400" fontSize="10">Age structure &amp; exponential mortality</text>

        {/* Y axis */}
        <line x1={chartLeft} y1={chartBottom} x2={chartLeft} y2={chartTop - 10} className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#popArrow)" />
        <text x="30" y={(chartTop + chartBottom) / 2} textAnchor="middle" className="fill-slate-400" fontSize="9" transform={`rotate(-90, 30, ${(chartTop + chartBottom) / 2})`}>Number of trees (log scale)</text>

        {/* Y ticks */}
        {[1, 10, 100, 1000].map((v, i) => {
          const y = chartBottom - barHeight(v);
          return (
            <g key={i}>
              <line x1={chartLeft - 5} y1={y} x2={chartLeft} y2={y} className="stroke-slate-500" strokeWidth="1" />
              <text x={chartLeft - 8} y={y + 3} textAnchor="end" className="fill-slate-400" fontSize="8">{v}</text>
              <line x1={chartLeft} y1={y} x2={chartLeft + 340} y2={y} className="stroke-slate-800" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* X axis */}
        <line x1={chartLeft} y1={chartBottom} x2={chartLeft + 350} y2={chartBottom} className="stroke-slate-500" strokeWidth="1.5" />

        {/* Bars */}
        {ageClasses.map((cls, i) => {
          const x = chartLeft + 15 + i * 57;
          const h = barHeight(cls.count);
          const greenIntensity = Math.max(0.3, 1 - i * 0.15);
          return (
            <g key={i}>
              <rect x={x} y={chartBottom - h} width={barWidth} height={h} rx="3"
                className={i < 3 ? "fill-green-600" : "fill-amber-700"}
                opacity={greenIntensity} />
              {/* Count label */}
              <text x={x + barWidth / 2} y={chartBottom - h - 5} textAnchor="middle"
                className={i < 3 ? "fill-green-300" : "fill-amber-300"} fontSize="9" fontWeight="bold">
                {cls.count >= 1 ? cls.count : "<1"}
              </text>
              {/* Age label */}
              <text x={x + barWidth / 2} y={chartBottom + 14} textAnchor="middle" className="fill-slate-400" fontSize="7">{cls.age}</text>
              <text x={x + barWidth / 2} y={chartBottom + 24} textAnchor="middle" className="fill-slate-500" fontSize="7">yrs</text>
              {/* Category */}
              <text x={x + barWidth / 2} y={chartBottom + 36} textAnchor="middle"
                className={i < 3 ? "fill-green-400" : "fill-amber-400"} fontSize="7">{cls.label}</text>
            </g>
          );
        })}

        {/* Mortality curve overlay */}
        <path d={`M ${chartLeft + 15 + 25} ${chartBottom - barHeight(1000)} Q ${chartLeft + 15 + 25 + 80} ${chartBottom - barHeight(300)} ${chartLeft + 15 + 25 + 114} ${chartBottom - barHeight(50)} Q ${chartLeft + 15 + 25 + 200} ${chartBottom - barHeight(10)} ${chartLeft + 15 + 25 + 285} ${chartBottom - barHeight(0.5)}`}
          className="stroke-amber-400" strokeWidth="2" fill="none" strokeDasharray="6,3" />

        {/* Mortality causes */}
        <rect x="30" y="340" width="440" height="50" rx="8" className="fill-slate-800" />
        <text x="250" y="358" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Causes of mortality at each stage:</text>
        <text x="250" y="373" textAnchor="middle" className="fill-slate-400" fontSize="8">
          Seedling: drought, shade, browsing | Sapling: competition | Mature: storms, disease | Old: lightning, rot
        </text>
        <text x="250" y="386" textAnchor="middle" className="fill-green-300" fontSize="8">Of 1,000 seedlings, only ~1 may survive to 500 years</text>

        <defs>
          <marker id="popArrow" markerWidth="6" markerHeight="5" refX="3" refY="0" orient="auto">
            <polygon points="0 5, 3 0, 6 5" className="fill-slate-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
