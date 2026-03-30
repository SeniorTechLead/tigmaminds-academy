export default function ForestScalingDiagram() {
  return (
    <svg viewBox="0 0 680 360" className="w-full rounded-xl">
      <rect width="680" height="360" rx="16" className="fill-white dark:fill-slate-950" />
      <text x="340" y="28" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" style={{ fontSize: 16, fontWeight: 700 }}>From One Tree to 300 Acres: Scaling Reforestation</text>

      {/* Stage 1: One tree */}
      <g>
        <rect x="30" y="55" width="180" height="140" rx="10" fill="#F0FDF4" className="dark:fill-emerald-950" stroke="#86EFAC" strokeWidth="1" />
        <text x="120" y="75" textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">Year 1: One Tree</text>
        {/* Single tree */}
        <rect x="115" y="110" width="6" height="45" fill="#6B4226" />
        <ellipse cx="118" cy="100" rx="18" ry="15" fill="#22C55E" opacity={0.85} />
        <text x="120" y="172" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-700 dark:fill-slate-300">Area: ~10 m²</text>
        <text x="120" y="186" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Carbon: 5 kg/year</text>
      </g>

      {/* Arrow 1 */}
      <path d="M215,125 L240,125" stroke="#16A34A" strokeWidth="2" markerEnd="url(#arrowF)" />
      <text x="228" y="118" textAnchor="middle" style={{ fontSize: 18 }} fill="#16A34A">×365</text>

      {/* Stage 2: Grove */}
      <g>
        <rect x="250" y="55" width="180" height="140" rx="10" fill="#ECFDF5" className="dark:fill-emerald-950" stroke="#6EE7B7" strokeWidth="1" />
        <text x="340" y="75" textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">Year 5: Grove</text>
        {/* Multiple trees */}
        {[290, 310, 330, 350, 370].map((tx, i) => (
          <g key={i}>
            <rect x={tx - 2} y={115 - i * 3} width={4} height={30 + i * 3} fill="#6B4226" />
            <ellipse cx={tx} cy={108 - i * 3} rx={12} ry={10} fill={i % 2 === 0 ? '#22C55E' : '#16A34A'} opacity={0.85} />
          </g>
        ))}
        <text x="340" y="172" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-700 dark:fill-slate-300">Area: ~0.5 hectare</text>
        <text x="340" y="186" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Carbon: 2.5 t/year</text>
      </g>

      {/* Arrow 2 */}
      <path d="M435,125 L460,125" stroke="#16A34A" strokeWidth="2" markerEnd="url(#arrowF)" />
      <text x="448" y="118" textAnchor="middle" style={{ fontSize: 14 }} fill="#16A34A">×30yr</text>

      {/* Stage 3: Forest */}
      <g>
        <rect x="470" y="55" width="190" height="140" rx="10" fill="#D1FAE5" className="dark:fill-emerald-950" stroke="#34D399" strokeWidth="1.5" />
        <text x="565" y="75" textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">Year 30+: Forest</text>
        {/* Dense canopy */}
        <rect x="485" y="130" width="160" height="10" fill="#6B4226" opacity={0.3} />
        {[500, 520, 540, 560, 580, 600, 620].map((tx, i) => (
          <g key={i}>
            <rect x={tx - 2} y={105 - (i % 3) * 5} width={5} height={30 + (i % 3) * 5} fill="#5C3A1E" />
            <ellipse cx={tx} cy={98 - (i % 3) * 5} rx={13} ry={11} fill={['#22C55E', '#16A34A', '#15803D', '#166534'][i % 4]} opacity={0.9} />
          </g>
        ))}
        <text x="565" y="162" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-700 dark:fill-slate-300">Area: 300 acres</text>
        <text x="565" y="176" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} fill="#16A34A">(= 121 hectares)</text>
        <text x="565" y="190" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Carbon: 600–1,200 t/year</text>
      </g>

      {/* Jadav Payeng comparison */}
      <rect x="30" y="210" width="630" height="70" rx="10" fill="#FEF3C7" className="dark:fill-yellow-950" stroke="#FCD34D" strokeWidth="1" />
      <text x="345" y="232" textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">Jadav Payeng’s Real Numbers (Molai Forest, Majuli Island)</text>
      <text x="345" y="250" textAnchor="middle" style={{ fontSize: 11 }} className="fill-gray-700 dark:fill-slate-300">Started 1979 • 550 hectares by 2009 • Elephants, tigers, rhinos now live there</text>
      <text x="345" y="268" textAnchor="middle" style={{ fontSize: 11 }} className="fill-gray-700 dark:fill-slate-300">That’s larger than Central Park in New York City — created by one person planting one tree at a time</text>

      {/* Math box */}
      <rect x="30" y="295" width="300" height="50" rx="8" fill="#EFF6FF" className="dark:fill-blue-950" stroke="#93C5FD" strokeWidth="1" />
      <text x="180" y="315" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">The Maths</text>
      <text x="180" y="332" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-700 dark:fill-slate-300">1 tree/day × 365 days × 30 years = 10,950 trees</text>

      {/* Impact box */}
      <rect x="350" y="295" width="310" height="50" rx="8" fill="#FEF2F2" className="dark:fill-red-950" stroke="#FCA5A5" strokeWidth="1" />
      <text x="505" y="315" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">Climate Impact</text>
      <text x="505" y="332" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-700 dark:fill-slate-300">10,000 trees absorb ~220 tonnes CO₂/year = 48 cars off the road</text>

      <defs>
        <marker id="arrowF" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#16A34A" /></marker>
      </defs>
    </svg>
  );
}
