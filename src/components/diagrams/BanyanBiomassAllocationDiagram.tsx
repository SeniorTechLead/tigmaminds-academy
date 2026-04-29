export default function BanyanBiomassAllocationDiagram() {
  // Pie chart segments: trunk 60%, branches 20%, roots 15%, leaves 5%
  // Using SVG arc paths for a donut chart
  const cx = 200;
  const cy = 200;
  const r = 100;
  const innerR = 50;

  function arcPath(startAngle: number, endAngle: number, outerR: number, innerRadius: number): string {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  }

  const segments = [
    { label: "Trunk", pct: 60, start: 0, end: 216, color: "fill-amber-700", textColor: "fill-amber-300" },
    { label: "Branches", pct: 20, start: 216, end: 288, color: "fill-amber-600", textColor: "fill-amber-200" },
    { label: "Roots", pct: 15, start: 288, end: 342, color: "fill-amber-800", textColor: "fill-amber-400" },
    { label: "Leaves", pct: 5, start: 342, end: 360, color: "fill-green-600", textColor: "fill-green-300" },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 535 440" className="w-full max-w-2xl mx-auto" role="img" aria-label="Biomass allocation in a banyan tree: trunk 60%, branches 20%, roots 15%, leaves 5%">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Biomass Allocation</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Where does a tree put its weight?</text>

        {/* Donut chart */}
        {segments.map((seg, i) => (
          <path key={i} d={arcPath(seg.start, seg.end, r, innerR)} className={seg.color} opacity="0.85" />
        ))}

        {/* Center label */}
        <circle cx={cx} cy={cy} r={innerR - 2} className="fill-white dark:fill-slate-900" />
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="bold">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-amber-300" fontSize="9">Biomass</text>

        {/* Segment labels with leader lines */}
        {/* Trunk - 60% (large segment, label at ~108 deg from top) */}
        <line x1={cx + 85 * Math.cos(((108 - 90) * Math.PI) / 180)} y1={cy + 85 * Math.sin(((108 - 90) * Math.PI) / 180)} x2="340" y2="165" className="stroke-amber-400" strokeWidth="1" />
        <rect x="340" y="150" width="130" height="40" rx="6" className="fill-amber-900" opacity="0.7" />
        <text x="405" y="168" textAnchor="middle" className="fill-amber-300" fontSize="11" fontWeight="bold">Trunk — 60%</text>
        <text x="405" y="183" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Dense heartwood, most carbon</text>

        {/* Branches - 20% */}
        <line x1={cx + 85 * Math.cos(((252 - 90) * Math.PI) / 180)} y1={cy + 85 * Math.sin(((252 - 90) * Math.PI) / 180)} x2="340" y2="240" className="stroke-amber-300" strokeWidth="1" />
        <rect x="340" y="225" width="130" height="40" rx="6" className="fill-amber-900" opacity="0.7" />
        <text x="405" y="243" textAnchor="middle" className="fill-amber-200" fontSize="11" fontWeight="bold">Branches — 20%</text>
        <text x="405" y="258" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Structural support for canopy</text>

        {/* Roots - 15% */}
        <line x1={cx + 85 * Math.cos(((315 - 90) * Math.PI) / 180)} y1={cy + 85 * Math.sin(((315 - 90) * Math.PI) / 180)} x2="100" y2="320" className="stroke-amber-500" strokeWidth="1" />
        <rect x="40" y="310" width="130" height="40" rx="6" className="fill-amber-900" opacity="0.7" />
        <text x="105" y="328" textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="bold">Roots — 15%</text>
        <text x="105" y="343" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Anchoring + absorption</text>

        {/* Leaves - 5% */}
        <line x1={cx + 85 * Math.cos(((351 - 90) * Math.PI) / 180)} y1={cy + 85 * Math.sin(((351 - 90) * Math.PI) / 180)} x2="100" y2="120" className="stroke-green-400" strokeWidth="1" />
        <rect x="40" y="107" width="130" height="40" rx="6" className="fill-green-900" opacity="0.7" />
        <text x="105" y="125" textAnchor="middle" className="fill-green-300" fontSize="11" fontWeight="bold">Leaves — 5%</text>
        <text x="105" y="140" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Tiny mass, all the energy</text>

        {/* Bar comparison at bottom */}
        <text x="250" y="375" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Leaves are only 5% of mass but produce 100% of the tree&apos;s food</text>
        <text x="250" y="390" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">A large banyan: ~50 tonnes total — trunk alone weighs ~30 tonnes</text>
      </svg>
    </div>
  );
}
