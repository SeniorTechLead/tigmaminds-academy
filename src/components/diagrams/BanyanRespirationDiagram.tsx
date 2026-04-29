export default function BanyanRespirationDiagram() {
  // 24-hour carbon balance: photosynthesis during day, respiration always
  // X: hours 0-24, Y: carbon flux
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Photosynthesis curve (bell shape, only during daylight 6-18)
  function photoRate(h: number): number {
    if (h < 6 || h > 18) return 0;
    const peak = 12;
    const spread = 3.5;
    return 8 * Math.exp(-((h - peak) ** 2) / (2 * spread ** 2));
  }

  // Respiration (constant ~2 units)
  const respRate = 2;

  const chartLeft = 70;
  const chartRight = 430;
  const chartTop = 70;
  const chartBottom = 280;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  function xPos(h: number): number {
    return chartLeft + (h / 24) * chartW;
  }
  function yPos(v: number): number {
    return chartBottom - (v / 10) * chartH;
  }

  const photoPoints = hours.map(h => `${xPos(h)},${yPos(photoRate(h))}`).join(" ");
  const respPoints = hours.map(h => `${xPos(h)},${yPos(respRate)}`).join(" ");

  // Net = photo - resp
  const netPoints = hours.map(h => `${xPos(h)},${yPos(photoRate(h) - respRate)}`).join(" ");

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 435" className="w-full max-w-2xl mx-auto" role="img" aria-label="24-hour carbon balance showing photosynthesis during day and respiration at all times">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Photosynthesis vs Respiration</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">24-hour carbon balance of a tree</text>

        {/* Day/night background */}
        <rect x={xPos(0)} y={chartTop} width={xPos(6) - xPos(0)} height={chartH} className="fill-gray-100 dark:fill-slate-800" opacity="0.5" />
        <rect x={xPos(6)} y={chartTop} width={xPos(18) - xPos(6)} height={chartH} className="fill-yellow-900" opacity="0.15" />
        <rect x={xPos(18)} y={chartTop} width={xPos(24) - xPos(18)} height={chartH} className="fill-gray-100 dark:fill-slate-800" opacity="0.5" />

        <text x={xPos(3)} y={chartTop + 15} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Night</text>
        <text x={xPos(12)} y={chartTop + 15} textAnchor="middle" className="fill-yellow-600" fontSize="8">Day</text>
        <text x={xPos(21)} y={chartTop + 15} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Night</text>

        {/* Axes */}
        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} className="stroke-slate-500" strokeWidth="1.5" />
        <line x1={chartLeft} y1={chartBottom} x2={chartLeft} y2={chartTop} className="stroke-slate-500" strokeWidth="1.5" />

        {/* Zero line (where net = 0, i.e. photo = resp) */}
        <line x1={chartLeft} y1={yPos(0)} x2={chartRight} y2={yPos(0)} className="stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* X axis labels */}
        {[0, 6, 12, 18, 24].map(h => (
          <g key={h}>
            <line x1={xPos(h)} y1={chartBottom} x2={xPos(h)} y2={chartBottom + 5} className="stroke-slate-500" strokeWidth="1" />
            <text x={xPos(h)} y={chartBottom + 16} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">{h}:00</text>
          </g>
        ))}
        <text x={250} y={chartBottom + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Time of day</text>

        {/* Y axis label */}
        <text x="25" y={(chartTop + chartBottom) / 2} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" transform={`rotate(-90, 25, ${(chartTop + chartBottom) / 2})`}>Carbon flux</text>

        {/* Photosynthesis curve (green) */}
        <polyline points={photoPoints} className="stroke-green-400" strokeWidth="2.5" fill="none" />

        {/* Respiration line (amber, constant) */}
        <polyline points={respPoints} className="stroke-amber-400" strokeWidth="2" fill="none" strokeDasharray="6,3" />

        {/* Fill area where net is positive (growth) */}
        <clipPath id="positiveClip">
          <rect x={xPos(6)} y={chartTop} width={xPos(18) - xPos(6)} height={chartH} />
        </clipPath>

        {/* Net carbon line */}
        <polyline points={netPoints} className="stroke-sky-400" strokeWidth="1.5" fill="none" />

        {/* Legend */}
        <rect x="340" y="55" width="145" height="70" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <line x1="350" y1="72" x2="375" y2="72" className="stroke-green-400" strokeWidth="2.5" />
        <text x="382" y="76" className="fill-green-400" fontSize="8">Photosynthesis</text>

        <line x1="350" y1="92" x2="375" y2="92" className="stroke-amber-400" strokeWidth="2" strokeDasharray="4,2" />
        <text x="382" y="96" className="fill-amber-400" fontSize="8">Respiration</text>

        <line x1="350" y1="112" x2="375" y2="112" className="stroke-sky-400" strokeWidth="1.5" />
        <text x="382" y="116" className="fill-sky-400" fontSize="8">Net carbon gain</text>

        {/* Annotations */}
        {/* Positive zone */}
        <line x1={xPos(10)} y1={yPos(5)} x2={xPos(10)} y2={yPos(7)} className="stroke-green-400" strokeWidth="1" markerEnd="url(#respArrowGreen)" />
        <text x={xPos(10)} y={yPos(7.5)} textAnchor="middle" className="fill-green-300" fontSize="7" fontWeight="bold">Net growth</text>

        {/* Night respiration */}
        <text x={xPos(3)} y={yPos(3)} textAnchor="middle" className="fill-amber-400" fontSize="7">Only respiration</text>
        <text x={xPos(3)} y={yPos(2.5)} textAnchor="middle" className="fill-amber-400" fontSize="7">= carbon loss</text>

        {/* Summary boxes */}
        <rect x="40" y="330" width="200" height="30" rx="6" className="fill-green-900" opacity="0.6" />
        <text x="140" y="349" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Day: net positive → growth</text>

        <rect x="260" y="330" width="200" height="30" rx="6" className="fill-amber-900" opacity="0.6" />
        <text x="360" y="349" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Night: respiration only → loss</text>

        <text x="250" y="385" textAnchor="middle" className="fill-green-300" fontSize="9">Over a year, photosynthesis &gt; respiration → the tree adds biomass</text>

        <defs>
          <marker id="respArrowGreen" markerWidth="6" markerHeight="5" refX="3" refY="0" orient="auto">
            <polygon points="0 5, 3 0, 6 5" className="fill-green-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
