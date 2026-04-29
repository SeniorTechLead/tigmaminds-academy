export default function EnergyEfficiencyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Energy efficiency comparison: oil lamp, incandescent bulb, CFL, and LED showing lumens per watt"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          Light Source Efficiency: Lumens per Watt
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          How much light do you get for each watt of energy?
        </text>

        {/* Bar chart */}
        {[
          { x: 140, label: 'Oil Lamp\n(diya)', lpw: 0.3, bar: 2, color: '#f59e0b', year: '~5000 BCE' },
          { x: 290, label: 'Incandescent\nBulb', lpw: 15, bar: 60, color: '#ef4444', year: '1879' },
          { x: 440, label: 'CFL\n(compact)', lpw: 65, bar: 160, color: '#a855f7', year: '~1985' },
          { x: 590, label: 'LED', lpw: 120, bar: 260, color: '#22c55e', year: '~2010' },
        ].map((s) => (
          <g key={s.x}>
            {/* Bar */}
            <rect x={s.x - 40} y={350 - s.bar} width="80" height={s.bar} rx="4" fill={s.color} opacity="0.7" />
            {/* Value */}
            <text x={s.x} y={342 - s.bar} textAnchor="middle" fontSize="13" fontWeight="700" fill={s.color}>
              {s.lpw} lm/W
            </text>
            {/* Label */}
            {s.label.split('\n').map((line, i) => (
              <text key={i} x={s.x} y={372 + i * 15} textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
                {line}
              </text>
            ))}
            {/* Year */}
            <text x={s.x} y={405} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              {s.year}
            </text>
          </g>
        ))}

        {/* Baseline */}
        <line x1="80" y1="350" x2="700" y2="350" stroke="#94a3b8" strokeWidth="1" />

        {/* Efficiency multiplier arrow */}
        <path d="M 140 80 Q 390 60 590 80" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="390" y="72" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          400× more efficient!
        </text>

        {/* Summary box */}
        <rect x="100" y="415" width="580" height="20" rx="4" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
        <text x="390" y="430" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">
          One 10W LED = same brightness as an 100W incandescent bulb = eight oil diyas
        </text>
      </svg>
    </div>
  );
}
