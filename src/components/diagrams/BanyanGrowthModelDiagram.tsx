export default function BanyanGrowthModelDiagram() {
  // Sigmoid growth curve: diameter over time
  function sigmoid(t: number): number {
    const K = 150; // carrying capacity (max DBH cm)
    const r = 0.015; // growth rate
    const t0 = 200; // inflection point (years)
    return K / (1 + Math.exp(-r * (t - t0)));
  }

  const chartL = 80;
  const chartR = 430;
  const chartTop = 75;
  const chartBot = 300;
  const chartW = chartR - chartL;
  const chartH = chartBot - chartTop;

  const timeMax = 600; // years
  const dbhMax = 160; // cm

  function xPos(t: number): number {
    return chartL + (t / timeMax) * chartW;
  }
  function yPos(d: number): number {
    return chartBot - (d / dbhMax) * chartH;
  }

  // Generate curve points
  const points = Array.from({ length: 61 }, (_, i) => {
    const t = i * 10;
    return `${xPos(t)},${yPos(sigmoid(t))}`;
  }).join(" ");

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Sigmoid growth model showing tree diameter over time with fast growth when young and slowing with age">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Tree Growth Model</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Sigmoid curve: fast growth young, slowing with age</text>

        {/* Axes */}
        <line x1={chartL} y1={chartBot} x2={chartR + 10} y2={chartBot} className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#growthArrow)" />
        <line x1={chartL} y1={chartBot} x2={chartL} y2={chartTop - 15} className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#growthArrow)" />

        {/* X axis labels */}
        <text x={(chartL + chartR) / 2} y={chartBot + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Age (years)</text>
        {[0, 100, 200, 300, 400, 500, 600].map(t => (
          <g key={t}>
            <line x1={xPos(t)} y1={chartBot} x2={xPos(t)} y2={chartBot + 5} className="stroke-slate-500" strokeWidth="1" />
            <text x={xPos(t)} y={chartBot + 16} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">{t}</text>
          </g>
        ))}

        {/* Y axis labels */}
        <text x="30" y={(chartTop + chartBot) / 2} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" transform={`rotate(-90, 30, ${(chartTop + chartBot) / 2})`}>DBH (cm)</text>
        {[0, 50, 100, 150].map(d => (
          <g key={d}>
            <line x1={chartL - 5} y1={yPos(d)} x2={chartL} y2={yPos(d)} className="stroke-slate-500" strokeWidth="1" />
            <text x={chartL - 8} y={yPos(d) + 3} textAnchor="end" className="fill-gray-400 dark:fill-slate-500" fontSize="7">{d}</text>
            <line x1={chartL} y1={yPos(d)} x2={chartR} y2={yPos(d)} className="stroke-slate-800" strokeWidth="0.5" />
          </g>
        ))}

        {/* Carrying capacity line */}
        <line x1={chartL} y1={yPos(150)} x2={chartR} y2={yPos(150)} className="stroke-amber-500" strokeWidth="1" strokeDasharray="6,4" />
        <text x={chartR + 5} y={yPos(150) + 3} className="fill-amber-500" fontSize="8">K = 150 cm</text>
        <text x={chartR + 5} y={yPos(150) + 13} className="fill-amber-500" fontSize="7">(carrying capacity)</text>

        {/* Growth curve */}
        <polyline points={points} className="stroke-green-400" strokeWidth="2.5" fill="none" />

        {/* Phase annotations */}
        {/* Slow start */}
        <rect x={xPos(20)} y={yPos(30)} width="75" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800" opacity="0.8" />
        <text x={xPos(20) + 37} y={yPos(30) + 12} textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Slow start</text>
        <text x={xPos(20) + 37} y={yPos(30) + 23} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">establishing roots</text>

        {/* Fast growth */}
        <line x1={xPos(200)} y1={yPos(sigmoid(200))} x2={xPos(200) + 50} y2={yPos(sigmoid(200)) - 30} className="stroke-green-400" strokeWidth="1" />
        <rect x={xPos(200) + 10} y={yPos(sigmoid(200)) - 58} width="90" height="28" rx="4" className="fill-green-900" opacity="0.8" />
        <text x={xPos(200) + 55} y={yPos(sigmoid(200)) - 44} textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Fastest growth</text>
        <text x={xPos(200) + 55} y={yPos(sigmoid(200)) - 33} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">inflection point</text>

        {/* Plateau */}
        <rect x={xPos(440)} y={yPos(145)} width="70" height="28" rx="4" className="fill-amber-900" opacity="0.8" />
        <text x={xPos(440) + 35} y={yPos(145) + 12} textAnchor="middle" className="fill-amber-300" fontSize="8" fontWeight="bold">Plateau</text>
        <text x={xPos(440) + 35} y={yPos(145) + 23} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">near maximum</text>

        {/* Growth rate indicator dots */}
        <circle cx={xPos(50)} cy={yPos(sigmoid(50))} r="3" className="fill-green-400" />
        <circle cx={xPos(200)} cy={yPos(sigmoid(200))} r="4" className="fill-green-300" />
        <circle cx={xPos(400)} cy={yPos(sigmoid(400))} r="3" className="fill-amber-400" />

        {/* Equation */}
        <rect x="60" y="330" width="380" height="22" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="250" y="345" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9">D(t) = K / (1 + e^(-r(t - t₀)))  where K=150, r=0.015, t₀=200</text>

        {/* Bottom insight */}
        <text x="250" y="375" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Old banyans grow slowly but store the most carbon — every year matters</text>
        <text x="250" y="390" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">A 500-year-old tree took centuries to build its biomass — it cannot be replaced quickly</text>

        <defs>
          <marker id="growthArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-slate-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
