export default function LightEfficiencyOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Project output: bar chart comparing lumens-per-watt efficiency of different light sources"
      >
        <rect width="780" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Project Output: Light Source Efficiency Comparison
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Your measured data plotted as a bar chart
        </text>

        {/* Chart area */}
        <rect x="120" y="70" width="560" height="260" rx="6" className="fill-gray-50 dark:fill-slate-900" stroke="#94a3b8" strokeWidth="1" />

        {/* Y-axis grid */}
        {[0, 50, 100, 150].map((v, i) => {
          const y = 310 - i * 75;
          return (
            <g key={v}>
              <line x1="120" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <text x="110" y={y + 4} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{v}</text>
            </g>
          );
        })}

        <text x="60" y="210" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90, 60, 210)">
          Lumens per Watt
        </text>

        {/* Bars */}
        {[
          { x: 220, label: 'Oil lamp', value: 0.3, h: 2, color: '#f59e0b' },
          { x: 340, label: 'Incandescent', value: 15, h: 22, color: '#ef4444' },
          { x: 460, label: 'CFL', value: 65, h: 97, color: '#a855f7' },
          { x: 580, label: 'LED', value: 120, h: 180, color: '#22c55e' },
        ].map((b) => (
          <g key={b.x}>
            <rect x={b.x - 30} y={310 - b.h} width="60" height={b.h} rx="3" fill={b.color} opacity="0.75" />
            <text x={b.x} y={305 - b.h} textAnchor="middle" fontSize="11" fontWeight="700" fill={b.color}>
              {b.value}
            </text>
            <text x={b.x} y="330" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
              {b.label}
            </text>
          </g>
        ))}

        {/* Bottom note */}
        <rect x="120" y="355" width="540" height="30" rx="6" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="375" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
          Generated with Python + Matplotlib from your brightness measurements
        </text>
      </svg>
    </div>
  );
}
