export default function SeedDispersalOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Seed dispersal distance comparison chart output from the Python project"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Project Output: Seed Dispersal Distance by Mechanism
        </text>

        {/* Y axis */}
        <line x1="120" y1="60" x2="120" y2="340" stroke="#6b7280" strokeWidth="1.5" />
        <text x="30" y="200" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300" transform="rotate(-90, 30, 200)">
          Average Distance (meters)
        </text>
        {/* Y axis ticks */}
        {[0, 50, 100, 200, 500, 1000].map((val, i) => {
          const y = 340 - (i * 280) / 5;
          return (
            <g key={val}>
              <line x1="115" y1={y} x2="120" y2={y} stroke="#6b7280" strokeWidth="1" />
              <text x="110" y={y + 4} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{val}</text>
            </g>
          );
        })}

        {/* X axis */}
        <line x1="120" y1="340" x2="720" y2="340" stroke="#6b7280" strokeWidth="1.5" />

        {/* Bars */}
        {[
          { label: 'Wind\n(dandelion)', value: 800, color: '#84cc16', darkColor: '#a3e635' },
          { label: 'Wind\n(maple)', value: 120, color: '#65a30d', darkColor: '#84cc16' },
          { label: 'Animal\n(epi)', value: 300, color: '#f59e0b', darkColor: '#fbbf24' },
          { label: 'Animal\n(endo)', value: 500, color: '#ef4444', darkColor: '#f87171' },
          { label: 'Explosive', value: 25, color: '#8b5cf6', darkColor: '#a78bfa' },
          { label: 'Gravity', value: 10, color: '#6b7280', darkColor: '#9ca3af' },
          { label: 'Water', value: 950, color: '#3b82f6', darkColor: '#60a5fa' },
        ].map((bar, i) => {
          const x = 155 + i * 80;
          const barHeight = (bar.value / 1000) * 280;
          const barY = 340 - barHeight;
          return (
            <g key={i}>
              <rect x={x} y={barY} width="50" height={barHeight} rx="4" fill={bar.color} opacity="0.8" />
              <text x={x + 25} y={barY - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill={bar.color}>
                {bar.value}m
              </text>
              {bar.label.split('\n').map((line, j) => (
                <text key={j} x={x + 25} y={358 + j * 14} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        <text x="390" y="405" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Your Python program will generate charts like this from real seed data
        </text>
      </svg>
    </div>
  );
}
