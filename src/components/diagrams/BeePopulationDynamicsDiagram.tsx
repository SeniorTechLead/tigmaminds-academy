export default function BeePopulationDynamicsDiagram() {
  // Colony population curve data points (month, population in thousands)
  const data = [
    { m: 0, pop: 10, label: "Jan" },
    { m: 1, pop: 8, label: "Feb" },
    { m: 2, pop: 12, label: "Mar" },
    { m: 3, pop: 25, label: "Apr" },
    { m: 4, pop: 40, label: "May" },
    { m: 5, pop: 55, label: "Jun" },
    { m: 6, pop: 60, label: "Jul" },
    { m: 7, pop: 55, label: "Aug" },
    { m: 8, pop: 40, label: "Sep" },
    { m: 9, pop: 25, label: "Oct" },
    { m: 10, pop: 15, label: "Nov" },
    { m: 11, pop: 10, label: "Dec" },
  ];

  const chartX = 70;
  const chartY = 60;
  const chartW = 400;
  const chartH = 200;
  const maxPop = 65;

  const toX = (m: number) => chartX + (m / 11) * chartW;
  const toY = (pop: number) => chartY + chartH - (pop / maxPop) * chartH;

  const pathD = data.map((d, i) => {
    const x = toX(d.m);
    const y = toY(d.pop);
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(" ");

  const areaD = pathD + ` L ${toX(11)},${chartY + chartH} L ${toX(0)},${chartY + chartH} Z`;

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee colony population dynamics showing spring buildup, summer peak, and winter decline">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Colony Population Dynamics</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Annual cycle of a healthy bee colony</text>

        {/* Season bands */}
        <rect x={toX(0)} y={chartY} width={toX(2) - toX(0)} height={chartH} fill="#3b82f6" opacity="0.05" />
        <rect x={toX(2)} y={chartY} width={toX(5) - toX(2)} height={chartH} fill="#22c55e" opacity="0.05" />
        <rect x={toX(5)} y={chartY} width={toX(8) - toX(5)} height={chartH} fill="#f59e0b" opacity="0.05" />
        <rect x={toX(8)} y={chartY} width={toX(11) - toX(8)} height={chartH} fill="#a855f7" opacity="0.05" />

        {/* Season labels */}
        <text x={(toX(0) + toX(2)) / 2} y={chartY + 15} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3b82f6" opacity="0.6">Winter</text>
        <text x={(toX(2) + toX(5)) / 2} y={chartY + 15} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#22c55e" opacity="0.6">Spring</text>
        <text x={(toX(5) + toX(8)) / 2} y={chartY + 15} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f59e0b" opacity="0.6">Summer</text>
        <text x={(toX(8) + toX(11)) / 2} y={chartY + 15} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#a855f7" opacity="0.6">Autumn</text>

        {/* Grid lines */}
        {[0, 15, 30, 45, 60].map((pop) => (
          <g key={pop}>
            <line x1={chartX} y1={toY(pop)} x2={chartX + chartW} y2={toY(pop)} stroke="#334155" strokeWidth="0.5" />
            <text x={chartX - 5} y={toY(pop) + 3} textAnchor="end" fontSize="8" className="fill-gray-400 dark:fill-slate-500">{pop}k</text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d) => (
          <text key={d.label} x={toX(d.m)} y={chartY + chartH + 15} textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-slate-500">{d.label}</text>
        ))}

        {/* Area fill */}
        <path d={areaD} fill="#f59e0b" opacity="0.1" />

        {/* Population curve */}
        <path d={pathD} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Data points */}
        {data.map((d) => (
          <circle key={d.m} cx={toX(d.m)} cy={toY(d.pop)} r="3.5" fill="#fbbf24" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
        ))}

        {/* Peak annotation */}
        <line x1={toX(6)} y1={toY(60) - 5} x2={toX(6)} y2={toY(60) - 25} stroke="#fbbf24" strokeWidth="1" />
        <text x={toX(6)} y={toY(60) - 30} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Peak: ~60,000</text>

        {/* Winter minimum annotation */}
        <line x1={toX(1)} y1={toY(8) + 5} x2={toX(1)} y2={toY(8) + 25} stroke="#3b82f6" strokeWidth="1" />
        <text x={toX(1)} y={toY(8) + 35} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3b82f6">Min: ~8,000</text>

        {/* Axes */}
        <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} stroke="#64748b" strokeWidth="1" />
        <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} stroke="#64748b" strokeWidth="1" />

        {/* Y-axis label */}
        <text x="25" y={chartY + chartH / 2} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" transform={`rotate(-90, 25, ${chartY + chartH / 2})`}>Population (bees)</text>

        {/* Key events — bottom section */}
        <g transform="translate(260, 320)">
          {[
            { x: -170, label: "Queen starts laying", time: "Feb-Mar", color: "#22c55e", icon: "👑" },
            { x: -50, label: "Swarming season", time: "May-Jun", color: "#f59e0b", icon: "🐝" },
            { x: 70, label: "Honey harvest", time: "Jul-Aug", color: "#fbbf24", icon: "🍯" },
            { x: 180, label: "Winter cluster", time: "Nov-Feb", color: "#3b82f6", icon: "❄️" },
          ].map((evt) => (
            <g key={evt.label}>
              <text x={evt.x} y="0" textAnchor="middle" fontSize="12">{evt.icon}</text>
              <text x={evt.x} y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill={evt.color}>{evt.label}</text>
              <text x={evt.x} y="26" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{evt.time}</text>
            </g>
          ))}
        </g>

        {/* Queen egg-laying rate annotation */}
        <g transform="translate(260, 370)">
          <rect x="-180" y="-10" width="360" height="20" rx="4" fill="#f59e0b" opacity="0.1" />
          <text x="0" y="4" textAnchor="middle" fontSize="9" fill="#fcd34d">
            Queen lays up to 2,000 eggs/day at peak &bull; Worker lifespan: 6 weeks (summer) to 6 months (winter)
          </text>
        </g>
      </svg>
    </div>
  );
}
