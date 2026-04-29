export default function BanyanCarbonPoolDiagram() {
  const pools = [
    { label: "Above-ground\nbiomass", value: 180, unit: "t C/ha", color: "fill-green-600", textColor: "fill-green-200" },
    { label: "Below-ground\nbiomass", value: 45, unit: "t C/ha", color: "fill-amber-700", textColor: "fill-amber-200" },
    { label: "Dead wood", value: 25, unit: "t C/ha", color: "fill-amber-800", textColor: "fill-amber-300" },
    { label: "Litter", value: 10, unit: "t C/ha", color: "fill-amber-900", textColor: "fill-amber-400" },
    { label: "Soil organic\ncarbon", value: 120, unit: "t C/ha", color: "fill-amber-950", textColor: "fill-amber-300" },
  ];

  const total = pools.reduce((s, p) => s + p.value, 0);
  const chartLeft = 100;
  const chartBottom = 310;
  const barWidth = 55;
  const maxH = 220;

  // Stacked bar
  let cumY = chartBottom;

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 435" className="w-full max-w-2xl mx-auto" role="img" aria-label="Forest carbon pools showing above-ground biomass, below-ground biomass, dead wood, litter, and soil organic carbon as a stacked bar chart">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Forest Carbon Pools</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Where carbon is stored in a tropical forest ecosystem</text>

        {/* Y axis */}
        <line x1={chartLeft - 10} y1={chartBottom} x2={chartLeft - 10} y2={chartBottom - maxH - 20} className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#poolArrow)" />
        <text x="40" y={(chartBottom + chartBottom - maxH) / 2} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" transform={`rotate(-90, 40, ${(chartBottom + chartBottom - maxH) / 2})`}>tonnes C / hectare</text>

        {/* Y ticks */}
        {[0, 100, 200, 300, 380].map((v, i) => {
          const y = chartBottom - (v / total) * maxH;
          return (
            <g key={i}>
              <line x1={chartLeft - 15} y1={y} x2={chartLeft - 10} y2={y} className="stroke-slate-500" strokeWidth="1" />
              <text x={chartLeft - 18} y={y + 3} textAnchor="end" className="fill-gray-400 dark:fill-slate-500" fontSize="7">{v}</text>
            </g>
          );
        })}

        {/* Stacked bar */}
        {pools.map((pool, i) => {
          const h = (pool.value / total) * maxH;
          cumY -= h;
          const segY = cumY;
          return (
            <g key={i}>
              <rect x={chartLeft} y={segY} width={barWidth} height={h} className={pool.color} />
              {/* Value inside bar if tall enough */}
              {h > 20 && (
                <text x={chartLeft + barWidth / 2} y={segY + h / 2 + 4} textAnchor="middle" className={pool.textColor} fontSize="9" fontWeight="bold">{pool.value}</text>
              )}
              {/* Label with leader line to right */}
              <line x1={chartLeft + barWidth + 5} y1={segY + h / 2} x2={chartLeft + barWidth + 25} y2={segY + h / 2} className="stroke-slate-600" strokeWidth="1" />
              <text x={chartLeft + barWidth + 30} y={segY + h / 2 - 3} className={pool.textColor} fontSize="9" fontWeight="bold">
                {pool.label.split("\n")[0]}
              </text>
              {pool.label.includes("\n") && (
                <text x={chartLeft + barWidth + 30} y={segY + h / 2 + 9} className={pool.textColor} fontSize="9" fontWeight="bold">
                  {pool.label.split("\n")[1]}
                </text>
              )}
              <text x={chartLeft + barWidth + 30} y={segY + h / 2 + (pool.label.includes("\n") ? 21 : 9)} className="fill-gray-500 dark:fill-slate-400" fontSize="8">{pool.value} {pool.unit} ({Math.round(pool.value / total * 100)}%)</text>
            </g>
          );
        })}

        {/* Total */}
        <line x1={chartLeft} y1={chartBottom + 8} x2={chartLeft + barWidth} y2={chartBottom + 8} className="stroke-amber-400" strokeWidth="1" />
        <text x={chartLeft + barWidth / 2} y={chartBottom + 22} textAnchor="middle" className="fill-amber-400" fontSize="10" fontWeight="bold">Total: {total} t C/ha</text>

        {/* Visual diagram on right — cross-section */}
        <g transform="translate(310, 70)">
          {/* Air */}
          <text x="70" y="10" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">atmosphere</text>

          {/* Tree canopy */}
          <ellipse cx="70" cy="50" rx="50" ry="30" className="fill-green-600" opacity="0.5" />
          <text x="70" y="53" textAnchor="middle" className="fill-green-200" fontSize="7" fontWeight="bold">AGB</text>

          {/* Trunk */}
          <rect x="65" y="75" width="10" height="50" className="fill-amber-700" />

          {/* Dead wood */}
          <rect x="30" y="110" width="25" height="6" rx="3" className="fill-amber-800" transform="rotate(-15, 42, 113)" />
          <text x="25" y="108" className="fill-amber-400" fontSize="6">dead wood</text>

          {/* Ground line */}
          <line x1="10" y1="125" x2="130" y2="125" className="stroke-amber-600" strokeWidth="1" />

          {/* Litter */}
          <rect x="20" y="125" width="100" height="8" rx="2" className="fill-amber-900" opacity="0.6" />
          <text x="130" y="132" className="fill-amber-400" fontSize="6">litter</text>

          {/* Below-ground */}
          <path d="M 65,125 Q 40,145 20,165" className="stroke-amber-700" strokeWidth="2" fill="none" />
          <path d="M 75,125 Q 100,145 120,165" className="stroke-amber-700" strokeWidth="2" fill="none" />
          <text x="70" y="150" textAnchor="middle" className="fill-amber-300" fontSize="7" fontWeight="bold">BGB</text>

          {/* Soil */}
          <rect x="10" y="160" width="120" height="50" rx="4" className="fill-amber-950" opacity="0.5" />
          <text x="70" y="185" textAnchor="middle" className="fill-amber-300" fontSize="7" fontWeight="bold">Soil organic C</text>
          <text x="70" y="198" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="6">largest hidden pool</text>
        </g>

        {/* Key insight */}
        <rect x="60" y="355" width="380" height="35" rx="8" className="fill-green-900" opacity="0.5" />
        <text x="250" y="372" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Soil holds ~32% of forest carbon — often overlooked</text>
        <text x="250" y="385" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Protecting old forests means protecting both trees AND soil carbon</text>

        <defs>
          <marker id="poolArrow" markerWidth="6" markerHeight="5" refX="3" refY="0" orient="auto">
            <polygon points="0 5, 3 0, 6 5" className="fill-gray-400 dark:fill-slate-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
