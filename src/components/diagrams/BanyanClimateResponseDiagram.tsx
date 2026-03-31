export default function BanyanClimateResponseDiagram() {
  // Ring width vs temperature and rainfall correlation
  const years = [1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020];

  // Simulated ring width index (centered on 1.0)
  const ringWidth = [0.8, 1.1, 0.9, 1.3, 1.0, 0.7, 1.2, 0.85, 1.15, 0.75, 1.05, 1.25, 0.6, 1.1, 0.95];

  // Temperature anomaly (correlated)
  const tempAnomaly = [0.1, 0.3, 0.15, 0.5, 0.2, -0.1, 0.4, 0.05, 0.35, -0.05, 0.25, 0.45, -0.2, 0.3, 0.2];

  // Rainfall (correlated)
  const rainfall = [900, 1200, 1000, 1400, 1100, 750, 1300, 950, 1250, 800, 1150, 1350, 600, 1200, 1050];

  const chartL = 70;
  const chartR = 420;
  const chartW = chartR - chartL;

  function xPos(i: number): number {
    return chartL + (i / (years.length - 1)) * chartW;
  }

  // Top chart: ring width + temperature
  const topY = 70;
  const topH = 110;
  function ringY(v: number): number {
    return topY + topH - ((v - 0.5) / 1.0) * topH;
  }
  function tempY(v: number): number {
    return topY + topH - ((v + 0.3) / 0.9) * topH;
  }

  // Bottom chart: ring width + rainfall
  const botY = 230;
  const botH = 110;
  function ringY2(v: number): number {
    return botY + botH - ((v - 0.5) / 1.0) * botH;
  }
  function rainY(v: number): number {
    return botY + botH - ((v - 500) / 1100) * botH;
  }

  const ringLine1 = ringWidth.map((v, i) => `${xPos(i)},${ringY(v)}`).join(" ");
  const tempLine = tempAnomaly.map((v, i) => `${xPos(i)},${tempY(v)}`).join(" ");
  const ringLine2 = ringWidth.map((v, i) => `${xPos(i)},${ringY2(v)}`).join(" ");
  const rainLine = rainfall.map((v, i) => `${xPos(i)},${rainY(v)}`).join(" ");

  return (
    <div className="my-4">
      <svg viewBox="0 0 590 450" className="w-full max-w-lg mx-auto" role="img" aria-label="Climate reconstruction from tree rings showing ring width correlations with temperature and rainfall">
        <rect width="500" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Climate Reconstruction from Tree Rings</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Ring width tracks temperature &amp; rainfall — a record of past climate</text>

        {/* === TOP CHART: Ring width vs Temperature === */}
        <text x={chartL} y={topY - 5} className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="bold">Ring Width vs Temperature</text>

        {/* Axes */}
        <line x1={chartL} y1={topY + topH} x2={chartR} y2={topY + topH} className="stroke-slate-600" strokeWidth="1" />
        <line x1={chartL} y1={topY + topH} x2={chartL} y2={topY} className="stroke-slate-600" strokeWidth="1" />

        {/* Ring width line */}
        <polyline points={ringLine1} className="stroke-amber-400" strokeWidth="2" fill="none" />
        {ringWidth.map((v, i) => (
          <circle key={`rw1-${i}`} cx={xPos(i)} cy={ringY(v)} r="2" className="fill-amber-400" />
        ))}

        {/* Temperature line */}
        <polyline points={tempLine} className="stroke-red-400" strokeWidth="1.5" fill="none" strokeDasharray="5,3" />
        {tempAnomaly.map((v, i) => (
          <circle key={`t-${i}`} cx={xPos(i)} cy={tempY(v)} r="2" className="fill-red-400" />
        ))}

        {/* Legend top */}
        <line x1="430" y1={topY + 10} x2="455" y2={topY + 10} className="stroke-amber-400" strokeWidth="2" />
        <text x="460" y={topY + 14} className="fill-amber-400" fontSize="7">Ring width</text>
        <line x1="430" y1={topY + 25} x2="455" y2={topY + 25} className="stroke-red-400" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="460" y={topY + 29} className="fill-red-400" fontSize="7">Temperature</text>

        {/* Correlation label */}
        <rect x="430" y={topY + 40} width="60" height="18" rx="4" className="fill-green-900" />
        <text x="460" y={topY + 53} textAnchor="middle" className="fill-green-300" fontSize="7" fontWeight="bold">r = 0.82</text>

        {/* === BOTTOM CHART: Ring width vs Rainfall === */}
        <text x={chartL} y={botY - 5} className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="bold">Ring Width vs Rainfall</text>

        {/* Axes */}
        <line x1={chartL} y1={botY + botH} x2={chartR} y2={botY + botH} className="stroke-slate-600" strokeWidth="1" />
        <line x1={chartL} y1={botY + botH} x2={chartL} y2={botY} className="stroke-slate-600" strokeWidth="1" />

        {/* Ring width line */}
        <polyline points={ringLine2} className="stroke-amber-400" strokeWidth="2" fill="none" />
        {ringWidth.map((v, i) => (
          <circle key={`rw2-${i}`} cx={xPos(i)} cy={ringY2(v)} r="2" className="fill-amber-400" />
        ))}

        {/* Rainfall line */}
        <polyline points={rainLine} className="stroke-blue-400" strokeWidth="1.5" fill="none" strokeDasharray="5,3" />
        {rainfall.map((v, i) => (
          <circle key={`r-${i}`} cx={xPos(i)} cy={rainY(v)} r="2" className="fill-blue-400" />
        ))}

        {/* Legend bottom */}
        <line x1="430" y1={botY + 10} x2="455" y2={botY + 10} className="stroke-amber-400" strokeWidth="2" />
        <text x="460" y={botY + 14} className="fill-amber-400" fontSize="7">Ring width</text>
        <line x1="430" y1={botY + 25} x2="455" y2={botY + 25} className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="460" y={botY + 29} className="fill-blue-400" fontSize="7">Rainfall</text>

        {/* Correlation label */}
        <rect x="430" y={botY + 40} width="60" height="18" rx="4" className="fill-green-900" />
        <text x="460" y={botY + 53} textAnchor="middle" className="fill-green-300" fontSize="7" fontWeight="bold">r = 0.89</text>

        {/* X axis labels (shared) */}
        {[0, 4, 9, 14].map(i => (
          <text key={i} x={xPos(i)} y={botY + botH + 14} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">{years[i]}</text>
        ))}

        {/* Drought highlight */}
        <rect x={xPos(11.5)} y={topY} width={xPos(13) - xPos(11.5)} height={topH} className="fill-amber-500" opacity="0.1" />
        <rect x={xPos(11.5)} y={botY} width={xPos(13) - xPos(11.5)} height={botH} className="fill-amber-500" opacity="0.1" />
        <text x={xPos(12)} y={topY + topH + 22} textAnchor="middle" className="fill-amber-400" fontSize="7">drought</text>

        {/* Bottom summary */}
        <rect x="50" y="370" width="400" height="38" rx="8" className="fill-green-900" opacity="0.5" />
        <text x="250" y="386" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Trees are living climate recorders</text>
        <text x="250" y="400" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Ring patterns from ancient banyans reveal centuries of monsoon, drought, and temperature history</text>
      </svg>
    </div>
  );
}
