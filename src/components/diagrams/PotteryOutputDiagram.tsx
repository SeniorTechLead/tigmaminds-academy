export default function PotteryOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Project output: a table comparing clay properties at different firing temperatures"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Project Output: Firing Temperature vs Clay Properties
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Your data table after testing 6 clay samples at 3 temperatures
        </text>

        {/* Table */}
        {/* Header row */}
        <rect x="80" y="75" width="620" height="30" rx="4" fill="#92400e" opacity="0.8" />
        {['Property', 'Air-dried (25\u00b0C)', 'Oven (200\u00b0C)', 'Kiln (1000\u00b0C+)'].map((h, i) => (
          <text key={i} x={80 + 20 + i * 155} y="95" fontSize="12" fontWeight="700" fill="#fff">
            {h}
          </text>
        ))}

        {/* Data rows */}
        {[
          ['Hardness (1\u20135)', '\u2605\u2606\u2606\u2606\u2606', '\u2605\u2605\u2605\u2606\u2606', '\u2605\u2605\u2605\u2605\u2605'],
          ['Water absorbed', '35\u201340%', '15\u201320%', '2\u20135%'],
          ['Color', 'Gray-brown', 'Tan', 'Red-orange'],
          ['Scratch test', 'Nail digs in easily', 'Nail leaves mark', 'Nail cannot scratch'],
          ['Shrinkage', '~3%', '~5%', '~12%'],
          ['Sound when tapped', 'Dull thud', 'Low thud', 'Clear ring'],
        ].map((row, ri) => (
          <g key={ri}>
            <rect x="80" y={107 + ri * 32} width="620" height="30" rx="2" className={ri % 2 === 0 ? 'fill-amber-50 dark:fill-amber-950' : 'fill-white dark:fill-slate-900'} opacity="0.7" />
            {row.map((cell, ci) => (
              <text
                key={ci}
                x={80 + 20 + ci * 155}
                y={127 + ri * 32}
                fontSize="11"
                fontWeight={ci === 0 ? '600' : '400'}
                className="fill-gray-700 dark:fill-slate-300"
              >
                {cell}
              </text>
            ))}
          </g>
        ))}

        {/* Chart area - simple bar chart */}
        <text x="390" y="320" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
          Water Absorption vs Temperature
        </text>
        {[
          { x: 220, h: 50, label: '25\u00b0C', pct: '~38%', color: '#fbbf24' },
          { x: 370, h: 30, label: '200\u00b0C', pct: '~18%', color: '#f97316' },
          { x: 520, h: 8, label: '1000\u00b0C', pct: '~3%', color: '#dc2626' },
        ].map((b) => (
          <g key={b.x}>
            <rect x={b.x - 30} y={390 - b.h} width="60" height={b.h} rx="3" fill={b.color} opacity="0.8" />
            <text x={b.x} y={385 - b.h} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">
              {b.pct}
            </text>
            <text x={b.x} y="405" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              {b.label}
            </text>
          </g>
        ))}
        <line x1="160" y1="390" x2="600" y2="390" stroke="#94a3b8" strokeWidth="1" />
      </svg>
    </div>
  );
}
