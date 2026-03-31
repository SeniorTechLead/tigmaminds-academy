export default function ConductionBarsDiagram() {
  const materials = [
    { name: 'Copper', k: 385, color: '#f59e0b', w: 500 },
    { name: 'Iron', k: 80, color: '#ef4444', w: 104 },
    { name: 'Glass', k: 1.0, color: '#8b5cf6', w: 2 },
    { name: 'Wood', k: 0.15, color: '#22c55e', w: 1 },
    { name: 'Charcoal', k: 0.05, color: '#6b7280', w: 0.5 },
  ];

  const maxW = 420;

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Thermal conductivity comparison: copper conducts heat 7,700 times faster than charcoal">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Why Metal Burns But Wood Doesn\u2019t</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Thermal conductivity (W/m\u00B7K) \u2014 how fast heat flows through a material</text>

        {materials.map((m, i) => {
          const barW = Math.max(4, (m.w / 500) * maxW);
          const y = 80 + i * 52;
          return (
            <g key={i}>
              <text x="120" y={y + 20} textAnchor="end" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{m.name}</text>
              <rect x="140" y={y + 4} width={barW} height="26" rx="4" fill={m.color} opacity="0.4" />
              <rect x="140" y={y + 4} width={barW} height="26" rx="4" fill="none" stroke={m.color} strokeWidth="1.5" />
              <text x={148 + barW} y={y + 22} fontSize="11" fontWeight="500" fill={m.color}>{m.k} W/m\u00B7K</text>
            </g>
          );
        })}

        {/* Annotation */}
        <rect x="100" y="345" width="500" height="1" className="fill-gray-200 dark:fill-slate-700" />

        {/* Comparison callout */}
        <rect x="140" y="295" width="420" height="40" rx="6" className="fill-amber-50 dark:fill-amber-900/15" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="314" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Copper conducts heat 7,700\u00D7 faster than charcoal</text>
        <text x="350" y="328" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Same temperature, vastly different burn risk!</text>

        <text x="350" y="362" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Your nerves sense heat flux (rate of heat transfer) \u2014 not temperature itself</text>
      </svg>
    </div>
  );
}
