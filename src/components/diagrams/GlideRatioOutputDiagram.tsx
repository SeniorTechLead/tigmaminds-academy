export default function GlideRatioOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Project output: bar chart of glide ratios for different paper glider designs compared to animals"
      >
        <rect width="780" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-sky-600 dark:fill-sky-400">
          Project Output: Glide Ratio Comparison
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Your paper gliders vs real animal gliders
        </text>

        {/* Chart */}
        <rect x="100" y="75" width="580" height="250" rx="6" className="fill-gray-50 dark:fill-slate-900" stroke="#94a3b8" strokeWidth="1" />

        {/* Y-axis */}
        {[0, 5, 10, 15, 20].map((v, i) => {
          const y = 305 - i * 55;
          return (
            <g key={v}>
              <line x1="100" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <text x="90" y={y + 4} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{v}</text>
            </g>
          );
        })}
        <text x="50" y="200" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90, 50, 200)">
          Glide Ratio (L/D)
        </text>

        {/* Bars */}
        {[
          { x: 160, label: 'Your\nGlider A', ratio: 3, color: '#0ea5e9' },
          { x: 250, label: 'Your\nGlider B', ratio: 5, color: '#06b6d4' },
          { x: 340, label: 'Flying\nSquirrel', ratio: 2.5, color: '#22c55e' },
          { x: 430, label: 'Sugar\nGlider', ratio: 4, color: '#84cc16' },
          { x: 520, label: 'Hang\nGlider', ratio: 15, color: '#f59e0b' },
          { x: 610, label: 'Sailplane', ratio: 40, color: '#ef4444' },
        ].map((b) => {
          const h = Math.min(b.ratio * 11, 220);
          return (
            <g key={b.x}>
              <rect x={b.x - 25} y={305 - h} width="50" height={h} rx="3" fill={b.color} opacity="0.7" />
              <text x={b.x} y={298 - h} textAnchor="middle" fontSize="10" fontWeight="700" fill={b.color}>
                {b.ratio}:1
              </text>
              {b.label.split('\n').map((line, i) => (
                <text key={i} x={b.x} y={325 + i * 13} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* Sailplane bar capped */}
        <text x="610" y="82" textAnchor="middle" fontSize="9" className="fill-red-400 dark:fill-red-500">
          (40:1, clipped)
        </text>

        <text x="390" y="375" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Generated with Python + Matplotlib from your measured launch heights and distances
        </text>
        <text x="390" y="392" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">
          Flying squirrels optimize for short, precise glides \u2014 not maximum distance
        </text>
      </svg>
    </div>
  );
}
